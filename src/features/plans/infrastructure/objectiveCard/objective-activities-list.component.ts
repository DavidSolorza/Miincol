import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { Activity } from '../../domain/plan.types';
import { ActivityItemComponent } from '../activity-item.component';

@Component({
  selector: 'app-objective-activities-list',
  standalone: true,
  imports: [AppIconComponent, ActivityItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-5 sm:p-6 space-y-3 bg-[#FAF7F2]/40 min-h-[160px]">
      @if (activities().length === 0) {
        <div class="bg-white rounded-xl border border-dashed border-stone-200 p-8 text-center flex flex-col items-center justify-center">
          <div class="w-11 h-11 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#E67324] mb-2">
            <app-icon name="layers" className="w-6 h-6" />
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-stone-700">No hay actividades visibles</h4>
          <p class="text-xs text-stone-400 max-w-xs mt-0.5">
            No coinciden con el filtro actual o aún no se han registrado en este objetivo.
          </p>
          <button
            type="button"
            (click)="openAddModal.emit(objectiveNumber())"
            class="mt-3 text-xs font-bold text-[#8B251E] hover:text-[#731E18] flex items-center gap-1.5 cursor-pointer"
          >
            <app-icon name="plus" className="w-4.5 h-4.5" /> Registrar primera actividad
          </button>
        </div>
      } @else {
        @for (act of activities(); track act.id) {
          <app-activity-item
            [activity]="act"
            (updated)="activityUpdated.emit($event)"
            (deleted)="activityDeleted.emit($event)"
            (edited)="activityEdited.emit($event)"
          />
        }
      }
    </div>
  `,
})
export class ObjectiveActivitiesListComponent {
  readonly activities = input.required<Activity[]>();
  readonly objectiveNumber = input.required<1 | 2 | 3 | 4>();
  readonly activityUpdated = output<{ activityId: string; updatedFields: Partial<Activity> }>();
  readonly activityDeleted = output<string>();
  readonly openAddModal = output<1 | 2 | 3 | 4>();
  readonly activityEdited = output<Activity>();
}

