import React from 'react';

export const LoginHeroCard: React.FC = () => {
  return (
    
    <div className="w-full md:w-[48%] lg:w-[46%] bg-[#0F0F11] rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-white relative overflow-hidden shrink-0 min-h-[460px] md:min-h-[500px] border border-white/5 shadow-inner">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E67324]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-[#8B251E]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-1.5">
        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-white leading-[1.15] font-['Outfit']">
          Llevando el Evangelio a Cada Territorio
        </h1>
        <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed font-normal">
          Liderazgo, discipulado y expansión del Reino en comunidades y etnias de Colombia.
        </p>
      </div>
      {/* Contenedor Rectangular Vertical Alto con el contorno del contenedor exterior */}
      <div className="relative z-10 my-2 flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[260px] sm:max-w-[290px] aspect-[736/946] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/15 bg-stone-950/80 shadow-2xl group flex items-center justify-center">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#8B251E]/30 via-[#E67324]/20 to-amber-500/15 rounded-[24px] blur-xl opacity-60 pointer-events-none" />
          <img
            src="/img/6ccf873cb76d7a5e6651271758e7ce81.jpg"
            alt="Semilla y crecimiento ministerial en manos misioneras"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-103"
            loading="eager"
          />
          {/* Contorno interno y sutil viñeta que replica el marco del contenedor exterior */}
          <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] ring-1 ring-inset ring-white/15 pointer-events-none" />
        </div>
      </div>

      {/* Pie con Versículo y Línea Central de División */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-stone-400 text-[11px]">
        <span className="italic leading-snug">
          «La mies es mucha, pero los obreros pocos. Rogad, pues, al Señor de la mies, que envíe obreros a su mies.»
        </span>
        <span className="font-semibold text-stone-300 shrink-0 ml-2 font-mono">Mateo 9:37-38</span>
      </div>
    </div>
  );
};
