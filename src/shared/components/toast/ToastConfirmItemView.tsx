import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import type { ActiveConfirmToast } from './toast.types';

interface Props {
  confirmItem: ActiveConfirmToast;
  onDismiss: () => void;
}

export const ToastConfirmItemView: React.FC<Props> = ({ confirmItem, onDismiss }) => {
  const {
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    type = 'warning',
    duration = 10000,
    onConfirm,
    onCancel,
  } = confirmItem;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          if (onCancel) onCancel();
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onCancel, onDismiss]);

  const handleConfirm = () => {
    onConfirm();
    onDismiss();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onDismiss();
  };

  const isDanger = type === 'danger';

  return (
    <div className="pointer-events-auto bg-[#FFFDF9]/98 backdrop-blur-md rounded-2xl border border-[#EBDDCF] shadow-[0_20px_50px_rgba(139,37,30,0.12),0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden p-3.5 sm:p-4 w-full max-w-[420px] animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'}`}>
          {isDanger ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-black text-stone-900 font-['Outfit'] leading-tight">
              {title}
            </h4>
            <button
              onClick={handleCancel}
              title="Cerrar aviso"
              className="text-stone-400 hover:text-stone-600 p-0.5 rounded-lg transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11.5px] text-stone-600 font-['Outfit'] mt-1 leading-snug">
            {message}
          </p>

          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-stone-100">
            <button
              onClick={handleCancel}
              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer active:scale-95 font-['Outfit']"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-3 py-1 rounded-xl text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95 font-['Outfit'] ${isDanger ? 'bg-[#8B251E] hover:bg-[#6E1A14]' : 'bg-gradient-to-r from-[#E67324] to-[#8B251E] hover:opacity-95'}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>

      {duration > 0 && (
        <div className="h-0.5 w-full bg-stone-100 mt-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${isDanger ? 'bg-rose-500' : 'bg-[#E67324]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
