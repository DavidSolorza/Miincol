import React from 'react';
import type { Activity } from '../../domain/plan.types';
import { Layers, Plus } from 'lucide-react';
import { ActivityItem } from '../ActivityItem';

interface Props {
  activities: Activity[];
  objectiveNumber: 1 | 2 | 3 | 4;
  onUpdateActivity: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDeleteActivity: (activityId: string) => void;
  onOpenAddModal: (objectiveNumber: 1 | 2 | 3 | 4) => void;
  onEditActivity?: (activity: Activity) => void;
}

export const ObjectiveActivitiesList: React.FC<Props> = ({
  activities,
  objectiveNumber,
  onUpdateActivity,
  onDeleteActivity,
  onOpenAddModal,
  onEditActivity,
}) => {
  return (
    <div className="p-5 sm:p-6 space-y-3 bg-[#FAF7F2]/40 min-h-[160px]">
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-200 p-8 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#E67324] mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-stone-700">No hay actividades visibles</h4>
          <p className="text-xs text-stone-400 max-w-xs mt-0.5">
            No coinciden con el filtro actual o aún no se han registrado en este objetivo.
          </p>
          <button
            onClick={() => onOpenAddModal(objectiveNumber)}
            className="mt-3 text-xs font-bold text-[#8B251E] hover:text-[#731E18] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Registrar primera actividad
          </button>
        </div>
      ) : (
        activities.map((act) => (
          <ActivityItem
            key={act.id}
            activity={act}
            onUpdate={onUpdateActivity}
            onDelete={onDeleteActivity}
            onEdit={onEditActivity}
          />
        ))
      )}
    </div>
  );
};
