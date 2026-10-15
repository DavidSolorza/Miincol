import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';

export interface AppHeaderProps {
  shouldShowSidebar: boolean;
  isSuperAdmin: boolean;
  activeView: 'plans' | 'superadmin';
  mappedTeams: MissionaryTeam[];
  activeTeamId: string;
  activeTeam: MissionaryTeam;
  themeColor: string;
  session: AuthSession;
  onOpenMobileSidebar: () => void;
  onSelectTeam: (teamId: string) => void;
  onGoToSuperAdmin: () => void;
  onLogout: () => void;
}
