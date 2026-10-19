import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
}

export const PasswordInputField: React.FC<Props> = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
}) => (
  <div>
    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Contraseña de Acceso</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••••"
        className="w-full px-4 py-3 pr-11 rounded-xl text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 font-mono transition"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="p-1 text-stone-400 hover:text-stone-700 transition absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);
