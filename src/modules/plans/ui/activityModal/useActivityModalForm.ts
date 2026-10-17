import { useState, useEffect } from 'react';
import type { Activity, ActivityState } from '../../domain/plan.types';
import { calculateWeeks } from '../../../../shared/utils/formatters';
import { useToast } from '../../../../shared/components/Toast';

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
  const [objectiveNumber, setObjectiveNumber] = useState<1 | 2 | 3 | 4>(defaultObjectiveNumber);
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('General');
  const [state, setState] = useState<ActivityState>('Pendiente');
  const [responsible, setResponsible] = useState('');
  const [frequency, setFrequency] = useState('Mensual');
  const [timesPerYear, setTimesPerYear] = useState<number>(12);
  const [unitBudget, setUnitBudget] = useState<number>(300000);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [currentSituation, setCurrentSituation] = useState('');
  const [mediumTermGoal, setMediumTermGoal] = useState('');
  const [longTermGoal, setLongTermGoal] = useState('');
  const [obstacles, setObstacles] = useState('');

  // Synchronize form when opening in edit mode or resetting in create mode
  useEffect(() => {
    if (mode === 'edit' && activityToEdit) {
      setObjectiveNumber(activityToEdit.objectiveNumber);
      setDescription(activityToEdit.description || '');
      setStage(activityToEdit.stage || 'General');
      setState(activityToEdit.state || 'Pendiente');
      setResponsible(activityToEdit.responsible || '');
      setFrequency(activityToEdit.frequency || 'Mensual');
      setTimesPerYear(activityToEdit.timesPerYear || 12);
      setUnitBudget(activityToEdit.unitBudget || 0);
      setStartDate(activityToEdit.startDate || '2026-03-01');
      setEndDate(activityToEdit.endDate || '2026-11-30');
      setCurrentSituation(activityToEdit.currentSituation || '');
      setMediumTermGoal(activityToEdit.mediumTermGoal || '');
      setLongTermGoal(activityToEdit.longTermGoal || '');
      setObstacles(activityToEdit.obstacles || '');
    } else {
      setObjectiveNumber(defaultObjectiveNumber);
      setDescription('');
      setStage('General');
      setState('Pendiente');
      setResponsible('');
      setFrequency('Mensual');
      setTimesPerYear(12);
      setUnitBudget(300000);
      setStartDate('2026-03-01');
      setEndDate('2026-11-30');
      setCurrentSituation('');
      setMediumTermGoal('');
      setLongTermGoal('');
      setObstacles('');
    }
  }, [mode, activityToEdit, defaultObjectiveNumber]);

  const calculatedTotal = (unitBudget || 0) * (timesPerYear || 0);
  const { totalWeeks, remainingWeeks } = calculateWeeks(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !responsible.trim()) {
      toast.warning('Por favor complete la descripción y el responsable de la actividad.', 'Campos Requeridos');
      return;
    }

    if (mode === 'edit' && activityToEdit && onUpdate) {
      onUpdate(activityToEdit.id, {
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
        mediumTermGoal,
        longTermGoal,
        obstacles,
      });

      toast.success('Actividad actualizada correctamente con todos los cambios', 'Actividad Modificada');
      onClose();
      return;
    }

    if (onSave) {
      onSave(objectiveNumber, {
        description,
        stage,
        responsible,
        frequency,
        timesPerYear,
        unitBudget,
        startDate,
        endDate,
        totalWeeks,
        remainingWeeks,
        state,
        currentSituation,
        mediumTermGoal,
        longTermGoal,
        obstacles,
      });

      toast.success('Nueva actividad guardada correctamente en el plan', 'Actividad Creada');
      onClose();
      setDescription('');
      setCurrentSituation('');
      setMediumTermGoal('');
      setLongTermGoal('');
      setObstacles('');
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
