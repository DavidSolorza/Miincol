import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  team: TeamSupervisionSummary;
  lastLoginTime?: string;
  onOpenAudit: () => void;
}

const formatCompactCOP = (amount: number): string => {
  if (amount >= 1_000_000) return `$ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$ ${(amount / 1_000).toFixed(0)}k`;
  return `$ ${amount}`;
};

export const TeamCardBottomMetrics: React.FC<Props> = ({
  team,
  lastLoginTime,
  onOpenAudit,
}) => {
  const executed = team.totalBudget * (team.progressPercentage / 100);
  const targetBudget = executed > 0 ? executed : team.totalBudget;
  const formattedBudget = formatCompactCOP(targetBudget);
  const displayTime = lastLoginTime ? lastLoginTime.replace('Hoy, ', '') : (team.lastUpdate || '09:00');

  return (
    <div className="grid grid-cols-3 gap-1.5 pt-2 mt-1 border-t border-stone-100/90 text-left">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Budget
        </div>
        <div className="font-extrabold text-stone-900 text-xs sm:text-[13px] font-mono truncate mt-0.5" title={formatCurrencyCOP(targetBudget)}>
          {formattedBudget}
        </div>
      </div>

      <div className="min-w-0" onClick={onOpenAudit} title="Ver bitácora de actividad">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Last Access
        </div>
        <div className="font-bold text-stone-800 text-xs sm:text-[13px] truncate mt-0.5 hover:text-[#E67324] cursor-pointer transition">
          {displayTime}
        </div>
      </div>

      <div className="min-w-0 flex flex-col items-start">
        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Critical Alerts
        </div>
        <div className="mt-0.5 flex items-center gap-1">
          {team.criticalAlert ? (
            <div className="inline-flex items-center gap-1 text-rose-600 font-black text-xs" title={team.criticalAlert.message}>
              <AlertTriangle className="w-3.5 h-3.5 fill-rose-50 text-rose-600 shrink-0" />
              <span>1</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
