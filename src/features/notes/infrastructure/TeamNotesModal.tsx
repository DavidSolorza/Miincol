import React from 'react';
import type { MissionaryTeam } from '../../auth/domain/auth.types';
import { useTeamNotes } from '../application/useTeamNotes';
import { NotesModalHeader } from './notesModal/NotesModalHeader';
import { NoteEditorForm } from './notesModal/NoteEditorForm';
import { NotesFilterTabs } from './notesModal/NotesFilterTabs';
import { NoteItemCard } from './notesModal/NoteItemCard';
import { NotebookPen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTeam: MissionaryTeam;
}

export const TeamNotesModal: React.FC<Props> = ({ isOpen, onClose, activeTeam }) => {
  const { notes, filteredNotes, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, addNote, togglePin, deleteNote } =
    useTeamNotes(activeTeam.id, activeTeam.name, activeTeam.leader);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs animate-fadeIn selection:bg-[#E67324]/20 selection:text-[#8B251E]">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <NotesModalHeader activeTeam={activeTeam} totalNotes={notes.length} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          <NoteEditorForm onAddNote={addNote} />

          <NotesFilterTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-stone-50 border border-dashed border-stone-200 space-y-2">
              <NotebookPen className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-600">No se encontraron notas con este criterio</p>
              <p className="text-[11px] text-stone-400">
                Usa el formulario superior para registrar una nueva idea de actividad o motivo de oración.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNotes.map((note) => (
                <NoteItemCard key={note.id} note={note} onTogglePin={togglePin} onDelete={deleteNote} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
