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
              <circle r="22" fill={color} opacity="0.25" className="animate-ping" />
            )}

            {/* Anillo exterior del marcador */}
            <circle
              r={isSelected ? '14' : isHovered ? '12' : '9.5'}
              fill="#FFFFFF"
              stroke={color}
              strokeWidth={isSelected ? '3.5' : '2.5'}
              className="filter drop-shadow-md transition-all duration-200"
            />

            {/* Punto central del marcador */}
            <circle
              r={isSelected ? '7.5' : isHovered ? '6.5' : '4.8'}
              fill={color}
            />

            {/* Indicador de alerta crítica */}
            {team.healthStatus === 'Crítico' && (
              <circle
                cx="9"
                cy="-9"
                r="4"
                fill="#E11D48"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="animate-bounce"
              />
            )}

            {/* Etiqueta flotante con nombre de lugar (ej. Cumbal, Nariño) y Etnia */}
            {(() => {
              const labelWidth = isSelected || isHovered
                ? Math.max(92, loc.locationLabel.length * 6.2 + 20)
                : Math.max(68, team.ethnicity.length * 6.5 + 16);
              const halfWidth = labelWidth / 2;

              return (
                <g
                  transform="translate(0, 15)"
                  className="pointer-events-none select-none transition-all duration-200"
                >
                  {/* Pastilla de fondo para legibilidad máxima */}
                  <rect
                    x={-halfWidth}
                    y="0"
                    width={labelWidth}
                    height={isSelected || isHovered ? '25' : '15'}
                    rx="6"
                    fill="#FFFFFF"
                    fillOpacity="0.96"
                    stroke={isSelected ? color : '#E7E2DA'}
                    strokeWidth={isSelected ? '1.8' : '0.9'}
                    className="filter drop-shadow-xs"
                  />

                  {/* Texto de Etnia */}
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    className="text-[9.5px] font-black fill-stone-900 font-['Outfit'] tracking-tight"
                  >
                    {team.ethnicity}
                  </text>

                  {/* Subtítulo de Municipio / Lugar (ej. Cumbal, Nariño) */}
                  {(isSelected || isHovered) && (
                    <text
                      x="0"
                      y="21"
                      textAnchor="middle"
                      className="text-[7.8px] font-bold font-['Outfit']"
                      style={{ fill: color }}
                    >
                      📍 {loc.locationLabel}
                    </text>
                  )}
                </g>
              );
            })()}
          </g>
        );
      })}
    </g>
  );
};
