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
      {/* Barra de Navegación Rápida de Objetivos y Acciones */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Botón hamburguesa para móvil */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            title="Abrir menú lateral"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Badge de Fase */}
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-lg shrink-0">
            {plan.phaseName}
          </span>

          {/* Switcher de Objetivos Segmentado (1 al 4) */}
          <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {plan.objectives.map((obj) => {
              const isSelected = activeObjectiveNumber === obj.number;
              const completedCount = obj.activities.filter((a) => a.state === 'Completado').length;

              return (
                <button
                  key={obj.number}
                  onClick={() => onSelectObjective(obj.number)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
                  }`}
                  title={obj.title}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                      isSelected ? 'bg-[#8B251E] text-white' : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {obj.number}
                  </span>
                  <span className="truncate max-w-[120px] sm:max-w-[160px] text-[11px]">
                    {obj.title}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-[#E67324]/10 text-[#8B251E]' : 'text-stone-400'
                    }`}
                  >
                    {completedCount}/{obj.activities.length}
                  </span>
                </button>
              );
            })}

            {/* Botón para crear nuevo objetivo (Habilitado sólo si hay menos de 4 objetivos) */}
            {plan.objectives.length < 4 && addObjective ? (
              <button
                onClick={handleOpenCreateObjective}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-[#8B251E] hover:bg-white/80 transition whitespace-nowrap cursor-pointer shrink-0"
                title="Crear nuevo objetivo (Máx 4)"
              >
                <Plus className="w-3 h-3" />
                <span>+ Obj</span>
              </button>
            ) : (
              <span
                className="text-[9px] font-bold text-stone-400 px-1.5 py-0.5 whitespace-nowrap shrink-0"
                title="Máximo 4 objetivos alcanzado"
              >
                (4/4)
              </span>
            )}
          </div>
        </div>

        {/* Acciones Rápidas del Canvas */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
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

          {activeObjective && (
            <button
              onClick={() => handleOpenAddModal(activeObjective.number)}
              className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Actividad</span>
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

