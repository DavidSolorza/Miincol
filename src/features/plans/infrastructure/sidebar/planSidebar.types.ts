import type { PhasePlan, PhaseType, PlanMetrics } from '../../domain/plan.types';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

export interface PlanSidebarProps {
  allPlans: Record<string, PhasePlan>;
  activePhaseId: PhaseType;
  onSelectPhase: (phaseId: PhaseType) => void;
  activeObjectiveNumber?: number;
  onSelectObjective?: (objNum: number) => void;
  metrics: PlanMetrics;
  activeTeam: MissionaryTeam;
  onOpenTeamModal?: () => void;
  onOpenReportModal: () => void;
  onOpenNotesModal?: () => void;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  userRole?: 'admin' | 'team';
  onLogout?: () => void;
  whatsappUrl?: string | null;
}
