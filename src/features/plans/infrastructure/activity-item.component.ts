import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import type { Activity, ActivityState } from '../domain/plan.types';
import { formatDate } from '../../../shared/utils/formatters';
import { ActivityHeaderTagsComponent } from './activityItem/activity-header-tags.component';
import { ActivityBudgetQuickEditComponent } from './activityItem/activity-budget-quick-edit.component';
import { ActivityDetailsAccordionComponent } from './activityItem/activity-details-accordion.component';

@Component({
  selector: 'app-activity-item',
  standalone: true,
  imports: [
    AppIconComponent,
    ActivityHeaderTagsComponent,
    ActivityBudgetQuickEditComponent,
    ActivityDetailsAccordionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-2xl border border-stone-200/70 hover:border-stone-300 hover:shadow-xs transition-all duration-200 overflow-hidden">
      <div class="p-4 sm:p-4.5 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2.5">
          <app-activity-header-tags
            [state]="activity().state"
            [stage]="activity().stage"
            [frequency]="activity().frequency"
            (stateChanged)="onStateChange($event)"
          />
          <app-activity-budget-quick-edit
            [totalBudget]="activity().totalBudget"
            [unitBudget]="activity().unitBudget"
            [timesPerYear]="activity().timesPerYear"
            [isEditingBudget]="isEditingBudget()"
            [unitBudgetInput]="unitBudgetInput()"
            [timesPerYearInput]="timesPerYearInput()"
            (editingBudgetToggled)="isEditingBudget.set($event)"
            (unitBudgetChanged)="unitBudgetInput.set($event)"
            (timesPerYearChanged)="timesPerYearInput.set($event)"
            (budgetSaved)="handleSaveBudget()"
            (deleted)="deleted.emit(activity().id)"
            (edited)="edited.emit(activity())"
          />
        </div>

        <h3 class="text-xs sm:text-sm font-extrabold text-stone-900 leading-snug font-['Outfit'] tracking-tight">
          {{ activity().description }}
        </h3>

        <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 font-bold text-stone-700 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/60 shadow-2xs">
              <app-icon name="user" className="w-4 h-4 text-[#8B251E]" />
              {{ activity().responsible || 'Sin responsable asignado' }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/60">
              <app-icon name="calendar" className="w-4 h-4 text-stone-400" />
              {{ fmtDate(activity().startDate) }} ➔ {{ fmtDate(activity().endDate) }}
            </span>
            <span class="inline-flex items-center text-[10px] font-black text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-lg border border-[#8B251E]/15">
              {{ activity().remainingWeeks }} sem. rest.
            </span>
          </div>

          <button
            type="button"
            (click)="isExpanded.set(!isExpanded())"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-bold text-[11px] transition cursor-pointer border border-stone-200/60 shadow-2xs"
          >
            <span>{{ isExpanded() ? 'Ocultar diagnóstico' : 'Diagnóstico y metas' }}</span>
            <app-icon [name]="isExpanded() ? 'chevron-up' : 'chevron-down'" className="w-4 h-4" />
          </button>
        </div>
      </div>

      @if (isExpanded()) {
        <app-activity-details-accordion
          [activity]="activity()"
          (edited)="edited.emit(activity())"
        />
      }
    </div>
  `,
})
// Tarjeta individual de una actividad con edición rápida de estado, presupuesto y acordeón de diagnóstico
export class ActivityItemComponent {
  readonly activity = input.required<Activity>(); // Datos completos de la actividad a mostrar
  readonly updated = output<{ activityId: string; updatedFields: Partial<Activity> }>(); // Emite actualizaciones parciales de la actividad
  readonly deleted = output<string>(); // Emite el ID de la actividad cuando se confirma su eliminación
  readonly edited = output<Activity>(); // Solicita abrir el modal de edición completa para esta actividad

  readonly isExpanded = signal(false); // Controla si el acordeón de diagnóstico y metas está desplegado
  readonly isEditingBudget = signal(false); // Indica si el modo de edición rápida de presupuesto está activo
  readonly unitBudgetInput = signal(0); // Valor temporal del presupuesto unitario durante la edición rápida
  readonly timesPerYearInput = signal(1); // Valor temporal de las repeticiones anuales durante la edición rápida

  constructor() {
    // Sincroniza los inputs locales de presupuesto cuando cambia la actividad recibida
    effect(() => {
      const act = this.activity();
      this.unitBudgetInput.set(act.unitBudget);
      this.timesPerYearInput.set(act.timesPerYear);
    });
  }

  // Formatea una fecha ISO a formato legible en español
  fmtDate(d: string): string {
    return formatDate(d);
  }

  // Emite la actualización inmediata cuando el usuario cambia el estado de la actividad
  onStateChange(state: ActivityState): void {
    this.updated.emit({ activityId: this.activity().id, updatedFields: { state } });
  }

  // Guarda los cambios de presupuesto unitario y frecuencia anual desde la edición rápida
  handleSaveBudget(): void {
    this.updated.emit({
      activityId: this.activity().id,
      updatedFields: {
        unitBudget: Number(this.unitBudgetInput()) || 0,
        timesPerYear: Number(this.timesPerYearInput()) || 1,
      },
    });
    this.isEditingBudget.set(false);
  }
}

