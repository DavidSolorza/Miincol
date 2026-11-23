import type { TeamSupervisionSummary } from '../domain/admin.types';
import { getTeamPhaseMetrics } from '../../plans/application/teamPhaseMetrics';

// Normaliza el identificador o etnia para detectar duplicados
function getNormalizedKey(t: TeamSupervisionSummary): string {
  const raw = (t.slug || t.id || t.ethnicity || t.name || '').toLowerCase().trim();
  if (raw.includes('pastos')) return 'pastos';
  if (raw.includes('wayuu') || raw.includes('wayúu')) return 'wayuu';
  if (raw.includes('nasa')) return 'nasa';
  if (raw.includes('embera') || raw.includes('emberá')) return 'embera';
  if (raw.includes('arhuaco') || raw.includes('iku')) return 'arhuaco';
  if (raw.includes('nukak') || raw.includes('makú') || raw.includes('maku')) return 'nukak';
  return raw;
}

// Elimina registros duplicados conservando la entidad más completa/canónica
export function deduplicateTeams(teams: TeamSupervisionSummary[]): TeamSupervisionSummary[] {
  const seen = new Map<string, TeamSupervisionSummary>();
  for (const t of teams) {
    const key = getNormalizedKey(t);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, t);
    } else {
      // Priorizar el que tenga id canónico (prefijo 'team-') o mayor presupuesto/miembros
      const isExistingCanonical = existing.id.startsWith('team-');
      const isNewCanonical = t.id.startsWith('team-');
      if (!isExistingCanonical && isNewCanonical) {
        seen.set(key, t);
      } else if (Number(t.totalBudget || 0) > Number(existing.totalBudget || 0)) {
        seen.set(key, t);
      }
    }
  }
  return Array.from(seen.values());
}

// Fusiona los equipos del backend con las mutaciones offline pendientes y datos locales
export function mergeBackendTeams(
  backendTeams: TeamSupervisionSummary[],
  currentList: TeamSupervisionSummary[],
  pending: Set<string>
): TeamSupervisionSummary[] {
  const mapped = backendTeams.map((t) => {
    const existing = currentList.find((x) => x.id === t.id || x.slug === t.id || x.id === t.slug || x.name === t.name);
    if (existing && (pending.has(t.id) || (t.slug && pending.has(t.slug)))) return existing;
    const [locDept, locReg] = (t.location || '').split(/\s*-\s*|\s*•\s*/);
    const phaseMetrics = getTeamPhaseMetrics(t.id, t.currentPhaseId, t);
    const totalBudget = (t.totalBudget && Number(t.totalBudget) > 0)
      ? Number(t.totalBudget)
      : (existing?.totalBudget && Number(existing.totalBudget) > 0 ? Number(existing.totalBudget) : 15000000);

    return {
      ...t,
      department: t.department || existing?.department || locDept || '',
      region: t.region || existing?.region || locReg || '',
      ethnicity: t.ethnicity || existing?.ethnicity || (t.name ? t.name.replace(/^Misi[oó]n\s+/i, '') : '') || '',
      leaderPhone: t.leaderPhone || existing?.leaderPhone || '+57 ',
      themeColor: t.themeColor || existing?.themeColor || '#8B251E',
      members: t.members && t.members.length > 0 ? t.members : (existing?.members || [t.leader]),
      ...phaseMetrics,
      totalBudget,
    };
  });
  return deduplicateTeams(mapped);
}

// Sanitiza equipos cargados desde almacenamiento local eliminando duplicados obsoletos
export function sanitizeLoadedStorageTeams(
  parsed: TeamSupervisionSummary[],
  defaultTeams: TeamSupervisionSummary[]
): TeamSupervisionSummary[] {
  const deduplicated = deduplicateTeams(parsed);
  return deduplicated.map((t) => {
    const phaseMetrics = getTeamPhaseMetrics(t.id, t.currentPhaseId, t);
    return {
      ...t,
      members: (t.members && t.members.length > 0) ? t.members : [t.leader],
      ...phaseMetrics,
      totalBudget: (t.totalBudget && Number(t.totalBudget) > 0) ? Number(t.totalBudget) : (phaseMetrics.totalBudget || 15000000),
    };
  });
}
