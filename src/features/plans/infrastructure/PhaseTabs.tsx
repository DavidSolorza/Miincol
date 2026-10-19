import React from 'react';
import type { PhaseType } from '../domain/plan.types';
import { Compass, Users, Flame, GraduationCap, HeartHandshake, ChevronRight } from 'lucide-react';

interface PhaseTabsProps {
  activePhase: PhaseType;
  onSelectPhase: (phase: PhaseType) => void;
}

interface PhaseConfig {
  id: PhaseType;
  step: number;
  label: string;
  icon: React.ElementType;
}

const PHASES: PhaseConfig[] = [
  { id: 'investigacion', step: 1, label: 'Investigación', icon: Compass },
  { id: 'encarnacion', step: 2, label: 'Encarnación', icon: Users },
  { id: 'evangelizacion', step: 3, label: 'Evangelización', icon: Flame },
  { id: 'entrenamiento', step: 4, label: 'Entrenamiento', icon: GraduationCap },
  { id: 'autocuidado', step: 5, label: 'Autocuidado', icon: HeartHandshake },
];

export const PhaseTabs: React.FC<PhaseTabsProps> = ({ activePhase, onSelectPhase }) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xs rounded-2xl p-2 border border-stone-200/80 shadow-xs">
      <nav className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        {PHASES.map((p, idx) => {
          const Icon = p.icon;
          const isActive = activePhase === p.id;
          const isPassed = PHASES.findIndex((item) => item.id === activePhase) > idx;

          return (
            <React.Fragment key={p.id}>
              <button
                onClick={() => onSelectPhase(p.id)}
                className={`group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 shrink-0 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#8B251E] text-white shadow-sm shadow-[#8B251E]/20'
                    : isPassed
                    ? 'text-stone-700 hover:bg-[#FAF7F2] hover:text-[#8B251E]'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isPassed
                      ? 'bg-[#E67324]/15 text-[#D05E12]'
                      : 'bg-stone-100 text-stone-500 group-hover:bg-[#8B251E]/10 group-hover:text-[#8B251E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-amber-200' : 'text-stone-400'}`}>
                      Fase {p.step}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-bold font-['Outfit'] whitespace-nowrap ${isActive ? 'text-white' : 'text-stone-800'}`}>
                    {p.label}
                  </span>
                </div>
              </button>

              {idx < PHASES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};
