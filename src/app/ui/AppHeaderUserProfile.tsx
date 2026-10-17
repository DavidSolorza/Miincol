import React from 'react';
import { User, LogOut, Shield } from 'lucide-react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';

interface Props {
  themeColor: string;
  session: AuthSession;
  isSuperAdmin: boolean;
  activeTeam: MissionaryTeam;
  onLogout: () => void;
}

export const AppHeaderUserProfile: React.FC<Props> = ({
  themeColor,
  session,
  isSuperAdmin,
  activeTeam,
  onLogout,
}) => (
  <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-4 border-l border-stone-200/90">
    {/* Executive Profile Card */}
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div
          className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-stone-200/80 shrink-0"
          style={{
            background: isSuperAdmin
              ? 'linear-gradient(135deg, #8B251E 0%, #E67324 100%)'
              : themeColor,
          }}
        >
          {isSuperAdmin ? (
            <Shield className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"
          title="Sesión activa"
        />
      </div>

      <div className="hidden md:flex flex-col text-left">
        <span className="font-bold text-stone-900 leading-tight text-xs sm:text-sm font-['Outfit'] tracking-tight">
          {session.userName}
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
              isSuperAdmin
                ? 'bg-[#8B251E]/10 text-[#8B251E]'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {isSuperAdmin ? 'Super Administrador' : `Misión ${activeTeam.ethnicity}`}
          </span>
        </div>
      </div>
    </div>

    {/* Ultra-Professional & Striking Logout Button */}
    <button
      type="button"
      onClick={onLogout}
      className="group relative flex items-center gap-2 pl-2 pr-3.5 sm:pr-4 py-1.5 rounded-xl bg-rose-50/90 hover:bg-rose-100/90 text-rose-700 border border-rose-200/90 hover:border-rose-300 shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
      title="Cerrar sesión del sistema"
      aria-label="Cerrar sesión"
    >
      <div className="w-7 h-7 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:shadow-rose-600/30">
        <LogOut className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </div>
      <span className="font-['Outfit'] font-bold text-xs tracking-wide hidden sm:inline">
        Cerrar Sesión
      </span>
      <span className="font-['Outfit'] font-bold text-xs tracking-wide sm:hidden">
        Salir
      </span>
    </button>
  </div>
);
