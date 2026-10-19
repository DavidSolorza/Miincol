import type { PhasePlan, Activity, PlanMetrics } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

export interface PhaseViewProps {
  plan: PhasePlan;
  activeObjectiveNumber: number;
  onSelectObjective: (objNum: number) => void;
  updateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  deleteActivity: (activityId: string) => void;
  addActivity: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
  updateObjective?: (objectiveNumber: 1 | 2 | 3 | 4, updates: { title?: string; description?: string }) => void;
  addObjective?: (newObj: { title: string; description: string }) => 1 | 2 | 3 | 4 | null;
  deleteObjective?: (objectiveNumber: 1 | 2 | 3 | 4) => boolean;
  resetToDefaults: () => void;
  metrics: PlanMetrics;
  onToggleMobileMenu: () => void;
  activeTeam?: MissionaryTeam;
  whatsappUrl?: string | null;
  onOpenTeamModal?: () => void;
}
