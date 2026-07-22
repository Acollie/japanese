import { conjugate } from '../conjugation/engine';
import { QUIZ_FORMS } from '../conjugation/types';
import type { ConjugatedForm, FormId, VerbEntry } from '../conjugation/types';

export interface Question {
  verb: VerbEntry;
  form: FormId;
  answer: ConjugatedForm;
}

type Rng = () => number;

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

export function pickQuestion(verbs: VerbEntry[], forms: FormId[] = QUIZ_FORMS, rng: Rng = Math.random): Question {
  const pool = forms.length > 0 ? forms : QUIZ_FORMS;
  const verb = pick(verbs, rng);
  const form = pick(pool, rng);
  return { verb, form, answer: conjugate(verb, form) };
}

/**
 * Builds `count` wrong-answer choices for a multiple-choice question by conjugating
 * other verbs in the same target form. Falls back to other forms of the same verb
 * if the pool doesn't have enough unique wrong answers.
 */
export function generateDistractors(
  verbs: VerbEntry[],
  question: Question,
  count = 3,
  rng: Rng = Math.random,
): ConjugatedForm[] {
  const seen = new Set([question.answer.kana]);
  const distractors: ConjugatedForm[] = [];

  const otherVerbs = verbs.filter((v) => v.id !== question.verb.id);
  const shuffled = [...otherVerbs].sort(() => rng() - 0.5);

  for (const verb of shuffled) {
    if (distractors.length >= count) break;
    const candidate = conjugate(verb, question.form);
    if (seen.has(candidate.kana)) continue;
    seen.add(candidate.kana);
    distractors.push(candidate);
  }

  // Fallback: same verb, different forms, if the verb pool was too small.
  if (distractors.length < count) {
    for (const form of QUIZ_FORMS) {
      if (distractors.length >= count) break;
      if (form === question.form) continue;
      const candidate = conjugate(question.verb, form);
      if (seen.has(candidate.kana)) continue;
      seen.add(candidate.kana);
      distractors.push(candidate);
    }
  }

  return distractors;
}
