import React from 'react';
import type { TeamTelemetrySummary } from '../domain/audit.types';
import { Clock, Activity, History, ArrowUpRight } from 'lucide-react';

interface Props {
  telemetry: TeamTelemetrySummary;
  onOpenAuditModal: () => void;
}

export const TeamCardTelemetry: React.FC<Props> = ({ telemetry, onOpenAuditModal }) => {
  return (
    <div className="bg-stone-50/90 rounded-lg p-2.5 border border-stone-200/70 space-y-1.5 transition-colors hover:border-stone-300">
      <div className="flex items-center justify-between gap-1 text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2 w-2">
            {telemetry.isRecentLogin && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                telemetry.isRecentLogin ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            />
          </span>
          <span className="text-stone-500 font-medium truncate flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400 shrink-0" />
            <span>Último ingreso:</span>
          </span>
          <span className="font-bold text-stone-800 truncate">{telemetry.lastLoginFormatted}</span>
        </div>

        <button
          type="button"
          onClick={onOpenAuditModal}
          className="text-[10px] font-extrabold text-[#8B251E] hover:text-[#731E18] bg-white hover:bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded shadow-2xs transition flex items-center gap-0.5 shrink-0 cursor-pointer"
          title="Ver bitácora detallada de cambios del equipo"
        >
          <History className="w-2.5 h-2.5" />
          <span>Bitácora</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] pt-1 border-t border-stone-200/50">
        <Activity className="w-3 h-3 text-[#E67324] shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold text-stone-800 truncate leading-tight">
              {telemetry.lastActionTitle}
            </span>
            <span className="text-[10px] text-stone-400 shrink-0">{telemetry.lastActionAt}</span>
          </div>
          <p className="text-[10px] text-stone-500 truncate leading-tight mt-0.5">
            {telemetry.lastActionDetail}
          </p>
        </div>
      </div>
    </div>
  );
};
