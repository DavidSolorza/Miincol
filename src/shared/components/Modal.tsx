import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-3xl shadow-[0_24px_50px_-12px_rgba(28,25,23,0.2)] border border-stone-200/90 overflow-hidden z-10 flex flex-col max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Acentuada Misincol */}
        <div className="h-1 w-full bg-gradient-to-r from-[#8B251E] via-[#E67324] to-[#8B251E]" />

        <div className="flex items-start justify-between px-6 sm:px-7 py-4.5 sm:py-5 border-b border-stone-100 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2]/60 to-white gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit'] tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xl">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100/80 hover:bg-stone-200/80 text-stone-400 hover:text-stone-700 flex items-center justify-center transition cursor-pointer shrink-0 mt-0.5"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};
