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
      className={`group relative text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between w-full h-full min-h-[148px] ${
        isSelected
          ? 'bg-gradient-to-b from-white via-[#FFFDF9] to-[#FAF7F2] border-2 border-[#E67324]/70 shadow-[0_8px_24px_-4px_rgba(230,115,36,0.15)] ring-4 ring-[#E67324]/10'
          : 'bg-white/70 hover:bg-white border border-stone-200/70 hover:border-stone-300 hover:shadow-2xs'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400 rounded-full" />
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition font-['Outfit'] ${
                isSelected
                  ? 'bg-gradient-to-br from-[#8B251E] to-[#E67324] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
              }`}
            >
              {obj.number}
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider truncate font-['Outfit'] ${
                isSelected ? 'text-[#8B251E]' : 'text-stone-500 group-hover:text-stone-700'
              }`}
            >
              Objetivo #{obj.number}
            </span>
          </div>

          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0 transition tracking-tight ${
              isCompleted
                ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200/60'
                : isSelected
                ? 'bg-[#E67324]/15 text-[#8B251E] border border-[#E67324]/30'
                : 'bg-stone-100 text-stone-600 border border-stone-200/50'
            }`}
          >
            {completedCount}/{totalCount} listas
          </span>
        </div>

        <h4
          className={`font-['Outfit'] font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[2.6rem] transition ${
            isSelected ? 'text-stone-900 font-extrabold' : 'text-stone-700 group-hover:text-stone-900'
          }`}
          title={obj.title}
        >
          {obj.title}
        </h4>
      </div>


      <div className="mt-3 pt-2.5 border-t border-stone-100/90 space-y-1.5">
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500'
                : isSelected
                ? 'bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400'
                : 'bg-stone-300 group-hover:bg-stone-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium text-stone-400">
          <span>{pct}% completado</span>
          <span className={isSelected ? 'text-[#E67324] font-bold inline-flex items-center gap-1' : 'group-hover:text-stone-600'}>
            {isSelected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E67324] animate-pulse" />
                <span>Activo</span>
              </>
            ) : (
              'Ver actividades →'
            )}
          </span>
        </div>
      </div>
    </button>
  );
};
