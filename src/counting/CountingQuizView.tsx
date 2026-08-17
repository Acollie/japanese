import { useMemo, useState } from 'react';
import type { QuizMode } from '../home/HomeView';
import { checkAnswer, toHiraganaAnswer } from '../quiz/kanaUtils';
import { MultipleChoiceOptions } from '../quiz/MultipleChoiceOptions';
import { TypedAnswerInput } from '../quiz/TypedAnswerInput';
import { buildCounterPool, countableCounters, generateDistractors, pickQuestion } from './QuestionGenerator';
import type { CountingQuestion } from './QuestionGenerator';
import { recordAnswer } from './progressStore';

interface CountingQuizViewProps {
  mode: QuizMode;
  counterIds: string[];
  onExit: () => void;
}

interface Feedback {
  wasCorrect: boolean;
  answer: string;
  alsoAccepted: string[];
  yourAnswer: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/** MultipleChoiceOptions renders `kanji` only when it differs from `kana`; readings are kana-only. */
function asOption(reading: string) {
  return { kanji: reading, kana: reading };
}

export function CountingQuizView({ mode, counterIds, onExit }: CountingQuizViewProps) {
  const counterPool = useMemo(() => buildCounterPool(counterIds), [counterIds]);

  const [question, setQuestion] = useState<CountingQuestion>(() => pickQuestion(counterPool));
  const [choices, setChoices] = useState<string[]>(() => buildChoices(question, counterPool));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, attempts: 0 });

  function buildChoices(q: CountingQuestion, pool: typeof counterPool): string[] {
    return shuffle([q.answer, ...generateDistractors(pool, q, 3, Math.random, countableCounters)]);
  }

  function nextQuestion() {
    const next = pickQuestion(counterPool);
    setQuestion(next);
    setChoices(buildChoices(next, counterPool));
    setFeedback(null);
    setSelected(null);
  }

  function submitAnswer(wasCorrect: boolean, yourAnswer: string) {
    recordAnswer(question.counter.id, question.n, wasCorrect);
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), attempts: s.attempts + 1 }));
    setFeedback({ wasCorrect, answer: question.answer, alsoAccepted: question.alsoAccepted, yourAnswer });
  }

  function handleTypedSubmit(value: string) {
    const allowed = [question.answer, ...question.alsoAccepted];
    submitAnswer(
      allowed.some((reading) => checkAnswer(value, asOption(reading))),
      toHiraganaAnswer(value),
    );
  }

  function handleChoiceSelect(kana: string) {
    setSelected(kana);
    submitAnswer(kana === question.answer || question.alsoAccepted.includes(kana), kana);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex w-full max-w-[480px] justify-between">
        <button type="button" className="text-sm text-neutral-500 dark:text-neutral-400" onClick={onExit}>
          ← Home
        </button>
        <span className="font-medium text-neutral-950 dark:text-neutral-100">
          Score: {score.correct} / {score.attempts}
        </span>
      </div>

      <div className="flex w-full max-w-[480px] flex-col items-center gap-2 rounded-xl border border-neutral-200 p-8 dark:border-neutral-800">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
          How do you say it?
        </p>
        <p className="my-3 text-6xl text-neutral-950 dark:text-neutral-100">
          {question.n}
          {question.counter.kanji}
        </p>
        <p className="mb-5 italic text-neutral-500 dark:text-neutral-400">{question.counter.usage}</p>

        {mode === 'typed' ? (
          <TypedAnswerInput disabled={!!feedback} onSubmit={handleTypedSubmit} />
        ) : (
          <MultipleChoiceOptions
            options={choices.map(asOption)}
            disabled={!!feedback}
            selected={selected}
            correctKana={question.answer}
            onSelect={handleChoiceSelect}
          />
        )}

        {feedback && (
          <div
            className={`mt-4 w-full rounded-lg p-4 text-center ${
              feedback.wasCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}
          >
            <p className="text-neutral-500 dark:text-neutral-400">{feedback.wasCorrect ? 'Correct!' : 'Not quite.'}</p>
            {!feedback.wasCorrect && (
              <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">You answered: {feedback.yourAnswer}</p>
            )}
            <p className="my-2 text-xl text-neutral-950 dark:text-neutral-100">
              {question.n}
              {question.counter.kanji} — {feedback.answer}
            </p>
            {feedback.alsoAccepted.length > 0 && (
              <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                Also said: {feedback.alsoAccepted.join('、')}
              </p>
            )}
            <button
              type="button"
              className="mt-2 rounded-lg bg-purple-600 px-6 py-2.5 text-[15px] text-white"
              onClick={nextQuestion}
            >
              Next question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
