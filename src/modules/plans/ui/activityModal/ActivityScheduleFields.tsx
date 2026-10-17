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
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">Responsable Principal</label>
      <input
        type="text"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
        placeholder="Ej. Pr. David Morales"
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
        required
      />
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">Frecuencia</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs font-medium text-stone-800"
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
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">Repeticiones / Año</label>
      <input
        type="number"
        value={timesPerYear}
        onChange={(e) => setTimesPerYear(Number(e.target.value))}
        min="1"
        max="365"
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs font-bold text-stone-800"
        required
      />
    </div>
  </div>
);
