import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, MapPin, Sparkles } from 'lucide-react';

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

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];
  const themeColor = activeTeam?.themeColor || '#8B251E';

  // Cerrar al hacer clic fuera o pulsar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ethnicity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón Disparador Premium */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200/80 transition-all text-xs font-bold text-stone-800 cursor-pointer shadow-2xs group focus:outline-hidden"
        title="Cambiar de equipo territorial"
      >
        {/* Punto de color de identidad */}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs transition-transform group-hover:scale-110"
          style={{ backgroundColor: themeColor }}
        />

        {/* Etnia */}
        <span
          className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md text-white shadow-2xs shrink-0"
          style={{ backgroundColor: themeColor }}
        >
          {activeTeam?.ethnicity || 'Etnia'}
        </span>

        {/* Nombre del Equipo */}
        <span className="font-bold text-xs text-stone-800 truncate max-w-[140px] sm:max-w-[220px] font-['Outfit']">
          {activeTeam?.name || 'Seleccionar equipo'}
        </span>

        {/* Flecha Chevron animada */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#8B251E]' : ''
          }`}
        />
      </button>

      {/* Menú Desplegable Flotante */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Cabecera del Dropdown */}
          <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E67324]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 font-['Outfit']">
                Misiones Territoriales
              </span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
              {teams.length} equipos
            </span>
          </div>

          {/* Buscador Rápido */}
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

          {/* Listado de Equipos */}
          <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 no-scrollbar">
            {filteredTeams.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-400 font-medium">
                No se encontraron misiones con "{searchTerm}"
              </div>
            ) : (
              filteredTeams.map((team) => {
                const isSelected = team.id === activeTeamId;
                const teamColor = team.themeColor || '#8B251E';

                return (
                  <button
                    key={team.id}
                    onClick={() => {
                      onSelectTeam(team.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B251E]/10 border border-[#8B251E]/30 text-stone-900 shadow-2xs'
                        : 'hover:bg-stone-50 border border-transparent text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Punto de color */}
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: teamColor }}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded text-white shadow-2xs shrink-0"
                            style={{ backgroundColor: teamColor }}
                          >
                            {team.ethnicity}
                          </span>
                          <span
                            className={`font-bold text-xs truncate font-['Outfit'] ${
                              isSelected ? 'text-[#8B251E]' : 'text-stone-900'
                            }`}
                          >
                            {team.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-[#E67324] shrink-0" />
                          <span className="truncate">{team.region}</span>
                          {team.leader && (
                            <span className="text-stone-400 truncate">• {team.leader}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Check de seleccionado */}
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: teamColor }}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
