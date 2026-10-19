import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  isTeamRestricted: boolean;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarViewsNav: React.FC<Props> = ({
  isCollapsed,
  isTeamRestricted,
  activeView,
  onChangeView,
  isOpenMobile,
  onCloseMobile,
}) => (
  <div className="space-y-1">
    {!isCollapsed && (
      <span className="text-xs font-black uppercase tracking-wider text-stone-700 px-2 block mb-1 font-['Outfit']">
        Vistas
      </span>
    )}

    {!isTeamRestricted && (
      <button
        onClick={() => {
          onChangeView('superadmin');
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-2xl text-sm font-bold transition cursor-pointer ${
          activeView === 'superadmin'
            ? 'bg-white text-[#8B251E] shadow-sm font-black border border-orange-300/60 ring-1 ring-orange-400/30'
            : 'bg-white/80 backdrop-blur-xs border border-orange-200/60 shadow-2xs hover:bg-white hover:border-orange-400/80 hover:shadow-xs text-stone-800 hover:text-stone-950 font-semibold hover:scale-[1.01]'
        } ${isCollapsed ? 'justify-center p-2' : ''}`}
        title="Supervisión Nacional (Super Admin)"
      >
        <ShieldCheck className={`w-5 h-5 shrink-0 ${activeView === 'superadmin' ? 'text-[#8B251E]' : 'text-amber-700'}`} />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span>Supervisión Nacional</span>
            <span className="text-[10px] bg-amber-500/15 text-amber-900 border border-amber-500/30 font-black px-1.5 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>
        )}
      </button>
    )}

    {activeView === 'superadmin' && !isCollapsed && (
      <div className="mt-2 p-2.5 rounded-2xl bg-white/90 border border-stone-200/80 text-xs space-y-1 shadow-2xs">
        <span className="text-[10px] font-black text-stone-800 uppercase tracking-wider block font-['Outfit']">
          Supervisión Activa
        </span>
        <p className="text-[11px] text-stone-600 leading-snug">
          Selecciona una misión en el mapa para auditar sus objetivos y avances.
        </p>
      </div>
    )}
  </div>

);
