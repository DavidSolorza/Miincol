import React, { useState } from 'react';
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
}

export const ColombiaMapSvg: React.FC<Props> = ({
  teams,
  selectedTeamId,
  hoveredTeamId,
  onSelectTeam,
  onHoverTeam,
}) => {
  const [hoveredDeptName, setHoveredDeptName] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 520 660"
      className="w-full h-full select-none"
      style={{ filter: 'drop-shadow(0px 10px 26px rgba(0,0,0,0.07))' }}
      onClick={() => onSelectTeam(null as any)}
    >
      <defs>
        <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="0.8" />
        </pattern>
        <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.06" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="16" />

      {/* 33 Departamentos Oficiales Integrados desde co.json */}
      <g filter="url(#map-shadow)">
        <ColombiaMapDepartments
          teams={teams}
          onHoverDept={setHoveredDeptName}
        />
      </g>

      {/* Red hídrica principal de referencia */}
      <g stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55">
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

      {/* Indicador sutil de departamento activo al pasar el cursor */}
      {hoveredDeptName && (
        <text
          x="20"
          y="35"
          className="text-[11px] font-bold fill-stone-500 font-['Outfit'] select-none pointer-events-none"
        >
          {hoveredDeptName.toUpperCase()}
        </text>
      )}
    </svg>
  );
};
