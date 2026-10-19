import { useState, useEffect } from 'react';
import type { Activity, ActivityState } from '../../domain/plan.types';
import { calculateWeeks } from '../../../../shared/utils/formatters';
import { useToast } from '../../../../shared/components/Toast';
import { getInitialFormValues, validateActivityForm } from './activityModalDefaults';

interface Props {
  defaultObjectiveNumber: 1 | 2 | 3 | 4;
  mode?: 'create' | 'edit';
  activityToEdit?: Activity | null;
  onSave?: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
  onUpdate?: (activityId: string, updatedFields: Partial<Activity>) => void;
  onClose: () => void;
}

export const useActivityModalForm = ({
  defaultObjectiveNumber,
  mode = 'create',
  activityToEdit = null,
  onSave,
  onUpdate,
  onClose,
}: Props) => {
  const { toast } = useToast();
  const initial = getInitialFormValues(mode, activityToEdit, defaultObjectiveNumber);

  const [objectiveNumber, setObjectiveNumber] = useState<1 | 2 | 3 | 4>(initial.objectiveNumber);
  const [description, setDescription] = useState(initial.description);
  const [stage, setStage] = useState(initial.stage);
  const [state, setState] = useState<ActivityState>(initial.state);
  const [responsible, setResponsible] = useState(initial.responsible);
  const [frequency, setFrequency] = useState(initial.frequency);
  const [timesPerYear, setTimesPerYear] = useState<number>(initial.timesPerYear);
  const [unitBudget, setUnitBudget] = useState<number>(initial.unitBudget);
  const [startDate, setStartDate] = useState(initial.startDate);
  const [endDate, setEndDate] = useState(initial.endDate);
  const [currentSituation, setCurrentSituation] = useState(initial.currentSituation);
  const [shortTermGoal, setShortTermGoal] = useState(initial.shortTermGoal);
  const [mediumTermGoal, setMediumTermGoal] = useState(initial.mediumTermGoal);
  const [longTermGoal, setLongTermGoal] = useState(initial.longTermGoal);
  const [obstacles, setObstacles] = useState(initial.obstacles);

  useEffect(() => {
    const vals = getInitialFormValues(mode, activityToEdit, defaultObjectiveNumber);
    setObjectiveNumber(vals.objectiveNumber);
    setDescription(vals.description);
    setStage(vals.stage);
    setState(vals.state);
    setResponsible(vals.responsible);
    setFrequency(vals.frequency);
    setTimesPerYear(vals.timesPerYear);
    setUnitBudget(vals.unitBudget);
    setStartDate(vals.startDate);
    setEndDate(vals.endDate);
    setCurrentSituation(vals.currentSituation);
    setShortTermGoal(vals.shortTermGoal);
    setMediumTermGoal(vals.mediumTermGoal);
    setLongTermGoal(vals.longTermGoal);
    setObstacles(vals.obstacles);
  }, [mode, activityToEdit, defaultObjectiveNumber]);

  const calculatedTotal = (unitBudget || 0) * (timesPerYear || 0);
  const { totalWeeks, remainingWeeks } = calculateWeeks(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateActivityForm(description, responsible)) {
      toast.warning('Por favor complete la descripción y el responsable de la actividad.', 'Campos Requeridos');
      return;
    }

    const payload = {
      objectiveNumber,
      description,
      stage,
      state,
      responsible,
      frequency,
      timesPerYear,
      unitBudget,
      startDate,
      endDate,
      totalWeeks,
      remainingWeeks,
      currentSituation,
      shortTermGoal,
      mediumTermGoal,
      longTermGoal,
      obstacles,
    };

    if (mode === 'edit' && activityToEdit && onUpdate) {
      onUpdate(activityToEdit.id, payload);
      toast.success('Actividad actualizada correctamente con todos los cambios', 'Actividad Modificada');
      onClose();
      return;
    }

    if (onSave) {
      onSave(objectiveNumber, payload);
      toast.success('Nueva actividad guardada correctamente en el plan', 'Actividad Creada');
      onClose();
    }
  };

  return {
    objectiveNumber,
    setObjectiveNumber,
    description,
    setDescription,
    stage,
    setStage,
    state,
    setState,
    responsible,
    setResponsible,
    frequency,
    setFrequency,
    timesPerYear,
    setTimesPerYear,
    unitBudget,
    setUnitBudget,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentSituation,
    setCurrentSituation,
    shortTermGoal,
    setShortTermGoal,
    mediumTermGoal,
    setMediumTermGoal,
    longTermGoal,
    setLongTermGoal,
    obstacles,
    setObstacles,
    calculatedTotal,
    handleSubmit,
  };
};
