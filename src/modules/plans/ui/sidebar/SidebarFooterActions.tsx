import React from 'react';
import { FileDown, LogOut, NotebookPen } from 'lucide-react';

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
  onLogout,
}) => (
  <div className="p-2 border-t border-stone-100 space-y-1.5">
    {(activeView === 'plans' || isTeamRestricted) && onOpenNotesModal && (
      <button
        onClick={() => {
          onOpenNotesModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-1.5 rounded-lg bg-amber-50/90 hover:bg-amber-100 text-amber-950 border border-amber-300/70 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98 ${
          isCollapsed ? 'px-1' : 'px-2'
        }`}
        title="Notas & Agenda Territorial (Ideas, Actividades y Oración)"
      >
        <NotebookPen className="w-3.5 h-3.5 shrink-0 text-[#E67324]" />
        {!isCollapsed && <span>Notas & Agenda</span>}
      </button>
    )}

    {(activeView === 'plans' || isTeamRestricted) && (
      <button
        onClick={() => {
          onOpenReportModal();
          if (isOpenMobile) onCloseMobile();
        }}
        className={`w-full py-1.5 rounded-lg bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
          isCollapsed ? 'px-1' : 'px-2'
        }`}
        title="Generar Informe Ejecutivo PDM"
      >
        <FileDown className="w-3.5 h-3.5 shrink-0" />
        {!isCollapsed && <span>Informe PDM</span>}
      </button>
    )}

    {onLogout && (
      <button
        onClick={onLogout}
        className={`w-full py-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/80 transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
          isCollapsed ? 'px-1' : 'px-2'
        }`}
        title="Cerrar Sesión"
      >
        <LogOut className="w-3 h-3 shrink-0" />
        {!isCollapsed && <span>Cerrar Sesión</span>}
      </button>
    )}
  </div>
);
