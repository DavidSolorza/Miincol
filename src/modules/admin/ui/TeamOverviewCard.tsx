import React, { useState, useEffect } from 'react';
import type { TeamSupervisionSummary, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { TeamCardHeader } from './teamCard/TeamCardHeader';
import { TeamCardMetrics } from './teamCard/TeamCardMetrics';
import { TeamCardActions } from './teamCard/TeamCardActions';
import { useTeamAudit } from '../../audit/application/useTeamAudit';
import { TeamCardTelemetry } from '../../audit/ui/TeamCardTelemetry';
import { TeamAuditModal } from '../../audit/ui/TeamAuditModal';

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
  onDeleteTeam,
  onPhaseChange,
  isSelected,
  onSelect,
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<PhaseType>(
    team.currentPhaseId || 'investigacion'
  );
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const { telemetry } = useTeamAudit(team.id, team.leader);

  useEffect(() => {
    if (team.currentPhaseId && team.currentPhaseId !== selectedPhaseId) {
      setSelectedPhaseId(team.currentPhaseId);
    }
  }, [team.currentPhaseId]);

  const handlePhaseSelect = (newPhaseId: PhaseType) => {
    setSelectedPhaseId(newPhaseId);
    onPhaseChange?.(team.id, newPhaseId);
  };

  const themeColor = team.themeColor || '#8B251E';
  const cleanPhone = team.leaderPhone.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${team.leader}, te contacto de la Dirección Nacional de Misincol para seguimiento al plan de la ${team.name}.`
  )}`;

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl border transition-all duration-200 p-3.5 sm:p-4 flex flex-col justify-between space-y-2.5 relative overflow-hidden group ${
        isSelected
          ? 'border-[#E67324] ring-2 ring-[#E67324]/30 shadow-md'
          : 'border-stone-200/80 hover:border-stone-400/80 hover:shadow-md'
      }`}
    >
      <TeamCardHeader
        team={team}
        themeColor={themeColor}
        onEdit={onEditTeam ? () => onEditTeam(team) : undefined}
        onDelete={onDeleteTeam ? () => onDeleteTeam(team.id) : undefined}
      />
      <TeamCardMetrics
        team={team}
        selectedPhaseId={selectedPhaseId}
        onPhaseSelect={handlePhaseSelect}
        themeColor={themeColor}
      />
      <TeamCardTelemetry
        telemetry={telemetry}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
      />
      <TeamCardActions
        team={team}
        onInspect={() => onInspectTeam(team.id)}
        whatsappUrl={whatsappUrl}
      />
      <TeamAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        teamId={team.id}
        teamName={team.name}
        leaderName={team.leader}
        themeColor={themeColor}
      />
    </div>
  );
});

