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
import styles from './QuizView.module.css';

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
    <div className={styles.quiz}>
      <div className={styles.topBar}>
        <button type="button" className={styles.exitButton} onClick={onExit}>
          ← Home
        </button>
        <span className={styles.score}>
          Score: {score.correct} / {score.attempts}
        </span>
      </div>

      <div className={styles.card}>
        <p className={styles.formLabel}>{promptLabel}</p>
        <p className={styles.prompt}>
          {question.verb.kanji === question.verb.kana ? question.verb.kana : `${question.verb.kanji} (${question.verb.kana})`}
        </p>
        <p className={styles.meaning}>{question.verb.meaning}</p>

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
          <div className={feedback.wasCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}>
            <p>{feedback.wasCorrect ? 'Correct!' : 'Not quite.'}</p>
            {!feedback.wasCorrect && <p className={styles.yourAnswer}>You answered: {feedback.yourAnswer}</p>}
            <p className={styles.answerReveal}>
              Answer: {feedback.correct.kanji === feedback.correct.kana
                ? feedback.correct.kana
                : `${feedback.correct.kanji} (${feedback.correct.kana})`}
            </p>
            <button type="button" className={styles.nextButton} onClick={nextQuestion}>
              Next question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
