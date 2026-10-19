import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  team: TeamSupervisionSummary;
  themeColor: string;
}

export const TeamCardMetrics: React.FC<Props> = ({
  team,
  themeColor,
}) => {
  return (
    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
          FASE PDM
        </span>
        <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-700">
          {formatCurrencyCOP(team.totalBudget)}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${team.progressPercentage}%`, backgroundColor: themeColor }}
          />
        </div>
        <span className="text-xs sm:text-[13px] font-black text-stone-700 shrink-0 font-['Outfit']">
          {team.progressPercentage}%
        </span>
      </div>
    </div>
  );
};
