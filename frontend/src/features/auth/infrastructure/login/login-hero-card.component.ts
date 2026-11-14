import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-hero-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full h-full min-h-[460px] md:min-h-screen bg-[#080C14] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden font-['Outfit'] border-b md:border-b-0 md:border-r border-slate-800/70">
      <!-- Cápsulas geométricas abstractas inspiradas en la estética Gratafy -->
      <div class="absolute -top-20 -right-20 w-[360px] sm:w-[440px] h-[760px] rounded-[220px] -rotate-35 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/60 shadow-2xl pointer-events-none"></div>
      <div class="absolute top-1/3 -left-20 w-[260px] h-[520px] rounded-[130px] -rotate-35 bg-slate-900/40 border border-slate-800/40 pointer-events-none"></div>
      <div class="absolute bottom-16 left-12 w-28 h-28 rounded-full bg-slate-800/40 border border-slate-700/30 pointer-events-none"></div>

      <!-- Cruces y destellos geométricos minimalistas -->
      <div class="absolute top-20 left-16 text-slate-700 text-lg font-light select-none pointer-events-none">+</div>
      <div class="absolute top-44 left-32 text-slate-600 text-xs select-none pointer-events-none">✦</div>
      <div class="absolute bottom-36 right-20 text-slate-700 text-sm font-light select-none pointer-events-none">+</div>

      <!-- Cabecera de marca -->
      <div class="relative z-10 space-y-3">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-800 text-[11px] font-bold tracking-widest uppercase backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>MISINCOL • Colombia</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Plan de Desarrollo <br class="hidden sm:inline" />Ministerial
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-md">
          Plataforma nacional de gobernanza, supervisión estratégica y expansión del Evangelio en las comunidades de Colombia.
        </p>
      </div>

      <!-- Centro de Mando / Cuadrante de Impacto -->
      <div class="relative z-10 my-8">
        <div class="max-w-[340px] rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center shadow-inner">
              <span class="text-xl font-black text-amber-400 tracking-wider">M</span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white tracking-wide">Centro de Mando Nacional</h3>
              <p class="text-[11px] text-slate-400">Coordinación de Territorios</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 pt-1 text-center">
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="block text-xs font-black text-white">5</span>
              <span class="text-[10px] text-slate-400">Pilares</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="block text-xs font-black text-white">6</span>
              <span class="text-[10px] text-slate-400">Etapas</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="block text-xs font-black text-amber-400">100%</span>
              <span class="text-[10px] text-slate-400">Campo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cita bíblica inferior -->
      <div class="relative z-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 text-xs">
        <span class="italic font-normal">«La mies es mucha, pero los obreros pocos.»</span>
        <span class="font-bold text-amber-400 text-xs">Mateo 9:37-38</span>
      </div>
    </div>
  `,
})
export class LoginHeroCardComponent {}
