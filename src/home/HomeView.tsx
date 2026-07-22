import { FORM_GRID_INFO, FORM_SHORT_LABELS, QUIZ_FORMS } from '../conjugation/types';
import type { FormId } from '../conjugation/types';

export type QuizMode = 'typed' | 'multiple-choice';

interface HomeViewProps {
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  selectedForms: FormId[];
  onToggleForm: (form: FormId) => void;
  onSelectAllForms: () => void;
  onStart: () => void;
  onViewStats: () => void;
}

export function HomeView({
  mode,
  onModeChange,
  selectedForms,
  onToggleForm,
  onSelectAllForms,
  onStart,
  onViewStats,
}: HomeViewProps) {
  const noneSelected = selectedForms.length === 0;

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <h1 className="text-4xl font-medium tracking-tight text-neutral-950 dark:text-neutral-100">日本語動詞練習</h1>
      <p className="mb-2 text-neutral-500 dark:text-neutral-400">N5/N4 verb conjugation practice.</p>

      <div className="flex gap-2 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800" role="radiogroup" aria-label="Quiz mode">
        <button
          type="button"
          className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
            mode === 'typed' ? 'bg-purple-600 text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
          aria-pressed={mode === 'typed'}
          onClick={() => onModeChange('typed')}
        >
          Type the answer
        </button>
        <button
          type="button"
          className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
            mode === 'multiple-choice' ? 'bg-purple-600 text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
          aria-pressed={mode === 'multiple-choice'}
          onClick={() => onModeChange('multiple-choice')}
        >
          Multiple choice
        </button>
      </div>

      <div className="mt-2 w-full max-w-[480px]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Forms to practice</span>
          <button type="button" className="text-[13px] text-purple-600 underline dark:text-purple-400" onClick={onSelectAllForms}>
            Select all
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Forms to practice">
          {QUIZ_FORMS.map((form) => {
            const active = selectedForms.includes(form);
            return (
              <button
                key={form}
                type="button"
                className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2.5 transition-colors ${
                  active
                    ? 'border-purple-300 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                    : 'border-neutral-200 bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100'
                }`}
                aria-pressed={active}
                onClick={() => onToggleForm(form)}
              >
                <span className="text-[13px] font-semibold">{FORM_SHORT_LABELS[form]}</span>
                <span className="text-sm">{FORM_GRID_INFO[form].ending}</span>
                <span className="text-[11px] leading-tight opacity-75">{FORM_GRID_INFO[form].gloss}</span>
              </button>
            );
          })}
        </div>
        {noneSelected && (
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Select at least one form to start.</p>
        )}
      </div>

      <button
        type="button"
        className="mt-4 rounded-lg bg-purple-600 px-9 py-3.5 text-lg text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={onStart}
        disabled={noneSelected}
      >
        Start quiz
      </button>
      <button type="button" className="text-sm text-neutral-500 underline dark:text-neutral-400" onClick={onViewStats}>
        View progress
      </button>
    </div>
  );
}
