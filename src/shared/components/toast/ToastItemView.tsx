import React from 'react';
import { X } from 'lucide-react';
import { TOAST_ICONS, TOAST_THEMES, type ToastItem } from './toast.types';

interface Props {
  item: ToastItem;
  onRemove: (id: string) => void;
}

export const ToastItemView: React.FC<Props> = ({ item, onRemove }) => {
  const Icon = TOAST_ICONS[item.type];
  const theme = TOAST_THEMES[item.type];
  const duration = item.duration || 3800;

  return (
    <div
      className={`animate-toast pointer-events-auto bg-stone-900/95 backdrop-blur-md text-white border ${theme.borderColor} shadow-2xl rounded-2xl p-3 sm:p-3.5 transition-all duration-300 flex items-start justify-between gap-3 relative overflow-hidden group`}
      style={{
        boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 8px 12px -6px rgba(0, 0, 0, 0.35)',
      }}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${theme.barColor}`} />

      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <div className="p-1 rounded-lg bg-white/5 shrink-0 mt-0.5">
          <Icon className={`w-4 h-4 ${theme.iconColor}`} />
        </div>

        <div className="min-w-0 flex-1">
          {item.title && (
            <h5 className="font-['Outfit'] font-black text-xs text-white leading-tight mb-0.5">
              {item.title}
            </h5>
          )}
          <p className="text-[11px] text-stone-300 leading-snug break-words">{item.message}</p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 mt-0.5"
        title="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-[2px] opacity-60 ${theme.barColor} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};
