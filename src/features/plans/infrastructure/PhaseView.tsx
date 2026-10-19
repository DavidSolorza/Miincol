import React from 'react';
import type { PhaseViewProps } from './phaseView/phaseView.types';
import { ObjectiveCard } from './ObjectiveCard';
import { ActivityModal } from './ActivityModal';
import { ObjectiveModal } from './ObjectiveModal';
import { PhaseHeaderBar } from './phaseView/PhaseHeaderBar';
import { PhaseObjectiveCardsGrid } from './phaseView/PhaseObjectiveCardsGrid';
import { TeamDepartmentZoomCard } from './phaseView/TeamDepartmentZoomCard';
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
  activeTeam,
  whatsappUrl,
  onOpenTeamModal,
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
    <div className="w-full space-y-3.5 sm:space-y-4">
      {/* 1. TOP ROW: OBJETIVOS (Left) + zoom DEPARTAMENTO (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        <div className={activeTeam ? 'lg:col-span-8 flex flex-col' : 'lg:col-span-12 flex flex-col'}>
          <div className="bg-white/95 p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between h-full space-y-3">
            <PhaseHeaderBar
              phaseName={plan.phaseName}
              objectivesCount={plan.objectives.length}
              hasMaxObjectives={plan.objectives.length >= 4}
              hasActiveObjective={Boolean(activeObjective)}
              activeObjectiveNumber={(activeObjective?.number as 1 | 2 | 3 | 4) || 1}
              onToggleMobileMenu={onToggleMobileMenu}
              onResetToDefaults={resetToDefaults}
              onOpenCreateObjective={addObjective ? modals.handleOpenCreateObjective : undefined}
            />
            <div className="flex-1 flex flex-col justify-between">
              <PhaseObjectiveCardsGrid
                objectives={plan.objectives}
                activeObjectiveNumber={activeObjectiveNumber}
                onSelectObjective={onSelectObjective}
                onOpenCreateObjective={addObjective ? modals.handleOpenCreateObjective : undefined}
              />
            </div>
          </div>
        </div>

        {activeTeam && (
          <div className="lg:col-span-4 flex flex-col">
            <TeamDepartmentZoomCard
              activeTeam={activeTeam}
              whatsappUrl={whatsappUrl}
              onOpenTeamModal={onOpenTeamModal}
            />
          </div>
        )}
      </div>

      {activeObjective && (
        <ObjectiveCard
          objective={activeObjective}
          onUpdateActivity={updateActivity}
          onDeleteActivity={deleteActivity}
          onOpenAddModal={modals.handleOpenAddModal}
          onEditObjective={modals.handleOpenEditObjective}
          onEditActivity={modals.handleOpenEditActivity}
        />
      )}

      <ActivityModal
        isOpen={modals.isAddModalOpen}
        onClose={modals.handleCloseActivityModal}
        mode={modals.activityModalMode}
        activityToEdit={modals.editingActivity}
        defaultObjectiveNumber={modals.modalDefaultObjective}
        onSave={addActivity}
        onUpdate={updateActivity}
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
