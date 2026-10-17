/**
 * Módulo de Georreferenciación y Localización Territorial de Colombia
 * Proporciona mapeo exacto de los 33 departamentos y municipios clave para el mapa SVG (viewBox 0 0 520 660).
 */

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  center: { x: number; y: number };
  accentColor: string;
}

export const COLOMBIA_DEPARTMENTS: DepartmentInfo[] = [
  { id: 'CONAR', name: 'Nariño', code: 'NAR', center: { x: 64, y: 433 }, accentColor: '#2563EB' },
  { id: 'COLAG', name: 'La Guajira', code: 'LAG', center: { x: 292, y: 46 }, accentColor: '#8B251E' },
  { id: 'COCES', name: 'Cesar', code: 'CES', center: { x: 245, y: 130 }, accentColor: '#D97706' },
  { id: 'COCAU', name: 'Cauca', code: 'CAU', center: { x: 102, y: 408 }, accentColor: '#E67324' },
  { id: 'CORIS', name: 'Risaralda', code: 'RIS', center: { x: 152, y: 292 }, accentColor: '#7C3AED' },
  { id: 'COGUV', name: 'Guaviare', code: 'GUV', center: { x: 314, y: 420 }, accentColor: '#059669' },
  { id: 'COCHO', name: 'Chocó', code: 'CHO', center: { x: 104, y: 245 }, accentColor: '#0D9488' },
  { id: 'COAMA', name: 'Amazonas', code: 'AMA', center: { x: 311, y: 572 }, accentColor: '#16A34A' },
  { id: 'COPUT', name: 'Putumayo', code: 'PUT', center: { x: 162, y: 475 }, accentColor: '#4F46E5' },
  { id: 'COVAU', name: 'Vaupés', code: 'VAU', center: { x: 365, y: 475 }, accentColor: '#0284C7' },
  { id: 'COGUA', name: 'Guainía', code: 'GUA', center: { x: 434, y: 390 }, accentColor: '#0891B2' },
  { id: 'COVID', name: 'Vichada', code: 'VID', center: { x: 420, y: 314 }, accentColor: '#EA580C' },
  { id: 'COARA', name: 'Arauca', code: 'ARA', center: { x: 352, y: 236 }, accentColor: '#CA8A04' },
  { id: 'COCAS', name: 'Casanare', code: 'CAS', center: { x: 329, y: 284 }, accentColor: '#65A30D' },
  { id: 'COMET', name: 'Meta', code: 'MET', center: { x: 267, y: 364 }, accentColor: '#15803D' },
  { id: 'COBOY', name: 'Boyacá', code: 'BOY', center: { x: 253, y: 264 }, accentColor: '#0369A1' },
  { id: 'COSAN', name: 'Santander', code: 'SAN', center: { x: 246, y: 221 }, accentColor: '#B91C1C' },
  { id: 'CONSA', name: 'Norte de Santander', code: 'NSA', center: { x: 274, y: 176 }, accentColor: '#C026D3' },
  { id: 'COANT', name: 'Antioquia', code: 'ANT', center: { x: 164, y: 213 }, accentColor: '#059669' },
  { id: 'COCOR', name: 'Córdoba', code: 'COR', center: { x: 158, y: 164 }, accentColor: '#9333EA' },
  { id: 'COSUC', name: 'Sucre', code: 'SUC', center: { x: 179, y: 132 }, accentColor: '#D97706' },
  { id: 'COBOL', name: 'Bolívar', code: 'BOL', center: { x: 195, y: 144 }, accentColor: '#E11D48' },
  { id: 'COATL', name: 'Atlántico', code: 'ATL', center: { x: 184, y: 75 }, accentColor: '#2563EB' },
  { id: 'COMAG', name: 'Magdalena', code: 'MAG', center: { x: 215, y: 97 }, accentColor: '#4338CA' },
  { id: 'COCAQ', name: 'Caquetá', code: 'CAQ', center: { x: 233, y: 448 }, accentColor: '#047857' },
  { id: 'COHUI', name: 'Huila', code: 'HUI', center: { x: 162, y: 388 }, accentColor: '#B45309' },
  { id: 'COTOL', name: 'Tolima', code: 'TOL', center: { x: 172, y: 332 }, accentColor: '#9D174D' },
  { id: 'COCAL', name: 'Caldas', code: 'CAL', center: { x: 173, y: 286 }, accentColor: '#047857' },
  { id: 'COQUI', name: 'Quindío', code: 'QUI', center: { x: 158, y: 320 }, accentColor: '#4D7C0F' },
  { id: 'COVAC', name: 'Valle del Cauca', code: 'VAC', center: { x: 119, y: 333 }, accentColor: '#1D4ED8' },
  { id: 'COCUN', name: 'Cundinamarca', code: 'CUN', center: { x: 226, y: 306 }, accentColor: '#6D28D9' },
  { id: 'CODC', name: 'Bogotá D.C.', code: 'DC', center: { x: 215, y: 326 }, accentColor: '#BE123C' },
  { id: 'COSAP', name: 'San Andrés y Providencia', code: 'SAP', center: { x: 90, y: 20 }, accentColor: '#0284C7' },
];

export const MUNICIPALITY_LOCATIONS: Record<string, { x: number; y: number; department: string; label: string }> = {
  // Nariño (Cumbal, Chiles, Panán, Ipiales, Pasto)
  cumbal: { x: 62, y: 440, department: 'Nariño', label: 'Cumbal, Nariño' },
  chiles: { x: 58, y: 442, department: 'Nariño', label: 'Chiles, Nariño' },
  panan: { x: 65, y: 440, department: 'Nariño', label: 'Panán, Nariño' },
  ipiales: { x: 70, y: 438, department: 'Nariño', label: 'Ipiales, Nariño' },
  pasto: { x: 74, y: 422, department: 'Nariño', label: 'Pasto, Nariño' },
  tumaco: { x: 42, y: 424, department: 'Nariño', label: 'Tumaco, Nariño' },
  ricaurte: { x: 52, y: 432, department: 'Nariño', label: 'Ricaurte, Nariño' },

  // La Guajira (Uribia, Nazaret, Manaure, Riohacha, Maicao)
  uribia: { x: 295, y: 35, department: 'La Guajira', label: 'Uribia, La Guajira' },
  nazaret: { x: 318, y: 18, department: 'La Guajira', label: 'Nazaret, La Guajira' },
  manaure: { x: 275, y: 45, department: 'La Guajira', label: 'Manaure, La Guajira' },
  'alta guajira': { x: 305, y: 25, department: 'La Guajira', label: 'Alta Guajira' },
  riohacha: { x: 260, y: 55, department: 'La Guajira', label: 'Riohacha, La Guajira' },
  maicao: { x: 288, y: 52, department: 'La Guajira', label: 'Maicao, La Guajira' },

  // Risaralda (Pueblo Rico, Gitó Dokabú, Mistrató, Pereira)
  'pueblo rico': { x: 152, y: 292, department: 'Risaralda', label: 'Pueblo Rico, Risaralda' },
  'gito dokabu': { x: 150, y: 290, department: 'Risaralda', label: 'Gitó Dokabú, Risaralda' },
  mistrato: { x: 154, y: 286, department: 'Risaralda', label: 'Mistrató, Risaralda' },
  pereira: { x: 158, y: 300, department: 'Risaralda', label: 'Pereira, Risaralda' },

  // Cauca (Toribío, Silvia, Tierradentro, Popayán, Belalcázar, Inzá)
  toribio: { x: 108, y: 395, department: 'Cauca', label: 'Toribío, Cauca' },
  silvia: { x: 102, y: 405, department: 'Cauca', label: 'Silvia, Cauca' },
  tierradentro: { x: 114, y: 400, department: 'Cauca', label: 'Tierradentro, Cauca' },
  belalcazar: { x: 116, y: 402, department: 'Cauca', label: 'Belalcázar, Cauca' },
  inza: { x: 112, y: 402, department: 'Cauca', label: 'Inzá, Cauca' },
  popayan: { x: 98, y: 412, department: 'Cauca', label: 'Popayán, Cauca' },
  paez: { x: 116, y: 398, department: 'Cauca', label: 'Páez, Cauca' },

  // Guaviare (San José, Selva Nukak, El Retorno, Charras)
  'san jose del guaviare': { x: 300, y: 405, department: 'Guaviare', label: 'San José del Guaviare' },
  'selva de guaviare': { x: 314, y: 420, department: 'Guaviare', label: 'Selva de Guaviare' },
  'el retorno': { x: 315, y: 430, department: 'Guaviare', label: 'El Retorno, Guaviare' },
  charras: { x: 320, y: 415, department: 'Guaviare', label: 'Charras, Guaviare' },
  calamar: { x: 295, y: 445, department: 'Guaviare', label: 'Calamar, Guaviare' },

  // Cesar / Magdalena (Sierra Nevada, Pueblo Bello, Valledupar, Nabusímake)
  nabusimake: { x: 240, y: 95, department: 'Cesar', label: 'Nabusímake, Cesar' },
  'pueblo bello': { x: 242, y: 102, department: 'Cesar', label: 'Pueblo Bello, Cesar' },
  'sierra nevada': { x: 238, y: 92, department: 'Cesar', label: 'Sierra Nevada, Cesar' },
  valledupar: { x: 250, y: 115, department: 'Cesar', label: 'Valledupar, Cesar' },

  // Chocó (Quibdó, Alto Baudó, Riosucio)
  quibdo: { x: 102, y: 252, department: 'Chocó', label: 'Quibdó, Chocó' },
  'alto baudo': { x: 92, y: 268, department: 'Chocó', label: 'Alto Baudó, Chocó' },
  riosucio: { x: 98, y: 195, department: 'Chocó', label: 'Riosucio, Chocó' },

  // Amazonas (Leticia, Puerto Nariño)
  leticia: { x: 388, y: 648, department: 'Amazonas', label: 'Leticia, Amazonas' },
  'puerto nariño': { x: 375, y: 642, department: 'Amazonas', label: 'Puerto Nariño, Amazonas' },
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

  // Exact or partial match
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

  // 3. Fallback for custom or legacy teams: assign to a safe center position (Cundinamarca/Bogotá center)
  return {
    x: 226,
    y: 306,
    departmentId: 'COCUN',
    departmentName: 'Cundinamarca',
    locationLabel: team.region || 'Territorio Nacional',
    accentColor: '#8B251E',
  };
};
