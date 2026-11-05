import type { TeamNote } from '../domain/notes.types';

// Genera las notas iniciales por defecto para la agenda territorial de un equipo misionero
export const getInitialTeamNotes = (teamId: string, teamName: string, leader: string): TeamNote[] => {
  const now = new Date().toISOString();
  return [
    {
      id: `note-${teamId}-1`,
      teamId,
      title: `Prioridad pastoral y territorial - ${teamName}`,
      content: `Consolidar el equipo de obreros locales y revisar avances de la cartografía social con las autoridades tradicionales de la comunidad.`,
      category: 'urgente',
      isPinned: true,
      author: leader,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `note-${teamId}-2`,
      teamId,
      title: 'Idea de capacitación bíblica contextualizada',
      content: 'Elaborar módulos de discipulado con relatos orales y vocabulario bíblico en la lengua originaria.',
      category: 'idea',
      isPinned: false,
      author: 'Equipo Misionero',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `note-${teamId}-3`,
      teamId,
      title: 'Motivo de Oración por los ancianos y jóvenes',
      content: 'Orar por apertura de nuevos hogares de paz y protección espiritual durante los recorridos entre veredas y asentamientos.',
      category: 'oracion',
      isPinned: false,
      author: leader,
      createdAt: now,
      updatedAt: now,
    },
  ];
};
