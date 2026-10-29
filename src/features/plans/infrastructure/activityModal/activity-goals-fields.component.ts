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
export class ActivityGoalsFieldsComponent {
  readonly currentSituation = input.required<string>();
  readonly shortTermGoal = input.required<string>();
  readonly mediumTermGoal = input.required<string>();
  readonly longTermGoal = input.required<string>();
  readonly obstacles = input.required<string>();

  readonly currentSituationChanged = output<string>();
  readonly shortTermGoalChanged = output<string>();
  readonly mediumTermGoalChanged = output<string>();
  readonly longTermGoalChanged = output<string>();
  readonly obstaclesChanged = output<string>();

  onCurrentSituationInput(event: Event): void {
    this.currentSituationChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  onShortTermInput(event: Event): void {
    this.shortTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  onMediumTermInput(event: Event): void {
    this.mediumTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  onLongTermInput(event: Event): void {
    this.longTermGoalChanged.emit((event.target as HTMLTextAreaElement).value);
  }

  onObstaclesInput(event: Event): void {
    this.obstaclesChanged.emit((event.target as HTMLInputElement).value);
  }
}

