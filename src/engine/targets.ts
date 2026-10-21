import { CASE_STAGE_ADVANCE_AFTER, POOL } from './config'
import { INTRO_ORDER, nextCaseStage, skillId, type CaseStage, type LetterCase } from './letters'
import { emptySkill, masteryState, type KeySkill } from './skills'

/** The learning state games share. Games read targets from it and report trials back. */
export interface LearnerProgress {
  caseStage: CaseStage
  /** How many letters of INTRO_ORDER are active, per case. */
  poolSize: Record<LetterCase, number>
  skills: Record<string, KeySkill>
}

export interface Target {
  letter: string
  letterCase: LetterCase
}

const DAY_MS = 24 * 60 * 60 * 1000

export function newProgress(startStage: keyof typeof POOL.startSize): LearnerProgress {
  const size = POOL.startSize[startStage]
  return { caseStage: 'upper', poolSize: { upper: size, lower: size }, skills: {} }
}

export function casesForStage(stage: CaseStage): LetterCase[] {
  return stage === 'upper' ? ['upper'] : stage === 'lower' ? ['lower'] : ['upper', 'lower']
}

export function activeLetters(progress: LearnerProgress, letterCase: LetterCase): string[] {
  return INTRO_ORDER.slice(0, progress.poolSize[letterCase])
}

export function getSkill(progress: LearnerProgress, letter: string, letterCase: LetterCase): KeySkill {
  return progress.skills[skillId(letter, letterCase)] ?? emptySkill(letter, letterCase)
}

function weight(skill: KeySkill, now: number): number {
  const state = masteryState(skill)
  const base = state === 'mastered' ? 1 : state === 'practicing' ? 2 : 3
  // Revisit known letters after a gap to check they were retained.
  const stale = state !== 'new' && state !== 'learning' && skill.lastPracticedAt !== null && now - skill.lastPracticedAt > DAY_MS
  return base + (stale ? 2 : 0)
}

/** Weighted pick that favours letters still being learned, mixed with familiar ones. */
export function pickTarget(
  progress: LearnerProgress,
  previous: Target | null,
  now: number = Date.now(),
  random: () => number = Math.random,
): Target {
  const candidates: { target: Target; weight: number }[] = []
  for (const letterCase of casesForStage(progress.caseStage)) {
    for (const letter of activeLetters(progress, letterCase)) {
      if (previous && previous.letter === letter && previous.letterCase === letterCase) continue
      candidates.push({ target: { letter, letterCase }, weight: weight(getSkill(progress, letter, letterCase), now) })
    }
  }
  const total = candidates.reduce((sum, c) => sum + c.weight, 0)
  let roll = random() * total
  for (const c of candidates) {
    roll -= c.weight
    if (roll < 0) return c.target
  }
  return candidates[candidates.length - 1].target
}

export interface ProgressUpdate {
  progress: LearnerProgress
  newLetters: Target[]
  newCaseStage: CaseStage | null
}

/**
 * Grows the letter pool when most active letters are known, and moves to the
 * next case stage when enough letters are mastered. Call after each round.
 */
export function advance(progress: LearnerProgress): ProgressUpdate {
  const poolSize = { ...progress.poolSize }
  const newLetters: Target[] = []

  for (const letterCase of casesForStage(progress.caseStage)) {
    const letters = activeLetters(progress, letterCase)
    const known = letters.filter((l) => {
      const state = masteryState(getSkill(progress, l, letterCase))
      return state === 'practicing' || state === 'mastered'
    }).length
    if (known / letters.length >= POOL.growWhenReady && poolSize[letterCase] < INTRO_ORDER.length) {
      newLetters.push({ letter: INTRO_ORDER[poolSize[letterCase]], letterCase })
      poolSize[letterCase] += 1
    }
  }

  let newCaseStage: CaseStage | null = null
  if (progress.caseStage !== 'capital') {
    const letterCase = progress.caseStage
    const mastered = INTRO_ORDER.filter((l) => masteryState(getSkill(progress, l, letterCase)) === 'mastered').length
    if (mastered >= CASE_STAGE_ADVANCE_AFTER) newCaseStage = nextCaseStage(progress.caseStage)
  }

  return {
    progress: { ...progress, poolSize, caseStage: newCaseStage ?? progress.caseStage },
    newLetters,
    newCaseStage,
  }
}
