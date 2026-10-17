import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { projectCoordsToSvg } from './colombiaProjection';

interface Props {
  teams: TeamSupervisionSummary[];
}

export const ColombiaHeatGlows: React.FC<Props> = ({ teams }) => {
  return (
    <g className="heat-glows pointer-events-none opacity-60 mix-blend-multiply">
      <defs>
        {teams.map((team) => {
          const color = team.themeColor || '#8B251E';
          return (
            <radialGradient key={`grad-${team.id}`} id={`glow-${team.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.55" />
              <stop offset="40%" stopColor={color} stopOpacity="0.25" />
              <stop offset="70%" stopColor={color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {teams.map((team) => {
        if (!team.coordinates) return null;
        const { x, y } = projectCoordsToSvg(team.coordinates.lat, team.coordinates.lng);
        const radius = team.healthStatus === 'Crítico' ? 70 : team.healthStatus === 'Atención' ? 55 : 45;

        return (
          <circle
            key={`heat-${team.id}`}
            cx={x}
            cy={y}
            r={radius}
            fill={`url(#glow-${team.id})`}
            className="transition-all duration-700 animate-pulse"
          />
        );
      })}
    </g>
  );
};
