import type { SpeedControlProps } from '../types'
import { SPEED_LIMITS } from '../types'
import './SpeedControl.css'

/**
 * SpeedControl Component
 * Provides both slider and numeric input for precise speed adjustment
 * Supports WPM range: 50-350 with bidirectional sync
 */
export function SpeedControl({
  speed,
  onSpeedChange,
  disabled = false,
}: SpeedControlProps) {
  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value)
    onSpeedChange(newSpeed)
  }

  // Handle numeric input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty input for typing
    if (value === '') {
      return
    }

    const newSpeed = Number(value)

    // Validate range
    if (newSpeed >= SPEED_LIMITS.MIN_WPM && newSpeed <= SPEED_LIMITS.MAX_WPM) {
      onSpeedChange(newSpeed)
    }
  }

  // Handle input blur to enforce valid values
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value === '') {
      // Reset to current speed if empty
      e.target.value = speed.toString()
      return
    }

    const newSpeed = Number(value)

    // Clamp to valid range
    if (newSpeed < SPEED_LIMITS.MIN_WPM) {
      onSpeedChange(SPEED_LIMITS.MIN_WPM)
    } else if (newSpeed > SPEED_LIMITS.MAX_WPM) {
      onSpeedChange(SPEED_LIMITS.MAX_WPM)
    }
  }

  return (
    <div className="speed-control-container">
      <label htmlFor="speed-slider" className="speed-label">
        Speed (WPM)
      </label>

      <div className="speed-controls">
        {/* Range Slider */}
        <input
          id="speed-slider"
          type="range"
          min={SPEED_LIMITS.MIN_WPM}
          max={SPEED_LIMITS.MAX_WPM}
          step={25}
          value={speed}
          onChange={handleSliderChange}
          disabled={disabled}
          className="speed-slider"
          aria-label="Reading speed slider"
          aria-valuemin={SPEED_LIMITS.MIN_WPM}
          aria-valuemax={SPEED_LIMITS.MAX_WPM}
          aria-valuenow={speed}
          aria-valuetext={`${speed} words per minute`}
        />

        {/* Numeric Input */}
        <input
          id="speed-input"
          type="number"
          min={SPEED_LIMITS.MIN_WPM}
          max={SPEED_LIMITS.MAX_WPM}
          step={25}
          value={speed}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          className="speed-input"
          aria-label="Reading speed numeric input"
        />

        <span className="speed-unit">WPM</span>
      </div>

      {/* Speed indicators */}
      <div className="speed-indicators">
        <span className="speed-indicator-min">{SPEED_LIMITS.MIN_WPM}</span>
        <span className="speed-indicator-default">{SPEED_LIMITS.DEFAULT_WPM}</span>
        <span className="speed-indicator-max">{SPEED_LIMITS.MAX_WPM}</span>
      </div>
    </div>
  )
}
