import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Target, Pencil, Plus, Trash2, AlertCircle, Info } from 'lucide-react';

interface ObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  objectiveNumber?: 1 | 2 | 3 | 4;
  initialTitle?: string;
  initialDescription?: string;
  totalObjectivesCount: number;
  onSave: (data: { title: string; description: string; number?: 1 | 2 | 3 | 4 }) => void;
  onDelete?: (objectiveNumber: 1 | 2 | 3 | 4) => void;
}

export const ObjectiveModal: React.FC<ObjectiveModalProps> = ({
  isOpen,
  onClose,
  mode,
  objectiveNumber,
  initialTitle = '',
  initialDescription = '',
  totalObjectivesCount,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  // Sincronizar datos al abrir o cambiar de modo
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setError(null);
      setConfirmDelete(false);
    }
  }, [isOpen, initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('El título del objetivo estratégico es obligatorio.');
      return;
    }

    if (!description.trim()) {
      setError('La descripción del objetivo estratégico es obligatoria.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      number: objectiveNumber,
    });

    onClose();
  };

  const handleDelete = () => {
    if (!objectiveNumber || !onDelete) return;

    if (totalObjectivesCount <= 1) {
      setError('No se puede eliminar: Toda fase ministerial debe contar con al menos un (1) objetivo.');
      return;
    }

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    onDelete(objectiveNumber);
    onClose();
  };

  const isEdit = mode === 'edit';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Editar Objetivo #${objectiveNumber}` : 'Nuevo Objetivo Estratégico'}
      subtitle={
        isEdit
          ? 'Modifique el título y la justificación estratégica de este objetivo en la fase actual'
          : `Defina un nuevo eje estratégico para el equipo territorial (${totalObjectivesCount}/4 objetivos)`
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Banner de regla de negocio: Máximo 4 objetivos */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-950 block">
              Regla Ministerial: Máximo 4 Objetivos por Fase
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Para garantizar el enfoque y viabilidad de la misión de campo, cada fase ministerial
              admite como máximo <strong>4 objetivos estratégicos</strong>. Actualmente hay{' '}
              <strong>{totalObjectivesCount} de 4</strong> registrados.
            </p>
          </div>
        </div>

        {/* Mensaje de Error si aplica */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold text-xs">{error}</span>
          </div>
        )}

        {/* Campo Título */}
        <div>
          <label className="font-bold text-stone-800 block mb-1">
            Título del Objetivo Estratégico <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <Target className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Diagnóstico Socio-Espiritual y Cartografía de Comunidades"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 focus:border-[#8B251E] font-medium"
              required
            />
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Debe ser claro, conciso y orientado a resultados ministeriales.
          </span>
        </div>

        {/* Campo Descripción */}
        <div>
          <label className="font-bold text-stone-800 block mb-1">
            Descripción y Enfoque Territorial <span className="text-rose-600">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describa el propósito, alcance en campo y cómo este objetivo aporta a la consolidación de la iglesia y la misión..."
            className="w-full p-3 rounded-xl border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 focus:border-[#8B251E] font-medium leading-relaxed resize-none"
            required
          />
        </div>

        {/* Botones de Acción */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
          {/* Botón Eliminar (Sólo en modo edición y si hay más de 1 objetivo) */}
          {isEdit && onDelete && objectiveNumber ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDelete}
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
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 font-bold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isEdit ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isEdit ? 'Guardar Cambios' : 'Crear Objetivo'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
