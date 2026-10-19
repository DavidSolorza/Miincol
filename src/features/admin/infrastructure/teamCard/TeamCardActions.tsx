import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import { AlertTriangle, Clock, MessageCircle, ArrowRight } from 'lucide-react';

interface Props {
  team: TeamSupervisionSummary;
  onInspect: () => void;
  whatsappUrl: string;
}

export const TeamCardActions: React.FC<Props> = ({ team, onInspect, whatsappUrl }) => {
  return (
    <div className="space-y-2 pt-2 border-t border-stone-100">
      {team.criticalAlert && (
        <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-bold mr-1">[{team.criticalAlert.type}]</span>
            <span className="line-clamp-2 leading-tight">{team.criticalAlert.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-stone-400 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          <span>{team.lastUpdate}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1 text-[11px] font-bold border border-emerald-200/60"
              title="Contactar al líder por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={onInspect}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer group-hover:bg-[#8B251E]"
          >
            <span>Supervisar Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
