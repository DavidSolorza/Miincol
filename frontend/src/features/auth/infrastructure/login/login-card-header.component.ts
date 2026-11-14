import { Component, ChangeDetectionStrategy } from '@angular/core';

// Encabezado centrado del formulario de login con logotipo oficial MISINCOL
@Component({
  selector: 'app-login-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-3 font-['Outfit'] text-center flex flex-col items-center">
      <div class="flex items-center justify-center">
        <img
          src="/img/misincol.png"
          alt="MISINCOL - Misiones Indígenas en Colombia"
          class="h-16 sm:h-20 w-auto max-w-[260px] sm:max-w-[320px] object-contain drop-shadow-xs select-none transition-transform hover:scale-102"
          loading="eager"
        />
      </div>
      <div>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Ingresa tus credenciales para acceder a la gestión y supervisión ministerial.
        </p>
      </div>
    </div>
  `,
})
export class LoginCardHeaderComponent {}
