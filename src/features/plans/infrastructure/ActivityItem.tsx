import React, { useState } from 'react';
import type { Activity, ActivityState } from '../domain/plan.types';
import { formatDate } from '../../../shared/utils/formatters';
import { User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { ActivityHeaderTags } from './activityItem/ActivityHeaderTags';
import { ActivityBudgetQuickEdit } from './activityItem/ActivityBudgetQuickEdit';
import { ActivityDetailsAccordion } from './activityItem/ActivityDetailsAccordion';

interface ActivityItemProps {
  activity: Activity;
  onUpdate: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDelete: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [unitBudgetInput, setUnitBudgetInput] = useState<number>(activity.unitBudget);
  const [timesPerYearInput, setTimesPerYearInput] = useState<number>(activity.timesPerYear);

  const handleSaveBudget = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(activity.id, {
      unitBudget: Number(unitBudgetInput) || 0,
      timesPerYear: Number(timesPerYearInput) || 1,
    });
    setIsEditingBudget(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 hover:border-stone-300 hover:shadow-xs transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-4.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <ActivityHeaderTags
            state={activity.state}
            stage={activity.stage}
            frequency={activity.frequency}
            onStateChange={(state: ActivityState) => onUpdate(activity.id, { state })}
          />
          <ActivityBudgetQuickEdit
            totalBudget={activity.totalBudget}
            unitBudget={activity.unitBudget}
            timesPerYear={activity.timesPerYear}
            isEditingBudget={isEditingBudget}
            setIsEditingBudget={setIsEditingBudget}
            unitBudgetInput={unitBudgetInput}
            setUnitBudgetInput={setUnitBudgetInput}
            timesPerYearInput={timesPerYearInput}
            setTimesPerYearInput={setTimesPerYearInput}
            onSaveBudget={handleSaveBudget}
            onDelete={() => onDelete(activity.id)}
            onEdit={onEdit ? () => onEdit(activity) : undefined}
          />
        </div>

        <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-snug font-['Outfit'] tracking-tight">
          {activity.description}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-bold text-stone-700 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/60 shadow-2xs">
              <User className="w-4 h-4 text-[#8B251E]" />
              {activity.responsible || 'Sin responsable asignado'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-500 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/60">
              <Calendar className="w-4 h-4 text-stone-400" />
              {formatDate(activity.startDate)} ➔ {formatDate(activity.endDate)}
            </span>
            <span className="inline-flex items-center text-[10px] font-black text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-lg border border-[#8B251E]/15">
              {activity.remainingWeeks} sem. rest.
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-bold text-[11px] transition cursor-pointer border border-stone-200/60 shadow-2xs"
          >
            <span>{isExpanded ? 'Ocultar diagnóstico' : 'Diagnóstico y metas'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <ActivityDetailsAccordion
          activity={activity}
          onEdit={onEdit ? () => onEdit(activity) : undefined}
        />
      )}
    </div>
  );
};
