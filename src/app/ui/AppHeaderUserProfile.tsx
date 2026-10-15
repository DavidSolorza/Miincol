import React from 'react';
import { User, LogOut } from 'lucide-react';
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
  <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
    <div
      className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] shadow-2xs shrink-0"
      style={{ backgroundColor: themeColor }}
    >
      <User className="w-3 h-3" />
    </div>
    <div className="hidden md:flex flex-col text-left text-xs">
      <span className="font-bold text-stone-800 leading-none">{session.userName}</span>
      <span className="text-[9px] text-stone-400 mt-0.5">
        {isSuperAdmin ? 'Super Administrador' : `Misión ${activeTeam.ethnicity}`}
      </span>
    </div>

    <button
      onClick={onLogout}
      className="p-1 ml-0.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
      title="Cerrar Sesión"
    >
      <LogOut className="w-3.5 h-3.5" />
    </button>
  </div>
);
