export interface Planet {
  id: string
  name: string
  /** Base colour and accent used to draw the planet. */
  color: number
  accent: number
  ring?: boolean
}

/** Unlocked in this fixed order, one per completed rocket round (predictable, never random). */
export const PLANETS: Planet[] = [
  { id: 'moon', name: 'Moon', color: 0xdfe3ee, accent: 0xa9b0c6 },
  { id: 'mars', name: 'Mars', color: 0xff7a59, accent: 0xc94f35 },
  { id: 'ringo', name: 'Ringo', color: 0xffc94d, accent: 0xff9f1c, ring: true },
  { id: 'bubble', name: 'Bubble', color: 0x7fd8ff, accent: 0x3aa8e0 },
  { id: 'candy', name: 'Candy', color: 0xff9ad5, accent: 0xff5fae, ring: true },
  { id: 'ice', name: 'Ice', color: 0xc8f4ff, accent: 0x8ad6ef },
  { id: 'jungle', name: 'Jungle', color: 0x7ee081, accent: 0x3fae5a },
  { id: 'rainbow', name: 'Rainbow', color: 0xb98cff, accent: 0x7a5cff, ring: true },
]

export interface Rewards {
  planets: string[]
  bonusStars: number
}

export type RoundReward = { kind: 'planet'; planet: Planet } | { kind: 'star' }

export function awardRound(rewards: Rewards): { rewards: Rewards; reward: RoundReward } {
  const next = PLANETS.find((p) => !rewards.planets.includes(p.id))
  if (next) return { rewards: { ...rewards, planets: [...rewards.planets, next.id] }, reward: { kind: 'planet', planet: next } }
  return { rewards: { ...rewards, bonusStars: rewards.bonusStars + 1 }, reward: { kind: 'star' } }
}

/** Planet the rocket flies to next — what the child is working toward. */
export function nextPlanet(rewards: Rewards): Planet {
  return PLANETS.find((p) => !rewards.planets.includes(p.id)) ?? PLANETS[PLANETS.length - 1]
}
