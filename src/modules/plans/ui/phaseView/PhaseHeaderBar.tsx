import React from 'react';
import { Menu, RotateCcw, Plus } from 'lucide-react';

interface Props {
  phaseName: string;
  objectivesCount: number;
  hasMaxObjectives: boolean;
  hasActiveObjective: boolean;
  activeObjectiveNumber?: 1 | 2 | 3 | 4;
  onToggleMobileMenu: () => void;
  onResetToDefaults: () => void;
  onOpenCreateObjective?: () => void;
  onOpenAddModal: (objNum: 1 | 2 | 3 | 4) => void;
}

export const PhaseHeaderBar: React.FC<Props> = ({
  phaseName,
  objectivesCount,
  hasMaxObjectives,
  hasActiveObjective,
  activeObjectiveNumber = 1,
  onToggleMobileMenu,
  onResetToDefaults,
  onOpenCreateObjective,
  onOpenAddModal,
}) => (
  <div className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-2.5">
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
        title="Abrir menú lateral"
      >
        <Menu className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-1 rounded-lg">
          {phaseName}
        </span>
        <span className="text-xs font-semibold text-stone-400 hidden sm:inline">
          • {objectivesCount} Objetivos Estratégicos
        </span>
      </div>
    </div>

    <div className="flex items-center gap-2 ml-auto">
      <button
        onClick={() => {
          if (confirm('¿Desea restablecer las actividades de prueba a los valores originales?')) {
            onResetToDefaults();
          }
        }}
        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
        title="Restablecer datos originales"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {!hasMaxObjectives && onOpenCreateObjective && (
        <button
          onClick={onOpenCreateObjective}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 hover:bg-[#8B251E]/20 transition cursor-pointer"
          title="Crear nuevo objetivo (Máx 4)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nuevo Objetivo</span>
        </button>
      )}

      {hasActiveObjective && (
        <button
          onClick={() => onOpenAddModal(activeObjectiveNumber)}
          className="bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Actividad</span>
        </button>
      )}
    </div>
  </div>
);
