import React, { useState } from 'react';
import type { TeamSupervisionSummary, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { TeamCardHeader } from './teamCard/TeamCardHeader';
import { TeamCardMetrics } from './teamCard/TeamCardMetrics';
import { TeamCardBottomMetrics } from './teamCard/TeamCardBottomMetrics';
import { useTeamAudit } from '../../audit/application/useTeamAudit';
import { TeamAuditModal } from '../../audit/infrastructure/TeamAuditModal';

interface TeamOverviewCardProps {
  team: TeamSupervisionSummary;
  onInspectTeam: (teamId: string) => void;
  onEditTeam?: (team: TeamSupervisionSummary) => void;
  onDeleteTeam?: (teamId: string) => void;
  onPhaseChange?: (teamId: string, phase: PhaseType) => void;
  onStatusChange?: (teamId: string, status: TeamHealthStatus) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TeamOverviewCard: React.FC<TeamOverviewCardProps> = React.memo(({
  team,
  onInspectTeam,
  onEditTeam,
  isSelected,
  onSelect,
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const { telemetry } = useTeamAudit(team.id, team.leader);
  const themeColor = team.themeColor || '#8B251E';

  return (
    <div
      onClick={onSelect}
      style={{ borderTopColor: themeColor, borderTopWidth: '3.5px' }}
      className={`bg-white rounded-2xl border-x border-b transition-all duration-200 p-5 flex flex-col justify-between space-y-3.5 relative overflow-hidden group cursor-pointer ${
        isSelected
          ? 'border-[#E67324] ring-2 ring-[#E67324]/30 shadow-md'
          : 'border-stone-200/90 hover:border-stone-300 hover:shadow-md'
      }`}
    >

      <TeamCardHeader
        team={team}
        themeColor={themeColor}
        onEdit={onEditTeam ? () => onEditTeam(team) : undefined}
        onInspect={() => onInspectTeam(team.id)}
      />

      <TeamCardMetrics
        team={team}
        themeColor={themeColor}
      />

      <TeamCardBottomMetrics
        team={team}
        lastLoginTime={telemetry.lastLoginFormatted}
        onOpenAudit={() => setIsAuditModalOpen(true)}
      />

      <TeamAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        teamId={team.id}
        teamName={team.name}
        leaderName={team.leader}
      />
    </div>
  );
});
