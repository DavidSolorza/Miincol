import React from 'react';
import type { PlanSidebarProps } from './sidebar/planSidebar.types';
import { SidebarBrand } from './sidebar/SidebarBrand';
import { SidebarSegmentedControl } from './sidebar/SidebarSegmentedControl';
import { SidebarPhasesList } from './sidebar/SidebarPhasesList';
import { SidebarMetricsCard } from './sidebar/SidebarMetricsCard';
import { SidebarFooterActions } from './sidebar/SidebarFooterActions';
import { SidebarRemindersCard } from './sidebar/SidebarRemindersCard';
import { SidebarUserProfileCard } from './sidebar/SidebarUserProfileCard';

export const PlanSidebar: React.FC<PlanSidebarProps> = ({
  allPlans, activePhaseId, onSelectPhase, metrics, activeTeam,
  onOpenReportModal, onOpenNotesModal, activeView, onChangeView,
  isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile,
  userRole = 'admin', onLogout, whatsappUrl,
}) => {
  const isTeamRestricted = userRole === 'team';

  return (
    <>
      {isOpenMobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between select-none lg:my-2.5 lg:ml-2.5 lg:h-[calc(100vh-20px)] rounded-[28px] overflow-hidden border border-stone-200/90 shadow-[0_14px_40px_-8px_rgba(40,20,15,0.09)] ${
          isCollapsed ? 'lg:w-18' : 'lg:w-64 xl:w-72'
        } ${isOpenMobile ? 'translate-x-0 w-72 h-full rounded-r-[28px]' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'linear-gradient(185deg, #FAF7F2 0%, #FAF5EE 50%, #F5ECE0 100%)',
        }}
      >
        <SidebarBrand isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} onCloseMobile={onCloseMobile} />
        <SidebarSegmentedControl isCollapsed={isCollapsed} onOpenNotesModal={onOpenNotesModal} onChangeView={onChangeView} />

        <div className="flex-1 overflow-y-auto px-3 sm:px-3.5 py-2 space-y-3 sidebar-scroll-smooth">
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
            whatsappUrl={whatsappUrl}
          />

          {activeView === 'plans' && (
            <SidebarRemindersCard
              isCollapsed={isCollapsed}
              onOpenNotesModal={onOpenNotesModal}
            />
          )}
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
