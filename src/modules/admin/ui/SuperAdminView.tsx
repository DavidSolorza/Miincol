import React, { useState } from 'react';
import { useAdminDashboard } from '../application/useAdminDashboard';
import { TeamOverviewCard } from './TeamOverviewCard';
import { TeamModal } from './TeamModal';
import type { TeamSupervisionSummary, CreateTeamDto } from '../domain/admin.types';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import {
  Coins,
  TrendingUp,
  AlertTriangle,
  Search,
  Layers,
  Compass,
  FileDown,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface SuperAdminViewProps {
  onInspectTeam: (teamId: string) => void;
  onOpenReportModal?: () => void;
  dashboardHook?: ReturnType<typeof useAdminDashboard>;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onInspectTeam,
  onOpenReportModal,
  dashboardHook,
}) => {
  // Permite inyectar hook desde el contenedor principal (App.tsx) para compartir estado de equipos
  const defaultHook = useAdminDashboard();
  const {
    teams,
    allTeamsCount,
    nationalKpis,
    searchTerm,
    setSearchTerm,
    phaseFilter,
    setPhaseFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    handlePhaseChange,
  } = dashboardHook || defaultHook;

  // Estado para Modal de Creación / Edición de Equipos (Estilo PortalClientes)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<TeamSupervisionSummary | null>(null);

  const openCreateModal = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const openEditModal = (team: TeamSupervisionSummary) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (dto: CreateTeamDto) => {
    if (editingTeam) {
      handleUpdateTeam(editingTeam.id, dto);
    } else {
      handleCreateTeam(dto);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPhaseFilter('ALL');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Cabecera Ejecutiva Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-md">
              Supervisión Nacional
            </span>
            <span className="text-xs text-stone-400 font-medium">Junta Pastoral Misincol</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 font-['Outfit']">
            Tablero Central de Misiones
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 max-w-2xl truncate sm:overflow-visible">
            Avance estratégico de los Planes de Desarrollo Ministerial (PDM) y contingencias de campo en Colombia.
          </p>
        </div>

        {/* Acciones Generales: Crear Nuevo Equipo + Informe Nacional */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <button
            onClick={openCreateModal}
            className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nueva Misión</span>
          </button>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs px-3 py-2 rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">Informe</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Tarjetas de KPIs Consolidados Minimalistas (Alta Densidad) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* KPI 1: Equipos y Obreros */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#8B251E]/10 text-[#8B251E] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
              Misiones en Campo
            </span>
            <div className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit'] mt-0.5 leading-tight">
              {nationalKpis.totalTeams} <span className="text-xs font-semibold text-stone-400 font-sans">equipos</span>
            </div>
            <span className="text-[10px] text-stone-500 truncate block">
              {nationalKpis.totalMissionaries} obreros activos
            </span>
          </div>
        </div>

        {/* KPI 2: Presupuesto Nacional */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E67324]/10 text-[#E67324] flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
              Presupuesto Nacional
            </span>
            <div className="text-sm sm:text-base font-black text-stone-900 font-['Outfit'] mt-0.5 leading-tight truncate">
              {formatCurrencyCOP(nationalKpis.totalNationalBudget)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold truncate block">
              {formatCurrencyCOP(nationalKpis.totalExecutedBudget)} ejecutado
            </span>
          </div>
        </div>

        {/* KPI 3: Avance Nacional Promedio */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
                Avance
              </span>
              <span className="text-xs font-black text-[#8B251E] font-['Outfit']">
                {nationalKpis.nationalAverageProgress}%
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-500"
                style={{ width: `${nationalKpis.nationalAverageProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-500 truncate block mt-0.5">
              {nationalKpis.completedActivities}/{nationalKpis.totalActivities} iniciativas
            </span>
          </div>
        </div>

        {/* KPI 4: Alertas de Campo */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block leading-none">
              Alertas Activas
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-800 font-['Outfit'] mt-0.5 leading-tight">
              {nationalKpis.activeCriticalAlerts}{' '}
              <span className="text-xs font-semibold text-stone-400 font-sans">abiertas</span>
            </div>
            <span className="text-[10px] text-stone-500 truncate block">
              Salud, vías y seguridad
            </span>
          </div>
        </div>
      </div>

      {/* 3. Barra Unificada de Búsqueda y Filtros en 1 Sola Línea */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200/80 shadow-2xs flex flex-wrap items-center gap-2">
        {/* Buscador inteligente */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por equipo, líder, etnia o región..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#8B251E] transition"
          />
        </div>

        {/* Selectores Compactos de Filtro */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          {/* Filtro por Fase */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-700 cursor-pointer focus:outline-hidden"
          >
            <option value="ALL">Todas las Fases (1-5)</option>
            <option value="investigacion">1. Investigación</option>
            <option value="encarnacion">2. Encarnación</option>
            <option value="evangelizacion">3. Evangelización</option>
            <option value="entrenamiento">4. Entrenamiento</option>
            <option value="autocuidado">5. Autocuidado</option>
          </select>

          {/* Filtro por Estado Operativo */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-700 cursor-pointer focus:outline-hidden"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Optimo">Óptimo</option>
            <option value="Atención">Requiere Atención</option>
            <option value="Crítico">Alerta Crítica</option>
          </select>

          {/* Filtro por Región */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-700 cursor-pointer focus:outline-hidden"
          >
            <option value="ALL">Todas las Regiones</option>
            <option value="Caribe">Región Caribe</option>
            <option value="Andina">Región Andina</option>
            <option value="Amazonía">Región Amazonía</option>
          </select>

          {/* Reset rápido de filtros si hay alguno aplicado */}
          {(searchTerm || phaseFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#8B251E] hover:text-[#731E18] flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg hover:bg-[#8B251E]/10 transition cursor-pointer"
              title="Limpiar todos los filtros"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Matriz de Tarjetas de Equipos en Terreno */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 px-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Mostrando {teams.length} de {allTeamsCount} misiones ministeriales
          </span>
          <span className="text-xs text-stone-400">
            Haga clic en <strong>"Supervisar Plan"</strong> para ingresar al espacio operativo del equipo
          </span>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#8B251E] flex items-center justify-center mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800 font-['Outfit']">
              No se encontraron equipos con los filtros seleccionados
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1">
              Pruebe cambiando los criterios de búsqueda o aprovisione una nueva misión ministerial.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition cursor-pointer"
              >
                Limpiar filtros
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl bg-[#8B251E] text-white font-bold text-xs hover:bg-[#731E18] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Equipo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {teams.map((team) => (
              <TeamOverviewCard
                key={team.id}
                team={team}
                onInspectTeam={onInspectTeam}
                onEditTeam={openEditModal}
                onDeleteTeam={handleDeleteTeam}
                onPhaseChange={handlePhaseChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición de Equipo (Estilo PortalClientes) */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTeam}
      />
    </div>
  );
};
