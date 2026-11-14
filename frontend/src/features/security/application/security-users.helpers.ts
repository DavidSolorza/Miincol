import type { SystemUser } from '../domain/security-users.types';

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-hugo-1',
    fullName: 'Hugo Solorza',
    email: 'hudisapastos@misincol.org',
    role: 'national_director',
    territory: 'Nacional • Colombia',
  },
];
