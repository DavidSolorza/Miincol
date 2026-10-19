import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  filterState: string;
  setFilterState: (s: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  totalActivities: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
}

export const ObjectiveFilterBar: React.FC<Props> = ({
  filterState,
  setFilterState,
  searchTerm,
  setSearchTerm,
  totalActivities,
  pendingCount,
  inProgressCount,
  completedCount,
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3.5 pt-3.5 border-t border-stone-100">
    <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar py-0.5">
      <button
        onClick={() => setFilterState('ALL')}
        className={`px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-['Outfit'] ${
          filterState === 'ALL'
            ? 'bg-stone-900 text-white font-bold shadow-xs'
            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        Todas ({totalActivities})
      </button>
      <button
        onClick={() => setFilterState('Pendiente')}
        className={`px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-['Outfit'] border ${
          filterState === 'Pendiente'
            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs'
            : 'bg-amber-50/50 text-amber-800 border-amber-200/50 hover:bg-amber-100/70'
        }`}
      >
        ⏳ Pendientes ({pendingCount})
      </button>
      <button
        onClick={() => setFilterState('En Proceso')}
        className={`px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-['Outfit'] border ${
          filterState === 'En Proceso'
            ? 'bg-orange-100 text-[#8B251E] border-orange-300 font-bold shadow-xs'
            : 'bg-orange-50/50 text-[#8B251E] border-orange-200/50 hover:bg-orange-100/70'
        }`}
      >
        🔄 En Proceso ({inProgressCount})
      </button>
      <button
        onClick={() => setFilterState('Completado')}
        className={`px-3 py-1.5 rounded-xl text-[11px] transition whitespace-nowrap cursor-pointer font-['Outfit'] border ${
          filterState === 'Completado'
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold shadow-xs'
            : 'bg-emerald-50/50 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100/70'
        }`}
      >
        ✅ Completadas ({completedCount})
      </button>
    </div>

    <div className="relative w-full sm:w-56">
      <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar iniciativa..."
        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] transition"
      />
    </div>
  </div>
);
