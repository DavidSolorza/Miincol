import React from 'react';
import type { Objective } from '../../domain/plan.types';
import { Pencil } from 'lucide-react';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  objective: Objective;
  completedCount: number;
  totalObjectiveBudget: number;
  onEditObjective?: (objective: Objective) => void;
}

export const ObjectiveCardHeader: React.FC<Props> = ({
  objective,
  completedCount,
  totalObjectiveBudget,
  onEditObjective,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-md">
          Objetivo #{objective.number}
        </span>
        <span className="text-[11px] text-stone-400">
          {completedCount} de {objective.activities.length} listas
        </span>
        {onEditObjective && (
          <button
            onClick={() => onEditObjective(objective)}
            className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-stone-400 hover:text-[#8B251E] hover:bg-[#8B251E]/10 transition flex items-center gap-1 cursor-pointer"
            title="Editar objetivo"
          >
            <Pencil className="w-2.5 h-2.5" />
            <span>Editar</span>
          </button>
        )}
      </div>

      <h2 className="text-base sm:text-lg font-black text-stone-900 mt-1 font-['Outfit']">
        {objective.title}
      </h2>
      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed max-w-2xl">
        {objective.description}
      </p>
    </div>

    <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
      <div className="text-right">
        <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider leading-none">
          Presupuesto Objetivo
        </span>
        <span className="text-sm sm:text-base font-black text-[#8B251E] font-['Outfit'] mt-0.5 block">
          {formatCurrencyCOP(totalObjectiveBudget)}
        </span>
      </div>
    </div>
  </div>
);
