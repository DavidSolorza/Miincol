import { Injectable, signal, computed, inject } from '@angular/core';
import type { InAppNotification, EmitNotificationPayload } from '../domain/notification.types';
import { httpClient } from '../../../core/http/httpClient';
import { serviceBus } from '../../../core/bus';
import { ToastService } from '../../../shared/components/toast/toast.service';

const INITIAL_FALLBACK: InAppNotification[] = [
  {
    id: 'init-sec-1',
    category: 'SECURITY',
    severity: 'INFO',
    title: 'Gobernanza RBAC Activa',
    message: 'Sistema de seguridad institucional con salvaguardas activas.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'init-agenda-2',
    category: 'NOTES_AGENDA',
    severity: 'SUCCESS',
    title: 'Agenda Ministerial Habilitada',
    message: 'Módulo de notas y compromisos disponible para equipos.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly toastSvc = inject(ToastService, { optional: true });
  readonly notifications = signal<InAppNotification[]>(INITIAL_FALLBACK);
  readonly isOpen = signal<boolean>(false);
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.isRead).length);

  constructor() {
    this.fetchNotifications();
    this.subscribeToSystemEvents();
  }

  async fetchNotifications(email?: string, teamId?: string): Promise<void> {
    try {
      const q = new URLSearchParams();
      if (email) q.append('email', email);
      if (teamId) q.append('teamId', teamId);
      const url = `/notifications${q.toString() ? '?' + q.toString() : ''}`;
      const res = await httpClient.get<{ list: InAppNotification[]; unreadCount: number }>(url);
      if (res?.list && Array.isArray(res.list)) {
        this.notifications.set(res.list);
      }
    } catch {
      // Usar respaldo en memoria
    }
  }

  async markAsRead(id: string): Promise<void> {
    this.notifications.update((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await httpClient.patch(`/notifications/${id}/read`, {});
    } catch { /* ignore */ }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
    try {
      await httpClient.post('/notifications/mark-all-read', {});
      this.toastSvc?.toast.info('Todas las notificaciones marcadas como leídas', 'Bandeja');
    } catch { /* ignore */ }
  }

  async emitNotification(payload: EmitNotificationPayload): Promise<void> {
    const localNotif: InAppNotification = {
      id: 'local-' + Date.now(),
      category: payload.category,
      severity: payload.severity || 'INFO',
      title: payload.title,
      message: payload.message,
      targetUserEmail: payload.targetUserEmail,
      teamId: payload.teamId,
      teamName: payload.teamName,
      isRead: false,
      metadata: payload.metadata,
      createdAt: new Date().toISOString(),
    };
    this.notifications.update((prev) => [localNotif, ...prev]);

    try {
      await httpClient.post('/notifications/emit', payload);
    } catch { /* ignore */ }
  }

  togglePopover(): void {
    this.isOpen.update((v) => !v);
  }

  closePopover(): void {
    this.isOpen.set(false);
  }

  private subscribeToSystemEvents(): void {
    serviceBus.subscribe('audit:log', (event: any) => {
      if (event?.actionType === 'role_assigned') {
        this.emitNotification({
          category: 'SECURITY',
          severity: 'WARNING',
          title: 'Rol de Acceso Reasignado',
          message: event.detail || 'Se ha actualizado un rol de usuario.',
          teamId: event.teamId,
          teamName: event.teamName,
          targetUserEmail: event.userEmail || 'david.josue.solorza@gmail.com',
          sendEmail: true,
        });
      } else if (event?.actionType === 'note_add') {
        this.emitNotification({
          category: 'NOTES_AGENDA',
          severity: 'INFO',
          title: event.title || 'Nota en Agenda Territorial',
          message: event.detail || 'Nueva entrada registrada en la agenda de la misión.',
          teamId: event.teamId,
          teamName: event.teamName,
          targetUserEmail: event.userEmail || 'david.josue.solorza@gmail.com',
          sendEmail: true,
        });
      }
    });
  }
}
