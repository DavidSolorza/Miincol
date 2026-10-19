import React from 'react';
import { NotebookPen, X } from 'lucide-react';
import type { MissionaryTeam } from '../../../auth/domain/auth.types';

interface Props {
  activeTeam: MissionaryTeam;
  totalNotes: number;
  onClose: () => void;
}

export const NotesModalHeader: React.FC<Props> = ({ activeTeam, totalNotes, onClose }) => (
  <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-white relative">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#8B251E]/10 flex items-center justify-center text-[#8B251E] shrink-0">
        <NotebookPen className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 font-['Outfit']">
            Notas & Agenda Territorial
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            {totalNotes} {totalNotes === 1 ? 'nota' : 'notas'}
          </span>
        </div>
        <p className="text-xs text-stone-500 font-medium">
          Ideas de actividades, motivos de oración y apuntes para <strong className="text-stone-800">{activeTeam.name}</strong>
        </p>
      </div>
    </div>

    <button
      onClick={onClose}
      className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
      title="Cerrar modal"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);
