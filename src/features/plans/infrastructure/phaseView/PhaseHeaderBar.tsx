import React from 'react';
import { Menu, RotateCcw, Plus } from 'lucide-react';
import { useToast } from '../../../../shared/components/Toast';

interface Props {
  phaseName: string;
  objectivesCount: number;
  hasMaxObjectives: boolean;
  hasActiveObjective: boolean;
  activeObjectiveNumber?: 1 | 2 | 3 | 4;
  onToggleMobileMenu: () => void;
  onResetToDefaults: () => void;
  onOpenCreateObjective?: () => void;
  onOpenAddModal?: (objNum: 1 | 2 | 3 | 4) => void;
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
}) => {
  const { confirmAction, toast } = useToast();

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          title="Abrir menú lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8B251E] bg-gradient-to-r from-[#8B251E]/10 to-[#E67324]/10 px-3 py-1.5 rounded-xl border border-[#8B251E]/15 font-['Outfit'] shadow-2xs">
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
            confirmAction({
              title: '¿Restablecer Actividades de Prueba?',
              message: '¿Deseas restablecer las actividades de esta fase a sus valores originales de prueba?',
              confirmLabel: 'Restablecer',
              cancelLabel: 'Cancelar',
              type: 'warning',
              onConfirm: () => {
                onResetToDefaults();
                toast.info('Actividades restablecidas a valores originales', 'Datos Iniciales');
              },
            });
          }}
          className="w-8 h-8 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 border border-transparent hover:border-stone-200 flex items-center justify-center transition cursor-pointer"
          title="Restablecer datos originales"
        >
          <RotateCcw className="w-4.5 h-4.5" />
        </button>

        {!hasMaxObjectives && onOpenCreateObjective && (
          <button
            onClick={onOpenCreateObjective}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#8B251E] bg-[#8B251E]/10 hover:bg-[#8B251E]/15 border border-[#8B251E]/20 transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Crear nuevo objetivo (Máx 4)"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Nuevo Objetivo</span>
          </button>
        )}

        {hasActiveObjective && onOpenAddModal && (
          <button
            onClick={() => onOpenAddModal(activeObjectiveNumber)}
            className="bg-gradient-to-r from-[#8B251E] to-[#A83229] hover:from-[#751E18] hover:to-[#8B251E] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-['Outfit']"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Nueva Actividad</span>
          </button>
        )}
      </div>
    </div>
  );
};
