import { FORM_GRID_INFO, FORM_SHORT_LABELS, QUIZ_FORMS } from '../conjugation/types';
import type { FormId } from '../conjugation/types';
import styles from './HomeView.module.css';

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
    <div className={styles.home}>
      <h1>日本語動詞練習</h1>
      <p className={styles.subtitle}>N5/N4 verb conjugation practice.</p>

      <div className={styles.modeSelector} role="radiogroup" aria-label="Quiz mode">
        <button
          type="button"
          className={mode === 'typed' ? styles.modeButtonActive : styles.modeButton}
          aria-pressed={mode === 'typed'}
          onClick={() => onModeChange('typed')}
        >
          Type the answer
        </button>
        <button
          type="button"
          className={mode === 'multiple-choice' ? styles.modeButtonActive : styles.modeButton}
          aria-pressed={mode === 'multiple-choice'}
          onClick={() => onModeChange('multiple-choice')}
        >
          Multiple choice
        </button>
      </div>

      <div className={styles.formsSection}>
        <div className={styles.formsHeader}>
          <span className={styles.formsLabel}>Forms to practice</span>
          <button type="button" className={styles.selectAllButton} onClick={onSelectAllForms}>
            Select all
          </button>
        </div>
        <div className={styles.formsGrid} role="group" aria-label="Forms to practice">
          {QUIZ_FORMS.map((form) => {
            const active = selectedForms.includes(form);
            return (
              <button
                key={form}
                type="button"
                className={active ? styles.formChipActive : styles.formChip}
                aria-pressed={active}
                onClick={() => onToggleForm(form)}
              >
                <span className={styles.formChipName}>{FORM_SHORT_LABELS[form]}</span>
                <span className={styles.formChipEnding}>{FORM_GRID_INFO[form].ending}</span>
                <span className={styles.formChipGloss}>{FORM_GRID_INFO[form].gloss}</span>
              </button>
            );
          })}
        </div>
        {noneSelected && <p className={styles.formsHint}>Select at least one form to start.</p>}
      </div>

      <button type="button" className={styles.startButton} onClick={onStart} disabled={noneSelected}>
        Start quiz
      </button>
      <button type="button" className={styles.statsLink} onClick={onViewStats}>
        View progress
      </button>
    </div>
  );
}
