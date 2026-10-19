/**
 * Hook for High-Precision SVG ViewBox & Spatial Neighbor Calculation
 * Aligned with Technical Governance Contract v2026.4.0 (< 150 lines)
 */

import { useMemo } from 'react';
import { DEPARTMENT_BOUNDS } from './departmentBounds.constants';

export interface DepartmentPath {
  id: string;
  name: string;
  d: string;
}

export interface VisibleNeighbor {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface ZoomViewBoxResult {
  viewBox: string;
  viewBoxBox: { x: number; y: number; size: number };
  visibleNeighbors: VisibleNeighbor[];
}

export const useDepartmentZoomViewBox = (
  departmentId: string,
  departments: DepartmentPath[]
): ZoomViewBoxResult => {
  return useMemo(() => {
    const bounds = DEPARTMENT_BOUNDS[departmentId];
    if (!bounds) {
      return { viewBox: '0 0 520 660', viewBoxBox: { x: 0, y: 0, size: 520 }, visibleNeighbors: [] };
    }

    const padding = 26;
    const maxDimension = Math.max(bounds.width, bounds.height);
    const boxSize = Math.round(maxDimension + padding * 2);
    const centerX = bounds.minX + bounds.width / 2;
    const centerY = bounds.minY + bounds.height / 2;
    const x = Math.round(centerX - boxSize / 2);
    const y = Math.round(centerY - boxSize / 2);

    const neighbors = departments
      .filter((d) => {
        if (d.id === departmentId) return false;
        const nb = DEPARTMENT_BOUNDS[d.id];
        if (!nb) return false;
        return nb.minX < x + boxSize && nb.maxX > x && nb.minY < y + boxSize && nb.maxY > y;
      })
      .map((d) => {
        const nb = DEPARTMENT_BOUNDS[d.id]!;
        const cx = nb.minX + nb.width / 2;
        const cy = nb.minY + nb.height / 2;
        return {
          id: d.id,
          name: d.name.toUpperCase(),
          x: Math.max(x + 8, Math.min(x + boxSize - 8, cx)),
          y: Math.max(y + 8, Math.min(y + boxSize - 8, cy)),
        };
      });

    return {
      viewBox: `${x} ${y} ${boxSize} ${boxSize}`,
      viewBoxBox: { x, y, size: boxSize },
      visibleNeighbors: neighbors,
    };
  }, [departmentId, departments]);
};
