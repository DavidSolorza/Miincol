/**
 * Dominio de Autenticación y Equipos de Misión
 */

// Rol operativo dentro de la plataforma (administrador nacional o equipo territorial)
export type UserRole = 'admin' | 'team';

// Información estructural de un equipo misionero territorial
export interface MissionaryTeam {
  id: string;
  name: string;
  ethnicity: string;
  region: string;
  leader: string;
  members: string[];
  themeColor?: string;
  leaderPhone?: string;
}

// Datos de la sesión activa del usuario autenticado
export interface UserSession {
  userId: string;
  userName: string;
  email: string;
  role: 'Líder Ministerial' | 'Misionero en Campo' | 'Coordinador Nacional';
  activeTeamId: string;
}
