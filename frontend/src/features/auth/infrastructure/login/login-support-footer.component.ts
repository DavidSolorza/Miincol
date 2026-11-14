import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-login-support-footer',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-['Outfit']">
      <span>¿Dificultades de acceso?</span>
      <a
        [href]="whatsappUrl"
        target="_blank"
        rel="noreferrer"
        class="text-slate-200 hover:text-white font-bold flex items-center gap-1.5 transition"
      >
        <app-icon name="message-circle" className="w-4 h-4 text-emerald-400" />
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
