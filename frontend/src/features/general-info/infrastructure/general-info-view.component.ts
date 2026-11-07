import { Component, ChangeDetectionStrategy, input, output, inject, effect, computed } from '@angular/core';
import { GeneralInfoService } from '../application/general-info.service';
import { AppSessionService } from '../../../app/auth/app-session.service';
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
      <!-- 1. Presupuestos por Pilar en la parte Superior con Barra de % -->
      <app-general-budget-top
        [budget]="infoService.currentInfo().budgetBreakdown"
        [totalBudget]="infoService.totalBudget()"
        [budgetPercentage]="infoService.budgetExecutionPercentage()"
      />

      <!-- 2. Ciclo Anual (Cerrar / Iniciar nuevo año con autorización de Administrador) -->
      <app-general-year-cycle
        [currentYear]="infoService.currentInfo().teamData.year"
        [isYearClosed]="infoService.currentInfo().teamData.isYearClosed || false"
        [isAdmin]="isAdmin()"
        (closeYear)="infoService.closeYear()"
        (startNextYear)="infoService.startNewYear($event)"
      />

      <!-- 3. Esenciales a Desarrollar (1 a 5) -->
      <app-general-essentials
        [essentials]="infoService.currentInfo().essentialsToDevelop"
        [canEdit]="canEdit()"
        (essentialsChanged)="infoService.updateEssentials($event)"
      />

      <!-- 4. Vista General en Tabla Multianual (Modelo Excel Oficial) -->
      <app-general-annual-table
        [metrics]="infoService.currentInfo().fieldMetrics"
        [teamData]="infoService.currentInfo().teamData"
        [canEdit]="canEdit()"
        (metricChanged)="infoService.updateFieldMetrics($event)"
      />

      <!-- 5. Entrenamiento Ministerial & Desarrollo Eclesial (Items Grandes y Editables) -->
      <app-general-ministerial-training
        [training]="infoService.currentInfo().ministerialTraining"
        [church]="infoService.currentInfo().churchDevelopment"
        [canEdit]="canEdit()"
        (trainingChanged)="infoService.updateMinisterialTraining($event)"
        (churchChanged)="infoService.updateChurchDevelopment($event)"
      />

      <!-- 6. Información de Campo y Datos de Equipo en la Parte Inferior (Editable Admin y Líder) -->
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

  readonly canEdit = computed(() => {
    const role = this.sessionSvc.session()?.role;
    return role === 'admin' || role === 'team';
  });

  constructor() {
    effect(() => {
      const team = this.activeTeam();
      this.infoService.loadTeamInfo(team.id, team.name, team.leader, team.members);
    }, { allowSignalWrites: true });
  }
}
