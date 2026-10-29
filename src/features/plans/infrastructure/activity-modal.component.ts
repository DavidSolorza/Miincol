import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect, inject } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal.component';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { ToastService } from '../../../shared/components/toast/toast.service';
import type { Activity } from '../domain/plan.types';
import { calculateWeeks } from '../../../shared/utils/formatters';
import { getInitialFormValues, validateActivityForm } from './activityModal/activityModalDefaults';
import { ActivityBasicFieldsComponent } from './activityModal/activity-basic-fields.component';
import { ActivityBudgetDatesFieldsComponent } from './activityModal/activity-budget-dates-fields.component';
import { ActivityGoalsFieldsComponent } from './activityModal/activity-goals-fields.component';

type ActivityFormState = ReturnType<typeof getInitialFormValues>;

@Component({
  selector: 'app-activity-modal',
  standalone: true,
  imports: [
    ModalComponent,
    AppIconComponent,
    ActivityBasicFieldsComponent,
    ActivityBudgetDatesFieldsComponent,
    ActivityGoalsFieldsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="mode() === 'edit' ? 'Editar Actividad / Sub-Objetivo' : 'Nueva Iniciativa / Actividad Ministerial'"
      [subtitle]="
        mode() === 'edit'
          ? 'Modifique cualquier información de la actividad, presupuesto, cronograma territorial o diagnóstico'
          : 'Complete los campos para registrar una acción en el Plan de Desarrollo Ministerial'
      "
      maxWidth="2xl"
      (closed)="closed.emit()"
    >
      <form (submit)="handleSubmit($event)" novalidate class="space-y-4 text-xs">
        <app-activity-basic-fields
          [objectiveNumber]="form().objectiveNumber"
          [state]="form().state"
          [description]="form().description"
          [responsible]="form().responsible"
          [frequency]="form().frequency"
          [timesPerYear]="form().timesPerYear"
          (objectiveNumberChanged)="patchField('objectiveNumber', $event)"
          (stateChanged)="patchField('state', $event)"
          (descriptionChanged)="patchField('description', $event)"
          (responsibleChanged)="patchField('responsible', $event)"
          (frequencyChanged)="patchField('frequency', $event)"
          (timesPerYearChanged)="patchField('timesPerYear', $event)"
        />

        <app-activity-budget-dates-fields
          [unitBudget]="form().unitBudget"
          [calculatedTotal]="calculatedTotal()"
          [startDate]="form().startDate"
          [endDate]="form().endDate"
          (unitBudgetChanged)="patchField('unitBudget', $event)"
          (startDateChanged)="patchField('startDate', $event)"
          (endDateChanged)="patchField('endDate', $event)"
        />

        <app-activity-goals-fields
          [currentSituation]="form().currentSituation"
          [shortTermGoal]="form().shortTermGoal"
          [mediumTermGoal]="form().mediumTermGoal"
          [longTermGoal]="form().longTermGoal"
          [obstacles]="form().obstacles"
          (currentSituationChanged)="patchField('currentSituation', $event)"
          (shortTermGoalChanged)="patchField('shortTermGoal', $event)"
          (mediumTermGoalChanged)="patchField('mediumTermGoal', $event)"
          (longTermGoalChanged)="patchField('longTermGoal', $event)"
          (obstaclesChanged)="patchField('obstacles', $event)"
        />

        <div class="sticky bottom-0 bg-white/95 backdrop-blur-xs flex items-center justify-end gap-2.5 pt-3 pb-1 border-t border-stone-200/60 z-10">
          <button
            type="button"
            (click)="closed.emit()"
            class="px-4 py-2 rounded-xl border border-stone-200/80 text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 active:scale-95 cursor-pointer font-['Outfit']"
          >
            <app-icon [name]="mode() === 'edit' ? 'check' : 'plus-circle'" className="w-4 h-4" />
            <span>{{ mode() === 'edit' ? 'Guardar Cambios' : 'Guardar Iniciativa' }}</span>
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class ActivityModalComponent {
  private readonly toastService = inject(ToastService);

  readonly isOpen = input.required<boolean>();
  readonly mode = input<'create' | 'edit'>('create');
  readonly activityToEdit = input<Activity | null>(null);
  readonly defaultObjectiveNumber = input.required<1 | 2 | 3 | 4>();

  readonly closed = output<void>();
  readonly saved = output<{ objectiveNumber: 1 | 2 | 3 | 4; activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'> }>();
  readonly updated = output<{ activityId: string; updatedFields: Partial<Activity> }>();

  readonly form = signal<ActivityFormState>(getInitialFormValues('create', null, 1));
  readonly calculatedTotal = computed(() => (this.form().unitBudget || 0) * (this.form().timesPerYear || 0));

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.form.set(getInitialFormValues(this.mode(), this.activityToEdit(), this.defaultObjectiveNumber()));
      }
    });
  }

  patchField<K extends keyof ActivityFormState>(key: K, value: ActivityFormState[K]): void {
    this.form.update((prev) => ({ ...prev, [key]: value }));
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    const f = this.form();
    if (!validateActivityForm(f.description, f.responsible)) {
      this.toastService.toast.warning('Por favor complete la descripción y el responsable de la actividad.', 'Campos Requeridos');
      return;
    }
    const { totalWeeks, remainingWeeks } = calculateWeeks(f.startDate, f.endDate);
    const payload = { ...f, totalWeeks, remainingWeeks };
    const editing = this.activityToEdit();
    if (this.mode() === 'edit' && editing) {
      this.updated.emit({ activityId: editing.id, updatedFields: payload });
      this.toastService.toast.success('Actividad actualizada correctamente con todos los cambios', 'Actividad Modificada');
    } else {
      this.saved.emit({ objectiveNumber: f.objectiveNumber, activity: payload });
      this.toastService.toast.success('Nueva actividad guardada correctamente en el plan', 'Actividad Creada');
    }
    this.closed.emit();
  }
}
