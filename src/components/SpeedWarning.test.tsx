import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpeedWarning } from './SpeedWarning'

describe('SpeedWarning', () => {
  describe('Rendering', () => {
    it('does not render when speed is at or below 300 WPM', () => {
      const { container } = render(<SpeedWarning speed={300} />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render when speed is below threshold', () => {
      const { container } = render(<SpeedWarning speed={250} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders warning modal when speed exceeds 300 WPM', () => {
      render(<SpeedWarning speed={325} />)

      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
      expect(
        screen.getByText(/At speeds above 300 WPM, comprehension may decrease significantly/i)
      ).toBeInTheDocument()
    })

    it('renders complete warning content with all sections', () => {
      render(<SpeedWarning speed={325} />)

      // Check heading
      expect(screen.getByRole('heading', { name: /high speed warning/i })).toBeInTheDocument()

      // Check "best for" section
      expect(screen.getByText('This speed is best for:')).toBeInTheDocument()
      expect(screen.getByText('Skimming emails and routine documents')).toBeInTheDocument()
      expect(screen.getByText('Re-reading familiar material')).toBeInTheDocument()
      expect(screen.getByText('Initial review before deep reading')).toBeInTheDocument()

      // Check "not recommended for" section
      expect(screen.getByText('Not recommended for:')).toBeInTheDocument()
      expect(screen.getByText('Learning new material')).toBeInTheDocument()
      expect(screen.getByText('Technical documentation')).toBeInTheDocument()
      expect(screen.getByText('Content requiring retention')).toBeInTheDocument()
    })

    it('renders both dismiss buttons', () => {
      render(<SpeedWarning speed={325} />)

      // Close button (X)
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveTextContent('×')

      // I Understand button
      const understandButton = screen.getByRole('button', { name: /i understand/i })
      expect(understandButton).toBeInTheDocument()
    })
  })

  describe('Dismissal Behavior', () => {
    it('dismisses warning when close button (×) is clicked', () => {
      const { container } = render(<SpeedWarning speed={325} />)

      // Warning should be visible
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()

      // Click close button
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      // Warning should be hidden
      expect(container.firstChild).toBeNull()
    })

    it('dismisses warning when "I Understand" button is clicked', () => {
      const { container } = render(<SpeedWarning speed={325} />)

      // Warning should be visible
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()

      // Click I Understand button
      const understandButton = screen.getByRole('button', { name: /i understand/i })
      fireEvent.click(understandButton)

      // Warning should be hidden
      expect(container.firstChild).toBeNull()
    })

    it('calls onDismiss callback when close button is clicked', () => {
      const onDismiss = vi.fn()
      render(<SpeedWarning speed={325} onDismiss={onDismiss} />)

      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('calls onDismiss callback when I Understand button is clicked', () => {
      const onDismiss = vi.fn()
      render(<SpeedWarning speed={325} onDismiss={onDismiss} />)

      const understandButton = screen.getByRole('button', { name: /i understand/i })
      fireEvent.click(understandButton)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('does not call onDismiss if callback is not provided', () => {
      // Should not throw error when onDismiss is undefined
      render(<SpeedWarning speed={325} />)

      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      expect(() => fireEvent.click(closeButton)).not.toThrow()
    })
  })

  describe('Re-appearance Behavior', () => {
    it('reappears when speed increases after dismissal', () => {
      const { rerender } = render(<SpeedWarning speed={325} />)

      // Dismiss the warning
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      // Warning should be hidden
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()

      // Increase speed
      rerender(<SpeedWarning speed={340} />)

      // Warning should reappear
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })

    it('does not reappear when speed stays the same after dismissal', () => {
      const { rerender } = render(<SpeedWarning speed={325} />)

      // Dismiss the warning
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      // Warning should be hidden
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()

      // Re-render with same speed
      rerender(<SpeedWarning speed={325} />)

      // Warning should stay hidden
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()
    })

    it('does not reappear when speed decreases after dismissal', () => {
      const { rerender } = render(<SpeedWarning speed={325} />)

      // Dismiss the warning
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      // Warning should be hidden
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()

      // Decrease speed (but still above 300)
      rerender(<SpeedWarning speed={310} />)

      // Warning should stay hidden
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()
    })

    it('resets dismissed state when speed drops below 300 WPM', () => {
      const { rerender } = render(<SpeedWarning speed={325} />)

      // Dismiss the warning
      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      fireEvent.click(closeButton)

      // Drop speed below threshold
      rerender(<SpeedWarning speed={250} />)

      // Warning should be hidden (below threshold)
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()

      // Increase speed above threshold again
      rerender(<SpeedWarning speed={325} />)

      // Warning should reappear (state was reset)
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })

    it('shows warning immediately when speed jumps from below to above threshold', () => {
      const { rerender } = render(<SpeedWarning speed={250} />)

      // No warning initially
      expect(screen.queryByText('⚠️ High Speed Warning')).not.toBeInTheDocument()

      // Speed jumps above threshold
      rerender(<SpeedWarning speed={325} />)

      // Warning should appear
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })
  })

  describe('Threshold Behavior', () => {
    it('does not show warning at exactly 300 WPM', () => {
      const { container } = render(<SpeedWarning speed={300} />)
      expect(container.firstChild).toBeNull()
    })

    it('shows warning at 301 WPM (just above threshold)', () => {
      render(<SpeedWarning speed={301} />)
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })

    it('does not show warning at 299 WPM (just below threshold)', () => {
      const { container } = render(<SpeedWarning speed={299} />)
      expect(container.firstChild).toBeNull()
    })

    it('shows warning at very high speeds (350 WPM)', () => {
      render(<SpeedWarning speed={350} />)
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible heading structure', () => {
      render(<SpeedWarning speed={325} />)

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('⚠️ High Speed Warning')
    })

    it('close button has aria-label for screen readers', () => {
      render(<SpeedWarning speed={325} />)

      const closeButton = screen.getByRole('button', { name: /dismiss warning/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss warning')
    })

    it('I Understand button is keyboard accessible', () => {
      render(<SpeedWarning speed={325} />)

      const understandButton = screen.getByRole('button', { name: /i understand/i })
      expect(understandButton).toHaveAttribute('class', 'dismiss-button')
      // Buttons are inherently keyboard accessible (tabbable)
    })

    it('applies proper CSS classes for styling', () => {
      const { container } = render(<SpeedWarning speed={325} />)

      expect(container.querySelector('.speed-warning-overlay')).toBeInTheDocument()
      expect(container.querySelector('.speed-warning-modal')).toBeInTheDocument()
      expect(container.querySelector('.speed-warning-header')).toBeInTheDocument()
      expect(container.querySelector('.speed-warning-content')).toBeInTheDocument()
      expect(container.querySelector('.speed-warning-footer')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles very low speed values (0 WPM)', () => {
      const { container } = render(<SpeedWarning speed={0} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles negative speed values', () => {
      const { container } = render(<SpeedWarning speed={-50} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles maximum recommended speed (350 WPM)', () => {
      render(<SpeedWarning speed={350} />)
      expect(screen.getByText('⚠️ High Speed Warning')).toBeInTheDocument()
    })

    it('renders modal structure correctly', () => {
      render(<SpeedWarning speed={325} />)

      // Check modal contains overlay
      const overlay = screen.getByText('⚠️ High Speed Warning').closest('.speed-warning-overlay')
      expect(overlay).toBeInTheDocument()

      // Check modal contains content sections
      const modal = overlay?.querySelector('.speed-warning-modal')
      expect(modal).toBeInTheDocument()
      expect(modal?.querySelector('.speed-warning-header')).toBeInTheDocument()
      expect(modal?.querySelector('.speed-warning-content')).toBeInTheDocument()
      expect(modal?.querySelector('.speed-warning-footer')).toBeInTheDocument()
    })
  })
})
