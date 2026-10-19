import React from 'react';
import type { PhasePlan, PhaseType } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { Compass, Users, Flame, GraduationCap, Heart } from 'lucide-react';

interface Props {
  allPlans: Record<string, PhasePlan>;
  activePhaseId: PhaseType;
  onSelectPhase: (phaseId: PhaseType) => void;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  isCollapsed: boolean;
  activeTeam: MissionaryTeam;
}

const PHASES_CONFIG: { id: PhaseType; label: string; icon: React.ElementType }[] = [
  { id: 'investigacion', label: 'Investigación', icon: Compass },
  { id: 'encarnacion', label: 'Encarnación', icon: Users },
  { id: 'evangelizacion', label: 'Evangelización', icon: Flame },
  { id: 'entrenamiento', label: 'Entrenamiento', icon: GraduationCap },
  { id: 'autocuidado', label: 'Autocuidado', icon: Heart },
];

export const SidebarPhasesList: React.FC<Props> = ({
  allPlans,
  activePhaseId,
  onSelectPhase,
  activeView,
  onChangeView,
  isCollapsed,
  activeTeam,
}) => (
  <div className="space-y-1.5 pt-0.5">
    {!isCollapsed && (
      <div className="px-1.5 mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-stone-700 block font-['Outfit']">
          Pilares PDM
        </span>
        <span className="text-xs font-black text-stone-600 bg-stone-200/80 border border-stone-300/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-['Outfit'] shadow-2xs">
          {activeTeam.ethnicity}
        </span>
      </div>
    )}

    {PHASES_CONFIG.map((p) => {
      const Icon = p.icon;
      const isPhaseActive = activePhaseId === p.id && activeView === 'plans';
      const phasePlan = allPlans[p.id];
      const totalActs = phasePlan ? phasePlan.objectives.reduce((sum, o) => sum + o.activities.length, 0) : 0;
      const completedActs = phasePlan
        ? phasePlan.objectives.reduce((sum, o) => sum + o.activities.filter((a) => a.state === 'Completado').length, 0)
        : 0;

      return (
        <button
          key={p.id}
          onClick={() => {
            onSelectPhase(p.id);
            if (activeView !== 'plans') onChangeView('plans');
          }}
          style={
            isPhaseActive
              ? {
                  background: 'linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)',
                }
              : undefined
          }
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200 ease-out cursor-pointer group select-none ${
            isPhaseActive
              ? 'text-stone-950 font-extrabold shadow-sm overflow-hidden'
              : 'bg-white border border-orange-100/90 shadow-2xs hover:border-[#E67324]/60 hover:bg-orange-50/40 hover:shadow-xs text-stone-900 font-bold'
          } ${isCollapsed ? 'justify-center p-2' : ''}`}
          title={`Pilar: ${p.label}`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Icon className={`w-4 h-4 shrink-0 transition ${isPhaseActive ? 'text-stone-900' : 'text-[#8B251E] group-hover:text-[#E67324]'}`} />
            {!isCollapsed && (
              <span className={`truncate font-['Outfit'] text-sm ${isPhaseActive ? 'font-black text-stone-950' : 'font-bold text-stone-900'}`}>
                {p.label}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-lg transition shrink-0 ${
                isPhaseActive
                  ? 'bg-black/15 text-white drop-shadow-xs'
                  : 'bg-orange-50/80 border border-orange-100 text-[#8B251E] group-hover:bg-orange-100/70 group-hover:border-orange-200'
              }`}
            >
              {totalActs}/{completedActs}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
