import { counterReadings } from '../data/counterReadings';
import { counters } from '../data/counters';
import type { CounterEntry } from '../counters/types';

export interface CountingQuestion {
  counter: CounterEntry;
  /** 1–10. */
  n: number;
  /** Primary reading in kana. */
  answer: string;
  /** Variants that also grade as correct, e.g. じっぽん beside じゅっぽん. */
  alsoAccepted: string[];
}

/** Fewest counters a reading quiz needs before multiple choice has anything to offer. */
export const MIN_COUNTERS = 2;

/** Highest number drilled. The native つ series stops at とお, which caps everything. */
export const MAX_COUNT = 10;

type Rng = () => number;

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

/** Counters that have a reading table, in the order they appear in the counter list. */
export const countableCounters: CounterEntry[] = counters.filter((c) =>
  counterReadings.some((r) => r.counterId === c.id),
);

export function readingsFor(counterId: string): string[][] {
  const entry = counterReadings.find((r) => r.counterId === counterId);
  // A counter reaching the quiz without a reading table would mean a silently
  // unanswerable question, so surface it instead.
  if (!entry) throw new Error(`Counter "${counterId}" has no reading table`);
  return entry.readings;
}

export function buildCounterPool(selectedIds: string[]): CounterEntry[] {
  const selected = countableCounters.filter((c) => selectedIds.includes(c.id));
  return selected.length >= MIN_COUNTERS ? selected : countableCounters;
}

export function pickQuestion(pool: CounterEntry[], rng: Rng = Math.random): CountingQuestion {
  const counter = pick(pool, rng);
  const n = Math.floor(rng() * MAX_COUNT) + 1;
  const [answer, ...alsoAccepted] = readingsFor(counter.id)[n - 1];
  return { counter, n, answer, alsoAccepted };
}

/**
 * Wrong readings for the same number, taken from other counters. Same-number
 * distractors are the point: they force the learner to hear that 三 is さんびき
 * with 匹 but さんげん with 軒, rather than pattern-matching on the numeral.
 */
export function generateDistractors(
  pool: CounterEntry[],
  question: CountingQuestion,
  count = 3,
  rng: Rng = Math.random,
  topUp: CounterEntry[] = [],
): string[] {
  const seen = new Set([question.answer, ...question.alsoAccepted]);
  const distractors: string[] = [];

  for (const source of [pool, topUp]) {
    const shuffled = [...source].sort(() => rng() - 0.5);
    for (const counter of shuffled) {
      if (distractors.length >= count) return distractors;
      if (counter.id === question.counter.id) continue;
      const candidate = readingsFor(counter.id)[question.n - 1][0];
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      distractors.push(candidate);
    }
  }

  return distractors;
}
