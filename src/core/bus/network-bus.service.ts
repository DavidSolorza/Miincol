import { Injectable, signal } from '@angular/core';
import { serviceBus } from './ServiceBus';

@Injectable({ providedIn: 'root' })
export class NetworkBusService {
  readonly isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly effectiveType = signal<string | undefined>((navigator as any)?.connection?.effectiveType);

  constructor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline.set(true);
      serviceBus.publish('network:status', { isOnline: true, effectiveType: this.effectiveType() });
      serviceBus.publish('ui:toast', {
        title: 'Conexión restablecida',
        message: 'Modo en línea activo. Datos sincronizados con el servidor.',
        type: 'success',
        duration: 3500,
      });
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      serviceBus.publish('network:status', { isOnline: false, effectiveType: this.effectiveType() });
      serviceBus.publish('ui:toast', {
        title: 'Modo sin conexión',
        message: 'Red débil o ausente. Todos tus cambios se guardan localmente.',
        type: 'warning',
        duration: 4500,
      });
    });

    const conn = (navigator as any)?.connection;
    conn?.addEventListener?.('change', () => {
      if (conn?.effectiveType) {
        this.effectiveType.set(conn.effectiveType);
        serviceBus.publish('network:status', {
          isOnline: navigator.onLine,
          effectiveType: conn.effectiveType,
        });
      }
    });
  }
}

