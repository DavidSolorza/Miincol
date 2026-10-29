import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { Objective } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-objective-card-header',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-black text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-xl border border-[#8B251E]/15 font-['Outfit']">
            Objetivo #{{ objective().number }}
          </span>
          <span class="text-xs font-semibold text-stone-400">
            • {{ completedCount() }} de {{ objective().activities.length }} listas
          </span>
          <button
            type="button"
            (click)="editObjective.emit(objective())"
            class="px-2 py-0.5 rounded-lg text-xs font-bold text-stone-500 hover:text-[#8B251E] hover:bg-[#8B251E]/10 transition flex items-center gap-1.5 cursor-pointer"
            title="Editar objetivo"
          >
            <app-icon name="pencil" className="w-4 h-4 text-[#E67324]" />
            <span>Editar</span>
          </button>
        </div>

        <h2 class="text-base sm:text-lg font-black text-stone-900 mt-1.5 font-['Outfit'] tracking-tight">
          {{ objective().title }}
        </h2>
        <p class="text-xs text-stone-500 mt-1 leading-relaxed max-w-2xl font-medium">
          {{ objective().description }}
        </p>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 self-start md:self-center">
        <div class="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-stone-50 border border-stone-200/80 text-right shadow-2xs">
          <span class="text-[9.5px] uppercase font-black text-stone-400 block tracking-wider leading-none">
            Presupuesto Objetivo
          </span>
          <span class="text-base sm:text-lg font-black text-[#8B251E] font-['Outfit'] mt-1 block tracking-tight">
            {{ formatCurrency(totalObjectiveBudget()) }}
          </span>
        </div>

        <button
          type="button"
          (click)="openAddModal.emit()"
          class="bg-gradient-to-r from-[#8B251E] to-[#EA6A1B] hover:from-[#731E18] hover:to-[#D95F12] text-white font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer font-['Outfit']"
        >
          <app-icon name="plus" className="w-5 h-5" />
          <span class="hidden sm:inline">Nueva Actividad</span>
          <span class="sm:hidden">Nueva</span>
        </button>
      </div>
    </div>
  `,
})
// Cabecera de detalle de un objetivo con título, descripción, presupuesto total y botones de acción
export class ObjectiveCardHeaderComponent {
  readonly objective = input.required<Objective>(); // Datos del objetivo estratégico activo
  readonly completedCount = input.required<number>(); // Cantidad de actividades completadas en el objetivo
  readonly totalObjectiveBudget = input.required<number>(); // Presupuesto total acumulado del objetivo
  readonly editObjective = output<Objective>(); // Emite cuando se solicita editar el objetivo
  readonly openAddModal = output<void>(); // Emite cuando se solicita crear una nueva actividad

  // Formatea el presupuesto numérico a formato de moneda colombiana (COP)
  formatCurrency(val: number): string {
    return formatCurrencyCOP(val);
  }
}

