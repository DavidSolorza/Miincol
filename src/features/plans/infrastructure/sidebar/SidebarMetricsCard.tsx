import React from 'react';
import type { PlanMetrics } from '../../domain/plan.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';

interface Props {
  metrics: PlanMetrics;
}

export const SidebarMetricsCard: React.FC<Props> = ({ metrics }) => (
  <div className="px-4 py-3 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-2 select-none transition-all duration-300 hover:shadow-xs overflow-hidden">
    <div className="flex items-center justify-between text-stone-900 font-['Outfit']">
      <span className="text-xs font-black uppercase tracking-wide text-stone-700">
        AVANCES DEL PILAR
      </span>
      <span className="text-base font-black tracking-tight text-[#8B251E]">
        {metrics.progressPercentage}%
      </span>
    </div>

    <div className="flex items-center justify-between text-stone-900 font-['Outfit']">
      <span className="text-xs font-black uppercase tracking-wider text-stone-500">
        PRESUPUESTO
      </span>
      <span className="text-sm font-black text-stone-900">
        {formatCurrencyCOP(metrics.totalBudget)}
      </span>
    </div>
  </div>
);

