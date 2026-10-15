import React from 'react';
import type { TeamSupervisionSummary, TeamHealthStatus } from '../domain/admin.types';
import type { PhaseType } from '../../plans/domain/plan.types';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import {
  MapPin,
  User,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertOctagon,
  MessageCircle,
  Pencil,
  Trash2,
  ChevronDown,
} from 'lucide-react';

interface TeamOverviewCardProps {
  team: TeamSupervisionSummary;
  onInspectTeam: (teamId: string) => void;
  onEditTeam?: (team: TeamSupervisionSummary) => void;
  onDeleteTeam?: (teamId: string) => void;
  onPhaseChange?: (teamId: string, phase: PhaseType) => void;
  onStatusChange?: (teamId: string, status: TeamHealthStatus) => void;
}

const PHASES_LIST: { id: PhaseType; name: string }[] = [
  { id: 'investigacion', name: '1. Investigación' },
  { id: 'encarnacion', name: '2. Encarnación' },
  { id: 'evangelizacion', name: '3. Evangelización' },
  { id: 'entrenamiento', name: '4. Entrenamiento' },
  { id: 'autocuidado', name: '5. Autocuidado' },
];

export const TeamOverviewCard: React.FC<TeamOverviewCardProps> = ({
  team,
  onInspectTeam,
  onEditTeam,
  onDeleteTeam,
  onPhaseChange,
}) => {
  const healthBadge = {
    Optimo: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: ShieldCheck,
      label: 'Operación Estable',
    },
    Atención: {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      label: 'Requiere Atención',
    },
    Crítico: {
      bg: 'bg-rose-50 text-rose-900 border-rose-200',
      dot: 'bg-rose-600',
      icon: AlertOctagon,
      label: 'Alerta Territorial',
    },
  }[team.healthStatus] || {
    bg: 'bg-stone-50 text-stone-800 border-stone-200',
    dot: 'bg-stone-500',
    icon: ShieldCheck,
    label: 'Estado Desconocido',
  };

  const StatusIcon = healthBadge.icon;
  const themeColor = team.themeColor || '#8B251E';

  // Sanitizar teléfono para enlace de WhatsApp
  const cleanPhone = team.leaderPhone.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${team.leader}, te contacto de la Dirección Nacional de Misincol para seguimiento al plan de la ${team.name}.`
  )}`;

  return (
    <div className="bg-white rounded-xl border border-stone-200/80 hover:border-stone-400/80 hover:shadow-md transition-all duration-200 p-4 sm:p-4.5 flex flex-col justify-between space-y-3 relative overflow-hidden group">
      {/* Cinta superior decorativa con el color identitario del equipo */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all"
        style={{ backgroundColor: themeColor }}
      />

      {/* 1. Cabecera de la Tarjeta de Equipo */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md text-white shadow-2xs"
              style={{ backgroundColor: themeColor }}
            >
              {team.ethnicity}
            </span>
            <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-[#E67324]" />
              {team.department}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Badge de Estado Operativo */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthBadge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${healthBadge.dot} animate-pulse`} />
              <StatusIcon className="w-2.5 h-2.5" />
              <span>{healthBadge.label}</span>
            </span>

            {/* Acciones de Edición / Eliminación */}
            {onEditTeam && (
              <button
                onClick={() => onEditTeam(team)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                title="Editar variables del equipo"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
            {onDeleteTeam && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Confirma que desea eliminar la ${team.name}? Esta acción no se puede deshacer.`
                    )
                  ) {
                    onDeleteTeam(team.id);
                  }
                }}
                className="p-1 rounded-md text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Eliminar equipo"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Nombre del Equipo y Territorio (Clic directo para supervisar) */}
        <div
          onClick={() => onInspectTeam(team.id)}
          className="cursor-pointer group/title mt-2"
          title={`Supervisar plan ministerial de ${team.name}`}
        >
          <h3 className="text-base font-black text-stone-900 font-['Outfit'] leading-tight group-hover/title:text-[#8B251E] transition-colors flex items-center justify-between">
            <span>{team.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover/title:text-[#8B251E] group-hover/title:translate-x-0.5 transition-all" />
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5 truncate">
            Territorio: {team.region}
          </p>
        </div>

        {/* Ficha de Liderazgo y Contacto con WhatsApp */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-1 text-xs truncate">
            <User className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
            <span className="truncate">
              <strong>{team.leader}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[10px] border border-emerald-200 transition"
              title="Abrir chat de WhatsApp con el líder territorial"
            >
              <MessageCircle className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <span className="flex items-center gap-0.5 text-[11px] text-stone-400" title="Número de integrantes">
              <Users className="w-3 h-3 text-stone-400" />
              {team.membersCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Selector Rápido de Fase PDM y Avance Presupuestal */}
      <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-stone-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Fase:
          </span>

          {/* Selector Rápido de Fase tipo Dropdown */}
          {onPhaseChange ? (
            <div className="relative inline-block">
              <select
                value={team.currentPhaseId}
                onChange={(e) => onPhaseChange(team.id, e.target.value as PhaseType)}
                className="appearance-none font-bold text-xs pr-5 pl-2 py-0.5 rounded-md bg-white border border-stone-200 shadow-2xs cursor-pointer focus:outline-hidden"
                style={{ color: themeColor }}
              >
                {PHASES_LIST.map((ph) => (
                  <option key={ph.id} value={ph.id} className="text-stone-800">
                    {ph.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="font-bold text-xs truncate max-w-[180px]" style={{ color: themeColor }}>
              {team.currentPhaseName}
            </span>
          )}
        </div>

        {/* Barra de Progreso del Equipo con Color Identitario */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold mb-0.5">
            <span className="text-stone-500">Progreso</span>
            <span className="font-black text-stone-900 font-['Outfit']">
              {team.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-stone-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${team.progressPercentage}%`,
                background: `linear-gradient(90deg, ${themeColor}88, ${themeColor})`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
            <span>
              {team.completedActivities}/{team.totalActivities} iniciativas
            </span>
            <span>{team.inProgressActivities} en curso</span>
          </div>
        </div>

        {/* Balance Presupuestal */}
        <div className="pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-[9px] uppercase font-bold text-stone-400 block">
              Fase
            </span>
            <span className="font-black text-stone-800 font-['Outfit']">
              {formatCurrencyCOP(team.totalBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-stone-400 block">
              Ejecutado (Est.)
            </span>
            <span className="font-bold text-emerald-700">
              {formatCurrencyCOP(team.executedBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Iniciativas en Terreno Desglosadas por Objetivo Estratégico */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
            Objetivos & Iniciativas
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            {team.activeInitiatives.length} activas
          </span>
        </div>

        {/* Resumen de Cobertura por Objetivo (1 al 4) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[1, 2, 3, 4].map((objNum) => {
            const count = team.activeInitiatives.filter((act) => act.objectiveNumber === objNum).length;
            return (
              <span
                key={objNum}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                  count > 0 ? 'bg-stone-100 text-stone-700 border border-stone-200/60' : 'bg-stone-50 text-stone-300'
                }`}
                title={`Objetivo #${objNum}: ${count} iniciativa(s) en curso`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: count > 0 ? themeColor : '#CBD5E1' }}
                />
                <span>Obj #{objNum}: {count}</span>
              </span>
            );
          })}
        </div>

        {/* Listado Compacto de Iniciativas */}
        <div className="space-y-1">
          {team.activeInitiatives.slice(0, 3).map((act, i) => (
            <div
              key={i}
              className="text-xs p-1.5 rounded-lg bg-stone-50/80 hover:bg-stone-100/70 border border-stone-200/50 transition flex items-center justify-between gap-1.5"
            >
              <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
                {act.objectiveNumber ? (
                  <span
                    className="px-1 py-0.2 rounded text-[9px] font-black shrink-0"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    Obj #{act.objectiveNumber}
                  </span>
                ) : null}

                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    act.state === 'Completado'
                      ? 'bg-emerald-500'
                      : act.state === 'En Proceso'
                      ? 'bg-[#E67324]'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="truncate text-stone-800 text-[11px] font-medium" title={act.title}>
                  {act.title}
                </span>
              </div>

              <span className="text-[9px] font-semibold text-stone-400 shrink-0 whitespace-nowrap">
                {act.responsible.split('&')[0]?.trim()}
              </span>
            </div>
          ))}
          {team.activeInitiatives.length > 3 && (
            <div className="text-center">
              <span className="text-[10px] text-stone-400 font-semibold">
                +{team.activeInitiatives.length - 3} iniciativas más en el plan
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Alerta Territorial Crítica (Si Existe) */}
      {team.criticalAlert && (
        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900">
                Alerta: {team.criticalAlert.type}
              </span>
              <span className="text-[9px] text-amber-700">{team.criticalAlert.reportedAt}</span>
            </div>
            <p className="mt-0.5 leading-snug text-[10px] text-amber-900 truncate">{team.criticalAlert.message}</p>
          </div>
        </div>
      )}

      {/* 5. Pie de Tarjeta y Acción de Supervisión Directa */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[10px] text-stone-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {team.lastUpdate}
        </span>

        <button
          onClick={() => onInspectTeam(team.id)}
          style={{ backgroundColor: themeColor }}
          className="text-white hover:opacity-90 font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs group"
        >
          <span>Supervisar Plan</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
