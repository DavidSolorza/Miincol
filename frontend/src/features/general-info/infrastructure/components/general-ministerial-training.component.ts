import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import type { MinisterialTrainingMetrics, ChurchDevelopmentMetrics } from '../../domain/general-info.types';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-general-ministerial-training',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 font-['Outfit'] select-none text-left">
      <!-- Bloque 1: Entrenamiento Ministerial / Liderazgo -->
      <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
        <div class="flex items-center gap-2 pb-2 border-b border-stone-100">
          <div class="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-800 flex items-center justify-center font-bold">
            <app-icon name="award" className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 class="text-sm font-black text-stone-900">Entrenamiento Ministerial &amp; Liderazgo</h3>
            <p class="text-[11px] text-stone-500">Formación práctica y pastoral de obreros locales</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80">
            <span class="text-[10px] uppercase font-bold text-blue-800 block">Entrenamiento Práctico</span>
            <input type="number" [disabled]="!canEdit()" [value]="training().practicalMinisterialTrainingCount" (change)="onTrainingChange('practicalMinisterialTrainingCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-blue-200 focus:border-blue-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80">
            <span class="text-[10px] uppercase font-bold text-blue-800 block">Entrenamiento Bíblico</span>
            <input type="number" [disabled]="!canEdit()" [value]="training().biblicalTrainingCount" (change)="onTrainingChange('biblicalTrainingCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-blue-200 focus:border-blue-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80">
            <span class="text-[10px] uppercase font-bold text-blue-800 block">Pastoral Práctico</span>
            <input type="number" [disabled]="!canEdit()" [value]="training().pastoralPracticalTrainingCount" (change)="onTrainingChange('pastoralPracticalTrainingCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-blue-200 focus:border-blue-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80">
            <span class="text-[10px] uppercase font-bold text-blue-800 block">Plantación de Iglesias</span>
            <input type="number" [disabled]="!canEdit()" [value]="training().newChurchesPlantingTrainingCount" (change)="onTrainingChange('newChurchesPlantingTrainingCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-blue-200 focus:border-blue-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80">
            <span class="text-[10px] uppercase font-bold text-blue-800 block">Otras Áreas</span>
            <input type="number" [disabled]="!canEdit()" [value]="training().otherAreasTrainingCount" (change)="onTrainingChange('otherAreasTrainingCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-blue-200 focus:border-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <!-- Bloque 2: Desarrollo Eclesial -->
      <div class="bg-white/95 rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
        <div class="flex items-center gap-2 pb-2 border-b border-stone-100">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-bold">
            <app-icon name="home" className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 class="text-sm font-black text-stone-900">Desarrollo Eclesial &amp; Multiplicación</h3>
            <p class="text-[11px] text-stone-500">Nuevas congregaciones y generaciones de iglesias</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">Perspectiva Iglesia</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().groupsWithChurchPerspectiveCount" (change)="onChurchChange('groupsWithChurchPerspectiveCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-emerald-200 focus:border-emerald-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">Total Iglesias Período</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().finalChurchesCount" (change)="onChurchChange('finalChurchesCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-emerald-200 focus:border-emerald-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">1ra Generación</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().firstGenChurchesCount" (change)="onChurchChange('firstGenChurchesCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-emerald-200 focus:border-emerald-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">2da Generación</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().secondGenChurchesCount" (change)="onChurchChange('secondGenChurchesCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-emerald-200 focus:border-emerald-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
            <span class="text-[10px] uppercase font-bold text-emerald-800 block">3ra Generación</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().thirdGenChurchesCount" (change)="onChurchChange('thirdGenChurchesCount', $event)" class="text-lg sm:text-xl font-black text-stone-900 font-mono w-full bg-transparent mt-1 border-b border-emerald-200 focus:border-emerald-500 outline-none" />
          </div>

          <div class="p-3 rounded-xl bg-rose-50/40 border border-rose-100/70">
            <span class="text-[10px] uppercase font-bold text-rose-800 block">Iglesias Perdidas</span>
            <input type="number" [disabled]="!canEdit()" [value]="church().lostFirstGenChurchesCount" (change)="onChurchChange('lostFirstGenChurchesCount', $event)" class="text-lg sm:text-xl font-black text-rose-900 font-mono w-full bg-transparent mt-1 border-b border-rose-200 focus:border-rose-500 outline-none" />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GeneralMinisterialTrainingComponent {
  readonly training = input.required<MinisterialTrainingMetrics>();
  readonly church = input.required<ChurchDevelopmentMetrics>();
  readonly canEdit = input<boolean>(false);

  readonly trainingChanged = output<Partial<MinisterialTrainingMetrics>>();
  readonly churchChanged = output<Partial<ChurchDevelopmentMetrics>>();

  onTrainingChange(field: keyof MinisterialTrainingMetrics, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    this.trainingChanged.emit({ [field]: val });
  }

  onChurchChange(field: keyof ChurchDevelopmentMetrics, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value) || 0;
    this.churchChanged.emit({ [field]: val });
  }
}
