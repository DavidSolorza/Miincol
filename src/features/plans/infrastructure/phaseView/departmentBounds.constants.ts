/**
 * Colombian Departments Geographic Bounding Boxes for High-Precision SVG Zoom
 * Aligned with Technical Governance Contract v2026.4.0 (< 150 lines)
 */

export interface DepartmentBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export const DEPARTMENT_BOUNDS: Record<string, DepartmentBoundingBox> = {
  CONAR: { minX: 20, minY: 387, maxX: 109, maxY: 479, width: 89, height: 92 },
  COPUT: { minX: 93, minY: 436, maxX: 231, maxY: 514, width: 138, height: 78 },
  COCHO: { minX: 66, minY: 153, maxX: 142, maxY: 336, width: 76, height: 183 },
  COGUA: { minX: 352, minY: 334, maxX: 517, maxY: 446, width: 165, height: 112 },
  COVAU: { minX: 306, minY: 410, maxX: 424, maxY: 540, width: 119, height: 130 },
  COAMA: { minX: 208, minY: 487, maxX: 413, maxY: 657, width: 205, height: 170 },
  COLAG: { minX: 240, minY: 5, maxX: 344, maxY: 86, width: 104, height: 81 },
  COCES: { minX: 220, minY: 68, maxX: 270, maxY: 192, width: 50, height: 124 },
  CONSA: { minX: 240, minY: 129, maxX: 307, maxY: 224, width: 67, height: 94 },
  COARA: { minX: 293, minY: 215, maxX: 412, maxY: 257, width: 119, height: 42 },
  COBOY: { minX: 198, minY: 217, maxX: 309, maxY: 310, width: 110, height: 93 },
  COVID: { minX: 345, minY: 246, maxX: 495, maxY: 383, width: 149, height: 138 },
  COCAU: { minX: 52, minY: 363, maxX: 152, maxY: 454, width: 100, height: 92 },
  COVAC: { minX: 83, minY: 295, maxX: 155, maxY: 371, width: 73, height: 76 },
  COANT: { minX: 97, minY: 146, maxX: 230, maxY: 280, width: 133, height: 134 },
  COCOR: { minX: 123, minY: 123, maxX: 192, maxY: 205, width: 70, height: 81 },
  COSUC: { minX: 155, minY: 96, maxX: 203, maxY: 169, width: 48, height: 73 },
  COBOL: { minX: 155, minY: 70, maxX: 235, maxY: 219, width: 80, height: 149 },
  COATL: { minX: 173, minY: 59, maxX: 196, maxY: 91, width: 22, height: 32 },
  COMAG: { minX: 186, minY: 49, maxX: 243, maxY: 145, width: 57, height: 97 },
  COSAP: { minX: -91, minY: -38, maxX: -24, maxY: 4, width: 67, height: 42 },
  COCAQ: { minX: 131, minY: 377, maxX: 335, maxY: 519, width: 204, height: 142 },
  COHUI: { minX: 119, minY: 345, maxX: 205, maxY: 431, width: 86, height: 86 },
  COGUV: { minX: 239, minY: 379, maxX: 389, maxY: 466, width: 151, height: 88 },
  COCAL: { minX: 146, minY: 266, maxX: 199, maxY: 305, width: 53, height: 38 },
  COCAS: { minX: 263, minY: 244, maxX: 395, maxY: 324, width: 132, height: 80 },
  COMET: { minX: 188, minY: 300, maxX: 346, maxY: 429, width: 157, height: 129 },
  CODC: { minX: 205, minY: 303, maxX: 225, maxY: 349, width: 20, height: 45 },
  COSAN: { minX: 204, minY: 173, maxX: 288, maxY: 269, width: 84, height: 96 },
  COTOL: { minX: 139, minY: 285, maxX: 206, maxY: 379, width: 67, height: 95 },
  COQUI: { minX: 148, minY: 308, maxX: 168, maxY: 333, width: 21, height: 25 },
  COCUN: { minX: 189, minY: 265, maxX: 264, maxY: 347, width: 75, height: 83 },
  CORIS: { minX: 136, minY: 274, maxX: 169, maxY: 310, width: 33, height: 35 },
};
