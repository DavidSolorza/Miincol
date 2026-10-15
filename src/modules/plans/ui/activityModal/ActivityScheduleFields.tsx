import React from 'react';

interface Props {
  responsible: string;
  setResponsible: (r: string) => void;
  frequency: string;
  setFrequency: (f: string) => void;
  timesPerYear: number;
  setTimesPerYear: (t: number) => void;
}

export const ActivityScheduleFields: React.FC<Props> = ({
  responsible,
  setResponsible,
  frequency,
  setFrequency,
  timesPerYear,
  setTimesPerYear,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div>
      <label className="font-bold text-stone-700 block mb-1">Responsable Principal</label>
      <input
        type="text"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
        placeholder="Ej. Pr. David Morales"
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
        required
      />
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1">Frecuencia</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium"
      >
        <option value="Semanal">Semanal</option>
        <option value="Quincenal">Quincenal</option>
        <option value="Mensual">Mensual</option>
        <option value="Bimensual">Bimensual</option>
        <option value="Trimestral">Trimestral</option>
        <option value="Semestral">Semestral</option>
        <option value="Anual">Anual</option>
        <option value="Única vez">Única vez</option>
      </select>
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1">Repeticiones / Año</label>
      <input
        type="number"
        value={timesPerYear}
        onChange={(e) => setTimesPerYear(Number(e.target.value))}
        min="1"
        max="365"
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-semibold"
        required
      />
    </div>
  </div>
);
