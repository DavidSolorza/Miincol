import React from 'react';
import type { PhasePlan, PhaseType } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { Compass, Users, Flame, GraduationCap, HeartHandshake } from 'lucide-react';

interface Props {
  allPlans: Record<string, PhasePlan>;
  activePhaseId: PhaseType;
  onSelectPhase: (phaseId: PhaseType) => void;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  isCollapsed: boolean;
  activeTeam: MissionaryTeam;
}

const PHASES_CONFIG: { id: PhaseType; step: number; label: string; icon: React.ElementType }[] = [
  { id: 'investigacion', step: 1, label: 'Investigación', icon: Compass },
  { id: 'encarnacion', step: 2, label: 'Encarnación', icon: Users },
  { id: 'evangelizacion', step: 3, label: 'Evangelización', icon: Flame },
  { id: 'entrenamiento', step: 4, label: 'Entrenamiento', icon: GraduationCap },
  { id: 'autocuidado', step: 5, label: 'Autocuidado', icon: HeartHandshake },
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
  <div className="space-y-1 pt-1">
    {!isCollapsed && (
      <div className="px-2 mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block font-['Outfit']">
          Fases PDM
        </span>
        <span className="text-[10px] font-bold text-amber-300 truncate max-w-[120px]">
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
          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-2xl transition cursor-pointer ${
            isPhaseActive
              ? 'bg-white text-[#8B251E] font-black shadow-md'
              : 'text-white/85 hover:text-white hover:bg-white/12 font-medium'
          } ${isCollapsed ? 'justify-center p-2' : ''}`}
          title={`Fase ${p.step}: ${p.label}`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className={`w-4 h-4 shrink-0 ${isPhaseActive ? 'text-[#8B251E]' : 'text-white'}`} />
            {!isCollapsed && (
              <span className="truncate font-['Outfit'] text-xs font-bold">
                {p.step}. {p.label}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                isPhaseActive
                  ? 'bg-[#10B981] text-white shadow-2xs'
                  : 'bg-white/20 text-white'
              }`}
            >
              {completedActs > 0 ? `${completedActs}/${totalActs}` : totalActs}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
