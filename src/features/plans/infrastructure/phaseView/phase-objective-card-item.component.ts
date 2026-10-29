import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import type { Objective } from '../../domain/plan.types';

@Component({
  selector: 'app-phase-objective-card-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="selected.emit()"
      [class]="
        'group relative text-left p-3.5 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between w-full h-full min-h-[145px] sm:min-h-[160px] ' +
        (isSelected()
          ? 'bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F2] border-2 border-[#E67324]/70 shadow-[0_4px_18px_-2px_rgba(230,115,36,0.18)] ring-2 ring-[#E67324]/10'
          : 'bg-white/85 hover:bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-2xs')
      "
    >
      @if (isSelected()) {
        <div class="absolute top-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400 rounded-full"></div>
      }

      <div class="space-y-1.5 w-full">
        <div class="flex items-center justify-between gap-1.5">
          <div class="flex items-center gap-1.5 min-w-0">
            <span
              [class]="
                'w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10.5px] sm:text-xs font-black shrink-0 transition font-[\\'Outfit\\'] ' +
                (isSelected()
                  ? 'bg-gradient-to-br from-[#8B251E] to-[#E67324] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200')
              "
            >
              {{ obj().number }}
            </span>
            <span
              [class]="
                'text-[10px] font-black uppercase tracking-wider font-[\\'Outfit\\'] truncate ' +
                (isSelected() ? 'text-[#8B251E]' : 'text-stone-500 group-hover:text-stone-700')
              "
            >
              Objetivo #{{ obj().number }}
            </span>
          </div>

          <span
            [class]="
              'text-[9.5px] font-black px-1.5 py-0.5 rounded-md shrink-0 transition tracking-tight whitespace-nowrap ' +
              (isCompleted()
                ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60'
                : isSelected()
                ? 'bg-[#E67324]/15 text-[#8B251E] border border-[#E67324]/30'
                : 'bg-stone-100 text-stone-600 border border-stone-200/50')
            "
          >
            {{ completedCount() }}/{{ totalCount() }} listas
          </span>
        </div>

        <h4
          [class]="
            'font-[\\'Outfit\\'] font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 transition ' +
            (isSelected() ? 'text-stone-900 font-extrabold' : 'text-stone-800 group-hover:text-stone-900')
          "
          [title]="obj().title"
        >
          {{ obj().title }}
        </h4>

        @if (obj().description) {
          <p class="text-[10.5px] sm:text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
            {{ obj().description }}
          </p>
        }
      </div>

      <div class="pt-2 border-t border-stone-100/90 flex items-center justify-between text-[10px] text-stone-400">
        <span>{{ totalCount() }} {{ totalCount() === 1 ? 'actividad' : 'actividades' }}</span>
        <span class="font-bold text-stone-600 font-['Outfit']">{{ formattedBudget() }}</span>
      </div>

      <div class="pt-1 space-y-1 w-full">
        <div class="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden p-0.5">
          <div
            [class]="
              'h-full rounded-full transition-all duration-300 ' +
              (isCompleted()
                ? 'bg-emerald-500'
                : isSelected()
                ? 'bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400'
                : 'bg-stone-300 group-hover:bg-stone-400')
            "
            [style.width.%]="pct()"
          ></div>
        </div>
        <div class="flex items-center justify-between text-[9.5px] font-medium text-stone-400">
          <span>{{ pct() }}% completado</span>
          @if (isSelected()) {
            <span class="text-[#E67324] font-bold inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E67324] animate-pulse"></span>
              <span>Activo</span>
            </span>
          } @else {
            <span class="group-hover:text-stone-600 transition">Ver actividades →</span>
          }
        </div>
      </div>
    </button>
  `,
})
// Tarjeta individual de resumen de un objetivo estratégico con barra de progreso y presupuesto total
export class PhaseObjectiveCardItemComponent {
  readonly obj = input.required<Objective>(); // Datos del objetivo estratégico
  readonly isSelected = input.required<boolean>(); // Indica si esta tarjeta es el objetivo actualmente seleccionado
  readonly selected = output<void>(); // Emite cuando el usuario hace clic para seleccionar el objetivo

  // Cantidad de actividades completadas dentro de este objetivo
  readonly completedCount = computed(() =>
    this.obj().activities.filter((a) => a.state === 'Completado').length
  );
  readonly totalCount = computed(() => this.obj().activities.length); // Total de actividades del objetivo
  // Porcentaje de progreso de actividades completadas en este objetivo
  readonly pct = computed(() =>
    this.totalCount() > 0 ? Math.round((this.completedCount() / this.totalCount()) * 100) : 0
  );
  readonly isCompleted = computed(() => this.totalCount() > 0 && this.completedCount() === this.totalCount()); // Indica si todas están listas
  // Suma y formatea el presupuesto total del objetivo en pesos colombianos (COP)
  readonly formattedBudget = computed(() => {
    const budget = this.obj().activities.reduce((acc, a) => acc + (a.totalBudget || 0), 0);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(budget);
  });
}

