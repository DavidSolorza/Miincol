/**
 * Dominio de Autenticación y Equipos de Misión
 */

export interface MissionaryTeam {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  leader: string;
  members: string[];
}

export interface UserSession {
  userId: string;
  userName: string;
  email: string;
  role: 'Líder Ministerial' | 'Misionero en Campo' | 'Coordinador Nacional';
  activeTeamId: string;
}
