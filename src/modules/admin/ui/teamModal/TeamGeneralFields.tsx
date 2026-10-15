import React from 'react';
import type { CreateTeamDto } from '../../domain/admin.types';

interface Props {
  formData: CreateTeamDto;
  onChange: (updates: Partial<CreateTeamDto>) => void;
}

export const TeamGeneralFields: React.FC<Props> = ({ formData, onChange }) => {
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
            placeholder="ej. Misión Wayuu - Alta Guajira"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Pueblo Indígena / Etnia *</label>
          <input
            type="text"
            value={formData.ethnicity}
            onChange={(e) => onChange({ ethnicity: e.target.value })}
            placeholder="ej. Wayuu, Nasa, Emberá"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Región / Territorio *</label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => onChange({ region: e.target.value })}
            placeholder="ej. Uribia, Manaure y Nazaret"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Departamento *</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="ej. La Guajira (Caribe)"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
      </div>
    </div>
  );
};
