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
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-3 pt-3 border-t border-stone-100">
    <div className="flex items-center gap-1 text-xs font-semibold overflow-x-auto no-scrollbar">
      <button
        onClick={() => setFilterState('ALL')}
        className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
          filterState === 'ALL'
            ? 'bg-stone-900 text-white font-bold shadow-2xs'
            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        Todas ({totalActivities})
      </button>
      <button
        onClick={() => setFilterState('Pendiente')}
        className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
          filterState === 'Pendiente'
            ? 'bg-amber-100 text-amber-900 font-bold'
            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        Pendientes ({pendingCount})
      </button>
      <button
        onClick={() => setFilterState('En Proceso')}
        className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
          filterState === 'En Proceso'
            ? 'bg-orange-100 text-[#8B251E] font-bold'
            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        En Proceso ({inProgressCount})
      </button>
      <button
        onClick={() => setFilterState('Completado')}
        className={`px-2.5 py-1 rounded-lg text-[11px] transition whitespace-nowrap cursor-pointer ${
          filterState === 'Completado'
            ? 'bg-emerald-100 text-emerald-900 font-bold'
            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        Completadas ({completedCount})
      </button>
    </div>

    <div className="relative w-full sm:w-52">
      <Search className="w-3 h-3 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar iniciativa..."
        className="w-full pl-7 pr-3 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50/60 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#8B251E] transition"
      />
    </div>
  </div>
);
