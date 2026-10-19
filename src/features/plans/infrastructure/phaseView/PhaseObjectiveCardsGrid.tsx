import React from 'react';
import type { Objective } from '../../domain/plan.types';
import { Plus } from 'lucide-react';
import { PhaseObjectiveCardItem } from './PhaseObjectiveCardItem';

interface Props {
  objectives: Objective[];
  activeObjectiveNumber: number;
  onSelectObjective: (num: number) => void;
  onOpenCreateObjective?: () => void;
}

export const PhaseObjectiveCardsGrid: React.FC<Props> = ({
  objectives,
  activeObjectiveNumber,
  onSelectObjective,
  onOpenCreateObjective,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 items-stretch flex-1 h-full">
    {objectives.map((obj) => (
      <PhaseObjectiveCardItem
        key={obj.number}
        obj={obj}
        isSelected={activeObjectiveNumber === obj.number}
        onSelect={() => onSelectObjective(obj.number)}
      />
    ))}

    {objectives.length < 4 && onOpenCreateObjective && (
      <button
        type="button"
        onClick={onOpenCreateObjective}
        className="p-3.5 sm:p-4 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#8B251E]/40 hover:bg-[#8B251E]/5 transition flex flex-col items-center justify-center text-center gap-2 cursor-pointer group min-h-[145px] sm:min-h-[160px] h-full w-full"
      >
        <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#8B251E]/10 text-stone-500 group-hover:text-[#8B251E] flex items-center justify-center transition shrink-0">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-600 group-hover:text-[#8B251E] block">Nuevo Objetivo</span>
          <span className="text-[10px] text-stone-400">({objectives.length}/4 registrados)</span>
        </div>
      </button>
    )}
  </div>
);
