import { describe, it, expect } from 'vitest'
import {
  wpmToMilliseconds,
  millisecondsToWPM,
  isValidWPM,
  shouldShowSpeedWarning,
  estimateReadingTime,
  formatReadingTime,
  MIN_WPM,
  MAX_WPM,
  WARNING_WPM
} from './speed-timer'

describe('wpmToMilliseconds', () => {
  it('converts 300 WPM to 200ms', () => {
    expect(wpmToMilliseconds(300)).toBe(200)
  })

  it('converts 200 WPM to 300ms', () => {
    expect(wpmToMilliseconds(200)).toBe(300)
  })

  it('converts 350 WPM to ~171ms', () => {
    expect(wpmToMilliseconds(350)).toBeCloseTo(171, 0)
  })

  it('clamps to MAX_WPM (350) when given higher value', () => {
    expect(wpmToMilliseconds(500)).toBe(wpmToMilliseconds(MAX_WPM))
  })

  it('clamps to MIN_WPM (50) when given lower value', () => {
    expect(wpmToMilliseconds(10)).toBe(wpmToMilliseconds(MIN_WPM))
  })
})

describe('millisecondsToWPM', () => {
  it('converts 200ms to 300 WPM', () => {
    expect(millisecondsToWPM(200)).toBe(300)
  })

  it('converts 300ms to 200 WPM', () => {
    expect(millisecondsToWPM(300)).toBe(200)
  })

  it('handles zero ms', () => {
    expect(millisecondsToWPM(0)).toBe(MAX_WPM)
  })

  it('handles negative ms', () => {
    expect(millisecondsToWPM(-100)).toBe(MAX_WPM)
  })

  it('is inverse of wpmToMilliseconds', () => {
    const wpm = 250
    const ms = wpmToMilliseconds(wpm)
    expect(millisecondsToWPM(ms)).toBeCloseTo(wpm, 0)
  })
})

describe('isValidWPM', () => {
  it('returns true for valid WPM values', () => {
    expect(isValidWPM(50)).toBe(true)
    expect(isValidWPM(200)).toBe(true)
    expect(isValidWPM(350)).toBe(true)
  })

  it('returns false for WPM below MIN_WPM', () => {
    expect(isValidWPM(49)).toBe(false)
    expect(isValidWPM(0)).toBe(false)
    expect(isValidWPM(-10)).toBe(false)
  })

  it('returns false for WPM above MAX_WPM', () => {
    expect(isValidWPM(351)).toBe(false)
    expect(isValidWPM(500)).toBe(false)
  })
})

describe('shouldShowSpeedWarning', () => {
  it('returns false for speeds ≤300 WPM', () => {
    expect(shouldShowSpeedWarning(200)).toBe(false)
    expect(shouldShowSpeedWarning(300)).toBe(false)
  })

  it('returns true for speeds >300 WPM', () => {
    expect(shouldShowSpeedWarning(301)).toBe(true)
    expect(shouldShowSpeedWarning(350)).toBe(true)
  })
})

describe('estimateReadingTime', () => {
  it('calculates correct reading time for 300 WPM', () => {
    // 1500 words at 300 WPM = 5 minutes = 300 seconds
    expect(estimateReadingTime(1500, 300)).toBe(300)
  })

  it('calculates correct reading time for 200 WPM', () => {
    // 1000 words at 200 WPM = 5 minutes = 300 seconds
    expect(estimateReadingTime(1000, 200)).toBe(300)
  })

  it('handles zero word count', () => {
    expect(estimateReadingTime(0, 300)).toBe(0)
  })

  it('handles zero WPM', () => {
    expect(estimateReadingTime(100, 0)).toBe(0)
  })

  it('rounds up to nearest second', () => {
    // 50 words at 300 WPM = 10 seconds
    expect(estimateReadingTime(50, 300)).toBe(10)
  })
})

describe('formatReadingTime', () => {
  it('formats seconds only', () => {
    expect(formatReadingTime(45)).toBe('45s')
    expect(formatReadingTime(30)).toBe('30s')
  })

  it('formats minutes only', () => {
    expect(formatReadingTime(120)).toBe('2m')
    expect(formatReadingTime(300)).toBe('5m')
  })

  it('formats minutes and seconds', () => {
    expect(formatReadingTime(90)).toBe('1m 30s')
    expect(formatReadingTime(330)).toBe('5m 30s')
  })

  it('formats hours and minutes', () => {
    expect(formatReadingTime(3600)).toBe('1h')
    expect(formatReadingTime(4500)).toBe('1h 15m')
    expect(formatReadingTime(7200)).toBe('2h')
  })

  it('handles zero seconds', () => {
    expect(formatReadingTime(0)).toBe('0s')
  })
})
