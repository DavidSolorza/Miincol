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
  <>
    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <span className="font-bold text-amber-950 block">Regla Ministerial: Máximo 4 Objetivos por Fase</span>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Para garantizar el enfoque y viabilidad de la misión de campo, cada fase ministerial admite como máximo{' '}
          <strong>4 objetivos estratégicos</strong>. Actualmente hay <strong>{totalObjectivesCount} de 4</strong> registrados.
        </p>
      </div>
    </div>

    {error && (
      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span className="font-semibold text-xs">{error}</span>
      </div>
    )}

    <div>
      <label className="font-bold text-stone-800 block mb-1">
        Título del Objetivo Estratégico <span className="text-rose-600">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          <Target className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Diagnóstico Socio-Espiritual y Cartografía de Comunidades"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 focus:border-[#8B251E] font-medium"
          required
        />
      </div>
      <span className="text-[11px] text-stone-400 mt-1 block">
        Debe ser claro, conciso y orientado a resultados ministeriales.
      </span>
    </div>

    <div>
      <label className="font-bold text-stone-800 block mb-1">
        Descripción y Enfoque Territorial <span className="text-rose-600">*</span>
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="Describa el propósito, alcance en campo y cómo este objetivo aporta a la consolidación de la iglesia y la misión..."
        className="w-full p-3 rounded-xl border border-stone-300 bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 focus:border-[#8B251E] font-medium leading-relaxed resize-none"
        required
      />
    </div>
  </>
);
