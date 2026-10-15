import React from 'react';
import type { PhaseViewProps } from './phaseView/phaseView.types';
import { ObjectiveCard } from './ObjectiveCard';
import { ActivityModal } from './ActivityModal';
import { ObjectiveModal } from './ObjectiveModal';
import { PhaseHeaderBar } from './phaseView/PhaseHeaderBar';
import { PhaseObjectiveCardsGrid } from './phaseView/PhaseObjectiveCardsGrid';
import { usePhaseModals } from './phaseView/usePhaseModals';

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
  const modals = usePhaseModals({
    plan,
    onSelectObjective,
    updateObjective,
    addObjective,
    deleteObjective,
  });

  const activeObjective =
    plan.objectives.find((obj) => obj.number === activeObjectiveNumber) || plan.objectives[0];

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
        <PhaseHeaderBar
          phaseName={plan.phaseName}
          objectivesCount={plan.objectives.length}
          hasMaxObjectives={plan.objectives.length >= 4}
          hasActiveObjective={Boolean(activeObjective)}
          activeObjectiveNumber={(activeObjective?.number as 1 | 2 | 3 | 4) || 1}
          onToggleMobileMenu={onToggleMobileMenu}
          onResetToDefaults={resetToDefaults}
          onOpenCreateObjective={addObjective ? modals.handleOpenCreateObjective : undefined}
          onOpenAddModal={modals.handleOpenAddModal}
        />
        <PhaseObjectiveCardsGrid
          objectives={plan.objectives}
          activeObjectiveNumber={activeObjectiveNumber}
          onSelectObjective={onSelectObjective}
          onOpenCreateObjective={addObjective ? modals.handleOpenCreateObjective : undefined}
        />
      </div>

      {activeObjective && (
        <ObjectiveCard
          objective={activeObjective}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onOpenAddModal={modals.handleOpenAddModal}
          onEditObjective={modals.handleOpenEditObjective}
        />
      )}

      <ActivityModal
        isOpen={modals.isAddModalOpen}
        onClose={() => modals.setIsAddModalOpen(false)}
        defaultObjectiveNumber={modals.modalDefaultObjective}
        onSave={addActivity}
      />

      <ObjectiveModal
        isOpen={modals.isObjectiveModalOpen}
        onClose={() => modals.setIsObjectiveModalOpen(false)}
        mode={modals.objectiveModalMode}
        objectiveNumber={modals.editingObjective?.number}
        initialTitle={modals.editingObjective?.title || ''}
        initialDescription={modals.editingObjective?.description || ''}
        totalObjectivesCount={plan.objectives.length}
        onSave={modals.handleSaveObjective}
        onDelete={modals.handleDeleteObjective}
      />
    </div>
  );
};
