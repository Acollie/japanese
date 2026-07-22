import type { ConjugatedForm } from '../conjugation/types';
import styles from './QuizView.module.css';

interface MultipleChoiceOptionsProps {
  options: ConjugatedForm[];
  disabled: boolean;
  selected: string | null;
  correctKana: string;
  onSelect: (kana: string) => void;
}

export function MultipleChoiceOptions({ options, disabled, selected, correctKana, onSelect }: MultipleChoiceOptionsProps) {
  return (
    <div className={styles.choices}>
      {options.map((option) => {
        let className = styles.choiceButton;
        if (selected) {
          if (option.kana === correctKana) className = styles.choiceCorrect;
          else if (option.kana === selected) className = styles.choiceIncorrect;
        }
        return (
          <button
            key={option.kana}
            type="button"
            className={className}
            disabled={disabled}
            onClick={() => onSelect(option.kana)}
          >
            {option.kanji === option.kana ? option.kana : `${option.kanji} (${option.kana})`}
          </button>
        );
      })}
    </div>
  );
}
