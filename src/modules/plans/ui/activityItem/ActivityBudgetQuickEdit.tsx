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
}) => (
  <div className="flex items-center gap-2">
    {isEditingBudget ? (
      <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-lg border border-stone-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[10px] text-stone-400 font-bold">$</span>
          <input
            type="number"
            value={unitBudgetInput}
            onChange={(e) => setUnitBudgetInput(Number(e.target.value))}
            className="w-16 p-0.5 text-xs border rounded bg-white text-stone-800 font-semibold"
            title="Valor unitario"
          />
          <span className="text-[10px] text-stone-400">×</span>
          <input
            type="number"
            value={timesPerYearInput}
            onChange={(e) => setTimesPerYearInput(Number(e.target.value))}
            className="w-8 p-0.5 text-xs border rounded bg-white text-stone-800 font-semibold"
            min="1"
            title="Veces al año"
          />
        </div>
        <button onClick={onSaveBudget} className="p-1 rounded bg-[#8B251E] text-white hover:bg-[#731E18] text-xs transition cursor-pointer" title="Guardar">
          <Check className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-1.5">
        <div className="text-right">
          <span className="text-sm font-black text-[#8B251E] font-['Outfit'] block leading-none">{formatCurrencyCOP(totalBudget)}</span>
          <span className="text-[9px] text-stone-400 font-medium">({formatCurrencyCOP(unitBudget)} × {timesPerYear}/año)</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setIsEditingBudget(true); }} className="p-1 rounded-md text-stone-400 hover:text-[#8B251E] hover:bg-stone-100 transition cursor-pointer" title="Modificar presupuesto rápido">
          <Edit3 className="w-3 h-3" />
        </button>
      </div>
    )}

    <button
      onClick={(e) => {
        e.stopPropagation();
        if (confirm('¿Desea eliminar esta actividad del plan?')) onDelete();
      }}
      className="p-1 rounded-md text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
      title="Eliminar actividad"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);
