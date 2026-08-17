import { useState } from 'react';
import { QUIZ_FORMS } from './conjugation/types';
import type { FormId } from './conjugation/types';
import { CountersQuizView } from './counters/CountersQuizView';
import { CountersStatsView } from './counters/CountersStatsView';
import { CountingQuizView } from './counting/CountingQuizView';
import { CountingStatsView } from './counting/CountingStatsView';
import { countableCounters } from './counting/QuestionGenerator';
import { objectCounters } from './data/counters';
import { Footer } from './Footer';
import { HomeView } from './home/HomeView';
import type { Domain, QuizMode } from './home/HomeView';
import { QuizView } from './quiz/QuizView';
import { StatsView } from './stats/StatsView';

type View = 'home' | 'quiz' | 'stats';

const ALL_COUNTER_IDS = objectCounters.map((c) => c.id);
const ALL_COUNTING_IDS = countableCounters.map((c) => c.id);

function App() {
  const [view, setView] = useState<View>('home');
  const [domain, setDomain] = useState<Domain>('verbs');
  const [mode, setMode] = useState<QuizMode>('typed');
  const [selectedForms, setSelectedForms] = useState<FormId[]>(QUIZ_FORMS);
  const [selectedCounterIds, setSelectedCounterIds] = useState<string[]>(ALL_COUNTER_IDS);
  const [selectedCountingIds, setSelectedCountingIds] = useState<string[]>(ALL_COUNTING_IDS);

  function toggleForm(form: FormId) {
    setSelectedForms((prev) => (prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]));
  }

  function toggleCounter(id: string) {
    setSelectedCounterIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function toggleAllForms() {
    setSelectedForms((prev) => (prev.length === QUIZ_FORMS.length ? [] : QUIZ_FORMS));
  }

  function toggleAllCounters() {
    setSelectedCounterIds((prev) => (prev.length === ALL_COUNTER_IDS.length ? [] : ALL_COUNTER_IDS));
  }

  function toggleCounting(id: string) {
    setSelectedCountingIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function toggleAllCounting() {
    setSelectedCountingIds((prev) => (prev.length === ALL_COUNTING_IDS.length ? [] : ALL_COUNTING_IDS));
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-neutral-50 py-0 sm:py-10 dark:bg-neutral-950">
      <div className="flex w-full max-w-2xl flex-col bg-white text-neutral-500 sm:rounded-2xl sm:border sm:border-neutral-200 sm:shadow-sm dark:bg-neutral-900 dark:text-neutral-400 sm:dark:border-neutral-800">
        {view === 'quiz' && domain === 'verbs' && <QuizView mode={mode} forms={selectedForms} onExit={() => setView('home')} />}
        {view === 'quiz' && domain === 'counters' && (
          <CountersQuizView mode={mode} counterIds={selectedCounterIds} onExit={() => setView('home')} />
        )}
        {view === 'quiz' && domain === 'counting' && (
          <CountingQuizView mode={mode} counterIds={selectedCountingIds} onExit={() => setView('home')} />
        )}
        {view === 'stats' && domain === 'verbs' && <StatsView onExit={() => setView('home')} />}
        {view === 'stats' && domain === 'counters' && <CountersStatsView onExit={() => setView('home')} />}
        {view === 'stats' && domain === 'counting' && <CountingStatsView onExit={() => setView('home')} />}
        {view === 'home' && (
          <HomeView
            domain={domain}
            onDomainChange={setDomain}
            mode={mode}
            onModeChange={setMode}
            selectedForms={selectedForms}
            onToggleForm={toggleForm}
            onToggleAllForms={toggleAllForms}
            selectedCounterIds={selectedCounterIds}
            onToggleCounter={toggleCounter}
            onToggleAllCounters={toggleAllCounters}
            selectedCountingIds={selectedCountingIds}
            onToggleCounting={toggleCounting}
            onToggleAllCounting={toggleAllCounting}
            onStart={() => setView('quiz')}
            onViewStats={() => setView('stats')}
          />
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;
