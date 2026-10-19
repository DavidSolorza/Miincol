import React from 'react';
import { FileBarChart, NotebookPen, MessageCircle } from 'lucide-react';

interface Props {
  activeView: 'plans' | 'superadmin';
  isTeamRestricted: boolean;
  isCollapsed: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenReportModal: () => void;
  onOpenNotesModal?: () => void;
  whatsappUrl?: string | null;
  onLogout?: () => void;
}

export const SidebarFooterActions: React.FC<Props> = ({
  activeView,
  isTeamRestricted,
  isCollapsed,
  isOpenMobile,
  onCloseMobile,
  onOpenReportModal,
  onOpenNotesModal,
  whatsappUrl,
}) => {
  if (activeView !== 'plans' && !isTeamRestricted) return null;

  if (isCollapsed) {
    return (
      <div className="space-y-1.5 pt-1 flex flex-col items-center">
        {onOpenNotesModal && (
          <button
            onClick={() => {
              onOpenNotesModal();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-9 h-9 rounded-xl bg-white border border-orange-200 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-xs transition cursor-pointer"
            title="Notas y Agenda"
          >
            <NotebookPen className="w-5 h-5 text-[#8B251E]" />
          </button>
        )}
        <button
          onClick={() => {
            onOpenReportModal();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-9 h-9 rounded-xl bg-white border border-orange-200 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-xs transition cursor-pointer"
          title="Informe PDM"
        >
          <FileBarChart className="w-5 h-5 text-[#8B251E]" />
        </button>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl bg-white border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-xs hover:bg-emerald-50 transition"
            title="Contacto Líder"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 pt-1 select-none">
      {onOpenNotesModal && (
        <button
          onClick={() => {
            onOpenNotesModal();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-orange-50/60 border-2 border-orange-200/80 hover:border-orange-400/90 text-stone-900 hover:text-[#8B251E] shadow-2xs hover:shadow-xs transition-all duration-200 ease-out flex items-center justify-center gap-2.5 cursor-pointer font-['Outfit'] group"
          title="Notas y Agenda Territorial"
        >
          <NotebookPen className="w-5 h-5 text-[#8B251E] group-hover:text-[#E67324] transition-colors shrink-0" />
          <span className="font-extrabold text-sm text-stone-900 group-hover:text-[#8B251E] transition-colors">
            Notas y Agenda
          </span>
        </button>
      )}

      <button
        onClick={() => {
          onOpenReportModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-orange-50/60 border-2 border-orange-200/80 hover:border-orange-400/90 text-stone-900 hover:text-[#8B251E] shadow-2xs hover:shadow-xs transition-all duration-200 ease-out flex items-center justify-center gap-2.5 cursor-pointer font-['Outfit'] group"
        title="Generar Informe Ejecutivo PDM"
      >
        <FileBarChart className="w-5 h-5 text-[#8B251E] group-hover:text-[#E67324] transition-colors shrink-0" />
        <span className="font-black text-sm uppercase tracking-wider text-stone-900 group-hover:text-[#8B251E] transition-colors">
          INFORME PDM
        </span>
      </button>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white border-2 border-emerald-500 hover:border-emerald-600 text-emerald-600 hover:bg-emerald-50/60 font-black text-sm transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs font-['Outfit']"
          title="Contactar al Líder por WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-100/60" />
          <span>Contacto Líder</span>
        </a>
      ) : (
        <button
          disabled
          className="w-full py-2.5 px-3.5 rounded-2xl bg-white/70 border-2 border-emerald-400/50 text-emerald-600/60 font-black text-sm flex items-center justify-center gap-2 font-['Outfit'] cursor-not-allowed opacity-75"
          title="Sin teléfono de WhatsApp configurado"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <span>Contacto Líder</span>
        </button>
      )}
    </div>
  );
};
