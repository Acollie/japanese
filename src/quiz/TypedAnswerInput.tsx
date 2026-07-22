import { useState } from 'react';
import styles from './QuizView.module.css';

interface TypedAnswerInputProps {
  disabled: boolean;
  onSubmit: (value: string) => void;
}

export function TypedAnswerInput({ disabled, onSubmit }: TypedAnswerInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value);
    setValue('');
  }

  return (
    <form className={styles.typedForm} onSubmit={handleSubmit}>
      <input
        className={styles.typedInput}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type romaji or kana…"
        disabled={disabled}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <button type="submit" className={styles.submitButton} disabled={disabled || !value.trim()}>
        Check
      </button>
    </form>
  );
}
