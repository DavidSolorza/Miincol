import { Injectable, signal, inject } from '@angular/core';
import type { SystemRoleId } from '../domain/security.types';
import type { SystemUser } from '../domain/security-users.types';
import { ToastService } from '../../../shared/components/toast/toast.service';

const STORAGE_KEY = 'misincol_system_users_v1';

const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    fullName: 'Coordinador de Equipos',
    email: 'director@misincol.org',
    role: 'national_director',
    teamName: 'Coordinación Nacional',
    territory: 'Sede Central Bogotá',
    phone: '+57 310 000 0001',
  },
  {
    id: 'usr-2',
    fullName: 'Pr. Marcos Chocué',
    email: 'marcos.chocue@misincol.org',
    role: 'team_leader',
    teamId: 'team-nasa',
    teamName: 'Misión Nasa - Tierradentro',
    territory: 'Cauca • Tierradentro',
    phone: '+57 300 000 0000',
  },
  {
    id: 'usr-3',
    fullName: 'Aída Secue',
    email: 'aida.secue@misincol.org',
    role: 'team_member',
    teamId: 'team-nasa',
    teamName: 'Misión Nasa - Tierradentro',
    territory: 'Cauca • Tierradentro',
    phone: '+57 311 450 1111',
  },
  {
    id: 'usr-4',
    fullName: 'Santiago Ramos',
    email: 'santiago.ramos@misincol.org',
    role: 'team_member',
    teamId: 'team-nasa',
    teamName: 'Misión Nasa - Tierradentro',
    territory: 'Cauca • Tierradentro',
    phone: '+57 312 450 1222',
  },
  {
    id: 'usr-5',
    fullName: 'Pr. David Morales',
    email: 'david.morales@misincol.org',
    role: 'team_leader',
    teamId: 'team-wayuu',
    teamName: 'Misión Wayúu - Alta Guajira',
    territory: 'La Guajira • Uribia',
    phone: '+57 310 450 2000',
  },
  {
    id: 'usr-6',
    fullName: 'Pr. Camilo Canticus',
    email: 'camilo.canticus@misincol.org',
    role: 'team_leader',
    teamId: 'team-pastos',
    teamName: 'Misión Pastos - Nariño',
    territory: 'Nariño • Cumbal',
    phone: '+57 315 450 3000',
  },
  {
    id: 'usr-7',
    fullName: 'Hno. Jairo Guanga',
    email: 'jairo.guanga@misincol.org',
    role: 'team_member',
    teamId: 'team-pastos',
    teamName: 'Misión Pastos - Nariño',
    territory: 'Nariño • Cumbal',
    phone: '+57 315 450 3001',
  },
  {
    id: 'usr-8',
    fullName: 'Pr. Elkin Ismare',
    email: 'elkin.ismare@misincol.org',
    role: 'team_leader',
    teamId: 'team-embera',
    teamName: 'Misión Emberá - Alto San Juan',
    territory: 'Chocó • Tadó',
    phone: '+57 320 450 4000',
  },
  {
    id: 'usr-9',
    fullName: 'Pr. José Izquierdo',
    email: 'jose.izquierdo@misincol.org',
    role: 'team_leader',
    teamId: 'team-arhuaco',
    teamName: 'Misión Arhuaco - Sierra Nevada',
    territory: 'Cesar • Nabusímake',
    phone: '+57 318 450 5000',
  },
];

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

  updateUserRole(userId: string, newRole: SystemRoleId): void {
    const prev = this.users();
    const target = prev.find((u) => u.id === userId);
    if (!target) return;

    const roleName = newRole === 'national_director' ? 'Director nacional' : newRole === 'team_leader' ? 'Líder equipo' : 'Usuario equipo';
    const updated = prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    this.persist(updated);
    this.toastSvc.toast.success(`Rol de ${target.fullName} cambiado a ${roleName}`, 'Seguridad Actualizada');
  }

  resetUsers(): void {
    this.persist(INITIAL_SYSTEM_USERS);
    this.toastSvc.toast.info('Listado de usuarios restablecido a valores predeterminados', 'Seguridad');
  }
}
