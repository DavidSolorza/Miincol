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
  MapPin,
  FileDown,
  Layers,
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
  onOpenTeamModal: () => void;
  onOpenReportModal: () => void;
  activeView: 'plans' | 'all-phases' | 'superadmin';
  onChangeView: (view: 'plans' | 'all-phases' | 'superadmin') => void;
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
  onOpenTeamModal,
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
          isCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'
        } ${
          isOpenMobile ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Parte Superior: Marca Misincol y Botón Colapsar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex flex-col">
              <MisincolLogo size="sm" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8B251E] to-[#E67324] text-white flex items-center justify-center font-black text-sm mx-auto shadow-xs">
              M
            </div>
          )}

          {/* Botón cerrar en móvil */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Botón colapsar en desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            title={isCollapsed ? 'Expandir panel lateral' : 'Colapsar panel lateral'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Cuerpo del Sidebar con Scroll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4.5 no-scrollbar">
          {/* 1. Identidad de Equipo Territorial */}
          {!isCollapsed ? (
            <div
              onClick={!isTeamRestricted ? onOpenTeamModal : undefined}
              className={`p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200/70 transition ${
                !isTeamRestricted ? 'hover:bg-[#F5EFE6] cursor-pointer group' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B251E]">
                  Misión en Campo
                </span>
                {!isTeamRestricted && (
                  <span className="text-[10px] text-[#8B251E] font-semibold group-hover:underline">
                    Cambiar
                  </span>
                )}
              </div>
              <h4 className="text-xs font-black text-stone-900 mt-0.5 truncate font-['Outfit']">
                {activeTeam.name}
              </h4>
              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#E67324]" />
                <span className="truncate">{activeTeam.region}</span>
              </p>
            </div>
          ) : (
            <div
              onClick={!isTeamRestricted ? onOpenTeamModal : undefined}
              className={`w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8B251E] flex items-center justify-center mx-auto transition ${
                !isTeamRestricted ? 'hover:bg-[#F5EFE6] cursor-pointer' : ''
              }`}
              title={`Equipo: ${activeTeam.name}`}
            >
              <MapPin className="w-4 h-4 text-[#E67324]" />
            </div>
          )}

          {/* 2. Navegación Principal */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 block">
                Vistas Principales
              </span>
            )}

            {/* Vista Super Admin (Sólo visible para Administradores) */}
            {!isTeamRestricted && (
              <button
                onClick={() => {
                  onChangeView('superadmin');
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeView === 'superadmin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Supervisión Nacional (Super Admin)"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#E67324]" />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Supervisión Nacional</span>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 font-black px-1.5 py-0.2 rounded uppercase">
                      Admin
                    </span>
                  </div>
                )}
              </button>
            )}

            {/* Vista Plan de Desarrollo */}
            <button
              onClick={() => {
                onChangeView('plans');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'plans'
                  ? 'bg-[#8B251E] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Plan por Fases"
            >
              <Compass className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Plan de Desarrollo (PDM)</span>}
            </button>

            {/* Vista Consolidado 5 Fases */}
            <button
              onClick={() => {
                onChangeView('all-phases');
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'all-phases'
                  ? 'bg-[#8B251E] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Consolidado 5 Fases"
            >
              <Layers className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Consolidado (5 Fases)</span>}
            </button>
          </div>

          {/* 3. Fases Ministeriales (1 al 5) */}
          <div className="space-y-1 pt-1">
            {!isCollapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 block">
                Fases del Plan PDM
              </span>
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
                <div key={p.id} className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectPhase(p.id);
                      if (activeView !== 'plans') onChangeView('plans');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isPhaseActive
                        ? 'bg-[#8B251E]/10 text-[#8B251E] font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={`Fase ${p.step}: ${p.label}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                          isPhaseActive
                            ? 'bg-[#8B251E] text-white'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {!isCollapsed && (
                        <span className="truncate font-['Outfit']">
                          {p.step}. {p.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <span className="text-[10px] font-bold text-stone-400">
                        {completedActs}/{totalActs}
                      </span>
                    )}
                  </button>

                  {/* Sub-lista de Objetivos de la fase activa (#1 al #4) en panel lateral */}
                  {isPhaseActive && !isCollapsed && currentPlan && (
                    <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-[#8B251E]/20 ml-5 my-1">
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
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer text-left ${
                              isObjActive
                                ? 'bg-stone-900 text-white font-bold shadow-2xs'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                            }`}
                          >
                            <span className="truncate text-[11px]">
                              Obj #{obj.number}: {obj.title}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1 py-0.2 rounded ml-1 shrink-0 ${
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

          {/* 4. Mini Resumen Presupuestal */}
          {!isCollapsed && activeView === 'plans' && (
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400">
                <span>Resumen de Fase</span>
                <span className="text-[#8B251E]">{metrics.progressPercentage}% listo</span>
              </div>
              <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[11px] text-stone-500">Presupuesto:</span>
                <span className="font-black text-stone-900 font-['Outfit']">
                  {formatCurrencyCOP(metrics.totalBudget)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Parte Inferior: Botón Generar Informe & Cerrar Sesión */}
        <div className="p-3 sm:p-4 border-t border-stone-100 space-y-2">
          <button
            onClick={() => {
              onOpenReportModal();
              if (isOpenMobile) onCloseMobile();
            }}
            className={`w-full py-2.5 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
            title="Generar Informe Ejecutivo PDM"
          >
            <FileDown className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Generar Informe PDM</span>}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-full py-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/80 transition flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                isCollapsed ? 'px-2' : 'px-4'
              }`}
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
