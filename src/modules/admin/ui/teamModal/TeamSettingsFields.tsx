import React from 'react';
import type { CreateTeamDto } from '../../domain/admin.types';
import { Palette, Key, Eye, EyeOff, Check } from 'lucide-react';

const COLOR_PRESETS = [
  '#8B251E', '#E67324', '#10B981', '#2563EB', '#8B5CF6', '#D97706', '#0D9488', '#E11D48',
];

interface Props {
  formData: CreateTeamDto;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  onChange: (updates: Partial<CreateTeamDto>) => void;
}

export const TeamSettingsFields: React.FC<Props> = ({
  formData,
  showPassword,
  setShowPassword,
  onChange,
}) => {
  return (
    <div className="space-y-3 pt-2 border-t border-stone-100">
      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Parámetros Operativos</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Fase PDM Actual</label>
          <select
            value={formData.currentPhaseId}
            onChange={(e) => onChange({ currentPhaseId: e.target.value as any })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-stone-800 font-medium"
          >
            <option value="investigacion">1. Investigación</option>
            <option value="encarnacion">2. Encarnación</option>
            <option value="evangelizacion">3. Evangelización</option>
            <option value="entrenamiento">4. Entrenamiento</option>
            <option value="autocuidado">5. Autocuidado</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Presupuesto Anual (COP)</label>
          <input
            type="number"
            value={formData.totalBudget}
            onChange={(e) => onChange({ totalBudget: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-stone-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Color Identitario</span>
          </label>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ themeColor: color })}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xs"
                style={{ backgroundColor: color }}
              >
                {formData.themeColor === color && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1 flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>PIN de Acceso</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.accessPin || ''}
              onChange={(e) => onChange({ accessPin: e.target.value })}
              placeholder="ej. wayuu2026 (por defecto: [etnia]2026)"
              className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-stone-200 bg-stone-50 font-mono text-stone-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-stone-400 hover:text-stone-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
