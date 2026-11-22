import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import type { PillarBudgetBreakdown } from '../../domain/general-info.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-general-budget-top',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5 text-left font-['Outfit'] select-none">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-[#E67324]/10 text-[#E67324] flex items-center justify-center font-bold">
            <app-icon name="dollar-sign" className="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-stone-900 tracking-tight">Presupuesto por Pilar Estratégico</h3>
            <p class="text-[11px] text-stone-500">Distribución de recursos en las 5 dimensiones ministeriales</p>
          </div>
        </div>

        <div class="text-right bg-[#FAF7F2] px-3.5 py-1.5 rounded-xl border border-stone-200/80">
          <span class="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Presupuesto Inicial Asignado</span>
          <span class="text-base sm:text-lg font-black text-[#8B251E] font-mono">{{ formatCurrency(totalBudget()) }}</span>
        </div>
      </div>

      <!-- Barra de porcentaje y desglose monetario (Gastado vs Restante) -->
      <div class="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-extrabold text-stone-700 text-[11px] uppercase tracking-wider">
            Ejecución Presupuestal Global
          </span>
          <span class="font-black text-stone-900 text-xs sm:text-sm">
            {{ budgetPercentage() }}% Ejecutado
          </span>
        </div>

        <div class="w-full bg-stone-200/70 rounded-full h-2.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [class]="progressColorClass"
            [style.width.%]="budgetPercentage()"
          ></div>
        </div>

        <div class="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-stone-200/70">
          <span class="text-stone-600 font-bold">
            Monto Usado: <strong class="text-[#8B251E] font-extrabold">{{ formatCurrency(executedBudget()) }}</strong> ({{ budgetPercentage() }}%)
          </span>
          <span class="text-stone-600 font-bold">
            Saldo Disponible: <strong class="text-emerald-700 font-extrabold">{{ formatCurrency(remainingBudget) }}</strong> ({{ remainingPercentage }}%)
          </span>
        </div>
      </div>

      <!-- Cuadrícula de Pilares -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        @for (pillar of pillars; track pillar.key) {
          <div class="p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:bg-stone-50 transition">
            <span class="text-[10px] uppercase font-bold text-stone-500 block truncate">{{ pillar.label }}</span>
            <span class="text-xs sm:text-sm font-black text-stone-900 font-mono block mt-1">
              {{ formatCurrency(getBudgetAmount(pillar.key)) }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class GeneralBudgetTopComponent {
  readonly budget = input.required<PillarBudgetBreakdown>();
  readonly totalBudget = input.required<number>();
  readonly budgetPercentage = input.required<number>();
  readonly executedBudget = input<number>(0);

  readonly pillars = [
    { key: 'investigacionBudget' as const, label: '1. Inv. y Diagnóstico' },
    { key: 'encarnacionBudget' as const, label: '2. Encarnación y Convivencia' },
    { key: 'evangelizacionBudget' as const, label: '3. Evangelización' },
    { key: 'entrenamientoBudget' as const, label: '4. Entrenamiento' },
    { key: 'autocuidadoBudget' as const, label: '5. Autocuidado Obrero' },
  ];

  get remainingBudget(): number {
    const executed = this.executedBudget() || 0;
    return Math.max(0, this.totalBudget() - executed);
  }

  get remainingPercentage(): number {
    return Math.max(0, 100 - this.budgetPercentage());
  }

  get progressColorClass(): string {
    const pct = this.budgetPercentage();
    if (pct >= 100) return 'bg-[#8B251E]';
    if (pct > 80) return 'bg-amber-500';
    return 'bg-emerald-600';
  }

  getBudgetAmount(key: keyof PillarBudgetBreakdown): number {
    return Number(this.budget()[key]) || 0;
  }

  formatCurrency(amount: number): string {
    return formatCurrencyCOP(amount);
  }
}
