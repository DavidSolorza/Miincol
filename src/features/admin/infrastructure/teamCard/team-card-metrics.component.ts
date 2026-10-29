import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

@Component({
  selector: 'app-team-card-metrics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1.5 pt-2 border-t border-stone-100 text-left">
      <div class="flex items-center justify-between text-xs">
        <span class="text-[11px] font-black uppercase tracking-wider text-stone-400">
          FASE PDM
        </span>
        <span class="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-700">
          {{ formattedBudget }}
        </span>
      </div>

      <div class="flex items-center gap-2.5">
        <div class="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [style.width.%]="team.progressPercentage"
            [style.backgroundColor]="themeColor"
          ></div>
        </div>
        <span class="text-xs sm:text-[13px] font-black text-stone-700 shrink-0 font-['Outfit']">
          {{ team.progressPercentage }}%
        </span>
      </div>
    </div>
  `,
})
export class TeamCardMetricsComponent {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() themeColor = '#8B251E';

  get formattedBudget(): string {
    return formatCurrencyCOP(this.team.totalBudget);
  }
}

