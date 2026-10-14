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
    <div className="w-full space-y-4">
      {/* Barra Superior Esbelta del Canvas */}
      <div className="flex items-center justify-between pb-1 border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa para móvil */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            title="Abrir menú lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Miga de pan / Breadcrumb limpio */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
              <span className="text-[#8B251E] font-bold">{plan.phaseName}</span>
              <span>/</span>
              <span>Objetivo #{activeObjective?.number || 1}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
              {activeObjective?.title || 'Objetivo'}
            </h2>
          </div>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('¿Desea restablecer las actividades de prueba a los valores originales?')) {
                resetToDefaults();
              }
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition cursor-pointer"
            title="Restablecer datos originales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {activeObjective && (
            <button
              onClick={() => handleOpenAddModal(activeObjective.number)}
              className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Actividad</span>
            </button>
          )}
        </div>
      </div>

      {/* Pestañas de Objetivos Rápidas en Canvas (Segmented Switcher 1, 2, 3, 4 con botón de creación) */}
      <div className="flex items-center gap-1.5 bg-stone-200/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
        {plan.objectives.map((obj) => {
          const isSelected = activeObjectiveNumber === obj.number;
          const completedCount = obj.activities.filter((a) => a.state === 'Completado').length;

          return (
            <button
              key={obj.number}
              onClick={() => onSelectObjective(obj.number)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isSelected ? 'bg-[#8B251E] text-white' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {obj.number}
              </span>
              <span className="truncate max-w-[150px] sm:max-w-[200px]">{obj.title}</span>
              <span
                className={`text-[10px] px-1 py-0.2 rounded font-bold ${
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8B251E] hover:bg-white/80 border border-dashed border-[#8B251E]/40 transition whitespace-nowrap cursor-pointer shrink-0 shadow-2xs"
            title="Crear nuevo objetivo estratégico (Máximo 4 por fase)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Objetivo</span>
          </button>
        ) : (
          <span
            className="text-[10px] font-bold text-stone-400 bg-stone-100/80 px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 border border-stone-200/50"
            title="Límite alcanzado: Máximo 4 objetivos permitidos por fase"
          >
            (4/4 máx)
          </span>
        )}
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

