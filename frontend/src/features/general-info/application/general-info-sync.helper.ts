import type { TeamGeneralInfo } from '../domain/general-info.types';
import { httpClient } from '../../../core/http/httpClient';

export interface RemoteFieldReport {
  id: string;
  teamId: string;
  year: number;
  firstTimeContacts?: number;
  interestedPeople?: number;
  heardGospel?: number;
  seekingGodPeople?: number;
  gospelResponseOpportunities?: number;
  believersCount?: number;
  baptizedCount?: number;
  activeBibleStudies?: number;
  personalMentorships?: number;
  newGroupsMeetingInYear?: number;
  churchPerspectiveGroups?: number;
  finalChurchesCount?: number;
  churchGenerations?: number;
  ministerialTrainingCount?: number;
}

export async function syncGeneralInfoToBackend(info: TeamGeneralInfo): Promise<void> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
  if (!token) return;

  const year = Number(info.teamData?.year) || 2026;
  const teamId = info.teamId;

  const reportPayload = {
    teamId,
    year,
    firstTimeContacts: Number(info.fieldMetrics?.firstTimeContactedCount) || 0,
    interestedPeople: Number(info.fieldMetrics?.interestedInGospelCount) || 0,
    heardGospel: Number(info.fieldMetrics?.heardGospelCount) || 0,
    seekingGodPeople: Number(info.fieldMetrics?.seekingGodCount) || 0,
    gospelResponseOpportunities: Number(info.fieldMetrics?.gospelResponseOpportunitiesCount) || 0,
    believersCount: Number(info.fieldMetrics?.newBelieversCount) || 0,
    baptizedCount: Number(info.fieldMetrics?.baptizedCount) || 0,
    activeBibleStudies: Number(info.fieldMetrics?.regularBibleStudyParticipantsCount) || 0,
    personalMentorships: Number(info.fieldMetrics?.personalMentorshipCount) || 0,
    newGroupsMeetingInYear: Number(info.fieldMetrics?.newGroupsMeetingInYearCount) || 0,
    churchPerspectiveGroups: Number(info.churchDevelopment?.groupsWithChurchPerspectiveCount) || 0,
    finalChurchesCount: Number(info.churchDevelopment?.finalChurchesCount) || 0,
    churchGenerations: Number(info.churchDevelopment?.firstGenChurchesCount) || 0,
    ministerialTrainingCount: Number(info.ministerialTraining?.practicalMinisterialTrainingCount) || 0,
  };

  try {
    const existing = await httpClient.get<RemoteFieldReport[]>('/reports', {
      queryParams: { teamId, year },
    }).catch(() => [] as RemoteFieldReport[]);

    if (Array.isArray(existing) && existing.length > 0 && existing[0]?.id) {
      await httpClient.put(`/reports/${existing[0].id}`, reportPayload);
    } else {
      await httpClient.post('/reports', reportPayload);
    }
  } catch (err) {
    console.warn('[GeneralInfoSync] Advertencia sincronizando informe de campo:', err);
  }

  try {
    const pop = parseInt(String(info.teamData?.population || '0').replace(/[^0-9]/g, ''), 10) || 0;
    await httpClient.patch(`/teams/${teamId}`, {
      population: pop,
      evangelicaCongregations: Number(info.teamData?.evangelicalCongregationsCount) || 0,
      evangelicalsCount: Number(info.teamData?.evangelicalBelieversCount) || 0,
    });
  } catch {
    // Si el usuario no tiene rol nacional, el servidor retornará 403 lo cual es esperado para líderes
  }
}

export async function fetchRemoteGeneralInfo(
  teamId: string,
  year: number
): Promise<Partial<TeamGeneralInfo> | null> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('misincol_auth_token') : null;
  if (!token) return null;

  try {
    const reports = await httpClient.get<RemoteFieldReport[]>('/reports', {
      queryParams: { teamId, year },
    }).catch(() => [] as RemoteFieldReport[]);

    if (!Array.isArray(reports) || reports.length === 0 || !reports[0]) return null;
    const r = reports[0];

    return {
      fieldMetrics: {
        firstTimeContactedCount: r.firstTimeContacts || 0,
        interestedInGospelCount: r.interestedPeople || 0,
        heardGospelCount: r.heardGospel || 0,
        seekingGodCount: r.seekingGodPeople || 0,
        gospelResponseOpportunitiesCount: r.gospelResponseOpportunities || 0,
        newBelieversCount: r.believersCount || 0,
        baptizedCount: r.baptizedCount || 0,
        regularBibleStudyParticipantsCount: r.activeBibleStudies || 0,
        personalMentorshipCount: r.personalMentorships || 0,
        newGroupsMeetingInYearCount: r.newGroupsMeetingInYear || 0,
      },
      churchDevelopment: {
        groupsWithChurchPerspectiveCount: r.churchPerspectiveGroups || 0,
        finalChurchesCount: r.finalChurchesCount || 0,
        firstGenChurchesCount: r.churchGenerations || 0,
        secondGenChurchesCount: 0,
        thirdGenChurchesCount: 0,
        lostFirstGenChurchesCount: 0,
        lostSecondGenChurchesCount: 0,
        lostThirdGenChurchesCount: 0,
      },
      ministerialTraining: {
        practicalMinisterialTrainingCount: r.ministerialTrainingCount || 0,
        otherAreasTrainingCount: 0,
        pastoralPracticalTrainingCount: 0,
        biblicalTrainingCount: 0,
        newChurchesPlantingTrainingCount: 0,
      },
    };
  } catch {
    return null;
  }
}
