import { useEffect } from 'react'

export interface KeyboardShortcutsConfig {
  /** Toggle play/pause */
  onTogglePlayPause: () => void
  /** Navigate to previous word */
  onPrevious: () => void
  /** Navigate to next word */
  onNext: () => void
  /** Increase speed by increment */
  onIncreaseSpeed: () => void
  /** Decrease speed by increment */
  onDecreaseSpeed: () => void
  /** Close document / stop reading (optional) */
  onClose?: () => void
  /** Show keyboard shortcuts help (optional) */
  onShowHelp?: () => void
  /** Whether shortcuts are enabled (e.g., only when document is loaded) */
  enabled?: boolean
}

/**
 * Custom hook to handle keyboard shortcuts for RSVP reading controls
 *
 * Keyboard shortcuts:
 * - SPACE: Toggle play/pause
 * - LEFT ARROW: Previous word
 * - RIGHT ARROW: Next word
 * - UP ARROW: Increase speed by 25 WPM
 * - DOWN ARROW: Decrease speed by 25 WPM
 * - ESC: Close document (if onClose provided)
 * - ?: Show keyboard shortcuts help (if onShowHelp provided)
 *
 * @param config - Configuration object with callback functions
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig): void {
  const {
    onTogglePlayPause,
    onPrevious,
    onNext,
    onIncreaseSpeed,
    onDecreaseSpeed,
    onClose,
    onShowHelp,
    enabled = true,
  } = config

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      switch (event.key) {
        case ' ':
          event.preventDefault() // Prevent page scroll
          onTogglePlayPause()
          break

        case 'ArrowLeft':
          event.preventDefault()
          onPrevious()
          break

        case 'ArrowRight':
          event.preventDefault()
          onNext()
          break

        case 'ArrowUp':
          event.preventDefault() // Prevent page scroll
          onIncreaseSpeed()
          break

        case 'ArrowDown':
          event.preventDefault() // Prevent page scroll
          onDecreaseSpeed()
          break

        case 'Escape':
          if (onClose) {
            event.preventDefault()
            onClose()
          }
          break

        case '?':
          if (onShowHelp) {
            event.preventDefault()
            onShowHelp()
          }
          break

        default:
          // No action for other keys
          break
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    enabled,
    onTogglePlayPause,
    onPrevious,
    onNext,
    onIncreaseSpeed,
    onDecreaseSpeed,
    onClose,
    onShowHelp,
  ])
}
