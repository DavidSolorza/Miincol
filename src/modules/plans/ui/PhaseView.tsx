import React, { useState } from 'react';
import type { PhasePlan, Objective, Activity, PlanMetrics } from '../domain/plan.types';
import { ObjectiveCard } from './ObjectiveCard';
import { ActivityModal } from './ActivityModal';
import { ObjectiveModal } from './ObjectiveModal';
import {
  Menu,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface PhaseViewProps {
  plan: PhasePlan;
  activeObjectiveNumber: number;
  onSelectObjective: (objNum: number) => void;
  updateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  deleteActivity: (activityId: string) => void;
  addActivity: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
  updateObjective?: (objectiveNumber: 1 | 2 | 3 | 4, updates: { title?: string; description?: string }) => void;
  addObjective?: (newObj: { title: string; description: string }) => 1 | 2 | 3 | 4 | null;
  deleteObjective?: (objectiveNumber: 1 | 2 | 3 | 4) => boolean;
  resetToDefaults: () => void;
  metrics: PlanMetrics;
  onToggleMobileMenu: () => void;
}

export const PhaseView: React.FC<PhaseViewProps> = ({
  plan,
  activeObjectiveNumber,
  onSelectObjective,
  updateActivity,
  deleteActivity,
  addActivity,
  updateObjective,
  addObjective,
  deleteObjective,
  resetToDefaults,
  onToggleMobileMenu,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalDefaultObjective, setModalDefaultObjective] = useState<1 | 2 | 3 | 4>(1);

  // Estados para el Modal de Crear / Editar Objetivo Estratégico
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState<boolean>(false);
  const [objectiveModalMode, setObjectiveModalMode] = useState<'create' | 'edit'>('create');
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const handleOpenAddModal = (objectiveNumber: 1 | 2 | 3 | 4) => {
    setModalDefaultObjective(objectiveNumber);
    setIsAddModalOpen(true);
  };

  const handleOpenCreateObjective = () => {
    setObjectiveModalMode('create');
    setEditingObjective(null);
    setIsObjectiveModalOpen(true);
  };

  const handleOpenEditObjective = (obj: Objective) => {
    setObjectiveModalMode('edit');
    setEditingObjective(obj);
    setIsObjectiveModalOpen(true);
  };

  const handleSaveObjective = (data: { title: string; description: string; number?: 1 | 2 | 3 | 4 }) => {
    if (objectiveModalMode === 'create' && addObjective) {
      const newNumber = addObjective({ title: data.title, description: data.description });
      if (newNumber) {
        onSelectObjective(newNumber);
      }
    } else if (objectiveModalMode === 'edit' && updateObjective && data.number) {
      updateObjective(data.number, { title: data.title, description: data.description });
    }
  };

  const handleDeleteObjective = (objNum: 1 | 2 | 3 | 4) => {
    if (!deleteObjective) return;
    const success = deleteObjective(objNum);
    if (success) {
      const remaining = plan.objectives.filter((o) => o.number !== objNum);
      if (remaining.length > 0) {
        onSelectObjective(remaining[0].number);
      }
    }
  };

  const activeObjective =
    plan.objectives.find((obj) => obj.number === activeObjectiveNumber) || plan.objectives[0];

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Selector Principal de Objetivos Estratégicos de la Fase (Zona Superior Destacada) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
        {/* Cabecera: Fase Activa + Acciones */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              title="Abrir menú lateral"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-lg">
                {plan.phaseName}
              </span>
              <span className="text-xs font-semibold text-stone-400 hidden sm:inline">
                • {plan.objectives.length} Objetivos Estratégicos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                if (confirm('¿Desea restablecer las actividades de prueba a los valores originales?')) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Restablecer datos originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {plan.objectives.length < 4 && addObjective && (
              <button
                onClick={handleOpenCreateObjective}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 hover:bg-[#8B251E]/20 transition cursor-pointer"
                title="Crear nuevo objetivo (Máx 4)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Objetivo</span>
              </button>
            )}

            {activeObjective && (
              <button
                onClick={() => handleOpenAddModal(activeObjective.number)}
                className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Actividad</span>
              </button>
            )}
          </div>
        </div>

        {/* Tarjetas de Objetivos de la Fase (Fácil de ver, con excelentes estilos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {plan.objectives.map((obj) => {
            const isSelected = activeObjectiveNumber === obj.number;
            const completedCount = obj.activities.filter((a) => a.state === 'Completado').length;
            const totalCount = obj.activities.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isCompleted = totalCount > 0 && completedCount === totalCount;

            return (
              <button
                key={obj.number}
                type="button"
                onClick={() => onSelectObjective(obj.number)}
                className={`group relative text-left p-3 sm:p-3.5 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-linear-to-b from-[#FAF7F2] to-white border-2 border-[#8B251E] shadow-sm ring-2 ring-[#8B251E]/15'
                    : 'bg-stone-50/70 hover:bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-2xs'
                }`}
              >
                {/* Acento superior para el objetivo seleccionado */}
                {isSelected && (
                  <div className="absolute top-0 left-3 right-3 h-0.5 bg-linear-to-r from-[#8B251E] to-[#E67324] rounded-full" />
                )}

                <div>
                  {/* Fila 1: Indicador de Objetivo y Contador de Actividades */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition ${
                          isSelected
                            ? 'bg-[#8B251E] text-white shadow-2xs'
                            : 'bg-stone-200 text-stone-600 group-hover:bg-stone-300'
                        }`}
                      >
                        {obj.number}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider truncate ${
                          isSelected ? 'text-[#8B251E]' : 'text-stone-500 group-hover:text-stone-700'
                        }`}
                      >
                        Objetivo #{obj.number}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 transition ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isSelected
                          ? 'bg-[#E67324]/15 text-[#8B251E]'
                          : 'bg-stone-200/70 text-stone-600'
                      }`}
                    >
                      {completedCount}/{totalCount} listas
                    </span>
                  </div>

                  {/* Fila 2: Título Completo y Legible */}
                  <h4
                    className={`font-['Outfit'] font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[2.3rem] transition ${
                      isSelected
                        ? 'text-stone-900 font-extrabold'
                        : 'text-stone-700 group-hover:text-stone-900'
                    }`}
                    title={obj.title}
                  >
                    {obj.title}
                  </h4>
                </div>

                {/* Fila 3: Micro Barra de Progreso y Estado */}
                <div className="mt-3 pt-2 border-t border-stone-100 space-y-1">
                  <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isSelected
                          ? 'bg-linear-to-r from-[#8B251E] to-[#E67324]'
                          : 'bg-stone-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-medium text-stone-400">
                    <span>{pct}% completado</span>
                    <span className={isSelected ? 'text-[#8B251E] font-bold' : 'group-hover:text-stone-600'}>
                      {isSelected ? '● Seleccionado' : 'Ver actividades →'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Botón para crear nuevo objetivo si hay menos de 4 */}
          {plan.objectives.length < 4 && addObjective && (
            <button
              type="button"
              onClick={handleOpenCreateObjective}
              className="p-3 sm:p-3.5 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#8B251E]/40 hover:bg-[#8B251E]/5 transition flex flex-col items-center justify-center text-center gap-2 cursor-pointer group min-h-[110px]"
            >
              <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#8B251E]/10 text-stone-500 group-hover:text-[#8B251E] flex items-center justify-center transition">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-600 group-hover:text-[#8B251E] block">
                  + Nuevo Objetivo
                </span>
                <span className="text-[10px] text-stone-400">
                  ({plan.objectives.length}/4 registrados)
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta y Listado de Actividades del Objetivo Activo */}
      {activeObjective && (
        <ObjectiveCard
          objective={activeObjective}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onOpenAddModal={handleOpenAddModal}
          onEditObjective={handleOpenEditObjective}
        />
      )}

      {/* Modal para Agregar Nueva Actividad */}
      <ActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultObjectiveNumber={modalDefaultObjective}
        onSave={addActivity}
      />

      {/* Modal para Crear / Editar Objetivo Estratégico */}
      <ObjectiveModal
        isOpen={isObjectiveModalOpen}
        onClose={() => setIsObjectiveModalOpen(false)}
        mode={objectiveModalMode}
        objectiveNumber={editingObjective?.number}
        initialTitle={editingObjective?.title || ''}
        initialDescription={editingObjective?.description || ''}
        totalObjectivesCount={plan.objectives.length}
        onSave={handleSaveObjective}
        onDelete={handleDeleteObjective}
      />
    </div>
  );
};

