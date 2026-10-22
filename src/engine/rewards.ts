export interface Planet {
  id: string
  name: string
  /** Base colour and accent used to draw the planet. */
  color: number
  accent: number
  ring?: boolean
}

export interface Galaxy {
  id: string
  name: string
  /** Night-sky colours behind the rocket while flying through this galaxy (CSS). */
  sky: [string, string, string]
  /** Far and near hill colours under the launch pad. */
  hills: [number, number]
  planets: Planet[]
}

/**
 * Each planet is one stage, unlocked in this fixed order by finishing a rocket
 * round (predictable, never random). Each galaxy asks for one more fuel cell.
 */
export const GALAXIES: Galaxy[] = [
  {
    id: 'home',
    name: 'Home Galaxy',
    sky: ['#0b1033', '#24206a', '#5a3d9e'],
    hills: [0x3b2f7a, 0x2a2160],
    planets: [
      { id: 'moon', name: 'Moon', color: 0xdfe3ee, accent: 0xa9b0c6 },
      { id: 'mars', name: 'Mars', color: 0xff7a59, accent: 0xc94f35 },
      { id: 'ringo', name: 'Ringo', color: 0xffc94d, accent: 0xff9f1c, ring: true },
      { id: 'bubble', name: 'Bubble', color: 0x7fd8ff, accent: 0x3aa8e0 },
      { id: 'candy', name: 'Candy', color: 0xff9ad5, accent: 0xff5fae, ring: true },
      { id: 'ice', name: 'Ice', color: 0xc8f4ff, accent: 0x8ad6ef },
      { id: 'jungle', name: 'Jungle', color: 0x7ee081, accent: 0x3fae5a },
      { id: 'rainbow', name: 'Rainbow', color: 0xb98cff, accent: 0x7a5cff, ring: true },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean Nebula',
    sky: ['#04192e', '#0c3d5c', '#1f7a8c'],
    hills: [0x1d5c6e, 0x123f52],
    planets: [
      { id: 'pebble', name: 'Pebble', color: 0xb9c4d0, accent: 0x7d8a99 },
      { id: 'coral', name: 'Coral', color: 0xff8f7a, accent: 0xe25c52 },
      { id: 'lagoon', name: 'Lagoon', color: 0x4fd1c5, accent: 0x219e94, ring: true },
      { id: 'shell', name: 'Shell', color: 0xffe0b5, accent: 0xf0a868 },
      { id: 'kelp', name: 'Kelp', color: 0x8bd17c, accent: 0x4c9a3f },
      { id: 'pearl', name: 'Pearl', color: 0xf3f0ff, accent: 0xc4b8f0, ring: true },
      { id: 'wave', name: 'Wave', color: 0x6fb8ff, accent: 0x2f7fd6 },
      { id: 'starfish', name: 'Starfish', color: 0xffb347, accent: 0xff7f2a, ring: true },
    ],
  },
  {
    id: 'sweet',
    name: 'Sweet Cluster',
    sky: ['#1e0b2e', '#4a1752', '#8c3b7a'],
    hills: [0x6e2a63, 0x4a1a45],
    planets: [
      { id: 'cookie', name: 'Cookie', color: 0xd9a066, accent: 0x9c6332 },
      { id: 'berry', name: 'Berry', color: 0xd96cff, accent: 0xa13fd1 },
      { id: 'lemon', name: 'Lemon', color: 0xfff176, accent: 0xf2c400 },
      { id: 'mint', name: 'Mint', color: 0xa8f0d0, accent: 0x52c49a, ring: true },
      { id: 'cocoa', name: 'Cocoa', color: 0xa1746a, accent: 0x6b453c },
      { id: 'jelly', name: 'Jelly', color: 0xff6f91, accent: 0xd43f66, ring: true },
      { id: 'sprinkle', name: 'Sprinkle', color: 0xffc2e2, accent: 0x7ec8ff },
      { id: 'sundae', name: 'Sundae', color: 0xfff4e6, accent: 0xff8fab, ring: true },
    ],
  },
]

/** Every stage in order. */
export const PLANETS: Planet[] = GALAXIES.flatMap((g) => g.planets)

export interface Rewards {
  planets: string[]
  bonusStars: number
}

export type RoundReward = { kind: 'planet'; planet: Planet; galaxyComplete: Galaxy | null } | { kind: 'star' }

export interface StageInfo {
  /** 1-based stage number the child is playing now. */
  stage: number
  total: number
  planet: Planet
  galaxy: Galaxy
  galaxyIndex: number
  /** True once every planet is collected; rounds then award bonus stars. */
  allDone: boolean
}

export function galaxyOf(planetId: string): { galaxy: Galaxy; index: number } {
  const index = Math.max(0, GALAXIES.findIndex((g) => g.planets.some((p) => p.id === planetId)))
  return { galaxy: GALAXIES[index], index }
}

/** The stage the child is working on: the first planet not yet collected. */
export function currentStage(rewards: Rewards): StageInfo {
  const i = PLANETS.findIndex((p) => !rewards.planets.includes(p.id))
  const allDone = i < 0
  const planet = allDone ? PLANETS[PLANETS.length - 1] : PLANETS[i]
  const { galaxy, index } = galaxyOf(planet.id)
  return { stage: allDone ? PLANETS.length : i + 1, total: PLANETS.length, planet, galaxy, galaxyIndex: index, allDone }
}

/** Planet the rocket flies to next — what the child is working toward. */
export function nextPlanet(rewards: Rewards): Planet {
  return currentStage(rewards).planet
}

export function awardRound(rewards: Rewards): { rewards: Rewards; reward: RoundReward } {
  const next = PLANETS.find((p) => !rewards.planets.includes(p.id))
  if (!next) return { rewards: { ...rewards, bonusStars: rewards.bonusStars + 1 }, reward: { kind: 'star' } }
  const planets = [...rewards.planets, next.id]
  const { galaxy } = galaxyOf(next.id)
  const galaxyComplete = galaxy.planets.every((p) => planets.includes(p.id)) ? galaxy : null
  return { rewards: { ...rewards, planets }, reward: { kind: 'planet', planet: next, galaxyComplete } }
}
