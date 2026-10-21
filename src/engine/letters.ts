export type CaseStage = 'upper' | 'lower' | 'capital'
export type LetterCase = 'upper' | 'lower'

export const CASE_STAGES: CaseStage[] = ['upper', 'lower', 'capital']

/**
 * Order letters are introduced in: visually distinct, common shapes first,
 * easily confused pairs (b/d, p/q, m/w) kept apart.
 */
export const INTRO_ORDER = [
  'A', 'O', 'S', 'T', 'M', 'E', 'I', 'C', 'B', 'L', 'P', 'H', 'R',
  'N', 'U', 'G', 'F', 'K', 'D', 'W', 'Y', 'V', 'J', 'Z', 'X', 'Q',
] as const

export type Letter = (typeof INTRO_ORDER)[number]

/** Spoken letter names, spelled so speech engines don't read "A" as the article. */
export const LETTER_NAMES: Record<string, string> = {
  A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee',
  H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'ell', M: 'em', N: 'en',
  O: 'oh', P: 'pee', Q: 'cue', R: 'are', S: 'ess', T: 'tee', U: 'you',
  V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zee',
}

export const DIGIT_NAMES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

/** A skill is one letter in one case: recognising "a" differs from "A". */
export function skillId(letter: string, letterCase: LetterCase): string {
  return `${letterCase}:${letter.toUpperCase()}`
}

export function displayLetter(letter: string, letterCase: LetterCase): string {
  return letterCase === 'upper' ? letter.toUpperCase() : letter.toLowerCase()
}

/** Normalises a KeyboardEvent.key to an uppercase A–Z letter, or null. */
export function letterFromKey(key: string): string | null {
  return /^[a-z]$/i.test(key) ? key.toUpperCase() : null
}

export function nextCaseStage(stage: CaseStage): CaseStage | null {
  const i = CASE_STAGES.indexOf(stage)
  return CASE_STAGES[i + 1] ?? null
}
