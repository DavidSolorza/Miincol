import React from 'react';
import type { Objective } from '../../domain/plan.types';

interface Props {
  obj: Objective;
  isSelected: boolean;
  onSelect: () => void;
}

export const PhaseObjectiveCardItem: React.FC<Props> = ({
  obj,
  isSelected,
  onSelect,
}) => {
  const completedCount = obj.activities.filter((a) => a.state === 'Completado').length;
  const totalCount = obj.activities.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative text-left p-3 sm:p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-linear-to-b from-[#FAF7F2] to-white border-2 border-[#8B251E] shadow-sm ring-2 ring-[#8B251E]/15'
          : 'bg-stone-50/70 hover:bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-2xs'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-3 right-3 h-0.5 bg-linear-to-r from-[#8B251E] to-[#E67324] rounded-full" />
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition ${
                isSelected ? 'bg-[#8B251E] text-white shadow-2xs' : 'bg-stone-200 text-stone-600 group-hover:bg-stone-300'
              }`}
            >
              {obj.number}
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider truncate ${
                isSelected ? 'text-[#8B251E]' : 'text-stone-500 group-hover:text-stone-700'
              }`}
            >
              Objetivo #{obj.number}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 transition ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : isSelected
                ? 'bg-[#E67324]/15 text-[#8B251E]'
                : 'bg-stone-200/70 text-stone-600'
            }`}
          >
            {completedCount}/{totalCount} listas
          </span>
        </div>

        <h4
          className={`font-['Outfit'] font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[2.3rem] transition ${
            isSelected ? 'text-stone-900 font-extrabold' : 'text-stone-700 group-hover:text-stone-900'
          }`}
          title={obj.title}
        >
          {obj.title}
        </h4>
      </div>

      <div className="mt-3 pt-2 border-t border-stone-100 space-y-1">
        <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-emerald-500' : isSelected ? 'bg-linear-to-r from-[#8B251E] to-[#E67324]' : 'bg-stone-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[9px] font-medium text-stone-400">
          <span>{pct}% completado</span>
          <span className={isSelected ? 'text-[#8B251E] font-bold' : 'group-hover:text-stone-600'}>
            {isSelected ? '● Seleccionado' : 'Ver actividades →'}
          </span>
        </div>
      </div>
    </button>
  );
};
