import React from 'react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';
import { AdminPreviewBanner } from './AdminPreviewBanner';
import { AppHeader } from './AppHeader';

interface Props {
  isAdminPreview: boolean;
  activeTeam: MissionaryTeam;
  whatsappUrl: string | null;
  handleBackToAdmin: () => void;
  shouldShowSidebar: boolean;
  isSuperAdmin: boolean;
  activeView: 'plans' | 'superadmin';
  mappedTeams: MissionaryTeam[];
  activeTeamId: string;
  themeColor: string;
  session: AuthSession;
  onOpenMobileSidebar: () => void;
  onSelectTeam: (teamId: string) => void;
  onGoToSuperAdmin: () => void;
  onLogout: () => void;
}

export const AppHeaderSection: React.FC<Props> = ({
  isAdminPreview,
  activeTeam,
  whatsappUrl,
  handleBackToAdmin,
  shouldShowSidebar,
  isSuperAdmin,
  activeView,
  mappedTeams,
  activeTeamId,
  themeColor,
  session,
  onOpenMobileSidebar,
  onSelectTeam,
  onGoToSuperAdmin,
  onLogout,
}) => (
  <div className="sticky top-0 z-30">
    {isAdminPreview && (
      <AdminPreviewBanner
        activeTeam={activeTeam}
        whatsappUrl={whatsappUrl}
        onBackToAdmin={handleBackToAdmin}
      />
    )}

    <AppHeader
      shouldShowSidebar={shouldShowSidebar}
      isSuperAdmin={isSuperAdmin}
      activeView={activeView}
      mappedTeams={mappedTeams}
      activeTeamId={activeTeamId}
      activeTeam={activeTeam}
      themeColor={themeColor}
      session={session}
      onOpenMobileSidebar={onOpenMobileSidebar}
      onSelectTeam={onSelectTeam}
      onGoToSuperAdmin={onGoToSuperAdmin}
      onLogout={onLogout}
    />
  </div>
);
