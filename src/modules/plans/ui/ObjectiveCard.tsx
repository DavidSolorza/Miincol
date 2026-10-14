import React, { useState } from 'react';
import type { Objective, Activity } from '../domain/plan.types';
import { ActivityItem } from './ActivityItem';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import { Plus, Search, Layers } from 'lucide-react';

interface ObjectiveCardProps {
  objective: Objective;
  onUpdateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDeleteActivity: (activityId: string) => void;
  onOpenAddModal: (objectiveNumber: 1 | 2 | 3 | 4) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onUpdateActivity,
  onDeleteActivity,
  onOpenAddModal,
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
    <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Cabecera Despejada del Objetivo */}
      <div className="p-5 sm:p-6 border-b border-stone-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-md">
                Objetivo #{objective.number}
              </span>
              <span className="text-xs text-stone-400">
                {completedCount} de {objective.activities.length} completadas
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-stone-900 mt-1 font-['Outfit']">
              {objective.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5 leading-relaxed max-w-3xl">
              {objective.description}
            </p>
          </div>

          {/* Subtotal del Objetivo y Botón de Acción */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Presupuesto Objetivo
              </span>
              <span className="text-sm sm:text-base font-black text-[#8B251E] font-['Outfit']">
                {formatCurrencyCOP(totalObjectiveBudget)}
              </span>
            </div>

            <button
              onClick={() => onOpenAddModal(objective.number)}
              className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Actividad</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda Despejada */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3.5 border-t border-stone-100">
          {/* Tabs mínimos de estado */}
          <div className="flex items-center gap-1 text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterState('ALL')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterState === 'ALL'
                  ? 'bg-stone-900 text-white font-bold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Todas ({objective.activities.length})
            </button>
            <button
              onClick={() => setFilterState('Pendiente')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterState === 'Pendiente'
                  ? 'bg-amber-100 text-amber-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilterState('En Proceso')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterState === 'En Proceso'
                  ? 'bg-orange-100 text-[#8B251E] font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              En Proceso ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterState('Completado')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                filterState === 'Completado'
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Completadas ({completedCount})
            </button>
          </div>

          {/* Campo de búsqueda ligero */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar iniciativa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 transition"
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
