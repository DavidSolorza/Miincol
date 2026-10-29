import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

export type BadgeVariant = 'pendiente' | 'en_proceso' | 'completado' | 'terracotta' | 'ochre' | 'neutral';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
  pendiente: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dotColor: 'bg-amber-500' },
  en_proceso: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-300', dotColor: 'bg-[#E67324]' },
  completado: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', dotColor: 'bg-emerald-500' },
  terracotta: { bg: 'bg-[#8B251E]/10', text: 'text-[#8B251E]', border: 'border-[#8B251E]/20', dotColor: 'bg-[#8B251E]' },
  ochre: { bg: 'bg-[#E67324]/10', text: 'text-[#D05E12]', border: 'border-[#E67324]/25', dotColor: 'bg-[#E67324]' },
  neutral: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dotColor: 'bg-stone-400' },
};

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="computedClass">
      @if (dot) {
        <span [class]="'w-1.5 h-1.5 rounded-full animate-pulse ' + current.dotColor"></span>
      }
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: 'sm' | 'md' = 'md';
  @Input() className = '';
  @Input() dot = false;

  get current() {
    return VARIANT_STYLES[this.variant] || VARIANT_STYLES.neutral;
  }

  get computedClass(): string {
    const c = this.current;
    const sizeStyle = this.size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
    return `inline-flex items-center gap-1.5 font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeStyle} ${this.className}`;
  }
}

