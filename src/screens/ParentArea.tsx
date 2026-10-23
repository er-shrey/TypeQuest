import { useState } from 'react'
import { PlayerForm } from '../components/PlayerForm'
import { cellsPerRound, DIFFICULTY, type Difficulty } from '../engine/config'
import { currentStage } from '../engine/rewards'
import { isKnown, lineForStation, TOTAL_STATIONS } from '../engine/words'
import { INTRO_ORDER, type CaseStage, type LetterCase } from '../engine/letters'
import { masteryState, recentAccuracy, type MasteryState } from '../engine/skills'
import { getSkill } from '../engine/targets'
import {
  createProfile,
  deleteProfile,
  didSaveFail,
  editProfile,
  profilesInOrder,
  resetProgress,
  updateProfileById,
  useAppData,
  type Profile,
  type Settings,
} from '../storage/store'

export type ParentTab = 'progress' | 'settings' | 'players'

const STATE_LABEL: Record<MasteryState, string> = {
  new: 'Not met yet',
  learning: 'Getting to know',
  practicing: 'Practising',
  mastered: 'Knows it well',
}

const CASE_LABEL: Record<CaseStage, string> = {
  upper: 'Capital letters (A B C)',
  lower: 'Small letters (a b c)',
  capital: 'Mixed, then Capital-case words',
}

const STAGE_LABEL = { explorer: 'Keyboard Explorer', adventurer: 'Letter Adventurer' }

function stageSummary(profile: Profile) {
  const s = currentStage(profile.rewards)
  return s.allDone ? `all ${s.total} stages done, collecting bonus stars` : `stage ${s.stage} of ${s.total} (${s.galaxy.name})`
}

function trainSummary(profile: Profile) {
  const t = profile.train
  const met = Object.values(t.words)
  if (!met.length) return 'not started yet'
  const station = t.stationsDone + 1
  const where = station > TOTAL_STATIONS ? 'all stations done' : `station ${station} of ${TOTAL_STATIONS} (${lineForStation(station).line.name})`
  return `${where} · ${met.length} words met · ${met.filter(isKnown).length} spelled from memory`
}

/** Words with the most misses so far, to practise away from the screen too. */
function trickyWords(profile: Profile) {
  return Object.values(profile.train.words)
    .filter((s) => s.misses >= 3 && !isKnown(s))
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 6)
    .map((s) => s.word.toLowerCase())
}

function formatAgo(at: number | null) {
  if (!at) return '—'
  const mins = Math.round((Date.now() - at) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.round(hours / 24)} d ago`
}

export function ParentArea({ initialTab = 'progress', onClose }: { initialTab?: ParentTab; onClose: () => void }) {
  const data = useAppData()
  const players = profilesInOrder(data)
  const [tab, setTab] = useState<ParentTab>(initialTab)
  const [selectedId, setSelectedId] = useState(data.activeProfileId ?? players[0]?.id)
  const selected = data.profiles[selectedId ?? ''] ?? players[0]

  return (
    <div className="parent">
      <header className="parent-head">
        <h1>Grown-ups</h1>
        <button className="btn" onClick={onClose}>Back to play</button>
      </header>
      {didSaveFail() && <p className="warning">This browser isn't letting TypeQuest save. Progress will be lost when the page closes — check that private browsing is off.</p>}

      <nav className="tabs">
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>Progress</button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>Settings</button>
        <button className={tab === 'players' ? 'active' : ''} onClick={() => setTab('players')}>Players ({players.length})</button>
      </nav>

      {tab !== 'players' && selected && players.length > 1 && (
        <div className="kid-chips" role="tablist" aria-label="Choose a player">
          {players.map((p) => (
            <button key={p.id} role="tab" aria-selected={p.id === selected.id} className={p.id === selected.id ? 'active' : ''} onClick={() => setSelectedId(p.id)}>
              {p.avatar} {p.name}
            </button>
          ))}
        </div>
      )}

      {tab === 'players' ? (
        <Players players={players} activeId={data.activeProfileId} />
      ) : !selected ? (
        <p className="muted">No players yet.</p>
      ) : tab === 'progress' ? (
        <ProgressView key={selected.id} profile={selected} />
      ) : (
        <SettingsView key={selected.id} profile={selected} />
      )}
    </div>
  )
}

function ProgressView({ profile }: { profile: Profile }) {
  const [letterCase, setLetterCase] = useState<LetterCase>(profile.progress.caseStage === 'lower' ? 'lower' : 'upper')
  const skills = INTRO_ORDER.map((l) => getSkill(profile.progress, l, letterCase))
  const met = skills.filter((s) => masteryState(s) !== 'new')
  const known = skills.filter((s) => masteryState(s) === 'mastered')
  const kind = letterCase === 'upper' ? 'capital' : 'small'

  return (
    <section>
      <p className="summary">
        {met.length === 0
          ? `${profile.name} hasn't started on ${kind} letters yet.`
          : `${profile.name} has met ${met.length} ${kind} letters and knows ${known.length} of them well.`}
      </p>
      <p className="summary">
        Rocket Launch: {stageSummary(profile)} · Difficulty: {DIFFICULTY[profile.settings.difficulty].label}
      </p>
      <p className="summary">
        Letters in play: {profile.progress.poolSize[letterCase]} of {INTRO_ORDER.length}
        {profile.progress.poolSize[letterCase] < INTRO_ORDER.length && ` · next to join: ${letterCase === 'lower' ? INTRO_ORDER[profile.progress.poolSize[letterCase]].toLowerCase() : INTRO_ORDER[profile.progress.poolSize[letterCase]]}`}
      </p>
      <p className="summary">Word Train: {trainSummary(profile)}</p>
      {trickyWords(profile).length > 0 && (
        <p className="muted small">Words to practise together: {trickyWords(profile).join(', ')}</p>
      )}
      <p className="muted small">"Knows it well" means found on the first try without help, on at least two different days. These are gentle guides, not test scores.</p>

      <div className="segmented">
        <button className={letterCase === 'upper' ? 'active' : ''} onClick={() => setLetterCase('upper')}>A B C</button>
        <button className={letterCase === 'lower' ? 'active' : ''} onClick={() => setLetterCase('lower')}>a b c</button>
      </div>

      <div className="letter-grid">
        {skills.map((s) => {
          const state = masteryState(s)
          return (
            <div key={s.id} className={`letter-cell state-${state}`} title={STATE_LABEL[state]}>
              <span className="letter-glyph">{letterCase === 'upper' ? s.letter : s.letter.toLowerCase()}</span>
              <span className="letter-state">{STATE_LABEL[state]}</span>
              {state !== 'new' && (
                <span className="letter-meta">
                  {s.successes} found · {Math.round(recentAccuracy(s) * 100)}% first try · {formatAgo(s.lastPracticedAt)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <h3>Recent activity</h3>
      {profile.activity.length === 0 ? (
        <p className="muted">Nothing yet.</p>
      ) : (
        <ul className="activity">
          {profile.activity.slice(0, 12).map((a, i) => (
            <li key={i}><span>{a.summary}</span><span className="muted">{formatAgo(a.at)}</span></li>
          ))}
        </ul>
      )}
    </section>
  )
}

function SettingsView({ profile }: { profile: Profile }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    updateProfileById(profile.id, (p) => ({ ...p, settings: { ...p.settings, [key]: value } }))

  return (
    <section className="settings">
      <p className="muted small">Settings for {profile.avatar} {profile.name}.</p>
      <Toggle label="Sound effects" checked={profile.settings.sound} onChange={(v) => setSetting('sound', v)} />
      <Toggle label="Spoken instructions" checked={profile.settings.speech} onChange={(v) => setSetting('speech', v)} />
      <Toggle label="Calmer visuals (less motion)" checked={profile.settings.reducedMotion} onChange={(v) => setSetting('reducedMotion', v)} />

      <div className="row difficulty-row">
        <span>Difficulty</span>
        <div className="segmented" role="radiogroup" aria-label="Difficulty">
          {(Object.keys(DIFFICULTY) as Difficulty[]).map((d) => (
            <button key={d} role="radio" aria-checked={profile.settings.difficulty === d} className={profile.settings.difficulty === d ? 'active' : ''} onClick={() => setSetting('difficulty', d)}>
              {DIFFICULTY[d].label}
            </button>
          ))}
        </div>
      </div>
      <p className="muted small">
        {DIFFICULTY[profile.settings.difficulty].description}. {profile.name} needs {cellsPerRound(profile.settings.difficulty, currentStage(profile.rewards).galaxyIndex)} letters to fuel the rocket in {currentStage(profile.rewards).galaxy.name}, and each new galaxy adds one. There are never timers or penalties.
      </p>

      <label className="row">
        <span>Suggest a break after</span>
        <select value={profile.settings.sessionLimitMin} onChange={(e) => setSetting('sessionLimitMin', Number(e.target.value))}>
          {[0, 10, 15, 20, 30].map((m) => <option key={m} value={m}>{m === 0 ? 'No limit' : `${m} minutes`}</option>)}
        </select>
      </label>

      <label className="row">
        <span>Letters shown as</span>
        <select
          value={profile.progress.caseStage}
          onChange={(e) => updateProfileById(profile.id, (p) => ({ ...p, progress: { ...p.progress, caseStage: e.target.value as CaseStage } }))}
        >
          {(Object.keys(CASE_LABEL) as CaseStage[]).map((c) => <option key={c} value={c}>{CASE_LABEL[c]}</option>)}
        </select>
      </label>
      <p className="muted small">This moves forward by itself once ten letters are known well. Change it if your child is ready sooner.</p>

      <div className="danger-zone">
        {confirmReset ? (
          <>
            <p>Clear all of {profile.name}'s letters, planets and activity? This can't be undone.</p>
            <button className="btn danger" onClick={() => { resetProgress(profile.id); setConfirmReset(false) }}>Yes, start over</button>
            <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
          </>
        ) : (
          <button className="btn" onClick={() => setConfirmReset(true)}>Reset {profile.name}'s progress…</button>
        )}
      </div>
    </section>
  )
}

type Editing = { kind: 'add' } | { kind: 'edit'; id: string } | null

function Players({ players, activeId }: { players: Profile[]; activeId: string | null }) {
  const [editing, setEditing] = useState<Editing>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (editing) {
    const player = editing.kind === 'edit' ? players.find((p) => p.id === editing.id) : undefined
    const takenAvatars = players.filter((p) => p.id !== player?.id).map((p) => p.avatar)
    return (
      <section className="panel player-editor">
        <h2>{player ? `Edit ${player.name}` : 'Add a player'}</h2>
        <PlayerForm
          initial={player && { name: player.name, avatar: player.avatar, startStage: player.startStage }}
          takenAvatars={takenAvatars}
          submitLabel={player ? 'Save' : 'Add player'}
          onCancel={() => setEditing(null)}
          onSubmit={(details) => {
            if (player) editProfile(player.id, details)
            else createProfile(details)
            setEditing(null)
          }}
        />
        {player && <p className="muted small">Changing the starting point never removes letters {player.name} has already met.</p>}
      </section>
    )
  }

  return (
    <section>
      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            <span className="player-list-avatar" aria-hidden="true">{p.avatar}</span>
            <span className="player-list-info">
              <strong>{p.name}</strong>
              <small className="muted">
                {STAGE_LABEL[p.startStage]} · {p.rewards.planets.length} {p.rewards.planets.length === 1 ? 'planet' : 'planets'}{p.id === activeId ? ' · playing now' : ''}
              </small>
            </span>
            {confirmDelete === p.id ? (
              <span className="player-list-actions">
                <span>Delete {p.name} and all their progress?</span>
                <button className="btn danger" onClick={() => { deleteProfile(p.id); setConfirmDelete(null) }}>Delete</button>
                <button className="btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </span>
            ) : (
              <span className="player-list-actions">
                <button className="btn" onClick={() => setEditing({ kind: 'edit', id: p.id })}>Edit</button>
                <button className="btn" onClick={() => setConfirmDelete(p.id)}>Delete…</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      <button className="big-btn primary add-player" onClick={() => setEditing({ kind: 'add' })}>+ Add a player</button>
      <p className="muted small">Each child gets their own letters, planets and settings. When there's more than one player, TypeQuest asks "Who's playing?" when it opens.</p>
    </section>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="row toggle">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}
