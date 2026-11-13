import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createEnvironmentInjector, runInInjectionContext, type EnvironmentInjector } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { ToastService } from '../../../shared/components/toast/toast.service';

describe('NotificationsService (Frontend In-App Notifications)', () => {
  let service: NotificationsService;

  beforeEach(() => {
    vi.clearAllMocks();
    const injector = createEnvironmentInjector([ToastService], null as unknown as EnvironmentInjector);
    service = runInInjectionContext(injector, () => new NotificationsService());
  });

  it('debe inicializar con notificaciones base y calcular no leídas correctamente', () => {
    expect(service.notifications().length).toBeGreaterThanOrEqual(1);
    expect(service.unreadCount()).toBeGreaterThanOrEqual(1);
    expect(service.isOpen()).toBe(false);
  });

  it('debe emitir nueva notificación y agregarla al inicio de la lista', async () => {
    const initialCount = service.notifications().length;
    await service.emitNotification({
      category: 'SECURITY',
      title: 'Cambio de Rol Hugo',
      message: 'Hugo es ahora Coordinador de Equipos',
    });

    expect(service.notifications().length).toBe(initialCount + 1);
    expect(service.notifications()[0].title).toBe('Cambio de Rol Hugo');
    expect(service.notifications()[0].category).toBe('SECURITY');
    expect(service.notifications()[0].isRead).toBe(false);
  });

  it('debe marcar una notificación específica como leída', async () => {
    const firstId = service.notifications()[0].id;
    await service.markAsRead(firstId);
    const target = service.notifications().find((n) => n.id === firstId);
    expect(target?.isRead).toBe(true);
  });

  it('debe marcar todas las notificaciones como leídas', async () => {
    await service.markAllAsRead();
    expect(service.unreadCount()).toBe(0);
    expect(service.notifications().every((n) => n.isRead)).toBe(true);
  });

  it('debe alternar la apertura y cierre del popover', () => {
    expect(service.isOpen()).toBe(false);
    service.togglePopover();
    expect(service.isOpen()).toBe(true);
    service.closePopover();
    expect(service.isOpen()).toBe(false);
  });
});
