import React, { lazy, Suspense } from 'react';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import { SuperAdminSkeleton } from '../../features/admin/infrastructure/SuperAdminSkeleton';
import { PhaseView } from '../../features/plans/infrastructure/PhaseView';
import type { usePlan } from '../../features/plans/application/usePlan';
import type { useAdminDashboard } from '../../features/admin/application/useAdminDashboard';

const SuperAdminView = lazy(() =>
  import('../../features/admin/infrastructure/SuperAdminView').then((m) => ({ default: m.SuperAdminView }))
);

interface Props {
  activeView: 'plans' | 'superadmin';
  isSuperAdmin: boolean;
  activeTeam: MissionaryTeam;
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
  <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 ${activeView === 'superadmin' ? 'flex flex-col min-h-0 max-w-[1680px] py-2 sm:py-2.5' : 'max-w-[1600px] py-3.5 sm:py-4'}`}>
    {activeView === 'superadmin' && isSuperAdmin ? (
      <Suspense fallback={<SuperAdminSkeleton />}>
        <SuperAdminView
          onInspectTeam={onInspectTeam}
          onOpenReportModal={onOpenReportModal}
          dashboardHook={dashboardHook}
        />
      </Suspense>
    ) : (
      <div className="space-y-3.5 sm:space-y-4">
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
          activeTeam={activeTeam}
          whatsappUrl={whatsappUrl}
          onOpenTeamModal={onOpenTeamModal}
        />
      </div>
    )}
  </main>
);
