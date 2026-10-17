import React from 'react';
import type { PlanMetrics } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  metrics: PlanMetrics;
}

export const SidebarMetricsCard: React.FC<Props> = ({ metrics }) => (
  <div className="p-2.5 rounded-2xl bg-black/15 border border-white/10 text-white text-xs space-y-1.5">
    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/70 font-['Outfit']">
      <span>Avance de Fase</span>
      <span className="text-white font-black">{metrics.progressPercentage}%</span>
    </div>
    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
      <div
        className="bg-gradient-to-r from-amber-300 to-[#10B981] h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
      />
    </div>
    <div className="flex items-center justify-between pt-0.5 text-[10px]">
      <span className="text-white/60 font-medium">Presupuesto:</span>
      <span className="font-black text-white font-['Outfit']">
        {formatCurrencyCOP(metrics.totalBudget)}
      </span>
    </div>
  </div>
);
