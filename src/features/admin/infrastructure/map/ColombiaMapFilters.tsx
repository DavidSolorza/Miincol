import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  selectedDept: string;
  onSelectDept: (dept: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  departments: string[];
  selectedPhase?: string;
  onSelectPhase?: (phase: string) => void;
  selectedEthnicity?: string;
  onSelectEthnicity?: (eth: string) => void;
}

export const ColombiaMapFilters: React.FC<Props> = ({
  selectedDept,
  onSelectDept,
  selectedStatus,
  onSelectStatus,
  departments,
  selectedPhase = 'ALL',
  onSelectPhase,
  selectedEthnicity = 'ALL',
  onSelectEthnicity,
}) => {
  const selectBaseClass = (isActive: boolean) =>
    `w-full text-[11px] font-bold px-2.5 py-1.5 pr-6 rounded-xl border transition-all duration-150 appearance-none cursor-pointer truncate shadow-2xs ${
      isActive
        ? 'bg-[#8B251E]/10 border-[#8B251E]/40 text-[#8B251E]'
        : 'bg-[#FAF7F2] hover:bg-[#F3EBDD]/70 border-[#E7DFD5] text-stone-700 hover:text-stone-900'
    }`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-white border-b border-stone-100">
      <div className="relative">
        <select
          value={selectedPhase}
          onChange={(e) => onSelectPhase?.(e.target.value)}
          className={selectBaseClass(selectedPhase !== 'ALL')}
        >
          <option value="ALL">Fase PDM</option>
          <option value="investigacion">1. Investigación</option>
          <option value="encarnacion">2. Encarnación</option>
          <option value="evangelizacion">3. Evangelización</option>
          <option value="entrenamiento">4. Entrenamiento</option>
          <option value="autocuidado">5. Autocuidado</option>
        </select>
        <ChevronDown className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={selectedDept}
          onChange={(e) => onSelectDept(e.target.value)}
          className={selectBaseClass(selectedDept !== 'ALL')}
        >
          <option value="ALL">Departamento</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={selectedEthnicity}
          onChange={(e) => onSelectEthnicity?.(e.target.value)}
          className={selectBaseClass(selectedEthnicity !== 'ALL')}
        >
          <option value="ALL">Etnia / Pueblo</option>
          <option value="Wayuu">Wayuu</option>
          <option value="Nasa">Nasa</option>
          <option value="Emberá">Emberá</option>
          <option value="Nukak">Nukak</option>
          <option value="Pastos">Pastos</option>
          <option value="Arhuaco">Arhuaco</option>
        </select>
        <ChevronDown className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => onSelectStatus(e.target.value)}
          className={selectBaseClass(selectedStatus !== 'ALL')}
        >
          <option value="ALL">Estado</option>
          <option value="Optimo">Operación Estable</option>
          <option value="Atención">Requiere Atención</option>
          <option value="Crítico">Alerta Crítica</option>
        </select>
        <ChevronDown className="w-3 h-3 text-[#E67324] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
