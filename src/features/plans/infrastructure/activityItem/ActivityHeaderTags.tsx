import React from 'react';
import type { ActivityState } from '../../domain/plan.types';
import { ChevronDown, Layers } from 'lucide-react';

interface Props {
  state: ActivityState;
  stage?: string;
  frequency: string;
  onStateChange: (newState: ActivityState) => void;
}

const stateStyles: Record<ActivityState, { selectBg: string }> = {
  Pendiente: { selectBg: 'bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-2xs' },
  'En Proceso': { selectBg: 'bg-orange-50/90 text-orange-900 border-orange-200/80 shadow-2xs' },
  Completado: { selectBg: 'bg-emerald-50/90 text-emerald-900 border-emerald-200/80 shadow-2xs' },
};

export const ActivityHeaderTags: React.FC<Props> = ({
  state,
  stage,
  frequency,
  onStateChange,
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <div className="relative">
      <select
        value={state}
        onChange={(e) => onStateChange(e.target.value as ActivityState)}
        className={`text-[11px] font-bold py-1 pl-3 pr-6 rounded-xl border transition cursor-pointer appearance-none font-['Outfit'] ${
          stateStyles[state].selectBg
        }`}
      >
        <option value="Pendiente">⏳ Pendiente</option>
        <option value="En Proceso">🔄 En Proceso</option>
        <option value="Completado">✅ Completado</option>
      </select>
      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>

    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-stone-700 bg-stone-100/80 px-2.5 py-1 rounded-xl border border-stone-200/60 shadow-2xs">
      <Layers className="w-4 h-4 text-[#E67324]" />
      {stage || 'General'}
    </span>

    <span className="text-[11px] font-semibold text-stone-400">• {frequency}</span>
  </div>
);
