import React from 'react';
import { MessageCircle } from 'lucide-react';

export const LoginSupportFooter: React.FC = () => {
  const whatsappUrl = `https://wa.me/573124589201?text=${encodeURIComponent(
    'Hola, necesito asistencia con mis credenciales de acceso al Plan Ministerial Misincol.'
  )}`;

  return (
    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
      <span>¿Dificultades de acceso?</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="text-[#8B251E] hover:underline font-bold flex items-center gap-1.5"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600" />
        <span>Soporte Misincol</span>
      </a>
    </div>
  );
};
