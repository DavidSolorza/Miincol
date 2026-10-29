import { Component, ChangeDetectionStrategy, input, signal, computed, effect, inject } from '@angular/core';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import type { TeamSupervisionSummary } from '../../features/admin/domain/admin.types';
import type { PhaseType } from '../../features/plans/domain/plan.types';
import { AppSessionService } from '../auth/app-session.service';
import { PlanService } from '../../features/plans/application/plan.service';
import { AdminDashboardService } from '../../features/admin/application/admin-dashboard.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { PlanSidebarComponent } from '../../features/plans/infrastructure/plan-sidebar.component';
import { AppHeaderSectionComponent } from './app-header-section.component';
import { SuperAdminViewComponent } from '../../features/admin/infrastructure/super-admin-view.component';
import { PhaseViewComponent } from '../../features/plans/infrastructure/phase-view.component';
import { ReportModalComponent } from '../../features/reports/infrastructure/report-modal.component';
import { TeamNotesModalComponent } from '../../features/notes/infrastructure/team-notes-modal.component';
import { TeamSelectorComponent } from '../../features/auth/infrastructure/team-selector.component';

// Contenedor maestro del área de trabajo: integra Sidebar, Header, vistas (PDM / Super Admin) y modales
@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [PlanSidebarComponent, AppHeaderSectionComponent, SuperAdminViewComponent, PhaseViewComponent, ReportModalComponent, TeamNotesModalComponent, TeamSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'min-h-screen bg-[#FAF7F2] flex font-[\\'Plus_Jakarta_Sans\\'] text-stone-900 selection:bg-[#E67324]/20 selection:text-[#8B251E] ' + (sessionSvc.activeView() === 'superadmin' ? 'lg:h-screen lg:overflow-hidden' : '')">
      @if (shouldShowSidebar()) {
        <app-plan-sidebar
          [allPlans]="planService.allPlans()"
          [activePhaseId]="planService.activePhaseId()"
          [metrics]="planService.metrics()"
          [activeTeam]="activeTeam()"
          [activeView]="sessionSvc.activeView()"
          [isCollapsed]="isSidebarCollapsed()"
          [isOpenMobile]="isMobileSidebarOpen()"
          [userRole]="sessionSvc.session()!.role"
          [whatsappUrl]="whatsappUrl()"
          (selectPhase)="onSelectPhase($event)"
          (openReportModal)="isReportModalOpen.set(true)"
          (openNotesModal)="isNotesModalOpen.set(true)"
          (changeView)="sessionSvc.activeView.set($event)"
          (toggleCollapse)="isSidebarCollapsed.set(!isSidebarCollapsed())"
          (closeMobile)="isMobileSidebarOpen.set(false)"
          (logout)="sessionSvc.handleLogout()"
        />
      }

      <div [class]="'flex-1 flex flex-col min-w-0 ' + (sessionSvc.activeView() === 'superadmin' ? 'h-full lg:h-screen lg:overflow-hidden' : 'min-h-screen')">
        <app-header-section
          [isAdminPreview]="sessionSvc.isAdminPreview()"
          [activeTeam]="activeTeam()"
          [whatsappUrl]="whatsappUrl()"
          [shouldShowSidebar]="shouldShowSidebar()"
          [isSuperAdmin]="isSuperAdmin()"
          [activeView]="sessionSvc.activeView()"
          [mappedTeams]="mappedTeams()"
          [activeTeamId]="sessionSvc.activeTeamId()"
          [session]="sessionSvc.session()!"
          (backToAdmin)="sessionSvc.handleBackToAdmin()"
          (openMobileSidebar)="isMobileSidebarOpen.set(true)"
          (selectTeam)="onSelectTeam($event)"
          (goToSuperAdmin)="onGoToSuperAdmin()"
          (logout)="sessionSvc.handleLogout()"
          (openReportModal)="isReportModalOpen.set(true)"
        />

        <main [class]="'flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 ' + (sessionSvc.activeView() === 'superadmin' ? 'flex flex-col min-h-0 max-w-[1680px] py-2 sm:py-2.5' : 'max-w-[1600px] py-3.5 sm:py-4')">
          @if (sessionSvc.activeView() === 'superadmin' && isSuperAdmin()) {
            <app-super-admin-view (inspectTeam)="onInspectTeam($event)" (openReportModal)="isReportModalOpen.set(true)" />
          } @else {
            <app-phase-view
              [plan]="planService.plan()"
              [activeObjectiveNumber]="activeObjectiveNumber()"
              [activeTeam]="activeTeam()"
              (selectObjective)="activeObjectiveNumber.set($event)"
              (activityUpdated)="planService.updateActivity($event.activityId, $event.updatedFields)"
              (activityDeleted)="planService.deleteActivity($event)"
              (activityAdded)="planService.addActivity($event.objectiveNumber, $event.activity)"
              (objectiveUpdated)="planService.updateObjective($event.objectiveNumber, $event.updates)"
              (objectiveAdded)="onAddObjective($event)"
              (objectiveDeleted)="onDeleteObjective($event)"
              (resetToDefaults)="planService.resetToDefaults(activeTeamSummary())"
              (toggleMobileMenu)="isMobileSidebarOpen.set(true)"
            />
          }
        </main>
      </div>

      <app-report-modal [isOpen]="isReportModalOpen()" [plan]="planService.plan()" (closed)="isReportModalOpen.set(false)" />
      <app-team-notes-modal [isOpen]="isNotesModalOpen()" [activeTeam]="activeTeam()" (closed)="isNotesModalOpen.set(false)" />
      @if (isSuperAdmin()) {
        <app-team-selector
          [isOpen]="isTeamModalOpen()"
          [teams]="mappedTeams()"
          [activeTeamId]="activeTeam().id"
          (close)="isTeamModalOpen.set(false)"
          (selectTeam)="onModalSelectTeam($event)"
        />
      }
    </div>
  `,
})
export class AppWorkspaceComponent {
  // Inyección de servicios de sesión, planes, supervisión y notificaciones
  readonly sessionSvc = inject(AppSessionService);
  readonly planService = inject(PlanService);
  private readonly dashboardSvc = inject(AdminDashboardService);
  private readonly toastService = inject(ToastService);

  // Entradas del equipo activo y catálogo de misiones
  readonly activeTeam = input.required<MissionaryTeam>();
  readonly activeTeamSummary = input<TeamSupervisionSummary | undefined>(undefined);
  readonly mappedTeams = input.required<MissionaryTeam[]>();

  // Estado local de navegación de objetivos, modales y barra lateral
  readonly activeObjectiveNumber = signal(1);
  readonly isReportModalOpen = signal(false);
  readonly isNotesModalOpen = signal(false);
  readonly isTeamModalOpen = signal(false);
  readonly isSidebarCollapsed = signal(false);
  readonly isMobileSidebarOpen = signal(false);

  // Propiedades calculadas de permisos, visibilidad de sidebar y enlace WhatsApp del líder
  readonly isSuperAdmin = computed(() => this.sessionSvc.session()?.role === 'admin');
  readonly shouldShowSidebar = computed(() => !this.isSuperAdmin() || this.sessionSvc.activeView() === 'plans');
  readonly whatsappUrl = computed(() => {
    const clean = (this.activeTeam().leaderPhone || '').replace(/[^\d]/g, '');
    return clean ? `https://wa.me/${clean}?text=${encodeURIComponent(`Hola ${this.activeTeam().leader}, te contacto de la Coordinación de Equipos de Misincol.`)}` : null;
  });

  // Recarga automáticamente los planes cuando cambia el equipo activo
  constructor() {
    effect(() => {
      const team = this.activeTeam();
      const summary = this.activeTeamSummary();
      this.planService.loadTeamPlans(team.id, summary);
      if (summary?.currentPhaseId) this.planService.switchPhase(summary.currentPhaseId);
    });
  }

  // Manejadores de cambio de pilar, selección de misión y CRUD de objetivos
  onSelectPhase(phaseId: PhaseType): void { this.planService.switchPhase(phaseId); this.activeObjectiveNumber.set(1); }
  onSelectTeam(teamId: string): void { this.sessionSvc.activeTeamId.set(teamId); this.activeObjectiveNumber.set(1); }
  onInspectTeam(teamId: string): void { this.sessionSvc.handleInspectTeamFromAdmin(teamId, this.dashboardSvc.allTeams()); this.activeObjectiveNumber.set(1); }
  onGoToSuperAdmin(): void { this.sessionSvc.isAdminPreview.set(false); this.sessionSvc.activeView.set('superadmin'); }
  onAddObjective(newObj: { title: string; description: string }): void { const num = this.planService.addObjective(newObj); if (num) this.activeObjectiveNumber.set(num); }
  onDeleteObjective(objNum: 1 | 2 | 3 | 4): void { if (this.planService.deleteObjective(objNum)) { const rem = this.planService.plan().objectives; if (rem.length > 0) this.activeObjectiveNumber.set(rem[0].number); } }
  onModalSelectTeam(selectedId: string): void { this.onSelectTeam(selectedId); const chosen = this.mappedTeams().find((t) => t.id === selectedId); if (chosen) this.toastService.toast.info(`Misión seleccionada: ${chosen.name}`, 'Equipo Activo'); }
}
