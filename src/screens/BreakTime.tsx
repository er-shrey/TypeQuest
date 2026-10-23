import { useEffect, useState } from 'react'
import { speak } from '../audio/speech'
import { sfx } from '../audio/sfx'
import { Pip } from '../components/Pip'
import { Screen } from '../components/common'
import { closeApp } from '../native/closeApp'

/** Shown when the parent's session limit is reached. Warm, never guilt-inducing (PRD FR-020). */
export function BreakTime({ name, onGrownUp }: { name: string; onGrownUp: () => void }) {
  const [closeBlocked, setCloseBlocked] = useState(false)

  useEffect(() => {
    speak(`Great exploring today, ${name}! Pip is having a little rest.`)
  }, [name])

  const close = async () => {
    sfx.tap()
    if (!(await closeApp())) setCloseBlocked(true)
  }

  return (
    <Screen className="break">
      <Pip mood="sleepy" size={180} />
      <h1>Great exploring today!</h1>
      <p>Pip is having a little rest. Your planets are saved for next time.</p>
      <button className="big-btn primary" onClick={close}>Close TypeQuest 👋</button>
      {closeBlocked && <p className="small">All done! A grown-up can close this tab now.</p>}
      <button className="parent-link static" onClick={onGrownUp}>🔒 Grown-ups: keep playing</button>
    </Screen>
  )
}
