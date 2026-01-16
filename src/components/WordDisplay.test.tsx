import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WordDisplay } from './WordDisplay'

describe('WordDisplay', () => {
  it('should render empty display for empty string', () => {
    render(<WordDisplay word="" />)
    const display = screen.getByTestId('word-display-empty')
    expect(display).toBeDefined()
  })

  it('should render word with OVP highlighting for 3-letter word', () => {
    render(<WordDisplay word="the" />)

    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "the" -> position 1 (0-indexed) -> "t|h|e"
    expect(before.textContent).toBe('t')
    expect(ovp.textContent).toBe('h')
    expect(after.textContent).toBe('e')
  })

  it('should render word with OVP highlighting for 6-letter word', () => {
    render(<WordDisplay word="faster" />)

    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "faster" -> position 2 (0-indexed) -> "fa|s|ter"
    expect(before.textContent).toBe('fa')
    expect(ovp.textContent).toBe('s')
    expect(after.textContent).toBe('ter')
  })

  it('should render word with OVP highlighting for 7-letter word', () => {
    render(<WordDisplay word="reading" />)

    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "reading" -> position 2 (0-indexed, Math.floor(7 * 0.35) = 2) -> "re|a|ding"
    expect(before.textContent).toBe('re')
    expect(ovp.textContent).toBe('a')
    expect(after.textContent).toBe('ding')
  })

  it('should render word with OVP highlighting for 13-letter word', () => {
    render(<WordDisplay word="comprehension" />)

    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "comprehension" -> position 3 (0-indexed, Math.floor(13 * 0.30) = 3) -> "com|p|rehension"
    expect(before.textContent).toBe('com')
    expect(ovp.textContent).toBe('p')
    expect(after.textContent).toBe('rehension')
  })

  it('should render single character word', () => {
    render(<WordDisplay word="I" />)

    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "I" -> position 0 (capped) -> "|I|"
    expect(before.textContent).toBe('')
    expect(ovp.textContent).toBe('I')
    expect(after.textContent).toBe('')
  })

  it('should handle word with punctuation', () => {
    render(<WordDisplay word="hello," />)

    const display = screen.getByTestId('word-display')
    expect(display).toBeDefined()

    // Verify the whole word is displayed (punctuation preserved)
    const before = screen.getByTestId('word-before')
    const ovp = screen.getByTestId('word-ovp')
    const after = screen.getByTestId('word-after')

    // "hello," -> position 2 (0-indexed) -> "he|l|lo,"
    expect(before.textContent).toBe('he')
    expect(ovp.textContent).toBe('l')
    expect(after.textContent).toBe('lo,')
  })

  it('should render whitespace-only string as empty', () => {
    render(<WordDisplay word="   " />)
    const display = screen.getByTestId('word-display-empty')
    expect(display).toBeDefined()
  })
})
