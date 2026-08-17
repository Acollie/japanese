# 日本語練習 — Japanese Verb & Counter Practice

**Live site: https://acollie.github.io/japanese/**

A static quiz site for practicing Japanese at the N5/N4 level: verb conjugation, and 助数詞 (counter words — 匹, 人, 本, 枚...) for everyday objects.

> [!WARNING]
> **Heavily vibe-coded.** This is a personal learning tool, built fast and mostly with an AI assistant. It is not a textbook and it has not been reviewed by a Japanese teacher. The conjugations and counters are drilled from a small hand-curated dataset that may contain mistakes, and real Japanese often allows more than one right answer where this app insists on one. Use it for practice and repetition, but check anything surprising against a real reference before trusting it. Same goes for the code — learn from it, don't depend on it.

## Features

- **Verbs**: 9 conjugation forms (masu, masen, mashita, masendeshita, nai, nakatta, te, ta, teiru) across ichidan (ru-verbs), godan (u-verbs), and irregular verbs (する, 来る) — selectable via a forms grid on the home page. ~47 curated N5/N4 verbs, including the classic godan verbs that look like ichidan (帰る, 入る, 知る, 切る, 走る, 要る)
- **Counters**: which counter word (助数詞) goes with which object — 匹/頭/羽 for animals, 本 for long thin things, 枚 for flat things, 冊 for books, and more, including the classic traps (rabbits take 羽, not 匹; books are counted with 冊, not 本)
- **Counting**: saying the number and counter together, which is where the sound changes live — 一匹 いっぴき, 三匹 さんびき, 一本 いっぽん, 三本 さんぼん, 三軒 さんげん. Covers 1–10 for every counter plus the native つ series (ひとつ, ふたつ, みっつ… とお) and the irregular 一人 ひとり / 二人 ふたり. Multiple-choice distractors are readings of the *same* number from other counters, so the numeral never gives the answer away
- Type-the-answer or multiple-choice quiz modes (romaji or kana accepted for typed answers), selectable per domain
- Progress tracking (accuracy per category) saved to localStorage, tracked separately per domain
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
- `src/quiz/` — question generation, kana/romaji answer checking, and quiz UI for the verbs domain
- `src/stats/` — localStorage-backed progress tracking for the verbs domain
- `src/counters/` — types, question generation, quiz UI, and progress tracking for the counters domain
- `src/counting/` — question generation, quiz UI, and progress tracking for the number+counter reading domain
- `src/data/counters.ts` — the curated counter (助数詞) dataset. `objectCounters` excludes numeric-only counters like つ
- `src/data/counterObjects.ts` — objects mapped to their correct counter
- `src/data/counterReadings.ts` — readings 1–10 for each counter, with the gemination and rendaku spelled out

## Extending

Adding a new verb: append an entry to `src/data/verbs.ts`. Adding a new target form (e.g. potential, volitional): add it to `FormId` and `QUIZ_FORMS` in `src/conjugation/types.ts`, then add the corresponding conjugation rule in `src/conjugation/engine.ts`.

Adding a new counter object: append an entry to `src/data/counterObjects.ts` with the `counterId` of an existing counter in `src/data/counters.ts`. Adding a new counter word: append an entry to `src/data/counters.ts`, add at least two objects that use it in `src/data/counterObjects.ts`, and add its 1–10 readings to `src/data/counterReadings.ts` — the tests enforce all three.
