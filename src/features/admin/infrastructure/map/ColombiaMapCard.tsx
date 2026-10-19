import React, { useState, useMemo } from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { ColombiaMapFilters } from './ColombiaMapFilters';
import { ColombiaMapSvg } from './ColombiaMapSvg';
import { ColombiaMapTooltip } from './ColombiaMapTooltip';
import { ColombiaDeptBadge } from './ColombiaDeptBadge';
import { resolveTeamLocation, normalizeText } from './colombiaLocations';

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
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  // Departamentos activos ordenados
  const departments = useMemo(() => {
    const list = Array.from(new Set(teams.map((t) => resolveTeamLocation(t).departmentName))).filter(Boolean);
    return list.sort();
  }, [teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const loc = resolveTeamLocation(t);
      const matchDept =
        selectedDept === 'ALL' ||
        normalizeText(loc.departmentName) === normalizeText(selectedDept) ||
        normalizeText(t.department).includes(normalizeText(selectedDept));
      const matchStatus = selectedStatus === 'ALL' || t.healthStatus === selectedStatus;
      const matchPhase = selectedPhase === 'ALL' || t.currentPhaseId === selectedPhase;
      const matchEth =
        selectedEthnicity === 'ALL' ||
        t.ethnicity.toLowerCase().includes(selectedEthnicity.toLowerCase());
      return matchDept && matchStatus && matchPhase && matchEth;
    });
  }, [teams, selectedDept, selectedStatus, selectedPhase, selectedEthnicity]);

  const activeTeam = useMemo(
    () => teams.find((t) => t.id === selectedTeamId) || hoveredTeam,
    [teams, selectedTeamId, hoveredTeam]
  );

  const hoveredDeptTeam = useMemo(() => {
    if (!hoveredDept) return null;
    const norm = normalizeText(hoveredDept);
    return (
      teams.find((t) => normalizeText(resolveTeamLocation(t).departmentName) === norm) || null
    );
  }, [teams, hoveredDept]);

  const currentBadgeDept = hoveredDept || (selectedDept !== 'ALL' ? selectedDept : null);
  const currentBadgeTeam = hoveredDept
    ? hoveredDeptTeam
    : (selectedDept !== 'ALL' ? teams.find(t => normalizeText(resolveTeamLocation(t).departmentName) === normalizeText(selectedDept)) : null);

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

      <div className="flex-1 min-h-0 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF8F5]">
        <ColombiaDeptBadge
          deptName={currentBadgeDept}
          activeTeamName={currentBadgeTeam?.name || null}
          themeColor={currentBadgeTeam?.themeColor || null}
        />

        {/* Mapa SVG plano y nítido, libre de distorsiones 3D */}
        <div className="w-full h-full max-w-[620px] max-h-[740px] aspect-[520/660] flex items-center justify-center transition-all duration-300">
          <ColombiaMapSvg
            teams={filteredTeams}
            selectedTeamId={selectedTeamId}
            hoveredTeamId={hoveredTeam?.id || null}
            selectedDeptName={selectedDept}
            onSelectTeam={(t) => onSelectTeamId(t ? t.id : null)}
            onHoverTeam={setHoveredTeam}
            onHoverDept={setHoveredDept}
            onSelectDept={(dept) => {
              setSelectedDept(selectedDept === dept ? 'ALL' : dept);
            }}
          />
        </div>

        <ColombiaMapTooltip
          team={activeTeam}
          onClose={() => {
            onSelectTeamId(null);
            setHoveredTeam(null);
          }}
          onInspect={onInspectTeam}
        />
      </div>
    </div>
  );
};
