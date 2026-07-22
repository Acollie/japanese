import { useMemo, useState } from 'react';
import { FORM_LABELS, QUIZ_FORMS } from '../conjugation/types';
import type { ConjugatedForm, FormId } from '../conjugation/types';
import { verbs } from '../data/verbs';
import { recordAnswer } from '../stats/progressStore';
import type { QuizMode } from '../home/HomeView';
import { checkAnswer, toHiraganaAnswer } from './kanaUtils';
import { generateDistractors, pickQuestion } from './QuestionGenerator';
import type { Question } from './QuestionGenerator';
import { MultipleChoiceOptions } from './MultipleChoiceOptions';
import { TypedAnswerInput } from './TypedAnswerInput';

interface QuizViewProps {
  mode: QuizMode;
  forms: FormId[];
  onExit: () => void;
}

interface Feedback {
  wasCorrect: boolean;
  correct: ConjugatedForm;
  yourAnswer: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildChoices(question: Question): ConjugatedForm[] {
  const distractors = generateDistractors(verbs, question, 3);
  return shuffle([question.answer, ...distractors]);
}

export function QuizView({ mode, forms, onExit }: QuizViewProps) {
  const formPool = forms.length > 0 ? forms : QUIZ_FORMS;
  const [question, setQuestion] = useState<Question>(() => pickQuestion(verbs, formPool));
  const [choices, setChoices] = useState<ConjugatedForm[]>(() => buildChoices(question));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, attempts: 0 });

  const promptLabel = useMemo(() => FORM_LABELS[question.form], [question.form]);

  function nextQuestion() {
    const next = pickQuestion(verbs, formPool);
    setQuestion(next);
    setChoices(buildChoices(next));
    setFeedback(null);
    setSelected(null);
  }

  function submitAnswer(wasCorrect: boolean, yourAnswer: string) {
    recordAnswer(question.verb, question.form, wasCorrect);
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), attempts: s.attempts + 1 }));
    setFeedback({ wasCorrect, correct: question.answer, yourAnswer });
  }

  function handleTypedSubmit(value: string) {
    submitAnswer(checkAnswer(value, question.answer), toHiraganaAnswer(value));
  }

  function handleChoiceSelect(kana: string) {
    setSelected(kana);
    const chosen = choices.find((c) => c.kana === kana);
    const display = chosen && chosen.kanji !== chosen.kana ? `${chosen.kanji} (${chosen.kana})` : kana;
    submitAnswer(kana === question.answer.kana, display);
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
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">{promptLabel}</p>
        <p className="my-3 text-4xl text-neutral-950 dark:text-neutral-100">
          {question.verb.kanji === question.verb.kana ? question.verb.kana : `${question.verb.kanji} (${question.verb.kana})`}
        </p>
        <p className="mb-5 italic text-neutral-500 dark:text-neutral-400">{question.verb.meaning}</p>

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
              Answer:{' '}
              {feedback.correct.kanji === feedback.correct.kana
                ? feedback.correct.kana
                : `${feedback.correct.kanji} (${feedback.correct.kana})`}
            </p>
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
