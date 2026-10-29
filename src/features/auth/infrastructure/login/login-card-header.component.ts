import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2 sm:space-y-2.5">
      <div class="flex items-center justify-center">
        <img
          src="/img/misincol.png"
          alt="MISINCOL - Misiones Indígenas en Colombia"
          class="h-14 sm:h-18 lg:h-20 w-auto max-w-[260px] sm:max-w-[330px] object-contain drop-shadow-xs select-none transition-transform hover:scale-102"
          loading="eager"
        />
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-['Outfit']">
          Acceso al Sistema
        </h2>
        <p class="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
          Selecciona tu misión o rol de supervisión para ingresar al plan de desarrollo ministerial.
        </p>
      </div>
    </div>
  `,
})
export class LoginCardHeaderComponent {}

