import { describe, expect, it } from 'vitest'
import { displayLetter, letterFromKey, skillId } from './letters'
import { emptySkill, hintAfterMisses, masteryState, recordTrial, startingHint, type KeySkill } from './skills'
import { activeLetters, advance, newProgress, pickTarget, type LearnerProgress } from './targets'
import { awardRound, currentStage, GALAXIES, PLANETS } from './rewards'
import { cellsPerRound, DIFFICULTY } from './config'

const DAY = 24 * 60 * 60 * 1000
const T0 = new Date(2026, 9, 1, 10).getTime()

function trial(skill: KeySkill, misses: number, maxHint: number, at = T0, wrongKeys: string[] = []) {
  return recordTrial(skill, { letter: skill.letter, letterCase: skill.letterCase, misses, maxHint, wrongKeys, at })
}

function repeat(skill: KeySkill, n: number, misses: number, maxHint: number, at = T0) {
  for (let i = 0; i < n; i++) skill = trial(skill, misses, maxHint, at + i)
  return skill
}

describe('letters', () => {
  it('matches keys case-insensitively so Caps Lock never makes a press wrong', () => {
    expect(letterFromKey('a')).toBe('A')
    expect(letterFromKey('A')).toBe('A')
    expect(letterFromKey('1')).toBeNull()
    expect(letterFromKey('Enter')).toBeNull()
  })

  it('tracks upper and lower case as separate skills', () => {
    expect(skillId('a', 'upper')).not.toBe(skillId('a', 'lower'))
    expect(displayLetter('A', 'lower')).toBe('a')
  })
})

describe('skills', () => {
  it('distinguishes a never-introduced key from one being learned', () => {
    const s = emptySkill('A', 'upper')
    expect(masteryState(s)).toBe('new')
    expect(masteryState(trial(s, 3, 2))).toBe('learning')
  })

  it('records attempts, misses and confusions', () => {
    const s = trial(emptySkill('B', 'upper'), 2, 1, T0, ['D', 'P'])
    expect(s.attempts).toBe(3)
    expect(s.successes).toBe(1)
    expect(s.misses).toBe(2)
    expect(s.confusions).toEqual({ D: 1, P: 1 })
  })

  it('does not grant mastery from volume alone: hinted successes never count', () => {
    const s = repeat(emptySkill('A', 'upper'), 50, 0, 1)
    expect(masteryState(s)).toBe('learning')
  })

  it('needs unassisted success on two different days for mastery', () => {
    let s = repeat(emptySkill('A', 'upper'), 6, 0, 0, T0)
    expect(masteryState(s)).toBe('practicing')
    s = trial(s, 0, 0, T0 + DAY)
    expect(masteryState(s)).toBe('mastered')
  })

  it('a single mistake does not lower a mastered key', () => {
    let s = repeat(emptySkill('A', 'upper'), 6, 0, 0, T0)
    s = repeat(s, 2, 0, 0, T0 + DAY)
    s = trial(s, 1, 0, T0 + DAY + 10)
    expect(masteryState(s)).toBe('mastered')
  })

  it('starts new keys with a glow and drops it after three first-try successes', () => {
    let s = emptySkill('A', 'upper')
    expect(startingHint(undefined)).toBe(1)
    s = repeat(s, 2, 0, 1)
    expect(startingHint(s)).toBe(1)
    s = trial(s, 0, 1)
    expect(startingHint(s)).toBe(0)
  })

  it('brings the glow back only after two misses in a row', () => {
    let s = repeat(emptySkill('A', 'upper'), 3, 0, 1)
    s = trial(s, 1, 0)
    expect(startingHint(s)).toBe(0)
    s = trial(s, 2, 1)
    expect(startingHint(s)).toBe(1)
  })

  it('raises the hint every two misses, capped at 2', () => {
    expect(hintAfterMisses(0, 1)).toBe(0)
    expect(hintAfterMisses(0, 2)).toBe(1)
    expect(hintAfterMisses(1, 2)).toBe(2)
    expect(hintAfterMisses(1, 10)).toBe(2)
  })
})

describe('targets', () => {
  it('starts explorers with a small pool of letters', () => {
    expect(activeLetters(newProgress('explorer'), 'upper')).toHaveLength(4)
    expect(activeLetters(newProgress('adventurer'), 'upper')).toHaveLength(8)
  })

  it('never repeats the same target twice in a row', () => {
    const p = newProgress('explorer')
    let prev = pickTarget(p, null, T0, () => 0)
    for (let i = 0; i < 100; i++) {
      const next = pickTarget(p, prev, T0)
      expect(next).not.toEqual(prev)
      prev = next
    }
  })

  it('adds one new letter when most active letters are known', () => {
    let p: LearnerProgress = newProgress('explorer')
    expect(advance(p).newLetters).toHaveLength(0)
    for (const letter of activeLetters(p, 'upper').slice(0, 3)) {
      const s = repeat(emptySkill(letter, 'upper'), 3, 0, 0)
      p = { ...p, skills: { ...p.skills, [s.id]: s } }
    }
    const result = advance(p)
    expect(result.newLetters).toEqual([{ letter: 'M', letterCase: 'upper' }])
    expect(result.progress.poolSize.upper).toBe(5)
  })

  it('moves from uppercase to lowercase after ten mastered letters', () => {
    let p: LearnerProgress = { ...newProgress('explorer'), poolSize: { upper: 26, lower: 4 } }
    for (const letter of activeLetters(p, 'upper').slice(0, 10)) {
      let s = repeat(emptySkill(letter, 'upper'), 5, 0, 0, T0)
      s = trial(s, 0, 0, T0 + DAY)
      p = { ...p, skills: { ...p.skills, [s.id]: s } }
    }
    const result = advance(p)
    expect(result.newCaseStage).toBe('lower')
    expect(pickTarget(result.progress, null, T0).letterCase).toBe('lower')
  })
})

describe('rewards and stages', () => {
  it('unlocks every stage in a fixed order across galaxies, then bonus stars', () => {
    let rewards = { planets: [] as string[], bonusStars: 0 }
    expect(PLANETS).toHaveLength(24)
    PLANETS.forEach((planet, i) => {
      expect(currentStage(rewards)).toMatchObject({ stage: i + 1, planet, allDone: false })
      const r = awardRound(rewards)
      expect(r.reward).toMatchObject({ kind: 'planet', planet })
      rewards = r.rewards
    })
    expect(currentStage(rewards).allDone).toBe(true)
    expect(awardRound(rewards).reward.kind).toBe('star')
  })

  it('announces a finished galaxy on its last planet only', () => {
    let rewards = { planets: [] as string[], bonusStars: 0 }
    const done: string[] = []
    for (let i = 0; i < PLANETS.length; i++) {
      const r = awardRound(rewards)
      if (r.reward.kind === 'planet' && r.reward.galaxyComplete) done.push(`${i + 1}:${r.reward.galaxyComplete.id}`)
      rewards = r.rewards
    }
    expect(done).toEqual(GALAXIES.map((g, i) => `${(i + 1) * 8}:${g.id}`))
  })

  it('asks for one more fuel cell per galaxy, set by difficulty', () => {
    expect([0, 1, 2].map((g) => cellsPerRound('gentle', g))).toEqual([4, 5, 6])
    expect([0, 1, 2].map((g) => cellsPerRound('normal', g))).toEqual([5, 6, 7])
    expect([0, 1, 2].map((g) => cellsPerRound('challenge', g))).toEqual([6, 7, 8])
  })

  it('brings hints sooner on Gentle and later on Challenge', () => {
    expect(hintAfterMisses(0, 1, DIFFICULTY.gentle.missesPerLevel)).toBe(1)
    expect(hintAfterMisses(0, 2, DIFFICULTY.normal.missesPerLevel)).toBe(1)
    expect(hintAfterMisses(0, 2, DIFFICULTY.challenge.missesPerLevel)).toBe(0)
  })
})
