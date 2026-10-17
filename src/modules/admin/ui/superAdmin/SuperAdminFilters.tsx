import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  totalResults?: number;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export const SuperAdminFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search por etnia, misión o departamento..."
        className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-[13px] rounded-2xl bg-white border border-stone-200/90 shadow-2xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-[#8B251E] focus:ring-2 focus:ring-[#8B251E]/10 transition"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="p-1 rounded-full text-stone-400 hover:text-stone-700 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition"
          title="Limpiar búsqueda"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
