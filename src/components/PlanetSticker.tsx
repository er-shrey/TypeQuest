import type { Planet } from '../engine/rewards'

const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`

/** SVG twin of the Pixi planet drawing, for the sticker collection. */
export function PlanetSticker({ planet, locked = false, size = 120 }: { planet: Planet; locked?: boolean; size?: number }) {
  const color = locked ? '#3a4573' : hex(planet.color)
  const accent = locked ? '#2b3560' : hex(planet.accent)
  return (
    <svg width={size} height={size} viewBox="-80 -80 160 160" role="img" aria-label={locked ? 'A planet still to discover' : planet.name}>
      {planet.ring && <ellipse cx="0" cy="0" rx="72" ry="19" fill="none" stroke={accent} strokeWidth="6" />}
      <circle r="45" fill={color} />
      {locked ? (
        <text y="16" textAnchor="middle" fontSize="44" fontWeight="700" fill="#6b78b0" fontFamily="Fredoka">?</text>
      ) : (
        <>
          <circle cx="-20" cy="16" r="7" fill={accent} opacity="0.55" />
          <circle cx="22" cy="-18" r="5" fill={accent} opacity="0.55" />
          <circle cx="-16" cy="-18" r="12" fill="#fff" opacity="0.22" />
          <circle cx="-11" cy="-2" r="4" fill="#1d2440" />
          <circle cx="11" cy="-2" r="4" fill="#1d2440" />
          <path d="M-8 8 q8 9 16 0" stroke="#1d2440" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="-22" cy="7" r="4.5" fill="#ff7aa8" opacity="0.45" />
          <circle cx="22" cy="7" r="4.5" fill="#ff7aa8" opacity="0.45" />
        </>
      )}
      {planet.ring && <path d="M-72 0 a72 19 0 0 0 144 0" fill="none" stroke={accent} strokeWidth="6" />}
    </svg>
  )
}
