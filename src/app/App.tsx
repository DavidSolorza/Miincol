import React, { useMemo } from 'react';
import { ToastProvider } from '../shared/components/Toast';
import { LoginView } from '../modules/auth/ui/LoginView';
import { useAdminDashboard } from '../modules/admin/application/useAdminDashboard';
import { useAppSession } from './auth/useAppSession';
import { AppWorkspace } from './ui/AppWorkspace';
import type { MissionaryTeam } from '../modules/auth/domain/auth.types';

const AppContent: React.FC = () => {
  const dashboardHook = useAdminDashboard();
  const { allTeams } = dashboardHook;
  const sessionHook = useAppSession(allTeams);

  const mappedTeams: MissionaryTeam[] = useMemo(() => {
    return allTeams.map((t) => ({
      id: t.id,
      name: t.name,
      ethnicity: t.ethnicity,
      region: t.region,
      leader: t.leader,
      members: t.members && t.members.length > 0 ? t.members : [t.leader],
      themeColor: t.themeColor,
      leaderPhone: t.leaderPhone,
    }));
  }, [allTeams]);

  const activeTeamSummary = useMemo(() => {
    return allTeams.find((t) => t.id === sessionHook.activeTeamId || t.slug === sessionHook.activeTeamId) || allTeams[0];
  }, [allTeams, sessionHook.activeTeamId]);

  const activeTeam: MissionaryTeam = useMemo(() => {
    return (
      mappedTeams.find((t) => t.id === sessionHook.activeTeamId) ||
      mappedTeams[0] || {
        id: 'team-wayuu',
        name: 'Misión Wayuu - Alta Guajira',
        ethnicity: 'Wayuu',
        region: 'La Guajira',
        leader: 'Pr. David Morales',
        members: ['David Morales'],
        themeColor: '#8B251E',
      }
    );
  }, [mappedTeams, sessionHook.activeTeamId]);

  if (!sessionHook.session) {
    return (
      <LoginView
        onAdminSuccess={sessionHook.handleAdminLogin}
        onTeamSuccess={sessionHook.handleTeamLogin}
        allTeams={allTeams}
      />
    );
  }

  return (
    <AppWorkspace
      session={sessionHook.session}
      activeTeam={activeTeam}
      activeTeamSummary={activeTeamSummary}
      mappedTeams={mappedTeams}
      activeTeamId={sessionHook.activeTeamId}
      setActiveTeamId={sessionHook.setActiveTeamId}
      isAdminPreview={sessionHook.isAdminPreview}
      setIsAdminPreview={sessionHook.setIsAdminPreview}
      activeView={sessionHook.activeView}
      setActiveView={sessionHook.setActiveView}
      handleLogout={sessionHook.handleLogout}
      handleBackToAdmin={sessionHook.handleBackToAdmin}
      handleInspectTeamFromAdmin={sessionHook.handleInspectTeamFromAdmin}
      dashboardHook={dashboardHook}
    />
  );
};

export const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
