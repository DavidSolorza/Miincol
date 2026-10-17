import React from 'react';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { Check, Edit3, Trash2 } from 'lucide-react';

interface Props {
  totalBudget: number;
  unitBudget: number;
  timesPerYear: number;
  isEditingBudget: boolean;
  setIsEditingBudget: (val: boolean) => void;
  unitBudgetInput: number;
  setUnitBudgetInput: (val: number) => void;
  timesPerYearInput: number;
  setTimesPerYearInput: (val: number) => void;
  onSaveBudget: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export const ActivityBudgetQuickEdit: React.FC<Props> = ({
  totalBudget,
  unitBudget,
  timesPerYear,
  isEditingBudget,
  setIsEditingBudget,
  unitBudgetInput,
  setUnitBudgetInput,
  timesPerYearInput,
  setTimesPerYearInput,
  onSaveBudget,
  onDelete,
  onEdit,
}) => (
  <div className="flex items-center gap-2">
    {isEditingBudget ? (
      <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border border-stone-200 shadow-2xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] text-stone-400 font-bold">$</span>
          <input
            type="number"
            value={unitBudgetInput}
            onChange={(e) => setUnitBudgetInput(Number(e.target.value))}
            className="w-20 p-1 text-xs border border-stone-200 rounded-lg bg-white text-stone-900 font-bold"
            title="Valor unitario"
          />
          <span className="text-[10px] text-stone-400">×</span>
          <input
            type="number"
            value={timesPerYearInput}
            onChange={(e) => setTimesPerYearInput(Number(e.target.value))}
            className="w-10 p-1 text-xs border border-stone-200 rounded-lg bg-white text-stone-900 font-bold"
            min="1"
            title="Veces al año"
          />
        </div>
        <button onClick={onSaveBudget} className="p-1.5 rounded-lg bg-[#8B251E] text-white hover:bg-[#731E18] text-xs transition cursor-pointer shadow-2xs" title="Guardar">
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <div className="bg-stone-50/90 px-3 py-1.5 rounded-xl border border-stone-200/70 text-right shadow-2xs">
          <span className="text-sm font-black text-stone-900 font-['Outfit'] block leading-none">{formatCurrencyCOP(totalBudget)}</span>
          <span className="text-[9.5px] text-stone-400 font-semibold block mt-0.5">({formatCurrencyCOP(unitBudget)} × {timesPerYear}/año)</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) {
              onEdit();
            } else {
              setIsEditingBudget(true);
            }
          }}
          className="w-7 h-7 rounded-xl text-stone-400 hover:text-[#8B251E] hover:bg-stone-100 flex items-center justify-center transition cursor-pointer"
          title="Editar actividad completa"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
    )}

    <button
      onClick={(e) => {
        e.stopPropagation();
        if (confirm('¿Desea eliminar esta actividad del plan?')) onDelete();
      }}
      className="w-7 h-7 rounded-xl text-stone-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
      title="Eliminar actividad"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);
