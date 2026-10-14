import React, { useState } from 'react';
import type { PhasePlan, Activity, PlanMetrics } from '../domain/plan.types';
import { ObjectiveCard } from './ObjectiveCard';
import { ActivityModal } from './ActivityModal';
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
  resetToDefaults,
  onToggleMobileMenu,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalDefaultObjective, setModalDefaultObjective] = useState<1 | 2 | 3 | 4>(1);

  const handleOpenAddModal = (objectiveNumber: 1 | 2 | 3 | 4) => {
    setModalDefaultObjective(objectiveNumber);
    setIsAddModalOpen(true);
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
              <span>Objetivo #{activeObjective.number}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
              {activeObjective.title}
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

          <button
            onClick={() => handleOpenAddModal(activeObjective.number)}
            className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Objetivos Rápidas en Canvas (Segmented Switcher 1, 2, 3, 4) */}
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
      </div>

      {/* Tarjeta y Listado de Actividades del Objetivo Activo */}
      <ObjectiveCard
        objective={activeObjective}
        onUpdateActivity={updateActivity}
        onDeleteActivity={deleteActivity}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Modal para Agregar Nueva Actividad */}
      <ActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultObjectiveNumber={modalDefaultObjective}
        onSave={addActivity}
      />
    </div>
  );
};
