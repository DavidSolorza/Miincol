// Utilidades de proyección cartográfica para convertir latitud/longitud de Colombia a coordenadas SVG
export interface GeoCoord { // Par de coordenadas geográficas (latitud y longitud)
  lat: number;
  lng: number;
}

export const COLOMBIA_BOUNDS = { // Límites geográficos extremos del territorio continental e insular colombiano
  minLng: -79.5,
  maxLng: -66.8,
  minLat: -4.3,
  maxLat: 12.6,
};

export const projectCoordsToSvg = ( // Proyecta coordenadas GPS (lat, lng) dentro del lienzo SVG (520x660)
  lat: number,
  lng: number,
  width = 520,
  height = 660
): { x: number; y: number } => {
  const { minLng, maxLng, minLat, maxLat } = COLOMBIA_BOUNDS;
  const clampedLng = Math.max(minLng, Math.min(maxLng, lng));
  const clampedLat = Math.max(minLat, Math.min(maxLat, lat));

  const x = ((clampedLng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - clampedLat) / (maxLat - minLat)) * height;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
};
