import { useState, useEffect } from 'react';
import { serviceBus } from './ServiceBus';

export interface NetworkBusState {
  isOnline: boolean;
  effectiveType?: string;
}

export function useNetworkBus(): NetworkBusState {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [effectiveType, setEffectiveType] = useState<string | undefined>(() => {
    const conn = (navigator as any)?.connection;
    return conn?.effectiveType;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      serviceBus.publish('network:status', { isOnline: true, effectiveType });
      serviceBus.publish('ui:toast', {
        title: 'Conexión restablecida',
        message: 'Modo en línea activo. Datos sincronizados con el servidor.',
        type: 'success',
        duration: 3500,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      serviceBus.publish('network:status', { isOnline: false, effectiveType });
      serviceBus.publish('ui:toast', {
        title: 'Modo sin conexión',
        message: 'Red débil o ausente. Todos tus cambios se guardan localmente.',
        type: 'warning',
        duration: 4500,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const conn = (navigator as any)?.connection;
    const handleConnChange = () => {
      if (conn?.effectiveType) {
        setEffectiveType(conn.effectiveType);
        serviceBus.publish('network:status', {
          isOnline: navigator.onLine,
          effectiveType: conn.effectiveType,
        });
      }
    };
    conn?.addEventListener?.('change', handleConnChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      conn?.removeEventListener?.('change', handleConnChange);
    };
  }, [effectiveType]);

  return { isOnline, effectiveType };
}
