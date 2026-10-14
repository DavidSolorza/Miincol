import React, { useState } from 'react';
import type { Activity, ActivityState } from '../domain/plan.types';
import { formatCurrencyCOP, formatDate } from '../../../shared/utils/formatters';
import {
  ChevronDown,
  ChevronUp,
  User,
  AlertTriangle,
  Target,
  FileText,
  Trash2,
  Calendar,
  Layers,
  Edit3,
  Check,
} from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
  onUpdate: (activityId: string, updatedFields: Partial<Activity>) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [unitBudgetInput, setUnitBudgetInput] = useState<number>(activity.unitBudget);
  const [timesPerYearInput, setTimesPerYearInput] = useState<number>(activity.timesPerYear);

  const stateStyles: Record<ActivityState, { selectBg: string; text: string; dot: string }> = {
    Pendiente: {
      selectBg: 'bg-amber-50 text-amber-900 border-amber-200',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
    },
    'En Proceso': {
      selectBg: 'bg-orange-50 text-[#8B251E] border-orange-200',
      text: 'text-[#8B251E]',
      dot: 'bg-[#E67324]',
    },
    Completado: {
      selectBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
    },
  };

  const handleSaveBudget = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(activity.id, {
      unitBudget: Number(unitBudgetInput) || 0,
      timesPerYear: Number(timesPerYearInput) || 1,
    });
    setIsEditingBudget(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 hover:shadow-xs transition-all duration-200 overflow-hidden">
      {/* Cabecera y Contenido Principal de la Actividad */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Fila 1: Tags Superiores (Etapa, Frecuencia, Presupuesto y Estado) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Estado interactivo con select limpio */}
            <div className="relative">
              <select
                value={activity.state}
                onChange={(e) => onUpdate(activity.id, { state: e.target.value as ActivityState })}
                className={`text-xs font-bold py-1 pl-3 pr-6 rounded-full border transition cursor-pointer appearance-none ${
                  stateStyles[activity.state].selectBg
                }`}
              >
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="En Proceso">🔄 En Proceso</option>
                <option value="Completado">✅ Completado</option>
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Etapa */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
              <Layers className="w-3 h-3 text-[#E67324]" />
              {activity.stage || 'General'}
            </span>

            {/* Frecuencia */}
            <span className="text-[11px] font-medium text-stone-500">
              • {activity.frequency}
            </span>
          </div>

          {/* Presupuesto Total Anual y Acciones Rápidas */}
          <div className="flex items-center gap-3">
            {isEditingBudget ? (
              <div
                className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[10px] text-stone-400 font-bold">$</span>
                  <input
                    type="number"
                    value={unitBudgetInput}
                    onChange={(e) => setUnitBudgetInput(Number(e.target.value))}
                    className="w-20 p-1 text-xs border rounded bg-white text-stone-800 font-semibold"
                    title="Valor unitario"
                  />
                  <span className="text-[10px] text-stone-400">×</span>
                  <input
                    type="number"
                    value={timesPerYearInput}
                    onChange={(e) => setTimesPerYearInput(Number(e.target.value))}
                    className="w-10 p-1 text-xs border rounded bg-white text-stone-800 font-semibold"
                    min="1"
                    title="Veces al año"
                  />
                </div>
                <button
                  onClick={handleSaveBudget}
                  className="p-1 rounded-md bg-[#8B251E] text-white hover:bg-[#731E18] text-xs transition cursor-pointer"
                  title="Guardar"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#8B251E] font-['Outfit'] block leading-none">
                    {formatCurrencyCOP(activity.totalBudget)}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    ({formatCurrencyCOP(activity.unitBudget)} × {activity.timesPerYear}/año)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingBudget(true);
                  }}
                  className="p-1 rounded-md text-stone-400 hover:text-[#8B251E] hover:bg-stone-100 transition cursor-pointer"
                  title="Modificar presupuesto rápido"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Desea eliminar esta actividad del plan?')) {
                  onDelete(activity.id);
                }
              }}
              className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Eliminar actividad"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fila 2: Título Principal de la Acción */}
        <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug font-['Outfit'] pt-0.5">
          {activity.description}
        </h3>

        {/* Fila 3: Metadatos Despejados (Responsable, Fechas y Botón de Detalle) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs text-stone-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-stone-700">
              <User className="w-3.5 h-3.5 text-[#8B251E]" />
              {activity.responsible || 'Sin responsable asignado'}
            </span>

            <span className="flex items-center gap-1.5 text-stone-500">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {formatDate(activity.startDate)} ➔ {formatDate(activity.endDate)}
            </span>

            <span className="text-stone-400">
              {activity.remainingWeeks} semanas rest.
            </span>
          </div>

          {/* Toggle de detalles con texto amigable */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-[#8B251E] transition py-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Ocultar diagnóstico' : 'Ver metas y diagnóstico'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Acordeón Expandible de Detalles Completos */}
      {isExpanded && (
        <div className="px-5 py-4 bg-[#FAF7F2]/80 border-t border-stone-200/60 text-xs text-stone-700 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Situación Actual */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#8B251E]" />
                <span>Situación Actual (Diagnóstico)</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {activity.currentSituation || 'Sin diagnóstico registrado.'}
              </p>
            </div>

            {/* Metas a Mediano Plazo */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                <Target className="w-3.5 h-3.5 text-[#E67324]" />
                <span>Meta a Mediano Plazo (1 Año)</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {activity.mediumTermGoal || 'Meta no especificada.'}
              </p>
            </div>

            {/* Metas a Largo Plazo */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/70 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-700" />
                <span>Meta a Largo Plazo (3 - 5 Años)</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {activity.longTermGoal || 'Visión a largo plazo sin definir.'}
              </p>
            </div>
          </div>

          {/* Dificultades / Obstáculos */}
          {activity.obstacles && (
            <div className="flex items-start gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900 block">
                  Dificultades y Contingencias Territoriales:
                </span>
                <p className="text-amber-950 mt-0.5 leading-relaxed">{activity.obstacles}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
