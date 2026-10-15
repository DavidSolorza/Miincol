import React, { useState, useEffect } from 'react';
import type { TeamSupervisionSummary, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { TeamCardHeader } from './teamCard/TeamCardHeader';
import { TeamCardMetrics } from './teamCard/TeamCardMetrics';
import { TeamCardActions } from './teamCard/TeamCardActions';

interface TeamOverviewCardProps {
  team: TeamSupervisionSummary;
  onInspectTeam: (teamId: string) => void;
  onEditTeam?: (team: TeamSupervisionSummary) => void;
  onDeleteTeam?: (teamId: string) => void;
  onPhaseChange?: (teamId: string, phase: PhaseType) => void;
  onStatusChange?: (teamId: string, status: TeamHealthStatus) => void;
}

export const TeamOverviewCard: React.FC<TeamOverviewCardProps> = React.memo(({
  team,
  onInspectTeam,
  onEditTeam,
  onDeleteTeam,
  onPhaseChange,
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<PhaseType>(
    team.currentPhaseId || 'investigacion'
  );

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
    <div className="bg-white rounded-xl border border-stone-200/80 hover:border-stone-400/80 hover:shadow-md transition-all duration-200 p-4 sm:p-4.5 flex flex-col justify-between space-y-3 relative overflow-hidden group">
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
      <TeamCardActions
        team={team}
        onInspect={() => onInspectTeam(team.id)}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
};
