import { Injectable, signal, inject } from '@angular/core';
import type { SystemRoleId } from '../domain/security.types';
import type { SystemUser, CreateSystemUserDto } from '../domain/security-users.types';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { INITIAL_SYSTEM_USERS } from './security-users.helpers';

const STORAGE_KEY = 'misincol_system_users_v1';

@Injectable({ providedIn: 'root' })
export class SecurityUsersService {
  private readonly toastSvc = inject(ToastService);
  readonly users = signal<SystemUser[]>(this.loadUsers());

  private loadUsers(): SystemUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SYSTEM_USERS;
    } catch {
      return INITIAL_SYSTEM_USERS;
    }
  }

  private persist(users: SystemUser[]): void {
    this.users.set(users);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch { /* ignore */ }
  }

  createUser(dto: CreateSystemUserDto): SystemUser {
    const newUser: SystemUser = {
      id: 'usr-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role,
      teamId: dto.teamId,
      teamName: dto.teamName,
      territory: dto.territory || '',
      phone: dto.phone || '',
    };
    this.persist([newUser, ...this.users()]);
    this.toastSvc.toast.success(`Colaborador ${newUser.fullName} registrado con éxito`, 'Usuario Creado');
    return newUser;
  }

  updateUser(userId: string, updates: Partial<SystemUser>): SystemUser | undefined {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return undefined;
    const merged: SystemUser = { ...target, ...updates };
    this.persist(prev.map((u) => (u.id === userId ? merged : u)));
    this.toastSvc.toast.success(`Datos de ${merged.fullName} actualizados`, 'Colaborador Editado');
    return merged;
  }

  deleteUser(userId: string): void {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return;
    this.persist(prev.filter((u) => u.id !== userId));
    this.toastSvc.toast.info(`Colaborador ${target.fullName} eliminado`, 'Usuario Removido');
  }

  ensureTeamLeaderAndMembers(team: TeamSupervisionSummary): void {
    const current = this.users();
    const toAdd: SystemUser[] = [];
    const leaderExists = current.some((u) => u.fullName.toLowerCase() === team.leader.toLowerCase() || (u.teamId === team.id && u.role === 'team_leader'));

    if (!leaderExists && team.leader) {
      toAdd.push({
        id: 'usr-' + Date.now() + '-ldr',
        fullName: team.leader,
        email: team.leader.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@misincol.org',
        role: 'team_leader',
        teamId: team.id,
        teamName: team.name,
        territory: team.department ? `${team.department} • ${team.region}` : team.region,
        phone: team.leaderPhone || '',
      });
    }

    if (team.members && team.members.length > 0) {
      team.members.forEach((memName, idx) => {
        if (!memName || memName.toLowerCase() === team.leader.toLowerCase()) return;
        const exists = current.some((u) => u.fullName.toLowerCase() === memName.toLowerCase());
        if (!exists && !toAdd.some((u) => u.fullName.toLowerCase() === memName.toLowerCase())) {
          toAdd.push({
            id: 'usr-' + Date.now() + '-m' + idx,
            fullName: memName,
            email: memName.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@misincol.org',
            role: 'team_member',
            teamId: team.id,
            teamName: team.name,
            territory: team.department ? `${team.department} • ${team.region}` : team.region,
          });
        }
      });
    }

    if (toAdd.length > 0) this.persist([...toAdd, ...current]);
  }

  updateUserRole(userId: string, newRole: SystemRoleId): void {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return;
    const roleName = newRole === 'national_director' ? 'Director nacional' : newRole === 'team_leader' ? 'Líder equipo' : 'Usuario equipo';
    this.persist(prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    this.toastSvc.toast.success(`Rol de ${target.fullName} cambiado a ${roleName}`, 'Seguridad Actualizada');
  }

  resetUsers(): void {
    this.persist(INITIAL_SYSTEM_USERS);
    this.toastSvc.toast.info('Listado de usuarios restablecido a valores predeterminados', 'Seguridad');
  }
}
