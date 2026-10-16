import React from 'react';
import type { PlanSidebarProps } from './sidebar/planSidebar.types';
import { SidebarBrand } from './sidebar/SidebarBrand';
import { SidebarViewsNav } from './sidebar/SidebarViewsNav';
import { SidebarPhasesList } from './sidebar/SidebarPhasesList';
import { SidebarMetricsCard } from './sidebar/SidebarMetricsCard';
import { SidebarFooterActions } from './sidebar/SidebarFooterActions';

export const PlanSidebar: React.FC<PlanSidebarProps> = ({
  allPlans,
  activePhaseId,
  onSelectPhase,
  metrics,
  activeTeam,
  onOpenReportModal,
  onOpenNotesModal,
  activeView,
  onChangeView,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  userRole = 'admin',
  onLogout,
}) => {
  const isTeamRestricted = userRole === 'team';

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-stone-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between select-none ${
          isCollapsed ? 'lg:w-16' : 'lg:w-52 xl:w-56'
        } ${isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}
      >
        <SidebarBrand
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
          onCloseMobile={onCloseMobile}
        />

        <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-2.5 no-scrollbar">
          <SidebarViewsNav
            isCollapsed={isCollapsed}
            isTeamRestricted={isTeamRestricted}
            activeView={activeView}
            onChangeView={onChangeView}
            activeTeam={activeTeam}
            isOpenMobile={isOpenMobile}
            onCloseMobile={onCloseMobile}
          />

          {activeView === 'plans' && (
            <SidebarPhasesList
              allPlans={allPlans}
              activePhaseId={activePhaseId}
              onSelectPhase={onSelectPhase}
              activeView={activeView}
              onChangeView={onChangeView}
              isCollapsed={isCollapsed}
              activeTeam={activeTeam}
            />
          )}

          {!isCollapsed && activeView === 'plans' && (
            <SidebarMetricsCard metrics={metrics} />
          )}
        </div>

        <SidebarFooterActions
          activeView={activeView}
          isTeamRestricted={isTeamRestricted}
          isCollapsed={isCollapsed}
          isOpenMobile={isOpenMobile}
          onCloseMobile={onCloseMobile}
          onOpenReportModal={onOpenReportModal}
          onOpenNotesModal={onOpenNotesModal}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
};
