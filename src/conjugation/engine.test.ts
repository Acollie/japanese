import { describe, expect, it } from 'vitest';
import { conjugate } from './engine';
import type { FormId, VerbEntry } from './types';

function verb(overrides: Partial<VerbEntry> & Pick<VerbEntry, 'id' | 'kanji' | 'kana' | 'type'>): VerbEntry {
  return { meaning: '', jlpt: 'N5', ...overrides };
}

interface Case {
  verb: VerbEntry;
  form: FormId;
  kanji: string;
  kana: string;
}

const cases: Case[] = [
  // Ichidan controls
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'masu', kanji: '食べます', kana: 'たべます' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'nai', kanji: '食べない', kana: 'たべない' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'te', kanji: '食べて', kana: 'たべて' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'ta', kanji: '食べた', kana: 'たべた' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'masen', kanji: '食べません', kana: 'たべません' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'mashita', kanji: '食べました', kana: 'たべました' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'masendeshita', kanji: '食べませんでした', kana: 'たべませんでした' },
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'nakatta', kanji: '食べなかった', kana: 'たべなかった' },
  { verb: verb({ id: 'miru', kanji: '見る', kana: 'みる', type: 'ichidan' }), form: 'masu', kanji: '見ます', kana: 'みます' },

  // Godan: one per row-ending
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'masu', kanji: '買います', kana: 'かいます' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'nai', kanji: '買わない', kana: 'かわない' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'te', kanji: '買って', kana: 'かって' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'ta', kanji: '買った', kana: 'かった' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'masen', kanji: '買いません', kana: 'かいません' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'mashita', kanji: '買いました', kana: 'かいました' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'masendeshita', kanji: '買いませんでした', kana: 'かいませんでした' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'nakatta', kanji: '買わなかった', kana: 'かわなかった' },

  { verb: verb({ id: 'kaku', kanji: '書く', kana: 'かく', type: 'godan' }), form: 'masu', kanji: '書きます', kana: 'かきます' },
  { verb: verb({ id: 'kaku', kanji: '書く', kana: 'かく', type: 'godan' }), form: 'nai', kanji: '書かない', kana: 'かかない' },
  { verb: verb({ id: 'kaku', kanji: '書く', kana: 'かく', type: 'godan' }), form: 'te', kanji: '書いて', kana: 'かいて' },
  { verb: verb({ id: 'kaku', kanji: '書く', kana: 'かく', type: 'godan' }), form: 'ta', kanji: '書いた', kana: 'かいた' },

  { verb: verb({ id: 'oyogu', kanji: '泳ぐ', kana: 'およぐ', type: 'godan' }), form: 'te', kanji: '泳いで', kana: 'およいで' },
  { verb: verb({ id: 'oyogu', kanji: '泳ぐ', kana: 'およぐ', type: 'godan' }), form: 'ta', kanji: '泳いだ', kana: 'およいだ' },

  { verb: verb({ id: 'hanasu', kanji: '話す', kana: 'はなす', type: 'godan' }), form: 'masu', kanji: '話します', kana: 'はなします' },
  { verb: verb({ id: 'hanasu', kanji: '話す', kana: 'はなす', type: 'godan' }), form: 'te', kanji: '話して', kana: 'はなして' },

  { verb: verb({ id: 'matsu', kanji: '待つ', kana: 'まつ', type: 'godan' }), form: 'masu', kanji: '待ちます', kana: 'まちます' },
  { verb: verb({ id: 'matsu', kanji: '待つ', kana: 'まつ', type: 'godan' }), form: 'te', kanji: '待って', kana: 'まって' },

  { verb: verb({ id: 'shinu', kanji: '死ぬ', kana: 'しぬ', type: 'godan' }), form: 'masu', kanji: '死にます', kana: 'しにます' },
  { verb: verb({ id: 'shinu', kanji: '死ぬ', kana: 'しぬ', type: 'godan' }), form: 'te', kanji: '死んで', kana: 'しんで' },

  { verb: verb({ id: 'asobu', kanji: '遊ぶ', kana: 'あそぶ', type: 'godan' }), form: 'masu', kanji: '遊びます', kana: 'あそびます' },
  { verb: verb({ id: 'asobu', kanji: '遊ぶ', kana: 'あそぶ', type: 'godan' }), form: 'te', kanji: '遊んで', kana: 'あそんで' },

  { verb: verb({ id: 'nomu', kanji: '飲む', kana: 'のむ', type: 'godan' }), form: 'masu', kanji: '飲みます', kana: 'のみます' },
  { verb: verb({ id: 'nomu', kanji: '飲む', kana: 'のむ', type: 'godan' }), form: 'nai', kanji: '飲まない', kana: 'のまない' },
  { verb: verb({ id: 'nomu', kanji: '飲む', kana: 'のむ', type: 'godan' }), form: 'te', kanji: '飲んで', kana: 'のんで' },
  { verb: verb({ id: 'nomu', kanji: '飲む', kana: 'のむ', type: 'godan' }), form: 'ta', kanji: '飲んだ', kana: 'のんだ' },

  // Godan traps: verbs ending in る that LOOK ichidan but conjugate as godan
  { verb: verb({ id: 'kaeru', kanji: '帰る', kana: 'かえる', type: 'godan' }), form: 'masu', kanji: '帰ります', kana: 'かえります' },
  { verb: verb({ id: 'kaeru', kanji: '帰る', kana: 'かえる', type: 'godan' }), form: 'te', kanji: '帰って', kana: 'かえって' },
  { verb: verb({ id: 'hairu', kanji: '入る', kana: 'はいる', type: 'godan' }), form: 'masu', kanji: '入ります', kana: 'はいります' },
  { verb: verb({ id: 'hairu', kanji: '入る', kana: 'はいる', type: 'godan' }), form: 'nai', kanji: '入らない', kana: 'はいらない' },
  { verb: verb({ id: 'shiru', kanji: '知る', kana: 'しる', type: 'godan' }), form: 'nai', kanji: '知らない', kana: 'しらない' },
  { verb: verb({ id: 'kiru2', kanji: '切る', kana: 'きる', type: 'godan' }), form: 'masu', kanji: '切ります', kana: 'きります' },
  { verb: verb({ id: 'kiru2', kanji: '切る', kana: 'きる', type: 'godan' }), form: 'te', kanji: '切って', kana: 'きって' },

  // Ichidan control that "sounds like" the godan trap above (着る kiru, "to wear")
  { verb: verb({ id: 'kiru1', kanji: '着る', kana: 'きる', type: 'ichidan' }), form: 'masu', kanji: '着ます', kana: 'きます' },
  { verb: verb({ id: 'kiru1', kanji: '着る', kana: 'きる', type: 'ichidan' }), form: 'te', kanji: '着て', kana: 'きて' },

  // 行く exception: onbin override, not the regular く -> いて/いた rule
  {
    verb: verb({
      id: 'iku',
      kanji: '行く',
      kana: 'いく',
      type: 'godan',
      irregularOnbin: { te: { kanji: '行って', kana: 'いって' }, ta: { kanji: '行った', kana: 'いった' } },
    }),
    form: 'te',
    kanji: '行って',
    kana: 'いって',
  },
  {
    verb: verb({
      id: 'iku',
      kanji: '行く',
      kana: 'いく',
      type: 'godan',
      irregularOnbin: { te: { kanji: '行って', kana: 'いって' }, ta: { kanji: '行った', kana: 'いった' } },
    }),
    form: 'ta',
    kanji: '行った',
    kana: 'いった',
  },

  // Irregular: する
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'masu', kanji: 'します', kana: 'します' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'nai', kanji: 'しない', kana: 'しない' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'te', kanji: 'して', kana: 'して' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'ta', kanji: 'した', kana: 'した' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'masen', kanji: 'しません', kana: 'しません' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'mashita', kanji: 'しました', kana: 'しました' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'masendeshita', kanji: 'しませんでした', kana: 'しませんでした' },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'nakatta', kanji: 'しなかった', kana: 'しなかった' },

  // Irregular: compound suru-verb
  {
    verb: verb({
      id: 'benkyousuru',
      kanji: '勉強する',
      kana: 'べんきょうする',
      type: 'irregular',
      irregularSubtype: 'suru',
      irregularPrefixKanji: '勉強',
      irregularPrefixKana: 'べんきょう',
    }),
    form: 'masu',
    kanji: '勉強します',
    kana: 'べんきょうします',
  },
  {
    verb: verb({
      id: 'benkyousuru',
      kanji: '勉強する',
      kana: 'べんきょうする',
      type: 'irregular',
      irregularSubtype: 'suru',
      irregularPrefixKanji: '勉強',
      irregularPrefixKana: 'べんきょう',
    }),
    form: 'ta',
    kanji: '勉強した',
    kana: 'べんきょうした',
  },

  // Irregular: 来る (kanji reading changes per form)
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'masu', kanji: '来ます', kana: 'きます' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'nai', kanji: '来ない', kana: 'こない' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'te', kanji: '来て', kana: 'きて' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'ta', kanji: '来た', kana: 'きた' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'masen', kanji: '来ません', kana: 'きません' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'mashita', kanji: '来ました', kana: 'きました' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'masendeshita', kanji: '来ませんでした', kana: 'きませんでした' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'nakatta', kanji: '来なかった', kana: 'こなかった' },

  // Teiru (progressive/state): composed as te-form + いる, across every verb type
  { verb: verb({ id: 'taberu', kanji: '食べる', kana: 'たべる', type: 'ichidan' }), form: 'teiru', kanji: '食べている', kana: 'たべている' },
  { verb: verb({ id: 'kau', kanji: '買う', kana: 'かう', type: 'godan' }), form: 'teiru', kanji: '買っている', kana: 'かっている' },
  { verb: verb({ id: 'nomu', kanji: '飲む', kana: 'のむ', type: 'godan' }), form: 'teiru', kanji: '飲んでいる', kana: 'のんでいる' },
  {
    verb: verb({
      id: 'iku',
      kanji: '行く',
      kana: 'いく',
      type: 'godan',
      irregularOnbin: { te: { kanji: '行って', kana: 'いって' }, ta: { kanji: '行った', kana: 'いった' } },
    }),
    form: 'teiru',
    kanji: '行っている',
    kana: 'いっている',
  },
  { verb: verb({ id: 'suru', kanji: 'する', kana: 'する', type: 'irregular', irregularSubtype: 'suru' }), form: 'teiru', kanji: 'している', kana: 'している' },
  { verb: verb({ id: 'kuru', kanji: '来る', kana: 'くる', type: 'irregular', irregularSubtype: 'kuru' }), form: 'teiru', kanji: '来ている', kana: 'きている' },
];

describe('conjugate', () => {
  for (const c of cases) {
    it(`${c.verb.id} (${c.verb.type}) -> ${c.form} = ${c.kana}`, () => {
      const result = conjugate(c.verb, c.form);
      expect(result.kanji).toBe(c.kanji);
      expect(result.kana).toBe(c.kana);
    });
  }
});
