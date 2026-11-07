import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import type { Objective } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-objective-card-header',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-black text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-xl border border-[#8B251E]/15 font-['Outfit']">
            Objetivo #{{ displayIndex() }}
          </span>
          @if (objective().essentialArea) {
            <span class="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200/70 font-['Outfit']">
              {{ objective().essentialArea }}
            </span>
          }
          @if (objective().stage) {
            <span class="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200 font-['Outfit']">
              {{ objective().stage }}
            </span>
          }
          <span class="text-xs font-semibold text-stone-400">
            • {{ completedCount() }} de {{ objective().activities.length }} listas
          </span>
          @if (canEdit()) {
            <button
              type="button"
              (click)="editObjective.emit(objective())"
              class="px-2 py-0.5 rounded-lg text-xs font-bold text-stone-500 hover:text-[#8B251E] hover:bg-[#8B251E]/10 transition flex items-center gap-1.5 cursor-pointer"
              title="Editar objetivo"
            >
              <app-icon name="pencil" className="w-4 h-4 text-[#E67324]" />
              <span>Editar</span>
            </button>
          }
        </div>

        <h2 class="text-base sm:text-lg font-black text-stone-900 mt-1.5 font-['Outfit'] tracking-tight">
          {{ objective().title }}
        </h2>
        <p class="text-xs text-stone-500 mt-1 leading-relaxed max-w-2xl font-medium">
          {{ objective().description }}
        </p>

        @if (objective().shortTermGoal || objective().mediumTermGoal || objective().longTermGoal) {
          <div class="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-600 font-medium">
            @if (objective().shortTermGoal) {
              <div class="flex items-center gap-1 bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/60">
                <span class="font-bold text-emerald-800">Meta Corto (2m):</span>
                <span>{{ objective().shortTermGoal }}</span>
              </div>
            }
            @if (objective().mediumTermGoal) {
              <div class="flex items-center gap-1 bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/60">
                <span class="font-bold text-[#8B251E]">Meta Mediano (6m):</span>
                <span>{{ objective().mediumTermGoal }}</span>
              </div>
            }
            @if (objective().longTermGoal) {
              <div class="flex items-center gap-1 bg-stone-100/80 px-2.5 py-1 rounded-lg border border-stone-200/60">
                <span class="font-bold text-amber-700">Meta Largo (1a):</span>
                <span>{{ objective().longTermGoal }}</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="flex items-center gap-2.5 shrink-0 self-start md:self-center">
        <div class="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-stone-50 border border-stone-200/80 text-right shadow-2xs">
          <span class="text-[9.5px] uppercase font-black text-stone-400 block tracking-wider leading-none">Presupuesto</span>
          <span class="text-base sm:text-lg font-black text-[#8B251E] font-['Outfit'] mt-1 block tracking-tight">
            {{ formatCurrency(totalObjectiveBudget()) }}
          </span>
        </div>

        @if (canEdit()) {
          <button
            type="button"
            (click)="openAddModal.emit()"
            class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-['Outfit'] active:scale-95"
          >
            <app-icon name="plus" className="w-4 h-4 text-[#E67324]" />
            <span class="hidden sm:inline">Nueva Actividad</span>
            <span class="sm:hidden">Nueva</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class ObjectiveCardHeaderComponent {
  readonly objective = input.required<Objective>();
  readonly index = input<number | undefined>(undefined);
  readonly completedCount = input.required<number>();
  readonly totalObjectiveBudget = input.required<number>();
  readonly canEdit = input<boolean>(true);
  readonly editObjective = output<Objective>();
  readonly openAddModal = output<void>();

  readonly displayIndex = computed(() => (this.index() !== undefined ? this.index()! + 1 : this.objective().number));

  formatCurrency(val: number): string { return formatCurrencyCOP(val); }
}
