import React, { useState, useMemo } from 'react';
import { PlanSidebar } from '../modules/plans/ui/PlanSidebar';
import { PhaseView } from '../modules/plans/ui/PhaseView';
import { SuperAdminView } from '../modules/admin/ui/SuperAdminView';
import { ReportModal } from '../modules/reports/ui/ReportModal';
import { TeamSelector } from '../modules/auth/ui/TeamSelector';
import { useAdminDashboard } from '../modules/admin/application/useAdminDashboard';
import { usePlan } from '../modules/plans/application/usePlan';
import { formatCurrencyCOP } from '../shared/utils/formatters';
import type { MissionaryTeam } from '../modules/auth/domain/auth.types';
import {
  Menu,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';

export const App: React.FC = () => {
  // Hook central de administración con persistencia reactiva en localStorage
  const dashboardHook = useAdminDashboard();
  const { allTeams } = dashboardHook;

  // Estado del equipo activo
  const [activeTeamId, setActiveTeamId] = useState<string>('team-wayuu');
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
    resetToDefaults,
  } = usePlan(activeTeamSummary?.currentPhaseId || 'investigacion', activeTeam.id, activeTeamSummary);

  const [activeObjectiveNumber, setActiveObjectiveNumber] = useState<number>(1);
  const [activeView, setActiveView] = useState<'plans' | 'all-phases' | 'superadmin'>('plans');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Al cambiar de fase, reiniciar al objetivo #1
  const handleSelectPhase = (phaseId: typeof activePhaseId) => {
    switchPhase(phaseId);
    setActiveObjectiveNumber(1);
  };

  // Función para que el Super Admin entre a supervisar un equipo específico (Modo Vista Previa como en PortalClientes)
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

  // Totales de todas las 5 fases combinadas para la vista resumen
  const grandTotalBudget = Object.values(allPlans).reduce((acc, p) => {
    return (
      acc +
      p.objectives.reduce((objAcc, o) => {
        return objAcc + o.activities.reduce((actAcc, a) => actAcc + (a.totalBudget || 0), 0);
      }, 0)
    );
  }, 0);

  const grandTotalActivities = Object.values(allPlans).reduce((acc, p) => {
    return acc + p.objectives.reduce((objAcc, o) => objAcc + o.activities.length, 0);
  }, 0);

  const grandTotalCompleted = Object.values(allPlans).reduce((acc, p) => {
    return (
      acc +
      p.objectives.reduce(
        (objAcc, o) => objAcc + o.activities.filter((a) => a.state === 'Completado').length,
        0
      )
    );
  }, 0);

  const themeColor = activeTeam.themeColor || '#8B251E';
  const cleanPhone = (activeTeam.leaderPhone || '').replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hola ${activeTeam.leader}, te contacto de la Dirección Nacional de Misincol para seguimiento al plan territorial.`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex font-['Plus_Jakarta_Sans'] text-stone-900 selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      {/* 1. Panel Lateral Optimizado (Sidebar) */}
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
      />

      {/* 2. Área Principal de Trabajo */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Banner Superior: Modo Vista Previa Administrador (Inspirado en PortalClientes) */}
        {isAdminPreview && (
          <div className="no-print bg-amber-50 border-b border-amber-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 sticky top-0 z-40 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Modo Vista Previa Administrador</strong>
              </span>
              <span className="text-amber-700 hidden md:inline">
                • Supervisando espacio y plan de: <strong>{activeTeam.name}</strong> ({activeTeam.ethnicity})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition text-[11px]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp Líder</span>
                </a>
              )}
              <button
                onClick={handleBackToAdmin}
                className="px-3.5 py-1 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al Tablero Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Barra Superior Minimalista de Usuario y Acceso */}
        <header className="no-print h-14 bg-white/70 backdrop-blur-xs border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
              <span className="font-bold text-[#8B251E]">MISINCOL</span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
                <span className="text-stone-700 font-medium">
                  {activeView === 'superadmin' ? 'Tablero de Supervisión Nacional' : activeTeam.name}
                </span>
              </div>
            </div>
          </div>

          {/* Perfil de Usuario Sesión y Toggle Rápido a Super Admin */}
          <div className="flex items-center gap-3">
            {activeView !== 'superadmin' ? (
              <button
                onClick={() => {
                  setIsAdminPreview(false);
                  setActiveView('superadmin');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E67324]" />
                <span className="hidden sm:inline">Modo Super Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('plans')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold transition shadow-xs cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                <span>Volver a Plan PDM</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div
                className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-2xs"
                style={{ backgroundColor: themeColor }}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden md:flex flex-col text-left text-xs">
                <span className="font-bold text-stone-800 leading-none">
                  {activeView === 'superadmin' ? 'Director Nacional' : activeTeam.leader}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  {activeView === 'superadmin' ? 'Super Administrador' : 'Líder Territorial'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'superadmin' ? (
            /* Vista 1: Super Admin / Supervisión Nacional de Todos los Equipos */
            <SuperAdminView
              onInspectTeam={handleInspectTeamFromAdmin}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              dashboardHook={dashboardHook}
            />
          ) : activeView === 'plans' ? (
            /* Vista 2: Plan de Desarrollo Ministerial del Equipo Activo */
            <div className="space-y-4">
              {/* Identidad del Equipo Activo con Color Temático */}
              <div
                className="p-4 rounded-2xl border bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ borderColor: `${themeColor}40` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    {activeTeam.ethnicity ? activeTeam.ethnicity.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded-md text-white shadow-2xs"
                        style={{ backgroundColor: themeColor }}
                      >
                        {activeTeam.ethnicity}
                      </span>
                      <span className="text-xs text-stone-500">{activeTeam.region}</span>
                    </div>
                    <h2 className="text-lg font-black text-stone-900 mt-0.5 font-['Outfit']">
                      {activeTeam.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contactar Líder</span>
                    </a>
                  )}
                  <button
                    onClick={() => setIsTeamModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cambiar Equipo
                  </button>
                </div>
              </div>

              <PhaseView
                plan={plan}
                activeObjectiveNumber={activeObjectiveNumber}
                onSelectObjective={setActiveObjectiveNumber}
                updateActivity={updateActivity}
                deleteActivity={deleteActivity}
                addActivity={addActivity}
                resetToDefaults={resetToDefaults}
                metrics={metrics}
                onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
              />
            </div>
          ) : (
            /* Vista 3: Consolidado Quinquenal de las 5 Fases */
            <div className="space-y-6">
              <div
                className="rounded-2xl p-6 sm:p-8 text-white shadow-lg transition-colors"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, #8B251E, #E67324)`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200 bg-white/10 px-3 py-1 rounded-full">
                    Supervisión Quinquenal de Misión
                  </span>
                  <span className="text-xs bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full">
                    {activeTeam.ethnicity}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-['Outfit']">
                  Consolidado Global de las 5 Fases Ministeriales
                </h2>
                <p className="text-stone-100/90 text-sm mt-1 max-w-2xl">
                  Seguimiento de las etapas de Investigación, Encarnación, Evangelización, Entrenamiento y Autocuidado para {activeTeam.name}.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <span className="text-xs text-amber-100 uppercase tracking-wider block font-semibold">
                      Presupuesto Total
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-['Outfit']">
                      {formatCurrencyCOP(grandTotalBudget)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-amber-100 uppercase tracking-wider block font-semibold">
                      Total Actividades
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-['Outfit']">
                      {grandTotalActivities} Iniciativas
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-amber-100 uppercase tracking-wider block font-semibold">
                      Completadas
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-['Outfit']">
                      {grandTotalCompleted} listas
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-amber-100 uppercase tracking-wider block font-semibold">
                      Avance PDM
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-['Outfit']">
                      {grandTotalActivities > 0
                        ? Math.round((grandTotalCompleted / grandTotalActivities) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjetas de Fases */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.values(allPlans).map((p, idx) => {
                  const phaseBudget = p.objectives.reduce(
                    (sum, o) => sum + o.activities.reduce((actSum, a) => actSum + (a.totalBudget || 0), 0),
                    0
                  );
                  const totalActs = p.objectives.reduce((sum, o) => sum + o.activities.length, 0);
                  const completedActs = p.objectives.reduce(
                    (sum, o) => sum + o.activities.filter((a) => a.state === 'Completado').length,
                    0
                  );
                  const pct = totalActs > 0 ? Math.round((completedActs / totalActs) * 100) : 0;

                  return (
                    <div
                      key={p.phaseId}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-400/80 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white shadow-2xs"
                            style={{ backgroundColor: themeColor }}
                          >
                            Fase #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-stone-400">
                            Inicio: {p.startDate}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
                          {p.phaseName}
                        </h3>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Presupuesto:</span>
                            <span className="font-bold" style={{ color: themeColor }}>
                              {formatCurrencyCOP(phaseBudget)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-stone-500">Actividades:</span>
                            <span className="font-semibold text-stone-700">
                              {completedActs} / {totalActs} listas
                            </span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: themeColor,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectPhase(p.phaseId);
                          setActiveView('plans');
                        }}
                        className="mt-5 w-full py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200"
                      >
                        <span>Abrir Detalle de Fase</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
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

      <TeamSelector
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        teams={mappedTeams}
        activeTeamId={activeTeam.id}
        onSelectTeam={(selectedId) => {
          setActiveTeamId(selectedId);
        }}
      />
    </div>
  );
};

export default App;
