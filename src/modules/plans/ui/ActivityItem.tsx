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
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onUpdate,
  onDelete,
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
    <div className="bg-white rounded-xl border border-stone-200/80 hover:border-stone-300 hover:shadow-2xs transition-all duration-200 overflow-hidden">
      <div className="p-3.5 sm:p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
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
          />
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug font-['Outfit']">
          {activity.description}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[11px] text-stone-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 font-medium text-stone-700">
              <User className="w-3 h-3 text-[#8B251E]" />
              {activity.responsible || 'Sin responsable asignado'}
            </span>
            <span className="flex items-center gap-1 text-stone-400">
              <Calendar className="w-3 h-3 text-stone-400" />
              {formatDate(activity.startDate)} ➔ {formatDate(activity.endDate)}
            </span>
            <span className="text-stone-400">• {activity.remainingWeeks} sem. rest.</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-[#8B251E] transition cursor-pointer"
          >
            <span>{isExpanded ? 'Ocultar diagnóstico' : 'Diagnóstico y metas'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && <ActivityDetailsAccordion activity={activity} />}
    </div>
  );
};
