import { describe, expect, it } from 'vitest';
import { checkAnswer, toHiraganaAnswer } from './kanaUtils';

describe('toHiraganaAnswer', () => {
  it('converts plain romaji', () => {
    expect(toHiraganaAnswer('tabemasu')).toBe('たべます');
  });

  it('handles sokuon (double consonant) romaji', () => {
    expect(toHiraganaAnswer('matte')).toBe('まって');
    expect(toHiraganaAnswer('itta')).toBe('いった');
  });

  it('handles moraic n', () => {
    expect(toHiraganaAnswer('nonde')).toBe('のんで');
  });

  it('passes already-typed kana through unchanged', () => {
    expect(toHiraganaAnswer('たべます')).toBe('たべます');
  });

  it('trims whitespace', () => {
    expect(toHiraganaAnswer('  tabemasu  ')).toBe('たべます');
  });
});

describe('checkAnswer', () => {
  const correct = { kanji: '食べます', kana: 'たべます' };

  it('accepts correct romaji', () => {
    expect(checkAnswer('tabemasu', correct)).toBe(true);
  });

  it('accepts correct kana', () => {
    expect(checkAnswer('たべます', correct)).toBe(true);
  });

  it('accepts correct kanji', () => {
    expect(checkAnswer('食べます', correct)).toBe(true);
  });

  it('rejects incorrect answers', () => {
    expect(checkAnswer('tabemasen', correct)).toBe(false);
  });
});
