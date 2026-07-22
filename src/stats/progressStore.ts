import type { FormId, VerbEntry, VerbType } from '../conjugation/types';

const STORAGE_KEY = 'japanese-quiz-progress-v1';

interface Tally {
  correct: number;
  attempts: number;
}

interface ProgressData {
  version: 1;
  perCategory: Record<string, Tally>;
  perVerb: Record<string, Tally>;
}

function emptyProgress(): ProgressData {
  return { version: 1, perCategory: {}, perVerb: {} };
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

export function recordAnswer(verb: VerbEntry, form: FormId, wasCorrect: boolean): void {
  const data = loadProgress();
  const categoryKey = `${verb.type}:${form}`;
  const verbKey = `${verb.id}:${form}`;
  data.perCategory[categoryKey] = bump(data.perCategory[categoryKey], wasCorrect);
  data.perVerb[verbKey] = bump(data.perVerb[verbKey], wasCorrect);
  saveProgress(data);
}

export interface CategoryStat {
  verbType: VerbType;
  form: FormId;
  correct: number;
  attempts: number;
  accuracy: number;
}

export function getStats(): CategoryStat[] {
  const data = loadProgress();
  return Object.entries(data.perCategory)
    .map(([key, tally]) => {
      const [verbType, form] = key.split(':') as [VerbType, FormId];
      return {
        verbType,
        form,
        correct: tally.correct,
        attempts: tally.attempts,
        accuracy: tally.attempts > 0 ? tally.correct / tally.attempts : 0,
      };
    })
    .sort((a, b) => (a.verbType + a.form).localeCompare(b.verbType + b.form));
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
