import React from 'react';
import type { PlanMetrics } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  metrics: PlanMetrics;
}

export const SidebarMetricsCard: React.FC<Props> = ({ metrics }) => (
  <div className="p-2.5 rounded-2xl bg-white/85 hover:bg-white border border-stone-200/80 text-xs space-y-1.5 shadow-2xs transition">
    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-600 font-['Outfit']">
      <span>Avance de Pilar</span>
      <span className="text-[#8B251E] font-black">{metrics.progressPercentage}%</span>
    </div>

    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200/60">
      <div
        className="bg-gradient-to-r from-amber-400 to-[#10B981] h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
      />
    </div>
    <div className="flex items-center justify-between pt-0.5 text-[10px]">
      <span className="text-stone-500 font-medium">Presupuesto:</span>
      <span className="font-black text-stone-900 font-['Outfit']">
        {formatCurrencyCOP(metrics.totalBudget)}
      </span>
    </div>
  </div>
);

