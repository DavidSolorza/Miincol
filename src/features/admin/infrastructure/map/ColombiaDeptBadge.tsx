import React from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  deptName: string | null;
  activeTeamName: string | null;
  themeColor: string | null;
}

export const ColombiaDeptBadge: React.FC<Props> = ({
  deptName,
  activeTeamName,
  themeColor,
}) => {
  return (
    <div
      className="absolute top-3 left-3 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl shadow-sm border border-[#EBDDCF]/90 backdrop-blur-md overflow-hidden transition-all duration-300"
      style={{
        background:
          'linear-gradient(90deg, rgba(255, 255, 255, 0.96) 0%, rgba(253, 248, 243, 0.92) 55%, rgba(230, 115, 36, 0.16) 85%, rgba(139, 37, 30, 0.22) 100%)',
      }}
    >
      {/* Líneas verticales con degradado sutil al estilo estela */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(139, 37, 30, 0.25) 5px, rgba(139, 37, 30, 0.25) 6.5px)',
        }}
      />

      {/* Indicador vertical de color principal */}
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#8B251E] via-[#B83A2D] to-[#E67324] shrink-0" />

      <div className="flex flex-col min-w-0 z-10">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#8B251E]/90 leading-none">
          {deptName ? 'Departamento' : 'Territorio Nacional'}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin className="w-3 h-3 text-[#E67324] shrink-0" />
          <span className="text-xs font-black text-stone-900 truncate font-['Outfit'] tracking-wide">
            {deptName || 'Colombia • 32 Departamentos'}
          </span>
          {activeTeamName && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.2 rounded-md text-white shrink-0 shadow-2xs"
              style={{ backgroundColor: themeColor || '#8B251E' }}
            >
              {activeTeamName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
