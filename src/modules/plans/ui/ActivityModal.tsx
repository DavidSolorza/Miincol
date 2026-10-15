import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { Activity } from '../domain/plan.types';
import { PlusCircle } from 'lucide-react';
import { useActivityModalForm } from './activityModal/useActivityModalForm';
import { ActivityBasicFields } from './activityModal/ActivityBasicFields';
import { ActivityBudgetDatesFields } from './activityModal/ActivityBudgetDatesFields';
import { ActivityGoalsFields } from './activityModal/ActivityGoalsFields';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultObjectiveNumber: 1 | 2 | 3 | 4;
  onSave: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  defaultObjectiveNumber,
  onSave,
}) => {
  const form = useActivityModalForm({
    defaultObjectiveNumber,
    onSave,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Iniciativa / Actividad Ministerial"
      subtitle="Complete los campos para registrar una acción en el Plan de Desarrollo Ministerial"
      maxWidth="2xl"
    >
      <form onSubmit={form.handleSubmit} noValidate className="space-y-4 text-xs">
        <ActivityBasicFields
          objectiveNumber={form.objectiveNumber}
          setObjectiveNumber={form.setObjectiveNumber}
          stage={form.stage}
          setStage={form.setStage}
          description={form.description}
          setDescription={form.setDescription}
          responsible={form.responsible}
          setResponsible={form.setResponsible}
          frequency={form.frequency}
          setFrequency={form.setFrequency}
          timesPerYear={form.timesPerYear}
          setTimesPerYear={form.setTimesPerYear}
        />

        <ActivityBudgetDatesFields
          unitBudget={form.unitBudget}
          setUnitBudget={form.setUnitBudget}
          calculatedTotal={form.calculatedTotal}
          startDate={form.startDate}
          setStartDate={form.setStartDate}
          endDate={form.endDate}
          setEndDate={form.setEndDate}
        />

        <ActivityGoalsFields
          currentSituation={form.currentSituation}
          setCurrentSituation={form.setCurrentSituation}
          mediumTermGoal={form.mediumTermGoal}
          setMediumTermGoal={form.setMediumTermGoal}
          longTermGoal={form.longTermGoal}
          setLongTermGoal={form.setLongTermGoal}
          obstacles={form.obstacles}
          setObstacles={form.setObstacles}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white font-bold transition flex items-center gap-2 shadow-md shadow-[#8B251E]/20 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Guardar Iniciativa</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
