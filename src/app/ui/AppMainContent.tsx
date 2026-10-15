import React from 'react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import { SuperAdminView } from '../../modules/admin/ui/SuperAdminView';
import { PhaseView } from '../../modules/plans/ui/PhaseView';
import { TeamIdentityBar } from './TeamIdentityBar';
import type { usePlan } from '../../modules/plans/application/usePlan';
import type { useAdminDashboard } from '../../modules/admin/application/useAdminDashboard';

interface Props {
  activeView: 'plans' | 'superadmin';
  isSuperAdmin: boolean;
  activeTeam: MissionaryTeam;
  themeColor: string;
  whatsappUrl: string | null;
  activeObjectiveNumber: number;
  setActiveObjectiveNumber: (n: number) => void;
  planHook: ReturnType<typeof usePlan>;
  dashboardHook: ReturnType<typeof useAdminDashboard>;
  onInspectTeam: (id: string) => void;
  onOpenReportModal: () => void;
  onOpenTeamModal: () => void;
  onToggleMobileMenu: () => void;
}

export const AppMainContent: React.FC<Props> = ({
  activeView,
  isSuperAdmin,
  activeTeam,
  themeColor,
  whatsappUrl,
  activeObjectiveNumber,
  setActiveObjectiveNumber,
  planHook,
  dashboardHook,
  onInspectTeam,
  onOpenReportModal,
  onOpenTeamModal,
  onToggleMobileMenu,
}) => (
  <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
    {activeView === 'superadmin' && isSuperAdmin ? (
      <SuperAdminView
        onInspectTeam={onInspectTeam}
        onOpenReportModal={onOpenReportModal}
        dashboardHook={dashboardHook}
      />
    ) : (
      <div className="space-y-3">
        <TeamIdentityBar
          activeTeam={activeTeam}
          themeColor={themeColor}
          whatsappUrl={whatsappUrl}
          isSuperAdmin={isSuperAdmin}
          onOpenTeamModal={onOpenTeamModal}
        />

        <PhaseView
          plan={planHook.plan}
          activeObjectiveNumber={activeObjectiveNumber}
          onSelectObjective={setActiveObjectiveNumber}
          updateActivity={planHook.updateActivity}
          deleteActivity={planHook.deleteActivity}
          addActivity={planHook.addActivity}
          updateObjective={planHook.updateObjective}
          addObjective={planHook.addObjective}
          deleteObjective={planHook.deleteObjective}
          resetToDefaults={planHook.resetToDefaults}
          metrics={planHook.metrics}
          onToggleMobileMenu={onToggleMobileMenu}
        />
      </div>
    )}
  </main>
);
