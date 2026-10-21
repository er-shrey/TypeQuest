export type PipMood = 'happy' | 'curious' | 'cheer' | 'sleepy'

/** Pip, the friendly guide. Drawn in SVG so it stays crisp at any size. */
export function Pip({ mood = 'happy', size = 140 }: { mood?: PipMood; size?: number }) {
  const eyesClosed = mood === 'sleepy'
  return (
    <svg className={`pip pip-${mood}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Pip the guide">
      <g className="pip-body">
        <line x1="60" y1="22" x2="60" y2="8" stroke="#5fc46b" strokeWidth="4" strokeLinecap="round" />
        <circle className="pip-antenna" cx="60" cy="8" r="6" fill="#ffe156" />
        <ellipse cx="60" cy="66" rx="44" ry="42" fill="#7ee081" />
        <ellipse cx="46" cy="50" rx="14" ry="10" fill="#ffffff" opacity="0.25" />
        {eyesClosed ? (
          <>
            <path d="M36 62 q8 6 16 0" stroke="#1d2440" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M68 62 q8 6 16 0" stroke="#1d2440" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <g className="pip-eyes">
            <circle cx="44" cy="60" r="11" fill="#fff" />
            <circle cx="76" cy="60" r="11" fill="#fff" />
            <circle cx={mood === 'curious' ? 47 : 45} cy="61" r="6" fill="#1d2440" />
            <circle cx={mood === 'curious' ? 79 : 77} cy="61" r="6" fill="#1d2440" />
            <circle cx="47" cy="58" r="2" fill="#fff" />
            <circle cx="79" cy="58" r="2" fill="#fff" />
          </g>
        )}
        {mood === 'curious' ? (
          <circle cx="60" cy="86" r="5" fill="#1d2440" />
        ) : mood === 'sleepy' ? (
          <path d="M52 84 q8 4 16 0" stroke="#1d2440" strokeWidth="4" fill="none" strokeLinecap="round" />
        ) : (
          <path d={mood === 'cheer' ? 'M44 80 q16 22 32 0 z' : 'M46 80 q14 14 28 0'} stroke="#1d2440" strokeWidth="4" fill={mood === 'cheer' ? '#ff7aa8' : 'none'} strokeLinecap="round" strokeLinejoin="round" />
        )}
        <circle cx="30" cy="76" r="6" fill="#ff7aa8" opacity="0.5" />
        <circle cx="90" cy="76" r="6" fill="#ff7aa8" opacity="0.5" />
      </g>
    </svg>
  )
}
