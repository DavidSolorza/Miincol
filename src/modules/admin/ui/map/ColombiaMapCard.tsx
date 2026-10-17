import React, { useState, useMemo } from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { ColombiaMapFilters } from './ColombiaMapFilters';
import { ColombiaMapSvg } from './ColombiaMapSvg';
import { ColombiaMapTooltip } from './ColombiaMapTooltip';

interface Props {
  teams: TeamSupervisionSummary[];
  onInspectTeam: (teamId: string) => void;
  selectedTeamId: string | null;
  onSelectTeamId: (teamId: string | null) => void;
}

export const ColombiaMapCard: React.FC<Props> = ({
  teams,
  onInspectTeam,
  selectedTeamId,
  onSelectTeamId,
}) => {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [selectedEthnicity, setSelectedEthnicity] = useState('ALL');
  const [hoveredTeam, setHoveredTeam] = useState<TeamSupervisionSummary | null>(null);

  const departments = useMemo(() => {
    return Array.from(new Set(teams.map((t) => t.department.split(' ')[0]))).filter(Boolean);
  }, [teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchDept = selectedDept === 'ALL' || t.department.includes(selectedDept);
      const matchStatus = selectedStatus === 'ALL' || t.healthStatus === selectedStatus;
      const matchPhase = selectedPhase === 'ALL' || t.currentPhaseId === selectedPhase;
      const matchEth = selectedEthnicity === 'ALL' || t.ethnicity.toLowerCase().includes(selectedEthnicity.toLowerCase());
      return matchDept && matchStatus && matchPhase && matchEth;
    });
  }, [teams, selectedDept, selectedStatus, selectedPhase, selectedEthnicity]);

  const activeTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId) || hoveredTeam;
  }, [teams, selectedTeamId, hoveredTeam]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm flex flex-col h-full min-h-0 relative overflow-hidden group">
      <ColombiaMapFilters
        selectedDept={selectedDept}
        onSelectDept={setSelectedDept}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedPhase={selectedPhase}
        onSelectPhase={setSelectedPhase}
        selectedEthnicity={selectedEthnicity}
        onSelectEthnicity={setSelectedEthnicity}
        departments={departments}
      />

      <div
        className="flex-1 min-h-0 relative flex items-center justify-center p-2 sm:p-3 overflow-hidden bg-gradient-to-b from-stone-50/40 to-stone-100/30"
        style={{ perspective: '1200px' }}
      >
        <div
          className="w-full h-full max-w-[640px] max-h-[760px] aspect-[520/660] flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: 'rotateX(7deg) rotateY(-2deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <ColombiaMapSvg
            teams={filteredTeams}
            selectedTeamId={selectedTeamId}
            hoveredTeamId={hoveredTeam?.id || null}
            onSelectTeam={(t) => onSelectTeamId(t ? t.id : null)}
            onHoverTeam={setHoveredTeam}
          />
        </div>

        <ColombiaMapTooltip
          team={activeTeam}
          onClose={() => { onSelectTeamId(null); setHoveredTeam(null); }}
          onInspect={onInspectTeam}
        />
      </div>
    </div>
  );
};
