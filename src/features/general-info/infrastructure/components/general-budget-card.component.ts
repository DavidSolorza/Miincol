import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { PillarBudgetBreakdown } from '../../domain/general-info.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-general-budget-card',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <app-icon name="coins" className="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-stone-900 font-['Outfit']">Presupuesto Total y Desglose por Pilares</h3>
            <p class="text-[11px] text-stone-500">Distribución financiera aprobada para el plan</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-stone-400 block uppercase font-bold">Total Asignado</span>
          <span class="text-base sm:text-lg font-black text-[#8B251E] font-['Outfit']">{{ formatMoney(totalBudget()) }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        <div class="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
          <span class="text-[10px] font-bold text-stone-500 block uppercase">1. Investigación</span>
          <span class="text-xs sm:text-sm font-black text-stone-900 mt-1 block font-['Outfit']">{{ formatMoney(budget().investigacionBudget) }}</span>
        </div>
        <div class="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
          <span class="text-[10px] font-bold text-stone-500 block uppercase">2. Encarnación</span>
          <span class="text-xs sm:text-sm font-black text-stone-900 mt-1 block font-['Outfit']">{{ formatMoney(budget().encarnacionBudget) }}</span>
        </div>
        <div class="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
          <span class="text-[10px] font-bold text-stone-500 block uppercase">3. Evangelización</span>
          <span class="text-xs sm:text-sm font-black text-stone-900 mt-1 block font-['Outfit']">{{ formatMoney(budget().evangelizacionBudget) }}</span>
        </div>
        <div class="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
          <span class="text-[10px] font-bold text-stone-500 block uppercase">4. Entrenamiento</span>
          <span class="text-xs sm:text-sm font-black text-stone-900 mt-1 block font-['Outfit']">{{ formatMoney(budget().entrenamientoBudget) }}</span>
        </div>
        <div class="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/60">
          <span class="text-[10px] font-bold text-stone-500 block uppercase">5. Autocuidado</span>
          <span class="text-xs sm:text-sm font-black text-stone-900 mt-1 block font-['Outfit']">{{ formatMoney(budget().autocuidadoBudget) }}</span>
        </div>
      </div>
    </div>
  `,
})
export class GeneralBudgetCardComponent {
  readonly budget = input.required<PillarBudgetBreakdown>();
  readonly totalBudget = input.required<number>();

  formatMoney(val: number): string {
    return formatCurrencyCOP(val);
  }
}
