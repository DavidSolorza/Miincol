import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-activity-obstacles-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center gap-2 pb-1 border-b border-stone-200/60">
        <span class="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-800 flex items-center justify-center font-black text-xs font-['Outfit']">
          4
        </span>
        <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
          Dificultades y Contingencias en Territorio
        </h4>
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">
          Problemas u Obstáculos Encontrados al Realizar la Actividad
        </label>
        <p class="text-[10.5px] text-stone-500 mb-1.5 leading-tight">
          Describa dificultades climáticas, culturales, de acceso, salud o logísticas que se presenten al desarrollar esta iniciativa.
        </p>
        <textarea
          [value]="obstacles()"
          (input)="onObstaclesInput($event)"
          placeholder="Ej. Temporada de lluvias dificulta el cruce de ríos hacia la ranchería; desabastecimiento de agua en zona..."
          rows="2"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 focus:outline-hidden transition-all text-xs resize-none placeholder:text-stone-400"
        ></textarea>
      </div>
    </div>
  `,
})
export class ActivityObstaclesFieldsComponent {
  readonly obstacles = input.required<string>();
  readonly obstaclesChanged = output<string>();

  onObstaclesInput(event: Event): void {
    this.obstaclesChanged.emit((event.target as HTMLTextAreaElement).value);
  }
}

