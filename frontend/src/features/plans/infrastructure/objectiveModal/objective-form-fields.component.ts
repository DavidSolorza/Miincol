import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { type EssentialArea, STAGES_BY_AREA } from '../../domain/plan.types';
import { ObjectiveGoalsFieldsComponent } from './objective-goals-fields.component';

@Component({
  selector: 'app-objective-form-fields',
  standalone: true,
  imports: [AppIconComponent, ObjectiveGoalsFieldsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3.5">
      @if (error()) {
        <div class="p-2.5 rounded-xl bg-rose-50/90 border border-rose-200/80 text-rose-800 flex items-center gap-2">
          <app-icon name="alert-circle" className="w-4 h-4 text-rose-600 shrink-0" />
          <span class="font-semibold text-xs">{{ error() }}</span>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="font-bold text-stone-700 block text-xs">Pilar PDM</label>
          <div class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-100/70 text-xs font-bold text-stone-900 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#E67324]"></span>
              {{ essentialArea() || 'Investigación' }}
            </span>
            <span class="text-[10px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">Fijo</span>
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-bold text-stone-700 block text-xs">Etapa del Pilar</label>
          <select [value]="stage() || availableStages()[0]" (change)="onStageChange($event)" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-stone-200/50 focus:border-stone-400 cursor-pointer">
            @for (st of availableStages(); track st) {
              <option [value]="st">{{ st }}</option>
            }
          </select>
        </div>
      </div>

      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">
          Título del Objetivo Estratégico <span class="text-rose-600">*</span>
        </label>
        <div class="relative">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <app-icon name="target" className="w-4 h-4 text-[#E67324]" />
          </div>
          <input
            type="text"
            [value]="title()"
            (input)="onTitleInput($event)"
            placeholder="Ej. Diagnóstico Socio-Espiritual y Cartografía..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50/40 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 text-xs text-stone-900"
            required
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">
          Descripción y Enfoque <span class="text-rose-600">*</span>
        </label>
        <textarea
          [value]="description()"
          (input)="onDescriptionInput($event)"
          rows="2"
          placeholder="Describa el propósito y alcance..."
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/40 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 text-xs text-stone-900 resize-none"
          required
        ></textarea>
      </div>

      <app-objective-goals-fields
        [shortTermGoal]="shortTermGoal()"
        [mediumTermGoal]="mediumTermGoal()"
        [longTermGoal]="longTermGoal()"
        (shortTermGoalChanged)="shortTermGoalChanged.emit($event)"
        (mediumTermGoalChanged)="mediumTermGoalChanged.emit($event)"
        (longTermGoalChanged)="longTermGoalChanged.emit($event)"
      />
    </div>
  `,
})
export class ObjectiveFormFieldsComponent {
  readonly totalObjectivesCount = input.required<number>();
  readonly error = input<string | null>(null);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly essentialArea = input<EssentialArea | undefined>();
  readonly stage = input<string | undefined>('');
  readonly shortTermGoal = input<string | undefined>('');
  readonly mediumTermGoal = input<string | undefined>('');
  readonly longTermGoal = input<string | undefined>('');

  readonly titleChanged = output<string>();
  readonly descriptionChanged = output<string>();
  readonly essentialAreaChanged = output<EssentialArea>();
  readonly stageChanged = output<string>();
  readonly shortTermGoalChanged = output<string>();
  readonly mediumTermGoalChanged = output<string>();
  readonly longTermGoalChanged = output<string>();

  readonly availableStages = computed(() => STAGES_BY_AREA[this.essentialArea() || 'Investigación'] || STAGES_BY_AREA.Investigación);

  onTitleInput(e: Event): void { this.titleChanged.emit((e.target as HTMLInputElement).value); }
  onDescriptionInput(e: Event): void { this.descriptionChanged.emit((e.target as HTMLTextAreaElement).value); }
  onStageChange(e: Event): void { this.stageChanged.emit((e.target as HTMLSelectElement).value); }
}
