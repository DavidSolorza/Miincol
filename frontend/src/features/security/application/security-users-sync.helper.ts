import type { SystemRoleId } from '../domain/security.types';
import type { CreateSystemUserDto } from '../domain/security-users.types';
import type { OutboxQueueService } from '../../../core/offline/application/outbox-queue.service';
import { httpClient } from '../../../core/http/httpClient';

export function mapSystemRoleToBackend(role: SystemRoleId): string {
  switch (role) {
    case 'national_director':
      return 'ROLE_NACIONAL';
    case 'director_general':
      return 'ROLE_DIRECTOR_GENERAL';
    case 'team_leader':
      return 'ROLE_LIDER';
    case 'team_member':
    default:
      return 'ROLE_USUARIO';
  }
}

export function mapBackendRoleToSystem(role: string): SystemRoleId {
  switch (role) {
    case 'ROLE_NACIONAL':
      return 'national_director';
    case 'ROLE_DIRECTOR_GENERAL':
      return 'director_general';
    case 'ROLE_LIDER':
      return 'team_leader';
    case 'ROLE_USUARIO':
    default:
      return 'team_member';
  }
}

export async function syncUserCreateToBackend(dto: CreateSystemUserDto): Promise<string | null> {
  const teamSlug = (dto.teamId || 'misincol').replace(/^team-/, '').toLowerCase();
  const payload = {
    email: dto.email.trim().toLowerCase(),
    fullName: dto.fullName.trim(),
    password: `${teamSlug}2026`,
    role: mapSystemRoleToBackend(dto.role),
    teamId: dto.teamId || undefined,
  };

  try {
    const res = await httpClient.post<{ id?: string }>('/users', payload);
    return res?.id || null;
  } catch (err: any) {
    if (err?.status === 409) {
      console.warn(`El usuario ${dto.email} ya existía en el backend.`);
    } else {
      console.error('Error al sincronizar creación de usuario en el servidor:', err);
    }
    return null;
  }
}

export async function syncUserRoleToBackend(userId: string, newRole: SystemRoleId): Promise<boolean> {
  try {
    await httpClient.patch(`/users/${userId}/role`, {
      role: mapSystemRoleToBackend(newRole),
    });
    return true;
  } catch (err) {
    console.error(`Error al actualizar rol de ${userId} en el backend:`, err);
    return false;
  }
}

export async function syncUserUpdateToBackend(
  user: { id: string; role?: SystemRoleId },
  updates: { role?: SystemRoleId },
  allUsers: any[],
  outbox?: OutboxQueueService
): Promise<boolean> {
  if (updates.role) {
    syncUserRoleToBackend(user.id, updates.role).catch(() => {});
  }
  const payload = { users: allUsers };
  if (outbox) {
    outbox.enqueue({ entityType: 'user', entityId: user.id, action: 'UPDATE', endpoint: '/security/users/sync', method: 'POST', payload })
      .then((m) => {
        httpClient.post('/security/users/sync', payload).then(() => outbox.markSuccess(m.id)).catch(() => {});
      }).catch(() => {});
  } else {
    httpClient.post('/security/users/sync', payload).catch(() => {});
  }
  return true;
}
