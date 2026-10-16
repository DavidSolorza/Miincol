import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TeamNote, NoteCategory } from '../domain/notes.types';
import { getInitialTeamNotes } from './initialTeamNotes';
import { serviceBus } from '../../../core/bus';

export const useTeamNotes = (teamId: string, teamName: string, leader: string) => {
  const storageKey = `misincol_team_notes_${teamId}`;

  const [notes, setNotes] = useState<TeamNote[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback a iniciales
    }
    return getInitialTeamNotes(teamId, teamName, leader);
  });

  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setNotes(saved ? JSON.parse(saved) : getInitialTeamNotes(teamId, teamName, leader));
    } catch {
      setNotes(getInitialTeamNotes(teamId, teamName, leader));
    }
  }, [teamId, teamName, leader, storageKey]);

  const saveNotes = useCallback((updated: TeamNote[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Error guardando notas:', err);
    }
  }, [storageKey]);

  const addNote = useCallback((title: string, content: string, category: NoteCategory, isPinned = false) => {
    const newNote: TeamNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      teamId,
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
      author: leader || 'Misionero',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveNotes([newNote, ...notes]);
    serviceBus.publish('ui:toast', { message: 'Nota agregada a la agenda territorial', type: 'success' });
  }, [teamId, leader, notes, saveNotes]);

  const togglePin = useCallback((id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    saveNotes(updated);
  }, [notes, saveNotes]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    serviceBus.publish('ui:toast', { message: 'Nota eliminada', type: 'info' });
  }, [notes, saveNotes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesCat = selectedCategory === 'all' || n.category === selectedCategory;
        const matchesQuery =
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notes, selectedCategory, searchTerm]);

  return { notes, filteredNotes, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, addNote, togglePin, deleteNote };
};
