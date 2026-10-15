import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { ObjectiveFormFields } from './objectiveModal/ObjectiveFormFields';
import { ObjectiveModalActions } from './objectiveModal/ObjectiveModalActions';
import { useObjectiveModalForm } from './objectiveModal/useObjectiveModalForm';

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
  const form = useObjectiveModalForm({
    isOpen,
    mode,
    objectiveNumber,
    initialTitle,
    initialDescription,
    totalObjectivesCount,
    onSave,
    onDelete,
    onClose,
  });

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
      <form onSubmit={form.handleSubmit} noValidate className="space-y-4 text-xs">
        <ObjectiveFormFields
          totalObjectivesCount={totalObjectivesCount}
          error={form.error}
          title={form.title}
          setTitle={form.setTitle}
          description={form.description}
          setDescription={form.setDescription}
        />
        <ObjectiveModalActions
          isEdit={isEdit}
          objectiveNumber={objectiveNumber}
          totalObjectivesCount={totalObjectivesCount}
          confirmDelete={form.confirmDelete}
          setConfirmDelete={form.setConfirmDelete}
          onDelete={form.handleDelete}
          onClose={onClose}
        />
      </form>
    </Modal>
  );
};
