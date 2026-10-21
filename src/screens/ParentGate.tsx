import { useMemo, useState } from 'react'

/** A typed sum keeps pre-readers out of the parent area (DECISIONS D6). */
export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [a, b] = useMemo(() => [6 + Math.floor(Math.random() * 7), 3 + Math.floor(Math.random() * 7)], [])
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)

  const press = (d: string) => {
    setWrong(false)
    const next = (answer + d).slice(0, 3)
    setAnswer(next)
    if (Number(next) === a + b) onPass()
    else if (next.length >= String(a + b).length) {
      setWrong(true)
      setTimeout(() => setAnswer(''), 500)
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Grown-ups only">
      <div className="panel gate">
        <h2>Grown-ups only</h2>
        <p>What is {a} + {b}?</p>
        <div className={`gate-answer ${wrong ? 'shake' : ''}`}>{answer || ' '}</div>
        <div className="numpad">
          {[...'123456789'].map((d) => (
            <button key={d} onClick={() => press(d)}>{d}</button>
          ))}
          <button className="numpad-cancel" onClick={onCancel}>Back</button>
          <button onClick={() => press('0')}>0</button>
          <button onClick={() => setAnswer('')}>Clear</button>
        </div>
      </div>
    </div>
  )
}
