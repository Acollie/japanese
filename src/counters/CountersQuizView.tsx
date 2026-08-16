import { useMemo, useState } from 'react';
import { counterObjects } from '../data/counterObjects';
import { counters } from '../data/counters';
import type { QuizMode } from '../home/HomeView';
import { checkAnswer, toHiraganaAnswer } from '../quiz/kanaUtils';
import { MultipleChoiceOptions } from '../quiz/MultipleChoiceOptions';
import { TypedAnswerInput } from '../quiz/TypedAnswerInput';
import { acceptedCounters, buildPools, generateDistractors, pickQuestion } from './QuestionGenerator';
import type { Question } from './QuestionGenerator';
import { recordAnswer } from './progressStore';
import type { CounterEntry } from './types';

interface CountersQuizViewProps {
  mode: QuizMode;
  counterIds: string[];
  onExit: () => void;
}

interface Feedback {
  wasCorrect: boolean;
  correct: CounterEntry;
  yourAnswer: string;
  /** Copied off the answered object so it survives the move to the next question. */
  note?: string;
  /** Counters beyond the primary answer that also graded as correct. */
  alsoAccepted: CounterEntry[];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildChoices(question: Question, counterPool: CounterEntry[]): CounterEntry[] {
  const distractors = generateDistractors(counterPool, question, 3, Math.random, counters);
  return shuffle([question.answer, ...distractors]);
}

export function CountersQuizView({ mode, counterIds, onExit }: CountersQuizViewProps) {
  const { counterPool, objectPool } = useMemo(
    () => buildPools(counters, counterObjects, counterIds),
    [counterIds],
  );

  const [question, setQuestion] = useState<Question>(() => pickQuestion(objectPool, counterPool));
  const accepted = useMemo(() => acceptedCounters(question, counters), [question]);
  const [choices, setChoices] = useState<CounterEntry[]>(() => buildChoices(question, counterPool));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, attempts: 0 });

  function nextQuestion() {
    const next = pickQuestion(objectPool, counterPool);
    setQuestion(next);
    setChoices(buildChoices(next, counterPool));
    setFeedback(null);
    setSelected(null);
  }

  function submitAnswer(wasCorrect: boolean, yourAnswer: string) {
    recordAnswer(question.object, question.answer, wasCorrect);
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), attempts: s.attempts + 1 }));
    setFeedback({
      wasCorrect,
      correct: question.answer,
      yourAnswer,
      note: question.object.note,
      alsoAccepted: accepted.slice(1),
    });
  }

  function handleTypedSubmit(value: string) {
    submitAnswer(
      accepted.some((c) => checkAnswer(value, c)),
      toHiraganaAnswer(value),
    );
  }

  function handleChoiceSelect(kana: string) {
    setSelected(kana);
    const chosen = choices.find((c) => c.kana === kana);
    const display = chosen && chosen.kanji !== chosen.kana ? `${chosen.kanji} (${chosen.kana})` : kana;
    submitAnswer(
      accepted.some((c) => c.kana === kana),
      display,
    );
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
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">Which counter?</p>
        {/* Decorative: the kanji, kana and meaning below carry the question. */}
        <p className="my-3 text-6xl" aria-hidden="true">
          {question.object.emoji}
        </p>
        <p className="mb-1 text-2xl text-neutral-950 dark:text-neutral-100">
          {question.object.kanji === question.object.kana
            ? question.object.kana
            : `${question.object.kanji} (${question.object.kana})`}
        </p>
        <p className="mb-5 italic text-neutral-500 dark:text-neutral-400">{question.object.meaning}</p>

        {mode === 'typed' ? (
          <TypedAnswerInput disabled={!!feedback} onSubmit={handleTypedSubmit} />
        ) : (
          <MultipleChoiceOptions
            options={choices}
            disabled={!!feedback}
            selected={selected}
            correctKana={question.answer.kana}
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
              Answer: {feedback.correct.kanji} ({feedback.correct.kana})
            </p>
            <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">{feedback.correct.usage}</p>
            {feedback.alsoAccepted.length > 0 && (
              <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                Also accepted: {feedback.alsoAccepted.map((c) => `${c.kanji} (${c.kana})`).join(', ')}
              </p>
            )}
            {feedback.note && (
              <p className="mx-auto mb-2 max-w-[38ch] text-[13px] leading-snug text-neutral-500 dark:text-neutral-400">
                {feedback.note}
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
