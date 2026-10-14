import React from 'react';
import type { TeamSupervisionSummary } from '../domain/admin.types';
import { formatCurrencyCOP } from '../../../shared/utils/formatters';
import {
  MapPin,
  User,
  Users,
  AlertTriangle,
  ArrowRight,
  Phone,
  Clock,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';

interface TeamOverviewCardProps {
  team: TeamSupervisionSummary;
  onInspectTeam: (teamId: string) => void;
}

export const TeamOverviewCard: React.FC<TeamOverviewCardProps> = ({ team, onInspectTeam }) => {
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
  }[team.healthStatus];

  const StatusIcon = healthBadge.icon;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#8B251E]/40 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
      {/* 1. Cabecera de la Tarjeta de Equipo */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#8B251E] bg-[#8B251E]/10 px-2.5 py-0.5 rounded-md">
              {team.ethnicity}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E67324]" />
              {team.department}
            </span>
          </div>

          {/* Badge de Estado Operativo */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${healthBadge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${healthBadge.dot} animate-pulse`} />
            <StatusIcon className="w-3 h-3" />
            <span>{healthBadge.label}</span>
          </span>
        </div>

        {/* Nombre del Equipo y Territorio */}
        <h3 className="text-lg font-black text-stone-900 mt-2 font-['Outfit']">
          {team.name}
        </h3>
        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
          <span>Territorio: {team.region}</span>
        </p>

        {/* Ficha de Liderazgo y Contacto */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#8B251E]" />
            <span>
              Líder: <strong>{team.leader}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Phone className="w-3 h-3 text-stone-400" />
              {team.leaderPhone}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Users className="w-3 h-3 text-stone-400" />
              {team.membersCount} en campo
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fase Activa y Avance Presupuestal */}
      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-stone-200/70 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Fase Actual PDM
          </span>
          <span className="font-bold text-[#8B251E] text-xs truncate max-w-[200px]">
            {team.currentPhaseName}
          </span>
        </div>

        {/* Barra de Progreso del Equipo */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-stone-500 text-[11px]">Progreso de Fase</span>
            <span className="font-black text-stone-900 font-['Outfit']">
              {team.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-stone-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-[#E67324] to-[#8B251E] h-full rounded-full transition-all duration-300"
              style={{ width: `${team.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
            <span>
              {team.completedActivities} de {team.totalActivities} iniciativas listas
            </span>
            <span>{team.inProgressActivities} en ejecución</span>
          </div>
        </div>

        {/* Balance Presupuestal */}
        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Presupuesto Fase
            </span>
            <span className="font-black text-stone-800 font-['Outfit']">
              {formatCurrencyCOP(team.totalBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Ejecutado (Est.)
            </span>
            <span className="font-bold text-emerald-700">
              {formatCurrencyCOP(team.executedBudget)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Iniciativas en Curso */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
          Iniciativas Clave en Terreno:
        </span>
        <div className="space-y-1">
          {team.activeInitiatives.map((act, i) => (
            <div
              key={i}
              className="text-xs p-2 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    act.state === 'Completado'
                      ? 'bg-emerald-500'
                      : act.state === 'En Proceso'
                      ? 'bg-[#E67324]'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="truncate text-stone-700 text-[11px] font-medium">{act.title}</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-400 shrink-0">
                {act.responsible.split('&')[0]?.trim()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Alerta Territorial Crítica (Si Existe) */}
      {team.criticalAlert && (
        <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
                Alerta de {team.criticalAlert.type}
              </span>
              <span className="text-[10px] text-amber-700">{team.criticalAlert.reportedAt}</span>
            </div>
            <p className="mt-0.5 leading-relaxed text-[11px]">{team.criticalAlert.message}</p>
          </div>
        </div>
      )}

      {/* 5. Pie de Tarjeta y Acción de Supervisión Directa */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[10px] text-stone-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Sincronizado: {team.lastUpdate}
        </span>

        <button
          onClick={() => onInspectTeam(team.id)}
          className="bg-stone-900 hover:bg-[#8B251E] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs group"
        >
          <span>Supervisar Plan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
