export type VerbType = 'ichidan' | 'godan' | 'irregular';
export type IrregularSubtype = 'suru' | 'kuru';
export type FormId =
  | 'dictionary'
  | 'masu'
  | 'masen'
  | 'mashita'
  | 'masendeshita'
  | 'nai'
  | 'nakatta'
  | 'te'
  | 'ta'
  | 'teiru';

/** Forms the quiz asks about. Dictionary form is always given as the prompt, never the target. */
export const QUIZ_FORMS: Exclude<FormId, 'dictionary'>[] = [
  'masu',
  'masen',
  'mashita',
  'masendeshita',
  'nai',
  'nakatta',
  'te',
  'ta',
  'teiru',
];

export const FORM_LABELS: Record<FormId, string> = {
  dictionary: 'Dictionary form',
  masu: 'Masu-form (formal present)',
  masen: 'Masen-form (formal negative)',
  mashita: 'Mashita-form (formal past)',
  masendeshita: 'Masendeshita-form (formal negative past)',
  nai: 'Nai-form (informal negative)',
  nakatta: 'Nakatta-form (informal negative past)',
  te: 'Te-form',
  ta: 'Ta-form (informal past)',
  teiru: 'Teiru-form (progressive/state)',
};

/** Short labels for compact UI, e.g. the home page form-selector grid. */
export const FORM_SHORT_LABELS: Record<FormId, string> = {
  dictionary: 'Dictionary',
  masu: 'Masu',
  masen: 'Masen',
  mashita: 'Mashita',
  masendeshita: 'Masendeshita',
  nai: 'Nai',
  nakatta: 'Nakatta',
  te: 'Te-form',
  ta: 'Ta-form',
  teiru: 'Te-iru',
};

/**
 * Illustrative kana ending pattern + English gloss for each form, used on the
 * home page form-selector grid so learners can recognize the ending, not just the name.
 */
export const FORM_GRID_INFO: Record<Exclude<FormId, 'dictionary'>, { ending: string; gloss: string }> = {
  masu: { ending: '〜ます', gloss: 'present, formal' },
  masen: { ending: '〜ません', gloss: 'negative, formal' },
  mashita: { ending: '〜ました', gloss: 'past, formal' },
  masendeshita: { ending: '〜ませんでした', gloss: 'past negative, formal' },
  nai: { ending: '〜ない', gloss: 'negative, informal' },
  nakatta: { ending: '〜なかった', gloss: 'past negative, informal' },
  te: { ending: '〜て', gloss: 'te-form' },
  ta: { ending: '〜た', gloss: 'past, informal' },
  teiru: { ending: '〜ている', gloss: 'progressive / state' },
};

export interface ConjugatedForm {
  kanji: string;
  kana: string;
}

export interface VerbEntry {
  id: string;
  kanji: string;
  kana: string;
  meaning: string;
  jlpt: 'N5' | 'N4';
  type: VerbType;
  irregularSubtype?: IrregularSubtype;
  /** Prefix for compound suru-verbs, e.g. "勉強" / "べんきょう". Empty string for bare する. */
  irregularPrefixKanji?: string;
  irregularPrefixKana?: string;
  /**
   * Override for godan verbs whose te/ta onbin doesn't follow the general row rule,
   * e.g. 行く -> 行って/行った instead of the regular く -> いて/いた pattern.
   */
  irregularOnbin?: { te: ConjugatedForm; ta: ConjugatedForm };
}
