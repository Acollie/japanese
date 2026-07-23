import { useEffect, useState } from 'react';
import { incrementAndGetHits } from './hitCounter';

export function Footer() {
  const [hits, setHits] = useState<number | null>(null);

  useEffect(() => {
    incrementAndGetHits().then(setHits);
  }, []);

  return (
    <footer className="mt-auto flex flex-col items-center justify-center gap-2 border-t border-neutral-200 px-6 py-5 dark:border-neutral-800">
      <a href="https://github.com/Acollie" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
        <img
          src="https://github.com/Acollie.png"
          alt=""
          className="h-7 w-7 rounded-full opacity-70 transition-opacity hover:opacity-100"
        />
      </a>
      {hits !== null && (
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{hits.toLocaleString()} visits</span>
      )}
    </footer>
  );
}
