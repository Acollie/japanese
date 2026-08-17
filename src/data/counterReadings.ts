/**
 * Readings for 1–10 with each counter — the part of 助数詞 actually worth drilling,
 * since the number and the counter fuse: 一匹 is いっぴき, not いちひき, and 三匹 is
 * さんびき, not さんひき.
 *
 * Each entry is [primary, ...also accepted]. Alternates are real variants a learner
 * will hear (じゅっぽん and じっぽん are both current; しちにん and ななにん both occur),
 * not typo tolerance — that is handled separately by the romaji/kana conversion.
 *
 * The counter's own kana is the stem these fuse onto, so it is intentionally NOT
 * repeated here; see counters.ts for the citation form.
 */
export interface CounterReadings {
  /** Matches a CounterEntry id, except `tsu`, which is numeric-only. */
  counterId: string;
  /** Index 0 is "one" through index 9 "ten". Each is [primary, ...alternates]. */
  readings: string[][];
}

export const counterReadings: CounterReadings[] = [
  {
    // The native Japanese series. Irregular throughout and stops at とお.
    counterId: 'tsu',
    readings: [
      ['ひとつ'],
      ['ふたつ'],
      ['みっつ'],
      ['よっつ'],
      ['いつつ'],
      ['むっつ'],
      ['ななつ'],
      ['やっつ'],
      ['ここのつ'],
      ['とお'],
    ],
  },
  {
    // 一人 and 二人 keep the native readings; everything from three on is regular.
    counterId: 'nin',
    readings: [
      ['ひとり'],
      ['ふたり'],
      ['さんにん'],
      ['よにん'],
      ['ごにん'],
      ['ろくにん'],
      ['ななにん', 'しちにん'],
      ['はちにん'],
      ['きゅうにん', 'くにん'],
      ['じゅうにん'],
    ],
  },
  {
    counterId: 'ko',
    readings: [
      ['いっこ'],
      ['にこ'],
      ['さんこ'],
      ['よんこ'],
      ['ごこ'],
      ['ろっこ'],
      ['ななこ'],
      ['はっこ', 'はちこ'],
      ['きゅうこ'],
      ['じゅっこ', 'じっこ'],
    ],
  },
  {
    // h-row counter: 1, 6, 8, 10 geminate to っぴ and 3 voices to び.
    counterId: 'hiki',
    readings: [
      ['いっぴき'],
      ['にひき'],
      ['さんびき'],
      ['よんひき'],
      ['ごひき'],
      ['ろっぴき'],
      ['ななひき'],
      ['はっぴき'],
      ['きゅうひき'],
      ['じゅっぴき', 'じっぴき'],
    ],
  },
  {
    counterId: 'tou',
    readings: [
      ['いっとう'],
      ['にとう'],
      ['さんとう'],
      ['よんとう'],
      ['ごとう'],
      ['ろくとう'],
      ['ななとう'],
      ['はっとう'],
      ['きゅうとう'],
      ['じゅっとう', 'じっとう'],
    ],
  },
  {
    // The most variable counter here: the ぱ forms are common but not obligatory.
    counterId: 'wa',
    readings: [
      ['いちわ'],
      ['にわ'],
      ['さんわ', 'さんば'],
      ['よんわ'],
      ['ごわ'],
      ['ろくわ', 'ろっぱ'],
      ['ななわ'],
      ['はちわ', 'はっぱ'],
      ['きゅうわ'],
      ['じゅうわ', 'じゅっぱ'],
    ],
  },
  {
    // h-row, same shape as 匹: っぽ at 1, 6, 8, 10 and ぼ at 3.
    counterId: 'hon',
    readings: [
      ['いっぽん'],
      ['にほん'],
      ['さんぼん'],
      ['よんほん'],
      ['ごほん'],
      ['ろっぽん'],
      ['ななほん'],
      ['はっぽん'],
      ['きゅうほん'],
      ['じゅっぽん', 'じっぽん'],
    ],
  },
  {
    // Fully regular — a useful control against the h-row counters.
    counterId: 'mai',
    readings: [
      ['いちまい'],
      ['にまい'],
      ['さんまい'],
      ['よんまい'],
      ['ごまい'],
      ['ろくまい'],
      ['ななまい'],
      ['はちまい'],
      ['きゅうまい'],
      ['じゅうまい'],
    ],
  },
  {
    counterId: 'satsu',
    readings: [
      ['いっさつ'],
      ['にさつ'],
      ['さんさつ'],
      ['よんさつ'],
      ['ごさつ'],
      ['ろくさつ'],
      ['ななさつ'],
      ['はっさつ'],
      ['きゅうさつ'],
      ['じゅっさつ', 'じっさつ'],
    ],
  },
  {
    counterId: 'dai',
    readings: [
      ['いちだい'],
      ['にだい'],
      ['さんだい'],
      ['よんだい'],
      ['ごだい'],
      ['ろくだい'],
      ['ななだい'],
      ['はちだい'],
      ['きゅうだい'],
      ['じゅうだい'],
    ],
  },
  {
    // h-row again, and the one learners meet first: 一杯 いっぱい.
    counterId: 'hai',
    readings: [
      ['いっぱい'],
      ['にはい'],
      ['さんばい'],
      ['よんはい'],
      ['ごはい'],
      ['ろっぱい'],
      ['ななはい'],
      ['はっぱい'],
      ['きゅうはい'],
      ['じゅっぱい', 'じっぱい'],
    ],
  },
  {
    // k-row: geminates at 1, 6, 8, 10 and voices to げ at 3.
    counterId: 'ken',
    readings: [
      ['いっけん'],
      ['にけん'],
      ['さんげん'],
      ['よんけん'],
      ['ごけん'],
      ['ろっけん'],
      ['ななけん'],
      ['はっけん'],
      ['きゅうけん'],
      ['じゅっけん', 'じっけん'],
    ],
  },
  {
    // s-row: geminates at 1, 8, 10 and voices to ぞ at 3.
    counterId: 'soku',
    readings: [
      ['いっそく'],
      ['にそく'],
      ['さんぞく'],
      ['よんそく'],
      ['ごそく'],
      ['ろくそく'],
      ['ななそく'],
      ['はっそく'],
      ['きゅうそく'],
      ['じゅっそく', 'じっそく'],
    ],
  },
];
