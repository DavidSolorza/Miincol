import React from 'react';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  unitBudget: number;
  setUnitBudget: (b: number) => void;
  calculatedTotal: number;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
}

export const ActivityBudgetDatesFields: React.FC<Props> = ({
  unitBudget,
  setUnitBudget,
  calculatedTotal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => (
  <>
    <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        <div>
          <label className="font-bold text-stone-700 block mb-1">Presupuesto Unitario (COP)</label>
          <input
            type="number"
            value={unitBudget}
            onChange={(e) => setUnitBudget(Number(e.target.value))}
            step="10000"
            min="0"
            className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-bold text-[#8B251E]"
            required
          />
        </div>

        <div className="bg-white p-3 rounded-lg border border-stone-200/90 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-stone-400">
            Presupuesto Total Estimado (Autocalculado)
          </span>
          <span className="text-base font-black text-[#8B251E] font-['Outfit']">
            {formatCurrencyCOP(calculatedTotal)}
          </span>
          <span className="text-[10px] text-stone-500">
            Fórmula: Valor Unitario × Repeticiones Anuales
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="font-bold text-stone-700 block mb-1">Fecha de Inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
          required
        />
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1">Fecha de Finalización</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
          required
        />
      </div>
    </div>
  </>
);
