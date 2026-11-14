import { Component, ChangeDetectionStrategy } from '@angular/core';

// Encabezado del formulario de login con el logotipo institucional de MISINCOL y subtítulo
@Component({
  selector: 'app-login-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2.5 sm:space-y-3 font-['Outfit']">
      <div class="flex items-center justify-center">
        <img
          src="/img/misincol.png"
          alt="MISINCOL - Misiones Indígenas en Colombia"
          class="h-14 sm:h-16 lg:h-18 w-auto max-w-[240px] sm:max-w-[300px] object-contain drop-shadow-xs select-none transition-transform hover:scale-102"
          loading="eager"
        />
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Acceso al Sistema
        </h2>
        <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
          Selecciona tu misión o rol de supervisión para ingresar al plan de desarrollo ministerial.
        </p>
      </div>
    </div>
  `,
})
export class LoginCardHeaderComponent {}
