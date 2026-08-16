import { beforeEach, describe, expect, it } from 'vitest';
import { getStats, loadProgress, recordAnswer, resetProgress } from './progressStore';
import type { CounterEntry, CounterObjectEntry } from './types';

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

const hiki: CounterEntry = { id: 'hiki', kanji: '匹', kana: 'ひき', usage: 'small animals' };
const tou: CounterEntry = { id: 'tou', kanji: '頭', kana: 'とう', usage: 'large animals' };
const neko: CounterObjectEntry = { id: 'neko', kanji: '猫', kana: 'ねこ', meaning: 'cat', emoji: '🐱', counterId: 'hiki' };
const zou: CounterObjectEntry = { id: 'zou', kanji: '象', kana: 'ぞう', meaning: 'elephant', emoji: '🐘', counterId: 'tou' };

describe('counters progressStore', () => {
  it('starts empty', () => {
    expect(loadProgress()).toEqual({ version: 1, perCounter: {}, perObject: {} });
    expect(getStats([hiki, tou])).toEqual([]);
  });

  it('records correct and incorrect answers per counter and per object', () => {
    recordAnswer(neko, hiki, true);
    recordAnswer(neko, hiki, false);
    recordAnswer(zou, tou, true);

    const stats = getStats([hiki, tou]);
    const hikiStat = stats.find((s) => s.counter.id === 'hiki')!;
    expect(hikiStat.correct).toBe(1);
    expect(hikiStat.attempts).toBe(2);
    expect(hikiStat.accuracy).toBeCloseTo(0.5);

    const touStat = stats.find((s) => s.counter.id === 'tou')!;
    expect(touStat.correct).toBe(1);
    expect(touStat.attempts).toBe(1);
  });

  it('resets progress', () => {
    recordAnswer(neko, hiki, true);
    resetProgress();
    expect(getStats([hiki, tou])).toEqual([]);
  });

  it('falls back to empty progress on corrupted storage', () => {
    localStorage.setItem('japanese-counters-progress-v1', 'not json');
    expect(loadProgress()).toEqual({ version: 1, perCounter: {}, perObject: {} });
  });
});
