import type { CounterEntry } from '../counters/types';

/**
 * Curated set of common N5/N4 counters (助数詞). Covers the classic confusions:
 * 匹 vs 頭 vs 羽 for animals (rabbits famously take 羽, not 匹), and 本 doing
 * double duty as both the word for "book" and the counter for long thin objects
 * while books themselves are actually counted with 冊.
 */
export const counters: CounterEntry[] = [
  { id: 'ko', kanji: '個', kana: 'こ', usage: 'small, general objects' },
  { id: 'nin', kanji: '人', kana: 'にん', usage: 'people' },
  { id: 'hiki', kanji: '匹', kana: 'ひき', usage: 'small animals (cats, dogs, fish, bugs)' },
  { id: 'tou', kanji: '頭', kana: 'とう', usage: 'large animals (cows, horses, elephants)' },
  { id: 'wa', kanji: '羽', kana: 'わ', usage: 'birds — and, famously, rabbits' },
  { id: 'hon', kanji: '本', kana: 'ほん', usage: 'long, thin objects (pens, bottles, trees)' },
  { id: 'mai', kanji: '枚', kana: 'まい', usage: 'flat, thin objects (paper, plates, shirts)' },
  { id: 'satsu', kanji: '冊', kana: 'さつ', usage: 'bound volumes (books, magazines)' },
  { id: 'dai', kanji: '台', kana: 'だい', usage: 'machines and vehicles' },
  { id: 'hai', kanji: '杯', kana: 'はい', usage: 'cupfuls / glassfuls of liquid' },
  { id: 'ken', kanji: '軒', kana: 'けん', usage: 'houses and buildings' },
  { id: 'soku', kanji: '足', kana: 'そく', usage: 'pairs of footwear' },
  {
    id: 'tsu',
    kanji: 'つ',
    kana: 'つ',
    usage: 'general objects, native numbers (1–10)',
    numericOnly: true,
  },
];

/** Counters that can answer "which counter does this object take". */
export const objectCounters = counters.filter((c) => !c.numericOnly);
