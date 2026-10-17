import React from 'react';
import type { PlanSidebarProps } from './sidebar/planSidebar.types';
import { SidebarBrand } from './sidebar/SidebarBrand';
import { SidebarSegmentedControl } from './sidebar/SidebarSegmentedControl';
import { SidebarViewsNav } from './sidebar/SidebarViewsNav';
import { SidebarPhasesList } from './sidebar/SidebarPhasesList';
import { SidebarMetricsCard } from './sidebar/SidebarMetricsCard';
import { SidebarFooterActions } from './sidebar/SidebarFooterActions';
import { SidebarUserProfileCard } from './sidebar/SidebarUserProfileCard';

export const PlanSidebar: React.FC<PlanSidebarProps> = ({
  allPlans, activePhaseId, onSelectPhase, metrics, activeTeam,
  onOpenReportModal, onOpenNotesModal, activeView, onChangeView,
  isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile,
  userRole = 'admin', onLogout,
}) => {
  const isTeamRestricted = userRole === 'team';

  return (
    <>
      {isOpenMobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 transition-all duration-300 flex flex-col justify-between select-none shadow-2xl lg:my-2.5 lg:ml-2.5 lg:h-[calc(100vh-20px)] rounded-[26px] overflow-hidden ${
          isCollapsed ? 'lg:w-18' : 'lg:w-56 xl:w-60'
        } ${isOpenMobile ? 'translate-x-0 w-68 h-full rounded-r-[26px]' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'linear-gradient(185deg, #B83A2D 0%, #9E2B21 35%, #8B251E 70%, #721C16 100%)',
          boxShadow: '0 20px 35px -5px rgba(139, 37, 30, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset',
        }}
      >
        <SidebarBrand isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} onCloseMobile={onCloseMobile} />
        <SidebarSegmentedControl isCollapsed={isCollapsed} onOpenNotesModal={onOpenNotesModal} onChangeView={onChangeView} activeView={activeView} />

        <div className="flex-1 overflow-y-auto px-2 sm:px-2.5 py-1 space-y-2 no-scrollbar">
          <SidebarViewsNav
            isCollapsed={isCollapsed}
            isTeamRestricted={isTeamRestricted}
            activeView={activeView}
            onChangeView={onChangeView}
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

          <SidebarFooterActions
            activeView={activeView}
            isTeamRestricted={isTeamRestricted}
            isCollapsed={isCollapsed}
            isOpenMobile={isOpenMobile}
            onCloseMobile={onCloseMobile}
            onOpenReportModal={onOpenReportModal}
            onOpenNotesModal={onOpenNotesModal}
          />
        </div>

        <SidebarUserProfileCard
          activeTeam={activeTeam}
          isCollapsed={isCollapsed}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
};
