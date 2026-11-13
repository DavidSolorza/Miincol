// Estado vacío limpio cuando una fase ministerial no tiene objetivos registrados
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-phase-empty-objectives',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white/95 p-8 rounded-2xl border border-stone-200/80 shadow-2xs text-center flex flex-col items-center justify-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
        <app-icon name="target" className="w-6 h-6" />
      </div>
      <div class="max-w-md">
        <h3 class="text-sm font-bold text-stone-800 font-['Outfit']">Esta fase no tiene objetivos registrados</h3>
        <p class="text-xs text-stone-500 mt-1">
          Comienza diseñando el plan ministerial territorial agregando el primer objetivo estratégico de esta fase.
        </p>
      </div>
      @if (canEdit()) {
        <button
          type="button"
          (click)="createObjective.emit()"
          class="px-4 py-2 rounded-xl bg-[#8B251E] hover:bg-[#721F19] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs font-['Outfit'] active:scale-95"
        >
          <app-icon name="plus" className="w-4 h-4 text-white" />
          <span>Crear Primer Objetivo</span>
        </button>
      }
    </div>
  `,
})
export class PhaseEmptyObjectivesComponent {
  readonly canEdit = input<boolean>(true);
  readonly createObjective = output<void>();
}

