// Catálogo de equipos iniciales sincronizado con base de datos nacional
import { wayuuTeam } from './wayuuTeam';
import { nasaTeam } from './nasaTeam';
import { pastosTeam } from './pastosTeam';
import { emberaTeam } from './emberaTeam';
import { arhuacoTeam } from './arhuacoTeam';
import { nukakTeam } from './nukakTeam';
import type { TeamSupervisionSummary } from '../../domain/admin.types';

export const INITIAL_NATIONAL_TEAMS: TeamSupervisionSummary[] = [
  pastosTeam,
  wayuuTeam,
  nasaTeam,
  emberaTeam,
  arhuacoTeam,
  nukakTeam,
];

export const FIXTURE_NATIONAL_TEAMS: TeamSupervisionSummary[] = [
  pastosTeam,
  wayuuTeam,
  nasaTeam,
  emberaTeam,
  arhuacoTeam,
  nukakTeam,
];
