import { useEffect } from 'react'
import { speak } from '../audio/speech'
import { HomeButton, Screen } from '../components/common'
import { PlanetSticker } from '../components/PlanetSticker'
import { PLANETS } from '../engine/rewards'
import type { Profile } from '../storage/store'

export function Collection({ profile, onHome }: { profile: Profile; onHome: () => void }) {
  const { planets, bonusStars } = profile.rewards

  useEffect(() => {
    speak(planets.length ? `You have visited ${planets.length} ${planets.length === 1 ? 'planet' : 'planets'}!` : 'Fly the rocket to find planets!')
  }, [planets.length])

  return (
    <Screen className="collection">
      <div className="game-top">
        <HomeButton onClick={onHome} />
      </div>
      <h1 className="title">My Planets</h1>
      <div className="sticker-grid">
        {PLANETS.map((p) => {
          const got = planets.includes(p.id)
          return (
            <button key={p.id} className={`sticker ${got ? '' : 'locked'}`} onClick={() => got && speak(p.name)} disabled={!got}>
              <PlanetSticker planet={p} locked={!got} size={120} />
              <span>{got ? p.name : '?'}</span>
            </button>
          )
        })}
      </div>
      {bonusStars > 0 && <p className="bonus-stars">{'⭐'.repeat(Math.min(bonusStars, 30))}</p>}
    </Screen>
  )
}
