import React from 'react';
import type { PlanMetrics } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  metrics: PlanMetrics;
}

export const SidebarMetricsCard: React.FC<Props> = ({ metrics }) => (
  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-stone-200/60 text-xs space-y-1">
    <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-stone-400">
      <span>Avance de Fase</span>
      <span className="text-[#8B251E] font-black">{metrics.progressPercentage}%</span>
    </div>
    <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
      <div
        className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
      />
    </div>
    <div className="flex items-center justify-between pt-0.5 text-[9px]">
      <span className="text-stone-400 font-medium">Presupuesto:</span>
      <span className="font-black text-stone-900 font-['Outfit']">
        {formatCurrencyCOP(metrics.totalBudget)}
      </span>
    </div>
  </div>
);
