import { useState } from 'react';
import type { TeamSupervisionSummary } from '../../modules/admin/domain/admin.types';
import { type AuthSession, STORAGE_KEY_AUTH } from './appSession.types';
import { useToast } from '../../shared/components/Toast';

import { serviceBus } from '../../core/bus';
import { appendAuditLog } from '../../modules/audit/application/auditStorage';

export const useAppSession = (allTeams: TeamSupervisionSummary[]) => {
  const { toast } = useToast();
  const [session, setSession] = useState<AuthSession | null>(() => {
    try { const s = localStorage.getItem(STORAGE_KEY_AUTH); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [activeTeamId, setActiveTeamId] = useState<string>(() => session?.teamId || 'team-wayuu');
  const [isAdminPreview, setIsAdminPreview] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'plans' | 'superadmin'>(() =>
    session?.role === 'admin' ? 'superadmin' : 'plans'
  );

  const handleAdminLogin = () => {
    const newSession: AuthSession = { role: 'admin', userName: 'Director Nacional' };
    setSession(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch {}
    setActiveView('superadmin'); setIsAdminPreview(false);
    toast.success('Sesión iniciada como Director Nacional', 'Bienvenido');
  };

  const handleTeamLogin = (team: TeamSupervisionSummary) => {
    const newSession: AuthSession = { role: 'team', teamId: team.id, userName: team.leader };
    setSession(newSession);
    try { localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession)); } catch {}
    appendAuditLog(team.id, {
      teamId: team.id, userName: team.leader, actionType: 'login',
      title: 'Ingreso al portal', detail: `Inicio de sesión territorial de ${team.leader}`,
    }, team.leader);
    serviceBus.publish('audit:log', {
      teamId: team.id, userName: team.leader, actionType: 'login',
      title: 'Ingreso al portal', detail: `Inicio de sesión territorial de ${team.leader}`,
    });
    setActiveTeamId(team.id); setActiveView('plans'); setIsAdminPreview(false);
    toast.success(`Bienvenido equipo ${team.name}`, 'Sesión Iniciada');
  };

  const handleLogout = () => {
    setSession(null); setIsAdminPreview(false);
    try { localStorage.removeItem(STORAGE_KEY_AUTH); } catch {}
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
