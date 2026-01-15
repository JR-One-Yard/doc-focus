import { describe, it, expect } from 'vitest'
import { calculateOVP, splitWordForOVP } from './ovp-calculator'

describe('calculateOVP', () => {
  it('handles empty string', () => {
    expect(calculateOVP('')).toBe(0)
  })

  it('handles single character', () => {
    expect(calculateOVP('I')).toBe(0)
  })

  it('returns position 1 for words ≤3 letters', () => {
    expect(calculateOVP('it')).toBe(1)
    expect(calculateOVP('the')).toBe(1)
    expect(calculateOVP('and')).toBe(1)
  })

  it('returns position 2 for words 4-6 letters', () => {
    expect(calculateOVP('read')).toBe(2)
    expect(calculateOVP('words')).toBe(2)
    expect(calculateOVP('faster')).toBe(2)
  })

  it('calculates ~35% for words 7-9 letters', () => {
    expect(calculateOVP('reading')).toBe(2) // floor(7 * 0.35) = 2
    expect(calculateOVP('learning')).toBe(2) // floor(8 * 0.35) = 2
    expect(calculateOVP('something')).toBe(3) // floor(9 * 0.35) = 3
  })

  it('calculates ~30% for words ≥10 letters', () => {
    expect(calculateOVP('comprehension')).toBe(3) // floor(13 * 0.30) = 3
    expect(calculateOVP('understanding')).toBe(3) // floor(13 * 0.30) = 3
    expect(calculateOVP('international')).toBe(3) // floor(13 * 0.30) = 3
  })

  it('matches examples from PROJECT-STATUS.md', () => {
    // From PROJECT-STATUS.md lines 72-80
    expect(calculateOVP('I')).toBe(0)
    expect(calculateOVP('the')).toBe(1) // 'h' is position 1
    expect(calculateOVP('read')).toBe(2) // 'a' is position 2
    expect(calculateOVP('faster')).toBe(2) // 's' is position 2
    expect(calculateOVP('reading')).toBe(2) // 'a' is position 2
    expect(calculateOVP('comprehension')).toBe(3) // 'p' is position 3
  })
})

describe('splitWordForOVP', () => {
  it('handles empty string', () => {
    const result = splitWordForOVP('')
    expect(result).toEqual({
      beforeOVP: '',
      ovpLetter: '',
      afterOVP: ''
    })
  })

  it('splits "the" correctly', () => {
    const result = splitWordForOVP('the')
    expect(result).toEqual({
      beforeOVP: 't',
      ovpLetter: 'h',
      afterOVP: 'e'
    })
  })

  it('splits "reading" correctly', () => {
    const result = splitWordForOVP('reading')
    expect(result).toEqual({
      beforeOVP: 're',
      ovpLetter: 'a',
      afterOVP: 'ding'
    })
  })

  it('splits "comprehension" correctly', () => {
    const result = splitWordForOVP('comprehension')
    expect(result).toEqual({
      beforeOVP: 'com',
      ovpLetter: 'p',
      afterOVP: 'rehension'
    })
  })

  it('handles single character word', () => {
    const result = splitWordForOVP('I')
    expect(result).toEqual({
      beforeOVP: '',
      ovpLetter: 'I',
      afterOVP: ''
    })
  })
})
