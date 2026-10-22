import { App as NativeApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useEffect, useState } from 'react'
import { speak } from '../audio/speech'
import { sfx } from '../audio/sfx'
import { Pip } from '../components/Pip'
import { Screen } from '../components/common'

/** Shown when the parent's session limit is reached. Warm, never guilt-inducing (PRD FR-020). */
export function BreakTime({ name, onGrownUp }: { name: string; onGrownUp: () => void }) {
  const [closeBlocked, setCloseBlocked] = useState(false)

  useEffect(() => {
    speak(`Great exploring today, ${name}! Pip is having a little rest.`)
  }, [name])

  const close = () => {
    sfx.tap()
    if (Capacitor.isNativePlatform()) {
      void NativeApp.exitApp()
      return
    }
    // Browsers only let a page close itself in some cases (an installed app, a tab it opened).
    window.close()
    setTimeout(() => setCloseBlocked(true), 300)
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
