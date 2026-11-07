import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-progressive-exit-banner',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isVisible()) {
      <div class="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex items-center gap-3 animate-fadeIn shadow-2xs">
        <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
          <app-icon name="info" className="w-4 h-4 text-amber-700" />
        </div>
        <div class="text-xs font-['Outfit'] min-w-0">
          <span class="font-black uppercase tracking-wide text-amber-900">Etapa de Salida Progresiva:</span>
          <span class="text-amber-800 ml-1.5 font-medium">
            En esta etapa se inicia la salida progresiva del equipo misionero y la consolidación de la autonomía del liderazgo indígena local.
          </span>
        </div>
      </div>
    }
  `,
})
export class ProgressiveExitBannerComponent {
  readonly isVisible = input.required<boolean>();
}
