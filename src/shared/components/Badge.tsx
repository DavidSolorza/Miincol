import React from 'react';

export type BadgeVariant = 'pendiente' | 'en_proceso' | 'completado' | 'terracotta' | 'ochre' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    pendiente: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dotColor: 'bg-amber-500',
    },
    en_proceso: {
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-300',
      dotColor: 'bg-[#E67324]',
    },
    completado: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    terracotta: {
      bg: 'bg-[#8B251E]/10',
      text: 'text-[#8B251E]',
      border: 'border-[#8B251E]/20',
      dotColor: 'bg-[#8B251E]',
    },
    ochre: {
      bg: 'bg-[#E67324]/10',
      text: 'text-[#D05E12]',
      border: 'border-[#E67324]/25',
      dotColor: 'bg-[#E67324]',
    },
    neutral: {
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-200',
      dotColor: 'bg-stone-400',
    },
  };

  const current = variantStyles[variant];
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} animate-pulse`} />}
      {children}
    </span>
  );
};
