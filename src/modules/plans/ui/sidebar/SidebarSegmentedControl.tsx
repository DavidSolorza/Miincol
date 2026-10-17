import React from 'react';
import { BookOpen, NotebookPen } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onOpenNotesModal?: () => void;
  onChangeView: (view: 'plans' | 'superadmin') => void;
  activeView: 'plans' | 'superadmin';
}

export const SidebarSegmentedControl: React.FC<Props> = ({
  isCollapsed,
  onOpenNotesModal,
  onChangeView,
  activeView,
}) => {
  if (isCollapsed) {
    return (
      <div className="px-2 py-1 flex justify-center">
        <button
          onClick={onOpenNotesModal}
          title="Abrir Notas & Agenda"
          className="w-8 h-5 rounded-full bg-white/20 hover:bg-white/30 p-0.5 flex items-center transition cursor-pointer"
        >
          <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-2.5 py-1">
      <div className="bg-black/15 p-1 rounded-2xl flex items-center gap-1 border border-white/10">
        <button
          onClick={() => onChangeView('plans')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
            activeView === 'plans'
              ? 'bg-white text-[#8B251E] shadow-sm'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-3 h-3 shrink-0" />
          <span>PLAN PDM</span>
        </button>

        <button
          onClick={onOpenNotesModal}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-black text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Abrir Notas, Agenda y Oración"
        >
          <NotebookPen className="w-3 h-3 shrink-0 text-amber-300" />
          <span>AGENDA</span>
        </button>
      </div>
    </div>
  );
};
