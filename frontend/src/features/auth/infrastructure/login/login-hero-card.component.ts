import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-hero-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shrink-0 min-h-[460px] md:min-h-[500px] border border-slate-800/80 shadow-2xl h-full font-['Outfit']">
      <!-- Malla geométrica decorativa de fondo -->
      <div class="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-slate-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Cabecera institucional -->
      <div class="relative z-10 space-y-2.5">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>MISINCOL • Colombia</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Plan de Desarrollo Ministerial
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-sm">
          Sistema nacional de gobernanza, supervisión territorial y expansión misional en comunidades de Colombia.
        </p>
      </div>

      <!-- Cuadrante central corporativo -->
      <div class="relative z-10 my-4 flex-1 flex items-center justify-center">
        <div class="w-full max-w-[320px] rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
          <div class="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-md">
            <span class="text-2xl font-black text-amber-400 tracking-wider">M</span>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white tracking-wide">Centro de Mando Nacional</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Gestión estratégica de metas, presupuestos y trabajo de campo</p>
          </div>
          <div class="flex items-center gap-2 pt-1 text-[10px] font-semibold text-slate-300">
            <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">5 Pilares</span>
            <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">6 Etapas</span>
            <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Territorios</span>
          </div>
        </div>
      </div>

      <!-- Cita bíblica inferior -->
      <div class="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 text-xs">
        <span class="italic leading-relaxed font-normal">
          «La mies es mucha, pero los obreros pocos. Rogad al Señor de la mies que envíe obreros.»
        </span>
        <span class="font-bold text-amber-400 shrink-0 text-xs">Mateo 9:37-38</span>
      </div>
    </div>
  `,
  styles: [`:host { display: flex; width: 100%; } @media (min-width: 768px) { :host { width: 48%; } } @media (min-width: 1024px) { :host { width: 46%; } }`],
})
export class LoginHeroCardComponent {}
