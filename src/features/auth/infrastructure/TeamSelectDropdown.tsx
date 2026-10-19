import React, { useState, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { TeamOptionItem } from './teamSelect/TeamOptionItem';
import { TeamDropdownTrigger } from './teamSelect/TeamDropdownTrigger';
import { useDropdownOutsideClick } from './teamSelect/useDropdownOutsideClick';

interface TeamItem {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  department?: string;
  themeColor?: string;
  leader?: string;
}

interface TeamSelectDropdownProps {
  teams: TeamItem[];
  activeTeamId: string;
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelectDropdown: React.FC<TeamSelectDropdownProps> = ({
  teams,
  activeTeamId,
  onSelectTeam,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useDropdownOutsideClick(dropdownRef, isOpen, () => setIsOpen(false));

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ethnicity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <TeamDropdownTrigger
        activeTeam={activeTeam}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E67324]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 font-['Outfit']">Misiones Territoriales</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{teams.length} equipos</span>
          </div>

          <div className="p-2 border-b border-stone-100">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por etnia, nombre o región..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200/70 focus:outline-hidden focus:border-[#8B251E] focus:bg-white text-stone-800 transition"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 no-scrollbar">
            {filteredTeams.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-400 font-medium">No se encontraron misiones con "{searchTerm}"</div>
            ) : (
              filteredTeams.map((team) => (
                <TeamOptionItem
                  key={team.id}
                  team={team}
                  isSelected={team.id === activeTeamId}
                  onSelect={() => {
                    onSelectTeam(team.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
