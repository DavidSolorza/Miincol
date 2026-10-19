import React from 'react';
import { Pin, Trash2, Clock, User } from 'lucide-react';
import { type TeamNote, NOTE_CATEGORIES } from '../../domain/notes.types';

interface Props {
  note: TeamNote;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteItemCard: React.FC<Props> = ({ note, onTogglePin, onDelete }) => {
  const cat = NOTE_CATEGORIES[note.category] || NOTE_CATEGORIES.general;
  const formattedDate = new Date(note.createdAt).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 bg-white relative flex flex-col justify-between space-y-2.5 ${
        note.isPinned
          ? 'border-amber-300 shadow-sm ring-1 ring-amber-300/40'
          : 'border-stone-200/80 hover:border-stone-300 shadow-2xs'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cat.bgClass} ${cat.textClass} ${cat.borderClass}`}>
            {cat.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                note.isPinned
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-stone-300 hover:text-stone-600 hover:bg-stone-100'
              }`}
              title={note.isPinned ? 'Desfijar nota' : 'Fijar nota arriba'}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-600' : ''}`} />
            </button>

            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Eliminar nota"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 className="text-sm font-bold text-stone-900 leading-snug">{note.title}</h4>
        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-100 font-medium">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3 text-stone-400" />
          <span>{note.author}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>{formattedDate}</span>
        </span>
      </div>
    </div>
  );
};
