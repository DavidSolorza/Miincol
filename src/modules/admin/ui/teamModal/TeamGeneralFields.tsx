import React from 'react';
import type { CreateTeamDto } from '../../domain/admin.types';
import { COLOMBIA_DEPARTMENTS, normalizeText } from '../map/colombiaLocations';

interface Props {
  formData: CreateTeamDto;
  onChange: (updates: Partial<CreateTeamDto>) => void;
}

export const TeamGeneralFields: React.FC<Props> = ({ formData, onChange }) => {
  // Encontrar el departamento normalizado
  const currentDept = COLOMBIA_DEPARTMENTS.find(
    (d) =>
      normalizeText(d.name) === normalizeText(formData.department) ||
      normalizeText(formData.department).includes(normalizeText(d.name))
  );

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Identidad Territorial</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Nombre de la Misión *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="ej. Misión Pastos - Cumbal"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Pueblo Indígena / Etnia *</label>
          <input
            type="text"
            value={formData.ethnicity}
            onChange={(e) => onChange({ ethnicity: e.target.value })}
            placeholder="ej. Pastos, Wayuu, Nasa, Emberá"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">
            Municipio / Territorio Local *
          </label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => onChange({ region: e.target.value })}
            placeholder="ej. Cumbal, Uribia, Pueblo Rico, Toribío"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-medium"
            required
          />
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Lugar para georreferenciación exacta en el mapa.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Departamento de Colombia *</label>
          <select
            value={currentDept?.name || formData.department || 'Nariño'}
            onChange={(e) => onChange({ department: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800 font-bold"
            required
          >
            <option value="">Seleccione Departamento</option>
            {COLOMBIA_DEPARTMENTS.slice().sort((a, b) => a.name.localeCompare(b.name)).map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Subrayará y demarcará este departamento en el mapa.
          </span>
        </div>
      </div>
    </div>
  );
};
