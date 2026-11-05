import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { type EssentialArea, STAGES_BY_AREA } from '../../domain/plan.types';

@Component({
  selector: 'app-objective-form-fields',
  standalone: true,
  imports: [AppIconComponent],
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
          <label class="font-bold text-stone-700 block text-xs">Pilar / Área</label>
          <select [value]="essentialArea() || 'Investigación'" (change)="onAreaChange($event)" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20">
            <option value="Investigación">Investigación</option>
            <option value="Encarnación">Encarnación</option>
            <option value="Evangelización">Evangelización</option>
            <option value="Entrenamiento">Entrenamiento</option>
            <option value="Autocuidado">Autocuidado</option>
            <option value="General">Ejes Transversales</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="font-bold text-stone-700 block text-xs">Etapa del Pilar</label>
          <select [value]="stage() || availableStages()[0]" (change)="onStageChange($event)" class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20">
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

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="font-bold text-stone-700 block text-xs">Meta a Mediano Plazo</label>
          <input
            type="text"
            [value]="mediumTermGoal() || ''"
            (input)="onMediumGoalInput($event)"
            placeholder="Ej. 10 estudios bíblicos establecidos"
            class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
          />
        </div>
        <div class="space-y-1">
          <label class="font-bold text-stone-700 block text-xs">Meta a Largo Plazo</label>
          <input
            type="text"
            [value]="longTermGoal() || ''"
            (input)="onLongGoalInput($event)"
            placeholder="Ej. 2 nuevas comunidades de fe"
            class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
          />
        </div>
      </div>
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
  readonly mediumTermGoal = input<string | undefined>('');
  readonly longTermGoal = input<string | undefined>('');

  readonly titleChanged = output<string>();
  readonly descriptionChanged = output<string>();
  readonly essentialAreaChanged = output<EssentialArea>();
  readonly stageChanged = output<string>();
  readonly mediumTermGoalChanged = output<string>();
  readonly longTermGoalChanged = output<string>();

  readonly availableStages = computed(() => STAGES_BY_AREA[this.essentialArea() || 'Investigación'] || STAGES_BY_AREA.Investigación);

  onTitleInput(e: Event): void { this.titleChanged.emit((e.target as HTMLInputElement).value); }
  onDescriptionInput(e: Event): void { this.descriptionChanged.emit((e.target as HTMLTextAreaElement).value); }
  onStageChange(e: Event): void { this.stageChanged.emit((e.target as HTMLSelectElement).value); }
  onAreaChange(e: Event): void {
    const a = (e.target as HTMLSelectElement).value as EssentialArea;
    this.essentialAreaChanged.emit(a);
    this.stageChanged.emit((STAGES_BY_AREA[a] || STAGES_BY_AREA.Investigación)[0]);
  }
  onMediumGoalInput(e: Event): void { this.mediumTermGoalChanged.emit((e.target as HTMLInputElement).value); }
  onLongGoalInput(e: Event): void { this.longTermGoalChanged.emit((e.target as HTMLInputElement).value); }
}
