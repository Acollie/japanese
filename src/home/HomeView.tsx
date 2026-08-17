import { FORM_GRID_INFO, FORM_SHORT_LABELS, QUIZ_FORMS } from '../conjugation/types';
import type { FormId } from '../conjugation/types';
import { objectCounters } from '../data/counters';
import { MIN_COUNTERS } from '../counters/QuestionGenerator';
import type { CounterEntry } from '../counters/types';
import { countableCounters } from '../counting/QuestionGenerator';

export type QuizMode = 'typed' | 'multiple-choice';
export type Domain = 'verbs' | 'counters' | 'counting';

const DOMAIN_LABELS: Record<Domain, string> = {
  verbs: 'Verbs',
  counters: 'Counters',
  counting: 'Counting',
};

const DOMAIN_HEADINGS: Record<Domain, { title: string; blurb: string }> = {
  verbs: { title: '日本語動詞練習', blurb: 'N5/N4 verb conjugation practice.' },
  counters: { title: '助数詞練習', blurb: 'Learn which counter word goes with which object.' },
  counting: { title: '数え方練習', blurb: 'Say the number and counter together: 一匹 いっぴき, 三匹 さんびき.' },
};

interface HomeViewProps {
  domain: Domain;
  onDomainChange: (domain: Domain) => void;
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  selectedForms: FormId[];
  onToggleForm: (form: FormId) => void;
  onToggleAllForms: () => void;
  selectedCounterIds: string[];
  onToggleCounter: (id: string) => void;
  onToggleAllCounters: () => void;
  selectedCountingIds: string[];
  onToggleCounting: (id: string) => void;
  onToggleAllCounting: () => void;
  onStart: () => void;
  onViewStats: () => void;
}

interface CounterGridProps {
  pool: CounterEntry[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  cannotStart: boolean;
}

/** Shared by the Counters and Counting domains — same shape, different pool. */
function CounterGrid({ pool, selectedIds, onToggle, onToggleAll, cannotStart }: CounterGridProps) {
  const allSelected = selectedIds.length === pool.length;

  return (
    <div className="mt-2 w-full max-w-[480px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Counters to practice
        </span>
        <button type="button" className="text-[13px] text-purple-600 underline dark:text-purple-400" onClick={onToggleAll}>
          {allSelected ? 'Unselect all' : 'Select all'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Counters to practice">
        {pool.map((counter) => {
          const active = selectedIds.includes(counter.id);
          return (
            <button
              key={counter.id}
              type="button"
              className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2.5 transition-colors ${
                active
                  ? 'border-purple-300 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                  : 'border-neutral-200 bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100'
              }`}
              aria-pressed={active}
              onClick={() => onToggle(counter.id)}
            >
              <span className="text-sm font-semibold">
                {counter.kanji} ({counter.kana})
              </span>
              <span className="text-[11px] leading-tight opacity-75">{counter.usage}</span>
            </button>
          );
        })}
      </div>
      {cannotStart && (
        <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">
          Select at least {MIN_COUNTERS} counters to start.
        </p>
      )}
    </div>
  );
}

export function HomeView({
  domain,
  onDomainChange,
  mode,
  onModeChange,
  selectedForms,
  onToggleForm,
  onToggleAllForms,
  selectedCounterIds,
  onToggleCounter,
  onToggleAllCounters,
  selectedCountingIds,
  onToggleCounting,
  onToggleAllCounting,
  onStart,
  onViewStats,
}: HomeViewProps) {
  const allFormsSelected = selectedForms.length === QUIZ_FORMS.length;
  // Verbs need one form; both counter domains need two, since a one-counter quiz
  // has no wrong answer left to offer.
  const cannotStart =
    domain === 'verbs'
      ? selectedForms.length === 0
      : (domain === 'counters' ? selectedCounterIds : selectedCountingIds).length < MIN_COUNTERS;

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <h1 className="text-4xl font-medium tracking-tight text-neutral-950 dark:text-neutral-100">
        {DOMAIN_HEADINGS[domain].title}
      </h1>
      <p className="mb-2 text-neutral-500 dark:text-neutral-400">{DOMAIN_HEADINGS[domain].blurb}</p>

      <div className="flex gap-2 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800" role="radiogroup" aria-label="Practice domain">
        {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
          <button
            key={d}
            type="button"
            className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
              domain === d ? 'bg-purple-600 text-white' : 'text-neutral-500 dark:text-neutral-400'
            }`}
            role="radio"
            aria-checked={domain === d}
            onClick={() => onDomainChange(d)}
          >
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800" role="radiogroup" aria-label="Quiz mode">
        <button
          type="button"
          className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
            mode === 'typed' ? 'bg-purple-600 text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
          role="radio"
          aria-checked={mode === 'typed'}
          onClick={() => onModeChange('typed')}
        >
          Type the answer
        </button>
        <button
          type="button"
          className={`rounded-full px-5 py-2.5 text-[15px] transition-colors ${
            mode === 'multiple-choice' ? 'bg-purple-600 text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
          role="radio"
          aria-checked={mode === 'multiple-choice'}
          onClick={() => onModeChange('multiple-choice')}
        >
          Multiple choice
        </button>
      </div>

      {domain === 'verbs' ? (
        <div className="mt-2 w-full max-w-[480px]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Forms to practice</span>
            <button type="button" className="text-[13px] text-purple-600 underline dark:text-purple-400" onClick={onToggleAllForms}>
              {allFormsSelected ? 'Unselect all' : 'Select all'}
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
          {cannotStart && (
            <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Select at least one form to start.</p>
          )}
        </div>
      ) : domain === 'counters' ? (
        <CounterGrid
          pool={objectCounters}
          selectedIds={selectedCounterIds}
          onToggle={onToggleCounter}
          onToggleAll={onToggleAllCounters}
          cannotStart={cannotStart}
        />
      ) : (
        <CounterGrid
          pool={countableCounters}
          selectedIds={selectedCountingIds}
          onToggle={onToggleCounting}
          onToggleAll={onToggleAllCounting}
          cannotStart={cannotStart}
        />
      )}

      <button
        type="button"
        className="mt-4 rounded-lg bg-purple-600 px-9 py-3.5 text-lg text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={onStart}
        disabled={cannotStart}
      >
        Start quiz
      </button>
      <button type="button" className="text-sm text-neutral-500 underline dark:text-neutral-400" onClick={onViewStats}>
        View progress
      </button>
    </div>
  );
}
