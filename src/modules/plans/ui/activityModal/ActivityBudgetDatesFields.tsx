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
  <div className="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
    <div className="flex items-center gap-2 pb-1 border-b border-stone-200/60">
      <span className="w-6 h-6 rounded-lg bg-[#E67324]/15 text-[#8B251E] flex items-center justify-center font-black text-xs font-['Outfit']">
        2
      </span>
      <h4 className="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
        Presupuesto & Cronograma Territorial
      </h4>
    </div>

    <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        <div>
          <label className="font-bold text-stone-700 block mb-1 text-[11px]">Presupuesto Unitario (COP)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
            <input
              type="number"
              value={unitBudget}
              onChange={(e) => setUnitBudget(Number(e.target.value))}
              step="10000"
              min="0"
              className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden font-black text-sm text-[#8B251E] transition"
              required
            />
          </div>
        </div>

        <div className="bg-stone-50/80 p-3 rounded-xl border border-stone-200/70 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-black tracking-wider text-stone-500">
            Total Estimado (Autocalculado)
          </span>
          <span className="text-base font-black text-[#8B251E] font-['Outfit'] mt-0.5">
            {formatCurrencyCOP(calculatedTotal)}
          </span>
          <span className="text-[9.5px] text-stone-400 font-medium">
            Fórmula: Valor Unitario × Repeticiones Anuales
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="font-bold text-stone-700 block mb-1 text-[11px]">Fecha de Inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
          required
        />
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1 text-[11px]">Fecha de Finalización</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
          required
        />
      </div>
    </div>
  </div>
);
