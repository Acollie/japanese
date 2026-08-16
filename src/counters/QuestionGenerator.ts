import type { CounterEntry, CounterObjectEntry } from './types';

export interface Question {
  object: CounterObjectEntry;
  answer: CounterEntry;
}

/** Fewest counters a learner can practice at once. Below this there is no quiz to build. */
export const MIN_COUNTERS = 2;

type Rng = () => number;

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

export interface Pools {
  counterPool: CounterEntry[];
  objectPool: CounterObjectEntry[];
}

/**
 * Narrows the dataset to the counters the learner selected, falling back to the
 * full set when the selection is too small to build a quiz from — the same shape
 * of fallback the verb quiz uses for an empty form list.
 */
export function buildPools(
  allCounters: CounterEntry[],
  allObjects: CounterObjectEntry[],
  selectedIds: string[],
): Pools {
  const selected = allCounters.filter((c) => selectedIds.includes(c.id));
  const counterPool = selected.length >= MIN_COUNTERS ? selected : allCounters;
  const objectPool = allObjects.filter((o) => counterPool.some((c) => c.id === o.counterId));
  return { counterPool, objectPool };
}

export function pickQuestion(objects: CounterObjectEntry[], counters: CounterEntry[], rng: Rng = Math.random): Question {
  const object = pick(objects, rng);
  const answer = counters.find((c) => c.id === object.counterId);
  // Silently substituting a counter here would mark a correct learner wrong, so fail loudly instead.
  if (!answer) throw new Error(`Object "${object.id}" references unknown counter "${object.counterId}"`);
  return { object, answer };
}

/**
 * Every counter that grades as correct for a question: the primary answer first,
 * then any the object explicitly also accepts.
 */
export function acceptedCounters(question: Question, allCounters: CounterEntry[]): CounterEntry[] {
  const alsoIds = question.object.alsoAccepted ?? [];
  return [question.answer, ...allCounters.filter((c) => alsoIds.includes(c.id))];
}

/**
 * Builds `count` wrong-answer choices from `pool`. Falls back to `topUp` when the
 * pool can't fill every slot, which happens whenever the learner narrows practice
 * to two or three counters — without the fallback, multiple choice would collapse
 * into a coin flip and inflate their accuracy stats.
 */
export function generateDistractors(
  pool: CounterEntry[],
  question: Question,
  count = 3,
  rng: Rng = Math.random,
  topUp: CounterEntry[] = [],
): CounterEntry[] {
  // Seed with every counter that would grade as correct, so multiple choice never
  // offers two right answers — typed mode stays lenient about them instead.
  const seen = new Set([question.answer.id, ...(question.object.alsoAccepted ?? [])]);
  const distractors: CounterEntry[] = [];

  for (const source of [pool, topUp]) {
    const shuffled = [...source].sort(() => rng() - 0.5);
    for (const candidate of shuffled) {
      if (distractors.length >= count) return distractors;
      if (seen.has(candidate.id)) continue;
      seen.add(candidate.id);
      distractors.push(candidate);
    }
  }

  return distractors;
}
