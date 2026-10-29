import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

const formatCompactCOP = (amount: number): string => {
  if (amount >= 1_000_000) return `$ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$ ${(amount / 1_000).toFixed(0)}k`;
  return `$ ${amount}`;
};

@Component({
  selector: 'app-team-card-bottom-metrics',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-3 gap-2 pt-2.5 mt-1 border-t border-stone-100 text-left">
      <div class="min-w-0">
        <div class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Budget
        </div>
        <div class="font-black text-stone-900 text-sm sm:text-base font-mono truncate mt-0.5" [title]="fullBudget">
          {{ formattedBudget }}
        </div>
      </div>

      <div class="min-w-0" (click)="$event.stopPropagation(); openAudit.emit()" title="Ver bitácora de actividad">
        <div class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Last Access
        </div>
        <div class="font-bold text-stone-800 text-xs sm:text-sm truncate mt-0.5 hover:text-[#E67324] cursor-pointer transition">
          {{ displayTime }}
        </div>
      </div>

      <div class="min-w-0 flex flex-col items-start">
        <div class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Critical Alerts
        </div>
        <div class="mt-0.5 flex items-center">
          @if (team.criticalAlert) {
            <div class="inline-flex items-center text-rose-600" [title]="team.criticalAlert.message">
              <app-icon name="alert-triangle" className="w-4.5 h-4.5 fill-rose-500 text-rose-500 shrink-0" />
            </div>
          } @else {
            <span class="text-stone-300 font-bold text-xs">—</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class TeamCardBottomMetricsComponent {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() lastLoginTime?: string;
  @Output() openAudit = new EventEmitter<void>();

  get targetBudget(): number {
    const executed = this.team.totalBudget * (this.team.progressPercentage / 100);
    return executed > 0 ? executed : this.team.totalBudget;
  }

  get formattedBudget(): string {
    return formatCompactCOP(this.targetBudget);
  }

  get fullBudget(): string {
    return formatCurrencyCOP(this.targetBudget);
  }

  get displayTime(): string {
    return this.lastLoginTime ? this.lastLoginTime.replace('Hoy, ', '') : (this.team.lastUpdate || '09:00');
  }
}

