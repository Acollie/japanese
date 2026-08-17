import { useState } from 'react';
import { countableCounters } from './QuestionGenerator';
import { getNumberStats, getStats, resetProgress } from './progressStore';

interface CountingStatsViewProps {
  onExit: () => void;
}

const CELL = 'border-b border-neutral-200 px-2 py-2.5 text-sm dark:border-neutral-800';
const HEAD = `${CELL} text-left font-medium text-neutral-500 dark:text-neutral-400`;

function AccuracyBar({ accuracy }: { accuracy: number }) {
  return (
    <>
      <div className="mr-2 inline-block h-2 w-20 rounded-full bg-neutral-100 align-middle dark:bg-neutral-800">
        <div className="h-full rounded-full bg-purple-600" style={{ width: `${Math.round(accuracy * 100)}%` }} />
      </div>
      <span>{Math.round(accuracy * 100)}%</span>
    </>
  );
}

export function CountingStatsView({ onExit }: CountingStatsViewProps) {
  const [stats, setStats] = useState(() => getStats(countableCounters));
  const [numberStats, setNumberStats] = useState(() => getNumberStats());

  function handleReset() {
    resetProgress();
    setStats(getStats(countableCounters));
    setNumberStats(getNumberStats());
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
        <>
          <table className="w-full max-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className={HEAD}>Counter</th>
                <th className={HEAD}>Used for</th>
                <th className={HEAD}>Accuracy</th>
                <th className={HEAD}>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.counter.id}>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                    {s.counter.kanji} ({s.counter.kana})
                  </td>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>{s.counter.usage}</td>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                    <AccuracyBar accuracy={s.accuracy} />
                  </td>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                    {s.correct} / {s.attempts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-2 w-full max-w-[640px] text-[13px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            By number
          </p>
          <table className="w-full max-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className={HEAD}>Number</th>
                <th className={HEAD}>Accuracy</th>
                <th className={HEAD}>Attempts</th>
              </tr>
            </thead>
            <tbody>
              {numberStats.map((s) => (
                <tr key={s.n}>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>{s.n}</td>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                    <AccuracyBar accuracy={s.accuracy} />
                  </td>
                  <td className={`${CELL} text-neutral-950 dark:text-neutral-100`}>
                    {s.correct} / {s.attempts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
