import React from 'react';
import { ChevronDown, Layers } from 'lucide-react';

interface Props {
  selectedDept: string;
  onSelectDept: (dept: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  departments: string[];
}

export const ColombiaMapFilters: React.FC<Props> = ({
  selectedDept,
  onSelectDept,
  selectedStatus,
  onSelectStatus,
  departments,
}) => {
  return (
    <div className="flex items-center justify-between gap-1.5 p-2.5 bg-white/80 backdrop-blur-xs border-b border-stone-200/70 text-xs">
      <div className="flex items-center gap-1.5 text-stone-700 font-bold">
        <Layers className="w-3.5 h-3.5 text-[#E67324]" />
        <span className="hidden sm:inline font-['Outfit']">Mapa Territorial</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="relative">
          <select
            value={selectedDept}
            onChange={(e) => onSelectDept(e.target.value)}
            className="text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-2 py-1 pr-5 rounded-lg border border-stone-200 appearance-none cursor-pointer"
          >
            <option value="ALL">Dpto: Todos</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 px-2 py-1 pr-5 rounded-lg border border-stone-200 appearance-none cursor-pointer"
          >
            <option value="ALL">Estado: Todos</option>
            <option value="Optimo">Operación Estable</option>
            <option value="Atención">Requiere Atención</option>
            <option value="Crítico">Alerta Territorial</option>
          </select>
          <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
