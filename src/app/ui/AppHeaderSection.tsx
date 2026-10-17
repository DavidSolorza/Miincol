import React from 'react';
import { Menu } from 'lucide-react';
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

    {shouldShowSidebar && (
      <button
        onClick={onOpenMobileSidebar}
        className="lg:hidden fixed top-3.5 left-3.5 z-40 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-stone-200/80 text-stone-700 shadow-sm hover:bg-white transition cursor-pointer"
        aria-label="Abrir menú"
      >
        <Menu className="w-4 h-4 text-[#8B251E]" />
      </button>
    )}

    {!shouldShowSidebar && (
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
    )}
  </div>
);
