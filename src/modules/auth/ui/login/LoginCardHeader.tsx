import React from 'react';

export const LoginCardHeader: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-center">
      <img
        src="/img/misincol.png"
        alt="MISINCOL - Misiones Indígenas en Colombia"
        className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto max-w-[280px] sm:max-w-[340px] lg:max-w-[370px] object-contain drop-shadow-xs select-none transition-transform hover:scale-102"
        loading="eager"
      />
    </div>
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-['Outfit']">
        Acceso al Sistema
      </h2>
      <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
        Selecciona tu misión o rol de supervisión para ingresar al plan de desarrollo ministerial.
      </p>
    </div>
  </div>
);
