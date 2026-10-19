import React from 'react';
import { MessageCircle, MapPin, Edit3 } from 'lucide-react';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';

interface Props {
  activeTeam: MissionaryTeam;
  whatsappUrl: string | null;
  isSuperAdmin: boolean;
  onOpenTeamModal: () => void;
}

export const TeamIdentityBar: React.FC<Props> = ({
  activeTeam,
  whatsappUrl,
  isSuperAdmin,
  onOpenTeamModal,
}) => (
  <div className="bg-white/80 backdrop-blur-xs px-3.5 sm:px-4 py-2.5 rounded-2xl border border-stone-200/70 shadow-2xs flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-2.5 flex-wrap">
      <span
        className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl text-white shadow-2xs font-['Outfit'] bg-gradient-to-r from-[#8B251E] to-[#E67324]"
      >
        {activeTeam.ethnicity}
      </span>

      <h1 className="font-black text-stone-900 text-base sm:text-lg font-['Outfit'] tracking-tight">
        {activeTeam.name}
      </h1>
      {activeTeam.region && (
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 font-medium px-2 py-0.5 rounded-lg bg-stone-100/70 border border-stone-200/50">
          <MapPin className="w-3 h-3 text-[#E67324]" />
          {activeTeam.region}
        </span>
      )}
    </div>

    <div className="flex items-center gap-2">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/80 text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Contactar Líder</span>
        </a>
      )}
      {isSuperAdmin && (
        <button
          onClick={onOpenTeamModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/90 hover:bg-stone-200/90 text-stone-700 border border-stone-200/70 text-xs font-bold transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-stone-500" />
          <span>Editar Misión</span>
        </button>
      )}
    </div>
  </div>
);
