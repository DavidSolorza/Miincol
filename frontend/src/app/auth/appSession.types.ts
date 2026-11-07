export interface AuthSession {
  role: 'admin' | 'director_general' | 'team' | 'member';
  teamId?: string;
  userName: string;
}

export const STORAGE_KEY_AUTH = 'misincol_auth_session';
