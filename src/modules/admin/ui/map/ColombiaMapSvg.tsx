import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { COLOMBIA_RIVERS } from './colombiaPaths';
import { ColombiaHeatGlows } from './ColombiaHeatGlows';
import { ColombiaMapMarkers } from './ColombiaMapMarkers';
import { ColombiaMapDepartments } from './ColombiaMapDepartments';

interface Props {
  teams: TeamSupervisionSummary[];
  selectedTeamId: string | null;
  hoveredTeamId: string | null;
  onSelectTeam: (team: TeamSupervisionSummary) => void;
  onHoverTeam: (team: TeamSupervisionSummary | null) => void;
  onHoverDept?: (deptName: string | null) => void;
}

export const ColombiaMapSvg: React.FC<Props> = ({
  teams,
  selectedTeamId,
  hoveredTeamId,
  onSelectTeam,
  onHoverTeam,
  onHoverDept,
}) => {
  return (
    <svg
      viewBox="0 0 520 660"
      className="w-full h-full select-none"
      onClick={() => onSelectTeam(null as any)}
    >
      <defs>
        <filter id="colombia-relief-shadow" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#8B251E" floodOpacity="0.09" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.05" />
        </filter>
      </defs>

      {/* 33 Departamentos Oficiales Integrados desde co.json */}
      <g filter="url(#colombia-relief-shadow)">
        <ColombiaMapDepartments
          teams={teams}
          onHoverDept={onHoverDept}
        />
      </g>

      {/* Red hídrica principal de referencia */}
      <g stroke="#60A5FA" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.65">
        {COLOMBIA_RIVERS.map((river, idx) => (
          <path key={`river-${idx}`} d={river} />
        ))}
      </g>

      {/* Halos térmicos de actividad */}
      <ColombiaHeatGlows teams={teams} />

      {/* Marcadores georreferenciados de misiones */}
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
