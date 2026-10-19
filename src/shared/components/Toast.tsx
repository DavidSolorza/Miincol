import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import hotToast, { Toaster } from 'react-hot-toast';
import { serviceBus } from '../../core/bus';
import type {
  ToastType,
  ToastItem,
  ToastContextValue,
  ToastConfirmOptions,
} from './toast/toast.types';
import { ToastConfirmItemView } from './toast/ToastConfirmItemView';

export type { ToastType, ToastItem, ToastContextValue, ToastConfirmOptions };

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const removeToast = useCallback((id: string) => {
    hotToast.dismiss(id);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 1600) => {
      const text = title ? `${title}: ${message}` : message;
      const opts = { duration };

      switch (type) {
        case 'success':
          return hotToast.success(text, opts);
        case 'error':
          return hotToast.error(text, opts);
        case 'warning':
          return hotToast(text, { ...opts, icon: '⚠️' });
        case 'info':
        default:
          return hotToast(text, { ...opts, icon: 'ℹ️' });
      }
    },
    []
  );

  const confirmAction = useCallback((options: ToastConfirmOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    hotToast.custom(
      (t) => (
        <ToastConfirmItemView
          confirmItem={{ ...options, id }}
          onDismiss={() => hotToast.dismiss(t.id)}
        />
      ),
      {
        id,
        duration: options.duration || 10000,
        position: 'top-center',
      }
    );
  }, []);

  useEffect(() => {
    const sub = serviceBus.subscribe('ui:toast', (payload) => {
      showToast(payload.message, payload.type, payload.title, payload.duration);
    });
    return () => sub.unsubscribe();
  }, [showToast]);

  const toast = useMemo(
    () => ({
      success: (message: string, title: string = 'Éxito', duration?: number) =>
        showToast(message, 'success', title, duration),
      error: (message: string, title: string = 'Error', duration?: number) =>
        showToast(message, 'error', title, duration),
      warning: (message: string, title: string = 'Atención', duration?: number) =>
        showToast(message, 'warning', title, duration),
      info: (message: string, title: string = 'Información', duration?: number) =>
        showToast(message, 'info', title, duration),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, confirmAction, toast, removeToast }}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 24,
        }}
        toastOptions={{
          duration: 1600,
          style: {
            background: '#FFFDF9',
            color: '#1C1917',
            border: '1px solid #EBDDCF',
            boxShadow: '0 10px 30px -5px rgba(139, 37, 30, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
            borderRadius: '16px',
            padding: '10px 16px',
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '-0.01em',
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};
