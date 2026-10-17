import React from 'react';
import { ChevronLeft, ChevronRight, X, Layers } from 'lucide-react';

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
  <div className="p-3 pb-2 flex flex-col gap-2.5 border-b border-white/10">
    {/* macOS-style window dots */}
    <div className={`flex items-center gap-1.5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-xs" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-xs" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-xs" />
      </div>

      <button
        onClick={onCloseMobile}
        className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
        title={isCollapsed ? 'Expandir panel' : 'Colapsar panel'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>

    {/* Brand title */}
    <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
      <div className="w-7 h-7 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-xs">
        <Layers className="w-4 h-4 text-white" />
      </div>
      {!isCollapsed && (
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-black text-sm text-white tracking-wider font-['Outfit'] truncate">
            MISINCOL
          </span>
          <span className="text-[10px] font-bold text-white/60">v1.0</span>
        </div>
      )}
    </div>
  </div>
);
