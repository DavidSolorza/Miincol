import React, { useState } from 'react';
import type { Objective, Activity } from '../domain/plan.types';
import { ActivityItem } from './ActivityItem';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import { Plus, Search, Layers, Pencil } from 'lucide-react';

interface ObjectiveCardProps {
  objective: Objective;
  onUpdateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDeleteActivity: (activityId: string) => void;
  onOpenAddModal: (objectiveNumber: 1 | 2 | 3 | 4) => void;
  onEditObjective?: (objective: Objective) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onUpdateActivity,
  onDeleteActivity,
  onOpenAddModal,
  onEditObjective,
}) => {
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalObjectiveBudget = objective.activities.reduce((acc, act) => acc + (act.totalBudget || 0), 0);
  const completedCount = objective.activities.filter((act) => act.state === 'Completado').length;
  const inProgressCount = objective.activities.filter((act) => act.state === 'En Proceso').length;
  const pendingCount = objective.activities.filter((act) => act.state === 'Pendiente').length;

  const filteredActivities = objective.activities.filter((act) => {
    const matchesState = filterState === 'ALL' || act.state === filterState;
    const matchesSearch =
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.stage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-hidden">
      {/* Cabecera Despejada del Objetivo */}
      <div className="p-3.5 sm:p-4.5 border-b border-stone-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-md">
                Objetivo #{objective.number}
              </span>
              <span className="text-[11px] text-stone-400">
                {completedCount} de {objective.activities.length} listas
              </span>
              {onEditObjective && (
                <button
                  onClick={() => onEditObjective(objective)}
                  className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-stone-400 hover:text-[#8B251E] hover:bg-[#8B251E]/10 transition flex items-center gap-1 cursor-pointer"
                  title="Editar objetivo"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Editar</span>
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-black text-stone-900 mt-1 font-['Outfit']">
              {objective.title}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed max-w-2xl">
              {objective.description}
            </p>
          </div>

          {/* Subtotal del Objetivo */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider leading-none">
                Presupuesto Objetivo
              </span>
              <span className="text-sm sm:text-base font-black text-[#8B251E] font-['Outfit'] mt-0.5 block">
                {formatCurrencyCOP(totalObjectiveBudget)}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda en 1 Sola Línea */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-stone-100">
          {/* Tabs mínimos de estado */}
          <div className="flex items-center gap-1 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterState('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
                filterState === 'ALL'
                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Todas ({objective.activities.length})
            </button>
            <button
              onClick={() => setFilterState('Pendiente')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
                filterState === 'Pendiente'
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilterState('En Proceso')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
                filterState === 'En Proceso'
                  ? 'bg-orange-100 text-[#8B251E] font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              En Proceso ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterState('Completado')}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
                filterState === 'Completado'
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Completadas ({completedCount})
            </button>
          </div>

          {/* Campo de búsqueda ligero */}
          <div className="relative w-full sm:w-52">
            <Search className="w-3 h-3 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar iniciativa..."
              className="w-full pl-7 pr-3 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#8B251E] transition"
            />
          </div>
        </div>
      </div>

      {/* Listado de Actividades Espaciado */}
      <div className="p-5 sm:p-6 space-y-3 bg-[#FAF7F2]/40 min-h-[160px]">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-stone-200 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#E67324] mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-700">No hay actividades visibles</h4>
            <p className="text-xs text-stone-400 max-w-xs mt-0.5">
              No coinciden con el filtro actual o aún no se han registrado en este objetivo.
            </p>
            <button
              onClick={() => onOpenAddModal(objective.number)}
              className="mt-3 text-xs font-bold text-[#8B251E] hover:text-[#731E18] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar primera actividad
            </button>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <ActivityItem
              key={act.id}
              activity={act}
              onUpdate={onUpdateActivity}
              onDelete={onDeleteActivity}
            />
          ))
        )}
      </div>
    </div>
  );
};
