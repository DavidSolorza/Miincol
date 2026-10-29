import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-activity-budget-dates-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center gap-2 pb-1 border-b border-stone-200/60">
        <span class="w-6 h-6 rounded-lg bg-[#E67324]/15 text-[#8B251E] flex items-center justify-center font-black text-xs font-['Outfit']">
          2
        </span>
        <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
          Presupuesto &amp; Cronograma Territorial
        </h4>
      </div>

      <div class="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label class="font-bold text-stone-700 block mb-1 text-[11px]">Presupuesto Unitario (COP)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
              <input
                type="number"
                [value]="unitBudget()"
                (input)="onUnitBudgetInput($event)"
                step="10000"
                min="0"
                class="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden font-black text-sm text-[#8B251E] transition"
                required
              />
            </div>
          </div>

          <div class="bg-stone-50/80 p-3 rounded-xl border border-stone-200/70 flex flex-col justify-center">
            <span class="text-[10px] uppercase font-black tracking-wider text-stone-500">
              Total Estimado (Autocalculado)
            </span>
            <span class="text-base font-black text-[#8B251E] font-['Outfit'] mt-0.5">
              {{ formatCurrency(calculatedTotal()) }}
            </span>
            <span class="text-[9.5px] text-stone-400 font-medium">
              Fórmula: Valor Unitario × Repeticiones Anuales
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
  readonly unitBudget = input.required<number>();
  readonly calculatedTotal = input.required<number>();
  readonly startDate = input.required<string>();
  readonly endDate = input.required<string>();

  readonly unitBudgetChanged = output<number>();
  readonly startDateChanged = output<string>();
  readonly endDateChanged = output<string>();

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }

  onUnitBudgetInput(event: Event): void {
    this.unitBudgetChanged.emit(Number((event.target as HTMLInputElement).value));
  }

  onStartDateInput(event: Event): void {
    this.startDateChanged.emit((event.target as HTMLInputElement).value);
  }

  onEndDateInput(event: Event): void {
    this.endDateChanged.emit((event.target as HTMLInputElement).value);
  }
}

