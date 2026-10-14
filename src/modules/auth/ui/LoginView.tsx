import React, { useState, useEffect } from 'react';
import type { TeamSupervisionSummary } from '../../admin/domain/admin.types';
import { MisincolLogo } from '../../../shared/components/MisincolLogo';
import {
  ShieldCheck,
  Compass,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  MessageCircle,
  KeyRound,
  User,
} from 'lucide-react';

interface LoginViewProps {
  onAdminSuccess: () => void;
  onTeamSuccess: (team: TeamSupervisionSummary) => void;
  allTeams: TeamSupervisionSummary[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onAdminSuccess,
  onTeamSuccess,
  allTeams,
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'team'>('team');
  const [identifier, setIdentifier] = useState<string>('wayuu');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-llenado o lectura desde parámetros URL (?slug=wayuu&pass=wayuu2026 o ?user=admin&pass=210910624Dj)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSlug =
      params.get('slug') ||
      params.get('user') ||
      params.get('usuario') ||
      params.get('equipo') ||
      '';
    const urlPass =
      params.get('pass') ||
      params.get('password') ||
      params.get('clave') ||
      '';

    if (urlSlug) {
      setIdentifier(urlSlug);
      if (urlSlug.toLowerCase() === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('team');
      }
    }
    if (urlPass) {
      setPassword(urlPass);
    }

    // Auto-login si ambos parámetros están presentes
    if (urlSlug && urlPass) {
      const cleanSlug = urlSlug.trim().toLowerCase();
      const cleanPass = urlPass.trim();

      if (
        (cleanSlug === 'admin' || cleanSlug === 'director') &&
        (cleanPass === '210910624Dj' || cleanPass === 'admin2026')
      ) {
        onAdminSuccess();
        return;
      }

      const matchedTeam = allTeams.find(
        (t) =>
          t.slug?.toLowerCase() === cleanSlug ||
          t.id.toLowerCase() === cleanSlug ||
          t.id.toLowerCase() === `team-${cleanSlug}` ||
          t.ethnicity.toLowerCase() === cleanSlug
      );

      if (matchedTeam) {
        const expectedPin =
          matchedTeam.accessPin ||
          `${(matchedTeam.slug || matchedTeam.id).replace(/^team-/, '')}2026`;
        if (cleanPass === expectedPin) {
          onTeamSuccess(matchedTeam);
        }
      }
    }
  }, [allTeams, onAdminSuccess, onTeamSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanUser = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      // 1. Verificación de Super Administrador
      if (
        activeTab === 'admin' ||
        cleanUser === 'admin' ||
        cleanUser === 'director'
      ) {
        if (cleanPass === '210910624Dj' || cleanPass === 'admin2026') {
          setLoading(false);
          onAdminSuccess();
          return;
        } else {
          setLoading(false);
          setError('Contraseña de Administrador incorrecta. Revise sus credenciales.');
          return;
        }
      }

      // 2. Verificación de Equipo Territorial
      const matchedTeam = allTeams.find(
        (t) =>
          t.slug?.toLowerCase() === cleanUser ||
          t.id.toLowerCase() === cleanUser ||
          t.id.toLowerCase() === `team-${cleanUser}` ||
          t.ethnicity.toLowerCase() === cleanUser ||
          t.name.toLowerCase().includes(cleanUser)
      );

      if (!matchedTeam) {
        setLoading(false);
        setError(
          `No se encontró ninguna misión territorial con el identificador "${identifier}". Seleccione su equipo o verifique el nombre.`
        );
        return;
      }

      const expectedPin =
        matchedTeam.accessPin ||
        `${(matchedTeam.slug || matchedTeam.id).replace(/^team-/, '')}2026`;

      if (cleanPass === expectedPin) {
        setLoading(false);
        onTeamSuccess(matchedTeam);
      } else {
        setLoading(false);
        setError(
          `Contraseña incorrecta para ${matchedTeam.name}. Verifique el PIN de acceso asignado.`
        );
      }
    }, 250);
  };

  // Helper para autocompletar credenciales de prueba al hacer clic en un chip
  const fillCredentials = (type: 'admin' | 'team', user: string, pass: string) => {
    setActiveTab(type);
    setIdentifier(user);
    setPassword(pass);
    setError(null);
  };

  const whatsappSupportUrl = `https://wa.me/573124589201?text=${encodeURIComponent(
    'Hola, necesito asistencia con mis credenciales de acceso al Plan Ministerial Misincol.'
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Fondos cálidos decorativos estilo Misincol */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B251E]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E67324]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-5">
        {/* Marca y Logotipo Oficial Misincol */}
        <div className="text-center flex flex-col items-center">
          <MisincolLogo size="lg" />
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Sistema Integral del Plan de Desarrollo Ministerial (PDM)
          </p>
        </div>

        {/* Tarjeta de Autenticación */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-5">
          {/* Selector de Rol / Pestañas */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('team');
                setIdentifier('wayuu');
                setPassword('wayuu2026');
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#E67324]" />
              <span>Misión en Campo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setIdentifier('admin');
                setPassword('210910624Dj');
                setError(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Encabezado contextual */}
          <div className="text-center">
            <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
              {activeTab === 'admin'
                ? 'Acceso Supervisión Nacional'
                : 'Ingreso al Plan de tu Misión'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {activeTab === 'admin'
                ? 'Panel central para directores y supervisores nacionales.'
                : 'Acceso seguro y exclusivo al plan territorial de tu equipo.'}
            </p>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'team' ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Misión o Pueblo Indígena
                </label>
                <div className="relative">
                  <select
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      // Asignar contraseña sugerida del equipo seleccionado
                      const selTeam = allTeams.find(
                        (t) => t.slug === e.target.value || t.id === e.target.value
                      );
                      if (selTeam) {
                        setPassword(
                          selTeam.accessPin ||
                            `${(selTeam.slug || selTeam.id).replace(/^team-/, '')}2026`
                        );
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 font-medium cursor-pointer"
                  >
                    {allTeams.map((t) => (
                      <option key={t.id} value={t.slug || t.id}>
                        {t.name} ({t.ethnicity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Usuario Administrador
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 transition"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-xs border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#8B251E]/20 text-stone-900 font-mono transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-stone-400 hover:text-stone-600 transition absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#8B251E] hover:bg-[#731E18] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Ayuda y Soporte */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>¿Olvidaste tu contraseña?</span>
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#8B251E] hover:underline font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Soporte Misincol</span>
            </a>
          </div>
        </div>

        {/* Chips de Credenciales de Prueba Rápida */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/80 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-bold">
            <KeyRound className="w-3.5 h-3.5 text-[#E67324]" />
            <span>Usuarios de Prueba (haz clic para autocompletar):</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => fillCredentials('admin', 'admin', '210910624Dj')}
              className="px-2.5 py-1 rounded-lg bg-stone-900 text-white font-mono text-[11px] hover:opacity-90 transition cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>admin (210910624Dj)</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('team', 'wayuu', 'wayuu2026')}
              className="px-2.5 py-1 rounded-lg bg-[#8B251E]/10 text-[#8B251E] font-mono text-[11px] font-bold hover:bg-[#8B251E]/20 transition cursor-pointer"
            >
              wayuu (wayuu2026)
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('team', 'nasa', 'nasa2026')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold hover:bg-emerald-100 transition cursor-pointer"
            >
              nasa (nasa2026)
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('team', 'embera', 'embera2026')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-mono text-[11px] font-bold hover:bg-purple-100 transition cursor-pointer"
            >
              embera (embera2026)
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('team', 'arhuaco', 'arhuaco2026')}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono text-[11px] font-bold hover:bg-amber-100 transition cursor-pointer"
            >
              arhuaco (arhuaco2026)
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('team', 'nukak', 'nukak2026')}
              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-mono text-[11px] font-bold hover:bg-teal-100 transition cursor-pointer"
            >
              nukak (nukak2026)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
