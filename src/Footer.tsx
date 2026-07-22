const ICON_CLASS = 'h-5 w-5 text-neutral-400 hover:text-purple-600 dark:text-neutral-500 dark:hover:text-purple-400';

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={ICON_CLASS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.5-3.75-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={ICON_CLASS}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-4 border-t border-neutral-200 px-6 py-5 dark:border-neutral-800">
      <a href="https://github.com/Acollie" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
        <img
          src="https://github.com/Acollie.png"
          alt=""
          className="h-7 w-7 rounded-full opacity-70 transition-opacity hover:opacity-100"
        />
      </a>
      <a
        href="https://www.alexcollie.com?utm_source=japanese-quiz&utm_medium=footer"
        target="_blank"
        rel="noopener"
        aria-label="Website"
        title="Website"
      >
        <GlobeIcon />
      </a>
      <a href="mailto:Alex@alexcollie.com" aria-label="Email" title="Email">
        <MailIcon />
      </a>
    </footer>
  );
}
