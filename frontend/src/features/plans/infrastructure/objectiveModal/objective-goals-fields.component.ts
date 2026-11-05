import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

export type GoalTermKey = 'corto' | 'mediano' | 'largo';

@Component({
  selector: 'app-objective-goals-fields',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">Plazo de la Meta</label>
        <select
          [value]="selectedGoalTerm()"
          (change)="onGoalTermChange($event)"
          class="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs font-semibold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
        >
          <option value="corto">Corto plazo: 2 meses</option>
          <option value="mediano">Mediano plazo: 6 meses</option>
          <option value="largo">Largo plazo: 1 año</option>
        </select>
      </div>

      <div class="space-y-1">
        <label class="font-bold text-stone-700 block text-xs">
          Meta Proyectada ({{ selectedTermLabel() }})
        </label>
        <input
          type="text"
          [value]="currentGoalValue()"
          (input)="onGoalInput($event)"
          [placeholder]="currentGoalPlaceholder()"
          class="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#E67324]/20"
        />
      </div>
    </div>
  `,
})
export class ObjectiveGoalsFieldsComponent {
  readonly shortTermGoal = input<string | undefined>('');
  readonly mediumTermGoal = input<string | undefined>('');
  readonly longTermGoal = input<string | undefined>('');

  readonly shortTermGoalChanged = output<string>();
  readonly mediumTermGoalChanged = output<string>();
  readonly longTermGoalChanged = output<string>();

  readonly selectedGoalTerm = signal<GoalTermKey>('largo');

  readonly selectedTermLabel = computed(() => {
    const k = this.selectedGoalTerm();
    return k === 'corto' ? '2 meses' : k === 'mediano' ? '6 meses' : '1 año';
  });

  readonly currentGoalValue = computed(() => {
    const k = this.selectedGoalTerm();
    return k === 'corto' ? this.shortTermGoal() || '' : k === 'mediano' ? this.mediumTermGoal() || '' : this.longTermGoal() || '';
  });

  readonly currentGoalPlaceholder = computed(() => {
    const k = this.selectedGoalTerm();
    if (k === 'corto') return 'Ej. Primeros contactos e identificación (2m)...';
    if (k === 'mediano') return 'Ej. 10 estudios bíblicos establecidos (6m)...';
    return 'Ej. 2 nuevas comunidades de fe (1a)...';
  });

  onGoalTermChange(e: Event): void {
    this.selectedGoalTerm.set((e.target as HTMLSelectElement).value as GoalTermKey);
  }

  onGoalInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    const k = this.selectedGoalTerm();
    if (k === 'corto') this.shortTermGoalChanged.emit(val);
    else if (k === 'mediano') this.mediumTermGoalChanged.emit(val);
    else this.longTermGoalChanged.emit(val);
  }
}

