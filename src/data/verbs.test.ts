import { describe, expect, it } from 'vitest';
import { conjugate } from '../conjugation/engine';
import { QUIZ_FORMS } from '../conjugation/types';
import { verbs } from './verbs';

describe('verb dataset', () => {
  it('has no duplicate ids', () => {
    const ids = verbs.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains a healthy mix of verb types', () => {
    const counts = { ichidan: 0, godan: 0, irregular: 0 };
    for (const v of verbs) counts[v.type]++;
    expect(counts.ichidan).toBeGreaterThanOrEqual(10);
    expect(counts.godan).toBeGreaterThanOrEqual(20);
    expect(counts.irregular).toBeGreaterThanOrEqual(5);
  });

  for (const v of verbs) {
    for (const form of QUIZ_FORMS) {
      it(`${v.id}: ${form} conjugates to a well-formed shape`, () => {
        const result = conjugate(v, form);
        expect(result.kanji.length).toBeGreaterThan(0);
        expect(result.kana.length).toBeGreaterThan(0);

        if (form === 'masu') expect(result.kana.endsWith('ます')).toBe(true);
        if (form === 'masen') expect(result.kana.endsWith('ません')).toBe(true);
        if (form === 'mashita') expect(result.kana.endsWith('ました')).toBe(true);
        if (form === 'masendeshita') expect(result.kana.endsWith('ませんでした')).toBe(true);
        if (form === 'nai') expect(result.kana.endsWith('ない')).toBe(true);
        if (form === 'nakatta') expect(result.kana.endsWith('なかった')).toBe(true);
        if (form === 'te') expect(/[てで]$/.test(result.kana)).toBe(true);
        if (form === 'ta') expect(/[ただ]$/.test(result.kana)).toBe(true);
        if (form === 'teiru') expect(result.kana.endsWith('いる')).toBe(true);
      });
    }
  }
});
