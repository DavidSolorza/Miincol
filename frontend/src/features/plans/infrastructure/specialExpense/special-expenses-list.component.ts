import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { SpecialExpense } from '../../domain/plan.types';

@Component({
  selector: 'app-special-expenses-list',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (expenses().length > 0) {
      <div class="mt-3 p-3 sm:p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs font-['Outfit']">
        <div class="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
          <div class="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
            <app-icon name="sparkles" className="w-3.5 h-3.5 text-amber-600" />
            <span>Gastos Especiales Planificados ({{ expenses().length }})</span>
          </div>
          <span class="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-bold">
            No suma al presupuesto general
          </span>
        </div>

        <div class="space-y-1.5">
          @for (item of expenses(); track item.id) {
            <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/90 border border-amber-100 shadow-2xs">
              <div class="min-w-0">
                <div class="font-bold text-stone-900 truncate">{{ item.name }}</div>
                <div class="text-[10.5px] text-stone-500 truncate">{{ item.description || item.area }}</div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="font-black text-amber-900 text-xs font-mono">{{ formatCurrency(item.budget) }}</span>
                @if (canEdit()) {
                  <button type="button" (click)="deleteExpense.emit(item.id)" class="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="Eliminar gasto especial">
                    <app-icon name="trash-2" className="w-3 h-3" />
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <div class="pt-1 text-right text-[11px] font-bold text-amber-900">
          Subtotal Gastos Especiales: <span class="font-black font-mono">{{ formatCurrency(totalBudget()) }}</span>
        </div>
      </div>
    }
  `,
})
export class SpecialExpensesListComponent {
  readonly expenses = input<SpecialExpense[]>([]);
  readonly canEdit = input<boolean>(true);
  readonly deleteExpense = output<string>();

  get totalBudget(): () => number {
    return () => this.expenses().reduce((sum, e) => sum + (e.budget || 0), 0);
  }

  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}
