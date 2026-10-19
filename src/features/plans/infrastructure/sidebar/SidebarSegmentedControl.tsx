import React from 'react';
import { BookOpen } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onOpenNotesModal?: () => void;
  onChangeView: (view: 'plans' | 'superadmin') => void;
}

export const SidebarSegmentedControl: React.FC<Props> = ({
  isCollapsed,
  onChangeView,
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
    <div className="px-3 sm:px-3.5 py-1.5">
      <button
        onClick={() => onChangeView('plans')}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ease-out cursor-pointer select-none overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #FDF0E8 0%, #F18A38 60%, #B83A05 100%)',
        }}
        title="Plan PDM Activo"
      >
        <BookOpen className="w-5 h-5 shrink-0 text-stone-900" />
        <span className="font-black text-sm uppercase tracking-wider text-stone-950 font-['Outfit']">
          PLAN PDM
        </span>
      </button>
    </div>
  );
};

