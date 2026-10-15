import React from 'react';
import type { PhasePlan, PhaseType, PlanMetrics } from '../domain/plan.types';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import { MisincolLogo } from '../../../shared/components/MisincolLogo';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import {
  Compass,
  Users,
  Flame,
  GraduationCap,
  HeartHandshake,
  FileDown,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface PlanSidebarProps {
  allPlans: Record<string, PhasePlan>;
  activePhaseId: PhaseType;
  onSelectPhase: (phaseId: PhaseType) => void;
  activeObjectiveNumber: number;
  onSelectObjective: (objNum: number) => void;
  metrics: PlanMetrics;
  activeTeam: MissionaryTeam;
  onOpenTeamModal?: () => void;
  onOpenReportModal: () => void;
  activeView: 'plans' | 'superadmin';
  onChangeView: (view: 'plans' | 'superadmin') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  userRole?: 'admin' | 'team';
  onLogout?: () => void;
}

const PHASES_CONFIG: { id: PhaseType; step: number; label: string; icon: React.ElementType }[] = [
  { id: 'investigacion', step: 1, label: 'Investigación', icon: Compass },
  { id: 'encarnacion', step: 2, label: 'Encarnación', icon: Users },
  { id: 'evangelizacion', step: 3, label: 'Evangelización', icon: Flame },
  { id: 'entrenamiento', step: 4, label: 'Entrenamiento', icon: GraduationCap },
  { id: 'autocuidado', step: 5, label: 'Autocuidado', icon: HeartHandshake },
];

export const PlanSidebar: React.FC<PlanSidebarProps> = ({
  allPlans,
  activePhaseId,
  onSelectPhase,
  activeObjectiveNumber,
  onSelectObjective,
  metrics,
  activeTeam,
  onOpenReportModal,
  activeView,
  onChangeView,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  userRole = 'admin',
  onLogout,
}) => {
  const currentPlan = allPlans[activePhaseId];
  const isTeamRestricted = userRole === 'team';

  return (
    <>
      {/* Backdrop para móviles */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Contenedor del Panel Lateral */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white border-r border-stone-200/90 shadow-sm transition-all duration-300 flex flex-col justify-between select-none ${
          isCollapsed ? 'lg:w-16' : 'lg:w-52 xl:w-56'
        } ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Parte Superior: Marca Misincol y Botón Colapsar */}
        <div className="p-2 sm:p-2.5 border-b border-stone-100 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex flex-col">
              <MisincolLogo size="sm" showSubtitle={false} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B251E] to-[#E67324] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
              M
            </div>
          )}

          {/* Botón cerrar en móvil */}
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Botón colapsar en desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title={isCollapsed ? 'Expandir panel lateral' : 'Colapsar panel lateral'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Cuerpo del Sidebar con Scroll */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-2.5 no-scrollbar">
          {/* Navegación Principal */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-1">
                Vistas
              </span>
            )}

            {/* Vista Super Admin (Sólo visible para Administradores) */}
            {!isTeamRestricted && (
              <button
                onClick={() => {
                  onChangeView('superadmin');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'superadmin'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Supervisión Nacional (Super Admin)"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#E67324]" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Supervisión Nacional</span>
                    <span className="text-[8px] bg-amber-400/20 text-amber-300 font-black px-1 py-0.2 rounded uppercase">
                      Admin
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* Vista Plan de Desarrollo: visible para equipos territoriales o cuando el director esté inspeccionando un equipo */}
            {(isTeamRestricted || activeView === 'plans') && (
              <button
                onClick={() => {
                  onChangeView('plans');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeView === 'plans'
                    ? 'bg-[#8B251E] text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Plan por Fases"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col text-left truncate">
                    <span>Plan de Desarrollo (PDM)</span>
                    {!isTeamRestricted && (
                      <span className="text-[9px] text-amber-100 font-semibold truncate">
                        {activeTeam.name}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )}

            {/* Mensaje informativo para el Director en Supervisión Nacional */}
            {activeView === 'superadmin' && !isCollapsed && (
              <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                  Tablero Nacional
                </span>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Haga clic en cualquier equipo ministerial en el panel para supervisar sus etapas y objetivos.
                </p>
              </div>
            )}
          </div>

          {/* Fases Ministeriales (1 al 5) - Solo visibles cuando el director ingresa a un equipo o en vista de planes */}
          {activeView === 'plans' && (
            <div className="space-y-0.5 pt-1">
              {!isCollapsed && (
                <div className="px-2 mb-1 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                    Fases PDM
                  </span>
                  <span className="text-[9px] font-bold text-[#8B251E] truncate max-w-[120px]">
                    {activeTeam.ethnicity}
                  </span>
                </div>
              )}

            {PHASES_CONFIG.map((p) => {
              const Icon = p.icon;
              const isPhaseActive = activePhaseId === p.id && activeView === 'plans';
              const phasePlan = allPlans[p.id];
              const totalActs = phasePlan
                ? phasePlan.objectives.reduce((sum, o) => sum + o.activities.length, 0)
                : 0;
              const completedActs = phasePlan
                ? phasePlan.objectives.reduce(
                    (sum, o) => sum + o.activities.filter((a) => a.state === 'Completado').length,
                    0
                  )
                : 0;

              return (
                <div key={p.id} className="space-y-0.5">
                  <button
                    onClick={() => {
                      onSelectPhase(p.id);
                      if (activeView !== 'plans') onChangeView('plans');
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isPhaseActive
                        ? 'bg-[#8B251E]/10 text-[#8B251E] font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={`Fase ${p.step}: ${p.label}`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div
                        className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                          isPhaseActive
                            ? 'bg-[#8B251E] text-white'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      {!isCollapsed && (
                        <span className="truncate font-['Outfit'] text-[11px]">
                          {p.step}. {p.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <span className="text-[9px] font-bold text-stone-400">
                        {completedActs}/{totalActs}
                      </span>
                    )}
                  </button>

                  {/* Sub-lista de Objetivos de la fase activa (#1 al #4) en panel lateral */}
                  {isPhaseActive && !isCollapsed && currentPlan && (
                    <div className="pl-2 pr-0.5 py-0.5 space-y-0.5 border-l border-[#8B251E]/20 ml-2 my-0.5">
                      {currentPlan.objectives.map((obj) => {
                        const isObjActive = activeObjectiveNumber === obj.number;
                        const objCompleted = obj.activities.filter((a) => a.state === 'Completado').length;

                        return (
                          <button
                            key={obj.number}
                            onClick={() => {
                              onSelectObjective(obj.number);
                              if (isOpenMobile) onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-1.5 py-0.5 rounded-md text-[10px] transition cursor-pointer text-left ${
                              isObjActive
                                ? 'bg-stone-900 text-white font-bold shadow-2xs'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                            }`}
                          >
                            <span className="truncate text-[10px]">
                              Obj #{obj.number}: {obj.title}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1 py-0.2 rounded ml-1 shrink-0 ${
                                isObjActive ? 'bg-white/20 text-white' : 'text-stone-400'
                              }`}
                            >
                              {objCompleted}/{obj.activities.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

          {/* 4. Mini Resumen Presupuestal */}
          {!isCollapsed && activeView === 'plans' && (
            <div className="p-2 rounded-lg bg-[#FAF7F2] border border-stone-200/60 text-xs space-y-1">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-stone-400">
                <span>Avance de Fase</span>
                <span className="text-[#8B251E] font-black">{metrics.progressPercentage}%</span>
              </div>
              <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-0.5 text-[9px]">
                <span className="text-stone-400 font-medium">Presupuesto:</span>
                <span className="font-black text-stone-900 font-['Outfit']">
                  {formatCurrencyCOP(metrics.totalBudget)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Parte Inferior: Botón Generar Informe & Cerrar Sesión */}
        <div className="p-2 border-t border-stone-100 space-y-1">
          {(activeView === 'plans' || isTeamRestricted) && (
            <button
              onClick={() => {
                onOpenReportModal();
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full py-1.5 rounded-lg bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                isCollapsed ? 'px-1' : 'px-2'
              }`}
              title="Generar Informe Ejecutivo PDM"
            >
              <FileDown className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Informe PDM</span>}
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-full py-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/80 transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isCollapsed ? 'px-1' : 'px-2'
              }`}
              title="Cerrar Sesión"
            >
              <LogOut className="w-3 h-3 shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
