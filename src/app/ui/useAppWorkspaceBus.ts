import { useEffect } from 'react';
import { serviceBus } from '../../core/bus';

interface UseAppWorkspaceBusProps {
  setActiveTeamId: (teamId: string) => void;
  setActiveView: (view: 'plans' | 'superadmin') => void;
  setIsAdminPreview: (val: boolean) => void;
  handleInspectTeamFromAdmin: (teamId: string) => void;
}

export const useAppWorkspaceBus = ({
  setActiveTeamId,
  setActiveView,
  setIsAdminPreview,
  handleInspectTeamFromAdmin,
}: UseAppWorkspaceBusProps) => {
  useEffect(() => {
    const subTeam = serviceBus.subscribe('team:select', ({ teamId }) => {
      setActiveTeamId(teamId);
    });

    const subInspect = serviceBus.subscribe('team:inspect', ({ teamId }) => {
      handleInspectTeamFromAdmin(teamId);
    });

    const subView = serviceBus.subscribe('ui:view_change', ({ view }) => {
      if (view === 'dashboard' || view === 'supervision') {
        setIsAdminPreview(false);
        setActiveView('superadmin');
      } else {
        setActiveView('plans');
      }
    });

    return () => {
      subTeam.unsubscribe();
      subInspect.unsubscribe();
      subView.unsubscribe();
    };
  }, [setActiveTeamId, setActiveView, setIsAdminPreview, handleInspectTeamFromAdmin]);
};
