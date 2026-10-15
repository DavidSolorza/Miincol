import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { PhasePlan } from '../../plans/domain/plan.types';
import { useReportData } from '../application/useReportData';
import { ReportHeaderAndSummary } from './reportModal/ReportHeaderAndSummary';
import { ReportObjectivesTable } from './reportModal/ReportObjectivesTable';
import { ReportActivitiesDetail } from './reportModal/ReportActivitiesDetail';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PhasePlan;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, plan }) => {
  const report = useReportData(plan);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Informe Ejecutivo - Plan de Desarrollo Ministerial"
      subtitle="Documento consolidado de avance operativo, metas y presupuesto para supervisión nacional"
      maxWidth="4xl"
    >
      <div className="space-y-6 text-stone-800">
        <ReportHeaderAndSummary report={report} onPrint={() => window.print()} />

        <div id="pdm-printable-report" className="print-card bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <ReportObjectivesTable
            objectivesSummary={report.objectivesSummary}
            totalBudget={report.totalBudget}
          />
          <ReportActivitiesDetail
            objectivesSummary={report.objectivesSummary}
            teamLeader={report.teamLeader}
            teamName={report.teamName}
          />
        </div>

        <div className="no-print flex justify-end pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </Modal>
  );
};
