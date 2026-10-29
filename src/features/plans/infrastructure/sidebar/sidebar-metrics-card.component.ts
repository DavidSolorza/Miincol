import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import type { PlanMetrics } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-sidebar-metrics-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-3 py-2 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs space-y-1 select-none transition-all duration-300 overflow-hidden">
      <div class="flex items-center justify-between text-stone-900 font-['Outfit']">
        <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Avance Pilar
        </span>
        <span class="text-xs font-extrabold tracking-tight text-[#8B251E]">
          {{ metrics().progressPercentage }}%
        </span>
      </div>

      <div class="flex items-center justify-between text-stone-900 font-['Outfit']">
        <span class="text-[10px] font-bold uppercase tracking-wider text-stone-500">
          Presupuesto
        </span>
        <span class="text-xs font-extrabold text-stone-900">
          {{ formatCurrency(metrics().totalBudget) }}
        </span>
      </div>
    </div>
  `,
})
export class SidebarMetricsCardComponent {
  readonly metrics = input.required<PlanMetrics>();

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

