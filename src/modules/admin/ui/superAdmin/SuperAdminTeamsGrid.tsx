import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import type { PhaseType } from '../../../plans/domain/plan.types';
import { TeamOverviewCard } from '../TeamOverviewCard';

interface Props {
  teams: TeamSupervisionSummary[];
  selectedTeamId: string | null;
  onSelectTeamId: (id: string) => void;
  onInspectTeam: (id: string) => void;
  onEditTeam: (team: TeamSupervisionSummary) => void;
  onDeleteTeam: (id: string) => void;
  onPhaseChange: (id: string, phase: PhaseType) => void;
}

export const SuperAdminTeamsGrid: React.FC<Props> = ({
  teams,
  selectedTeamId,
  onSelectTeamId,
  onInspectTeam,
  onEditTeam,
  onDeleteTeam,
  onPhaseChange,
}) => (
  <div className="w-full lg:w-[56%] xl:w-[58%] grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
    {teams.map((team) => (
      <TeamOverviewCard
        key={team.id}
        team={team}
        isSelected={selectedTeamId === team.id}
        onSelect={() => onSelectTeamId(team.id)}
        onInspectTeam={onInspectTeam}
        onEditTeam={onEditTeam}
        onDeleteTeam={onDeleteTeam}
        onPhaseChange={onPhaseChange}
      />
    ))}
  </div>
);
