import type { ConjugatedForm, FormId, VerbEntry } from './types';

/** Forms handled directly by the type-specific conjugators (teiru is composed on top of te). */
type BaseFormId = Exclude<FormId, 'teiru'>;

const dropLast = (s: string) => s.slice(0, -1);

/** Suffixes attached directly to an ichidan stem (drop る). Covers every non-dictionary form. */
const ICHIDAN_SUFFIX: Record<Exclude<BaseFormId, 'dictionary'>, string> = {
  masu: 'ます',
  masen: 'ません',
  mashita: 'ました',
  masendeshita: 'ませんでした',
  nai: 'ない',
  nakatta: 'なかった',
  te: 'て',
  ta: 'た',
};

/** Godan masu-stem: final kana -> i-row kana. Used for the formal (masu/masen/mashita/masendeshita) forms. */
const GODAN_MASU_STEM: Record<string, string> = {
  う: 'い',
  く: 'き',
  ぐ: 'ぎ',
  す: 'し',
  つ: 'ち',
  ぬ: 'に',
  ぶ: 'び',
  む: 'み',
  る: 'り',
};

const MASU_GROUP_SUFFIX: Record<'masu' | 'masen' | 'mashita' | 'masendeshita', string> = {
  masu: 'ます',
  masen: 'ません',
  mashita: 'ました',
  masendeshita: 'ませんでした',
};

/** Godan nai-stem: final kana -> a-row kana. Note う -> わ, not あ. Used for nai/nakatta. */
const GODAN_NAI_STEM: Record<string, string> = {
  う: 'わ',
  く: 'か',
  ぐ: 'が',
  す: 'さ',
  つ: 'た',
  ぬ: 'な',
  ぶ: 'ば',
  む: 'ま',
  る: 'ら',
};

const NAI_GROUP_SUFFIX: Record<'nai' | 'nakatta', string> = {
  nai: 'ない',
  nakatta: 'なかった',
};

/** Godan te/ta onbin (sound-change) suffixes, keyed by the dictionary form's final kana. */
const GODAN_ONBIN: Record<string, { te: string; ta: string }> = {
  う: { te: 'って', ta: 'った' },
  つ: { te: 'って', ta: 'った' },
  る: { te: 'って', ta: 'った' },
  ぬ: { te: 'んで', ta: 'んだ' },
  む: { te: 'んで', ta: 'んだ' },
  ぶ: { te: 'んで', ta: 'んだ' },
  く: { te: 'いて', ta: 'いた' },
  ぐ: { te: 'いで', ta: 'いだ' },
  す: { te: 'して', ta: 'した' },
};

const SURU_SUFFIX: Record<BaseFormId, string> = {
  dictionary: 'する',
  masu: 'します',
  masen: 'しません',
  mashita: 'しました',
  masendeshita: 'しませんでした',
  nai: 'しない',
  nakatta: 'しなかった',
  te: 'して',
  ta: 'した',
};

const KURU_FORMS: Record<BaseFormId, ConjugatedForm> = {
  dictionary: { kanji: '来る', kana: 'くる' },
  masu: { kanji: '来ます', kana: 'きます' },
  masen: { kanji: '来ません', kana: 'きません' },
  mashita: { kanji: '来ました', kana: 'きました' },
  masendeshita: { kanji: '来ませんでした', kana: 'きませんでした' },
  nai: { kanji: '来ない', kana: 'こない' },
  nakatta: { kanji: '来なかった', kana: 'こなかった' },
  te: { kanji: '来て', kana: 'きて' },
  ta: { kanji: '来た', kana: 'きた' },
};

function isMasuGroup(form: BaseFormId): form is 'masu' | 'masen' | 'mashita' | 'masendeshita' {
  return form === 'masu' || form === 'masen' || form === 'mashita' || form === 'masendeshita';
}

function isNaiGroup(form: BaseFormId): form is 'nai' | 'nakatta' {
  return form === 'nai' || form === 'nakatta';
}

function conjugateIchidan(verb: VerbEntry, form: BaseFormId): ConjugatedForm {
  if (form === 'dictionary') return { kanji: verb.kanji, kana: verb.kana };
  const kanjiStem = dropLast(verb.kanji);
  const kanaStem = dropLast(verb.kana);
  const suffix = ICHIDAN_SUFFIX[form];
  return { kanji: kanjiStem + suffix, kana: kanaStem + suffix };
}

function conjugateGodan(verb: VerbEntry, form: BaseFormId): ConjugatedForm {
  if (form === 'dictionary') return { kanji: verb.kanji, kana: verb.kana };

  const finalKana = verb.kana.slice(-1);
  const kanjiStem = dropLast(verb.kanji);
  const kanaStem = dropLast(verb.kana);

  if (isMasuGroup(form)) {
    const stem = GODAN_MASU_STEM[finalKana];
    const suffix = MASU_GROUP_SUFFIX[form];
    return { kanji: kanjiStem + stem + suffix, kana: kanaStem + stem + suffix };
  }
  if (isNaiGroup(form)) {
    const stem = GODAN_NAI_STEM[finalKana];
    const suffix = NAI_GROUP_SUFFIX[form];
    return { kanji: kanjiStem + stem + suffix, kana: kanaStem + stem + suffix };
  }

  // te / ta: check per-verb onbin override first (e.g. 行く -> 行って, not いって)
  if (verb.irregularOnbin) return verb.irregularOnbin[form];

  const onbin = GODAN_ONBIN[finalKana][form];
  return { kanji: kanjiStem + onbin, kana: kanaStem + onbin };
}

function conjugateIrregular(verb: VerbEntry, form: BaseFormId): ConjugatedForm {
  if (verb.irregularSubtype === 'kuru') return KURU_FORMS[form];

  // suru, including compound suru-verbs like 勉強する
  const prefixKanji = verb.irregularPrefixKanji ?? '';
  const prefixKana = verb.irregularPrefixKana ?? '';
  const suffix = SURU_SUFFIX[form];
  return { kanji: prefixKanji + suffix, kana: prefixKana + suffix };
}

/** Conjugates a verb into the given target form. Pure function, no side effects. */
export function conjugate(verb: VerbEntry, form: FormId): ConjugatedForm {
  // Teiru (progressive/state, e.g. 食べている) is te-form + いる for every verb type,
  // so it's composed here once rather than duplicated across each type's tables.
  if (form === 'teiru') {
    const te = conjugate(verb, 'te');
    return { kanji: te.kanji + 'いる', kana: te.kana + 'いる' };
  }

  switch (verb.type) {
    case 'ichidan':
      return conjugateIchidan(verb, form);
    case 'godan':
      return conjugateGodan(verb, form);
    case 'irregular':
      return conjugateIrregular(verb, form);
  }
}
