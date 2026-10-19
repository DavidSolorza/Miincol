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
  const objBudget = obj.activities.reduce((acc, a) => acc + (a.totalBudget || 0), 0);
  const formattedBudget = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(objBudget);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative text-left p-3.5 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between w-full h-full min-h-[145px] sm:min-h-[160px] ${
        isSelected
          ? 'bg-gradient-to-b from-[#FFFDF9] via-white to-[#FAF7F2] border-2 border-[#E67324]/70 shadow-[0_4px_18px_-2px_rgba(230,115,36,0.18)] ring-2 ring-[#E67324]/10'
          : 'bg-white/85 hover:bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-2xs'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#8B251E] via-[#E67324] to-amber-400 rounded-full" />
      )}

      {/* Top Section: Header & Title & Description */}
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10.5px] sm:text-xs font-black shrink-0 transition font-['Outfit'] ${
                isSelected
                  ? 'bg-gradient-to-br from-[#8B251E] to-[#E67324] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
              }`}
            >
              {obj.number}
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider font-['Outfit'] truncate ${
                isSelected ? 'text-[#8B251E]' : 'text-stone-500 group-hover:text-stone-700'
              }`}
            >
              Objetivo #{obj.number}
            </span>
          </div>

          <span
            className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md shrink-0 transition tracking-tight whitespace-nowrap ${
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
          className={`font-['Outfit'] font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 transition ${
            isSelected ? 'text-stone-900 font-extrabold' : 'text-stone-800 group-hover:text-stone-900'
          }`}
          title={obj.title}
        >
          {obj.title}
        </h4>

        {obj.description && (
          <p className="text-[10.5px] sm:text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
            {obj.description}
          </p>
        )}
      </div>

      {/* Middle/Meta Section: Activities count & Budget */}
      <div className="pt-2 border-t border-stone-100/90 flex items-center justify-between text-[10px] text-stone-400">
        <span>{totalCount} {totalCount === 1 ? 'actividad' : 'actividades'}</span>
        <span className="font-bold text-stone-600 font-['Outfit']">{formattedBudget}</span>
      </div>

      {/* Bottom Section: Progress bar & status */}
      <div className="pt-1 space-y-1 w-full">
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden p-0.5">
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
        <div className="flex items-center justify-between text-[9.5px] font-medium text-stone-400">
          <span>{pct}% completado</span>
          {isSelected ? (
            <span className="text-[#E67324] font-bold inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67324] animate-pulse" />
              <span>Activo</span>
            </span>
          ) : (
            <span className="group-hover:text-stone-600 transition">Ver actividades →</span>
          )}
        </div>
      </div>
    </button>
  );
};
