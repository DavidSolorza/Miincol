import { Component, ChangeDetectionStrategy } from '@angular/core';

// Tarjeta visual izquierda del portal de login con mensaje misional, fotografía y cita bíblica
@Component({
  selector: 'app-login-hero-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full flex-1 bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5ECE1] rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between text-stone-900 relative overflow-hidden shrink-0 min-h-[460px] md:min-h-[500px] border border-[#EBDDCF]/80 shadow-[0_4px_24px_-4px_rgba(139,37,30,0.06)] h-full">
      <div class="absolute top-0 right-0 w-72 h-72 bg-[#E67324]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-6 left-0 w-72 h-72 bg-[#8B251E]/8 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 space-y-1.5">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B251E]/10 text-[#8B251E] text-[10px] font-black tracking-wider uppercase font-['Outfit']">
          MISINCOL • Colombia
        </div>
        <h1 class="text-xl sm:text-2xl lg:text-[27px] font-extrabold tracking-tight text-stone-900 leading-[1.18] font-['Outfit']">
          Llevando el Evangelio a Cada Territorio
        </h1>
        <p class="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
          Liderazgo, discipulado y expansión del Reino en comunidades y etnias de Colombia.
        </p>
      </div>

      <div class="relative z-10 my-3 flex-1 flex items-center justify-center">
        <div class="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[4/5] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-[#E3D4C4] bg-white shadow-[0_12px_32px_-8px_rgba(139,37,30,0.12)] group flex items-center justify-center">
          <img
            src="/img/6ccf873cb76d7a5e6651271758e7ce81.jpg"
            alt="Semilla y crecimiento ministerial en manos misioneras"
            class="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-102"
            loading="eager"
          />
          <div class="absolute inset-0 rounded-[22px] sm:rounded-[26px] ring-1 ring-inset ring-black/5 pointer-events-none"></div>
        </div>
      </div>

      <div class="relative z-10 pt-3 border-t border-[#EBDDCF]/80 flex items-center justify-between text-stone-600 text-xs">
        <span class="italic leading-snug font-medium">
          «La mies es mucha, pero los obreros pocos. Rogad, pues, al Señor de la mies, que envíe obreros a su mies.»
        </span>
        <span class="font-bold text-[#8B251E] shrink-0 ml-2 font-['Outfit'] text-xs">Mateo 9:37-38</span>
      </div>
    </div>
  `,
  styles: [`:host { display: flex; width: 100%; } @media (min-width: 768px) { :host { width: 48%; } } @media (min-width: 1024px) { :host { width: 46%; } }`],
})
export class LoginHeroCardComponent {}

