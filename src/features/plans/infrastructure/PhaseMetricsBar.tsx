import React from 'react';
import type { PlanMetrics } from '../domain/plan.types';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import { Coins, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';

interface PhaseMetricsBarProps {
  metrics: PlanMetrics;
  phaseName: string;
}

export const PhaseMetricsBar: React.FC<PhaseMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-2xl px-5 py-3.5 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-y-3 gap-x-6">
      {/* 1. Presupuesto */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#8B251E]/8 text-[#8B251E] flex items-center justify-center shrink-0">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Presupuesto Fase
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 font-['Outfit']">
            {formatCurrencyCOP(metrics.totalBudget)}
          </span>
        </div>
      </div>

      <div className="hidden sm:block h-7 w-px bg-stone-200" />

      {/* 2. Avance con barra delgada */}
      <div className="flex items-center gap-3 min-w-[180px] sm:min-w-[220px]">
        <div className="w-9 h-9 rounded-lg bg-[#E67324]/10 text-[#D05E12] flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">
              Avance General
            </span>
            <span className="text-[#8B251E] font-['Outfit']">{metrics.progressPercentage}%</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, metrics.progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block h-7 w-px bg-stone-200" />

      {/* 3. Desglose de estados en chips suaves */}
      <div className="flex items-center gap-2 text-xs">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200/50">
            {metrics.completedActivities} listas
          </span>
          <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#8B251E] font-bold text-[11px] border border-orange-200/50">
            {metrics.inProgressActivities} en curso
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200/50">
            {metrics.pendingActivities} pendientes
          </span>
        </div>
      </div>

      <div className="hidden lg:block h-7 w-px bg-stone-200" />

      {/* 4. Tiempo estimado */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Tiempo
          </span>
          <span className="text-xs sm:text-sm font-bold text-stone-800 font-['Outfit']">
            {metrics.totalRemainingWeeks} <span className="text-stone-400 font-normal text-xs">semanas rest.</span>
          </span>
        </div>
      </div>
    </div>
  );
};
