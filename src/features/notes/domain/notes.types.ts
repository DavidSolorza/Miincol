export type NoteCategory = 'idea' | 'actividad' | 'oracion' | 'urgente' | 'general';

export interface TeamNote {
  id: string;
  teamId: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCategoryConfig {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const NOTE_CATEGORIES: Record<NoteCategory, NoteCategoryConfig> = {
  idea: { label: 'Idea / Propuesta', bgClass: 'bg-amber-50', textClass: 'text-amber-800', borderClass: 'border-amber-200' },
  actividad: { label: 'Actividad PDM', bgClass: 'bg-emerald-50', textClass: 'text-emerald-800', borderClass: 'border-emerald-200' },
  oracion: { label: 'Petición Oración', bgClass: 'bg-indigo-50', textClass: 'text-indigo-800', borderClass: 'border-indigo-200' },
  urgente: { label: 'Urgente / Alerta', bgClass: 'bg-rose-50', textClass: 'text-rose-800', borderClass: 'border-rose-200' },
  general: { label: 'Apunte de Campo', bgClass: 'bg-stone-100', textClass: 'text-stone-700', borderClass: 'border-stone-200' },
};
