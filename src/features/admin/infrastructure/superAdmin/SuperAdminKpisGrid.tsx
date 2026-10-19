import React from 'react';
import type { NationalKpis } from '../../domain/admin.types';
import { formatCurrencyCOP } from '../../../../shared/utils/formatters';
import { Compass, Coins, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  kpis: NationalKpis;
}

export const SuperAdminKpisGrid: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      <div className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between text-stone-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Misiones Activas</span>
          <Compass className="w-3.5 h-3.5 text-[#8B251E]" />
        </div>
        <div className="text-xl font-black text-stone-900 font-['Outfit']">{kpis.totalTeams}</div>
        <div className="text-[10px] text-stone-400 mt-0.5">{kpis.totalMissionaries} misioneros desplegados</div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between text-stone-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Presupuesto Nal.</span>
          <Coins className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="text-xl font-black text-stone-900 font-mono font-['Outfit'] truncate">
          {formatCurrencyCOP(kpis.totalNationalBudget)}
        </div>
        <div className="text-[10px] text-stone-400 mt-0.5">Ejecutado: {formatCurrencyCOP(kpis.totalExecutedBudget)}</div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between text-stone-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Avance Promedio</span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-xl font-black text-emerald-700 font-['Outfit']">{kpis.nationalAverageProgress}%</div>
        <div className="text-[10px] text-stone-400 mt-0.5">
          {kpis.completedActivities} de {kpis.totalActivities} actividades listas
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
        <div className="flex items-center justify-between text-stone-400 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Alertas Críticas</span>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className={`text-xl font-black font-['Outfit'] ${kpis.activeCriticalAlerts > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
          {kpis.activeCriticalAlerts}
        </div>
        <div className="text-[10px] text-stone-400 mt-0.5">
          {kpis.activeCriticalAlerts > 0 ? 'Requieren intervención' : 'Territorios estables'}
        </div>
      </div>
    </div>
  );
};
