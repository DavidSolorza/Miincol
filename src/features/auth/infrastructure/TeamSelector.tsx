import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { MissionaryTeam } from '../domain/auth.types';
import { MapPin, Check } from 'lucide-react';

interface TeamSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  teams: MissionaryTeam[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  isOpen,
  onClose,
  teams,
  activeTeamId,
  onSelectTeam,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selección de Equipo Ministerial MISINCOL"
      subtitle="Elija la misión territorial activa para visualizar o editar su Plan de Desarrollo Ministerial"
      maxWidth="lg"
    >
      <div className="space-y-3">
        {teams.map((t) => {
          const isSelected = t.id === activeTeamId;

          return (
            <button
              key={t.id}
              onClick={() => {
                onSelectTeam(t.id);
                onClose();
              }}
              className={`w-full p-4 rounded-xl text-left border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'border-[#8B251E] bg-[#8B251E]/5 shadow-xs ring-1 ring-[#8B251E]/30'
                  : 'border-stone-200 bg-white hover:border-stone-400/60 hover:bg-[#FAF7F2]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs bg-[#8B251E]"
                  >
                    Etnia: {t.ethnicity}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E67324]" />
                    {t.region}
                  </span>
                </div>
                <h4 className="text-base font-bold text-stone-900 mt-1.5 font-['Outfit']">
                  {t.name}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Líder: <strong>{t.leader}</strong> • {t.members.length} miembros en campo
                </p>
              </div>

              {isSelected ? (
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 mt-1 shadow-xs bg-[#8B251E]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-stone-300 shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
