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
// Tarjeta compacta en la barra lateral que muestra el porcentaje de avance y presupuesto de la fase
export class SidebarMetricsCardComponent {
  readonly metrics = input.required<PlanMetrics>(); // Métricas calculadas de la fase activa

  // Formatea un valor numérico como moneda en pesos colombianos (COP)
  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

