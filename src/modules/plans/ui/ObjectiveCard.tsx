import React, { useState } from 'react';
import type { Objective, Activity } from '../domain/plan.types';
import { ObjectiveCardHeader } from './objectiveCard/ObjectiveCardHeader';
import { ObjectiveFilterBar } from './objectiveCard/ObjectiveFilterBar';
import { ObjectiveActivitiesList } from './objectiveCard/ObjectiveActivitiesList';

interface ObjectiveCardProps {
  objective: Objective;
  onUpdateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDeleteActivity: (activityId: string) => void;
  onOpenAddModal: (objectiveNumber: 1 | 2 | 3 | 4) => void;
  onEditObjective?: (objective: Objective) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = React.memo(({
  objective,
  onUpdateActivity,
  onDeleteActivity,
  onOpenAddModal,
  onEditObjective,
}) => {
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalObjectiveBudget = objective.activities.reduce((acc, act) => acc + (act.totalBudget || 0), 0);
  const completedCount = objective.activities.filter((act) => act.state === 'Completado').length;
  const inProgressCount = objective.activities.filter((act) => act.state === 'En Proceso').length;
  const pendingCount = objective.activities.filter((act) => act.state === 'Pendiente').length;

  const filteredActivities = objective.activities.filter((act) => {
    const matchesState = filterState === 'ALL' || act.state === filterState;
    const matchesSearch =
      act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.stage.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 shadow-2xs overflow-hidden">
      <div className="p-3.5 sm:p-4.5 border-b border-stone-100">
        <ObjectiveCardHeader
          objective={objective}
          completedCount={completedCount}
          totalObjectiveBudget={totalObjectiveBudget}
          onEditObjective={onEditObjective}
        />
        <ObjectiveFilterBar
          filterState={filterState}
          setFilterState={setFilterState}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalActivities={objective.activities.length}
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
        />
      </div>

      <ObjectiveActivitiesList
        activities={filteredActivities}
        objectiveNumber={objective.number}
        onUpdateActivity={onUpdateActivity}
        onDeleteActivity={onDeleteActivity}
        onOpenAddModal={onOpenAddModal}
      />
    </div>
  );
};
