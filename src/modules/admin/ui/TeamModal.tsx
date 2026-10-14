import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import type { TeamSupervisionSummary, CreateTeamDto, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { Check, AlertCircle, Palette, Sparkles, Key, Eye, EyeOff } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamData: CreateTeamDto) => Promise<void> | void;
  initialData?: TeamSupervisionSummary | null;
}

const COLOR_PRESETS = [
  '#8B251E', // Misincol Terracota
  '#E67324', // Misincol Ocre / Ámbar
  '#10B981', // Verde Selva / Esmeralda
  '#2563EB', // Azul Andino
  '#8B5CF6', // Violeta Montaña
  '#D97706', // Oro Cálido
  '#0D9488', // Verde Azulado
  '#E11D48', // Carmesí Fuego
];

const PHASES: { id: PhaseType; name: string }[] = [
  { id: 'investigacion', name: '1. Investigación y Diagnóstico' },
  { id: 'encarnacion', name: '2. Encarnación e Inmersión' },
  { id: 'evangelizacion', name: '3. Evangelización Contextualizada' },
  { id: 'entrenamiento', name: '4. Entrenamiento y Discipulado' },
  { id: 'autocuidado', name: '5. Autocuidado y Sostenibilidad' },
];

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<CreateTeamDto>({
    name: '',
    ethnicity: '',
    region: '',
    department: '',
    leader: '',
    leaderPhone: '+57 ',
    members: [],
    currentPhaseId: 'investigacion',
    totalBudget: 15000000,
    themeColor: '#8B251E',
    healthStatus: 'Optimo',
    slug: '',
    accessPin: '',
    criticalAlertMessage: '',
    criticalAlertType: 'Logística',
  });

  const [membersInput, setMembersInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        ethnicity: initialData.ethnicity || '',
        region: initialData.region || '',
        department: initialData.department || '',
        leader: initialData.leader || '',
        leaderPhone: initialData.leaderPhone || '+57 ',
        members: initialData.members || [],
        currentPhaseId: initialData.currentPhaseId || 'investigacion',
        totalBudget: initialData.totalBudget || 15000000,
        themeColor: initialData.themeColor || '#8B251E',
        healthStatus: initialData.healthStatus || 'Optimo',
        slug: initialData.slug || initialData.id || '',
        accessPin: initialData.accessPin || '',
        criticalAlertMessage: initialData.criticalAlert?.message || '',
        criticalAlertType: initialData.criticalAlert?.type || 'Logística',
      });
      setMembersInput(
        initialData.members && initialData.members.length > 0
          ? initialData.members.join(', ')
          : `${initialData.leader}, 2 obreros locales`
      );
    } else {
      setFormData({
        name: '',
        ethnicity: '',
        region: '',
        department: '',
        leader: '',
        leaderPhone: '+57 ',
        members: [],
        currentPhaseId: 'investigacion',
        totalBudget: 15000000,
        themeColor: '#8B251E',
        healthStatus: 'Optimo',
        slug: '',
        accessPin: '',
        criticalAlertMessage: '',
        criticalAlertType: 'Logística',
      });
      setMembersInput('');
    }
    setShowPassword(false);
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // Validación preventiva en cliente
    if (!formData.name.trim()) {
      setError('Por favor ingresa el nombre de la misión o equipo territorial.');
      return;
    }
    if (!formData.ethnicity.trim()) {
      setError('Por favor indica el pueblo indígena o etnia.');
      return;
    }
    if (!formData.region.trim()) {
      setError('Por favor indica el territorio, resguardo o municipio.');
      return;
    }
    if (!formData.leader.trim()) {
      setError('Por favor ingresa el nombre del pastor o líder ministerial.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const parsedMembers = membersInput
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      // Autogenerar slug si viene vacío
      const baseSlug =
        formData.ethnicity
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || 'equipo';

      const generatedSlug = formData.slug?.trim() || `team-${baseSlug}`;
      const defaultPin = formData.accessPin?.trim() || `${baseSlug}2026`;

      await onSubmit({
        ...formData,
        slug: generatedSlug,
        accessPin: defaultPin,
        members: parsedMembers.length > 0 ? parsedMembers : [formData.leader],
      });

      setSaving(false);
      onClose();
    } catch (err: unknown) {
      setSaving(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al procesar el equipo territorial.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Configuración de Misión Territorial' : 'Aprovisionar Nuevo Equipo / Misión'}
      subtitle="Organice las variables de campo, líder asignado, presupuesto y color identitario del equipo"
      maxWidth="2xl"
    >
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vista previa de identidad */}
        <div
          className="p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors"
          style={{
            borderColor: `${formData.themeColor}50`,
            backgroundColor: `${formData.themeColor}0D`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs"
              style={{ backgroundColor: formData.themeColor }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block font-['Outfit']">
                {formData.name || 'Nombre de la Misión'}
              </span>
              <span className="text-stone-500 text-[11px]">
                {formData.ethnicity || 'Pueblo'} • {formData.region || 'Territorio'}
              </span>
            </div>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs"
            style={{ backgroundColor: formData.themeColor }}
          >
            Color Activo
          </span>
        </div>

        {/* 1. Datos Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nombre de la Misión / Equipo Territorial *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej. Misión Misak - Silvia, Misión Kogui - Sierra Nevada"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Pueblo Indígena / Etnia *
            </label>
            <input
              type="text"
              value={formData.ethnicity}
              onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
              placeholder="ej. Misak, Kogui, Ticuna, Emberá"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Departamento / Zona Geográfica *
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="ej. Cauca (Andina), Magdalena (Caribe)"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Territorio / Resguardos / Municipios *
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="ej. Resguardo Guambía, Silvia y Piendamó"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>
        </div>

        {/* 2. Liderazgo y Contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Pastor o Líder Responsable *
            </label>
            <input
              type="text"
              value={formData.leader}
              onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
              placeholder="ej. Pr. Taita Manuel Tunubalá"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Teléfono / WhatsApp de Contacto Directo *
            </label>
            <input
              type="text"
              value={formData.leaderPhone}
              onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
              placeholder="+57 315 889 0142"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Obreros e Integrantes en Territorio (separados por coma)
            </label>
            <input
              type="text"
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="ej. Manuel Tunubalá, Mama Rosa Almendra, Javier Morales"
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              El líder se incluirá automáticamente en la lista de obreros misioneros.
            </p>
          </div>
        </div>

        {/* 3. Contraseña de Acceso para el Equipo */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-stone-500" />
            <span>Contraseña de Acceso para el Equipo Territorial</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.accessPin}
              onChange={(e) => setFormData({ ...formData, accessPin: e.target.value })}
              placeholder="ej. misak2026 (por defecto: [etnia]2026)"
              className="w-full px-3.5 py-2 pr-10 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 font-mono transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2 p-1 text-stone-400 hover:text-stone-600 transition"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Esta es la clave con la que el equipo ingresará al portal restringido de su misión.
          </p>
        </div>

        {/* 4. Fase Ministerial, Presupuesto y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Fase Actual PDM
            </label>
            <select
              value={formData.currentPhaseId}
              onChange={(e) =>
                setFormData({ ...formData, currentPhaseId: e.target.value as PhaseType })
              }
              className="w-full px-3 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white text-stone-800 font-medium cursor-pointer"
            >
              {PHASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Presupuesto Fase (COP)
            </label>
            <input
              type="number"
              min="0"
              step="500000"
              value={formData.totalBudget}
              onChange={(e) =>
                setFormData({ ...formData, totalBudget: Number(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white text-stone-900 font-mono transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Estado de Salud Operativa
            </label>
            <select
              value={formData.healthStatus}
              onChange={(e) =>
                setFormData({ ...formData, healthStatus: e.target.value as TeamHealthStatus })
              }
              className="w-full px-3 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white text-stone-800 font-medium cursor-pointer"
            >
              <option value="Optimo">Operación Estable (Óptimo)</option>
              <option value="Atención">Requiere Atención</option>
              <option value="Crítico">Alerta Crítica</option>
            </select>
          </div>
        </div>

        {/* 5. Selector de Color Temático Identitario */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              <span>Color Identitario del Equipo (Personaliza los componentes del PDM)</span>
            </label>
            <span className="text-[11px] font-mono text-stone-400 font-bold">
              {formData.themeColor}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {COLOR_PRESETS.map((color) => {
              const isSelected = formData.themeColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, themeColor: color })}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                    isSelected ? 'ring-2 ring-stone-900 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={color}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}

            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-200">
              <input
                type="color"
                value={formData.themeColor}
                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                title="Elegir color personalizado"
              />
              <span className="text-[10px] text-stone-400">Personalizado</span>
            </div>
          </div>
        </div>

        {/* 6. Alerta Territorial Opcional */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <label className="block text-xs font-bold text-stone-700">
            Alerta Territorial Opcional (Si existe contingencia activa en terreno)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={formData.criticalAlertType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  criticalAlertType: e.target.value as CreateTeamDto['criticalAlertType'],
                })
              }
              className="p-2 rounded-xl text-xs border border-stone-200 bg-stone-50 text-stone-800"
            >
              <option value="Salud">Salud Comunitaria</option>
              <option value="Logística">Logística / Vías</option>
              <option value="Seguridad">Seguridad Territorial</option>
              <option value="Institucional">Aval Institucional / Cabildo</option>
            </select>
            <input
              type="text"
              value={formData.criticalAlertMessage}
              onChange={(e) =>
                setFormData({ ...formData, criticalAlertMessage: e.target.value })
              }
              placeholder="Describa brevemente la contingencia..."
              className="sm:col-span-2 px-3 py-2 rounded-xl text-xs border border-stone-200 bg-stone-50 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : initialData ? (
              <span>Actualizar Misión</span>
            ) : (
              <span>Crear y Aprovisionar Equipo</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
