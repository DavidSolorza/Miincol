import React from 'react';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { ShieldCheck, Compass } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  isTeamRestricted: boolean;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  activeTeam: MissionaryTeam;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarViewsNav: React.FC<Props> = ({
  isCollapsed,
  isTeamRestricted,
  activeView,
  onChangeView,
  activeTeam,
  isOpenMobile,
  onCloseMobile,
}) => (
  <div className="space-y-1">
    {!isCollapsed && (
      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-1">
        Vistas
      </span>
    )}

    {!isTeamRestricted && (
      <button
        onClick={() => {
          onChangeView('superadmin');
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
          activeView === 'superadmin'
            ? 'bg-stone-900 text-white shadow-2xs'
            : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title="Supervisión Nacional (Super Admin)"
      >
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#E67324]" />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span>Supervisión Nacional</span>
            <span className="text-[8px] bg-amber-400/20 text-amber-300 font-black px-1 py-0.2 rounded uppercase">
              Admin
            </span>
          </div>
        )}
      </button>
    )}

    {(isTeamRestricted || activeView === 'plans') && (
      <button
        onClick={() => {
          onChangeView('plans');
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
          activeView === 'plans'
            ? 'bg-[#8B251E] text-white shadow-2xs'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title="Plan por Fases"
      >
        <Compass className="w-3.5 h-3.5 shrink-0" />
        {!isCollapsed && (
          <div className="flex flex-col text-left truncate">
            <span>Plan de Desarrollo (PDM)</span>
            {!isTeamRestricted && (
              <span className="text-[9px] text-amber-100 font-semibold truncate">{activeTeam.name}</span>
            )}
          </div>
        )}
      </button>
    )}

    {activeView === 'superadmin' && !isCollapsed && (
      <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
          Tablero Nacional
        </span>
        <p className="text-[11px] text-stone-500 leading-snug">
          Haga clic en cualquier equipo ministerial en el panel para supervisar sus etapas y objetivos.
        </p>
      </div>
    )}
  </div>
);
