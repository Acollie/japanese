import type { ConjugatedForm } from '../conjugation/types';

interface MultipleChoiceOptionsProps {
  options: ConjugatedForm[];
  disabled: boolean;
  selected: string | null;
  correctKana: string;
  onSelect: (kana: string) => void;
}

const BASE = 'rounded-lg border px-2.5 py-3.5 text-[17px] disabled:cursor-default';
const NEUTRAL = 'border-neutral-200 bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100';
const CORRECT = 'border-green-500 bg-green-500/15 text-neutral-950 dark:text-neutral-100';
const INCORRECT = 'border-red-500 bg-red-500/15 text-neutral-950 dark:text-neutral-100';

export function MultipleChoiceOptions({ options, disabled, selected, correctKana, onSelect }: MultipleChoiceOptionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2.5">
      {options.map((option) => {
        let variant = NEUTRAL;
        if (selected) {
          if (option.kana === correctKana) variant = CORRECT;
          else if (option.kana === selected) variant = INCORRECT;
        }
        return (
          <button
            key={option.kana}
            type="button"
            className={`${BASE} ${variant}`}
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
