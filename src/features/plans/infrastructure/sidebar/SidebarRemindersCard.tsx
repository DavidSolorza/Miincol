import React from 'react';
import { BellRing, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  isCollapsed: boolean;
  onOpenNotesModal?: () => void;
}

export const SidebarRemindersCard: React.FC<Props> = ({ isCollapsed, onOpenNotesModal }) => {
  if (isCollapsed) {
    return (
      <div className="pt-1 flex flex-col items-center">
        <button
          type="button"
          onClick={onOpenNotesModal}
          className="w-9 h-9 rounded-xl bg-white border border-orange-200/90 text-[#8B251E] hover:bg-orange-50 flex items-center justify-center shadow-2xs transition-colors duration-200 cursor-pointer relative"
          title="Avisos y Agenda Ministerial"
        >
          <BellRing className="w-4 h-4 text-[#E67324]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B251E] ring-2 ring-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-3 bg-white/90 border border-stone-200/90 shadow-2xs backdrop-blur-xs space-y-2 select-none">
      {/* Header con insignia institucional */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BellRing className="w-3.5 h-3.5 text-[#E67324] shrink-0" />
          <span className="font-['Outfit'] font-black text-xs text-stone-900 tracking-tight">
            Avisos y Agenda
          </span>
        </div>
        <span className="text-[9px] font-black uppercase text-[#8B251E] bg-[#8B251E]/10 px-1.5 py-0.5 rounded-md font-['Outfit']">
          Supervisión PDM
        </span>
      </div>

      {/* Item 1: Próxima Reunión */}
      <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#EBDDCF]/80 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-[#8B251E] shrink-0" />
          <span className="text-[10px] font-black text-[#8B251E] uppercase font-['Outfit']">
            Jueves • 7:00 PM
          </span>
        </div>
        <p className="text-[11px] font-bold text-stone-900 leading-tight font-['Outfit']">
          Reunión de Enlace Territorial
        </p>
      </div>

      {/* Item 2: Mensaje de la Dirección Nacional */}
      <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-0.5">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#E67324] shrink-0" />
          <span className="text-[9.5px] font-bold text-stone-600 font-['Outfit']">
            Dirección Nacional
          </span>
        </div>
        <p className="text-[11px] text-stone-700 leading-snug">
          Completar evidencias del pilar antes del cierre mensual de avances.
        </p>
      </div>

      {/* Acceso a Notas y Agenda si está disponible */}
      {onOpenNotesModal && (
        <button
          type="button"
          onClick={onOpenNotesModal}
          className="w-full pt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-[#8B251E] hover:text-[#E67324] transition-colors duration-200 cursor-pointer font-['Outfit']"
        >
          <span>Abrir notas y agenda</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
