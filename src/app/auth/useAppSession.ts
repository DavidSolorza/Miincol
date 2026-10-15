import { useState } from 'react';
import type { TeamSupervisionSummary } from '../../modules/admin/domain/admin.types';
import { type AuthSession, STORAGE_KEY_AUTH } from './appSession.types';
import { useToast } from '../../shared/components/Toast';

export const useAppSession = (allTeams: TeamSupervisionSummary[]) => {
  const { toast } = useToast();

  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignorar fallback
    }
    return null;
  });

  const [activeTeamId, setActiveTeamId] = useState<string>(() => {
    return session?.teamId || 'team-wayuu';
  });

  const [isAdminPreview, setIsAdminPreview] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<'plans' | 'superadmin'>(() => {
    return session?.role === 'admin' ? 'superadmin' : 'plans';
  });

  const handleAdminLogin = () => {
    const newSession: AuthSession = { role: 'admin', userName: 'Director Nacional' };
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession));
    } catch {
      // Ignorar fallback
    }
    setActiveView('superadmin');
    setIsAdminPreview(false);
    toast.success('Sesión iniciada como Director Nacional', 'Bienvenido');
  };

  const handleTeamLogin = (team: TeamSupervisionSummary) => {
    const newSession: AuthSession = { role: 'team', teamId: team.id, userName: team.leader };
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession));
    } catch {
      // Ignorar fallback
    }
    setActiveTeamId(team.id);
    setActiveView('plans');
    setIsAdminPreview(false);
    toast.success(`Bienvenido equipo ${team.name}`, 'Sesión Iniciada');
  };

  const handleLogout = () => {
    setSession(null);
    setIsAdminPreview(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // Ignorar fallback
    }
    toast.info('Has cerrado la sesión correctamente', 'Sesión Finalizada');
  };

  const handleInspectTeamFromAdmin = (teamId: string) => {
    setActiveTeamId(teamId);
    setIsAdminPreview(true);
    setActiveView('plans');
    const targetTeam = allTeams.find((t) => t.id === teamId || t.slug === teamId);
    toast.info(`Supervisando misión: ${targetTeam?.name || 'Equipo'}`, 'Modo Supervisión');
  };

  const handleBackToAdmin = () => {
    setIsAdminPreview(false);
    setActiveView('superadmin');
    toast.info('Regresando al Tablero de Supervisión Nacional', 'Supervisión');
  };

  return {
    session,
    activeTeamId,
    setActiveTeamId,
    isAdminPreview,
    setIsAdminPreview,
    activeView,
    setActiveView,
    handleAdminLogin,
    handleTeamLogin,
    handleLogout,
    handleInspectTeamFromAdmin,
    handleBackToAdmin,
  };
};
