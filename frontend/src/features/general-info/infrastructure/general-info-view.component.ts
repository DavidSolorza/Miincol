import { Component, ChangeDetectionStrategy, input, output, inject, effect, computed } from '@angular/core';
import { GeneralInfoService } from '../application/general-info.service';
import { AppSessionService } from '../../../app/auth/app-session.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';
import { GeneralBudgetTopComponent } from './components/general-budget-top.component';
import { GeneralYearCycleComponent } from './components/general-year-cycle.component';
import { GeneralEssentialsComponent } from './components/general-essentials.component';
import { GeneralAnnualTableComponent } from './components/general-annual-table.component';
import { GeneralMinisterialTrainingComponent } from './components/general-ministerial-training.component';
import { GeneralTeamFooterComponent } from './components/general-team-footer.component';
import type { MissionaryTeam } from '../../auth/domain/auth.types';

@Component({
  selector: 'app-general-info-view',
  standalone: true,
  imports: [
    AppIconComponent,
    GeneralBudgetTopComponent,
    GeneralYearCycleComponent,
    GeneralEssentialsComponent,
    GeneralAnnualTableComponent,
    GeneralMinisterialTrainingComponent,
    GeneralTeamFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full space-y-4 max-w-full overflow-x-hidden animate-fadeIn select-none font-['Outfit']">
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-stone-900">Diagnóstico e Información General de Campo</h2>
          <p class="text-[11px] text-stone-500">Misión: <strong class="text-stone-800">{{ activeTeam().name }}</strong> • Presupuesto y Ciclo Anual</p>
        </div>
        <button
          type="button"
          (click)="handleManualSave()"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8B251E] hover:bg-[#721F19] text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
          title="Guardar información general del equipo"
        >
          <app-icon name="check" className="w-3.5 h-3.5 text-white" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <app-general-budget-top
        [budget]="infoService.currentInfo().budgetBreakdown"
        [totalBudget]="infoService.totalBudget()"
        [budgetPercentage]="infoService.budgetExecutionPercentage()"
        [executedBudget]="infoService.currentInfo().budgetBreakdown.executedTotalBudget || 0"
      />

      <app-general-year-cycle
        [currentYear]="infoService.currentInfo().teamData.year"
        [isYearClosed]="infoService.currentInfo().teamData.isYearClosed || false"
        [isAdmin]="isAdmin()"
        (closeYear)="infoService.closeYear()"
        (startNextYear)="infoService.startNewYear($event)"
        (changeYear)="infoService.setActiveYear($event)"
      />

      <app-general-essentials
        [essentials]="infoService.currentInfo().essentialsToDevelop"
        [canEdit]="canEdit()"
        (essentialsChanged)="infoService.updateEssentials($event)"
      />

      <app-general-annual-table
        [metrics]="infoService.currentInfo().fieldMetrics"
        [teamData]="infoService.currentInfo().teamData"
        [history]="infoService.currentInfo().annualMetricsHistory"
        [canEdit]="canEdit()"
        (metricChanged)="infoService.updateFieldMetrics($event)"
      />

      <app-general-ministerial-training
        [training]="infoService.currentInfo().ministerialTraining"
        [church]="infoService.currentInfo().churchDevelopment"
        [canEdit]="canEdit()"
        (trainingChanged)="infoService.updateMinisterialTraining($event)"
        (churchChanged)="infoService.updateChurchDevelopment($event)"
      />

      <app-general-team-footer
        [teamData]="infoService.currentInfo().teamData"
        [canEdit]="canEdit()"
        (updateTeamData)="infoService.updateTeamData($event)"
        (removeMember)="infoService.removeMember($event)"
        (assignTask)="assignTask.emit($event)"
      />
    </div>
  `,
})
export class GeneralInfoViewComponent {
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly isAdmin = input<boolean>(false);
  readonly assignTask = output<string>();

  readonly infoService = inject(GeneralInfoService);
  private readonly sessionSvc = inject(AppSessionService);
  private readonly toastSvc = inject(ToastService);

  readonly canEdit = computed(() => {
    const role = this.sessionSvc.session()?.role;
    return role === 'admin' || role === 'team';
  });

  constructor() {
    effect(() => {
      const team = this.activeTeam();
      this.infoService.loadTeamInfo(team.id, team.name, team.leader, team.members);
    });
  }

  handleManualSave(): void {
    this.infoService.saveCurrentInfo();
    this.toastSvc.toast.success(`Información general de ${this.activeTeam().name} guardada exitosamente`, 'Guardado');
  }
}
