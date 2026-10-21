import { useEffect } from 'react'
import { speak } from '../audio/speech'
import { sfx, unlockAudio } from '../audio/sfx'
import { Pip } from '../components/Pip'
import { Screen } from '../components/common'
import { profilesInOrder, switchProfile, useAppData } from '../storage/store'

/** "Who's playing?" — big buddies so a child who can't read yet can find their own. */
export function ProfilePicker({ onPicked, onGrownUps }: { onPicked: () => void; onGrownUps: () => void }) {
  const players = profilesInOrder(useAppData())

  useEffect(() => {
    const t = setTimeout(() => speak("Who's playing today?"), 300)
    return () => clearTimeout(t)
  }, [])

  const pick = (id: string) => {
    unlockAudio()
    sfx.tap()
    switchProfile(id)
    onPicked()
  }

  return (
    <Screen className="picker">
      <button className="parent-link" onClick={onGrownUps}>🔒 Grown-ups</button>
      <header className="home-head">
        <Pip mood="happy" size={110} />
        <div className="speech-bubble">Who's playing?</div>
      </header>
      <div className="player-grid">
        {players.map((p) => (
          <button key={p.id} className="player-card" onClick={() => pick(p.id)}>
            <span className="player-avatar" aria-hidden="true">{p.avatar}</span>
            <span className="player-name">{p.name}</span>
          </button>
        ))}
      </div>
    </Screen>
  )
}
