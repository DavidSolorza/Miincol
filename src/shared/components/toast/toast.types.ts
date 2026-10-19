import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'warning' | 'danger' | 'info';
  duration?: number;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ActiveConfirmToast extends ToastConfirmOptions {
  id: string;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  confirmAction: (options: ToastConfirmOptions) => void;
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

export const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export const TOAST_THEMES = {
  success: {
    label: 'Éxito',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 ring-1 ring-emerald-200/80',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    badgeBg: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60',
    borderColor: 'border-emerald-200/70',
    glowColor: 'shadow-emerald-500/10',
  },
  error: {
    label: 'Atención / Error',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 ring-1 ring-rose-200/80',
    barColor: 'bg-gradient-to-r from-rose-500 to-red-400',
    badgeBg: 'bg-rose-100/80 text-rose-800 border border-rose-200/60',
    borderColor: 'border-rose-200/70',
    glowColor: 'shadow-rose-500/10',
  },
  warning: {
    label: 'Aviso Importante',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 ring-1 ring-amber-200/80',
    barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    badgeBg: 'bg-amber-100/80 text-amber-900 border border-amber-200/60',
    borderColor: 'border-amber-200/70',
    glowColor: 'shadow-amber-500/10',
  },
  info: {
    label: 'Información',
    iconColor: 'text-[#E67324]',
    iconBg: 'bg-orange-50 ring-1 ring-[#E67324]/30',
    barColor: 'bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400',
    badgeBg: 'bg-[#E67324]/15 text-[#8B251E] border border-[#E67324]/30',
    borderColor: 'border-orange-200/80',
    glowColor: 'shadow-orange-500/10',
  },
};
