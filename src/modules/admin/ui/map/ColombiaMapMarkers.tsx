import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { projectCoordsToSvg } from './colombiaProjection';

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
        if (!team.coordinates) return null;
        const { x, y } = projectCoordsToSvg(team.coordinates.lat, team.coordinates.lng);
        const isSelected = selectedTeamId === team.id;
        const isHovered = hoveredTeamId === team.id;
        const color = team.themeColor || '#8B251E';

        return (
          <g
            key={`marker-${team.id}`}
            transform={`translate(${x}, ${y})`}
            onClick={(e) => { e.stopPropagation(); onSelectTeam(team); }}
            onMouseEnter={() => onHoverTeam(team)}
            onMouseLeave={() => onHoverTeam(null)}
            className="transition-transform duration-300 group"
          >
            {(isSelected || isHovered) && (
              <circle r="18" fill={color} opacity="0.3" className="animate-ping" />
            )}
            <circle
              r={isSelected ? '14' : isHovered ? '12' : '9'}
              fill="#FFFFFF"
              stroke={color}
              strokeWidth={isSelected ? '3.5' : '2.5'}
              className="filter drop-shadow-md transition-all duration-200"
            />
            <circle r={isSelected ? '7' : isHovered ? '6' : '4.5'} fill={color} />
            <text
              y="22"
              textAnchor="middle"
              className="text-[9px] font-bold fill-stone-800 font-['Outfit'] select-none pointer-events-none drop-shadow-xs"
            >
              {team.ethnicity}
            </text>
            {team.healthStatus === 'Crítico' && (
              <circle cx="8" cy="-8" r="3.5" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.2" />
            )}
          </g>
        );
      })}
    </g>
  );
};
