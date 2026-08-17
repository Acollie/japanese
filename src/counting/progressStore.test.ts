import { beforeEach, describe, expect, it } from 'vitest';
import type { CounterEntry } from '../counters/types';
import { getNumberStats, getStats, loadProgress, recordAnswer, resetProgress } from './progressStore';

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

const hon: CounterEntry = { id: 'hon', kanji: '本', kana: 'ほん', usage: 'long thin objects' };
const mai: CounterEntry = { id: 'mai', kanji: '枚', kana: 'まい', usage: 'flat thin objects' };
const pool = [hon, mai];

describe('counting progressStore', () => {
  it('starts empty', () => {
    expect(loadProgress()).toEqual({ version: 1, perCounter: {}, perNumber: {} });
    expect(getStats(pool)).toEqual([]);
    expect(getNumberStats()).toEqual([]);
  });

  it('tracks accuracy per counter', () => {
    recordAnswer('hon', 1, true);
    recordAnswer('hon', 3, false);
    recordAnswer('mai', 1, true);

    const stats = getStats(pool);
    const honStat = stats.find((s) => s.counter.id === 'hon')!;
    expect(honStat.correct).toBe(1);
    expect(honStat.attempts).toBe(2);
    expect(honStat.accuracy).toBeCloseTo(0.5);
    expect(stats.find((s) => s.counter.id === 'mai')!.attempts).toBe(1);
  });

  it('tracks accuracy per number independently of counter, sorted numerically', () => {
    recordAnswer('hon', 3, false);
    recordAnswer('mai', 3, false);
    recordAnswer('hon', 10, true);
    recordAnswer('hon', 2, true);

    const byNumber = getNumberStats();
    expect(byNumber.map((s) => s.n)).toEqual([2, 3, 10]);

    const three = byNumber.find((s) => s.n === 3)!;
    expect(three.attempts).toBe(2);
    expect(three.accuracy).toBe(0);
  });

  it('drops stats for counters outside the given pool', () => {
    recordAnswer('retired', 1, true);
    expect(getStats(pool)).toEqual([]);
  });

  it('resets progress', () => {
    recordAnswer('hon', 1, true);
    resetProgress();
    expect(getStats(pool)).toEqual([]);
    expect(getNumberStats()).toEqual([]);
  });

  it('falls back to empty progress on corrupted storage', () => {
    localStorage.setItem('japanese-counting-progress-v1', 'not json');
    expect(loadProgress()).toEqual({ version: 1, perCounter: {}, perNumber: {} });
  });

  it('keeps counting progress separate from the other domains', () => {
    recordAnswer('hon', 1, true);
    expect(localStorage.getItem('japanese-quiz-progress-v1')).toBeNull();
    expect(localStorage.getItem('japanese-counters-progress-v1')).toBeNull();
  });
});
