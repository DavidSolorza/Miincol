import { Component, ChangeDetectionStrategy } from '@angular/core';

// Encabezado del formulario de login en modo Dark Minimalista con identidad MISINCOL
@Component({
  selector: 'app-login-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 font-['Outfit'] text-center sm:text-left">
      <div class="flex items-center justify-center sm:justify-start">
        <img
          src="/img/misincol.png"
          alt="MISINCOL - Misiones Indígenas en Colombia"
          class="h-14 sm:h-16 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-md select-none transition-transform hover:scale-102"
          loading="eager"
        />
      </div>
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Acceso al Sistema
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          Ingresa tus credenciales para acceder a la gestión y supervisión ministerial.
        </p>
      </div>
    </div>
  `,
})
export class LoginCardHeaderComponent {}
