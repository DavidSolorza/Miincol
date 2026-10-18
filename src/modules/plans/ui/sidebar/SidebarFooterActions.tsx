import { FileDown, NotebookPen } from 'lucide-react';

interface Props {
  activeView: 'plans' | 'superadmin';
  isTeamRestricted: boolean;
  isCollapsed: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenReportModal: () => void;
  onOpenNotesModal?: () => void;
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
}) => (
  <div className="space-y-1 pt-1.5 border-t border-stone-200/80">
    {!isCollapsed && (
      <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 px-2 block mb-1 font-['Outfit']">
        Herramientas
      </span>
    )}

    {(activeView === 'plans' || isTeamRestricted) && onOpenNotesModal && (
      <button
        onClick={() => {
          onOpenNotesModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-2 rounded-2xl bg-white/85 hover:bg-white text-[#261B18] hover:text-stone-950 border border-stone-200/80 font-bold text-xs transition flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer ${
          isCollapsed ? 'justify-center px-1' : 'px-2.5'
        }`}
        title="Notas & Agenda Territorial"
      >
        <NotebookPen className="w-4 h-4 shrink-0 text-[#C45500]" />
        {!isCollapsed && <span>Notas & Agenda</span>}
      </button>
    )}

    {(activeView === 'plans' || isTeamRestricted) && (
      <button
        onClick={() => {
          onOpenReportModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-2 rounded-2xl bg-white/85 hover:bg-white text-[#261B18] hover:text-stone-950 border border-stone-200/80 font-bold text-xs transition flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer ${
          isCollapsed ? 'justify-center px-1' : 'px-2.5'
        }`}
        title="Generar Informe Ejecutivo PDM"
      >
        <FileDown className="w-4 h-4 shrink-0 text-[#8B251E]" />
        {!isCollapsed && <span>Informe PDM</span>}
      </button>
    )}
  </div>

);
