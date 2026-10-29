import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AppIconComponent } from '../../../../shared/components/icon/app-icon.component';

@Component({
  selector: 'app-objective-form-fields',
  standalone: true,
  imports: [AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 flex items-start gap-3 shadow-2xs">
        <div class="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
          <app-icon name="info" className="w-4 h-4" />
        </div>
        <div class="space-y-0.5">
          <span class="font-['Outfit'] font-black text-xs text-amber-950 block">Regla Ministerial: Máximo 4 Objetivos por Fase</span>
          <p class="text-[11px] text-amber-800 leading-relaxed font-medium">
            Para garantizar el enfoque y viabilidad de la misión de campo, cada fase ministerial admite como máximo
            <strong>4 objetivos estratégicos</strong>. Actualmente hay <strong>{{ totalObjectivesCount() }} de 4</strong> registrados.
          </p>
        </div>
      </div>

      @if (error()) {
        <div class="p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-800 flex items-center gap-2.5">
          <app-icon name="alert-circle" className="w-4 h-4 text-rose-600 shrink-0" />
          <span class="font-semibold text-xs">{{ error() }}</span>
        </div>
      }

      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">
          Título del Objetivo Estratégico <span class="text-rose-600">*</span>
        </label>
        <div class="relative">
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <app-icon name="target" className="w-4 h-4 text-[#E67324]" />
          </div>
          <input
            type="text"
            [value]="title()"
            (input)="onTitleInput($event)"
            placeholder="Ej. Diagnóstico Socio-Espiritual y Cartografía de Comunidades"
            class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white focus:bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] font-medium text-xs text-stone-900 transition"
            required
          />
        </div>
        <span class="text-[10.5px] text-stone-400 font-medium">
          Debe ser claro, conciso y orientado a resultados de transformación territorial.
        </span>
      </div>

      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">
          Descripción y Enfoque Territorial <span class="text-rose-600">*</span>
        </label>
        <textarea
          [value]="description()"
          (input)="onDescriptionInput($event)"
          rows="3"
          placeholder="Describa el propósito, alcance en campo y cómo este objetivo aporta a la consolidación de la misión..."
          class="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white focus:bg-white placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20 focus:border-[#E67324] font-medium text-xs text-stone-900 leading-relaxed resize-none transition"
          required
        ></textarea>
      </div>
    </div>
  `,
})
// Campos de formulario de título, descripción y aviso de límite para el modal de objetivo estratégico
export class ObjectiveFormFieldsComponent {
  readonly totalObjectivesCount = input.required<number>(); // Total actual de objetivos en la fase (máx 4)
  readonly error = input<string | null>(null); // Mensaje de error de validación si existe
  readonly title = input.required<string>(); // Valor actual del título del objetivo
  readonly description = input.required<string>(); // Valor actual de la descripción del objetivo

  readonly titleChanged = output<string>(); // Emite cada vez que cambia el título ingresado
  readonly descriptionChanged = output<string>(); // Emite cada vez que cambia la descripción ingresada

  // Propaga el cambio del campo de texto del título
  onTitleInput(event: Event): void {
    this.titleChanged.emit((event.target as HTMLInputElement).value);
  }

  // Propaga el cambio del área de texto de la descripción
  onDescriptionInput(event: Event): void {
    this.descriptionChanged.emit((event.target as HTMLTextAreaElement).value);
  }
}

