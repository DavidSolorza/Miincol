import React from 'react';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import type { useReportData } from '../../application/useReportData';

type ReportData = ReturnType<typeof useReportData>;

interface Props {
  objectivesSummary: ReportData['objectivesSummary'];
  teamLeader: string;
  teamName: string;
}

export const ReportActivitiesDetail: React.FC<Props> = ({
  objectivesSummary,
  teamLeader,
  teamName,
}) => (
  <div>
    <h3 className="text-sm font-bold text-stone-900 mb-2 font-['Outfit'] uppercase tracking-wider text-[#8B251E]">
      2. Detalle Operativo de Actividades y Contingencias Territoriales
    </h3>
    <div className="space-y-3">
      {objectivesSummary.flatMap((obj) =>
        obj.activities.map((act) => (
          <div key={act.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">[Obj #{act.objectiveNumber}] {act.description}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                act.state === 'Completado'
                  ? 'bg-emerald-100 text-emerald-800'
                  : act.state === 'En Proceso'
                  ? 'bg-orange-100 text-[#8B251E]'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {act.state}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600">
              <div><strong>Responsable:</strong> {act.responsible}</div>
              <div><strong>Frecuencia:</strong> {act.frequency} ({act.timesPerYear}/año)</div>
              <div><strong>Presupuesto:</strong> {formatCurrencyCOP(act.totalBudget)}</div>
            </div>

            {act.obstacles && (
              <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200/60 mt-1">
                <strong>Dificultades en territorio:</strong> {act.obstacles}
              </p>
            )}
          </div>
        ))
      )}
    </div>

    <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
      <div className="border-t border-stone-400 pt-2">
        <span className="font-bold text-stone-800 block">{teamLeader}</span>
        <span className="text-[11px] text-stone-500">Líder Misionero en Territorio</span>
        <span className="text-[10px] text-stone-400 block">{teamName}</span>
      </div>
      <div className="border-t border-stone-400 pt-2">
        <span className="font-bold text-stone-800 block">Comité Pastoral Nacional</span>
        <span className="text-[11px] text-stone-500">Supervisión y Acompañamiento PDM</span>
        <span className="text-[10px] text-stone-400 block">MISINCOL Colombia</span>
      </div>
    </div>
  </div>
);
