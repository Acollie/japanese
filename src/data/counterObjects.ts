import type { CounterObjectEntry } from '../counters/types';

/**
 * Objects mapped to their counter. Includes a few deliberate traps alongside
 * the straightforward cases: うさぎ (rabbit) takes 羽 not 匹, and 本 (book) is
 * counted with 冊 even though 本 is itself the counter for long thin things.
 */
export const counterObjects: CounterObjectEntry[] = [
  // --- 個 (ko): small, general objects ---
  { id: 'ringo', kanji: 'りんご', kana: 'りんご', meaning: 'apple', emoji: '🍎', counterId: 'ko' },
  { id: 'hako', kanji: '箱', kana: 'はこ', meaning: 'box', emoji: '📦', counterId: 'ko' },
  { id: 'tamago', kanji: '卵', kana: 'たまご', meaning: 'egg', emoji: '🥚', counterId: 'ko' },
  { id: 'keshigomu', kanji: '消しゴム', kana: 'けしゴム', meaning: 'eraser', emoji: '🧽', counterId: 'ko' },

  // --- 人 (nin): people ---
  { id: 'hito', kanji: '人', kana: 'ひと', meaning: 'person', emoji: '🧍', counterId: 'nin' },
  { id: 'sensei', kanji: '先生', kana: 'せんせい', meaning: 'teacher', emoji: '🧑‍🏫', counterId: 'nin' },
  { id: 'kodomo', kanji: '子供', kana: 'こども', meaning: 'child', emoji: '🧒', counterId: 'nin' },

  // --- 匹 (hiki): small animals ---
  { id: 'neko', kanji: '猫', kana: 'ねこ', meaning: 'cat', emoji: '🐱', counterId: 'hiki' },
  {
    id: 'inu',
    kanji: '犬',
    kana: 'いぬ',
    meaning: 'dog',
    emoji: '🐶',
    counterId: 'hiki',
    alsoAccepted: ['tou'],
    note: '匹 is the everyday choice, but a large dog can take 頭 — the split is roughly "carryable" versus not.',
  },
  { id: 'sakana', kanji: '魚', kana: 'さかな', meaning: 'fish', emoji: '🐟', counterId: 'hiki' },
  { id: 'mushi', kanji: '虫', kana: 'むし', meaning: 'insect', emoji: '🐛', counterId: 'hiki' },
  { id: 'nezumi', kanji: 'ねずみ', kana: 'ねずみ', meaning: 'mouse', emoji: '🐭', counterId: 'hiki' },

  // --- 頭 (tou): large animals ---
  { id: 'zou', kanji: '象', kana: 'ぞう', meaning: 'elephant', emoji: '🐘', counterId: 'tou' },
  { id: 'ushi', kanji: '牛', kana: 'うし', meaning: 'cow', emoji: '🐄', counterId: 'tou' },
  { id: 'uma', kanji: '馬', kana: 'うま', meaning: 'horse', emoji: '🐴', counterId: 'tou' },
  { id: 'raion', kanji: 'ライオン', kana: 'ライオン', meaning: 'lion', emoji: '🦁', counterId: 'tou' },

  // --- 羽 (wa): birds — and rabbits ---
  { id: 'tori', kanji: '鳥', kana: 'とり', meaning: 'bird', emoji: '🐦', counterId: 'wa' },
  {
    id: 'usagi',
    kanji: 'うさぎ',
    kana: 'うさぎ',
    meaning: 'rabbit',
    emoji: '🐰',
    counterId: 'wa',
    note: 'Famously counted with 羽 like birds, not 匹 — one story is that Buddhist monks classed rabbits as birds so they could eat them.',
  },
  { id: 'niwatori', kanji: 'にわとり', kana: 'にわとり', meaning: 'chicken', emoji: '🐔', counterId: 'wa' },

  // --- 本 (hon): long, thin objects ---
  { id: 'enpitsu', kanji: '鉛筆', kana: 'えんぴつ', meaning: 'pencil', emoji: '✏️', counterId: 'hon' },
  { id: 'pen', kanji: 'ペン', kana: 'ペン', meaning: 'pen', emoji: '🖊️', counterId: 'hon' },
  { id: 'bin', kanji: '瓶', kana: 'びん', meaning: 'bottle', emoji: '🍾', counterId: 'hon' },
  { id: 'kasa', kanji: '傘', kana: 'かさ', meaning: 'umbrella', emoji: '☂️', counterId: 'hon' },
  { id: 'ki', kanji: '木', kana: 'き', meaning: 'tree', emoji: '🌳', counterId: 'hon' },
  {
    id: 'banana',
    kanji: 'バナナ',
    kana: 'バナナ',
    meaning: 'banana',
    emoji: '🍌',
    counterId: 'hon',
    note: 'Long and thin wins over food — a single banana is 一本.',
  },

  // --- 枚 (mai): flat, thin objects ---
  { id: 'kami', kanji: '紙', kana: 'かみ', meaning: 'paper', emoji: '📄', counterId: 'mai' },
  { id: 'sara', kanji: '皿', kana: 'さら', meaning: 'plate', emoji: '🍽️', counterId: 'mai' },
  { id: 'shatsu', kanji: 'シャツ', kana: 'シャツ', meaning: 'shirt', emoji: '👕', counterId: 'mai' },
  { id: 'kippu', kanji: '切符', kana: 'きっぷ', meaning: 'ticket', emoji: '🎫', counterId: 'mai' },

  // --- 冊 (satsu): bound volumes ---
  {
    id: 'hon_book',
    kanji: '本',
    kana: 'ほん',
    meaning: 'book',
    emoji: '📕',
    counterId: 'satsu',
    note: 'Books take 冊, not 本 — 本 is the counter for long thin objects, despite also being the word for "book".',
  },
  { id: 'zasshi', kanji: '雑誌', kana: 'ざっし', meaning: 'magazine', emoji: '📖', counterId: 'satsu' },
  { id: 'nooto', kanji: 'ノート', kana: 'ノート', meaning: 'notebook', emoji: '📓', counterId: 'satsu' },

  // --- 台 (dai): machines and vehicles ---
  { id: 'kuruma', kanji: '車', kana: 'くるま', meaning: 'car', emoji: '🚗', counterId: 'dai' },
  { id: 'terebi', kanji: 'テレビ', kana: 'テレビ', meaning: 'television', emoji: '📺', counterId: 'dai' },
  { id: 'pasokon', kanji: 'パソコン', kana: 'パソコン', meaning: 'computer', emoji: '💻', counterId: 'dai' },
  { id: 'jitensha', kanji: '自転車', kana: 'じてんしゃ', meaning: 'bicycle', emoji: '🚲', counterId: 'dai' },

  // --- 杯 (hai): cupfuls / glassfuls ---
  { id: 'koohii', kanji: 'コーヒー', kana: 'コーヒー', meaning: 'a cup of coffee', emoji: '☕', counterId: 'hai' },
  { id: 'ocha', kanji: 'お茶', kana: 'おちゃ', meaning: 'a cup of tea', emoji: '🍵', counterId: 'hai' },
  { id: 'mizu', kanji: '水', kana: 'みず', meaning: 'a glass of water', emoji: '🥛', counterId: 'hai' },

  // --- 軒 (ken): houses and buildings ---
  { id: 'ie', kanji: '家', kana: 'いえ', meaning: 'house', emoji: '🏠', counterId: 'ken' },
  { id: 'mise', kanji: '店', kana: 'みせ', meaning: 'shop', emoji: '🏪', counterId: 'ken' },

  // --- 足 (soku): pairs of footwear ---
  { id: 'kutsu', kanji: '靴', kana: 'くつ', meaning: 'shoes (pair)', emoji: '👟', counterId: 'soku' },
  { id: 'kutsushita', kanji: '靴下', kana: 'くつした', meaning: 'socks (pair)', emoji: '🧦', counterId: 'soku' },
];
