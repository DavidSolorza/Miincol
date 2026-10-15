import { useState, useEffect } from 'react';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { verifyAuthCredentials } from './verifyAuthCredentials';

interface Props {
  allTeams: TeamSupervisionSummary[];
  onAdminSuccess: () => void;
  onTeamSuccess: (team: TeamSupervisionSummary) => void;
}

export const useLoginForm = ({ allTeams, onAdminSuccess, onTeamSuccess }: Props) => {
  const initial = allTeams[0];
  const [activeTab, setActiveTab] = useState<'admin' | 'team'>('team');
  const [identifier, setIdentifier] = useState(initial ? initial.slug || initial.id : 'team-wayuu');
  const [password, setPassword] = useState(initial?.accessPin || 'wayuu2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuickChip, setSelectedQuickChip] = useState(() =>
    initial ? (initial.slug || initial.id).replace(/^team-/, '').toLowerCase() : 'wayuu'
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug') || params.get('user') || params.get('equipo') || '';
    const pass = params.get('pass') || params.get('password') || params.get('clave') || '';
    if (slug) {
      setIdentifier(slug);
      setActiveTab(slug.toLowerCase() === 'admin' ? 'admin' : 'team');
      setSelectedQuickChip(slug.toLowerCase());
    }
    if (pass) setPassword(pass);
    if (slug && pass) {
      verifyAuthCredentials({
        activeTab: slug.toLowerCase() === 'admin' ? 'admin' : 'team',
        identifier: slug,
        password: pass,
        allTeams,
        onAdminSuccess,
        onTeamSuccess,
        onError: setError,
        onDone: () => setLoading(false),
      });
    }
  }, [allTeams, onAdminSuccess, onTeamSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    verifyAuthCredentials({
      activeTab,
      identifier,
      password,
      allTeams,
      onAdminSuccess,
      onTeamSuccess,
      onError: setError,
      onDone: () => setLoading(false),
    });
  };

  const fillCredentials = (type: 'admin' | 'team', user: string, pass: string, chip: string) => {
    setActiveTab(type);
    setSelectedQuickChip(chip);
    setError(null);
    setPassword(pass);
    if (type === 'team') {
      const target = user.trim().toLowerCase();
      const matched = allTeams.find(
        (t) => t.slug?.toLowerCase() === target || t.id.toLowerCase() === target || t.ethnicity.toLowerCase().includes(target)
      );
      setIdentifier(matched ? matched.slug || matched.id : user);
      if (matched?.accessPin) setPassword(matched.accessPin);
    } else {
      setIdentifier(user);
    }
  };

  return {
    activeTab, setActiveTab,
    identifier, setIdentifier,
    password, setPassword,
    showPassword, setShowPassword,
    loading, error,
    selectedQuickChip, setSelectedQuickChip,
    handleSubmit, fillCredentials,
  };
};
