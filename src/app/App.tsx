import React, { useState, useMemo } from 'react';
import { PlanSidebar } from '../modules/plans/ui/PlanSidebar';
import { MisincolLogo } from '../shared/components/MisincolLogo';
import { PhaseView } from '../modules/plans/ui/PhaseView';
import { SuperAdminView } from '../modules/admin/ui/SuperAdminView';
import { ReportModal } from '../modules/reports/ui/ReportModal';
import { TeamSelector } from '../modules/auth/ui/TeamSelector';
import { TeamSelectDropdown } from '../modules/auth/ui/TeamSelectDropdown';
import { LoginView } from '../modules/auth/ui/LoginView';
import { useAdminDashboard } from '../modules/admin/application/useAdminDashboard';
import { usePlan } from '../modules/plans/application/usePlan';
import type { MissionaryTeam } from '../modules/auth/domain/auth.types';
import type { TeamSupervisionSummary } from '../modules/admin/domain/admin.types';
import {
  Menu,
  ShieldCheck,
  User,
  ArrowLeft,
  MessageCircle,
  LogOut,
} from 'lucide-react';

interface AuthSession {
  role: 'admin' | 'team';
  teamId?: string;
  userName: string;
}

const STORAGE_KEY_AUTH = 'misincol_auth_session';

export const App: React.FC = () => {
  // Hook central de administración con persistencia reactiva en localStorage
  const dashboardHook = useAdminDashboard();
  const { allTeams } = dashboardHook;

  // Estado de Sesión (null = Pantalla de Login Principal)
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignorar fallback
    }
    return null;
  });

  // Estado del equipo activo y modo vista previa
  const [activeTeamId, setActiveTeamId] = useState<string>(() => {
    return session?.teamId || 'team-wayuu';
  });
  const [isAdminPreview, setIsAdminPreview] = useState<boolean>(false);

  // Mapear el catálogo dinámico de equipos
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

  // Equipo activo actual
  const activeTeamSummary = useMemo(() => {
    return allTeams.find((t) => t.id === activeTeamId || t.slug === activeTeamId) || allTeams[0];
  }, [allTeams, activeTeamId]);

  const activeTeam: MissionaryTeam = useMemo(() => {
    return (
      mappedTeams.find((t) => t.id === activeTeamId) ||
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
  }, [mappedTeams, activeTeamId]);

  // Hook del Plan Ministerial aislado por teamId
  const {
    plan,
    allPlans,
    activePhaseId,
    metrics,
    switchPhase,
    updateActivity,
    addActivity,
    deleteActivity,
    updateObjective,
    addObjective,
    deleteObjective,
    resetToDefaults,
  } = usePlan(activeTeamSummary?.currentPhaseId || 'investigacion', activeTeam.id, activeTeamSummary);

  const [activeObjectiveNumber, setActiveObjectiveNumber] = useState<number>(1);
  const [activeView, setActiveView] = useState<'plans' | 'superadmin'>(() => {
    return session?.role === 'admin' ? 'superadmin' : 'plans';
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // 1. Manejo de Inicio de Sesión como Super Admin
  const handleAdminLogin = () => {
    const newSession: AuthSession = {
      role: 'admin',
      userName: 'Director Nacional',
    };
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession));
    } catch {
      // Ignorar fallback
    }
    setActiveView('superadmin');
    setIsAdminPreview(false);
  };

  // 2. Manejo de Inicio de Sesión como Equipo Territorial
  const handleTeamLogin = (team: TeamSupervisionSummary) => {
    const newSession: AuthSession = {
      role: 'team',
      teamId: team.id,
      userName: team.leader,
    };
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newSession));
    } catch {
      // Ignorar fallback
    }
    setActiveTeamId(team.id);
    setActiveView('plans');
    setIsAdminPreview(false);
    setActiveObjectiveNumber(1);
  };

  // 3. Manejo de Cierre de Sesión
  const handleLogout = () => {
    setSession(null);
    setIsAdminPreview(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // Ignorar fallback
    }
  };

  // Al cambiar de fase, reiniciar al objetivo #1
  const handleSelectPhase = (phaseId: typeof activePhaseId) => {
    switchPhase(phaseId);
    setActiveObjectiveNumber(1);
  };

  // Función para que el Super Admin entre a supervisar un equipo específico (Modo Vista Previa)
  const handleInspectTeamFromAdmin = (teamId: string) => {
    setActiveTeamId(teamId);
    setIsAdminPreview(true);
    setActiveView('plans');
    setActiveObjectiveNumber(1);
  };

  const handleBackToAdmin = () => {
    setIsAdminPreview(false);
    setActiveView('superadmin');
  };

  // Si no hay sesión iniciada, mostrar la pantalla de Login Principal
  if (!session) {
    return (
      <LoginView
        onAdminSuccess={handleAdminLogin}
        onTeamSuccess={handleTeamLogin}
        allTeams={allTeams}
      />
    );
  }

  const isSuperAdmin = session.role === 'admin';
  const shouldShowSidebar = !isSuperAdmin || activeView === 'plans';
  const themeColor = activeTeam.themeColor || '#8B251E';
  const cleanPhone = (activeTeam.leaderPhone || '').replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hola ${activeTeam.leader}, te contacto de la Dirección Nacional de Misincol para seguimiento al plan territorial.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex font-['Plus_Jakarta_Sans'] text-stone-900 selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      {/* 1. Panel Lateral Optimizado (Sidebar) - Solo se muestra cuando se está dentro de un equipo */}
      {shouldShowSidebar && (
        <PlanSidebar
          allPlans={allPlans}
          activePhaseId={activePhaseId}
          onSelectPhase={handleSelectPhase}
          activeObjectiveNumber={activeObjectiveNumber}
          onSelectObjective={setActiveObjectiveNumber}
          metrics={metrics}
          activeTeam={activeTeam}
          onOpenTeamModal={() => setIsTeamModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          activeView={activeView}
          onChangeView={(view) => {
            if (view === 'superadmin') {
              setIsAdminPreview(false);
            }
            setActiveView(view);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          userRole={session.role}
          onLogout={handleLogout}
        />
      )}

      {/* 2. Área Principal de Trabajo */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="sticky top-0 z-30">
          {/* Banner Superior: Modo Vista Previa Administrador (Inspirado en PortalClientes) */}
          {isAdminPreview && (
            <div className="no-print bg-amber-50/95 border-b border-amber-200 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  <strong>Modo Vista Previa</strong>
                </span>
                <span className="text-amber-700 hidden md:inline">
                  • Supervisando: <strong>{activeTeam.name}</strong> ({activeTeam.ethnicity})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition text-[11px]"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-700" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <button
                  onClick={handleBackToAdmin}
                  className="px-2.5 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition flex items-center gap-1 cursor-pointer text-xs"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Volver a Supervisión</span>
                </button>
              </div>
            </div>
          )}

          {/* Barra Superior Minimalista de Usuario y Acceso */}
          <header className="no-print h-12 bg-white/90 backdrop-blur-xs border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              {shouldShowSidebar ? (
                <>
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                  >
                    <Menu className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-black text-[#8B251E] tracking-wider">MISINCOL</span>
                    <span>•</span>
                    {/* Selector de Equipo Rápido Estilizado */}
                    {isSuperAdmin && activeView === 'plans' ? (
                      <TeamSelectDropdown
                        teams={mappedTeams}
                        activeTeamId={activeTeamId}
                        onSelectTeam={(teamId) => {
                          setActiveTeamId(teamId);
                          setActiveObjectiveNumber(1);
                        }}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        />
                        <span className="text-stone-700 font-semibold truncate max-w-[200px] sm:max-w-none">
                          {activeTeam.name}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <MisincolLogo size="sm" showSubtitle={false} className="shrink-0" />
                  <span className="text-stone-300 font-light">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-stone-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#E67324]" />
                    <span>Supervisión Nacional</span>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil de Usuario Sesión y Toggle Rápido a Super Admin */}
            <div className="flex items-center gap-2.5">
              {isSuperAdmin && activeView !== 'superadmin' && (
                <button
                  onClick={() => {
                    setIsAdminPreview(false);
                    setActiveView('superadmin');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                  title="Volver al panel general de supervisión"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E67324]" />
                  <span className="hidden sm:inline">Super Admin</span>
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] shadow-2xs shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  <User className="w-3 h-3" />
                </div>
              <div className="hidden md:flex flex-col text-left text-xs">
                <span className="font-bold text-stone-800 leading-none">
                  {session.userName}
                </span>
                <span className="text-[9px] text-stone-400 mt-0.5">
                  {isSuperAdmin ? 'Super Administrador' : `Misión ${activeTeam.ethnicity}`}
                </span>
              </div>

              {/* Botón Salir / Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="p-1 ml-0.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
        </div>

        {/* Contenido Dinámico Principal */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
          {activeView === 'superadmin' && isSuperAdmin ? (
            /* Vista 1: Super Admin / Supervisión Nacional de Todos los Equipos */
            <SuperAdminView
              onInspectTeam={handleInspectTeamFromAdmin}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              dashboardHook={dashboardHook}
            />
          ) : (
            /* Vista 2: Plan de Desarrollo Ministerial del Equipo Activo */
            <div className="space-y-3">
              {/* Barra de Identidad del Equipo Activo Compacta */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    {activeTeam.ethnicity}
                  </span>
                  <span className="font-black text-stone-900 text-base font-['Outfit']">
                    {activeTeam.name}
                  </span>
                  <span className="text-stone-400 hidden sm:inline">• {activeTeam.region}</span>
                </div>

                <div className="flex items-center gap-2">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>Contactar Líder</span>
                    </a>
                  )}
                  {isSuperAdmin && (
                    <button
                      onClick={() => setIsTeamModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                    >
                      Editar Equipo
                    </button>
                  )}
                </div>
              </div>

              <PhaseView
                plan={plan}
                activeObjectiveNumber={activeObjectiveNumber}
                onSelectObjective={setActiveObjectiveNumber}
                updateActivity={updateActivity}
                deleteActivity={deleteActivity}
                addActivity={addActivity}
                updateObjective={updateObjective}
                addObjective={addObjective}
                deleteObjective={deleteObjective}
                resetToDefaults={resetToDefaults}
                metrics={metrics}
                onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modales Globales */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        plan={plan}
      />

      {isSuperAdmin && (
        <TeamSelector
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          teams={mappedTeams}
          activeTeamId={activeTeam.id}
          onSelectTeam={(selectedId) => {
            setActiveTeamId(selectedId);
          }}
        />
      )}
    </div>
  );
};

export default App;
