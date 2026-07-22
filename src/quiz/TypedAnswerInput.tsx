import { useState } from 'react';

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
    <form className="flex w-full gap-2" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-lg text-neutral-950 disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
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
      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-5 py-3 text-base text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled || !value.trim()}
      >
        Check
      </button>
    </form>
  );
}
