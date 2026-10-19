import React from 'react';
import type { TeamSupervisionSummary } from '../../../admin/domain/admin.types';
import { Compass, User, ArrowRight } from 'lucide-react';
import { PasswordInputField } from './PasswordInputField';

interface Props {
  activeTab: 'admin' | 'team';
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loading: boolean;
  allTeams: TeamSupervisionSummary[];
  onTeamSelect: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginFormFields: React.FC<Props> = ({
  activeTab,
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  allTeams,
  onTeamSelect,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2.5 sm:space-y-3">
      {activeTab === 'team' ? (
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Misión o Pueblo Indígena</label>
          <div className="relative">
            <select
              value={identifier}
              onChange={(e) => onTeamSelect(e.target.value)}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 font-medium transition cursor-pointer appearance-none"
            >
              {allTeams.map((t) => (
                <option key={t.id} value={t.slug || t.id}>{t.name} — {t.ethnicity}</option>
              ))}
            </select>
            <Compass className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1">Usuario Administrador</label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 text-stone-900 transition font-medium"
              required
            />
            <User className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      )}

      <PasswordInputField
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#18181b] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-1"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Verificando credenciales...</span>
          </>
        ) : (
          <>
            <span>Ingresar al Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
