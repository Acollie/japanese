import { beforeEach, describe, expect, it } from 'vitest';
import type { VerbEntry } from '../conjugation/types';
import { getStats, loadProgress, recordAnswer, resetProgress } from './progressStore';

// Minimal in-memory localStorage polyfill for the node test environment.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

const taberu: VerbEntry = { id: 'taberu', kanji: '食べる', kana: 'たべる', meaning: 'to eat', jlpt: 'N5', type: 'ichidan' };
const kau: VerbEntry = { id: 'kau', kanji: '買う', kana: 'かう', meaning: 'to buy', jlpt: 'N5', type: 'godan' };

describe('progressStore', () => {
  it('starts empty', () => {
    expect(loadProgress()).toEqual({ version: 1, perCategory: {}, perVerb: {} });
    expect(getStats()).toEqual([]);
  });

  it('records correct and incorrect answers per category and per verb', () => {
    recordAnswer(taberu, 'masu', true);
    recordAnswer(taberu, 'masu', false);
    recordAnswer(kau, 'masu', true);

    const stats = getStats();
    const ichidanMasu = stats.find((s) => s.verbType === 'ichidan' && s.form === 'masu')!;
    expect(ichidanMasu.correct).toBe(1);
    expect(ichidanMasu.attempts).toBe(2);
    expect(ichidanMasu.accuracy).toBeCloseTo(0.5);

    const godanMasu = stats.find((s) => s.verbType === 'godan' && s.form === 'masu')!;
    expect(godanMasu.correct).toBe(1);
    expect(godanMasu.attempts).toBe(1);
  });

  it('resets progress', () => {
    recordAnswer(taberu, 'te', true);
    resetProgress();
    expect(getStats()).toEqual([]);
  });

  it('falls back to empty progress on corrupted storage', () => {
    localStorage.setItem('japanese-quiz-progress-v1', 'not json');
    expect(loadProgress()).toEqual({ version: 1, perCategory: {}, perVerb: {} });
  });
});
