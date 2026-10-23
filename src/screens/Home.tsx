import { useEffect } from 'react'
import { speak } from '../audio/speech'
import { sfx, unlockAudio } from '../audio/sfx'
import { Pip } from '../components/Pip'
import { PlanetSticker } from '../components/PlanetSticker'
import { Screen } from '../components/common'
import { canCloseApp, closeApp } from '../native/closeApp'
import { currentStage, PLANETS } from '../engine/rewards'
import type { Profile } from '../storage/store'

export type Destination = 'rocket' | 'explore' | 'collection' | 'parent'

export function Home({ profile, onGo, onSwitchPlayer }: { profile: Profile; onGo: (d: Destination) => void; onSwitchPlayer?: () => void }) {
  const stage = currentStage(profile.rewards)
  const planet = stage.planet
  const allCollected = stage.allDone
  const resuming = profile.rocketCells > 0

  useEffect(() => {
    const t = setTimeout(() => speak(`Hi ${profile.name}! Let's fly the rocket!`), 400)
    return () => clearTimeout(t)
  }, [profile.name])

  const go = (d: Destination) => {
    unlockAudio()
    sfx.tap()
    onGo(d)
  }

  return (
    <Screen className="home">
      <div className="corner-left">
        {canCloseApp() && (
          <button className="corner-btn quit-btn" onClick={() => { sfx.tap(); void closeApp() }}>
            👋 Quit
          </button>
        )}
        {onSwitchPlayer && (
          <button className="switch-player" onClick={() => { sfx.tap(); onSwitchPlayer() }} aria-label="Change player">
            <span aria-hidden="true">{profile.avatar}</span> Change player
          </button>
        )}
      </div>
      <div className="corner-actions">
        <button className="corner-btn" onClick={() => go('parent')}>🔒 Grown-ups</button>
      </div>

      <header className="home-head">
        <Pip mood="happy" size={120} />
        <div className="speech-bubble">
          Hi <strong>{profile.name}</strong> {profile.avatar}
        </div>
      </header>

      <div className="home-cards">
        <button className="card card-rocket" onClick={() => go('rocket')}>
          <span className="card-art">
            <span className="card-rocket-emoji" aria-hidden="true">🚀</span>
            <PlanetSticker planet={planet} size={96} />
          </span>
          <span className="card-title">{resuming ? 'Keep flying!' : 'Rocket Launch'}</span>
          <span className="card-sub">{allCollected ? 'Collect bonus stars' : `Stage ${stage.stage} · Fly to ${planet.name}`}</span>
        </button>

        <button className="card card-explore" onClick={() => go('explore')}>
          <span className="card-art" aria-hidden="true">✨🔤✨</span>
          <span className="card-title">Explore</span>
          <span className="card-sub">Press any key!</span>
        </button>

        <button className="card card-stickers" onClick={() => go('collection')}>
          <span className="card-art" aria-hidden="true">🪐</span>
          <span className="card-title">My Planets</span>
          <span className="card-sub">{profile.rewards.planets.length} of {PLANETS.length}</span>
        </button>
      </div>
    </Screen>
  )
}
