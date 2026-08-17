import { describe, expect, it } from 'vitest';
import * as wanakana from 'wanakana';
import { checkAnswer } from '../quiz/kanaUtils';
import {
  buildCounterPool,
  countableCounters,
  generateDistractors,
  MAX_COUNT,
  MIN_COUNTERS,
  pickQuestion,
  readingsFor,
} from './QuestionGenerator';

// Deterministic seeded RNG for reproducible tests.
function seededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

describe('countableCounters', () => {
  it('includes the numeric-only つ, which the object quiz excludes', () => {
    expect(countableCounters.map((c) => c.id)).toContain('tsu');
  });

  it('gives every counter a reading table', () => {
    for (const counter of countableCounters) {
      expect(() => readingsFor(counter.id)).not.toThrow();
    }
  });
});

describe('readingsFor', () => {
  it('throws for a counter with no table rather than returning nothing', () => {
    expect(() => readingsFor('nonexistent')).toThrow(/no reading table/);
  });
});

describe('pickQuestion', () => {
  it('stays within 1..MAX_COUNT and returns the matching reading', () => {
    const rng = seededRng(42);
    for (let i = 0; i < 200; i++) {
      const q = pickQuestion(countableCounters, rng);
      expect(q.n).toBeGreaterThanOrEqual(1);
      expect(q.n).toBeLessThanOrEqual(MAX_COUNT);

      const [primary, ...alternates] = readingsFor(q.counter.id)[q.n - 1];
      expect(q.answer).toBe(primary);
      expect(q.alsoAccepted).toEqual(alternates);
    }
  });

  it('only picks counters from the given pool', () => {
    const rng = seededRng(3);
    const pool = countableCounters.filter((c) => ['hon', 'hiki'].includes(c.id));
    for (let i = 0; i < 40; i++) {
      expect(['hon', 'hiki']).toContain(pickQuestion(pool, rng).counter.id);
    }
  });
});

describe('buildCounterPool', () => {
  it('narrows to the selection', () => {
    expect(buildCounterPool(['hon', 'tsu']).map((c) => c.id)).toEqual(['hon', 'tsu']);
  });

  it('falls back to everything when the selection is too small', () => {
    for (const selection of [[], ['hon'], ['nope', 'alsoNope']]) {
      expect(buildCounterPool(selection)).toEqual(countableCounters);
    }
  });

  it('never returns a pool below the minimum', () => {
    expect(buildCounterPool(['ken', 'soku']).length).toBeGreaterThanOrEqual(MIN_COUNTERS);
  });
});

describe('generateDistractors', () => {
  it('returns 3 unique readings that are never the correct answer', () => {
    const rng = seededRng(7);
    for (let i = 0; i < 100; i++) {
      const q = pickQuestion(countableCounters, rng);
      const d = generateDistractors(countableCounters, q, 3, rng, countableCounters);

      expect(d).toHaveLength(3);
      expect(new Set(d).size).toBe(3);
      expect(d).not.toContain(q.answer);
      for (const alt of q.alsoAccepted) expect(d).not.toContain(alt);
    }
  });

  it('draws distractors from the same number, so the numeral never gives it away', () => {
    const rng = seededRng(13);
    const q = pickQuestion(countableCounters, rng);
    const readingsAtN = countableCounters.map((c) => readingsFor(c.id)[q.n - 1][0]);
    for (const d of generateDistractors(countableCounters, q, 3, rng, countableCounters)) {
      expect(readingsAtN).toContain(d);
    }
  });

  it('tops up from every countable counter when the selection is narrow', () => {
    const rng = seededRng(11);
    const pool = buildCounterPool(['hon', 'hiki']);
    for (let i = 0; i < 40; i++) {
      const q = pickQuestion(pool, rng);
      expect(generateDistractors(pool, q, 3, rng, countableCounters)).toHaveLength(3);
    }
  });
});

describe('typed answers', () => {
  it('accepts every reading typed as kana, and as the romaji it maps to', () => {
    for (const counter of countableCounters) {
      for (const [i, variants] of readingsFor(counter.id).entries()) {
        for (const reading of variants) {
          const target = { kanji: reading, kana: reading };
          expect(checkAnswer(reading, target), `${counter.id} ${i + 1} kana`).toBe(true);
          // A learner types romaji far more often than kana, so the whole table has
          // to survive the round trip, not just the handful spot-checked below.
          const romaji = wanakana.toRomaji(reading);
          expect(checkAnswer(romaji, target), `${counter.id} ${i + 1} romaji "${romaji}"`).toBe(true);
        }
      }
    }
  });

  it('accepts the sound-changed romaji a learner would actually type', () => {
    const cases: [string, string][] = [
      ['ippiki', 'いっぴき'],
      ['sanbiki', 'さんびき'],
      ['ippon', 'いっぽん'],
      ['sanbon', 'さんぼん'],
      ['sangen', 'さんげん'],
      ['hitotsu', 'ひとつ'],
      ['futatsu', 'ふたつ'],
      ['mittsu', 'みっつ'],
      ['hitori', 'ひとり'],
      ['futari', 'ふたり'],
      ['yonin', 'よにん'],
      ['juppon', 'じゅっぽん'],
      ['ippai', 'いっぱい'],
    ];
    for (const [romaji, kana] of cases) {
      expect(checkAnswer(romaji, { kanji: kana, kana }), `${romaji} -> ${kana}`).toBe(true);
    }
  });
});
