import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { Objective } from '../../domain/plan.types';
import { PhaseObjectiveCardItemComponent } from './phase-objective-card-item.component';

@Component({
  selector: 'app-phase-objective-cards-grid',
  standalone: true,
  imports: [AppIconComponent, PhaseObjectiveCardItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 items-stretch flex-1 h-full">
      @for (obj of objectives(); track obj.number; let i = $index) {
        <app-phase-objective-card-item
          [obj]="obj"
          [index]="i"
          [isSelected]="activeObjectiveNumber() === obj.number"
          (selected)="selectObjective.emit(obj.number)"
        />
      }

      @if (objectives().length < 4) {
        <button
          type="button"
          (click)="openCreateObjective.emit()"
          class="p-3.5 sm:p-4 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#8B251E]/40 hover:bg-[#8B251E]/5 transition flex flex-col items-center justify-center text-center gap-2 cursor-pointer group min-h-[145px] sm:min-h-[160px] h-full w-full"
        >
          <div class="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#8B251E]/10 text-stone-500 group-hover:text-[#8B251E] flex items-center justify-center transition shrink-0">
            <app-icon name="plus" className="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-bold text-stone-600 group-hover:text-[#8B251E] block">Nuevo Objetivo</span>
            <span class="text-[10px] text-stone-400">({{ objectives().length }}/4 registrados)</span>
          </div>
        </button>
      } @else {
        <div class="p-3.5 sm:p-4 rounded-xl border border-stone-200/80 bg-stone-50/70 flex flex-col items-center justify-center text-center gap-1.5 min-h-[145px] sm:min-h-[160px] h-full w-full select-none">
          <div class="w-7 h-7 rounded-full bg-stone-200/80 text-stone-600 flex items-center justify-center text-xs font-bold font-['Outfit']">
            4/4
          </div>
          <div>
            <span class="text-xs font-bold text-stone-700 block font-['Outfit']">Límite Máximo Alcanzado</span>
            <span class="text-[10px] text-stone-400 block mt-0.5">Fase completa (máx. 4 objetivos permitidos)</span>
          </div>
        </div>
      }
    </div>
  `,
})
// Cuadrícula de tarjetas resumen de los objetivos estratégicos de la fase con enumeración dinámica
export class PhaseObjectiveCardsGridComponent {
  readonly objectives = input.required<Objective[]>();
  readonly activeObjectiveNumber = input.required<number>();
  readonly selectObjective = output<number>();
  readonly openCreateObjective = output<void>();
}
