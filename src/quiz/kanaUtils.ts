import * as wanakana from 'wanakana';
import type { ConjugatedForm } from '../conjugation/types';

/** Converts romaji to hiragana; passes already-kana input through unchanged. */
export function toHiraganaAnswer(input: string): string {
  const trimmed = input.trim();
  if (wanakana.isRomaji(trimmed)) return wanakana.toHiragana(trimmed);
  return trimmed;
}

/** Checks a user's typed answer (romaji or kana) against the correct conjugated form. */
export function checkAnswer(userInput: string, correct: ConjugatedForm): boolean {
  const normalized = toHiraganaAnswer(userInput);
  return normalized === correct.kana || userInput.trim() === correct.kanji;
}
