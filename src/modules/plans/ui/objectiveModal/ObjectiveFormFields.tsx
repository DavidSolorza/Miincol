import React from 'react';
import { Target, Info, AlertCircle } from 'lucide-react';

interface Props {
  totalObjectivesCount: number;
  error: string | null;
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
}

export const ObjectiveFormFields: React.FC<Props> = ({
  totalObjectivesCount,
  error,
  title,
  setTitle,
  description,
  setDescription,
}) => (
  <div className="space-y-4">
    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 flex items-start gap-3 shadow-2xs">
      <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
        <Info className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <span className="font-['Outfit'] font-black text-xs text-amber-950 block">Regla Ministerial: Máximo 4 Objetivos por Fase</span>
        <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
          Para garantizar el enfoque y viabilidad de la misión de campo, cada fase ministerial admite como máximo{' '}
          <strong>4 objetivos estratégicos</strong>. Actualmente hay <strong>{totalObjectivesCount} de 4</strong> registrados.
        </p>
      </div>
    </div>

    {error && (
      <div className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-800 flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span className="font-semibold text-xs">{error}</span>
      </div>
    )}

    <div className="space-y-1">
      <label className="font-bold text-stone-700 block text-xs">
        Título del Objetivo Estratégico <span className="text-rose-600">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          <Target className="w-4 h-4 text-[#E67324]" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Diagnóstico Socio-Espiritual y Cartografía de Comunidades"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white focus:bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] font-medium text-xs text-stone-900 transition"
          required
        />
      </div>
      <span className="text-[10.5px] text-stone-400 font-medium">
        Debe ser claro, conciso y orientado a resultados de transformación territorial.
      </span>
    </div>

    <div className="space-y-1">
      <label className="font-bold text-stone-700 block text-xs">
        Descripción y Enfoque Territorial <span className="text-rose-600">*</span>
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Describa el propósito, alcance en campo y cómo este objetivo aporta a la consolidación de la misión..."
        className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white focus:bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] font-medium text-xs text-stone-900 leading-relaxed resize-none transition"
        required
      />
    </div>
  </div>
);
