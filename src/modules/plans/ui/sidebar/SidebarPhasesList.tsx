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
  <div className="space-y-0.5 pt-1">
    {!isCollapsed && (
      <div className="px-2 mb-1 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">Fases PDM</span>
        <span className="text-[9px] font-bold text-[#8B251E] truncate max-w-[120px]">{activeTeam.ethnicity}</span>
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
        <div key={p.id} className="space-y-0.5">
          <button
            onClick={() => {
              onSelectPhase(p.id);
              if (activeView !== 'plans') onChangeView('plans');
            }}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isPhaseActive ? 'bg-[#8B251E]/10 text-[#8B251E] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={`Fase ${p.step}: ${p.label}`}
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div
                className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                  isPhaseActive ? 'bg-[#8B251E] text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>
              {!isCollapsed && (
                <span className="truncate font-['Outfit'] text-[11px]">
                  {p.step}. {p.label}
                </span>
              )}
            </div>

            {!isCollapsed && (
              <span className="text-[9px] font-bold text-stone-400">
                {completedActs}/{totalActs}
              </span>
            )}
          </button>
        </div>
      );
    })}
  </div>
);
