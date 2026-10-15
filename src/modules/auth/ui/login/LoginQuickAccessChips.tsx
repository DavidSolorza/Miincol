import React from 'react';
import { KeyRound, ShieldCheck, Check } from 'lucide-react';

interface Props {
  selectedQuickChip: string;
  onFillCredentials: (type: 'admin' | 'team', user: string, pass: string, chipKey: string) => void;
}

const PREDEFINED_CHIPS = [
  { type: 'admin' as const, user: 'admin', pass: '210910624Dj', key: 'admin', label: 'admin (210910624Dj)', isSpecial: true },
  { type: 'team' as const, user: 'wayuu', pass: 'wayuu2026', key: 'wayuu', label: 'wayuu (wayuu2026)', color: '#8B251E' },
  { type: 'team' as const, user: 'nasa', pass: 'nasa2026', key: 'nasa', label: 'nasa (nasa2026)', color: '#047857' },
  { type: 'team' as const, user: 'pastos', pass: 'pastos2026', key: 'pastos', label: 'pastos (pastos2026)', color: '#1D4ED8' },
  { type: 'team' as const, user: 'embera', pass: 'embera2026', key: 'embera', label: 'embera (embera2026)', color: '#7E22CE' },
  { type: 'team' as const, user: 'arhuaco', pass: 'arhuaco2026', key: 'arhuaco', label: 'arhuaco (arhuaco2026)', color: '#B45309' },
  { type: 'team' as const, user: 'nukak', pass: 'nukak2026', key: 'nukak', label: 'nukak (nukak2026)', color: '#0F766E' },
];

export const LoginQuickAccessChips: React.FC<Props> = ({ selectedQuickChip, onFillCredentials }) => {
  return (
    <div className="space-y-1 pt-0.5">
      <div className="relative my-1.5 pt-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200/80" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-stone-400 font-bold bg-white px-2">
          Credenciales Predefinidas
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-stone-500 text-[10px] sm:text-[11px] font-semibold">
        <KeyRound className="w-3 h-3 text-[#E67324]" />
        <span>Haz clic en una credencial para autocompletar:</span>
      </div>

      <div className="flex flex-wrap gap-1 pt-0.5">
        {PREDEFINED_CHIPS.map((chip) => {
          const isSelected = selectedQuickChip === chip.key || selectedQuickChip === `team-${chip.key}`;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => onFillCredentials(chip.type, chip.user, chip.pass, chip.key)}
              className={`px-2 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold transition-fluid cursor-pointer flex items-center gap-1 border active:scale-95 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border-stone-200'
              }`}
              style={
                !isSelected && chip.color
                  ? { backgroundColor: `${chip.color}15`, color: chip.color, borderColor: `${chip.color}30` }
                  : isSelected && chip.color
                  ? { backgroundColor: chip.color, borderColor: chip.color }
                  : undefined
              }
            >
              {chip.isSpecial && <ShieldCheck className="w-3 h-3 text-amber-400" />}
              <span>{chip.label}</span>
              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
