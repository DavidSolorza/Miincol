/**
 * Módulo de Georreferenciación y Localización Territorial de Colombia
 * Aligned with Technical Governance Contract v2026.4.0 (< 150 lines)
 */

import {
  type DepartmentInfo,
  COLOMBIA_DEPARTMENTS,
  MUNICIPALITY_LOCATIONS,
} from './colombiaDepartments.data';

export {
  type DepartmentInfo,
  COLOMBIA_DEPARTMENTS,
  MUNICIPALITY_LOCATIONS,
};

export const normalizeText = (text?: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const findDepartmentByName = (deptNameOrQuery?: string): DepartmentInfo | null => {
  if (!deptNameOrQuery) return null;
  const q = normalizeText(deptNameOrQuery);

  return (
    COLOMBIA_DEPARTMENTS.find((d) => {
      const dName = normalizeText(d.name);
      return q === dName || q.includes(dName) || dName.includes(q);
    }) || null
  );
};

export interface ResolvedLocation {
  x: number;
  y: number;
  departmentId: string;
  departmentName: string;
  locationLabel: string;
  accentColor: string;
}

export const resolveTeamLocation = (team: {
  id?: string;
  region?: string;
  department?: string;
  name?: string;
  ethnicity?: string;
  coordinates?: { lat: number; lng: number };
}): ResolvedLocation => {
  const normRegion = normalizeText(team.region);
  const normDept = normalizeText(team.department);
  const normName = normalizeText(team.name);
  const normEth = normalizeText(team.ethnicity);

  // 1. Direct municipality search
  for (const [key, loc] of Object.entries(MUNICIPALITY_LOCATIONS)) {
    if (
      normRegion.includes(key) ||
      normDept.includes(key) ||
      normName.includes(key) ||
      normEth.includes(key)
    ) {
      const dept = findDepartmentByName(loc.department);
      return {
        x: loc.x,
        y: loc.y,
        departmentId: dept?.id || 'CONAR',
        departmentName: loc.department,
        locationLabel: loc.label,
        accentColor: dept?.accentColor || '#8B251E',
      };
    }
  }

  // 2. Department name search
  const foundDept =
    findDepartmentByName(team.department) ||
    findDepartmentByName(team.region) ||
    findDepartmentByName(team.name);

  if (foundDept) {
    const locLabel = team.region ? `${team.region.split(',')[0].trim()}, ${foundDept.name}` : foundDept.name;
    return {
      x: foundDept.center.x,
      y: foundDept.center.y,
      departmentId: foundDept.id,
      departmentName: foundDept.name,
      locationLabel: locLabel,
      accentColor: foundDept.accentColor,
    };
  }

  // 3. Fallback for custom or legacy teams: assign to safe center position
  return {
    x: 226,
    y: 306,
    departmentId: 'COCUN',
    departmentName: 'Cundinamarca',
    locationLabel: team.region || 'Territorio Nacional',
    accentColor: '#8B251E',
  };
};
