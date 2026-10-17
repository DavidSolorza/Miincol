import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export const SidebarBrand: React.FC<Props> = ({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
}) => (
  <div className="p-2.5 sm:p-3 pb-2 flex flex-col gap-1.5 border-b border-black/5">
    {isCollapsed ? (
      <div className="flex flex-col items-center gap-2 py-0.5">
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-xl text-stone-700 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 transition cursor-pointer shadow-xs"
          title="Expandir panel"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <div className="w-8 h-8 rounded-xl bg-white/90 border border-stone-200/80 shadow-xs flex items-center justify-center select-none" title="MISINCOL">
          <span className="font-['Outfit'] font-black text-sm text-[#8B251E] leading-none">
            M<span className="text-[#EA7C25]">.</span>
          </span>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <div className="flex items-center min-w-0 py-0.5">
          <img
            src="/img/misincol.png"
            alt="MISINCOL"
            className="h-8 sm:h-8.5 w-auto max-w-[145px] object-contain drop-shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-stone-700 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 lg:hidden cursor-pointer shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl text-stone-700 hover:text-stone-900 bg-white/70 hover:bg-white border border-stone-200/60 transition cursor-pointer shadow-xs"
            title="Colapsar panel"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )}
  </div>
);
