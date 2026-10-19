import React from 'react';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { LogOut, Users } from 'lucide-react';
import { useToast } from '../../../../shared/components/Toast';

interface Props {
  activeTeam: MissionaryTeam;
  isCollapsed: boolean;
  onLogout?: () => void;
}

export const SidebarUserProfileCard: React.FC<Props> = ({
  activeTeam,
  isCollapsed,
  onLogout,
}) => {
  const { confirmAction } = useToast();

  const handleLogoutClick = () => {
    if (!onLogout) return;
    confirmAction({
      title: '¿Cerrar Sesión Territorial?',
      message: `¿Estás seguro de que deseas salir de la sesión de ${activeTeam.leader}?`,
      confirmLabel: 'Sí, Salir',
      cancelLabel: 'Cancelar',
      type: 'warning',
      onConfirm: onLogout,
    });
  };

  if (isCollapsed) {
    return (
      <div className="p-2 flex justify-center">
        <button
          onClick={handleLogoutClick}
          title={`${activeTeam.leader} • Click para cerrar sesión`}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-[#D95B14] to-[#C0420E] hover:opacity-90 text-white font-black text-xs flex items-center justify-center transition-opacity shadow-xs cursor-pointer"
        >
          <Users className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-2.5 sm:p-3 pt-1 select-none">
      <div
        className="rounded-3xl p-2.5 px-3.5 flex items-center justify-between text-stone-900 shadow-sm hover:shadow-md transition-all duration-200 ease-out group overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-white text-stone-900 border border-stone-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-4 h-4 text-stone-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate leading-tight font-['Outfit'] text-stone-950">
              {activeTeam.leader}
            </p>
            <p className="text-[10px] text-stone-900 font-bold truncate leading-tight mt-0.5 font-['Outfit']">
              {activeTeam.ethnicity || activeTeam.name}
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={handleLogoutClick}
            title="Cerrar sesión"
            className="text-white hover:text-amber-200 p-1.5 rounded-xl transition-colors duration-200 cursor-pointer shrink-0 drop-shadow-xs"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
