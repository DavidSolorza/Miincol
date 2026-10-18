import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onOpenNotesModal?: () => void;
  onChangeView: (view: 'plans' | 'superadmin') => void;
  activeView: 'plans' | 'superadmin';
}

export const SidebarSegmentedControl: React.FC<Props> = ({
  isCollapsed,
  onChangeView,
  activeView,
}) => {
  if (isCollapsed) {
    return (
      <div className="px-2 py-1 flex justify-center">
        <button
          onClick={() => onChangeView('plans')}
          title="Plan PDM"
          className="w-8 h-5 rounded-full bg-black/15 hover:bg-black/25 p-0.5 flex items-center transition cursor-pointer"
        >
          <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-2.5 py-1">
      <div className="bg-stone-200/60 p-1 rounded-2xl flex items-center border border-stone-300/60 shadow-2xs">
        <button
          onClick={() => onChangeView('plans')}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
            activeView === 'plans'
              ? 'bg-white text-[#8B251E] shadow-xs border border-stone-200/80'
              : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#8B251E]" />
          <span>PLAN PDM</span>
        </button>
      </div>
    </div>
  );

};

