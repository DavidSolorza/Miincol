import React from 'react';
import type { TeamSupervisionSummary } from '../../domain/admin.types';
import departmentsData from './data/colombiaDepartments.json';

interface DepartmentPath {
  id: string;
  name: string;
  d: string;
}

interface Props {
  teams: TeamSupervisionSummary[];
  hoveredDeptId?: string | null;
  onHoverDept?: (name: string | null) => void;
}

const DEPARTMENTS = departmentsData as DepartmentPath[];

export const ColombiaMapDepartments: React.FC<Props> = ({
  teams,
  hoveredDeptId,
  onHoverDept,
}) => {
  return (
    <g className="transition-all duration-300">
      {DEPARTMENTS.map((dept) => {
        const matchingTeam = teams.find((t) =>
          t.department.toLowerCase().includes(dept.name.toLowerCase()) ||
          dept.name.toLowerCase().includes(t.department.split(' ')[0].toLowerCase())
        );

        const hasActiveMission = Boolean(matchingTeam);
        const isHovered = hoveredDeptId === dept.id;
        const themeColor = matchingTeam?.themeColor || '#E67324';

        const fillStyle = isHovered
          ? 'rgba(230, 115, 36, 0.26)'
          : hasActiveMission
          ? `${themeColor}22`
          : 'rgba(255, 255, 255, 0.45)';

        const strokeStyle = hasActiveMission
          ? `${themeColor}99`
          : 'rgba(168, 162, 158, 0.38)';

        return (
          <path
            key={dept.id}
            d={dept.d}
            fill={fillStyle}
            stroke={strokeStyle}
            strokeWidth={hasActiveMission || isHovered ? 1.1 : 0.75}
            strokeLinejoin="round"
            className="transition-colors duration-200 cursor-pointer hover:opacity-90"
            onMouseEnter={() => onHoverDept?.(dept.name)}
            onMouseLeave={() => onHoverDept?.(null)}
          >
            <title>
              {dept.name}
              {hasActiveMission ? ` • Misión activa: ${matchingTeam?.name}` : ''}
            </title>
          </path>
        );
      })}
    </g>
  );
};
