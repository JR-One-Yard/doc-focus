import { describe, it, expect } from 'vitest'
import {
  parseTextToWords,
  cleanText,
  countWords,
  calculateProgress,
  progressToIndex,
  validateText,
  stripPunctuation
} from './text-parser'

describe('parseTextToWords', () => {
  it('parses simple sentence', () => {
    const result = parseTextToWords('Hello world test')
    expect(result).toEqual(['Hello', 'world', 'test'])
  })

  it('preserves punctuation with words', () => {
    const result = parseTextToWords('Hello, world! This is a test.')
    expect(result).toEqual(['Hello,', 'world!', 'This', 'is', 'a', 'test.'])
  })

  it('handles empty string', () => {
    expect(parseTextToWords('')).toEqual([])
  })

  it('handles whitespace-only string', () => {
    expect(parseTextToWords('   \n\t  ')).toEqual([])
  })

  it('handles multiple spaces', () => {
    const result = parseTextToWords('Hello    world')
    expect(result).toEqual(['Hello', 'world'])
  })

  it('handles newlines', () => {
    const result = parseTextToWords('Hello\nworld\ntest')
    expect(result).toEqual(['Hello', 'world', 'test'])
  })

  it('handles contractions', () => {
    const result = parseTextToWords("don't can't won't")
    expect(result).toEqual(["don't", "can't", "won't"])
  })

  it('handles hyphenated words', () => {
    const result = parseTextToWords('speed-reading self-improvement')
    expect(result).toEqual(['speed-reading', 'self-improvement'])
  })
})

describe('cleanText', () => {
  it('normalizes line endings', () => {
    expect(cleanText('Hello\r\nworld')).toBe('Hello world')
    expect(cleanText('Hello\rworld')).toBe('Hello world')
  })

  it('collapses multiple spaces', () => {
    expect(cleanText('Hello    world')).toBe('Hello world')
  })

  it('trims leading and trailing whitespace', () => {
    expect(cleanText('  Hello world  ')).toBe('Hello world')
  })

  it('handles empty string', () => {
    expect(cleanText('')).toBe('')
  })

  it('handles mixed whitespace', () => {
    const input = '  Hello\n\n  world  \t  test  '
    const output = cleanText(input)
    expect(output).toBe('Hello world test')
  })
})

describe('countWords', () => {
  it('counts words correctly', () => {
    expect(countWords('Hello world')).toBe(2)
    expect(countWords('This is a test sentence')).toBe(5)
  })

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0)
  })

  it('returns 0 for whitespace-only', () => {
    expect(countWords('   \n\t  ')).toBe(0)
  })

  it('counts words with punctuation', () => {
    expect(countWords('Hello, world! How are you?')).toBe(5)
  })
})

describe('calculateProgress', () => {
  it('calculates 0% for first word', () => {
    expect(calculateProgress(0, 100)).toBe(1) // (0+1)/100 * 100 = 1%
  })

  it('calculates 50% for middle word', () => {
    expect(calculateProgress(49, 100)).toBe(50) // (49+1)/100 * 100 = 50%
  })

  it('calculates 100% for last word', () => {
    expect(calculateProgress(99, 100)).toBe(100) // (99+1)/100 * 100 = 100%
  })

  it('handles zero total words', () => {
    expect(calculateProgress(0, 0)).toBe(0)
  })

  it('clamps to 100%', () => {
    expect(calculateProgress(100, 50)).toBe(100)
  })

  it('clamps to 0%', () => {
    expect(calculateProgress(-10, 100)).toBe(0)
  })
})

describe('progressToIndex', () => {
  it('converts 0% to first word', () => {
    expect(progressToIndex(0, 100)).toBe(0)
  })

  it('converts 50% to middle word', () => {
    expect(progressToIndex(50, 100)).toBe(50)
  })

  it('converts 100% to last word', () => {
    expect(progressToIndex(100, 100)).toBe(100)
  })

  it('handles zero total words', () => {
    expect(progressToIndex(50, 0)).toBe(0)
  })

  it('clamps percentage to 0-100 range', () => {
    expect(progressToIndex(-10, 100)).toBe(0)
    expect(progressToIndex(150, 100)).toBe(100)
  })

  it('is approximately inverse of calculateProgress', () => {
    const totalWords = 1000
    const index = 500
    const progress = calculateProgress(index, totalWords)
    const backToIndex = progressToIndex(progress, totalWords)
    expect(backToIndex).toBeCloseTo(index, -1) // Within 10 words
  })
})

describe('validateText', () => {
  it('validates normal text', () => {
    const result = validateText('Hello world')
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('rejects empty string', () => {
    const result = validateText('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('rejects whitespace-only', () => {
    const result = validateText('   \n\t  ')
    expect(result.isValid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('warns about single word', () => {
    const result = validateText('Hello')
    expect(result.isValid).toBe(true)
    expect(result.error).toContain('one word')
  })

  it('validates multi-word text', () => {
    const result = validateText('This is a longer text with multiple words.')
    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })
})

describe('stripPunctuation', () => {
  it('removes leading and trailing punctuation', () => {
    expect(stripPunctuation('hello,')).toBe('hello')
    expect(stripPunctuation(',world')).toBe('world')
    expect(stripPunctuation('"test"')).toBe('test')
  })

  it('preserves internal punctuation', () => {
    expect(stripPunctuation("don't")).toBe("don't")
    expect(stripPunctuation('self-improvement')).toBe('self-improvement')
  })

  it('handles word with no punctuation', () => {
    expect(stripPunctuation('hello')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(stripPunctuation('')).toBe('')
  })

  it('handles punctuation-only', () => {
    expect(stripPunctuation('...')).toBe('')
  })
})
