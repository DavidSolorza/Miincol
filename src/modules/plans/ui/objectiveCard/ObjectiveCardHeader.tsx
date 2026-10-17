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
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-black text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-xl border border-[#8B251E]/15 font-['Outfit']">
          Objetivo #{objective.number}
        </span>
        <span className="text-xs font-semibold text-stone-400">
          • {completedCount} de {objective.activities.length} listas
        </span>
        {onEditObjective && (
          <button
            onClick={() => onEditObjective(objective)}
            className="px-2 py-0.5 rounded-lg text-xs font-bold text-stone-500 hover:text-[#8B251E] hover:bg-[#8B251E]/10 transition flex items-center gap-1 cursor-pointer"
            title="Editar objetivo"
          >
            <Pencil className="w-3 h-3 text-[#E67324]" />
            <span>Editar</span>
          </button>
        )}
      </div>

      <h2 className="text-base sm:text-lg font-black text-stone-900 mt-1.5 font-['Outfit'] tracking-tight">
        {objective.title}
      </h2>
      <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-2xl font-medium">
        {objective.description}
      </p>
    </div>

    <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
      <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-stone-50 border border-stone-200/80 text-right shadow-2xs">
        <span className="text-[9.5px] uppercase font-black text-stone-400 block tracking-wider leading-none">
          Presupuesto Objetivo
        </span>
        <span className="text-base sm:text-lg font-black text-[#8B251E] font-['Outfit'] mt-1 block tracking-tight">
          {formatCurrencyCOP(totalObjectiveBudget)}
        </span>
      </div>
    </div>
  </div>
);
