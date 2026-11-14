import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-login-support-footer',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-['Outfit']">
      <span>¿Dificultades de acceso?</span>
      <a
        [href]="whatsappUrl"
        target="_blank"
        rel="noreferrer"
        class="text-slate-900 hover:text-black font-bold flex items-center gap-1.5 transition"
      >
        <app-icon name="message-circle" className="w-4.5 h-4.5 text-emerald-600" />
        <span>Soporte Misincol</span>
      </a>
    </div>
  `,
})
export class LoginSupportFooterComponent {
  readonly whatsappUrl = `https://wa.me/573124589201?text=${encodeURIComponent(
    'Hola, necesito asistencia con mis credenciales de acceso al Plan Ministerial Misincol.'
  )}`;
}
