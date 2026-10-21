import { describe, expect, it } from 'vitest'
import { codeFor } from './useKeyPresses'

describe('key codes', () => {
  it('derives the key position when Android leaves KeyboardEvent.code empty', () => {
    expect(codeFor('t', '')).toBe('KeyT')
    expect(codeFor('T', '')).toBe('KeyT')
    expect(codeFor('7', '')).toBe('Digit7')
    expect(codeFor(' ', '')).toBe('Space')
    expect(codeFor('Escape', '')).toBe('')
    expect(codeFor('a', 'KeyA')).toBe('KeyA')
  })
})
