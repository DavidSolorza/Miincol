import React from 'react';
import type { Activity } from '../../domain/plan.types';
import { FileText, Target, AlertTriangle, Edit3 } from 'lucide-react';

interface Props {
  activity: Activity;
  onEdit?: () => void;
}

export const ActivityDetailsAccordion: React.FC<Props> = ({ activity, onEdit }) => (
  <div className="px-5 py-4 bg-[#FAF7F2]/80 border-t border-stone-200/60 text-xs text-stone-700 space-y-3 animate-fadeIn">
    <div className={`grid grid-cols-1 gap-3 ${activity.shortTermGoal ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
          <FileText className="w-4 h-4 text-[#8B251E]" />
          <span>Situación Actual (Diagnóstico)</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          {activity.currentSituation || 'Sin diagnóstico registrado.'}
        </p>
      </div>

      {activity.shortTermGoal && (
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
            <Target className="w-4 h-4 text-amber-600" />
            <span>Meta Corto Plazo (3-6m)</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            {activity.shortTermGoal}
          </p>
        </div>
      )}

      <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
          <Target className="w-4 h-4 text-[#E67324]" />
          <span>Meta a Mediano Plazo (1 Año)</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          {activity.mediumTermGoal || 'Meta no especificada.'}
        </p>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
          <Target className="w-4 h-4 text-emerald-700" />
          <span>Meta a Largo Plazo (3 - 5 Años)</span>
        </div>
        <p className="text-stone-600 leading-relaxed">
          {activity.longTermGoal || 'Visión a largo plazo sin definir.'}
        </p>
      </div>
    </div>


    {activity.obstacles && (
      <div className="flex items-start gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900 block">
            Dificultades y Contingencias Territoriales:
          </span>
          <p className="text-amber-950 mt-0.5 leading-relaxed">{activity.obstacles}</p>
        </div>
      </div>
    )}

    {onEdit && (
      <div className="flex justify-end pt-1">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 font-bold text-xs border border-stone-200/80 shadow-2xs transition cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#8B251E]" />
          <span>Editar Toda la Actividad</span>
        </button>
      </div>
    )}
  </div>
);
