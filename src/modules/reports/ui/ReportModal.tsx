import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { PhasePlan } from '../../plans/domain/plan.types';
import { useReportData } from '../application/useReportData';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import { MisincolLogo } from '../../../shared/components/MisincolLogo';
import { Printer } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PhasePlan;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, plan }) => {
  const report = useReportData(plan);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Informe Ejecutivo - Plan de Desarrollo Ministerial"
      subtitle="Documento consolidado de avance operativo, metas y presupuesto para supervisión nacional"
      maxWidth="4xl"
    >
      <div className="space-y-6 text-stone-800">
        {/* Barra superior de acciones para exportar */}
        <div className="no-print flex items-center justify-between bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200">
          <span className="text-xs text-stone-600 font-medium">
            💡 Puede imprimir o guardar directamente este informe como archivo <strong>PDF</strong> con formato oficial.
          </span>
          <button
            onClick={handlePrint}
            className="bg-linear-to-r from-[#8B251E] to-[#E67324] hover:from-[#731E18] hover:to-[#D05E12] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Descargar PDF</span>
          </button>
        </div>

        {/* Contenido Imprimible / Vista de Reporte Formal */}
        <div id="pdm-printable-report" className="print-card bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          {/* Encabezado Institucional Misincol */}
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
              <h2 className="text-lg font-black text-stone-900 mt-2 font-['Outfit']">
                {report.phaseName}
              </h2>
              <span className="text-xs text-stone-500 block">Fecha de emisión: {report.generatedAt}</span>
            </div>
          </div>

          {/* Ficha Técnica de la Misión */}
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

          {/* Resumen de Ejecución y Métricas Clave */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Progreso de Fase</span>
              <span className="text-2xl font-black text-[#8B251E] font-['Outfit']">
                {report.progressPercentage}%
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Avance general</span>
            </div>
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Iniciativas Totales</span>
              <span className="text-2xl font-black text-stone-800 font-['Outfit']">
                {report.totalActivities}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">4 objetivos estratégicos</span>
            </div>
            <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-center">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Completadas vs Curso</span>
              <span className="text-2xl font-black text-emerald-700 font-['Outfit']">
                {report.completedCount} / {report.inProgressCount}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">{report.pendingCount} pendientes</span>
            </div>
          </div>

          {/* Tabla de Objetivos y Presupuesto Asignado */}
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
                  {report.objectivesSummary.map((obj) => (
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
                      {formatCurrencyCOP(report.totalBudget)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Desglose Detallado de Actividades y Contingencias */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2 font-['Outfit'] uppercase tracking-wider text-[#8B251E]">
              2. Detalle Operativo de Actividades y Contingencias Territoriales
            </h3>
            <div className="space-y-3">
              {report.objectivesSummary.flatMap((obj) =>
                obj.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg border border-stone-200 bg-stone-50/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">
                        [Obj #{act.objectiveNumber}] {act.description}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          act.state === 'Completado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : act.state === 'En Proceso'
                            ? 'bg-orange-100 text-[#8B251E]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {act.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600">
                      <div>
                        <strong>Responsable:</strong> {act.responsible}
                      </div>
                      <div>
                        <strong>Frecuencia:</strong> {act.frequency} ({act.timesPerYear}/año)
                      </div>
                      <div>
                        <strong>Presupuesto:</strong> {formatCurrencyCOP(act.totalBudget)}
                      </div>
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
          </div>

          {/* Firmas Ministeriales */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-stone-400 pt-2">
              <span className="font-bold text-stone-800 block">{report.teamLeader}</span>
              <span className="text-[11px] text-stone-500">Líder Misionero en Territorio</span>
              <span className="text-[10px] text-stone-400 block">{report.teamName}</span>
            </div>
            <div className="border-t border-stone-400 pt-2">
              <span className="font-bold text-stone-800 block">Comité Pastoral Nacional</span>
              <span className="text-[11px] text-stone-500">Supervisión y Acompañamiento PDM</span>
              <span className="text-[10px] text-stone-400 block">MISINCOL Colombia</span>
            </div>
          </div>
        </div>

        {/* Botón inferior de cierre */}
        <div className="no-print flex justify-end pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </Modal>
  );
};
