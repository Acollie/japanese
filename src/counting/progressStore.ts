import type { CounterEntry } from '../counters/types';

const STORAGE_KEY = 'japanese-counting-progress-v1';

interface Tally {
  correct: number;
  attempts: number;
}

interface ProgressData {
  version: 1;
  perCounter: Record<string, Tally>;
  perNumber: Record<string, Tally>;
}

function emptyProgress(): ProgressData {
  return { version: 1, perCounter: {}, perNumber: {} };
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return emptyProgress();
    return parsed as ProgressData;
  } catch {
    return emptyProgress();
  }
}

function saveProgress(data: ProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function bump(tally: Tally | undefined, wasCorrect: boolean): Tally {
  const t = tally ?? { correct: 0, attempts: 0 };
  return { correct: t.correct + (wasCorrect ? 1 : 0), attempts: t.attempts + 1 };
}

export function recordAnswer(counterId: string, n: number, wasCorrect: boolean): void {
  const data = loadProgress();
  data.perCounter[counterId] = bump(data.perCounter[counterId], wasCorrect);
  // Tracked separately because the hard numbers (1, 3, 6, 8, 10) are hard across
  // every counter, so per-number accuracy says something per-counter accuracy can't.
  data.perNumber[String(n)] = bump(data.perNumber[String(n)], wasCorrect);
  saveProgress(data);
}

export interface CountingStat {
  counter: CounterEntry;
  correct: number;
  attempts: number;
  accuracy: number;
}

export function getStats(pool: CounterEntry[]): CountingStat[] {
  const data = loadProgress();
  return Object.entries(data.perCounter)
    .map(([counterId, tally]) => {
      const counter = pool.find((c) => c.id === counterId);
      if (!counter) return null;
      return {
        counter,
        correct: tally.correct,
        attempts: tally.attempts,
        accuracy: tally.attempts > 0 ? tally.correct / tally.attempts : 0,
      };
    })
    .filter((s): s is CountingStat => s !== null)
    .sort((a, b) => a.counter.id.localeCompare(b.counter.id));
}

export interface NumberStat {
  n: number;
  correct: number;
  attempts: number;
  accuracy: number;
}

export function getNumberStats(): NumberStat[] {
  const data = loadProgress();
  return Object.entries(data.perNumber)
    .map(([n, tally]) => ({
      n: Number(n),
      correct: tally.correct,
      attempts: tally.attempts,
      accuracy: tally.attempts > 0 ? tally.correct / tally.attempts : 0,
    }))
    .sort((a, b) => a.n - b.n);
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
