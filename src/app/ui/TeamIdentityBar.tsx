import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { MissionaryTeam } from '../../modules/auth/domain/auth.types';

interface Props {
  activeTeam: MissionaryTeam;
  themeColor: string;
  whatsappUrl: string | null;
  isSuperAdmin: boolean;
  onOpenTeamModal: () => void;
}

export const TeamIdentityBar: React.FC<Props> = ({
  activeTeam,
  themeColor,
  whatsappUrl,
  isSuperAdmin,
  onOpenTeamModal,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
        style={{ backgroundColor: themeColor }}
      >
        {activeTeam.ethnicity}
      </span>
      <span className="font-black text-stone-900 text-base font-['Outfit']">
        {activeTeam.name}
      </span>
      <span className="text-stone-400 hidden sm:inline">• {activeTeam.region}</span>
    </div>

    <div className="flex items-center gap-2">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
        >
          <MessageCircle className="w-3 h-3 text-emerald-600" />
          <span>Contactar Líder</span>
        </a>
      )}
      {isSuperAdmin && (
        <button
          onClick={onOpenTeamModal}
          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
        >
          Editar Equipo
        </button>
      )}
    </div>
  </div>
);
