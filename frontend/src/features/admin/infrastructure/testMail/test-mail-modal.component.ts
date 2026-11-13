// Modal de diagnóstico y prueba en vivo de notificaciones de correo Google
import { Component, ChangeDetectionStrategy, input, output, signal, effect, inject } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';
import { httpClient } from '../../../../core/http/httpClient';
import { ToastService } from '../../../../shared/components/toast/toast.service';

interface MailStatus { configured: boolean; account: string | null; }
interface MailResult { success: boolean; simulated?: boolean; messageId?: string; error?: string; }

@Component({
  selector: 'app-test-mail-modal',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
        <div class="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg p-6 flex flex-col space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-stone-100">
            <div class="flex items-center gap-2.5">
              <div class="p-2 rounded-xl bg-amber-50 text-amber-700">
                <app-icon name="mail" className="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-stone-900">Diagnóstico de Correo Google</h3>
                <p class="text-[11px] text-stone-500">Pruebas en vivo y verificación del servicio SMTP</p>
              </div>
            </div>
            <button (click)="close.emit()" class="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
              <app-icon name="x" className="w-4 h-4" />
            </button>
          </div>

          <div class="p-3.5 rounded-xl border text-xs" [class]="status()?.configured ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'">
            <div class="flex items-center gap-2 font-medium">
              <app-icon [name]="status()?.configured ? 'check' : 'alert-circle'" className="w-4 h-4" />
              <span>{{ status()?.configured ? 'Google SMTP Conectado' : 'Modo Simulación Seguro Activo' }}</span>
            </div>
            <p class="mt-1 text-[11px] opacity-90">
              {{ status()?.configured ? 'Cuenta enlazada: ' + status()?.account : 'Para enviar correos reales, configure MAIL_USER y MAIL_PASS en backend/.env con su clave de aplicación Google.' }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-stone-700">Enviar correo de prueba a:</label>
            <input
              type="email"
              [value]="targetEmail()"
              (input)="targetEmail.set($any($event.target).value)"
              placeholder="ejemplo@gmail.com"
              class="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
            />
          </div>

          @if (lastResult()) {
            <div class="p-3 rounded-xl text-xs" [class]="lastResult()?.success ? 'bg-stone-50 border border-stone-200 text-stone-800' : 'bg-rose-50 border border-rose-200 text-rose-800'">
              <div class="font-medium">{{ lastResult()?.success ? (lastResult()?.simulated ? 'ℹ️ Enviado en Modo Simulación' : '✓ Correo Despachado') : '✕ Error al Enviar' }}</div>
              <p class="mt-0.5 text-[11px] text-stone-500">{{ lastResult()?.error || ('ID: ' + (lastResult()?.messageId || 'ok')) }}</p>
            </div>
          }

          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button (click)="close.emit()" type="button" class="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition cursor-pointer">Cerrar</button>
            <button (click)="sendTestMail()" [disabled]="sending() || !targetEmail().includes('@')" type="button" class="px-4 py-2 text-xs font-medium text-white bg-[#8B251E] hover:bg-[#721F19] disabled:opacity-50 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
              @if (sending()) { <span>Enviando...</span> } @else { <app-icon name="send" className="w-3.5 h-3.5" /> <span>Enviar Prueba</span> }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class TestMailModalComponent {
  private readonly toastSvc = inject(ToastService);
  readonly isOpen = input.required<boolean>();
  readonly close = output<void>();

  readonly targetEmail = signal('director@misincol.org');
  readonly status = signal<MailStatus | null>(null);
  readonly sending = signal(false);
  readonly lastResult = signal<MailResult | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.loadStatus();
        this.lastResult.set(null);
      }
    });
  }

  async loadStatus() {
    try {
      const res = await httpClient.get<MailStatus>('/notifications/mail-status');
      this.status.set(res);
    } catch {
      this.status.set({ configured: false, account: null });
    }
  }

  async sendTestMail() {
    this.sending.set(true);
    this.lastResult.set(null);
    try {
      const res = await httpClient.post<MailResult>('/notifications/test-mail', { to: this.targetEmail() });
      this.lastResult.set(res);
      if (res.success) {
        this.toastSvc.toast.success('Correo de prueba procesado', 'Notificaciones');
      } else {
        this.toastSvc.toast.error(res.error || 'Fallo de entrega', 'Error');
      }
    } catch (err: any) {
      this.lastResult.set({ success: false, error: err.message });
      this.toastSvc.toast.error(err.message, 'Error de Red');
    } finally {
      this.sending.set(false);
    }
  }
}

