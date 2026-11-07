import { type Activity, type ActivityState, type EssentialArea, STAGES_BY_AREA } from '../../domain/plan.types';

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
  monthlyBudget?: Record<number, number>;
  essentialArea?: EssentialArea;
  areaLevel?: string;
}

export const getInitialFormValues = (
  mode: 'create' | 'edit',
  activityToEdit: Activity | null | undefined,
  defaultObjectiveNumber: 1 | 2 | 3 | 4,
  defaultArea: EssentialArea = 'Investigación'
): ActivityFormState => {
  if (mode === 'edit' && activityToEdit) {
    const area = activityToEdit.essentialArea || defaultArea;
    const allowed = STAGES_BY_AREA[area] || STAGES_BY_AREA.Investigación;
    const stage = activityToEdit.stage && allowed.includes(activityToEdit.stage as any)
      ? activityToEdit.stage
      : allowed[0];

    return {
      objectiveNumber: (activityToEdit.objectiveNumber as 1 | 2 | 3 | 4) || defaultObjectiveNumber,
      description: activityToEdit.description || '',
      stage,
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
      monthlyBudget: activityToEdit.monthlyBudget || {},
      essentialArea: area,
      areaLevel: activityToEdit.areaLevel,
    };
  }

  const initialArea = defaultArea;
  const initialStages = STAGES_BY_AREA[initialArea] || STAGES_BY_AREA.Investigación;

  return {
    objectiveNumber: defaultObjectiveNumber,
    description: '',
    stage: initialStages[0],
    state: 'Pendiente',
    responsible: '',
    frequency: 'Mensual',
    timesPerYear: 12,
    unitBudget: 0,
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    currentSituation: '',
    shortTermGoal: '',
    mediumTermGoal: '',
    longTermGoal: '',
    obstacles: '',
    monthlyBudget: {},
    essentialArea: initialArea,
  };
};

export const validateActivityForm = (description: string, responsible: string): boolean => {
  return description.trim().length > 0 && responsible.trim().length > 0;
};
