import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-activity-goals-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
      <div class="flex items-center gap-2 pb-1 border-b border-stone-200/60">
        <span class="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-black text-xs font-['Outfit']">
          3
        </span>
        <h4 class="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
          Diagnóstico Territorial, Metas &amp; Obstáculos
        </h4>
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">
          Situación Actual (Diagnóstico Territorial)
        </label>
        <textarea
          [value]="currentSituation()"
          (input)="onCurrentSituationInput($event)"
          placeholder="¿Cuál es la realidad inicial observada en la comunidad?"
          rows="2"
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
        ></textarea>
      </div>

      <div class="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-stone-200/80 space-y-2.5">
        <span class="text-[10px] font-black uppercase tracking-wider text-[#8B251E] block font-['Outfit']">
          Metas Proyectadas (Plazos de Ejecución)
        </span>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div>
            <label class="font-bold text-stone-700 block mb-1 text-[11px]">
              A Corto Plazo (3 - 6 Meses)
            </label>
            <textarea
              [value]="shortTermGoal()"
              (input)="onShortTermInput($event)"
              placeholder="Primeros acuerdos y contactos..."
              rows="2"
              class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
            ></textarea>
          </div>

          <div>
            <label class="font-bold text-stone-700 block mb-1 text-[11px]">
              A Mediano Plazo (1 Año)
            </label>
            <textarea
              [value]="mediumTermGoal()"
              (input)="onMediumTermInput($event)"
              placeholder="Logro verificable en el primer año..."
              rows="2"
              class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
            ></textarea>
          </div>

          <div>
            <label class="font-bold text-stone-700 block mb-1 text-[11px]">
              A Largo Plazo (3 - 5 Años)
            </label>
            <textarea
              [value]="longTermGoal()"
              (input)="onLongTermInput($event)"
              placeholder="Consolidación y autonomía..."
              rows="2"
              class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div>
        <label class="font-bold text-stone-700 block mb-1 text-[11px]">
          Dificultades / Obstáculos Territoriales
        </label>
        <input
          type="text"
          [value]="obstacles()"
          (input)="onObstaclesInput($event)"
          placeholder="Clima, vías, idioma, oposición..."
          class="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
        />
      </div>
    </div>
  `,
})
// Sección del formulario de actividad para registrar diagnóstico actual, metas por plazo y obstáculos
export class ActivityGoalsFieldsComponent {
  readonly currentSituation = input.required<string>(); // Diagnóstico o situación actual en territorio
  readonly shortTermGoal = input.required<string>(); // Meta proyectada a corto plazo (3 a 6 meses)
  readonly mediumTermGoal = input.required<string>(); // Meta proyectada a mediano plazo (1 año)
  readonly longTermGoal = input.required<string>(); // Meta proyectada a largo plazo (3 a 5 años)
  readonly obstacles = input.required<string>(); // Dificultades u obstáculos territoriales identificados

  readonly currentSituationChanged = output<string>(); // Emite cambios en la situación actual
  readonly shortTermGoalChanged = output<string>(); // Emite cambios en la meta a corto plazo
  readonly mediumTermGoalChanged = output<string>(); // Emite cambios en la meta a mediano plazo
  readonly longTermGoalChanged = output<string>(); // Emite cambios en la meta a largo plazo
  readonly obstaclesChanged = output<string>(); // Emite cambios en los obstáculos registrados

  // Emite el texto actualizado del diagnóstico actual
  onCurrentSituationInput(event: Event): void {
    this.currentSituationChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  // Emite el texto actualizado de la meta a corto plazo
  onShortTermInput(event: Event): void {
    this.shortTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  // Emite el texto actualizado de la meta a mediano plazo
  onMediumTermInput(event: Event): void {
    this.mediumTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  // Emite el texto actualizado de la meta a largo plazo
  onLongTermInput(event: Event): void {
    this.longTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  // Emite el texto actualizado del campo de dificultades u obstáculos
  onObstaclesInput(event: Event): void {
    this.obstaclesChanged.emit((event.target as HTMLInputElement).value);
  }
}

