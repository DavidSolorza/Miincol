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
        <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Ejecutado
        </div>
        <div class="font-black text-stone-900 text-xs sm:text-sm font-mono truncate mt-0.5" [title]="fullExecuted">
          {{ formattedExecuted }}
        </div>
      </div>

      <div class="min-w-0" (click)="$event.stopPropagation(); openAudit.emit()" title="Ver bitácora de actividad">
        <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Último Acceso
        </div>
        <div class="font-bold text-stone-800 text-xs truncate mt-0.5 hover:text-[#E67324] cursor-pointer transition">
          {{ displayTime }}
        </div>
      </div>

      <div class="min-w-0">
        <div class="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Actividades
        </div>
        <div class="font-bold text-stone-800 text-xs truncate mt-0.5">
          {{ team.completedActivities }}/{{ team.totalActivities }} listas
        </div>
      </div>
    </div>
  `,
})
export class TeamCardBottomMetricsComponent {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() lastLoginTime?: string;
  @Output() openAudit = new EventEmitter<void>();

  get formattedExecuted(): string {
    return formatCompactCOP(this.team.executedBudget || 0);
  }

  get fullExecuted(): string {
    return formatCurrencyCOP(this.team.executedBudget || 0);
  }

  get displayTime(): string {
    return this.lastLoginTime ? this.lastLoginTime.replace('Hoy, ', '') : (this.team.lastUpdate || '09:00');
  }
}
