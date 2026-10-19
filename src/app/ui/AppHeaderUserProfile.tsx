import React from 'react';
import { User, LogOut, Shield } from 'lucide-react';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';
import type { AuthSession } from '../auth/appSession.types';
import { useToast } from '../../shared/components/Toast';

interface Props {
  session: AuthSession;
  isSuperAdmin: boolean;
  activeTeam: MissionaryTeam;
  onLogout: () => void;
}

export const AppHeaderUserProfile: React.FC<Props> = ({
  session,
  isSuperAdmin,
  activeTeam,
  onLogout,
}) => {
  const { confirmAction } = useToast();

  const handleLogoutClick = () => {
    confirmAction({
      title: '¿Cerrar Sesión del Sistema?',
      message: '¿Estás seguro de que deseas salir de tu sesión actual en MISINCOL?',
      confirmLabel: 'Sí, Salir',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: onLogout,
    });
  };

  const displayName = isSuperAdmin ? session.userName : (activeTeam.name || session.userName);

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-stone-200/90">
      {/* Executive Profile Info */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-stone-200/80 shrink-0 bg-gradient-to-br from-[#8B251E] to-[#E67324]">
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

        <span className="hidden sm:inline font-bold text-stone-900 leading-tight text-xs sm:text-sm font-['Outfit'] tracking-tight">
          {displayName}
        </span>
      </div>

      {/* Minimalist Logout Icon Button */}
      <button
        type="button"
        onClick={handleLogoutClick}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 border border-stone-200/80 hover:border-rose-200 shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
        title="Cerrar sesión del sistema"
        aria-label="Cerrar sesión"
      >
        <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </button>
    </div>
  );
};
