import React from 'react';
import { MapPin, Check } from 'lucide-react';

interface TeamItem {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  department?: string;
  themeColor?: string;
  leader?: string;
}

interface Props {
  team: TeamItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const TeamOptionItem: React.FC<Props> = ({ team, isSelected, onSelect }) => {
  const teamColor = team.themeColor || '#8B251E';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2.5 cursor-pointer ${
        isSelected
          ? 'bg-[#8B251E]/10 border border-[#8B251E]/30 text-stone-900 shadow-2xs'
          : 'hover:bg-stone-50 border border-transparent text-stone-700'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
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
            {team.leader && <span className="text-stone-400 truncate">• {team.leader}</span>}
          </p>
        </div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-[#8B251E] shrink-0" />}
    </button>
  );
};
