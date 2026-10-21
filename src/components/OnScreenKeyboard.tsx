import { useEffect, useState } from 'react'

/** US QWERTY (DECISIONS D2). Each entry: [label, KeyboardEvent.code, width in key units]. */
const ROWS: [string, string, number?][][] = [
  ['1234567890'].flatMap((s) => [...s].map((c): [string, string] => [c, `Digit${c}`])),
  [...'QWERTYUIOP'].map((c): [string, string] => [c, `Key${c}`]),
  [...'ASDFGHJKL'].map((c): [string, string] => [c, `Key${c}`]),
  [...'ZXCVBNM'].map((c): [string, string] => [c, `Key${c}`]),
  [['space', 'Space', 6]],
]
const WIDEST = 10

/**
 * Where a key sits across the keyboard (0 = left edge, 1 = right edge).
 * Rows are centred, so a row of n keys starts (WIDEST - n) / 2 keys in.
 */
export function keyColumn(code: string): number {
  for (const row of ROWS) {
    const i = row.findIndex(([, c]) => c === code)
    if (i >= 0) return ((WIDEST - row.length) / 2 + i + 0.5) / WIDEST
  }
  return 0.5
}

interface Props {
  /** Physical key code of the target, e.g. "KeyB". */
  target?: string | null
  /** 0 = no help, 1 = glow + ring, 2 = glow + ring + bouncing arrow. */
  hint?: number
  showDigits?: boolean
  /** Bump `id` to flash a key; `kind` picks the style. */
  flash?: { code: string; kind: 'press' | 'wrong'; id: number } | null
}

export function OnScreenKeyboard({ target, hint = 0, showDigits = false, flash }: Props) {
  const [flashed, setFlashed] = useState<Props['flash']>(null)

  useEffect(() => {
    if (!flash) return
    setFlashed(flash)
    const t = setTimeout(() => setFlashed((f) => (f?.id === flash.id ? null : f)), 450)
    return () => clearTimeout(t)
  }, [flash])

  const rows = showDigits ? ROWS : ROWS.slice(1)

  return (
    <div className="osk" aria-hidden="true">
      {rows.map((row, r) => (
        <div className="osk-row" key={r}>
          {row.map(([label, code, width]) => {
            const isTarget = code === target && hint > 0
            const cls = [
              'osk-key',
              width ? 'osk-space' : '',
              isTarget ? 'osk-target' : '',
              isTarget && hint >= 2 ? 'osk-strong' : '',
              flashed?.code === code ? `osk-flash-${flashed.kind}` : '',
            ].join(' ')
            return (
              <div key={code} className={cls} style={width ? { width: `calc(var(--key) * ${width})` } : undefined}>
                {isTarget && hint >= 2 && <span className="osk-arrow">▼</span>}
                {label === 'space' ? '' : label}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
