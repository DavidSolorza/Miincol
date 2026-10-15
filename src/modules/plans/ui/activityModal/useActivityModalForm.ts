import { useState } from 'react';
import type { Activity } from '../../domain/plan.types';
import { calculateWeeks } from '../../../../shared/utils/formatters';
import { useToast } from '../../../../shared/components/Toast';

interface Props {
  defaultObjectiveNumber: 1 | 2 | 3 | 4;
  onSave: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
  onClose: () => void;
}

export const useActivityModalForm = ({
  defaultObjectiveNumber,
  onSave,
  onClose,
}: Props) => {
  const { toast } = useToast();
  const [objectiveNumber, setObjectiveNumber] = useState<1 | 2 | 3 | 4>(defaultObjectiveNumber);
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('General');
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

  const calculatedTotal = (unitBudget || 0) * (timesPerYear || 0);
  const { totalWeeks, remainingWeeks } = calculateWeeks(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !responsible.trim()) {
      toast.warning('Por favor complete la descripción y el responsable de la actividad.', 'Campos Requeridos');
      return;
    }

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
      state: 'Pendiente',
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
  };

  return {
    objectiveNumber,
    setObjectiveNumber,
    description,
    setDescription,
    stage,
    setStage,
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
