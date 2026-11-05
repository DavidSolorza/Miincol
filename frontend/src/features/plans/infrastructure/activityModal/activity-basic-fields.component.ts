import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { type ActivityState, type EssentialArea, STAGES_BY_AREA } from '../../domain/plan.types';
import { ActivityScheduleFieldsComponent } from './activity-schedule-fields.component';

@Component({
  selector: 'app-activity-basic-fields',
  standalone: true,
  imports: [ActivityScheduleFieldsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center gap-2 pb-1 border-b border-stone-200/60">
        <span class="w-6 h-6 rounded-lg bg-stone-100 border border-stone-200/80 text-stone-900 flex items-center justify-center font-black text-xs font-['Outfit']">1</span>
        <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">Información Básica, Pilar &amp; Etapa</h4>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Pilar PDM</label>
          <div class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-100/70 text-xs font-bold text-stone-900 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#E67324]"></span>
              {{ essentialArea() || 'Investigación' }}
            </span>
            <span class="text-[10px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">Fijo</span>
          </div>
        </div>

        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Etapa del Pilar</label>
          <select
            [value]="stage()"
            (change)="onStageChange($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-stone-200/50 focus:border-stone-400 cursor-pointer"
          >
            @for (st of availableStages(); track st) {
              <option [value]="st">{{ st }}</option>
            }
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Objetivo Asociado</label>
          <select
            [value]="objectiveNumber()"
            (change)="onObjectiveChange($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-medium text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
          >
            <option [value]="1">Objetivo #1</option>
            <option [value]="2">Objetivo #2</option>
            <option [value]="3">Objetivo #3</option>
            <option [value]="4">Objetivo #4</option>
          </select>
        </div>

        <div>
          <label class="font-bold text-stone-700 block mb-1 text-[11px]">Estado Actual</label>
          <select
            [value]="state()"
            (change)="onStateChange($event)"
            class="w-full p-2.5 rounded-xl border border-stone-200 bg-white font-bold text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
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
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white text-xs resize-none focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
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
  readonly stage = input.required<string>();
  readonly description = input.required<string>();
  readonly responsible = input.required<string>();
  readonly frequency = input.required<string>();
  readonly timesPerYear = input.required<number>();
  readonly essentialArea = input<EssentialArea | undefined>();

  readonly objectiveNumberChanged = output<1 | 2 | 3 | 4>();
  readonly stateChanged = output<ActivityState>();
  readonly stageChanged = output<string>();
  readonly descriptionChanged = output<string>();
  readonly responsibleChanged = output<string>();
  readonly frequencyChanged = output<string>();
  readonly timesPerYearChanged = output<number>();
  readonly essentialAreaChanged = output<EssentialArea>();

  readonly availableStages = computed(() => STAGES_BY_AREA[this.essentialArea() || 'Investigación'] || STAGES_BY_AREA.Investigación);

  onObjectiveChange(event: Event): void { this.objectiveNumberChanged.emit(Number((event.target as HTMLSelectElement).value) as 1 | 2 | 3 | 4); }
  onStateChange(event: Event): void { this.stateChanged.emit((event.target as HTMLSelectElement).value as ActivityState); }
  onStageChange(event: Event): void { this.stageChanged.emit((event.target as HTMLSelectElement).value); }
  onDescriptionInput(event: Event): void { this.descriptionChanged.emit((event.target as HTMLTextAreaElement).value); }
}
