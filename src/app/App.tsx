import React, { useState } from 'react';
import { PlanSidebar } from '../modules/plans/ui/PlanSidebar';
import { PhaseView } from '../modules/plans/ui/PhaseView';
import { SuperAdminView } from '../modules/admin/ui/SuperAdminView';
import { ReportModal } from '../modules/reports/ui/ReportModal';
import { TeamSelector } from '../modules/auth/ui/TeamSelector';
import { useAuth } from '../modules/auth/application/useAuth';
import { usePlan } from '../modules/plans/application/usePlan';
import { formatCurrencyCOP } from '../shared/utils/formatters';
import {
  Menu,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export const App: React.FC = () => {
  const { session, activeTeam, teams, switchTeam } = useAuth();
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
  } = usePlan('investigacion');

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

  // Función para que el Super Admin entre a supervisar un equipo específico
  const handleInspectTeamFromAdmin = (teamId: string) => {
    switchTeam(teamId);
    setActiveView('plans');
    setActiveObjectiveNumber(1);
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
        (objAcc, o) =>
          objAcc + o.activities.filter((a) => a.state === 'Completado').length,
        0
      )
    );
  }, 0);

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
        onChangeView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Área Principal de Trabajo (Canvas Despejado) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
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
              <span className="text-stone-700 font-medium">
                {activeView === 'superadmin' ? 'Tablero de Supervisión Nacional' : activeTeam.name}
              </span>
            </div>
          </div>

          {/* Perfil de Usuario Sesión y Toggle Rápido a Super Admin */}
          <div className="flex items-center gap-3">
            {activeView !== 'superadmin' ? (
              <button
                onClick={() => setActiveView('superadmin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#8B251E] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E67324]" />
                <span className="hidden sm:inline">Modo Super Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('plans')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                <span>Volver a Plan PDM</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#8B251E] to-[#E67324] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden md:flex flex-col text-left text-xs">
                <span className="font-bold text-stone-800 leading-none">
                  {activeView === 'superadmin' ? 'Director Nacional' : session.userName}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  {activeView === 'superadmin' ? 'Super Administrador' : session.role}
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
            />
          ) : activeView === 'plans' ? (
            /* Vista 2: Plan de Desarrollo Ministerial del Equipo Activo */
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
          ) : (
            /* Vista 3: Consolidado Quinquenal de las 5 Fases */
            <div className="space-y-6">
              <div className="bg-linear-to-r from-[#8B251E] via-[#A63226] to-[#E67324] rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-[#8B251E]/15">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200 bg-white/10 px-3 py-1 rounded-full">
                  Supervisión Quinquenal de Misión
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 font-['Outfit']">
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
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-[#8B251E]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-full">
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
                            <span className="font-bold text-[#8B251E]">
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
                              className="bg-linear-to-r from-[#8B251E] to-[#E67324] h-full rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectPhase(p.phaseId);
                          setActiveView('plans');
                        }}
                        className="mt-5 w-full py-2.5 text-xs font-bold text-[#8B251E] hover:text-[#6E1A14] bg-[#8B251E]/5 hover:bg-[#8B251E]/10 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
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
        teams={teams}
        activeTeamId={activeTeam.id}
        onSelectTeam={switchTeam}
      />
    </div>
  );
};

export default App;
