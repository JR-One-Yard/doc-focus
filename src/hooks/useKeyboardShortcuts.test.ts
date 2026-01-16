import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'
import type { KeyboardShortcutsConfig } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  let config: KeyboardShortcutsConfig

  beforeEach(() => {
    // Create mock callback functions before each test
    config = {
      onTogglePlayPause: vi.fn(),
      onPrevious: vi.fn(),
      onNext: vi.fn(),
      onIncreaseSpeed: vi.fn(),
      onDecreaseSpeed: vi.fn(),
      onClose: vi.fn(),
      enabled: true,
    }
  })

  afterEach(() => {
    // Clear all mocks after each test
    vi.clearAllMocks()
  })

  describe('SPACE key', () => {
    it('calls onTogglePlayPause when SPACE is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event)

      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when SPACE is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('LEFT ARROW key', () => {
    it('calls onPrevious when LEFT ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      window.dispatchEvent(event)

      expect(config.onPrevious).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when LEFT ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('RIGHT ARROW key', () => {
    it('calls onNext when RIGHT ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      window.dispatchEvent(event)

      expect(config.onNext).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when RIGHT ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('UP ARROW key (P3-2)', () => {
    it('calls onIncreaseSpeed when UP ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      window.dispatchEvent(event)

      expect(config.onIncreaseSpeed).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when UP ARROW is pressed to avoid page scroll', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('calls onIncreaseSpeed multiple times when UP ARROW is pressed multiple times', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Press UP ARROW 3 times
      for (let i = 0; i < 3; i++) {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
        window.dispatchEvent(event)
      }

      expect(config.onIncreaseSpeed).toHaveBeenCalledTimes(3)
    })
  })

  describe('DOWN ARROW key (P3-2)', () => {
    it('calls onDecreaseSpeed when DOWN ARROW is pressed', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      window.dispatchEvent(event)

      expect(config.onDecreaseSpeed).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when DOWN ARROW is pressed to avoid page scroll', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('calls onDecreaseSpeed multiple times when DOWN ARROW is pressed multiple times', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Press DOWN ARROW 3 times
      for (let i = 0; i < 3; i++) {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
        window.dispatchEvent(event)
      }

      expect(config.onDecreaseSpeed).toHaveBeenCalledTimes(3)
    })
  })

  describe('ESC key', () => {
    it('calls onClose when ESC is pressed and onClose is provided', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)

      expect(config.onClose).toHaveBeenCalledTimes(1)
    })

    it('prevents default behavior when ESC is pressed and onClose is provided', () => {
      renderHook(() => useKeyboardShortcuts(config))

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not call onClose when ESC is pressed and onClose is not provided', () => {
      const configWithoutClose = { ...config, onClose: undefined }
      renderHook(() => useKeyboardShortcuts(configWithoutClose))

      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      window.dispatchEvent(event)

      // onClose is undefined, so nothing should happen
      expect(config.onClose).not.toHaveBeenCalled()
    })

    it('does not prevent default when ESC is pressed and onClose is not provided', () => {
      const configWithoutClose = { ...config, onClose: undefined }
      renderHook(() => useKeyboardShortcuts(configWithoutClose))

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })

  describe('Enabled/Disabled State', () => {
    it('does not call callbacks when enabled is false', () => {
      const disabledConfig = { ...config, enabled: false }
      renderHook(() => useKeyboardShortcuts(disabledConfig))

      // Try all keyboard shortcuts
      const keys = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape']

      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key })
        window.dispatchEvent(event)
      })

      // None of the callbacks should have been called
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()
      expect(config.onPrevious).not.toHaveBeenCalled()
      expect(config.onNext).not.toHaveBeenCalled()
      expect(config.onIncreaseSpeed).not.toHaveBeenCalled()
      expect(config.onDecreaseSpeed).not.toHaveBeenCalled()
      expect(config.onClose).not.toHaveBeenCalled()
    })

    it('defaults to enabled=true when not specified', () => {
      const configWithoutEnabled = {
        onTogglePlayPause: vi.fn(),
        onPrevious: vi.fn(),
        onNext: vi.fn(),
        onIncreaseSpeed: vi.fn(),
        onDecreaseSpeed: vi.fn(),
      }

      renderHook(() => useKeyboardShortcuts(configWithoutEnabled))

      const event = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event)

      expect(configWithoutEnabled.onTogglePlayPause).toHaveBeenCalledTimes(1)
    })

    it('re-enables shortcuts when enabled changes from false to true', () => {
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardShortcuts({ ...config, enabled }),
        { initialProps: { enabled: false } }
      )

      // Try pressing a key while disabled
      const event1 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event1)
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()

      // Re-enable
      rerender({ enabled: true })

      // Try pressing a key while enabled
      const event2 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event2)
      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(1)
    })

    it('disables shortcuts when enabled changes from true to false', () => {
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardShortcuts({ ...config, enabled }),
        { initialProps: { enabled: true } }
      )

      // Try pressing a key while enabled
      const event1 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event1)
      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(1)

      // Disable
      rerender({ enabled: false })

      // Try pressing a key while disabled
      const event2 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event2)
      // Still only 1 call (from before disabling)
      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(1)
    })
  })

  describe('Input/Textarea Element Protection', () => {
    it('does not trigger shortcuts when typing in an input element', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Create an input element and focus it
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      // Try all keyboard shortcuts while focused on input
      const keys = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape']

      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
        })
        Object.defineProperty(event, 'target', {
          value: input,
          enumerable: true,
        })
        window.dispatchEvent(event)
      })

      // None of the callbacks should have been called
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()
      expect(config.onPrevious).not.toHaveBeenCalled()
      expect(config.onNext).not.toHaveBeenCalled()
      expect(config.onIncreaseSpeed).not.toHaveBeenCalled()
      expect(config.onDecreaseSpeed).not.toHaveBeenCalled()
      expect(config.onClose).not.toHaveBeenCalled()

      // Cleanup
      document.body.removeChild(input)
    })

    it('does not trigger shortcuts when typing in a textarea element', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Create a textarea element and focus it
      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.focus()

      // Try all keyboard shortcuts while focused on textarea
      const keys = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape']

      keys.forEach((key) => {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
        })
        Object.defineProperty(event, 'target', {
          value: textarea,
          enumerable: true,
        })
        window.dispatchEvent(event)
      })

      // None of the callbacks should have been called
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()
      expect(config.onPrevious).not.toHaveBeenCalled()
      expect(config.onNext).not.toHaveBeenCalled()
      expect(config.onIncreaseSpeed).not.toHaveBeenCalled()
      expect(config.onDecreaseSpeed).not.toHaveBeenCalled()
      expect(config.onClose).not.toHaveBeenCalled()

      // Cleanup
      document.body.removeChild(textarea)
    })

    it('does not trigger shortcuts when typing in a contentEditable element', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Create a contentEditable div
      const div = document.createElement('div')
      div.contentEditable = 'true'
      document.body.appendChild(div)

      // Mock isContentEditable property (jsdom doesn't implement this properly)
      Object.defineProperty(div, 'isContentEditable', {
        value: true,
        writable: false,
      })

      // Try SPACE while focused on contentEditable
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: div,
        enumerable: true,
      })
      window.dispatchEvent(event)

      // Callback should not have been called because element is contentEditable
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()

      // Cleanup
      document.body.removeChild(div)
    })

    it('triggers shortcuts when focused on a regular div element', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Create a regular div (not contentEditable) and focus it
      const div = document.createElement('div')
      div.tabIndex = 0 // Make it focusable
      document.body.appendChild(div)
      div.focus()

      // Try SPACE while focused on div - should work
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      })
      Object.defineProperty(event, 'target', {
        value: div,
        enumerable: true,
      })
      window.dispatchEvent(event)

      // Callback should have been called since it's not an input/textarea/contentEditable
      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(1)

      // Cleanup
      document.body.removeChild(div)
    })
  })

  describe('Event Cleanup', () => {
    it('removes event listener when hook is unmounted', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useKeyboardShortcuts(config))

      // Event listener should be added
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

      const listenerFunction = addEventListenerSpy.mock.calls[0][1]

      // Unmount the hook
      unmount()

      // Event listener should be removed with the same function reference
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', listenerFunction)

      // Cleanup
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('does not trigger callbacks after unmount', () => {
      const { unmount } = renderHook(() => useKeyboardShortcuts(config))

      // Unmount the hook
      unmount()

      // Try to trigger shortcuts after unmount
      const event = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event)

      // Callbacks should not have been called
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()
    })
  })

  describe('Unhandled Keys', () => {
    it('does not call any callbacks for unhandled keys', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Try various unhandled keys
      const unhandledKeys = ['a', 'b', 'Enter', 'Tab', 'Shift', 'Control', 'Alt']

      unhandledKeys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key })
        window.dispatchEvent(event)
      })

      // None of the callbacks should have been called
      expect(config.onTogglePlayPause).not.toHaveBeenCalled()
      expect(config.onPrevious).not.toHaveBeenCalled()
      expect(config.onNext).not.toHaveBeenCalled()
      expect(config.onIncreaseSpeed).not.toHaveBeenCalled()
      expect(config.onDecreaseSpeed).not.toHaveBeenCalled()
      expect(config.onClose).not.toHaveBeenCalled()
    })
  })

  describe('Integration: All Shortcuts Working Together', () => {
    it('correctly handles a sequence of different keyboard shortcuts', () => {
      renderHook(() => useKeyboardShortcuts(config))

      // Simulate a realistic usage sequence
      const sequence = [
        { key: ' ', callback: 'onTogglePlayPause' }, // Start playing
        { key: 'ArrowUp', callback: 'onIncreaseSpeed' }, // Increase speed
        { key: 'ArrowUp', callback: 'onIncreaseSpeed' }, // Increase speed again
        { key: 'ArrowRight', callback: 'onNext' }, // Next word
        { key: 'ArrowDown', callback: 'onDecreaseSpeed' }, // Decrease speed
        { key: 'ArrowLeft', callback: 'onPrevious' }, // Previous word
        { key: ' ', callback: 'onTogglePlayPause' }, // Pause
        { key: 'Escape', callback: 'onClose' }, // Close
      ]

      sequence.forEach(({ key }) => {
        const event = new KeyboardEvent('keydown', { key })
        window.dispatchEvent(event)
      })

      // Verify each callback was called the correct number of times
      expect(config.onTogglePlayPause).toHaveBeenCalledTimes(2)
      expect(config.onIncreaseSpeed).toHaveBeenCalledTimes(2)
      expect(config.onDecreaseSpeed).toHaveBeenCalledTimes(1)
      expect(config.onNext).toHaveBeenCalledTimes(1)
      expect(config.onPrevious).toHaveBeenCalledTimes(1)
      expect(config.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Callback Updates', () => {
    it('uses updated callbacks when config changes', () => {
      const initialCallback = vi.fn()
      const updatedCallback = vi.fn()

      const { rerender } = renderHook(
        ({ onTogglePlayPause }) =>
          useKeyboardShortcuts({
            ...config,
            onTogglePlayPause,
          }),
        { initialProps: { onTogglePlayPause: initialCallback } }
      )

      // Press SPACE with initial callback
      const event1 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event1)
      expect(initialCallback).toHaveBeenCalledTimes(1)
      expect(updatedCallback).not.toHaveBeenCalled()

      // Update the callback
      rerender({ onTogglePlayPause: updatedCallback })

      // Press SPACE with updated callback
      const event2 = new KeyboardEvent('keydown', { key: ' ' })
      window.dispatchEvent(event2)
      expect(initialCallback).toHaveBeenCalledTimes(1) // Still only 1
      expect(updatedCallback).toHaveBeenCalledTimes(1) // New callback called
    })
  })
})
