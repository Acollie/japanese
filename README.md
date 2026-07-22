# 日本語動詞練習 — N5/N4 Verb Conjugation Practice

A static quiz site for practicing Japanese verb conjugation at the N5/N4 level: masu-form, nai-form, te-form, and ta-form, across ichidan (ru-verbs), godan (u-verbs), and irregular verbs (する, 来る).

## Features

- Type-the-answer or multiple-choice quiz modes (romaji or kana accepted for typed answers)
- ~47 curated N5/N4 verbs, including the classic godan verbs that look like ichidan (帰る, 入る, 知る, 切る, 走る, 要る)
- Progress tracking (accuracy per verb-type × form) saved to localStorage
- No backend — deploys as a static site to GitHub Pages

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # run the conjugation engine + dataset + quiz logic tests
npm run build    # type-check and build for production
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds, and publishes to GitHub Pages via GitHub Actions. One-time setup: in the repo's Settings → Pages, set Source to "GitHub Actions".

## Project structure

- `src/conjugation/` — the conjugation engine (pure functions + lookup tables, no per-verb branching except for true irregulars)
- `src/data/verbs.ts` — the curated verb dataset
- `src/quiz/` — question generation, kana/romaji answer checking, and quiz UI
- `src/stats/` — localStorage-backed progress tracking

## Extending

Adding a new verb: append an entry to `src/data/verbs.ts`. Adding a new target form (e.g. potential, volitional): add it to `FormId` and `QUIZ_FORMS` in `src/conjugation/types.ts`, then add the corresponding conjugation rule in `src/conjugation/engine.ts`.
