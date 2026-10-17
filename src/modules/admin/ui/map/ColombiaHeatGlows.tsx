import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { resolveTeamLocation } from './colombiaLocations';

interface Props {
  teams: TeamSupervisionSummary[];
}

export const ColombiaHeatGlows: React.FC<Props> = ({ teams }) => {
  return (
    <g className="heat-glows pointer-events-none opacity-50 mix-blend-multiply">
      <defs>
        {teams.map((team) => {
          const loc = resolveTeamLocation(team);
          const color = team.themeColor || loc.accentColor || '#8B251E';
          return (
            <radialGradient key={`grad-${team.id}`} id={`glow-${team.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.55" />
              <stop offset="45%" stopColor={color} stopOpacity="0.22" />
              <stop offset="75%" stopColor={color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>

      {teams.map((team) => {
        const { x, y } = resolveTeamLocation(team);
        const radius = team.healthStatus === 'Crítico' ? 65 : team.healthStatus === 'Atención' ? 50 : 40;

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
