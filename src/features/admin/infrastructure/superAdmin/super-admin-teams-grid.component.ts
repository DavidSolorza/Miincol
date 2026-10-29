import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { TeamOverviewCardComponent } from '../team-overview-card.component';

@Component({
  selector: 'app-super-admin-teams-grid',
  standalone: true,
  imports: [TeamOverviewCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4.5">
      @for (team of teams; track team.id) {
        <app-team-overview-card
          [team]="team"
          [isSelected]="selectedTeamId === team.id"
          (select)="selectTeamId.emit(team.id)"
          (inspectTeam)="inspectTeam.emit($event)"
          (editTeam)="editTeam.emit($event)"
        />
      }
    </div>
  `,
})
export class SuperAdminTeamsGridComponent {
  @Input() teams: TeamSupervisionSummary[] = [];
  @Input() selectedTeamId: string | null = null;
  @Output() selectTeamId = new EventEmitter<string>();
  @Output() inspectTeam = new EventEmitter<string>();
  @Output() editTeam = new EventEmitter<TeamSupervisionSummary>();
}

