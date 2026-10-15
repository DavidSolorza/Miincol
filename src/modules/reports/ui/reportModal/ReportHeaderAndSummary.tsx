import React from 'react';
import { MisincolLogo } from '../../../../shared/components/MisincolLogo';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { Printer } from 'lucide-react';
import type { useReportData } from '../../application/useReportData';

type ReportData = ReturnType<typeof useReportData>;

interface Props {
  report: ReportData;
  onPrint: () => void;
}

export const ReportHeaderAndSummary: React.FC<Props> = ({ report, onPrint }) => (
  <>
    <div className="no-print flex items-center justify-between bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200">
      <span className="text-xs text-stone-600 font-medium">
        💡 Puede imprimir o guardar directamente este informe como archivo <strong>PDF</strong> con formato oficial.
      </span>
      <button
        onClick={onPrint}
        className="bg-linear-to-r from-[#8B251E] to-[#E67324] hover:from-[#731E18] hover:to-[#D05E12] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimir / Descargar PDF</span>
      </button>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#8B251E] pb-6">
      <div>
        <MisincolLogo size="lg" />
        <p className="text-xs text-stone-500 mt-2 font-medium">
          Misiones Indígenas en Colombia • Dirección Nacional de Desarrollo Ministerial
        </p>
      </div>
      <div className="text-left sm:text-right">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-3 py-1 rounded-full">
          Informe Oficial PDM
        </span>
        <h2 className="text-lg font-black text-stone-900 mt-2 font-['Outfit']">{report.phaseName}</h2>
        <span className="text-xs text-stone-500 block">Fecha de emisión: {report.generatedAt}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-stone-200/80 text-xs">
      <div>
        <span className="text-[10px] uppercase font-bold text-stone-400 block">Equipo Ministerial</span>
        <span className="font-bold text-stone-800">{report.teamName}</span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-stone-400 block">Líder Responsable</span>
        <span className="font-bold text-stone-800">{report.teamLeader}</span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-stone-400 block">Fecha Inicio Fase</span>
        <span className="font-bold text-stone-800">{report.startDate}</span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-bold text-stone-400 block">Presupuesto Consolidado</span>
        <span className="font-black text-[#8B251E] text-sm">{formatCurrencyCOP(report.totalBudget)}</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
        <span className="text-[11px] font-bold text-stone-500 uppercase block">Progreso de Fase</span>
        <span className="text-2xl font-black text-[#8B251E] font-['Outfit']">{report.progressPercentage}%</span>
        <span className="text-[10px] text-stone-400 block mt-0.5">Avance general</span>
      </div>
      <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
        <span className="text-[11px] font-bold text-stone-500 uppercase block">Iniciativas Totales</span>
        <span className="text-2xl font-black text-stone-800 font-['Outfit']">{report.totalActivities}</span>
        <span className="text-[10px] text-stone-400 block mt-0.5">4 objetivos estratégicos</span>
      </div>
      <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
        <span className="text-[11px] font-bold text-stone-500 uppercase block">Completadas vs Curso</span>
        <span className="text-2xl font-black text-emerald-700 font-['Outfit']">{report.completedCount} / {report.inProgressCount}</span>
        <span className="text-[10px] text-stone-400 block mt-0.5">{report.pendingCount} pendientes</span>
      </div>
    </div>
  </>
);
