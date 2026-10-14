import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { Activity } from '../domain/plan.types';
import { calculateWeeks, formatCurrencyCOP } from '../../../shared/utils/formatters';
import { PlusCircle } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultObjectiveNumber: 1 | 2 | 3 | 4;
  onSave: (objectiveNumber: 1 | 2 | 3 | 4, activity: Omit<Activity, 'id' | 'objectiveNumber' | 'totalBudget'>) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  defaultObjectiveNumber,
  onSave,
}) => {
  const [objectiveNumber, setObjectiveNumber] = useState<1 | 2 | 3 | 4>(defaultObjectiveNumber);
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('General');
  const [responsible, setResponsible] = useState('');
  const [frequency, setFrequency] = useState('Mensual');
  const [timesPerYear, setTimesPerYear] = useState<number>(12);
  const [unitBudget, setUnitBudget] = useState<number>(300000);
  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [currentSituation, setCurrentSituation] = useState('');
  const [mediumTermGoal, setMediumTermGoal] = useState('');
  const [longTermGoal, setLongTermGoal] = useState('');
  const [obstacles, setObstacles] = useState('');

  const calculatedTotal = (unitBudget || 0) * (timesPerYear || 0);
  const { totalWeeks, remainingWeeks } = calculateWeeks(startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !responsible.trim()) {
      alert('Por favor complete la descripción y el responsable de la actividad.');
      return;
    }

    onSave(objectiveNumber, {
      description,
      stage,
      responsible,
      frequency,
      timesPerYear,
      unitBudget,
      startDate,
      endDate,
      totalWeeks,
      remainingWeeks,
      state: 'Pendiente',
      currentSituation,
      mediumTermGoal,
      longTermGoal,
      obstacles,
    });

    onClose();
    // Reset form
    setDescription('');
    setCurrentSituation('');
    setMediumTermGoal('');
    setLongTermGoal('');
    setObstacles('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Iniciativa / Actividad Ministerial"
      subtitle="Complete los campos para registrar una acción en el Plan de Desarrollo Ministerial"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Selector de Objetivo y Etapa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Objetivo de Área Destino</label>
            <select
              value={objectiveNumber}
              onChange={(e) => setObjectiveNumber(Number(e.target.value) as 1 | 2 | 3 | 4)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              <option value={1}>Objetivo #1 (Mapeo e Investigación)</option>
              <option value={2}>Objetivo #2 (Inmersión y Lengua)</option>
              <option value={3}>Objetivo #3 (Alianzas y Redes)</option>
              <option value={4}>Objetivo #4 (Planificación y Sostenibilidad)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Etapa / Eje Operativo</label>
            <input
              type="text"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              placeholder="Ej. Diagnóstico Comunitario, Salud, Traducción..."
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
              required
            />
          </div>
        </div>

        {/* Descripción de la Actividad */}
        <div>
          <label className="font-bold text-stone-700 block mb-1">Descripción de la Actividad</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué acción concreta se realizará en territorio con la comunidad?"
            rows={2}
            className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
            required
          />
        </div>

        {/* Responsable y Frecuencia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Responsable Principal</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              placeholder="Ej. Pr. David Morales"
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
              required
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Frecuencia</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              <option value="Semanal">Semanal</option>
              <option value="Quincenal">Quincenal</option>
              <option value="Mensual">Mensual</option>
              <option value="Bimensual">Bimensual</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
              <option value="Única vez">Única vez</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Repeticiones / Año</label>
            <input
              type="number"
              value={timesPerYear}
              onChange={(e) => setTimesPerYear(Number(e.target.value))}
              min="1"
              max="365"
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-semibold"
              required
            />
          </div>
        </div>

        {/* Presupuesto y Cálculo Automático */}
        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Presupuesto Unitario (COP)</label>
              <input
                type="number"
                value={unitBudget}
                onChange={(e) => setUnitBudget(Number(e.target.value))}
                step="10000"
                min="0"
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-bold text-[#8B251E]"
                required
              />
            </div>

            <div className="bg-white p-3 rounded-lg border border-stone-200/90 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-stone-400">
                Presupuesto Total Estimado (Autocalculado)
              </span>
              <span className="text-base font-black text-[#8B251E] font-['Outfit']">
                {formatCurrencyCOP(calculatedTotal)}
              </span>
              <span className="text-[10px] text-stone-500">
                Formula: Valor Unitario × Repeticiones Anuales
              </span>
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
              required
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Fecha de Finalización</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
              required
            />
          </div>
        </div>

        {/* Diagnóstico y Metas */}
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

        {/* Obstáculos y Contingencias */}
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

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#8B251E] to-[#E67324] hover:from-[#751E18] hover:to-[#D05E12] text-white font-bold transition flex items-center gap-2 shadow-md shadow-[#8B251E]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Guardar Iniciativa</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
