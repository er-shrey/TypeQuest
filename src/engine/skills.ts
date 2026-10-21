import { HINTS, MASTERY } from './config'
import { skillId, type LetterCase } from './letters'

export type MasteryState = 'new' | 'learning' | 'practicing' | 'mastered'

/** What the app has observed about one letter in one case. */
export interface KeySkill {
  id: string
  letter: string
  letterCase: LetterCase
  introducedAt: number | null
  /** Every key press made while this letter was the target. */
  attempts: number
  /** Trials finished (the right key was eventually pressed). */
  successes: number
  /** Wrong key presses while this letter was the target. */
  misses: number
  /** Trials finished on the first press, with or without a hint. */
  firstTrySuccesses: number
  /** Trials finished on the first press with no hint at all. */
  unassistedSuccesses: number
  /** Distinct days (YYYY-MM-DD) with an unassisted success. Shows retention. */
  unassistedDays: string[]
  /** First-try outcome of the most recent trials, newest last. */
  recent: boolean[]
  lastPracticedAt: number | null
  /** Wrong key → how often it was pressed instead. Useful for parents and future drills. */
  confusions: Record<string, number>
}

export interface TrialResult {
  letter: string
  letterCase: LetterCase
  misses: number
  wrongKeys: string[]
  /** Highest hint level shown during the trial. */
  maxHint: number
  at: number
}

export function emptySkill(letter: string, letterCase: LetterCase): KeySkill {
  return {
    id: skillId(letter, letterCase),
    letter: letter.toUpperCase(),
    letterCase,
    introducedAt: null,
    attempts: 0,
    successes: 0,
    misses: 0,
    firstTrySuccesses: 0,
    unassistedSuccesses: 0,
    unassistedDays: [],
    recent: [],
    lastPracticedAt: null,
    confusions: {},
  }
}

export function dayKey(at: number): string {
  const d = new Date(at)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Returns an updated copy of the skill after one finished trial. */
export function recordTrial(skill: KeySkill, trial: TrialResult): KeySkill {
  const firstTry = trial.misses === 0
  const unassisted = firstTry && trial.maxHint === 0
  const day = dayKey(trial.at)
  const confusions = { ...skill.confusions }
  for (const key of trial.wrongKeys) confusions[key] = (confusions[key] ?? 0) + 1

  return {
    ...skill,
    introducedAt: skill.introducedAt ?? trial.at,
    attempts: skill.attempts + trial.misses + 1,
    successes: skill.successes + 1,
    misses: skill.misses + trial.misses,
    firstTrySuccesses: skill.firstTrySuccesses + (firstTry ? 1 : 0),
    unassistedSuccesses: skill.unassistedSuccesses + (unassisted ? 1 : 0),
    unassistedDays:
      unassisted && !skill.unassistedDays.includes(day)
        ? [...skill.unassistedDays, day].slice(-30)
        : skill.unassistedDays,
    recent: [...skill.recent, firstTry].slice(-MASTERY.recentWindow),
    lastPracticedAt: trial.at,
    confusions,
  }
}

export function recentAccuracy(skill: KeySkill): number {
  if (skill.recent.length === 0) return 0
  return skill.recent.filter(Boolean).length / skill.recent.length
}

/**
 * Mastery comes from demonstrated, unassisted, retained success — never from
 * time spent or attempt count alone (PRD FR-010).
 */
export function masteryState(skill: KeySkill): MasteryState {
  if (skill.introducedAt === null) return 'new'
  if (
    skill.unassistedSuccesses >= MASTERY.masteredAfter &&
    skill.unassistedDays.length >= MASTERY.masteredDays &&
    recentAccuracy(skill) >= MASTERY.masteredAccuracy
  ) {
    return 'mastered'
  }
  if (skill.unassistedSuccesses >= MASTERY.practicingAfter) return 'practicing'
  return 'learning'
}

/**
 * Hint level a new trial starts at. Keys the learner hasn't shown they can
 * find start with the key glowing; the glow returns only after two misses in
 * a row, so a single slip changes nothing.
 */
export function startingHint(skill: KeySkill | undefined): number {
  if (!skill || skill.firstTrySuccesses < HINTS.dropHintAfter) return 1
  const lastTwo = skill.recent.slice(-2)
  if (lastTwo.length === 2 && lastTwo.every((ok) => !ok)) return 1
  return 0
}

/** Hint level after `misses` wrong presses in the current trial. */
export function hintAfterMisses(start: number, misses: number): number {
  return Math.min(HINTS.max, start + Math.floor(misses / HINTS.missesPerLevel))
}
