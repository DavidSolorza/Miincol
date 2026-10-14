import { useState } from 'react';
import type { MissionaryTeam, UserSession } from '../domain/auth.types';

export const TEAMS_CATALOG: MissionaryTeam[] = [
  {
    id: 'team-wayuu',
    name: 'Misión Wayuu - Alta Guajira',
    ethnicity: 'Wayuu',
    region: 'La Guajira (Uribia, Manaure y Nazaret)',
    leader: 'Pr. David Morales',
    members: ['David Morales', 'Carlos Pushaina', 'Dra. Ruth Mendoza', 'Marcela Uriana'],
  },
  {
    id: 'team-nasa',
    name: 'Misión Nasa - Tierradentro',
    ethnicity: 'Nasa (Páez)',
    region: 'Cauca (Belalcázar e Inzá)',
    leader: 'Pr. Marcos Chocué',
    members: ['Marcos Chocué', 'Aída Secue', 'Santiago Ramos'],
  },
  {
    id: 'team-arhuaco',
    name: 'Misión Iku - Sierra Nevada',
    ethnicity: 'Arhuaco (Iku)',
    region: 'Cesar / Magdalena (Nabusímake)',
    leader: 'Pr. Eliécer Torres',
    members: ['Eliécer Torres', 'Misael Izquierdo', 'Lucía Villafaña'],
  },
  {
    id: 'team-embera',
    name: 'Misión Emberá Chamí - Risaralda',
    ethnicity: 'Emberá',
    region: 'Pueblo Rico / Mistrató',
    leader: 'Pr. Daniel Guasaruka',
    members: ['Daniel Guasaruka', 'Claudia Nariquiamo', 'Esteban Forastero'],
  },
];

export const useAuth = () => {
  const [session, setSession] = useState<UserSession>({
    userId: 'usr-001',
    userName: 'Pr. David Morales',
    email: 'david.morales@misincol.org',
    role: 'Líder Ministerial',
    activeTeamId: 'team-wayuu',
  });

  const activeTeam = TEAMS_CATALOG.find((t) => t.id === session.activeTeamId) || TEAMS_CATALOG[0];

  const switchTeam = (teamId: string) => {
    setSession((prev) => ({
      ...prev,
      activeTeamId: teamId,
    }));
  };

  return {
    session,
    activeTeam,
    teams: TEAMS_CATALOG,
    switchTeam,
  };
};
