import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { Activity } from '../domain/plan.types';
import { PlusCircle, Check } from 'lucide-react';
import { useActivityModalForm } from './activityModal/useActivityModalForm';
import { ActivityBasicFields } from './activityModal/ActivityBasicFields';
import { ActivityBudgetDatesFields } from './activityModal/ActivityBudgetDatesFields';
import { ActivityGoalsFields } from './activityModal/ActivityGoalsFields';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  activityToEdit?: Activity | null;
  defaultObjectiveNumber: 1 | 2 | 3 | 4;
  onSave?: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
  onUpdate?: (activityId: string, updatedFields: Partial<Activity>) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  mode = 'create',
  activityToEdit = null,
  defaultObjectiveNumber,
  onSave,
  onUpdate,
}) => {
  const form = useActivityModalForm({
    defaultObjectiveNumber,
    mode,
    activityToEdit,
    onSave,
    onUpdate,
    onClose,
  });

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Editar Actividad / Sub-Objetivo' : 'Nueva Iniciativa / Actividad Ministerial';
  const subtitle = isEdit
    ? 'Modifique cualquier información de la actividad, presupuesto, cronograma territorial o diagnóstico'
    : 'Complete los campos para registrar una acción en el Plan de Desarrollo Ministerial';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="2xl"
    >
      <form onSubmit={form.handleSubmit} noValidate className="space-y-4 text-xs">
        <ActivityBasicFields
          objectiveNumber={form.objectiveNumber}
          setObjectiveNumber={form.setObjectiveNumber}
          stage={form.stage}
          setStage={form.setStage}
          state={form.state}
          setState={form.setState}
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

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs flex items-center justify-end gap-2.5 pt-3 pb-1 border-t border-stone-200/60 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200/80 text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 active:scale-95 cursor-pointer font-['Outfit']"
          >
            {isEdit ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isEdit ? 'Guardar Cambios' : 'Guardar Iniciativa'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
