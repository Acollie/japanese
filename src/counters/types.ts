export interface CounterEntry {
  id: string;
  kanji: string;
  kana: string;
  /** Short gloss of what the counter is used for, shown on the home page selector grid. */
  usage: string;
}

export interface CounterObjectEntry {
  id: string;
  kanji: string;
  kana: string;
  meaning: string;
  emoji: string;
  counterId: string;
  /**
   * Other counter ids a native speaker would also accept, e.g. 頭 for a large dog
   * alongside the textbook 匹. Graded correct so the quiz doesn't punish a learner
   * for knowing more than the primary answer.
   */
  alsoAccepted?: string[];
  /**
   * Why this object takes the counter it does. Shown only after answering —
   * keeping it out of the prompt is the point, since these notes cover exactly
   * the traps (rabbits, books) whose whole value is that you have to recall them.
   */
  note?: string;
}
