import { Injectable, signal } from '@angular/core';
import { serviceBus } from '../../../core/bus';
import type { ToastType, ToastItem, ToastConfirmOptions, ActiveConfirmToast } from './toast.types';

// Servicio global de notificaciones efímeras (Toasts) y cuadros de confirmación interactivos
@Injectable({ providedIn: 'root' })
export class ToastService {
  // Colas reactivas de avisos rápidos y confirmaciones pendientes
  readonly toasts = signal<ToastItem[]>([]);
  readonly confirms = signal<ActiveConfirmToast[]>([]);

  // Atajos por tipo de mensaje (success, error, warning, info)
  readonly toast = {
    success: (message: string, title = 'Éxito', duration?: number) =>
      this.showToast(message, 'success', title, duration),
    error: (message: string, title = 'Error', duration?: number) =>
      this.showToast(message, 'error', title, duration),
    warning: (message: string, title = 'Atención', duration?: number) =>
      this.showToast(message, 'warning', title, duration),
    info: (message: string, title = 'Información', duration?: number) =>
      this.showToast(message, 'info', title, duration),
  };

  // Escucha eventos ui:toast emitidos desde el ServiceBus
  constructor() {
    serviceBus.subscribe('ui:toast', (payload) => {
      this.showToast(payload.message, payload.type, payload.title, payload.duration);
    });
  }

  // Encola un nuevo aviso y programa su cierre automático según la duración
  showToast(message: string, type: ToastType = 'info', title?: string, duration = 2000): string {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const item: ToastItem = { id, type, title, message, duration };
    this.toasts.update((prev) => [...prev, item]);
    setTimeout(() => this.removeToast(id), duration);
    return id;
  }

  // Elimina un aviso específico por su identificador
  removeToast(id: string): void {
    this.toasts.update((prev) => prev.filter((t) => t.id !== id));
  }

  // Abre un diálogo flotante de confirmación con callbacks de aceptación o cancelación
  confirmAction(options: ToastConfirmOptions): void {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.confirms.update((prev) => [...prev, { ...options, id }]);
  }

  // Retira una tarjeta de confirmación de la cola activa
  removeConfirm(id: string): void {
    this.confirms.update((prev) => prev.filter((c) => c.id !== id));
  }
}

