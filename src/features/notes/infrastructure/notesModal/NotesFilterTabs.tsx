import React from 'react';
import { Search } from 'lucide-react';
import { type NoteCategory, NOTE_CATEGORIES } from '../../domain/notes.types';

interface Props {
  selectedCategory: NoteCategory | 'all';
  onSelectCategory: (cat: NoteCategory | 'all') => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
}

export const NotesFilterTabs: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}) => (
  <div className="space-y-2.5 pb-2">
    <div className="relative">
      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar notas, ideas o peticiones de oración..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50/70 focus:bg-white focus:outline-hidden focus:border-stone-400 focus:ring-2 focus:ring-stone-200/50 transition"
      />
    </div>

    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer whitespace-nowrap border ${
          selectedCategory === 'all'
            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
        }`}
      >
        Todas
      </button>

      {(Object.keys(NOTE_CATEGORIES) as NoteCategory[]).map((cat) => {
        const conf = NOTE_CATEGORIES[cat];
        const isSel = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
              isSel
                ? 'bg-[#8B251E] text-white border-[#8B251E] shadow-2xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{conf.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
