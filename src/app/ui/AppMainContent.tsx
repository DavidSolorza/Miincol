import React, { lazy, Suspense } from 'react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import { SuperAdminSkeleton } from '../../modules/admin/ui/SuperAdminSkeleton';
import { PhaseView } from '../../modules/plans/ui/PhaseView';
import { TeamIdentityBar } from './TeamIdentityBar';
import type { usePlan } from '../../modules/plans/application/usePlan';
import type { useAdminDashboard } from '../../modules/admin/application/useAdminDashboard';

const SuperAdminView = lazy(() =>
  import('../../modules/admin/ui/SuperAdminView').then((m) => ({ default: m.SuperAdminView }))
);

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
  <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 ${activeView === 'superadmin' ? 'flex flex-col min-h-0 max-w-[1680px] py-2 sm:py-2.5' : 'max-w-7xl py-3.5 sm:py-4'}`}>
    {activeView === 'superadmin' && isSuperAdmin ? (
      <Suspense fallback={<SuperAdminSkeleton />}>
        <SuperAdminView
          onInspectTeam={onInspectTeam}
          onOpenReportModal={onOpenReportModal}
          dashboardHook={dashboardHook}
        />
      </Suspense>
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
