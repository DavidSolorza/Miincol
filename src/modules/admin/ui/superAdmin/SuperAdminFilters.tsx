import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  phaseFilter: string;
  setPhaseFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  totalResults: number;
}

export const SuperAdminFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  phaseFilter,
  setPhaseFilter,
  statusFilter,
  setStatusFilter,
  onReset,
  hasActiveFilters,
  totalResults,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2 bg-stone-100/80 rounded-xl border border-stone-200/70">
      <div className="relative flex-1">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por etnia, nombre de misión, líder o departamento..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white border border-stone-200 focus:outline-hidden focus:border-[#8B251E] text-stone-800 transition"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-stone-200 text-stone-700 font-medium cursor-pointer"
        >
          <option value="ALL">Todas las Fases PDM</option>
          <option value="investigacion">1. Investigación</option>
          <option value="encarnacion">2. Encarnación</option>
          <option value="evangelizacion">3. Evangelización</option>
          <option value="entrenamiento">4. Entrenamiento</option>
          <option value="autocuidado">5. Autocuidado</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-stone-200 text-stone-700 font-medium cursor-pointer"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="Optimo">Óptimo</option>
          <option value="Atención">Requiere Atención</option>
          <option value="Crítico">Alerta Crítica</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="text-[11px] text-stone-500 font-bold px-1 text-right shrink-0">
        {totalResults} misiones
      </div>
    </div>
  );
};
