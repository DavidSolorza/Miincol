import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { MisincolLogo } from '../../shared/components/MisincolLogo';
import { TeamSelectDropdown } from '../../modules/auth/ui/TeamSelectDropdown';
import { AppHeaderUserProfile } from './AppHeaderUserProfile';
import { NetworkStatusBadge } from '../../shared/components/NetworkStatusBadge';
import type { AppHeaderProps } from './appHeader.types';

export const AppHeader: React.FC<AppHeaderProps> = ({
  shouldShowSidebar,
  isSuperAdmin,
  activeView,
  mappedTeams,
  activeTeamId,
  activeTeam,
  themeColor,
  session,
  onOpenMobileSidebar,
  onSelectTeam,
  onGoToSuperAdmin,
  onLogout,
}) => (
  <header className="no-print h-12 bg-white/90 backdrop-blur-xs border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
    <div className="flex items-center gap-3">
      {shouldShowSidebar ? (
        <>
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-black text-[#8B251E] tracking-wider">MISINCOL</span>
            <span>•</span>
            {isSuperAdmin && activeView === 'plans' ? (
              <TeamSelectDropdown
                teams={mappedTeams}
                activeTeamId={activeTeamId}
                onSelectTeam={onSelectTeam}
              />
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                <span className="text-stone-700 font-semibold truncate max-w-[200px] sm:max-w-none">
                  {activeTeam.name}
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2.5">
          <MisincolLogo size="sm" showSubtitle={false} className="shrink-0" />
          <span className="text-stone-300 font-light">•</span>
          <div className="flex items-center gap-1.5 text-xs text-stone-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#E67324]" />
            <span>Supervisión Nacional</span>
          </div>
        </div>
      )}
    </div>

    <div className="flex items-center gap-2.5">
      <NetworkStatusBadge />
      {isSuperAdmin && activeView !== 'superadmin' && (
        <button
          onClick={onGoToSuperAdmin}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
          title="Volver al panel general de supervisión"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E67324]" />
          <span className="hidden sm:inline">Super Admin</span>
        </button>
      )}

      <AppHeaderUserProfile
        themeColor={themeColor}
        session={session}
        isSuperAdmin={isSuperAdmin}
        activeTeam={activeTeam}
        onLogout={onLogout}
      />
    </div>
  </header>
);
