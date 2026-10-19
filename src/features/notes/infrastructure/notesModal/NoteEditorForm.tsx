import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { type NoteCategory, NOTE_CATEGORIES } from '../../domain/notes.types';

interface Props {
  onAddNote: (title: string, content: string, category: NoteCategory, isPinned: boolean) => void;
}

export const NoteEditorForm: React.FC<Props> = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('idea');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote(title, content, category, isPinned);
    setTitle('');
    setContent('');
    setIsPinned(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/90 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-stone-800">Nueva Nota / Idea de Campo</span>
        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-[#8B251E] focus:ring-[#8B251E]"
          />
          <span className="text-[11px] font-semibold">Fijar al inicio</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          placeholder="Título o asunto de la idea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="sm:col-span-2 px-3 py-1.5 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as NoteCategory)}
          className="px-2.5 py-1.5 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 font-medium cursor-pointer"
        >
          {(Object.keys(NOTE_CATEGORIES) as NoteCategory[]).map((cat) => (
            <option key={cat} value={cat}>{NOTE_CATEGORIES[cat].label}</option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Escribe aquí los detalles de la idea, apunte de reunión o motivo de oración..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        required
        className="w-full px-3 py-2 rounded-lg text-xs border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-300 resize-none"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-lg bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Guardar Nota</span>
        </button>
      </div>
    </form>
  );
};
