import React from 'react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import type { usePlan } from '../../modules/plans/application/usePlan';
import { PlanSidebar } from '../../modules/plans/ui/PlanSidebar';

interface Props {
  shouldShowSidebar: boolean;
  planHook: ReturnType<typeof usePlan>;
  activeTeam: MissionaryTeam;
  activeView: 'plans' | 'superadmin';
  setActiveView: (v: 'plans' | 'superadmin') => void;
  setIsAdminPreview: (v: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (v: boolean) => void;
  userRole: 'admin' | 'team';
  handleLogout: () => void;
  onOpenReportModal: () => void;
  onPhaseChange: () => void;
}

export const AppSidebarSection: React.FC<Props> = ({
  shouldShowSidebar,
  planHook,
  activeTeam,
  activeView,
  setActiveView,
  setIsAdminPreview,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  userRole,
  handleLogout,
  onOpenReportModal,
  onPhaseChange,
}) => {
  if (!shouldShowSidebar) return null;

  return (
    <PlanSidebar
      allPlans={planHook.allPlans}
      activePhaseId={planHook.activePhaseId}
      onSelectPhase={(phaseId) => {
        planHook.switchPhase(phaseId);
        onPhaseChange();
      }}
      metrics={planHook.metrics}
      activeTeam={activeTeam}
      onOpenReportModal={onOpenReportModal}
      activeView={activeView}
      onChangeView={(view) => {
        if (view === 'superadmin') setIsAdminPreview(false);
        setActiveView(view);
      }}
      isCollapsed={isSidebarCollapsed}
      onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      isOpenMobile={isMobileSidebarOpen}
      onCloseMobile={() => setIsMobileSidebarOpen(false)}
      userRole={userRole}
      onLogout={handleLogout}
    />
  );
};
