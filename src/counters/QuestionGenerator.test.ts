import { describe, expect, it } from 'vitest';
import { counterObjects } from '../data/counterObjects';
import { objectCounters as counters } from '../data/counters';
import { acceptedCounters, buildPools, generateDistractors, MIN_COUNTERS, pickQuestion } from './QuestionGenerator';

// Deterministic seeded RNG for reproducible tests.
function seededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

describe('pickQuestion', () => {
  it('picks an object and its correct counter', () => {
    const rng = seededRng(42);
    const question = pickQuestion(counterObjects, counters, rng);
    expect(counterObjects).toContainEqual(question.object);
    expect(question.answer.id).toBe(question.object.counterId);
  });

  it('throws rather than substituting a counter when the mapping is broken', () => {
    const orphan = { ...counterObjects[0], id: 'orphan', counterId: 'nonexistent' };
    expect(() => pickQuestion([orphan], counters, seededRng(1))).toThrow(/unknown counter/);
  });
});

describe('acceptedCounters', () => {
  it('returns just the primary answer when the object has no alternatives', () => {
    const neko = counterObjects.find((o) => o.id === 'neko')!;
    const answer = counters.find((c) => c.id === neko.counterId)!;
    expect(acceptedCounters({ object: neko, answer }, counters).map((c) => c.id)).toEqual(['hiki']);
  });

  it('includes alternatives, primary answer first', () => {
    const inu = counterObjects.find((o) => o.id === 'inu')!;
    const answer = counters.find((c) => c.id === inu.counterId)!;
    expect(acceptedCounters({ object: inu, answer }, counters).map((c) => c.id)).toEqual(['hiki', 'tou']);
  });

  it('never offers an accepted alternative as a multiple-choice distractor', () => {
    const rng = seededRng(31);
    const inu = counterObjects.find((o) => o.id === 'inu')!;
    const answer = counters.find((c) => c.id === inu.counterId)!;
    const question = { object: inu, answer };

    for (let i = 0; i < 25; i++) {
      const ids = generateDistractors(counters, question, 3, rng, counters).map((d) => d.id);
      expect(ids).not.toContain('hiki');
      expect(ids).not.toContain('tou');
    }
  });
});

describe('buildPools', () => {
  it('narrows both pools to the selected counters', () => {
    const { counterPool, objectPool } = buildPools(counters, counterObjects, ['hiki', 'tou']);
    expect(counterPool.map((c) => c.id)).toEqual(['hiki', 'tou']);
    expect(objectPool.every((o) => ['hiki', 'tou'].includes(o.counterId))).toBe(true);
    expect(objectPool.length).toBeGreaterThan(0);
  });

  it('falls back to the full set when the selection is too small to quiz on', () => {
    for (const selection of [[], ['hiki'], ['nonexistent', 'alsoNonexistent']]) {
      const { counterPool, objectPool } = buildPools(counters, counterObjects, selection);
      expect(counterPool).toEqual(counters);
      expect(objectPool).toEqual(counterObjects);
    }
  });

  it('never produces a pool that cannot form a question', () => {
    const { counterPool, objectPool } = buildPools(counters, counterObjects, ['ken', 'soku']);
    expect(counterPool.length).toBeGreaterThanOrEqual(MIN_COUNTERS);
    expect(objectPool.length).toBeGreaterThan(0);
  });
});

describe('generateDistractors', () => {
  it('returns the requested count of unique distractors, none matching the correct answer', () => {
    const rng = seededRng(7);
    const question = pickQuestion(counterObjects, counters, rng);
    const distractors = generateDistractors(counters, question, 3, rng);

    expect(distractors).toHaveLength(3);
    const ids = distractors.map((d) => d.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).not.toContain(question.answer.id);
  });

  it('tops up from the full set so a narrow selection still yields 3 distractors', () => {
    const rng = seededRng(11);
    // Two counters selected means only one in-pool distractor exists; without the
    // top-up this collapsed multiple choice to a 50/50 guess.
    for (const selection of [['ken', 'soku'], ['ko', 'nin', 'hai']]) {
      const { counterPool, objectPool } = buildPools(counters, counterObjects, selection);
      const question = pickQuestion(objectPool, counterPool, rng);
      const distractors = generateDistractors(counterPool, question, 3, rng, counters);

      expect(distractors).toHaveLength(3);
      expect(distractors.map((d) => d.id)).not.toContain(question.answer.id);
      expect(new Set(distractors.map((d) => d.id)).size).toBe(3);
    }
  });

  it('never returns more distractors than the whole counter set can supply', () => {
    const rng = seededRng(23);
    const question = pickQuestion(counterObjects, counters, rng);
    const distractors = generateDistractors(counters, question, 99, rng, counters);
    expect(distractors).toHaveLength(counters.length - 1);
  });

  it('works for every object in the dataset without throwing or duplicating the answer', () => {
    const rng = seededRng(99);
    for (const object of counterObjects) {
      const answer = counters.find((c) => c.id === object.counterId)!;
      const distractors = generateDistractors(counters, { object, answer }, 3, rng);
      expect(distractors.length).toBeGreaterThan(0);
      expect(distractors.map((d) => d.id)).not.toContain(answer.id);
    }
  });
});
