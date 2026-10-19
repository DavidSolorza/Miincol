import { useState, useEffect } from 'react';
import { useToast } from '../../../../shared/components/Toast';

interface HookProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  objectiveNumber?: 1 | 2 | 3 | 4;
  initialTitle?: string;
  initialDescription?: string;
  totalObjectivesCount: number;
  onSave: (data: { title: string; description: string; number?: 1 | 2 | 3 | 4 }) => void;
  onDelete?: (objectiveNumber: 1 | 2 | 3 | 4) => void;
  onClose: () => void;
}

export const useObjectiveModalForm = ({
  isOpen,
  mode,
  objectiveNumber,
  initialTitle = '',
  initialDescription = '',
  totalObjectivesCount,
  onSave,
  onDelete,
  onClose,
}: HookProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

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
    if (!title.trim() || !description.trim()) {
      const msg = 'El título y la descripción del objetivo son obligatorios.';
      setError(msg);
      toast.warning(msg, 'Campo Requerido');
      return;
    }

    onSave({ title: title.trim(), description: description.trim(), number: objectiveNumber });
    toast.success(
      mode === 'edit'
        ? `Objetivo #${objectiveNumber} actualizado correctamente`
        : 'Nuevo objetivo estratégico agregado a la fase',
      'Objetivo Guardado'
    );
    onClose();
  };

  const handleDelete = () => {
    if (!objectiveNumber || !onDelete) return;
    if (totalObjectivesCount <= 1) {
      const msg = 'No se puede eliminar: Toda fase ministerial debe contar con al menos un objetivo.';
      setError(msg);
      toast.warning(msg, 'Regla Ministerial');
      return;
    }
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDelete(objectiveNumber);
    toast.info(`Objetivo #${objectiveNumber} eliminado de la fase`, 'Objetivo Eliminado');
    onClose();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    error,
    confirmDelete,
    setConfirmDelete,
    handleSubmit,
    handleDelete,
  };
};
