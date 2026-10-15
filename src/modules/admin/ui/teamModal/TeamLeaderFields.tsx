import React from 'react';
import type { CreateTeamDto } from '../../domain/admin.types';

interface Props {
  formData: CreateTeamDto;
  membersInput: string;
  setMembersInput: (val: string) => void;
  onChange: (updates: Partial<CreateTeamDto>) => void;
}

export const TeamLeaderFields: React.FC<Props> = ({
  formData,
  membersInput,
  setMembersInput,
  onChange,
}) => {
  return (
    <div className="space-y-3 pt-2 border-t border-stone-100">
      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Liderazgo y Obreros</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Pastor / Líder Ministerial *</label>
          <input
            type="text"
            value={formData.leader}
            onChange={(e) => onChange({ leader: e.target.value })}
            placeholder="ej. Pr. David Morales"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Teléfono Móvil (WhatsApp) *</label>
          <input
            type="text"
            value={formData.leaderPhone}
            onChange={(e) => onChange({ leaderPhone: e.target.value })}
            placeholder="+57 312 458 9201"
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-stone-600 mb-1">
          Obreros y Miembros del Equipo <span className="text-stone-400 font-normal">(separados por comas)</span>
        </label>
        <input
          type="text"
          value={membersInput}
          onChange={(e) => {
            setMembersInput(e.target.value);
            const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
            onChange({ members: list });
          }}
          placeholder="David Morales, Carlos Pushaina, Ruth Mendoza"
          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:border-[#8B251E] text-stone-800"
        />
      </div>
    </div>
  );
};
