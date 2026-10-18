import React from 'react';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';
import { LogOut } from 'lucide-react';

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
  const leaderInitial = activeTeam.leader?.charAt(0) || 'M';

  if (isCollapsed) {
    return (
      <div className="p-2 flex justify-center">
        <button
          onClick={onLogout}
          title={`${activeTeam.leader} • Click para cerrar sesión`}
          className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 border border-stone-200/80 text-[#8B251E] font-black text-xs flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
        >
          {leaderInitial}
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-2.5">
      <div className="bg-white/90 hover:bg-white border border-stone-200/90 p-2 rounded-2xl flex items-center justify-between text-stone-900 transition shadow-2xs group">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B251E] to-[#E67324] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
            {leaderInitial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black truncate leading-tight font-['Outfit'] text-stone-900">
              {activeTeam.leader}
            </p>
            <p className="text-[10px] text-stone-500 truncate leading-tight mt-0.5">
              {activeTeam.ethnicity || activeTeam.name}
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="text-stone-400 hover:text-[#8B251E] hover:bg-stone-100 p-1.5 rounded-xl transition cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

};
