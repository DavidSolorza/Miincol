import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
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
    iconColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/15 text-emerald-300',
    borderColor: 'border-emerald-500/20',
  },
  error: {
    iconColor: 'text-rose-400',
    barColor: 'bg-rose-500',
    badgeBg: 'bg-rose-500/15 text-rose-300',
    borderColor: 'border-rose-500/20',
  },
  warning: {
    iconColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/15 text-amber-300',
    borderColor: 'border-amber-500/20',
  },
  info: {
    iconColor: 'text-[#E67324]',
    barColor: 'bg-linear-to-r from-[#E67324] to-[#8B251E]',
    badgeBg: 'bg-[#E67324]/15 text-amber-200',
    borderColor: 'border-[#E67324]/20',
  },
};
