import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { Activity } from '../../domain/plan.types';

@Component({
  selector: 'app-activity-details-accordion',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-5 py-4 bg-[#FAF7F2]/80 border-t border-stone-200/60 text-xs text-stone-700 space-y-3 animate-fadeIn">
      <div [class]="'grid grid-cols-1 gap-3 ' + (activity().shortTermGoal ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3')">
        <div class="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
          <div class="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
            <app-icon name="file-text" className="w-4 h-4 text-[#8B251E]" />
            <span>Situación Actual (Diagnóstico)</span>
          </div>
          <p class="text-stone-600 leading-relaxed">
            {{ activity().currentSituation || 'Sin diagnóstico registrado.' }}
          </p>
        </div>

        @if (activity().shortTermGoal) {
          <div class="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
            <div class="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
              <app-icon name="target" className="w-4 h-4 text-amber-600" />
              <span>Meta Corto Plazo (3-6m)</span>
            </div>
            <p class="text-stone-600 leading-relaxed">
              {{ activity().shortTermGoal }}
            </p>
          </div>
        }

        <div class="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
          <div class="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
            <app-icon name="target" className="w-4 h-4 text-[#E67324]" />
            <span>Meta a Mediano Plazo (1 Año)</span>
          </div>
          <p class="text-stone-600 leading-relaxed">
            {{ activity().mediumTermGoal || 'Meta no especificada.' }}
          </p>
        </div>

        <div class="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
          <div class="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
            <app-icon name="target" className="w-4 h-4 text-emerald-700" />
            <span>Meta a Largo Plazo (3 - 5 Años)</span>
          </div>
          <p class="text-stone-600 leading-relaxed">
            {{ activity().longTermGoal || 'Visión a largo plazo sin definir.' }}
          </p>
        </div>
      </div>

      @if (activity().obstacles) {
        <div class="flex items-start gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-amber-950">
          <app-icon name="alert-triangle" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold text-[11px] uppercase tracking-wider text-amber-900 block">
              Dificultades y Contingencias Territoriales:
            </span>
            <p class="text-amber-950 mt-0.5 leading-relaxed">{{ activity().obstacles }}</p>
          </div>
        </div>
      }

      <div class="flex justify-end pt-1">
        <button
          type="button"
          (click)="edited.emit()"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 font-bold text-xs border border-stone-200/80 shadow-2xs transition cursor-pointer"
        >
          <app-icon name="edit-3" className="w-4 h-4 text-[#8B251E]" />
          <span>Editar Toda la Actividad</span>
        </button>
      </div>
    </div>
  `,
})
export class ActivityDetailsAccordionComponent {
  readonly activity = input.required<Activity>();
  readonly edited = output<void>();
}

