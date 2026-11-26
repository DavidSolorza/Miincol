import { Injectable, signal, inject } from '@angular/core';
import type { SystemRoleId } from '../domain/security.types';
import type { SystemUser, CreateSystemUserDto } from '../domain/security-users.types';
import type { TeamSupervisionSummary, CreateTeamDto } from '../../admin/domain/admin.types';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { INITIAL_SYSTEM_USERS } from './security-users.helpers';
import { resolveTeamUsersToProvision } from './security-users-provision.helper';
import { mapBackendRoleToSystem, syncUserCreateToBackend, syncNewUsersToBackend, syncUserRoleToBackend, syncUserUpdateToBackend } from './security-users-sync.helper';
import { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import { httpClient } from '../../../core/http/httpClient';
import { serviceBus } from '../../../core/bus';

const STORAGE_KEY = 'misincol_system_users_v1';
const ROLE_NAMES: Record<SystemRoleId, string> = {
  national_director: 'Coordinador de equipos', director_general: 'Director general',
  team_leader: 'Líder equipo', team_member: 'Usuario equipo',
};

@Injectable({ providedIn: 'root' })
export class SecurityUsersService {
  private readonly toastSvc = inject(ToastService);
  private readonly outbox = inject(OutboxQueueService, { optional: true });
  readonly users = signal<SystemUser[]>(this.loadUsers());
  readonly isSaving = signal<boolean>(false);

  constructor() {
    this.syncFromBackend();
  }

  private async syncFromBackend(): Promise<void> {
    try {
      const res = await httpClient.get<any[]>('/users');
      if (Array.isArray(res) && res.length > 0) {
        const pending = this.outbox ? await this.outbox.getPendingEntityIds('user') : new Set<string>();
        const remote: SystemUser[] = res.map((u: any) => ({
          id: u.id || `usr-${Date.now()}`, fullName: u.fullName || u.name || 'Usuario', email: u.email?.trim().toLowerCase(),
          role: mapBackendRoleToSystem(u.role), teamId: u.teamId || undefined, teamName: u.teamName || undefined,
          territory: u.territory || (u.role === 'ROLE_NACIONAL' ? 'Nacional • Colombia' : ''), phone: u.phone || '',
        }));
        const current = this.users();
        const merged = remote.map((r) => {
          const loc = current.find((l) => l.id === r.id || l.email === r.email);
          if (loc && (pending.has(loc.id) || pending.has(r.id))) return loc;
          return loc ? { ...loc, ...r, role: loc.role || r.role } : r;
        });
        current.forEach((loc) => { if (!merged.some((r) => r.email === loc.email)) merged.push(loc); });
        this.persist(merged);
      }
    } catch { /* Usar respaldo de localStorage */ }
  }

  private loadUsers(): SystemUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list: SystemUser[] = stored ? JSON.parse(stored) : INITIAL_SYSTEM_USERS;
      const seen = new Set<string>();
      const deduped: SystemUser[] = [];
      list.forEach((u) => {
        const key = u.email ? u.email.trim().toLowerCase() : u.id;
        if (!seen.has(key)) {
          seen.add(key);
          const isHugo = (u.teamId === 'team-pastos' || u.fullName.toLowerCase().includes('hugo')) && u.role === 'team_leader';
          deduped.push({ ...u, role: isHugo ? ('national_director' as const) : u.role });
        }
      });
      return deduped;
    } catch { return INITIAL_SYSTEM_USERS; }
  }

  private persist(users: SystemUser[]): void {
    this.users.set(users);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch { /* ignore */ }
  }

  createUser(dto: CreateSystemUserDto): SystemUser {
    const newUser: SystemUser = {
      id: 'usr-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      fullName: dto.fullName.trim(), email: dto.email.trim().toLowerCase(),
      role: dto.role, teamId: dto.teamId, teamName: dto.teamName,
      territory: dto.territory || '', phone: dto.phone || '',
    };
    this.persist([newUser, ...this.users()]);
    this.toastSvc.toast.success(`Colaborador ${newUser.fullName} registrado`, 'Usuario Creado');
    syncUserCreateToBackend(dto).then((backendId) => {
      if (backendId) {
        this.users.update((curr) => curr.map((u) => (u.email === newUser.email ? { ...u, id: backendId } : u)));
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users())); } catch { /* ignore */ }
      }
    });
    return newUser;
  }

  updateUser(userId: string, updates: Partial<SystemUser>): SystemUser | undefined {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return undefined;
    const merged: SystemUser = { ...target, ...updates };
    const updatedUsers = prev.map((u) => (u.id === userId ? merged : u));
    this.persist(updatedUsers);
    this.toastSvc.toast.success(`Datos de ${merged.fullName} actualizados`, 'Colaborador Editado');
    syncUserUpdateToBackend(merged, updates, updatedUsers, this.outbox || undefined);
    return merged;
  }

  deleteUser(userId: string): void {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return;
    this.persist(prev.filter((u) => u.id !== userId));
    this.toastSvc.toast.info(`Colaborador ${target.fullName} eliminado`, 'Usuario Removido');
  }

  ensureTeamLeaderAndMembers(team: TeamSupervisionSummary, dto?: CreateTeamDto): void {
    const prev = new Set(this.users().map((u) => u.email.toLowerCase()));
    const updated = resolveTeamUsersToProvision(team, this.users(), dto);
    this.persist(updated);
    syncNewUsersToBackend(updated.filter((u) => !prev.has(u.email.toLowerCase())));
  }

  updateUserRole(userId: string, newRole: SystemRoleId): void {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return;
    const roleName = ROLE_NAMES[newRole] || newRole;
    this.persist(prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    this.toastSvc.toast.success(`Rol de ${target.fullName} establecido en ${roleName}`, 'Seguridad');
    syncUserRoleToBackend(userId, newRole).catch(() => {});
    serviceBus.publish('audit:log', {
      actionType: 'role_assigned', userName: target.fullName, userEmail: target.email,
      teamId: target.teamId, teamName: target.teamName,
      detail: `El rol de ${target.fullName} ha sido establecido en "${roleName}" por la Coordinación Nacional.`,
    });
  }

  async saveUsersToBackend(): Promise<boolean> {
    this.isSaving.set(true);
    try {
      this.persist(this.users());
      await httpClient.post('/security/users/sync', { users: this.users() });
      this.toastSvc.toast.success('Usuarios y roles sincronizados en el servidor', 'Seguridad');
      return true;
    } catch { return false; } finally { this.isSaving.set(false); }
  }

  resetUsers(): void {
    this.persist(INITIAL_SYSTEM_USERS);
    this.toastSvc.toast.info('Listado restablecido a valores predeterminados', 'Seguridad');
  }
}
