import React from 'react';

interface Props {
  currentSituation: string;
  setCurrentSituation: (s: string) => void;
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
  mediumTermGoal,
  setMediumTermGoal,
  longTermGoal,
  setLongTermGoal,
  obstacles,
  setObstacles,
}) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="font-bold text-stone-700 block mb-1">Situación Actual (Diagnóstico)</label>
        <textarea
          value={currentSituation}
          onChange={(e) => setCurrentSituation(e.target.value)}
          placeholder="¿Cuál es la realidad inicial observada en la comunidad?"
          rows={2}
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
        />
      </div>

      <div>
        <label className="font-bold text-stone-700 block mb-1">Meta a Mediano Plazo (1 Año)</label>
        <textarea
          value={mediumTermGoal}
          onChange={(e) => setMediumTermGoal(e.target.value)}
          placeholder="¿Qué logro verificable se espera alcanzar?"
          rows={2}
          className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
        />
      </div>
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1">Meta a Largo Plazo (3 - 5 Años)</label>
      <input
        type="text"
        value={longTermGoal}
        onChange={(e) => setLongTermGoal(e.target.value)}
        placeholder="Visión ministerial a largo plazo..."
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
      />
    </div>

    <div>
      <label className="font-bold text-stone-700 block mb-1">Dificultades / Obstáculos Territoriales</label>
      <input
        type="text"
        value={obstacles}
        onChange={(e) => setObstacles(e.target.value)}
        placeholder="Clima, vías, idioma, oposición o trámites..."
        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
      />
    </div>
  </>
);
