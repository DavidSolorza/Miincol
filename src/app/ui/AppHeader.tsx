import React from 'react';
import { Menu, ShieldCheck, Plus, FileDown } from 'lucide-react';
import { MisincolLogo } from '../../shared/components/MisincolLogo';
import { TeamSelectDropdown } from '../../features/auth/infrastructure/TeamSelectDropdown';
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
  session,
  onOpenMobileSidebar,
  onSelectTeam,
  onGoToSuperAdmin,
  onLogout,
  onOpenReportModal,
  onOpenCreateTeam,
}) => (
  <header className="no-print w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] sticky top-0 z-30 select-none">
    {/* Top Brand Accent Bar */}
    <div className="h-[2.5px] w-full bg-gradient-to-r from-[#8B251E] via-[#E67324] to-[#8B251E]" />

    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 sm:h-20 flex items-center justify-between relative">
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
                  <span className="w-2.5 h-2.5 rounded-full ring-2 ring-stone-200 bg-[#8B251E]" />
                  <span className="text-stone-800 font-bold truncate max-w-[180px] sm:max-w-none font-['Outfit']">
                    {activeTeam.name}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2.5 py-1">
            <MisincolLogo size="sm" showSubtitle={false} className="h-9 sm:h-10 w-auto" />
          </div>
        )}
      </div>

      {/* Middle Section: Executive Action Buttons when in SuperAdmin view */}
      {activeView === 'superadmin' && isSuperAdmin && (
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer font-['Outfit']"
              title="Descargar informe consolidado nacional"
            >
              <FileDown className="w-3.5 h-3.5 text-[#E67324]" />
              <span className="hidden sm:inline">Informe Consolidado</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onOpenCreateTeam) onOpenCreateTeam();
              else window.dispatchEvent(new CustomEvent('misincol:open-create-team'));
            }}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#8B251E] to-[#A82E26] hover:from-[#781F19] hover:to-[#8B251E] text-white text-xs font-bold transition shadow-xs hover:shadow-sm active:scale-95 cursor-pointer font-['Outfit']"
            title="Registrar nuevo equipo misionero"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Misión</span>
          </button>
        </div>
      )}

      {/* Right Section: Network Status, SuperAdmin Return & User Profile with Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <NetworkStatusBadge />
        {isSuperAdmin && activeView !== 'superadmin' && (
          <button
            onClick={onGoToSuperAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-2xs cursor-pointer font-['Outfit']"
            title="Volver al panel general de supervisión"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E67324]" />
            <span className="hidden sm:inline">Super Admin</span>
          </button>
        )}

        <AppHeaderUserProfile
          session={session}
          isSuperAdmin={isSuperAdmin}
          activeTeam={activeTeam}
          onLogout={onLogout}
        />
      </div>
    </div>
  </header>
);
