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

export const ROCKET = {
  cellsPerRound: 5,
} as const
