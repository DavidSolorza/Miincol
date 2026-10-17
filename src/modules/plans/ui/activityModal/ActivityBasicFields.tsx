import React from 'react';
import type { ActivityState } from '../../domain/plan.types';
import { ActivityScheduleFields } from './ActivityScheduleFields';

interface Props {
  objectiveNumber: 1 | 2 | 3 | 4;
  setObjectiveNumber: (n: 1 | 2 | 3 | 4) => void;
  stage: string;
  setStage: (s: string) => void;
  state: ActivityState;
  setState: (s: ActivityState) => void;
  description: string;
  setDescription: (d: string) => void;
  responsible: string;
  setResponsible: (r: string) => void;
  frequency: string;
  setFrequency: (f: string) => void;
  timesPerYear: number;
  setTimesPerYear: (t: number) => void;
}

export const ActivityBasicFields: React.FC<Props> = ({
  objectiveNumber,
  setObjectiveNumber,
  stage,
  setStage,
  state,
  setState,
  description,
  setDescription,
  responsible,
  setResponsible,
  frequency,
  setFrequency,
  timesPerYear,
  setTimesPerYear,
}) => (
  <div className="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
    <div className="flex items-center gap-2 pb-1 border-b border-stone-200/60">
      <span className="w-6 h-6 rounded-lg bg-[#8B251E]/10 text-[#8B251E] flex items-center justify-center font-black text-xs font-['Outfit']">
        1
      </span>
      <h4 className="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
        Información Básica & Alcance
      </h4>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="font-bold text-stone-700 block mb-1 text-[11px]">Objetivo Destino</label>
        <select
          value={objectiveNumber}
          onChange={(e) => setObjectiveNumber(Number(e.target.value) as 1 | 2 | 3 | 4)}
          className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all font-medium text-xs text-stone-800"
        >
          <option value={1}>Obj #1 (Mapeo e Inv.)</option>
          <option value={2}>Obj #2 (Inmersión y Lengua)</option>
          <option value={3}>Obj #3 (Alianzas y Redes)</option>
          <option value={4}>Obj #4 (Planificación)</option>
        </select>
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1 text-[11px]">Etapa / Eje Operativo</label>
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="Ej. Diagnóstico Comunitario..."
          className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs font-medium text-stone-800"
          required
        />
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1 text-[11px]">Estado Actual</label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value as ActivityState)}
          className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all font-bold text-xs text-stone-800"
        >
          <option value="Pendiente">⏳ Pendiente</option>
          <option value="En Proceso">🔄 En Proceso</option>
          <option value="Completado">✅ Completado</option>
        </select>
      </div>
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">Descripción de la Actividad</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="¿Qué acción concreta se realizará en territorio con la comunidad?"
        rows={2}
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
        required
      />
    </div>

    <ActivityScheduleFields
      responsible={responsible}
      setResponsible={setResponsible}
      frequency={frequency}
      setFrequency={setFrequency}
      timesPerYear={timesPerYear}
      setTimesPerYear={setTimesPerYear}
    />
  </div>
);
