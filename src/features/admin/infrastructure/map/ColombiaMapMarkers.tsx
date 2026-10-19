import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { resolveTeamLocation } from './colombiaLocations';

interface Props {
  teams: TeamSupervisionSummary[];
  selectedTeamId: string | null;
  hoveredTeamId: string | null;
  onSelectTeam: (team: TeamSupervisionSummary) => void;
  onHoverTeam: (team: TeamSupervisionSummary | null) => void;
}

export const ColombiaMapMarkers: React.FC<Props> = ({
  teams,
  selectedTeamId,
  hoveredTeamId,
  onSelectTeam,
  onHoverTeam,
}) => {
  return (
    <g className="map-markers cursor-pointer">
      {teams.map((team) => {
        const loc = resolveTeamLocation(team);
        const { x, y } = loc;
        const isSelected = selectedTeamId === team.id;
        const isHovered = hoveredTeamId === team.id;
        const color = team.themeColor || loc.accentColor || '#8B251E';

        return (
          <g
            key={`marker-${team.id}`}
            transform={`translate(${x}, ${y})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTeam(team);
            }}
            onMouseEnter={() => onHoverTeam(team)}
            onMouseLeave={() => onHoverTeam(null)}
            className="transition-transform duration-300 group"
          >
            {/* Halo radar al estar seleccionado o en hover */}
            {(isSelected || isHovered) && (
              <circle r="20" fill={color} opacity="0.28" className="animate-ping" />
            )}

            {/* Anillo exterior del marcador con sombra suave */}
            <circle
              r={isSelected ? '12' : isHovered ? '10' : '8'}
              fill="#FFFFFF"
              stroke={color}
              strokeWidth={isSelected ? '3.5' : '2.5'}
              className="filter drop-shadow-md transition-all duration-200"
            />

            {/* Punto central del marcador con el color de la etnia/departamento */}
            <circle
              r={isSelected ? '6.5' : isHovered ? '5.5' : '4'}
              fill={color}
            />

            <title>
              {team.name} • {team.ethnicity} ({loc.locationLabel})
            </title>
          </g>
        );
      })}
    </g>
  );
};
