// Trazos vectoriales de macro-regiones biogeográficas y ríos principales de Colombia
export interface RegionShape { // Geometría y estilo visual de una macro-región geográfica
  id: string;
  name: string;
  path: string;
  fill: string;
  stroke: string;
}

// Contorno y macro-regiones geográficas de Colombia en viewBox 0 0 520 660
export const COLOMBIA_MAINLAND_PATH =
  'M 295,15 C 315,10 338,28 322,48 C 305,62 288,78 280,105 C 275,128 290,140 295,160 C 300,185 340,195 365,190 C 395,185 435,210 445,235 C 455,260 480,280 475,310 C 470,335 440,360 430,385 C 418,415 410,460 385,485 C 360,510 350,555 330,590 C 315,618 305,650 288,648 C 270,645 255,610 240,580 C 220,550 170,520 150,490 C 130,460 70,470 55,445 C 45,425 65,395 72,365 C 80,330 75,290 85,255 C 92,230 115,205 130,175 C 145,150 170,140 185,120 C 205,95 240,75 255,50 C 270,25 280,18 295,15 Z';

export const COLOMBIA_REGIONS: RegionShape[] = [
  {
    id: 'caribe',
    name: 'Región Caribe',
    path: 'M 295,15 C 315,10 338,28 322,48 C 305,62 288,78 280,105 C 255,115 220,125 185,120 C 205,95 240,75 255,50 Z',
    fill: '#E0F2FE',
    stroke: '#BAE6FD',
  },
  {
    id: 'pacifica',
    name: 'Región Pacífica',
    path: 'M 185,120 C 170,140 145,150 130,175 C 115,205 92,230 85,255 C 75,290 80,330 72,365 C 65,395 45,425 55,445 C 80,430 110,380 120,330 C 130,280 145,220 165,160 Z',
    fill: '#DCFCE7',
    stroke: '#BBF7D0',
  },
  {
    id: 'andina',
    name: 'Región Andina (Cordilleras)',
    path: 'M 185,120 C 220,125 255,115 280,105 C 275,128 290,140 295,160 C 270,220 250,290 220,350 C 190,410 150,460 120,445 C 120,390 140,300 165,210 Z',
    fill: '#FEF3C7',
    stroke: '#FDE68A',
  },
  {
    id: 'orinoquia',
    name: 'Región Orinoquía (Llanos Orientales)',
    path: 'M 295,160 C 300,185 340,195 365,190 C 395,185 435,210 445,235 C 455,260 480,280 475,310 C 420,330 360,340 310,335 C 265,320 260,250 280,200 Z',
    fill: '#FFEDD5',
    stroke: '#FED7AA',
  },
  {
    id: 'amazonia',
    name: 'Región Amazonía',
    path: 'M 310,335 C 360,340 420,330 475,310 C 470,335 440,360 430,385 C 418,415 410,460 385,485 C 360,510 350,555 330,590 C 315,618 305,650 288,648 C 270,645 255,610 240,580 C 220,550 170,520 150,490 C 170,440 220,390 260,350 Z',
    fill: '#D1FAE5',
    stroke: '#A7F3D0',
  },
];

export const COLOMBIA_RIVERS = [
  'M 115,220 Q 140,290 165,380 T 175,440', // Río Cauca
  'M 220,130 Q 235,230 240,330 T 215,430', // Río Magdalena
  'M 270,350 Q 340,360 430,350', // Río Guaviare
  'M 220,530 Q 280,560 360,550', // Río Caquetá
];
