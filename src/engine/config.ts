// Tunable learning thresholds. Provisional by design (PRD §9): change freely.
export const MASTERY = {
  /** Unassisted first-try successes before a key leaves "learning". */
  practicingAfter: 3,
  /** Unassisted first-try successes needed for "mastered". */
  masteredAfter: 5,
  /** ...spread over at least this many different days (retention). */
  masteredDays: 2,
  /** Recent first-try accuracy needed for "mastered". */
  masteredAccuracy: 0.8,
  /** How many recent trials the accuracy above looks at. */
  recentWindow: 8,
} as const

export const HINTS = {
  /** Consecutive unassisted successes before a key starts with no hint. */
  dropHintAfter: 3,
  /** Misses within one trial before the hint gets one level stronger. */
  missesPerLevel: 2,
  /** Idle time before the hint gets stronger (once per trial). */
  idleMs: 8000,
  max: 2,
} as const

export const POOL = {
  /** Letters active when a learner starts, by onboarding stage. */
  startSize: { explorer: 4, adventurer: 8 },
  /** Share of active letters that must be at least "practicing" to add one more. */
  growWhenReady: 0.75,
} as const

/** Mastered letters in the current case stage before moving to the next. */
export const CASE_STAGE_ADVANCE_AFTER = 10

export type Difficulty = 'gentle' | 'normal' | 'challenge'

/** Set per child by a parent. Changes pacing and help, never adds pressure (no timers or penalties). */
export const DIFFICULTY: Record<Difficulty, {
  label: string
  description: string
  /** Fuel cells per rocket round in the first galaxy; each later galaxy adds one. */
  baseCells: number
  missesPerLevel: number
  idleMs: number
  growWhenReady: number
}> = {
  gentle: {
    label: 'Gentle',
    description: 'Shorter rounds, and help arrives sooner',
    baseCells: 4,
    missesPerLevel: 1,
    idleMs: 5000,
    growWhenReady: 0.85,
  },
  normal: {
    label: 'Normal',
    description: 'The default pace',
    baseCells: 5,
    missesPerLevel: HINTS.missesPerLevel,
    idleMs: HINTS.idleMs,
    growWhenReady: POOL.growWhenReady,
  },
  challenge: {
    label: 'Challenge',
    description: 'Longer rounds, more time before hints, new letters sooner',
    baseCells: 6,
    missesPerLevel: 3,
    idleMs: 15000,
    growWhenReady: 0.6,
  },
}

export const MAX_CELLS = 8

export function cellsPerRound(difficulty: Difficulty, galaxyIndex: number): number {
  return Math.min(MAX_CELLS, DIFFICULTY[difficulty].baseCells + galaxyIndex)
}
