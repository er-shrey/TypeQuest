import { useState } from 'react'
import type { ProfileDetails, StartStage } from '../storage/store'

const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🐙', '🦄', '🐶', '🐱', '🦁', '🐧', '🐨', '🐵']

interface Props {
  initial?: ProfileDetails
  /** Buddies other players already have; offered last so kids can tell profiles apart. */
  takenAvatars?: string[]
  submitLabel: string
  onSubmit: (details: ProfileDetails) => void
  onCancel?: () => void
}

/** Nickname, buddy and starting stage. Used for first-run setup, adding and editing players. */
export function PlayerForm({ initial, takenAvatars = [], submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS.find((a) => !takenAvatars.includes(a)) ?? AVATARS[0])
  const [stage, setStage] = useState<StartStage>(initial?.startStage ?? 'explorer')
  const avatars = [...AVATARS.filter((a) => !takenAvatars.includes(a)), ...AVATARS.filter((a) => takenAvatars.includes(a))]

  const submit = () => onSubmit({ name: name.trim() || 'Explorer', avatar, startStage: stage })

  return (
    <div className="player-form">
      <label className="field">
        <span>Player's nickname</span>
        <input value={name} maxLength={16} placeholder="e.g. Mia" onChange={(e) => setName(e.target.value)} autoFocus />
      </label>

      <div className="field">
        <span>Pick a buddy</span>
        <div className="avatar-grid">
          {avatars.map((a) => (
            <button
              key={a}
              className={`avatar ${a === avatar ? 'selected' : ''} ${takenAvatars.includes(a) ? 'taken' : ''}`}
              onClick={() => setAvatar(a)}
              aria-pressed={a === avatar}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Where should we start?</span>
        <div className="stage-grid">
          <button className={`stage ${stage === 'explorer' ? 'selected' : ''}`} onClick={() => setStage('explorer')} aria-pressed={stage === 'explorer'}>
            <strong>Keyboard Explorer</strong>
            <small>New to keyboards · about ages 4–5</small>
          </button>
          <button className={`stage ${stage === 'adventurer' ? 'selected' : ''}`} onClick={() => setStage('adventurer')} aria-pressed={stage === 'adventurer'}>
            <strong>Letter Adventurer</strong>
            <small>Knows some letters · about ages 5–6</small>
          </button>
          <div className="stage disabled">
            <strong>Typing Apprentice+</strong>
            <small>Coming later</small>
          </div>
        </div>
        <p className="muted small">Age is only a starting guide — TypeQuest adapts to what your child shows it, at their own pace. You can change this later.</p>
      </div>

      <div className="form-actions">
        {onCancel && <button className="big-btn" onClick={onCancel}>Cancel</button>}
        <button className="big-btn primary" onClick={submit}>{submitLabel}</button>
      </div>
    </div>
  )
}
