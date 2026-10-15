import React from 'react';
import { MisincolLogo } from '../../../../shared/components/MisincolLogo';
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
  <div className="p-2 sm:p-2.5 border-b border-stone-100 flex items-center justify-between">
    {!isCollapsed ? (
      <div className="flex flex-col">
        <MisincolLogo size="sm" showSubtitle={false} />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B251E] to-[#E67324] text-white flex items-center justify-center font-black text-xs mx-auto shadow-2xs">
        M
      </div>
    )}

    <button
      onClick={onCloseMobile}
      className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 lg:hidden cursor-pointer"
    >
      <X className="w-4 h-4" />
    </button>

    <button
      onClick={onToggleCollapse}
      className="hidden lg:flex p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
      title={isCollapsed ? 'Expandir panel lateral' : 'Colapsar panel lateral'}
    >
      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
    </button>
  </div>
);
