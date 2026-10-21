import { unlockAudio } from '../audio/sfx'
import { Pip } from '../components/Pip'
import { PlayerForm } from '../components/PlayerForm'
import { Screen } from '../components/common'
import { createProfile } from '../storage/store'

/** First-run setup for the first player. No account, no email. */
export function Onboarding({ onDone }: { onDone: () => void }) {
  return (
    <Screen className="onboarding">
      <div className="panel">
        <div className="onboarding-head">
          <Pip mood="cheer" size={110} />
          <div>
            <h1>Welcome to TypeQuest</h1>
            <p className="muted">Grown-ups: set up a player in under a minute. You can add more children later. Everything stays on this device.</p>
          </div>
        </div>

        <p className="tip">
          <strong>Tablet tip:</strong> connect a physical keyboard, then turn on Android <em>screen pinning</em> (Settings → Security → App pinning) so little hands can't leave the app by accident.
        </p>

        <PlayerForm
          submitLabel="Let's go! 🚀"
          onSubmit={(details) => {
            unlockAudio()
            createProfile(details)
            onDone()
          }}
        />
      </div>
    </Screen>
  )
}
