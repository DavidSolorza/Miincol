import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import type { TeamSupervisionSummary } from '../../modules/admin/domain/admin.types';
import type { AuthSession } from '../auth/appSession.types';
import type { useAdminDashboard } from '../../modules/admin/application/useAdminDashboard';

export interface AppWorkspaceProps {
  session: AuthSession;
  activeTeam: MissionaryTeam;
  activeTeamSummary?: TeamSupervisionSummary;
  mappedTeams: MissionaryTeam[];
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  isAdminPreview: boolean;
  setIsAdminPreview: (val: boolean) => void;
  activeView: 'plans' | 'superadmin';
  setActiveView: (view: 'plans' | 'superadmin') => void;
  handleLogout: () => void;
  handleBackToAdmin: () => void;
  handleInspectTeamFromAdmin: (id: string) => void;
  dashboardHook: ReturnType<typeof useAdminDashboard>;
}
