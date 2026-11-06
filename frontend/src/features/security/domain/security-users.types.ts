import type { SystemRoleId } from './security.types';

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: SystemRoleId;
  teamId?: string;
  teamName: string;
  phone?: string;
  territory?: string;
  avatarSeed?: string;
}

export const USER_ROLE_OPTIONS: Array<{
  id: SystemRoleId;
  label: string;
  badgeClass: string;
}> = [
  {
    id: 'team_member',
    label: 'Usuario equipo',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'team_leader',
    label: 'Líder equipo',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  {
    id: 'national_director',
    label: 'Director nacional',
    badgeClass: 'bg-stone-900 text-[#E67324] border-stone-800',
  },
];
