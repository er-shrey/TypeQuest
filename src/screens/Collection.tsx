import { useEffect } from 'react'
import { speak } from '../audio/speech'
import { HomeButton, Screen } from '../components/common'
import { PlanetSticker } from '../components/PlanetSticker'
import { GALAXIES } from '../engine/rewards'
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
      {GALAXIES.map((galaxy, i) => {
        // A galaxy shows once the child reaches it, so later ones stay a surprise.
        const reached = i === 0 || galaxy.planets.some((p) => planets.includes(p.id)) || GALAXIES[i - 1].planets.every((p) => planets.includes(p.id))
        if (!reached) return null
        const count = galaxy.planets.filter((p) => planets.includes(p.id)).length
        return (
          <section key={galaxy.id} className="galaxy">
            <h2 className="galaxy-title">{galaxy.name} <small>{count} of {galaxy.planets.length}</small></h2>
            <div className="sticker-grid">
              {galaxy.planets.map((p) => {
                const got = planets.includes(p.id)
                return (
                  <button key={p.id} className={`sticker ${got ? '' : 'locked'}`} onClick={() => got && speak(p.name)} disabled={!got}>
                    <PlanetSticker planet={p} locked={!got} size={110} />
                    <span>{got ? p.name : '?'}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
      {GALAXIES.some((g, i) => i > 0 && !g.planets.some((p) => planets.includes(p.id)) && !GALAXIES[i - 1].planets.every((p) => planets.includes(p.id))) && (
        <p className="more-galaxies">More galaxies to discover… 🔭</p>
      )}
      {bonusStars > 0 && <p className="bonus-stars">{'⭐'.repeat(Math.min(bonusStars, 30))}</p>}
    </Screen>
  )
}
