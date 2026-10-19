import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import departmentsData from './data/colombiaDepartments.json';
import { resolveTeamLocation, COLOMBIA_DEPARTMENTS, normalizeText } from './colombiaLocations';

interface DepartmentPath {
  id: string;
  name: string;
  d: string;
}

interface Props {
  teams: TeamSupervisionSummary[];
  selectedTeamId?: string | null;
  hoveredDeptId?: string | null;
  selectedDeptName?: string | null;
  onSelectDept?: (deptName: string) => void;
  onHoverDept?: (deptName: string | null) => void;
  onSelectTeam?: (team: TeamSupervisionSummary) => void;
}

const DEPARTMENTS = departmentsData as DepartmentPath[];

export const ColombiaMapDepartments: React.FC<Props> = ({
  teams,
  selectedTeamId,
  selectedDeptName,
  onSelectDept,
  onHoverDept,
  onSelectTeam,
}) => {
  // Pre-calculate team mappings for all departments
  const teamsByDept = React.useMemo(() => {
    const map = new Map<string, TeamSupervisionSummary>();
    teams.forEach((t) => {
      const loc = resolveTeamLocation(t);
      const normDept = normalizeText(loc.departmentName);
      if (!map.has(normDept)) {
        map.set(normDept, t);
      }
    });
    return map;
  }, [teams]);

  const activeSelectedTeam = teams.find((t) => t.id === selectedTeamId);
  const selectedDeptFromTeam = activeSelectedTeam ? resolveTeamLocation(activeSelectedTeam).departmentName : null;

  return (
    <g className="transition-all duration-300">
      {DEPARTMENTS.map((dept) => {
        const normDeptName = normalizeText(dept.name);
        const matchingTeam = teamsByDept.get(normDeptName);
        const hasActiveMission = Boolean(matchingTeam);
        const deptInfo = COLOMBIA_DEPARTMENTS.find((d) => d.id === dept.id);

        const isExplicitlySelected =
          (selectedDeptName && selectedDeptName !== 'ALL' && normalizeText(selectedDeptName) === normDeptName) ||
          (selectedDeptFromTeam && normalizeText(selectedDeptFromTeam) === normDeptName);

        const themeColor = matchingTeam?.themeColor || deptInfo?.accentColor || '#8B251E';

        // Estilos de relleno y borde diferenciados por departamento
        let fillStyle = '#FAF8F4';
        let strokeStyle = '#D1CBC3';
        let strokeWidth = 0.9;
        let filterStyle = undefined;

        if (isExplicitlySelected) {
          // Subrayado / Realce máximo del departamento seleccionado
          fillStyle = `${themeColor}40`;
          strokeStyle = themeColor;
          strokeWidth = 3.2;
          filterStyle = 'url(#active-dept-glow)';
        } else if (hasActiveMission) {
          // Departamento con misión activa
          fillStyle = `${themeColor}22`;
          strokeStyle = themeColor;
          strokeWidth = 1.8;
        }

        return (
          <g key={dept.id} className="dept-group group">
            <path
              d={dept.d}
              fill={fillStyle}
              stroke={strokeStyle}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter={filterStyle}
              className="transition-all duration-200 cursor-pointer hover:fill-[#FED7AA]/60 hover:stroke-[#E67324] hover:stroke-[2.2px]"
              onMouseEnter={() => onHoverDept?.(dept.name)}
              onMouseLeave={() => onHoverDept?.(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectDept?.(dept.name);
                if (matchingTeam && onSelectTeam) {
                  onSelectTeam(matchingTeam);
                }
              }}
            >
              <title>
                {dept.name}
                {hasActiveMission ? ` • Misión Activa: ${matchingTeam?.name} (${matchingTeam?.ethnicity})` : ''}
              </title>
            </path>
          </g>
        );
      })}
    </g>
  );
};
