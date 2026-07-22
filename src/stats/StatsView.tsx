import { useState } from 'react';
import { FORM_LABELS } from '../conjugation/types';
import { getStats, resetProgress } from './progressStore';

interface StatsViewProps {
  onExit: () => void;
}

const VERB_TYPE_LABELS: Record<string, string> = {
  ichidan: 'Ichidan (ru-verb)',
  godan: 'Godan (u-verb)',
  irregular: 'Irregular',
};

const CELL = 'border-b border-neutral-200 px-2 py-2.5 text-sm dark:border-neutral-800';

export function StatsView({ onExit }: StatsViewProps) {
  const [stats, setStats] = useState(() => getStats());

  function handleReset() {
    resetProgress();
    setStats(getStats());
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-full max-w-[640px]">
        <button type="button" className="text-sm text-neutral-500 dark:text-neutral-400" onClick={onExit}>
          ← Home
        </button>
      </div>
      <h2 className="text-2xl font-medium text-neutral-950 dark:text-neutral-100">Your progress</h2>

      {stats.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No quiz attempts yet — take a quiz to start tracking progress.</p>
      ) : (
        <table className="w-full max-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className={`${CELL} text-left font-medium text-neutral-500 dark:text-neutral-400`}>Verb type</th>
              <th className={`${CELL} text-left font-medium text-neutral-500 dark:text-neutral-400`}>Form</th>
              <th className={`${CELL} text-left font-medium text-neutral-500 dark:text-neutral-400`}>Accuracy</th>
              <th className={`${CELL} text-left font-medium text-neutral-500 dark:text-neutral-400`}>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={`${s.verbType}:${s.form}`}>
                <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>{VERB_TYPE_LABELS[s.verbType]}</td>
                <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>{FORM_LABELS[s.form]}</td>
                <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                  <div className="mr-2 inline-block h-2 w-20 rounded-full bg-neutral-100 align-middle dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-purple-600"
                      style={{ width: `${Math.round(s.accuracy * 100)}%` }}
                    />
                  </div>
                  <span>{Math.round(s.accuracy * 100)}%</span>
                </td>
                <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                  {s.correct} / {s.attempts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {stats.length > 0 && (
        <button
          type="button"
          className="mt-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
          onClick={handleReset}
        >
          Reset progress
        </button>
      )}
    </div>
  );
}
