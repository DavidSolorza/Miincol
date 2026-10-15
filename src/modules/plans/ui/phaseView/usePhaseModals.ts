import { useState } from 'react';
import type { PhasePlan, Objective } from '../../domain/plan.types';

interface Props {
  plan: PhasePlan;
  onSelectObjective: (objNum: number) => void;
  updateObjective?: (objectiveNumber: 1 | 2 | 3 | 4, updates: { title?: string; description?: string }) => void;
  addObjective?: (newObj: { title: string; description: string }) => 1 | 2 | 3 | 4 | null;
  deleteObjective?: (objectiveNumber: 1 | 2 | 3 | 4) => boolean;
}

export const usePhaseModals = ({
  plan,
  onSelectObjective,
  updateObjective,
  addObjective,
  deleteObjective,
}: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDefaultObjective, setModalDefaultObjective] = useState<1 | 2 | 3 | 4>(1);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [objectiveModalMode, setObjectiveModalMode] = useState<'create' | 'edit'>('create');
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const handleOpenAddModal = (num: 1 | 2 | 3 | 4) => {
    setModalDefaultObjective(num);
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
      const newNum = addObjective({ title: data.title, description: data.description });
      if (newNum) onSelectObjective(newNum);
    } else if (objectiveModalMode === 'edit' && updateObjective && data.number) {
      updateObjective(data.number, { title: data.title, description: data.description });
    }
  };

  const handleDeleteObjective = (objNum: 1 | 2 | 3 | 4) => {
    if (!deleteObjective) return;
    if (deleteObjective(objNum)) {
      const remaining = plan.objectives.filter((o) => o.number !== objNum);
      if (remaining.length > 0) onSelectObjective(remaining[0].number);
    }
  };

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    modalDefaultObjective,
    handleOpenAddModal,
    isObjectiveModalOpen,
    setIsObjectiveModalOpen,
    objectiveModalMode,
    editingObjective,
    handleOpenCreateObjective,
    handleOpenEditObjective,
    handleSaveObjective,
    handleDeleteObjective,
  };
};
