import { Component, ChangeDetectionStrategy, input, inject, effect } from '@angular/core';
import { GeneralInfoService } from '../application/general-info.service';
import { GeneralTeamCardComponent } from './components/general-team-card.component';
import { GeneralFieldMetricsCardComponent } from './components/general-field-metrics-card.component';
import { GeneralBudgetCardComponent } from './components/general-budget-card.component';
import type { MissionaryTeam } from '../../auth/domain/auth.types';

@Component({
  selector: 'app-general-info-view',
  standalone: true,
  imports: [GeneralTeamCardComponent, GeneralFieldMetricsCardComponent, GeneralBudgetCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-4 max-w-full overflow-x-hidden animate-fadeIn">
      <div class="flex flex-wrap items-center justify-between gap-2 bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <span class="text-[10px] font-black uppercase text-[#8B251E] tracking-widest block font-['Outfit']">MISINCOL • Vista Macro</span>
          <h2 class="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] leading-tight">
            Información General: {{ activeTeam().name }}
          </h2>
        </div>
        <div class="text-right text-xs text-stone-500">
          <span>Actualizado: </span>
          <strong class="text-stone-800">{{ infoService.currentInfo().updatedAt.slice(0, 10) }}</strong>
        </div>
      </div>

      <app-general-team-card
        [teamData]="infoService.currentInfo().teamData"
        (removeMember)="infoService.removeMember($event)"
        (addMember)="infoService.addMember($event)"
      />

      <app-general-field-metrics-card
        [metrics]="infoService.currentInfo().fieldMetrics"
      />

      <app-general-budget-card
        [budget]="infoService.currentInfo().budgetBreakdown"
        [totalBudget]="infoService.totalBudget()"
      />
    </div>
  `,
})
export class GeneralInfoViewComponent {
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly infoService = inject(GeneralInfoService);

  constructor() {
    effect(() => {
      const team = this.activeTeam();
      this.infoService.loadTeamInfo(team.id, team.name, team.leader);
    });
  }
}

