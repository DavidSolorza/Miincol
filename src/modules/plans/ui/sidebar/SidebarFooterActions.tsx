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
  <div className="space-y-1 pt-1.5 border-t border-white/10">
    {!isCollapsed && (
      <span className="text-[10px] font-black uppercase tracking-wider text-white/60 px-2 block mb-1 font-['Outfit']">
        Herramientas
      </span>
    )}

    {(activeView === 'plans' || isTeamRestricted) && onOpenNotesModal && (
      <button
        onClick={() => {
          onOpenNotesModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-2 rounded-2xl bg-white/12 hover:bg-white/20 text-white border border-white/15 font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer ${
          isCollapsed ? 'justify-center px-1' : 'px-2.5'
        }`}
        title="Notas & Agenda Territorial"
      >
        <NotebookPen className="w-4 h-4 shrink-0 text-amber-300" />
        {!isCollapsed && <span>Notas & Agenda</span>}
      </button>
    )}

    {(activeView === 'plans' || isTeamRestricted) && (
      <button
        onClick={() => {
          onOpenReportModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-2 rounded-2xl bg-white/12 hover:bg-white/20 text-white border border-white/15 font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer ${
          isCollapsed ? 'justify-center px-1' : 'px-2.5'
        }`}
        title="Generar Informe Ejecutivo PDM"
      >
        <FileDown className="w-4 h-4 shrink-0 text-white" />
        {!isCollapsed && <span>Informe PDM</span>}
      </button>
    )}
  </div>
);
