import type { ReactNode } from 'react'
import { sfx } from '../audio/sfx'

export function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="round-btn home-btn" onClick={() => { sfx.tap(); onClick() }} aria-label="Home">
      <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="currentColor" />
      </svg>
    </button>
  )
}

export function FocusOverlay({ onResume }: { onResume: () => void }) {
  return (
    <button className="focus-overlay" onClick={onResume}>
      <span className="focus-card">
        <span className="focus-emoji" aria-hidden="true">👆</span>
        Tap here to keep playing
      </span>
    </button>
  )
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`screen ${className}`}>{children}</div>
}
