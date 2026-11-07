import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Component({
  selector: 'app-activity-budget-dates-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center justify-between pb-1 border-b border-stone-200/60">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-900 flex items-center justify-center font-black text-xs font-['Outfit']">2</span>
          <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">Presupuesto Mensual &amp; Cronograma</h4>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Anual:</span>
          <span class="font-mono font-black text-stone-900 text-sm sm:text-base">{{ formatCurrency(calculatedTotal()) }}</span>
        </div>
      </div>

      <!-- Distribución mensual de presupuesto -->
      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Uso Mensual del Presupuesto (COP)</label>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-2 rounded-xl bg-white border border-stone-200/80">
          @for (m of monthNames; track $index) {
            <div class="text-center">
              <span class="block text-[9.5px] font-bold text-stone-400 uppercase mb-0.5">{{ m }}</span>
              <input
                type="number"
                [value]="getMonthBudget($index + 1)"
                (input)="onMonthInput($index + 1, $event)"
                placeholder="0"
                min="0"
                step="10000"
                class="w-full text-center p-1 rounded-lg border border-stone-200 text-xs font-mono font-bold bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          }
        </div>
      </div>

      <!-- Fechas de inicio y fin -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Fecha de Inicio</label>
          <input
            type="date"
            [value]="startDate()"
            (input)="onStartDateInput($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
            required
          />
        </div>

        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Fecha de Finalización</label>
          <input
            type="date"
            [value]="endDate()"
            (input)="onEndDateInput($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
            required
          />
        </div>
      </div>
    </div>
  `,
})
export class ActivityBudgetDatesFieldsComponent {
  readonly monthNames = MONTH_NAMES;
  readonly unitBudget = input.required<number>();
  readonly calculatedTotal = input.required<number>();
  readonly startDate = input.required<string>();
  readonly endDate = input.required<string>();
  readonly monthlyBudget = input<Record<number, number>>({});

  readonly unitBudgetChanged = output<number>();
  readonly monthlyBudgetChanged = output<Record<number, number>>();
  readonly startDateChanged = output<string>();
  readonly endDateChanged = output<string>();

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }

  getMonthBudget(month: number): number | '' {
    const val = this.monthlyBudget()[month];
    return val !== undefined && val > 0 ? val : '';
  }

  onMonthInput(month: number, event: Event): void {
    const val = Math.max(0, Number((event.target as HTMLInputElement).value) || 0);
    const updated = { ...this.monthlyBudget(), [month]: val };
    const total = Object.values(updated).reduce((acc, curr) => acc + (curr || 0), 0);
    this.monthlyBudgetChanged.emit(updated);
    this.unitBudgetChanged.emit(total);
  }

  onStartDateInput(event: Event): void {
    this.startDateChanged.emit((event.target as HTMLInputElement).value);
  }

  onEndDateInput(event: Event): void {
    this.endDateChanged.emit((event.target as HTMLInputElement).value);
  }
}
