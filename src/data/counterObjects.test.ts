import { describe, expect, it } from 'vitest';
import { counterObjects } from './counterObjects';
import { objectCounters as counters } from './counters';

describe('counter dataset', () => {
  it('has no duplicate ids', () => {
    const ids = counters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('counterObjects dataset', () => {
  it('has no duplicate ids', () => {
    const ids = counterObjects.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every object references a real counter', () => {
    const counterIds = new Set(counters.map((c) => c.id));
    for (const object of counterObjects) {
      expect(counterIds.has(object.counterId)).toBe(true);
    }
  });

  // Distractors come from the counter list, not this one — two objects per counter is
  // about question variety, so practising a single counter isn't the same card every time.
  it('every counter has at least two objects to ask about', () => {
    const countByCounter = new Map<string, number>();
    for (const object of counterObjects) {
      countByCounter.set(object.counterId, (countByCounter.get(object.counterId) ?? 0) + 1);
    }
    for (const counter of counters) {
      expect(countByCounter.get(counter.id) ?? 0).toBeGreaterThanOrEqual(2);
    }
  });
});
