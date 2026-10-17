import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { COLOMBIA_MAINLAND_PATH, COLOMBIA_REGIONS, COLOMBIA_RIVERS } from './colombiaPaths';
import { ColombiaHeatGlows } from './ColombiaHeatGlows';
import { ColombiaMapMarkers } from './ColombiaMapMarkers';

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
  return (
    <svg
      viewBox="0 0 520 660"
      className="w-full h-full select-none"
      style={{ filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.06))' }}
      onClick={() => onSelectTeam(null as any)}
    >
      <defs>
        <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="0.8" />
        </pattern>
        <filter id="map-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="16" />

      {/* Sombra base del país */}
      <path d={COLOMBIA_MAINLAND_PATH} fill="#CBD5E1" opacity="0.25" transform="translate(4, 6)" />

      {/* Regiones naturales */}
      <g filter="url(#map-shadow)">
        {COLOMBIA_REGIONS.map((region) => (
          <path
            key={region.id}
            d={region.path}
            fill={region.fill}
            stroke={region.stroke}
            strokeWidth="1.2"
            className="transition-colors hover:brightness-95"
          >
            <title>{region.name}</title>
          </path>
        ))}
      </g>

      {/* Contorno nacional */}
      <path
        d={COLOMBIA_MAINLAND_PATH}
        fill="none"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        className="opacity-70"
      />

      {/* Ríos principales */}
      <g stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65">
        {COLOMBIA_RIVERS.map((river, idx) => (
          <path key={`river-${idx}`} d={river} />
        ))}
      </g>

      {/* Halos de calor de actividad */}
      <ColombiaHeatGlows teams={teams} />

      {/* Marcadores de equipos */}
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
