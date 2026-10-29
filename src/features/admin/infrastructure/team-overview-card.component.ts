import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, OnDestroy, signal } from '@angular/core';
import type { TeamSupervisionSummary } from '../domain/admin.types';
import { calculateTeamTelemetry } from '../../audit/application/auditStorage';
import { serviceBus, type ServiceBusSubscription } from '../../../core/bus';
import { TeamCardHeaderComponent } from './teamCard/team-card-header.component';
import { TeamCardMetricsComponent } from './teamCard/team-card-metrics.component';
import { TeamCardBottomMetricsComponent } from './teamCard/team-card-bottom-metrics.component';
import { TeamAuditModalComponent } from '../../audit/infrastructure/team-audit-modal.component';

@Component({
  selector: 'app-team-overview-card',
  standalone: true,
  imports: [
    TeamCardHeaderComponent,
    TeamCardMetricsComponent,
    TeamCardBottomMetricsComponent,
    TeamAuditModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      (click)="select.emit()"
      [style.borderTopColor]="themeColor"
      style="border-top-width: 3.5px"
      [class]="'bg-white rounded-2xl border-x border-b transition-all duration-200 p-5 flex flex-col justify-between space-y-3.5 relative overflow-hidden group cursor-pointer h-full ' + (isSelected ? 'border-[#E67324] ring-2 ring-[#E67324]/30 shadow-md' : 'border-stone-200/90 hover:border-stone-300 hover:shadow-md')"
    >
      <app-team-card-header
        [team]="team"
        [themeColor]="themeColor"
        (edit)="editTeam.emit(team)"
        (inspect)="inspectTeam.emit(team.id)"
      />

      <app-team-card-metrics
        [team]="team"
        [themeColor]="themeColor"
      />

      <app-team-card-bottom-metrics
        [team]="team"
        [lastLoginTime]="lastLoginFormatted()"
        (openAudit)="isAuditModalOpen.set(true)"
      />

      <app-team-audit-modal
        [isOpen]="isAuditModalOpen()"
        (close)="isAuditModalOpen.set(false)"
        [teamId]="team.id"
        [teamName]="team.name"
        [leaderName]="team.leader"
      />
    </div>
  `,
})
export class TeamOverviewCardComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) team!: TeamSupervisionSummary;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<void>();
  @Output() inspectTeam = new EventEmitter<string>();
  @Output() editTeam = new EventEmitter<TeamSupervisionSummary>();

  readonly isAuditModalOpen = signal(false);
  readonly lastLoginFormatted = signal('Hoy, 09:00');
  private sub?: ServiceBusSubscription;

  get themeColor(): string {
    return this.team.themeColor || '#8B251E';
  }

  constructor() {
    this.sub = serviceBus.subscribe('audit:log', (payload) => {
      if (this.team && payload.teamId === this.team.id) {
        this.refreshTelemetry();
      }
    });
  }

  ngOnChanges() {
    if (this.team) this.refreshTelemetry();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private refreshTelemetry() {
    const t = calculateTeamTelemetry(this.team.id, this.team.leader);
    this.lastLoginFormatted.set(t.lastLoginFormatted);
  }
}

