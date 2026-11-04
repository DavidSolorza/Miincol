import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-login-support-footer',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-2.5 mt-2.5 sm:pt-3 sm:mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] sm:text-xs text-stone-500">
      <span>¿Dificultades de acceso?</span>
      <a
        [href]="whatsappUrl"
        target="_blank"
        rel="noreferrer"
        class="text-[#8B251E] hover:underline font-bold flex items-center gap-1.5"
      >
        <app-icon name="message-circle" className="w-4 h-4 text-emerald-600" />
        <span>Soporte Misincol</span>
      </a>
    </div>
  `,
})
// Pie de tarjeta de login con enlace directo a soporte técnico vía WhatsApp
export class LoginSupportFooterComponent {
  // Enlace preconfigurado de WhatsApp para solicitar asistencia de acceso
  readonly whatsappUrl = `https://wa.me/573124589201?text=${encodeURIComponent(
    'Hola, necesito asistencia con mis credenciales de acceso al Plan Ministerial Misincol.'
  )}`;
}

