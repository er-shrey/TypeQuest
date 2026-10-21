import { useEffect } from 'react'
import { speak } from '../audio/speech'
import { Pip } from '../components/Pip'
import { Screen } from '../components/common'

/** Shown when the parent's session limit is reached. Warm, never guilt-inducing (PRD FR-020). */
export function BreakTime({ name, onGrownUp }: { name: string; onGrownUp: () => void }) {
  useEffect(() => {
    speak(`Great exploring today, ${name}! Pip is having a little rest.`)
  }, [name])

  return (
    <Screen className="break">
      <Pip mood="sleepy" size={180} />
      <h1>Great exploring today!</h1>
      <p>Pip is having a little rest. Your planets are saved for next time.</p>
      <button className="parent-link static" onClick={onGrownUp}>🔒 Grown-ups: keep playing</button>
    </Screen>
  )
}
