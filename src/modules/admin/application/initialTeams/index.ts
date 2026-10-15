import { wayuuTeam } from './wayuuTeam';
import { nasaTeam } from './nasaTeam';
import { pastosTeam } from './pastosTeam';
import { emberaTeam } from './emberaTeam';
import { arhuacoTeam } from './arhuacoTeam';
import { nukakTeam } from './nukakTeam';
import type { TeamSupervisionSummary } from '../../domain/admin.types';

export const INITIAL_NATIONAL_TEAMS: TeamSupervisionSummary[] = [
  wayuuTeam,
  nasaTeam,
  pastosTeam,
  emberaTeam,
  arhuacoTeam,
  nukakTeam,
];
