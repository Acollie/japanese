import type { CounterEntry, CounterObjectEntry } from './types';

const STORAGE_KEY = 'japanese-counters-progress-v1';

interface Tally {
  correct: number;
  attempts: number;
}

interface ProgressData {
  version: 1;
  perCounter: Record<string, Tally>;
  perObject: Record<string, Tally>;
}

function emptyProgress(): ProgressData {
  return { version: 1, perCounter: {}, perObject: {} };
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

export function recordAnswer(object: CounterObjectEntry, counter: CounterEntry, wasCorrect: boolean): void {
  const data = loadProgress();
  data.perCounter[counter.id] = bump(data.perCounter[counter.id], wasCorrect);
  data.perObject[object.id] = bump(data.perObject[object.id], wasCorrect);
  saveProgress(data);
}

export interface CounterStat {
  counter: CounterEntry;
  correct: number;
  attempts: number;
  accuracy: number;
}

export function getStats(counters: CounterEntry[]): CounterStat[] {
  const data = loadProgress();
  return Object.entries(data.perCounter)
    .map(([counterId, tally]) => {
      const counter = counters.find((c) => c.id === counterId);
      if (!counter) return null;
      return {
        counter,
        correct: tally.correct,
        attempts: tally.attempts,
        accuracy: tally.attempts > 0 ? tally.correct / tally.attempts : 0,
      };
    })
    .filter((s): s is CounterStat => s !== null)
    .sort((a, b) => a.counter.id.localeCompare(b.counter.id));
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
