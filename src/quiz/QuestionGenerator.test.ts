import { describe, expect, it } from 'vitest';
import { conjugate } from '../conjugation/engine';
import { QUIZ_FORMS } from '../conjugation/types';
import { verbs } from '../data/verbs';
import { generateDistractors, pickQuestion } from './QuestionGenerator';

// Deterministic seeded RNG for reproducible tests.
function seededRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

describe('pickQuestion', () => {
  it('picks a verb and form from the given pool', () => {
    const rng = seededRng(42);
    const question = pickQuestion(verbs, QUIZ_FORMS, rng);
    expect(verbs).toContainEqual(question.verb);
    expect(question.answer.kana.length).toBeGreaterThan(0);
  });

  it('only picks forms from a restricted form list', () => {
    const rng = seededRng(3);
    for (let i = 0; i < 20; i++) {
      const question = pickQuestion(verbs, ['te', 'ta'], rng);
      expect(['te', 'ta']).toContain(question.form);
    }
  });

  it('falls back to all quiz forms when given an empty form list', () => {
    const rng = seededRng(5);
    const question = pickQuestion(verbs, [], rng);
    expect(QUIZ_FORMS).toContain(question.form);
  });
});

describe('generateDistractors', () => {
  it('returns the requested count of unique distractors, none matching the correct answer', () => {
    const rng = seededRng(7);
    const question = pickQuestion(verbs, QUIZ_FORMS, rng);
    const distractors = generateDistractors(verbs, question, 3, rng);

    expect(distractors).toHaveLength(3);
    const kanas = distractors.map((d) => d.kana);
    expect(new Set(kanas).size).toBe(3);
    expect(kanas).not.toContain(question.answer.kana);
  });

  it('works across every verb in the dataset without throwing or duplicating the answer', () => {
    const rng = seededRng(99);
    for (const verb of verbs) {
      for (const form of QUIZ_FORMS) {
        const answer = conjugate(verb, form);
        const distractors = generateDistractors(verbs, { verb, form, answer }, 3, rng);
        expect(distractors.length).toBeGreaterThan(0);
        expect(distractors.map((d) => d.kana)).not.toContain(answer.kana);
      }
    }
  });
});
