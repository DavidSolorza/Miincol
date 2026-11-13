import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { AdminDashboardService } from '../application/admin-dashboard.service';
import { GeneralInfoService } from '../../general-info/application/general-info.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { SuperAdminKpisGridComponent } from './superAdmin/super-admin-kpis-grid.component';
import { SuperAdminFiltersComponent } from './superAdmin/super-admin-filters.component';
import { SuperAdminTeamsGridComponent } from './superAdmin/super-admin-teams-grid.component';
import { ColombiaMapCardComponent } from './map/colombia-map-card.component';
import { TeamModalComponent } from './team-modal.component';
import { TestMailModalComponent } from './testMail/test-mail-modal.component';

@Component({
  selector: 'app-super-admin-view',
  standalone: true,
  imports: [
    SuperAdminKpisGridComponent, SuperAdminFiltersComponent,
    SuperAdminTeamsGridComponent, ColombiaMapCardComponent,
    TeamModalComponent, TestMailModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex-1 min-h-0 flex flex-col space-y-2.5 pt-0.5">
      <div class="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch gap-4 xl:gap-5">
        <div class="w-full lg:w-1/2 flex flex-col space-y-2.5 h-full min-h-0">
          <app-super-admin-kpis-grid [kpis]="dashboard.nationalKpis()" />
          <app-super-admin-filters
            [searchTerm]="dashboard.searchTerm()"
            [activeYear]="activeMinisterialYear()"
            (searchTermChange)="dashboard.searchTerm.set($event)"
            (openMailDiagnostic)="isMailModalOpen.set(true)"
            (yearChanged)="handleYearChange($event)"
            (resetTo2026)="handleYearChange(2026)"
          />
          <div class="flex-1 min-h-0 overflow-y-auto pr-1 pb-1 custom-scrollbar">
            <app-super-admin-teams-grid
              [teams]="dashboard.teams()"
              [selectedTeamId]="selectedTeamId()"
              (selectTeamId)="selectedTeamId.set($event)"
              (inspectTeam)="inspectTeam.emit($event)"
              (editTeam)="openEditModal($event)"
              (deleteTeam)="handleDeleteTeam($event)"
            />
          </div>
        </div>

        <div class="w-full lg:w-1/2 flex flex-col h-full min-h-0">
          <app-colombia-map-card
            [teams]="dashboard.teams()"
            [selectedTeamId]="selectedTeamId()"
            (selectTeamId)="selectedTeamId.set($event)"
            (inspectTeam)="inspectTeam.emit($event)"
          />
        </div>
      </div>

      <app-team-modal
        [isOpen]="isModalOpen()"
        (close)="isModalOpen.set(false)"
        (submitTeam)="handleModalSubmit($event)"
        [initialData]="editingTeam()"
      />

      <app-test-mail-modal
        [isOpen]="isMailModalOpen()"
        (close)="isMailModalOpen.set(false)"
      />
    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; width: 100%; }`],
})
export class SuperAdminViewComponent implements OnInit, OnDestroy {
  readonly dashboard = inject(AdminDashboardService);
  readonly generalInfoSvc = inject(GeneralInfoService);
  private readonly toastSvc = inject(ToastService);

  @Output() inspectTeam = new EventEmitter<string>();

  readonly isModalOpen = signal(false);
  readonly isMailModalOpen = signal(false);
  readonly editingTeam = signal<TeamSupervisionSummary | null>(null);
  readonly selectedTeamId = signal<string | null>(null);

  readonly activeMinisterialYear = computed(() => this.generalInfoSvc.currentInfo().teamData.year);

  private readonly openHandler = () => this.openCreateModal();

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('misincol:open-create-team', this.openHandler);
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('misincol:open-create-team', this.openHandler);
    }
  }

  handleYearChange(year: number): void {
    this.toastSvc.confirmAction({
      title: 'Año Ministerial Nacional',
      message: `¿Desea establecer el ciclo activo de todas las misiones en el año ${year}?`,
      confirmText: `Fijar Año ${year}`,
      cancelText: 'Cancelar',
      variant: 'default',
      onConfirm: () => {
        this.generalInfoSvc.setGlobalActiveYear(year);
        this.toastSvc.toast.success(`Año ministerial nacional establecido en ${year}`, 'Ciclo Actualizado');
      },
    });
  }

  openCreateModal() { this.editingTeam.set(null); this.isModalOpen.set(true); }
  openEditModal(team: TeamSupervisionSummary) { this.editingTeam.set(team); this.isModalOpen.set(true); }

  handleModalSubmit(dto: CreateTeamDto) {
    const editing = this.editingTeam();
    if (editing) {
      this.dashboard.handleUpdateTeam(editing.id, dto);
      this.toastSvc.toast.success(`Misión "${dto.name}" actualizada`, 'Supervisión');
    } else {
      this.dashboard.handleCreateTeam(dto);
      this.toastSvc.toast.success(`Misión "${dto.name}" creada`, 'Nueva Misión');
    }
  }

  handleDeleteTeam(team: TeamSupervisionSummary) {
    this.toastSvc.confirmAction({
      title: 'Eliminar Misión',
      message: `¿Confirma que desea eliminar la misión "${team.name}"?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
      onConfirm: () => {
        this.dashboard.handleDeleteTeam(team.id);
        this.toastSvc.toast.info(`Misión "${team.name}" eliminada`, 'Supervisión');
      },
    });
  }
}
