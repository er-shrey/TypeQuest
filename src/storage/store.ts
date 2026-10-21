import { useSyncExternalStore } from 'react'
import { POOL } from '../engine/config'
import { newProgress, type LearnerProgress } from '../engine/targets'
import type { Rewards } from '../engine/rewards'

export type StartStage = 'explorer' | 'adventurer'

export interface Settings {
  sound: boolean
  speech: boolean
  reducedMotion: boolean
  /** Minutes before a gentle break screen; 0 = no limit. */
  sessionLimitMin: number
}

export interface ActivityEntry {
  at: number
  kind: 'rocket' | 'explore'
  summary: string
}

export interface Profile {
  id: string
  name: string
  avatar: string
  startStage: StartStage
  createdAt: number
  settings: Settings
  progress: LearnerProgress
  rewards: Rewards
  activity: ActivityEntry[]
  /** Fuel cells filled in an unfinished rocket round, so a reload resumes it. */
  rocketCells: number
}

export interface AppData {
  version: 1
  activeProfileId: string | null
  /** Keyed by id so more profiles can be added later (PRD FR-001). */
  profiles: Record<string, Profile>
}

const KEY = 'typequest:v1'

export const DEFAULT_SETTINGS: Settings = { sound: true, speech: true, reducedMotion: false, sessionLimitMin: 15 }

function emptyData(): AppData {
  return { version: 1, activeProfileId: null, profiles: {} }
}

function read(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyData()
    const parsed = JSON.parse(raw) as AppData
    if (parsed?.version !== 1 || typeof parsed.profiles !== 'object') return emptyData()
    for (const p of Object.values(parsed.profiles)) p.settings = { ...DEFAULT_SETTINGS, ...p.settings }
    return parsed
  } catch {
    return emptyData()
  }
}

let data: AppData = read()
let saveFailed = false
const listeners = new Set<() => void>()

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    saveFailed = false
  } catch {
    // Private mode or full storage: keep playing in memory, the parent area shows a warning.
    saveFailed = true
  }
}

export function update(fn: (draft: AppData) => AppData) {
  data = fn(data)
  write()
  listeners.forEach((l) => l())
}

export function updateProfileById(id: string, fn: (profile: Profile) => Profile) {
  update((d) => (d.profiles[id] ? { ...d, profiles: { ...d.profiles, [id]: fn(d.profiles[id]) } } : d))
}

/** Updates the player who is currently playing. */
export function updateProfile(fn: (profile: Profile) => Profile) {
  if (data.activeProfileId) updateProfileById(data.activeProfileId, fn)
}

export function switchProfile(id: string) {
  update((d) => (d.profiles[id] ? { ...d, activeProfileId: id } : d))
}

export interface ProfileDetails {
  name: string
  avatar: string
  startStage: StartStage
}

/** Changes a player's name, buddy or starting stage. Never removes progress. */
export function editProfile(id: string, details: ProfileDetails) {
  updateProfileById(id, (p) => {
    const start = POOL.startSize[details.startStage]
    const poolSize = {
      upper: Math.max(p.progress.poolSize.upper, start),
      lower: Math.max(p.progress.poolSize.lower, start),
    }
    return { ...p, ...details, progress: { ...p.progress, poolSize } }
  })
}

export function profilesInOrder(d: AppData): Profile[] {
  return Object.values(d.profiles).sort((a, b) => a.createdAt - b.createdAt)
}

export function createProfile({ name, avatar, startStage }: ProfileDetails): Profile {
  const profile: Profile = {
    id: Math.random().toString(36).slice(2, 10),
    name,
    avatar,
    startStage,
    createdAt: Date.now(),
    settings: { ...DEFAULT_SETTINGS },
    progress: newProgress(startStage),
    rewards: { planets: [], bonusStars: 0 },
    activity: [],
    rocketCells: 0,
  }
  // Adding a second player from the grown-ups area doesn't switch who is playing.
  update((d) => ({ ...d, activeProfileId: d.activeProfileId ?? profile.id, profiles: { ...d.profiles, [profile.id]: profile } }))
  if (typeof navigator !== 'undefined') void navigator.storage?.persist?.().catch(() => {})
  return profile
}

export function resetProgress(id: string) {
  updateProfileById(id, (p) => ({
    ...p,
    progress: newProgress(p.startStage),
    rewards: { planets: [], bonusStars: 0 },
    activity: [],
    rocketCells: 0,
  }))
}

export function deleteProfile(id: string) {
  update((d) => {
    const profiles = { ...d.profiles }
    delete profiles[id]
    const activeProfileId = d.activeProfileId === id ? (profilesInOrder({ ...d, profiles })[0]?.id ?? null) : d.activeProfileId
    return { ...d, profiles, activeProfileId }
  })
}

export function logActivity(entry: ActivityEntry) {
  updateProfile((p) => ({ ...p, activity: [entry, ...p.activity].slice(0, 50) }))
}

export function getData(): AppData {
  return data
}

export function didSaveFail() {
  return saveFailed
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getData)
}

export function useProfile(): Profile | null {
  const d = useAppData()
  return d.activeProfileId ? (d.profiles[d.activeProfileId] ?? null) : null
}
