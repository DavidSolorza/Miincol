import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal.component';
import { AppIconComponent } from '../../../shared/components/icon/app-icon.component';

interface ReferenceDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  pages: number;
  pdfUrl: string;
}

const DEFAULT_DOCUMENTS: ReferenceDoc[] = [
  {
    id: 'doc-pdm-base',
    title: 'Manual de Procedimientos y Etapas PDM 2026',
    category: 'Normativa Territorial',
    description: 'Guía oficial para la formulación de objetivos estratégicos, etapas de campo y asignación de presupuesto.',
    pages: 14,
    pdfUrl: '/manual_pdm_2026.pdf',
  },
  {
    id: 'doc-etapas-guia',
    title: 'Ruta Metodológica de las 8 Etapas Misioneras',
    category: 'Metodología',
    description: 'Detalle de contacto, comunicación del evangelio, discipulado, liderazgo y desarrollo eclesial.',
    pages: 8,
    pdfUrl: '/ruta_metodologica_etapas.pdf',
  },
];

@Component({
  selector: 'app-reference-documents-modal',
  standalone: true,
  imports: [ModalComponent, AppIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Documentos de Referencia & Guías Metodológicas"
      subtitle="Material oficial de consulta rápida para obreros y líderes de campo"
      maxWidth="3xl"
      (closed)="closed.emit()"
    >
      <div class="space-y-4 text-xs font-['Outfit'] select-none">
        <div class="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/70 flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <app-icon name="file-text" className="w-4 h-4 text-[#8B251E]" />
          </div>
          <div>
            <h4 class="font-bold text-stone-900 text-xs sm:text-sm">Documentación Base en PDF</h4>
            <p class="text-[11px] text-stone-600">
              Consulte las etapas y lineamientos ministeriales durante el diligenciamiento del plan sin salir de la plataforma.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          @for (doc of documents; track doc.id) {
            <div class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#E67324]/50 transition flex flex-col justify-between space-y-3">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {{ doc.category }}
                  </span>
                  <span class="text-[10px] text-stone-400 font-mono font-bold">{{ doc.pages }} pág.</span>
                </div>
                <h4 class="text-xs sm:text-sm font-extrabold text-stone-900 leading-snug">{{ doc.title }}</h4>
                <p class="text-[11px] text-stone-500 leading-relaxed">{{ doc.description }}</p>
              </div>

              <div class="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  [href]="doc.pdfUrl"
                  target="_blank"
                  class="flex-1 py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <app-icon name="external-link" className="w-3.5 h-3.5 text-[#E67324]" />
                  <span>Abrir Documento</span>
                </a>
              </div>
            </div>
          }
        </div>

        <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-center space-y-1">
          <p class="text-[11px] text-stone-600 font-medium">
            💡 Para solicitar la inclusión de nuevos manuales o materiales de apoyo territorial, comuníquese con la Coordinación Nacional.
          </p>
        </div>
      </div>
    </app-modal>
  `,
})
export class ReferenceDocumentsModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  readonly documents = DEFAULT_DOCUMENTS;
}
