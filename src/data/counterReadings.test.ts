import { describe, expect, it } from 'vitest';
import { counters } from './counters';
import { counterReadings } from './counterReadings';

const byId = (id: string) => counterReadings.find((r) => r.counterId === id)!;

describe('counterReadings dataset', () => {
  it('has no duplicate counter ids', () => {
    const ids = counterReadings.map((r) => r.counterId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('references only counters that exist', () => {
    const known = new Set(counters.map((c) => c.id));
    for (const entry of counterReadings) {
      expect(known.has(entry.counterId)).toBe(true);
    }
  });

  it('gives every counter exactly 10 readings, each with a non-empty primary', () => {
    for (const entry of counterReadings) {
      expect(entry.readings).toHaveLength(10);
      for (const [n, variants] of entry.readings.entries()) {
        expect(variants.length, `${entry.counterId} ${n + 1}`).toBeGreaterThan(0);
        for (const v of variants) {
          expect(v.length, `${entry.counterId} ${n + 1}`).toBeGreaterThan(0);
          // Readings are kana-only: no kanji, no romaji, no digits.
          expect(v, `${entry.counterId} ${n + 1}`).toMatch(/^[ぁ-ん]+$/);
        }
      }
    }
  });

  it('lists no duplicate variants within a single reading', () => {
    for (const entry of counterReadings) {
      for (const [n, variants] of entry.readings.entries()) {
        expect(new Set(variants).size, `${entry.counterId} ${n + 1}`).toBe(variants.length);
      }
    }
  });

  // The whole reason this domain exists: these fuse rather than concatenate.
  it('gets the h-row gemination and voicing right', () => {
    expect(byId('hon').readings.map((r) => r[0])).toEqual([
      'いっぽん',
      'にほん',
      'さんぼん',
      'よんほん',
      'ごほん',
      'ろっぽん',
      'ななほん',
      'はっぽん',
      'きゅうほん',
      'じゅっぽん',
    ]);
    expect(byId('hiki').readings.map((r) => r[0])).toEqual([
      'いっぴき',
      'にひき',
      'さんびき',
      'よんひき',
      'ごひき',
      'ろっぴき',
      'ななひき',
      'はっぴき',
      'きゅうひき',
      'じゅっぴき',
    ]);
    expect(byId('hai').readings.map((r) => r[0])).toEqual([
      'いっぱい',
      'にはい',
      'さんばい',
      'よんはい',
      'ごはい',
      'ろっぱい',
      'ななはい',
      'はっぱい',
      'きゅうはい',
      'じゅっぱい',
    ]);
  });

  it('gets the native つ series and the irregular 人 right', () => {
    expect(byId('tsu').readings.map((r) => r[0])).toEqual([
      'ひとつ',
      'ふたつ',
      'みっつ',
      'よっつ',
      'いつつ',
      'むっつ',
      'ななつ',
      'やっつ',
      'ここのつ',
      'とお',
    ]);
    // 一人 and 二人 are the native readings; 四人 is よにん, not よんにん.
    expect(byId('nin').readings[0][0]).toBe('ひとり');
    expect(byId('nin').readings[1][0]).toBe('ふたり');
    expect(byId('nin').readings[3][0]).toBe('よにん');
  });

  it('voices the third reading for 軒 and 足 but not for 個 or 枚', () => {
    expect(byId('ken').readings[2][0]).toBe('さんげん');
    expect(byId('soku').readings[2][0]).toBe('さんぞく');
    expect(byId('ko').readings[2][0]).toBe('さんこ');
    expect(byId('mai').readings[2][0]).toBe('さんまい');
  });

  it('keeps 枚 and 台 fully regular, as the control cases', () => {
    expect(byId('mai').readings.map((r) => r[0])).toEqual([
      'いちまい',
      'にまい',
      'さんまい',
      'よんまい',
      'ごまい',
      'ろくまい',
      'ななまい',
      'はちまい',
      'きゅうまい',
      'じゅうまい',
    ]);
    expect(byId('dai').readings.map((r) => r[0])).toEqual([
      'いちだい',
      'にだい',
      'さんだい',
      'よんだい',
      'ごだい',
      'ろくだい',
      'ななだい',
      'はちだい',
      'きゅうだい',
      'じゅうだい',
    ]);
  });

  it('offers じっ- beside じゅっ- wherever ten geminates', () => {
    for (const id of ['ko', 'hiki', 'tou', 'hon', 'satsu', 'hai', 'ken', 'soku']) {
      const ten = byId(id).readings[9];
      expect(ten[0], `${id} 10 primary`).toMatch(/^じゅっ/);
      expect(ten, `${id} 10 alternates`).toContain(ten[0].replace(/^じゅっ/, 'じっ'));
    }
  });
});
