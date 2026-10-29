/**
 * Default State and Validation for Activity Modal Form
 * Aligned with Technical Governance Contract v2026.4.0 (< 150 lines)
 */

import type { Activity, ActivityState } from '../../domain/plan.types';

// Estado del formulario y funciones de inicialización y validación para el modal de actividad
export interface ActivityFormState {
  objectiveNumber: 1 | 2 | 3 | 4;
  description: string;
  stage: string;
  state: ActivityState;
  responsible: string;
  frequency: string;
  timesPerYear: number;
  unitBudget: number;
  startDate: string;
  endDate: string;
  currentSituation: string;
  shortTermGoal: string;
  mediumTermGoal: string;
  longTermGoal: string;
  obstacles: string;
}

// Genera los valores iniciales del formulario según si se está creando o editando una actividad
export const getInitialFormValues = (
  mode: 'create' | 'edit',
  activityToEdit: Activity | null | undefined,
  defaultObjectiveNumber: 1 | 2 | 3 | 4
): ActivityFormState => {
  if (mode === 'edit' && activityToEdit) {
    return {
      objectiveNumber: activityToEdit.objectiveNumber,
      description: activityToEdit.description || '',
      stage: activityToEdit.stage || 'General',
      state: activityToEdit.state || 'Pendiente',
      responsible: activityToEdit.responsible || '',
      frequency: activityToEdit.frequency || 'Mensual',
      timesPerYear: activityToEdit.timesPerYear || 12,
      unitBudget: activityToEdit.unitBudget || 0,
      startDate: activityToEdit.startDate || '2026-03-01',
      endDate: activityToEdit.endDate || '2026-11-30',
      currentSituation: activityToEdit.currentSituation || '',
      shortTermGoal: activityToEdit.shortTermGoal || '',
      mediumTermGoal: activityToEdit.mediumTermGoal || '',
      longTermGoal: activityToEdit.longTermGoal || '',
      obstacles: activityToEdit.obstacles || '',
    };
  }

  return {
    objectiveNumber: defaultObjectiveNumber,
    description: '',
    stage: 'General',
    state: 'Pendiente',
    responsible: '',
    frequency: 'Mensual',
    timesPerYear: 12,
    unitBudget: 300000,
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    currentSituation: '',
    shortTermGoal: '',
    mediumTermGoal: '',
    longTermGoal: '',
    obstacles: '',
  };
};

// Verifica que la descripción y el responsable de la actividad no estén vacíos
export const validateActivityForm = (description: string, responsible: string): boolean => {
  return description.trim().length > 0 && responsible.trim().length > 0;
};
