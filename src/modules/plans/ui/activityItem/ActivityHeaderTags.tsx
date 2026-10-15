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
  Pendiente: { selectBg: 'bg-amber-50 text-amber-900 border-amber-200' },
  'En Proceso': { selectBg: 'bg-orange-50 text-[#8B251E] border-orange-200' },
  Completado: { selectBg: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
};

export const ActivityHeaderTags: React.FC<Props> = ({
  state,
  stage,
  frequency,
  onStateChange,
}) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <div className="relative">
      <select
        value={state}
        onChange={(e) => onStateChange(e.target.value as ActivityState)}
        className={`text-[11px] font-bold py-0.5 pl-2.5 pr-5 rounded-full border transition cursor-pointer appearance-none ${
          stateStyles[state].selectBg
        }`}
      >
        <option value="Pendiente">⏳ Pendiente</option>
        <option value="En Proceso">🔄 En Proceso</option>
        <option value="Completado">✅ Completado</option>
      </select>
      <ChevronDown className="w-2.5 h-2.5 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>

    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
      <Layers className="w-2.5 h-2.5 text-[#E67324]" />
      {stage || 'General'}
    </span>

    <span className="text-[10px] font-medium text-stone-400">• {frequency}</span>
  </div>
);
