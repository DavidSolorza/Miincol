import React from 'react';
import { Plus, FileDown } from 'lucide-react';

interface Props {
  onOpenCreate: () => void;
  onOpenReport?: () => void;
}

export const SuperAdminHeader: React.FC<Props> = ({ onOpenCreate, onOpenReport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2 py-0.5 rounded-md">
            Dirección Nacional Misincol
          </span>
          <span className="text-xs text-stone-400">• Supervisión Estratégica PDM</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-['Outfit'] mt-1">
          Tablero de Misiones Indígenas
        </h1>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {onOpenReport && (
          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Informe Consolidado</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nuevo Equipo / Misión</span>
        </button>
      </div>
    </div>
  );
};
