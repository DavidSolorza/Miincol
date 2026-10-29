import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, OnDestroy, inject, signal } from '@angular/core';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { AdminDashboardService } from '../application/admin-dashboard.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { SuperAdminKpisGridComponent } from './superAdmin/super-admin-kpis-grid.component';
import { SuperAdminFiltersComponent } from './superAdmin/super-admin-filters.component';
import { SuperAdminTeamsGridComponent } from './superAdmin/super-admin-teams-grid.component';
import { ColombiaMapCardComponent } from './map/colombia-map-card.component';
import { TeamModalComponent } from './team-modal.component';

@Component({
  selector: 'app-super-admin-view',
  standalone: true,
  imports: [
    SuperAdminKpisGridComponent,
    SuperAdminFiltersComponent,
    SuperAdminTeamsGridComponent,
    ColombiaMapCardComponent,
    TeamModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full flex-1 min-h-0 flex flex-col space-y-2.5 pt-0.5">
      <div class="flex-1 min-h-0 flex flex-col lg:flex-row items-stretch gap-4 xl:gap-5">
        <div class="w-full lg:w-1/2 flex flex-col space-y-2.5 h-full min-h-0">
          <app-super-admin-kpis-grid [kpis]="dashboard.nationalKpis()" />
          <app-super-admin-filters
            [searchTerm]="dashboard.searchTerm()"
            (searchTermChange)="dashboard.searchTerm.set($event)"
          />
          <div class="flex-1 min-h-0 overflow-y-auto pr-1 pb-1 custom-scrollbar">
            <app-super-admin-teams-grid
              [teams]="dashboard.teams()"
              [selectedTeamId]="selectedTeamId()"
              (selectTeamId)="selectedTeamId.set($event)"
              (inspectTeam)="inspectTeam.emit($event)"
              (editTeam)="openEditModal($event)"
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
    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; flex: 1; min-height: 0; width: 100%; }`],
})
export class SuperAdminViewComponent implements OnInit, OnDestroy {
  readonly dashboard = inject(AdminDashboardService);
  private readonly toastSvc = inject(ToastService);

  @Output() inspectTeam = new EventEmitter<string>();

  readonly isModalOpen = signal(false);
  readonly editingTeam = signal<TeamSupervisionSummary | null>(null);
  readonly selectedTeamId = signal<string | null>(null);

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

  openCreateModal() {
    this.editingTeam.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(team: TeamSupervisionSummary) {
    this.editingTeam.set(team);
    this.isModalOpen.set(true);
  }

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
}

