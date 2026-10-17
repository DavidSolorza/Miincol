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
  <header className="no-print w-full bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] sticky top-0 z-30 select-none">
    {/* Top Brand Accent Bar */}
    <div className="h-[2.5px] w-full bg-gradient-to-r from-[#8B251E] via-[#E67324] to-[#8B251E]" />

    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 sm:h-[70px] flex items-center justify-between relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {shouldShowSidebar ? (
          <>
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="font-black text-[#8B251E] tracking-wider font-['Outfit']">MISINCOL</span>
              <span>•</span>
              {isSuperAdmin && activeView === 'plans' ? (
                <TeamSelectDropdown
                  teams={mappedTeams}
                  activeTeamId={activeTeamId}
                  onSelectTeam={onSelectTeam}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full ring-2 ring-stone-200" style={{ backgroundColor: themeColor }} />
                  <span className="text-stone-800 font-bold truncate max-w-[180px] sm:max-w-none font-['Outfit']">
                    {activeTeam.name}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Desktop / Tablet: Institutional Super Admin Badge */}
            <div className="hidden sm:flex items-center gap-2.5 py-1.5 px-3 rounded-2xl bg-stone-50/90 border border-stone-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B251E] to-[#E67324] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wide text-stone-900 font-['Outfit'] uppercase">
                    Supervisión Nacional
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium font-['Outfit']">
                  Dirección General • PDM
                </span>
              </div>
            </div>

            {/* Mobile Fallback: Compact Brand */}
            <div className="flex sm:hidden items-center gap-2">
              <MisincolLogo size="sm" showSubtitle={false} className="h-8 w-auto" />
            </div>
          </>
        )}
      </div>

      {/* Center Section: Centered Misincol Logo / Icon */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-auto">
        <div className="flex items-center justify-center px-4 py-1.5 rounded-2xl bg-stone-50/80 hover:bg-white border border-stone-200/70 shadow-2xs hover:shadow-xs hover:border-[#E67324]/40 transition-all duration-200 group cursor-default">
          <MisincolLogo
            size="sm"
            showSubtitle={false}
            className="h-10 sm:h-11 w-auto transition-transform group-hover:scale-105 duration-200 drop-shadow-xs"
          />
        </div>
      </div>

      {/* Right Section: Network Status, SuperAdmin Return & User Profile with Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <NetworkStatusBadge />
        {isSuperAdmin && activeView !== 'superadmin' && (
          <button
            onClick={onGoToSuperAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
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
    </div>
  </header>
);
