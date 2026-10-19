import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import type { MissionaryTeam } from '../../features/auth/domain/auth.types';

interface Props {
  activeTeam: MissionaryTeam;
  whatsappUrl: string | null;
  onBackToAdmin: () => void;
}

export const AdminPreviewBanner: React.FC<Props> = ({
  activeTeam,
  whatsappUrl,
  onBackToAdmin,
}) => (
  <div className="no-print bg-amber-50/95 border-b border-amber-200 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
    <div className="flex items-center gap-2 font-medium">
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span><strong>Modo Vista Previa</strong></span>
      <span className="text-amber-700 hidden md:inline">
        • Supervisando: <strong>{activeTeam.name}</strong> ({activeTeam.ethnicity})
      </span>
    </div>

    <div className="flex items-center gap-2">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold transition text-[11px]"
        >
          <MessageCircle className="w-3 h-3 text-emerald-700" />
          <span>WhatsApp</span>
        </a>
      )}
      <button
        onClick={onBackToAdmin}
        className="px-2.5 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition flex items-center gap-1 cursor-pointer text-xs"
      >
        <ArrowLeft className="w-3 h-3" />
        <span>Volver a Supervisión</span>
      </button>
    </div>
  </div>
);
