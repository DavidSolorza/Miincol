import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { serviceBus } from '../../core/bus';
import {
  type ToastType,
  type ToastItem,
  type ToastContextValue,
} from './toast/toast.types';
import { ToastItemView } from './toast/ToastItemView';

export type { ToastType, ToastItem, ToastContextValue };

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
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 3800) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

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
    <ToastContext.Provider value={{ showToast, toast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-3 sm:px-0 pointer-events-none select-none"
      >
        {toasts.map((item) => (
          <ToastItemView key={item.id} item={item} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
