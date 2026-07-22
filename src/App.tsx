import { useState } from 'react';
import { QUIZ_FORMS } from './conjugation/types';
import type { FormId } from './conjugation/types';
import { HomeView } from './home/HomeView';
import type { QuizMode } from './home/HomeView';
import { QuizView } from './quiz/QuizView';
import { StatsView } from './stats/StatsView';

type View = 'home' | 'quiz' | 'stats';

function App() {
  const [view, setView] = useState<View>('home');
  const [mode, setMode] = useState<QuizMode>('typed');
  const [selectedForms, setSelectedForms] = useState<FormId[]>(QUIZ_FORMS);

  function toggleForm(form: FormId) {
    setSelectedForms((prev) => (prev.includes(form) ? prev.filter((f) => f !== form) : [...prev, form]));
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
      {view === 'quiz' && <QuizView mode={mode} forms={selectedForms} onExit={() => setView('home')} />}
      {view === 'stats' && <StatsView onExit={() => setView('home')} />}
      {view === 'home' && (
        <HomeView
          mode={mode}
          onModeChange={setMode}
          selectedForms={selectedForms}
          onToggleForm={toggleForm}
          onSelectAllForms={() => setSelectedForms(QUIZ_FORMS)}
          onStart={() => setView('quiz')}
          onViewStats={() => setView('stats')}
        />
      )}
    </div>
  );
}

export default App;
