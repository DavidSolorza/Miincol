export interface AuthSession {
  role: 'admin' | 'team';
  teamId?: string;
  userName: string;
}

export const STORAGE_KEY_AUTH = 'misincol_auth_session';
