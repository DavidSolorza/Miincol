import React, { useMemo } from 'react';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import departmentsData from '../../../admin/infrastructure/map/data/colombiaDepartments.json';
import { resolveTeamLocation } from '../../../admin/infrastructure/map/colombiaLocations';
import { Compass } from 'lucide-react';
import { useDepartmentZoomViewBox, type DepartmentPath } from './useDepartmentZoomViewBox';

interface Props {
  activeTeam: MissionaryTeam;
  whatsappUrl?: string | null;
  onOpenTeamModal?: () => void;
}

const DEPARTMENTS = departmentsData as DepartmentPath[];

export const TeamDepartmentZoomCard: React.FC<Props> = ({ activeTeam }) => {
  const loc = useMemo(() => resolveTeamLocation(activeTeam), [activeTeam]);
  const activeDeptPath = useMemo(
    () => DEPARTMENTS.find((d) => d.id === loc.departmentId) || DEPARTMENTS[0],
    [loc.departmentId]
  );
  const { viewBox, viewBoxBox, visibleNeighbors } = useDepartmentZoomViewBox(loc.departmentId, DEPARTMENTS);

  return (
    <div className="bg-white/95 p-3 sm:p-3.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E67324]/10 via-[#8B251E]/5 to-transparent rounded-bl-full pointer-events-none -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-105" />

      <div className="relative w-full flex-1 min-h-[170px] sm:min-h-[190px] rounded-xl bg-gradient-to-b from-[#FAF7F2] to-stone-50/90 border border-stone-200/60 overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-stone-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs pointer-events-none select-none max-w-[calc(100%-80px)]">
          <div className="w-6 h-6 rounded-lg bg-[#8B251E]/10 border border-[#8B251E]/15 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-[#E67324]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-stone-900 font-['Outfit'] tracking-tight leading-tight truncate">
              {loc.departmentName}
            </h3>
            <span className="text-[10px] font-bold text-stone-400 truncate block -mt-0.5">
              {loc.locationLabel}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #8B251E 0.75px, transparent 0.75px)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="absolute top-2 right-2 bg-white/85 backdrop-blur-xs border border-stone-200/70 rounded-md px-1.5 py-0.5 flex items-center gap-1 text-[8.5px] font-['Outfit'] font-black text-stone-600 shadow-2xs pointer-events-none select-none z-10">
          <span className="text-[#8B251E] font-black">N</span>
          <span className="text-stone-300">|</span>
          <span className="text-[7.5px] text-stone-400">▲</span>
        </div>

        <div className="absolute bottom-2 left-2 bg-white/85 backdrop-blur-xs border border-stone-200/70 rounded-md px-1.5 py-0.5 flex items-center gap-1 text-[8px] font-mono text-stone-500 shadow-2xs pointer-events-none select-none z-10">
          <span className="w-3 h-0.5 bg-stone-500 rounded-full inline-block" />
          <span>15 km</span>
        </div>

        <div className="absolute bottom-2 right-2 bg-white/85 backdrop-blur-xs border border-stone-200/70 rounded-md px-1.5 py-0.5 text-[8px] font-mono text-stone-500 shadow-2xs pointer-events-none select-none z-10">
          <span>5°16′ N • 76°01′ O</span>
        </div>

        <svg viewBox={viewBox} className="w-full h-full p-2 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
          <defs>
            <linearGradient id="activeDeptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F38C44" />
              <stop offset="45%" stopColor="#E67324" />
              <stop offset="85%" stopColor="#8B251E" />
              <stop offset="100%" stopColor="#6E1A14" />
            </linearGradient>
            <filter id="deptFineElevation" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.1" floodColor="#38150F" floodOpacity="0.25" />
            </filter>
            <filter id="pinpointShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0.8" stdDeviation="0.7" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          <g opacity="0.3" stroke="#8B251E" strokeWidth="0.18" strokeDasharray="1.5 2">
            <line x1={viewBoxBox.x} y1={viewBoxBox.y + viewBoxBox.size * 0.33} x2={viewBoxBox.x + viewBoxBox.size} y2={viewBoxBox.y + viewBoxBox.size * 0.33} />
            <line x1={viewBoxBox.x} y1={viewBoxBox.y + viewBoxBox.size * 0.67} x2={viewBoxBox.x + viewBoxBox.size} y2={viewBoxBox.y + viewBoxBox.size * 0.67} />
            <line x1={viewBoxBox.x + viewBoxBox.size * 0.33} y1={viewBoxBox.y} x2={viewBoxBox.x + viewBoxBox.size * 0.33} y2={viewBoxBox.y + viewBoxBox.size} />
            <line x1={viewBoxBox.x + viewBoxBox.size * 0.67} y1={viewBoxBox.y} x2={viewBoxBox.x + viewBoxBox.size * 0.67} y2={viewBoxBox.y + viewBoxBox.size} />
          </g>

          <g opacity="0.9">
            {DEPARTMENTS.map((d) => {
              if (d.id === loc.departmentId) return null;
              return <path key={d.id} d={d.d} fill="#F5F1EB" stroke="#DDD6CC" strokeWidth="0.35" strokeLinejoin="round" />;
            })}
          </g>

          <g opacity="0.5" className="select-none pointer-events-none font-['Outfit']">
            {visibleNeighbors.map((nb) => (
              <text key={nb.id} x={nb.x} y={nb.y} textAnchor="middle" fontSize="2.4" fontWeight="800" fill="#78716C" letterSpacing="0.4">
                {nb.name}
              </text>
            ))}
          </g>

          {activeDeptPath && (
            <g filter="url(#deptFineElevation)">
              <path d={activeDeptPath.d} fill="url(#activeDeptGrad)" stroke="#FFFFFF" strokeWidth="0.65" strokeLinejoin="round" className="transition-all duration-300 hover:brightness-105" />
              <path d={activeDeptPath.d} fill="none" stroke="#FFFFFF" strokeWidth="0.25" strokeOpacity="0.45" strokeDasharray="1.2 0.8" strokeLinejoin="round" />
            </g>
          )}

          <g className="pointer-events-none select-none" filter="url(#pinpointShadow)">
            <circle cx={loc.x} cy={loc.y} r="4.2" fill="#E67324" fillOpacity="0.24" stroke="#E67324" strokeWidth="0.45" strokeOpacity="0.55" />
            <circle cx={loc.x} cy={loc.y} r="2.6" fill="#FFFFFF" stroke="#8B251E" strokeWidth="0.65" />
            <circle cx={loc.x} cy={loc.y} r="1.6" fill="#8B251E" />
            <circle cx={loc.x} cy={loc.y} r="0.65" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </div>
  );
};
