import React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Props {
  isEdit: boolean;
  objectiveNumber?: 1 | 2 | 3 | 4;
  totalObjectivesCount: number;
  confirmDelete: boolean;
  setConfirmDelete: (val: boolean) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export const ObjectiveModalActions: React.FC<Props> = ({
  isEdit,
  objectiveNumber,
  totalObjectivesCount,
  confirmDelete,
  setConfirmDelete,
  onDelete,
  onClose,
}) => (
  <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
    {isEdit && onDelete && objectiveNumber ? (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onDelete}
          disabled={totalObjectivesCount <= 1}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            totalObjectivesCount <= 1
              ? 'opacity-40 cursor-not-allowed text-stone-400'
              : confirmDelete
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs animate-pulse'
              : 'text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600'
          }`}
          title={
            totalObjectivesCount <= 1
              ? 'No se puede eliminar el único objetivo restante'
              : confirmDelete
              ? 'Haga clic para confirmar la eliminación definitiva'
              : 'Eliminar este objetivo y sus actividades'
          }
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{confirmDelete ? '¿Confirmar eliminación?' : 'Eliminar Objetivo'}</span>
        </button>
        {confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="px-2.5 py-1.5 rounded-xl text-xs text-stone-500 hover:text-stone-800 transition cursor-pointer"
          >
            Cancelar
          </button>
        )}
      </div>
    ) : (
      <div />
    )}

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-xl border border-stone-200/80 text-stone-600 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs hover:shadow-md hover:shadow-[#8B251E]/20 active:scale-95 cursor-pointer font-['Outfit']"
      >
        {isEdit ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        <span>{isEdit ? 'Guardar Cambios' : 'Crear Objetivo'}</span>
      </button>
    </div>
  </div>
);
