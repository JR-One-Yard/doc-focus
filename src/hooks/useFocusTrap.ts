import { useEffect, useRef } from 'react'

/**
 * useFocusTrap Hook
 *
 * Traps keyboard focus within a container element (e.g., modal dialog).
 * This ensures keyboard users cannot tab outside the modal while it's open.
 *
 * Usage:
 * ```tsx
 * const modalRef = useFocusTrap<HTMLDivElement>(isOpen)
 * return <div ref={modalRef}>...</div>
 * ```
 *
 * @param isActive - Whether the focus trap should be active
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the element that had focus before the modal opened
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ')

      return Array.from(container.querySelectorAll(focusableSelectors))
    }

    // Focus the first focusable element when modal opens
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Handle Tab key to trap focus within modal
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement as HTMLElement

      // Shift + Tab: Move focus to last element if on first element
      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      }
      // Tab: Move focus to first element if on last element
      else {
        if (activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown)

    // Cleanup: Remove listener and restore focus when modal closes
    return () => {
      container.removeEventListener('keydown', handleKeyDown)

      // Restore focus to the element that had focus before modal opened
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}
