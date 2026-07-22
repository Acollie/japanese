import type { VerbEntry } from '../conjugation/types';

/**
 * Curated N5/N4 verb list. Deliberately includes the classic godan verbs that
 * end in る and look ichidan (帰る, 入る, 知る, 切る, 走る, 要る) alongside a real
 * ichidan る-verb (着る) as a control, since misclassifying these is the most
 * common conjugation mistake.
 */
export const verbs: VerbEntry[] = [
  // --- Ichidan ---
  { id: 'taberu', kanji: '食べる', kana: 'たべる', meaning: 'to eat', jlpt: 'N5', type: 'ichidan' },
  { id: 'miru', kanji: '見る', kana: 'みる', meaning: 'to see, to watch', jlpt: 'N5', type: 'ichidan' },
  { id: 'okiru', kanji: '起きる', kana: 'おきる', meaning: 'to get up, to wake up', jlpt: 'N5', type: 'ichidan' },
  { id: 'neru', kanji: '寝る', kana: 'ねる', meaning: 'to sleep', jlpt: 'N5', type: 'ichidan' },
  { id: 'deru', kanji: '出る', kana: 'でる', meaning: 'to leave, to exit', jlpt: 'N5', type: 'ichidan' },
  { id: 'oshieru', kanji: '教える', kana: 'おしえる', meaning: 'to teach', jlpt: 'N5', type: 'ichidan' },
  { id: 'oboeru', kanji: '覚える', kana: 'おぼえる', meaning: 'to memorize', jlpt: 'N5', type: 'ichidan' },
  { id: 'wasureru', kanji: '忘れる', kana: 'わすれる', meaning: 'to forget', jlpt: 'N5', type: 'ichidan' },
  { id: 'kariru', kanji: '借りる', kana: 'かりる', meaning: 'to borrow', jlpt: 'N5', type: 'ichidan' },
  { id: 'oriru', kanji: '降りる', kana: 'おりる', meaning: 'to get off, to descend', jlpt: 'N5', type: 'ichidan' },
  { id: 'akeru', kanji: '開ける', kana: 'あける', meaning: 'to open', jlpt: 'N5', type: 'ichidan' },
  { id: 'shimeru', kanji: '閉める', kana: 'しめる', meaning: 'to close', jlpt: 'N5', type: 'ichidan' },
  { id: 'tsukareru', kanji: '疲れる', kana: 'つかれる', meaning: 'to get tired', jlpt: 'N4', type: 'ichidan' },
  { id: 'kiru1', kanji: '着る', kana: 'きる', meaning: 'to wear', jlpt: 'N5', type: 'ichidan' },
  { id: 'kangaeru', kanji: '考える', kana: 'かんがえる', meaning: 'to think, to consider', jlpt: 'N4', type: 'ichidan' },

  // --- Godan: う ---
  { id: 'kau', kanji: '買う', kana: 'かう', meaning: 'to buy', jlpt: 'N5', type: 'godan' },
  { id: 'au', kanji: '会う', kana: 'あう', meaning: 'to meet', jlpt: 'N5', type: 'godan' },
  { id: 'tsukau', kanji: '使う', kana: 'つかう', meaning: 'to use', jlpt: 'N5', type: 'godan' },
  { id: 'utau', kanji: '歌う', kana: 'うたう', meaning: 'to sing', jlpt: 'N5', type: 'godan' },

  // --- Godan: く (plus the 行く onbin exception) ---
  { id: 'kaku', kanji: '書く', kana: 'かく', meaning: 'to write', jlpt: 'N5', type: 'godan' },
  { id: 'kiku', kanji: '聞く', kana: 'きく', meaning: 'to listen, to ask', jlpt: 'N5', type: 'godan' },
  { id: 'aruku', kanji: '歩く', kana: 'あるく', meaning: 'to walk', jlpt: 'N5', type: 'godan' },
  { id: 'hataraku', kanji: '働く', kana: 'はたらく', meaning: 'to work', jlpt: 'N5', type: 'godan' },
  {
    id: 'iku',
    kanji: '行く',
    kana: 'いく',
    meaning: 'to go',
    jlpt: 'N5',
    type: 'godan',
    irregularOnbin: {
      te: { kanji: '行って', kana: 'いって' },
      ta: { kanji: '行った', kana: 'いった' },
    },
  },

  // --- Godan: ぐ ---
  { id: 'oyogu', kanji: '泳ぐ', kana: 'およぐ', meaning: 'to swim', jlpt: 'N5', type: 'godan' },
  { id: 'isogu', kanji: '急ぐ', kana: 'いそぐ', meaning: 'to hurry', jlpt: 'N4', type: 'godan' },

  // --- Godan: す ---
  { id: 'hanasu', kanji: '話す', kana: 'はなす', meaning: 'to speak', jlpt: 'N5', type: 'godan' },
  { id: 'kasu', kanji: '貸す', kana: 'かす', meaning: 'to lend', jlpt: 'N5', type: 'godan' },
  { id: 'dasu', kanji: '出す', kana: 'だす', meaning: 'to take out, to submit', jlpt: 'N5', type: 'godan' },
  { id: 'kesu', kanji: '消す', kana: 'けす', meaning: 'to turn off, to erase', jlpt: 'N5', type: 'godan' },

  // --- Godan: つ ---
  { id: 'matsu', kanji: '待つ', kana: 'まつ', meaning: 'to wait', jlpt: 'N5', type: 'godan' },
  { id: 'motsu', kanji: '持つ', kana: 'もつ', meaning: 'to hold, to have', jlpt: 'N5', type: 'godan' },
  { id: 'tatsu', kanji: '立つ', kana: 'たつ', meaning: 'to stand', jlpt: 'N5', type: 'godan' },

  // --- Godan: ぬ ---
  { id: 'shinu', kanji: '死ぬ', kana: 'しぬ', meaning: 'to die', jlpt: 'N5', type: 'godan' },

  // --- Godan: ぶ ---
  { id: 'asobu', kanji: '遊ぶ', kana: 'あそぶ', meaning: 'to play', jlpt: 'N5', type: 'godan' },
  { id: 'yobu', kanji: '呼ぶ', kana: 'よぶ', meaning: 'to call', jlpt: 'N5', type: 'godan' },
  { id: 'tobu', kanji: '飛ぶ', kana: 'とぶ', meaning: 'to fly', jlpt: 'N5', type: 'godan' },

  // --- Godan: む ---
  { id: 'nomu', kanji: '飲む', kana: 'のむ', meaning: 'to drink', jlpt: 'N5', type: 'godan' },
  { id: 'yomu', kanji: '読む', kana: 'よむ', meaning: 'to read', jlpt: 'N5', type: 'godan' },
  { id: 'yasumu', kanji: '休む', kana: 'やすむ', meaning: 'to rest, to take a day off', jlpt: 'N5', type: 'godan' },
  { id: 'sumu', kanji: '住む', kana: 'すむ', meaning: 'to live, to reside', jlpt: 'N5', type: 'godan' },

  // --- Godan: る (the "fake ichidan" traps) ---
  { id: 'kiru2', kanji: '切る', kana: 'きる', meaning: 'to cut', jlpt: 'N5', type: 'godan' },
  { id: 'hairu', kanji: '入る', kana: 'はいる', meaning: 'to enter', jlpt: 'N5', type: 'godan' },
  { id: 'hashiru', kanji: '走る', kana: 'はしる', meaning: 'to run', jlpt: 'N5', type: 'godan' },
  { id: 'kaeru', kanji: '帰る', kana: 'かえる', meaning: 'to go home, to return', jlpt: 'N5', type: 'godan' },
  { id: 'shiru', kanji: '知る', kana: 'しる', meaning: 'to know', jlpt: 'N5', type: 'godan' },
  { id: 'iru2', kanji: '要る', kana: 'いる', meaning: 'to need', jlpt: 'N4', type: 'godan' },

  // --- Irregular ---
  { id: 'suru', kanji: 'する', kana: 'する', meaning: 'to do', jlpt: 'N5', type: 'irregular', irregularSubtype: 'suru' },
  { id: 'kuru', kanji: '来る', kana: 'くる', meaning: 'to come', jlpt: 'N5', type: 'irregular', irregularSubtype: 'kuru' },
  {
    id: 'benkyousuru',
    kanji: '勉強する',
    kana: 'べんきょうする',
    meaning: 'to study',
    jlpt: 'N5',
    type: 'irregular',
    irregularSubtype: 'suru',
    irregularPrefixKanji: '勉強',
    irregularPrefixKana: 'べんきょう',
  },
  {
    id: 'denwasuru',
    kanji: '電話する',
    kana: 'でんわする',
    meaning: 'to make a phone call',
    jlpt: 'N5',
    type: 'irregular',
    irregularSubtype: 'suru',
    irregularPrefixKanji: '電話',
    irregularPrefixKana: 'でんわ',
  },
  {
    id: 'renshuusuru',
    kanji: '練習する',
    kana: 'れんしゅうする',
    meaning: 'to practice',
    jlpt: 'N4',
    type: 'irregular',
    irregularSubtype: 'suru',
    irregularPrefixKanji: '練習',
    irregularPrefixKana: 'れんしゅう',
  },
  {
    id: 'soujisuru',
    kanji: '掃除する',
    kana: 'そうじする',
    meaning: 'to clean',
    jlpt: 'N4',
    type: 'irregular',
    irregularSubtype: 'suru',
    irregularPrefixKanji: '掃除',
    irregularPrefixKana: 'そうじ',
  },
  {
    id: 'kaimonosuru',
    kanji: '買い物する',
    kana: 'かいものする',
    meaning: 'to shop',
    jlpt: 'N5',
    type: 'irregular',
    irregularSubtype: 'suru',
    irregularPrefixKanji: '買い物',
    irregularPrefixKana: 'かいもの',
  },
];
