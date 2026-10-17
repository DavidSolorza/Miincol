import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import type { PhaseType } from '../../../plans/domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

const PHASES_LIST: { id: PhaseType; name: string }[] = [
  { id: 'investigacion', name: '1. Investigación' },
  { id: 'encarnacion', name: '2. Encarnación' },
  { id: 'evangelizacion', name: '3. Evangelización' },
  { id: 'entrenamiento', name: '4. Entrenamiento' },
  { id: 'autocuidado', name: '5. Autocuidado' },
];

interface Props {
  team: TeamSupervisionSummary;
  selectedPhaseId?: PhaseType;
  themeColor: string;
}

export const TeamCardMetrics: React.FC<Props> = ({
  team,
  selectedPhaseId,
  themeColor,
}) => {
  const currentPhase = PHASES_LIST.find((p) => p.id === (selectedPhaseId || team.currentPhaseId));
  const phaseLabel = currentPhase ? currentPhase.name.toUpperCase() : 'FASE PDM';

  return (
    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-left">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
          {phaseLabel}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-stone-700">
          {formatCurrencyCOP(team.totalBudget)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${team.progressPercentage}%`, backgroundColor: themeColor }}
          />
        </div>
        <span className="text-xs font-black text-stone-700 shrink-0 font-['Outfit']">
          {team.progressPercentage}%
        </span>
      </div>
    </div>
  );
};
