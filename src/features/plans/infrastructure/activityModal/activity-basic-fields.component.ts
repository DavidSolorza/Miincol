import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { ActivityState } from '../../domain/plan.types';
import { ActivityScheduleFieldsComponent } from './activity-schedule-fields.component';

@Component({
  selector: 'app-activity-basic-fields',
  standalone: true,
  imports: [ActivityScheduleFieldsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center gap-2 pb-1 border-b border-stone-200/60">
        <span class="w-6 h-6 rounded-lg bg-[#8B251E]/10 text-[#8B251E] flex items-center justify-center font-black text-xs font-['Outfit']">
          1
        </span>
        <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
          Información Básica &amp; Alcance
        </h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Objetivo</label>
          <select
            [value]="objectiveNumber()"
            (change)="onObjectiveChange($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all font-medium text-xs text-stone-800"
          >
            <option [value]="1">Obj #1 (Mapeo e Inv.)</option>
            <option [value]="2">Obj #2 (Inmersión y Lengua)</option>
            <option [value]="3">Obj #3 (Alianzas y Redes)</option>
            <option [value]="4">Obj #4 (Planificación)</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Estado Actual</label>
          <select
            [value]="state()"
            (change)="onStateChange($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all font-bold text-xs text-stone-800"
          >
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="En Proceso">🔄 En Proceso</option>
            <option value="Completado">✅ Completado</option>
          </select>
        </div>
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">Descripción de la Actividad</label>
        <textarea
          [value]="description()"
          (input)="onDescriptionInput($event)"
          placeholder="¿Qué acción concreta se realizará en territorio con la comunidad?"
          rows="2"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
          required
        ></textarea>
      </div>

      <app-activity-schedule-fields
        [responsible]="responsible()"
        [frequency]="frequency()"
        [timesPerYear]="timesPerYear()"
        (responsibleChanged)="responsibleChanged.emit($event)"
        (frequencyChanged)="frequencyChanged.emit($event)"
        (timesPerYearChanged)="timesPerYearChanged.emit($event)"
      />
    </div>
  `,
})
export class ActivityBasicFieldsComponent {
  readonly objectiveNumber = input.required<1 | 2 | 3 | 4>();
  readonly state = input.required<ActivityState>();
  readonly description = input.required<string>();
  readonly responsible = input.required<string>();
  readonly frequency = input.required<string>();
  readonly timesPerYear = input.required<number>();

  readonly objectiveNumberChanged = output<1 | 2 | 3 | 4>();
  readonly stateChanged = output<ActivityState>();
  readonly descriptionChanged = output<string>();
  readonly responsibleChanged = output<string>();
  readonly frequencyChanged = output<string>();
  readonly timesPerYearChanged = output<number>();

  onObjectiveChange(event: Event): void {
    this.objectiveNumberChanged.emit(Number((event.target as HTMLSelectElement).value) as 1 | 2 | 3 | 4);
  }

  onStateChange(event: Event): void {
    this.stateChanged.emit((event.target as HTMLSelectElement).value as ActivityState);
  }

  onDescriptionInput(event: Event): void {
    this.descriptionChanged.emit((event.target as HTMLTextAreaElement).value);
  }
}

