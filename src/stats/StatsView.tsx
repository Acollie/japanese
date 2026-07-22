import { useState } from 'react';
import { FORM_LABELS } from '../conjugation/types';
import { getStats, resetProgress } from './progressStore';
import styles from './StatsView.module.css';

interface StatsViewProps {
  onExit: () => void;
}

const VERB_TYPE_LABELS: Record<string, string> = {
  ichidan: 'Ichidan (ru-verb)',
  godan: 'Godan (u-verb)',
  irregular: 'Irregular',
};

export function StatsView({ onExit }: StatsViewProps) {
  const [stats, setStats] = useState(() => getStats());

  function handleReset() {
    resetProgress();
    setStats(getStats());
  }

  return (
    <div className={styles.stats}>
      <div className={styles.topBar}>
        <button type="button" className={styles.exitButton} onClick={onExit}>
          ← Home
        </button>
      </div>
      <h2>Your progress</h2>

      {stats.length === 0 ? (
        <p className={styles.empty}>No quiz attempts yet — take a quiz to start tracking progress.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Verb type</th>
              <th>Form</th>
              <th>Accuracy</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={`${s.verbType}:${s.form}`}>
                <td>{VERB_TYPE_LABELS[s.verbType]}</td>
                <td>{FORM_LABELS[s.form]}</td>
                <td>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.round(s.accuracy * 100)}%` }} />
                  </div>
                  <span>{Math.round(s.accuracy * 100)}%</span>
                </td>
                <td>
                  {s.correct} / {s.attempts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {stats.length > 0 && (
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          Reset progress
        </button>
      )}
    </div>
  );
}
