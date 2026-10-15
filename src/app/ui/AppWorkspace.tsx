import React from 'react';
import type { AppWorkspaceProps } from './workspace.types';
import { AppSidebarSection } from './AppSidebarSection';
import { AppHeaderSection } from './AppHeaderSection';
import { AppMainContent } from './AppMainContent';
import { AppGlobalModals } from './AppGlobalModals';
import { useWorkspaceUiState } from './useWorkspaceUiState';
import { useAppWorkspaceBus } from './useAppWorkspaceBus';
import { usePlan } from '../../modules/plans/application/usePlan';

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  session,
  activeTeam,
  activeTeamSummary,
  mappedTeams,
  activeTeamId,
  setActiveTeamId,
  isAdminPreview,
  setIsAdminPreview,
  activeView,
  setActiveView,
  handleLogout,
  handleBackToAdmin,
  handleInspectTeamFromAdmin,
  dashboardHook,
}) => {
  const ui = useWorkspaceUiState(activeTeam);
  const planHook = usePlan(activeTeamSummary?.currentPhaseId || 'investigacion', activeTeam.id, activeTeamSummary);
  useAppWorkspaceBus({ setActiveTeamId, setActiveView, setIsAdminPreview, handleInspectTeamFromAdmin });
  const isSuperAdmin = session.role === 'admin';
  const shouldShowSidebar = !isSuperAdmin || activeView === 'plans';

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex font-['Plus_Jakarta_Sans'] text-stone-900 selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      <AppSidebarSection
        shouldShowSidebar={shouldShowSidebar}
        planHook={planHook}
        activeTeam={activeTeam}
        activeView={activeView}
        setActiveView={setActiveView}
        setIsAdminPreview={setIsAdminPreview}
        isSidebarCollapsed={ui.isSidebarCollapsed}
        setIsSidebarCollapsed={ui.setIsSidebarCollapsed}
        isMobileSidebarOpen={ui.isMobileSidebarOpen}
        setIsMobileSidebarOpen={ui.setIsMobileSidebarOpen}
        userRole={session.role}
        handleLogout={handleLogout}
        onOpenReportModal={() => ui.setIsReportModalOpen(true)}
        onPhaseChange={() => ui.setActiveObjectiveNumber(1)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeaderSection
          isAdminPreview={isAdminPreview}
          activeTeam={activeTeam}
          whatsappUrl={ui.whatsappUrl}
          handleBackToAdmin={handleBackToAdmin}
          shouldShowSidebar={shouldShowSidebar}
          isSuperAdmin={isSuperAdmin}
          activeView={activeView}
          mappedTeams={mappedTeams}
          activeTeamId={activeTeamId}
          themeColor={activeTeam.themeColor || '#8B251E'}
          session={session}
          onOpenMobileSidebar={() => ui.setIsMobileSidebarOpen(true)}
          onSelectTeam={(teamId) => { setActiveTeamId(teamId); ui.setActiveObjectiveNumber(1); }}
          onGoToSuperAdmin={() => { setIsAdminPreview(false); setActiveView('superadmin'); }}
          onLogout={handleLogout}
        />

        <AppMainContent
          activeView={activeView}
          isSuperAdmin={isSuperAdmin}
          activeTeam={activeTeam}
          themeColor={activeTeam.themeColor || '#8B251E'}
          whatsappUrl={ui.whatsappUrl}
          activeObjectiveNumber={ui.activeObjectiveNumber}
          setActiveObjectiveNumber={ui.setActiveObjectiveNumber}
          planHook={planHook}
          dashboardHook={dashboardHook}
          onInspectTeam={(id) => { handleInspectTeamFromAdmin(id); ui.setActiveObjectiveNumber(1); }}
          onOpenReportModal={() => ui.setIsReportModalOpen(true)}
          onOpenTeamModal={() => ui.setIsTeamModalOpen(true)}
          onToggleMobileMenu={() => ui.setIsMobileSidebarOpen(true)}
        />
      </div>

      <AppGlobalModals
        isReportModalOpen={ui.isReportModalOpen}
        onCloseReportModal={() => ui.setIsReportModalOpen(false)}
        plan={planHook.plan}
        isSuperAdmin={isSuperAdmin}
        isTeamModalOpen={ui.isTeamModalOpen}
        onCloseTeamModal={() => ui.setIsTeamModalOpen(false)}
        mappedTeams={mappedTeams} activeTeamId={activeTeam.id} onSelectTeam={setActiveTeamId}
      />
    </div>
  );
};
