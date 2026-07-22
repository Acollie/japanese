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

  if (view === 'quiz') {
    return <QuizView mode={mode} forms={selectedForms} onExit={() => setView('home')} />;
  }
  if (view === 'stats') {
    return <StatsView onExit={() => setView('home')} />;
  }
  return (
    <HomeView
      mode={mode}
      onModeChange={setMode}
      selectedForms={selectedForms}
      onToggleForm={toggleForm}
      onSelectAllForms={() => setSelectedForms(QUIZ_FORMS)}
      onStart={() => setView('quiz')}
      onViewStats={() => setView('stats')}
    />
  );
}

export default App;
