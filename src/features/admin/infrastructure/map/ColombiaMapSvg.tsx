import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { ColombiaHeatGlows } from './ColombiaHeatGlows';
import { ColombiaMapMarkers } from './ColombiaMapMarkers';
import { ColombiaMapDepartments } from './ColombiaMapDepartments';

interface Props {
  teams: TeamSupervisionSummary[];
  selectedTeamId: string | null;
  hoveredTeamId: string | null;
  selectedDeptName?: string | null;
  onSelectTeam: (team: TeamSupervisionSummary) => void;
  onHoverTeam: (team: TeamSupervisionSummary | null) => void;
  onHoverDept?: (deptName: string | null) => void;
  onSelectDept?: (deptName: string) => void;
}

export const ColombiaMapSvg: React.FC<Props> = ({
  teams,
  selectedTeamId,
  hoveredTeamId,
  selectedDeptName,
  onSelectTeam,
  onHoverTeam,
  onHoverDept,
  onSelectDept,
}) => {
  return (
    <svg
      viewBox="0 0 520 660"
      className="w-full h-full select-none"
      onClick={() => onSelectTeam(null as any)}
    >
      <defs>
        {/* Sombra de relieve general del mapa continental */}
        <filter id="colombia-relief-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#8B251E" floodOpacity="0.08" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.04" />
        </filter>

        {/* Resplandor especial para el departamento activo / subrayado */}
        <filter id="active-dept-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#8B251E" floodOpacity="0.35" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* 33 Departamentos Oficiales con diferenciación visual y subrayado */}
      <g filter="url(#colombia-relief-shadow)">
        <ColombiaMapDepartments
          teams={teams}
          selectedTeamId={selectedTeamId}
          selectedDeptName={selectedDeptName}
          onHoverDept={onHoverDept}
          onSelectDept={onSelectDept}
          onSelectTeam={onSelectTeam}
        />
      </g>

      {/* Halos térmicos de actividad misionera */}
      <ColombiaHeatGlows teams={teams} />

      {/* Marcadores georreferenciados precisos de misiones con nombres de lugar */}
      <ColombiaMapMarkers
        teams={teams}
        selectedTeamId={selectedTeamId}
        hoveredTeamId={hoveredTeamId}
        onSelectTeam={onSelectTeam}
        onHoverTeam={onHoverTeam}
      />
    </svg>
  );
};
