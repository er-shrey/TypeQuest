import { beforeEach, describe, expect, it } from 'vitest'
import { masteryState, recordTrial } from '../engine/skills'
import { getSkill } from '../engine/targets'
import {
  createProfile,
  deleteProfile,
  editProfile,
  getData,
  profilesInOrder,
  switchProfile,
  update,
  updateProfile,
} from './store'

describe('multiple players', () => {
  beforeEach(() => update(() => ({ version: 1, activeProfileId: null, profiles: {} })))

  it('makes the first player active and keeps them active when more are added', () => {
    const mia = createProfile({ name: 'Mia', avatar: '🦊', startStage: 'explorer' })
    createProfile({ name: 'Leo', avatar: '🐼', startStage: 'adventurer' })
    expect(getData().activeProfileId).toBe(mia.id)
    expect(profilesInOrder(getData()).map((p) => p.name)).toEqual(['Mia', 'Leo'])
  })

  it('keeps each player’s progress separate', () => {
    const mia = createProfile({ name: 'Mia', avatar: '🦊', startStage: 'explorer' })
    const leo = createProfile({ name: 'Leo', avatar: '🐼', startStage: 'explorer' })
    updateProfile((p) => {
      const skill = recordTrial(getSkill(p.progress, 'A', 'upper'), { letter: 'A', letterCase: 'upper', misses: 0, wrongKeys: [], maxHint: 0, at: Date.now() })
      return { ...p, progress: { ...p.progress, skills: { ...p.progress.skills, [skill.id]: skill } } }
    })
    switchProfile(leo.id)
    const d = getData()
    expect(masteryState(getSkill(d.profiles[mia.id].progress, 'A', 'upper'))).toBe('learning')
    expect(masteryState(getSkill(d.profiles[leo.id].progress, 'A', 'upper'))).toBe('new')
    expect(d.activeProfileId).toBe(leo.id)
  })

  it('edits name and buddy without losing progress, and never shrinks the letter pool', () => {
    const mia = createProfile({ name: 'Mia', avatar: '🦊', startStage: 'adventurer' })
    updateProfile((p) => ({ ...p, rewards: { planets: ['moon'], bonusStars: 0 } }))
    editProfile(mia.id, { name: 'Mimi', avatar: '🦄', startStage: 'explorer' })
    const p = getData().profiles[mia.id]
    expect(p.name).toBe('Mimi')
    expect(p.avatar).toBe('🦄')
    expect(p.rewards.planets).toEqual(['moon'])
    expect(p.progress.poolSize.upper).toBe(8)
  })

  it('moves to another player when the active one is deleted', () => {
    const mia = createProfile({ name: 'Mia', avatar: '🦊', startStage: 'explorer' })
    const leo = createProfile({ name: 'Leo', avatar: '🐼', startStage: 'explorer' })
    deleteProfile(mia.id)
    expect(getData().activeProfileId).toBe(leo.id)
    deleteProfile(leo.id)
    expect(getData().activeProfileId).toBeNull()
  })
})
