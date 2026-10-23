export interface Planet {
  id: string
  name: string
  /** Base colour and accent used to draw the planet. */
  color: number
  accent: number
  ring?: boolean
  /** Ring tilt in radians (positive = clockwise); 0 is a flat, horizontal ring. */
  ringTilt?: number
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

/** The first three galaxies are drawn by hand: 8 planets each, stages 1–24. */
const HANDMADE: Galaxy[] = [
  {
    id: 'home',
    name: 'Home Galaxy',
    sky: ['#0b1033', '#24206a', '#5a3d9e'],
    hills: [0x3b2f7a, 0x2a2160],
    planets: [
      { id: 'moon', name: 'Moon', color: 0xdfe3ee, accent: 0xa9b0c6 },
      { id: 'mars', name: 'Mars', color: 0xff7a59, accent: 0xc94f35 },
      { id: 'ringo', name: 'Ringo', color: 0xffc94d, accent: 0xff9f1c, ring: true, ringTilt: 0.28 },
      { id: 'bubble', name: 'Bubble', color: 0x7fd8ff, accent: 0x3aa8e0 },
      { id: 'candy', name: 'Candy', color: 0xff9ad5, accent: 0xff5fae, ring: true, ringTilt: -0.35 },
      { id: 'ice', name: 'Ice', color: 0xc8f4ff, accent: 0x8ad6ef },
      { id: 'jungle', name: 'Jungle', color: 0x7ee081, accent: 0x3fae5a },
      { id: 'rainbow', name: 'Rainbow', color: 0xb98cff, accent: 0x7a5cff, ring: true, ringTilt: 0.18 },
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
      { id: 'lagoon', name: 'Lagoon', color: 0x4fd1c5, accent: 0x219e94, ring: true, ringTilt: -0.22 },
      { id: 'shell', name: 'Shell', color: 0xffe0b5, accent: 0xf0a868 },
      { id: 'kelp', name: 'Kelp', color: 0x8bd17c, accent: 0x4c9a3f },
      { id: 'pearl', name: 'Pearl', color: 0xf3f0ff, accent: 0xc4b8f0, ring: true, ringTilt: 0.42 },
      { id: 'wave', name: 'Wave', color: 0x6fb8ff, accent: 0x2f7fd6 },
      { id: 'starfish', name: 'Starfish', color: 0xffb347, accent: 0xff7f2a, ring: true, ringTilt: -0.12 },
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
      { id: 'mint', name: 'Mint', color: 0xa8f0d0, accent: 0x52c49a, ring: true, ringTilt: 0.32 },
      { id: 'cocoa', name: 'Cocoa', color: 0xa1746a, accent: 0x6b453c },
      { id: 'jelly', name: 'Jelly', color: 0xff6f91, accent: 0xd43f66, ring: true, ringTilt: -0.45 },
      { id: 'sprinkle', name: 'Sprinkle', color: 0xffc2e2, accent: 0x7ec8ff },
      { id: 'sundae', name: 'Sundae', color: 0xfff4e6, accent: 0xff8fab, ring: true, ringTilt: 0.2 },
    ],
  },
]

// ---------- Generated galaxies: stages 25–600 ----------

const GENERATED_NAMES = [
  'Comet Coast', 'Dino Drift', 'Moonbeam Meadow', 'Robot Reef', 'Jelly Jungle', 'Thunder Trail',
  'Bubblegum Belt', 'Crystal Caves', 'Pirate Ring', 'Dragon Dunes', 'Cloud Castle', 'Rainbow Ridge',
  'Snowflake Sea', 'Lava Lagoon', 'Firefly Forest', 'Teddy Town', 'Marshmallow Moons', 'Whale Way',
  'Pumpkin Patch', 'Glitter Gulf', 'Rocket Rapids', 'Owl Orbit', 'Cosmic Carnival', 'Starlight Summit',
]
export const PLANETS_PER_GENERATED_GALAXY = 24

const FIRST = ['Bo', 'Zi', 'Lu', 'Mo', 'Pip', 'Ka', 'Ru', 'Ti', 'Na', 'Fu', 'Ga', 'Wi', 'Jo', 'Ze', 'Ko', 'Mi', 'Da', 'Bel', 'Pu', 'Su', 'Lo', 'Vi']
const MIDDLE = ['ra', 'lo', 'bo', 'ni', 'po', 'zu', 'mi', 'ko', 'la', 'to', 'vy', 'do', 'ba', 'li']
const LAST = ['', '', '', 'x', 'n', 'ra', 'bo', 'li', 'ty']

/** Small seeded generator, so every child gets the same planets in the same order. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hsl(h: number, s: number, l: number): number {
  const k = (n: number) => (n + h / 30) % 12
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const f = (n: number) => l / 100 - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return (Math.round(f(0) * 255) << 16) | (Math.round(f(8) * 255) << 8) | Math.round(f(4) * 255)
}

const css = (n: number) => `#${n.toString(16).padStart(6, '0')}`

function generateGalaxies(): Galaxy[] {
  const used = new Set(HANDMADE.flatMap((g) => g.planets.map((p) => p.name)))
  const pick = <T,>(list: T[], r: () => number) => list[Math.floor(r() * list.length)]
  return GENERATED_NAMES.map((name, gi) => {
    const r = seeded(1000 + gi)
    // Spread galaxy hues around the colour wheel so neighbouring galaxies look different,
    // skipping the muddy red-brown band (0°–45°), which reads as gloomy for a night sky.
    const hue = 45 + ((gi * 137.5) % 300)
    const planets: Planet[] = []
    for (let pi = 0; pi < PLANETS_PER_GENERATED_GALAXY; pi++) {
      let planetName = ''
      for (let tries = 0; !planetName || used.has(planetName); tries++) {
        planetName = pick(FIRST, r) + pick(MIDDLE, r) + (tries > 5 ? pick(MIDDLE, r) : pick(LAST, r))
      }
      used.add(planetName)
      const ph = (hue + (r() - 0.5) * 160 + 360) % 360
      const light = 58 + r() * 20
      planets.push({
        id: `g${gi + 4}-${pi + 1}`,
        name: planetName,
        color: hsl(ph, 60 + r() * 30, light),
        accent: hsl(ph, 55 + r() * 25, light - 22),
        ring: r() < 0.3,
        // Between about -35° and +35°, never quite flat, so ringed planets look varied.
        ringTilt: (r() < 0.5 ? -1 : 1) * (0.12 + r() * 0.5),
      })
    }
    return {
      id: `g${gi + 4}`,
      name,
      sky: [css(hsl(hue, 60, 8)), css(hsl(hue, 55, 20)), css(hsl(hue, 45, 36))],
      hills: [hsl(hue, 40, 30), hsl(hue, 45, 20)],
      planets,
    }
  })
}

/**
 * Each planet is one stage, unlocked in this fixed order by finishing a rocket
 * round (predictable, never random). Each galaxy asks for one more fuel cell,
 * up to the cap in `engine/config.ts`.
 */
export const GALAXIES: Galaxy[] = [...HANDMADE, ...generateGalaxies()]

/** Every stage in order. */
export const PLANETS: Planet[] = GALAXIES.flatMap((g) => g.planets)
const GALAXY_INDEX = new Map(GALAXIES.flatMap((g, gi) => g.planets.map((p) => [p.id, gi] as const)))

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
  const index = GALAXY_INDEX.get(planetId) ?? 0
  return { galaxy: GALAXIES[index], index }
}

/** The stage the child is working on: the first planet not yet collected. */
export function currentStage(rewards: Rewards): StageInfo {
  const have = new Set(rewards.planets)
  const i = PLANETS.findIndex((p) => !have.has(p.id))
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
  const have = new Set(rewards.planets)
  const next = PLANETS.find((p) => !have.has(p.id))
  if (!next) return { rewards: { ...rewards, bonusStars: rewards.bonusStars + 1 }, reward: { kind: 'star' } }
  const planets = [...rewards.planets, next.id]
  have.add(next.id)
  const { galaxy } = galaxyOf(next.id)
  const galaxyComplete = galaxy.planets.every((p) => have.has(p.id)) ? galaxy : null
  return { rewards: { ...rewards, planets }, reward: { kind: 'planet', planet: next, galaxyComplete } }
}
