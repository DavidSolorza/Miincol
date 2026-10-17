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
      <span className="text-[10px] font-black uppercase tracking-wider text-stone-950 px-2 block mb-1 font-['Outfit']">
        Vistas
      </span>
    )}

    {!isTeamRestricted && (
      <button
        onClick={() => {
          onChangeView('superadmin');
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer ${
          activeView === 'superadmin'
            ? 'bg-white text-[#8B251E] shadow-md font-black'
            : 'text-white/85 hover:text-white hover:bg-white/12 font-semibold'
        } ${isCollapsed ? 'justify-center p-2' : ''}`}
        title="Supervisión Nacional (Super Admin)"
      >
        <ShieldCheck className={`w-4 h-4 shrink-0 ${activeView === 'superadmin' ? 'text-[#8B251E]' : 'text-amber-300'}`} />
        {!isCollapsed && (
          <div className="flex items-center justify-between w-full">
            <span>Supervisión Nacional</span>
            <span className="text-[9px] bg-amber-400/30 text-amber-200 font-black px-1.5 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>
        )}
      </button>
    )}

    {activeView === 'superadmin' && !isCollapsed && (
      <div className="mt-2 p-2.5 rounded-2xl bg-black/15 border border-white/10 text-xs space-y-1">
        <span className="text-[10px] font-black text-white/80 uppercase tracking-wider block font-['Outfit']">
          Supervisión Activa
        </span>
        <p className="text-[11px] text-white/70 leading-snug">
          Selecciona una misión en el mapa para auditar sus objetivos y avances.
        </p>
      </div>
    )}
  </div>
);
