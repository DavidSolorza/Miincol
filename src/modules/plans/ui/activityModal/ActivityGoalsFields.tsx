import React from 'react';

interface Props {
  currentSituation: string;
  setCurrentSituation: (s: string) => void;
  shortTermGoal: string;
  setShortTermGoal: (g: string) => void;
  mediumTermGoal: string;
  setMediumTermGoal: (g: string) => void;
  longTermGoal: string;
  setLongTermGoal: (g: string) => void;
  obstacles: string;
  setObstacles: (o: string) => void;
}

export const ActivityGoalsFields: React.FC<Props> = ({
  currentSituation,
  setCurrentSituation,
  shortTermGoal,
  setShortTermGoal,
  mediumTermGoal,
  setMediumTermGoal,
  longTermGoal,
  setLongTermGoal,
  obstacles,
  setObstacles,
}) => (
  <div className="bg-[#FAF7F2]/70 p-4 sm:p-5 rounded-2xl border border-stone-200/70 space-y-3.5">
    <div className="flex items-center gap-2 pb-1 border-b border-stone-200/60">
      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-black text-xs font-['Outfit']">
        3
      </span>
      <h4 className="font-['Outfit'] font-extrabold text-sm text-stone-900 tracking-tight">
        Diagnóstico Territorial, Metas & Obstáculos
      </h4>
    </div>

    {/* 1. Diagnóstico */}
    <div>
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">
        Situación Actual (Diagnóstico Territorial)
      </label>
      <textarea
        value={currentSituation}
        onChange={(e) => setCurrentSituation(e.target.value)}
        placeholder="¿Cuál es la realidad inicial observada en la comunidad?"
        rows={2}
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
      />
    </div>

    {/* 2. Metas (Corto, Mediano, Largo Plazo) */}
    <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-stone-200/80 space-y-2.5">
      <span className="text-[10px] font-black uppercase tracking-wider text-[#8B251E] block font-['Outfit']">
        Metas Proyectadas (Plazos de Ejecución)
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div>
          <label className="font-bold text-stone-700 block mb-1 text-[11px]">
            A Corto Plazo (3 - 6 Meses)
          </label>
          <textarea
            value={shortTermGoal}
            onChange={(e) => setShortTermGoal(e.target.value)}
            placeholder="Primeros acuerdos y contactos..."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
          />
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1 text-[11px]">
            A Mediano Plazo (1 Año)
          </label>
          <textarea
            value={mediumTermGoal}
            onChange={(e) => setMediumTermGoal(e.target.value)}
            placeholder="Logro verificable en el primer año..."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
          />
        </div>

        <div>
          <label className="font-bold text-stone-700 block mb-1 text-[11px]">
            A Largo Plazo (3 - 5 Años)
          </label>
          <textarea
            value={longTermGoal}
            onChange={(e) => setLongTermGoal(e.target.value)}
            placeholder="Consolidación y autonomía..."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs resize-none"
          />
        </div>
      </div>
    </div>

    {/* 3. Dificultades */}
    <div>
      <label className="font-bold text-stone-700 block mb-1 text-[11px]">
        Dificultades / Obstáculos Territoriales
      </label>
      <input
        type="text"
        value={obstacles}
        onChange={(e) => setObstacles(e.target.value)}
        placeholder="Clima, vías, idioma, oposición..."
        className="w-full p-2.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus:border-[#E67324] focus:ring-2 focus:ring-[#E67324]/20 focus:outline-hidden transition-all text-xs"
      />
    </div>
  </div>
);

