import React from 'react';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { useReportData } from '../../application/useReportData';

type ReportData = ReturnType<typeof useReportData>;

interface Props {
  objectivesSummary: ReportData['objectivesSummary'];
  totalBudget: number;
}

export const ReportObjectivesTable: React.FC<Props> = ({
  objectivesSummary,
  totalBudget,
}) => (
  <div>
    <h3 className="text-sm font-bold text-stone-900 mb-2 font-['Outfit'] uppercase tracking-wider text-[#8B251E]">
      1. Balance por Objetivos Estratégicos
    </h3>
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700">
          <tr>
            <th className="p-2.5 font-bold">#</th>
            <th className="p-2.5 font-bold">Objetivo de Área</th>
            <th className="p-2.5 font-bold text-center">Total Actividades</th>
            <th className="p-2.5 font-bold text-center">Estado (Listas / Curso / Pend)</th>
            <th className="p-2.5 font-bold text-right">Presupuesto Anual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {objectivesSummary.map((obj) => (
            <tr key={obj.number} className="hover:bg-stone-50/50">
              <td className="p-2.5 font-black text-[#8B251E]">#{obj.number}</td>
              <td className="p-2.5">
                <span className="font-bold text-stone-800 block">{obj.title}</span>
                <span className="text-[11px] text-stone-500 line-clamp-1">{obj.description}</span>
              </td>
              <td className="p-2.5 text-center font-semibold">{obj.activitiesCount}</td>
              <td className="p-2.5 text-center text-[11px]">
                <span className="text-emerald-700 font-bold">{obj.completedCount}</span> /{' '}
                <span className="text-[#D05E12] font-bold">{obj.inProgressCount}</span> /{' '}
                <span className="text-amber-700 font-bold">{obj.pendingCount}</span>
              </td>
              <td className="p-2.5 text-right font-black text-[#8B251E]">
                {formatCurrencyCOP(obj.totalBudget)}
              </td>
            </tr>
          ))}
          <tr className="bg-[#FAF7F2] font-bold border-t-2 border-stone-300">
            <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider text-stone-700">
              Total Presupuestal Fase:
            </td>
            <td className="p-2.5 text-right text-sm font-black text-[#8B251E]">
              {formatCurrencyCOP(totalBudget)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
