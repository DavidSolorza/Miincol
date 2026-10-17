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
      className={`animate-toast pointer-events-auto bg-white/98 backdrop-blur-md text-stone-900 border ${theme.borderColor} ${theme.glowColor} shadow-[0_14px_36px_-4px_rgba(28,25,23,0.12),0_4px_12px_-2px_rgba(0,0,0,0.05)] rounded-2xl p-3.5 sm:p-4 transition-all duration-300 flex items-start justify-between gap-3 relative overflow-hidden group select-none`}
    >
      {/* Top subtle colored accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme.barColor}`} />

      <div className="flex items-start gap-3 min-w-0 flex-1 pt-0.5">
        <div className={`w-9 h-9 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}>
          <Icon className={`w-4 h-4 ${theme.iconColor}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
              {theme.label}
            </span>
            {item.title && (
              <h5 className="font-['Outfit'] font-black text-xs text-stone-900 leading-tight">
                {item.title}
              </h5>
            )}
          </div>
          <p className="text-xs text-stone-600 leading-relaxed break-words font-medium">
            {item.message}
          </p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition cursor-pointer shrink-0 mt-0.5"
        title="Cerrar notificación"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-[2.5px] opacity-75 ${theme.barColor} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};
