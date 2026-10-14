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
    <div className="space-y-6">
      {/* 1. Cabecera Ejecutiva de Supervisión Nacional */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-white bg-[#8B251E] px-2.5 py-0.5 rounded-md shadow-xs">
              Supervisión Nacional
            </span>
            <span className="text-xs text-stone-500 font-medium">Junta Pastoral Misincol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1.5 font-['Outfit']">
            Tablero Central de Misiones Indígenas
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 max-w-3xl leading-relaxed">
            Consolidado estratégico de avance de los Planes de Desarrollo Ministerial (PDM), organización de equipos y contingencias de campo en Colombia.
          </p>
        </div>

        {/* Acciones Generales: Crear Nuevo Equipo + Informe Nacional */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={openCreateModal}
            className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Equipo / Misión</span>
          </button>

          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">Informe Consolidado</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Tarjetas de KPIs Consolidados a Nivel Nacional */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Equipos y Obreros */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#8B251E]/10 text-[#8B251E] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Misiones en Territorio
            </span>
            <span className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
              {nationalKpis.totalTeams} <span className="text-xs font-bold text-stone-500">equipos</span>
            </span>
            <span className="text-[11px] text-stone-500 block">
              {nationalKpis.totalMissionaries} obreros en campo
            </span>
          </div>
        </div>

        {/* KPI 2: Presupuesto Nacional */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#E67324]/10 text-[#E67324] shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Presupuesto Nacional
            </span>
            <span className="text-base sm:text-lg font-black text-stone-900 font-['Outfit'] block truncate">
              {formatCurrencyCOP(nationalKpis.totalNationalBudget)}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              {formatCurrencyCOP(nationalKpis.totalExecutedBudget)} ejecutado
            </span>
          </div>
        </div>

        {/* KPI 3: Avance Nacional Promedio */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Avance Promedio
              </span>
              <span className="text-sm font-black text-[#8B251E] font-['Outfit']">
                {nationalKpis.nationalAverageProgress}%
              </span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-500"
                style={{ width: `${nationalKpis.nationalAverageProgress}%` }}
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              {nationalKpis.completedActivities} de {nationalKpis.totalActivities} iniciativas listas
            </span>
          </div>
        </div>

        {/* KPI 4: Alertas de Campo */}
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Alertas Territoriales
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-800 font-['Outfit']">
              {nationalKpis.activeCriticalAlerts}{' '}
              <span className="text-xs font-bold text-stone-500">abiertas</span>
            </span>
            <span className="text-[11px] text-stone-500 block">
              Salud, vías y seguridad
            </span>
          </div>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros Multidimensionales */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Buscador inteligente */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por equipo, líder, etnia, departamento o municipio..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 transition"
            />
          </div>

          {/* Reset rápido de filtros si hay alguno aplicado */}
          {(searchTerm || phaseFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#8B251E] hover:text-[#731E18] flex items-center gap-1 shrink-0 px-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Selectores de Filtro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          {/* Filtro por Fase */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-bold text-[11px] shrink-0">Fase PDM:</span>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 cursor-pointer"
            >
              <option value="ALL">Todas las Fases (1 a 5)</option>
              <option value="investigacion">1. Investigación</option>
              <option value="encarnacion">2. Encarnación</option>
              <option value="evangelizacion">3. Evangelización</option>
              <option value="entrenamiento">4. Entrenamiento</option>
              <option value="autocuidado">5. Autocuidado</option>
            </select>
          </div>

          {/* Filtro por Estado Operativo */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-bold text-[11px] shrink-0">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 cursor-pointer"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Optimo">Operación Estable (Óptimo)</option>
              <option value="Atención">Requiere Atención</option>
              <option value="Crítico">Alerta Crítica</option>
            </select>
          </div>

          {/* Filtro por Región */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-bold text-[11px] shrink-0">Región:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 cursor-pointer"
            >
              <option value="ALL">Todo el Territorio Nacional</option>
              <option value="Caribe">Región Caribe (Guajira, Cesar, Magdalena)</option>
              <option value="Andina">Región Andina (Cauca, Risaralda)</option>
              <option value="Amazonía">Región Amazonía (Guaviare, Amazonas)</option>
            </select>
          </div>
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
