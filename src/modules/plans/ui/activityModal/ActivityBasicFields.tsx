import React from 'react';
import { ActivityScheduleFields } from './ActivityScheduleFields';

interface Props {
  objectiveNumber: 1 | 2 | 3 | 4;
  setObjectiveNumber: (n: 1 | 2 | 3 | 4) => void;
  stage: string;
  setStage: (s: string) => void;
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
  description,
  setDescription,
  responsible,
  setResponsible,
  frequency,
  setFrequency,
  timesPerYear,
  setTimesPerYear,
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="font-bold text-stone-700 block mb-1">Objetivo de Área Destino</label>
        <select
          value={objectiveNumber}
          onChange={(e) => setObjectiveNumber(Number(e.target.value) as 1 | 2 | 3 | 4)}
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium"
        >
          <option value={1}>Objetivo #1 (Mapeo e Investigación)</option>
          <option value={2}>Objetivo #2 (Inmersión y Lengua)</option>
          <option value={3}>Objetivo #3 (Alianzas y Redes)</option>
          <option value={4}>Objetivo #4 (Planificación y Sostenibilidad)</option>
        </select>
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1">Etapa / Eje Operativo</label>
        <input
          type="text"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          placeholder="Ej. Diagnóstico Comunitario, Salud, Traducción..."
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
          required
        />
      </div>
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1">Descripción de la Actividad</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="¿Qué acción concreta se realizará en territorio con la comunidad?"
        rows={2}
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
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
  </>
);
