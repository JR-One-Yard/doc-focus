import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'

expect.extend(toHaveNoViolations)

describe('KeyboardShortcutsHelp', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={false} onClose={onClose} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders modal when isOpen is true', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(screen.getByText('⌨️ Keyboard Shortcuts')).toBeInTheDocument()
      expect(
        screen.getByText(/FastReader is fully keyboard-accessible/i)
      ).toBeInTheDocument()
    })

    it('renders complete shortcuts table with all categories', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      // Check all category headings
      expect(screen.getByText('Playback')).toBeInTheDocument()
      expect(screen.getByText('Navigation')).toBeInTheDocument()
      expect(screen.getByText('Speed Control')).toBeInTheDocument()
      expect(screen.getByText('Other')).toBeInTheDocument()
    })

    it('renders all playback shortcuts', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(screen.getByText('Space')).toBeInTheDocument()
      expect(screen.getByText('Toggle play/pause')).toBeInTheDocument()
    })

    it('renders all navigation shortcuts', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(screen.getByText('Left Arrow')).toBeInTheDocument()
      expect(screen.getByText('Right Arrow')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('End')).toBeInTheDocument()
      expect(screen.getByText('Previous word')).toBeInTheDocument()
      expect(screen.getByText('Next word')).toBeInTheDocument()
      expect(screen.getByText('Jump to beginning')).toBeInTheDocument()
      expect(screen.getByText('Jump to end')).toBeInTheDocument()
    })

    it('renders all speed control shortcuts', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(screen.getByText('Up Arrow')).toBeInTheDocument()
      expect(screen.getByText('Down Arrow')).toBeInTheDocument()
      expect(screen.getByText('Increase speed by 25 WPM')).toBeInTheDocument()
      expect(screen.getByText('Decrease speed by 25 WPM')).toBeInTheDocument()
    })

    it('renders all other shortcuts', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(screen.getByText('Escape')).toBeInTheDocument()
      expect(screen.getByText('?')).toBeInTheDocument()
      expect(screen.getByText('Close document or dialog')).toBeInTheDocument()
      expect(screen.getByText('Show this help')).toBeInTheDocument()
    })

    it('renders the help tip note', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(
        screen.getByText(/When the progress bar is focused, you can also use arrow keys/i)
      ).toBeInTheDocument()
    })

    it('renders close buttons', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      // Close button (×) in header
      const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts help/i })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveTextContent('×')

      // "Got It" button in footer
      const gotItButton = screen.getByRole('button', { name: /got it/i })
      expect(gotItButton).toBeInTheDocument()
    })
  })

  describe('Close Behavior', () => {
    it('calls onClose when close button (×) is clicked', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts help/i })
      fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when "Got It" button is clicked', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const gotItButton = screen.getByRole('button', { name: /got it/i })
      fireEvent.click(gotItButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when clicking outside the modal (on overlay)', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const overlay = screen.getByRole('dialog').parentElement
      if (overlay) {
        fireEvent.click(overlay)
        expect(onClose).toHaveBeenCalledTimes(1)
      }
    })

    it('does not call onClose when clicking inside the modal', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const modal = screen.getByRole('dialog')
      fireEvent.click(modal)

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'keyboard-help-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'keyboard-help-description')
    })

    it('has correct heading structure', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const mainHeading = screen.getByRole('heading', { name: /keyboard shortcuts/i, level: 2 })
      expect(mainHeading).toBeInTheDocument()
      expect(mainHeading).toHaveAttribute('id', 'keyboard-help-title')

      const categoryHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(categoryHeadings).toHaveLength(4) // Playback, Navigation, Speed Control, Other
    })

    it('has proper keyboard shortcut elements', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const kbdElements = screen.getAllByRole('row')
      // Should have at least 9 rows (1 for each shortcut)
      expect(kbdElements.length).toBeGreaterThanOrEqual(9)
    })

    it('has accessible close buttons with aria-labels', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts help/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close keyboard shortcuts help')

      const gotItButton = screen.getByRole('button', { name: /got it/i })
      expect(gotItButton).toBeInTheDocument()
    })

    it('passes axe accessibility tests when open', async () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('passes axe accessibility tests when closed', async () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={false} onClose={onClose} />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Visual Structure', () => {
    it('has correct CSS classes applied', () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      expect(container.querySelector('.keyboard-help-overlay')).toBeInTheDocument()
      expect(container.querySelector('.keyboard-help-modal')).toBeInTheDocument()
      expect(container.querySelector('.keyboard-help-header')).toBeInTheDocument()
      expect(container.querySelector('.keyboard-help-content')).toBeInTheDocument()
      expect(container.querySelector('.keyboard-help-footer')).toBeInTheDocument()
    })

    it('renders keyboard shortcuts in a table structure', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const tables = screen.getAllByRole('table')
      expect(tables).toHaveLength(4) // One for each category
    })

    it('uses kbd elements for keyboard keys', () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const kbdElements = container.querySelectorAll('kbd')
      // Should have at least 9 kbd elements (one for each shortcut)
      expect(kbdElements.length).toBeGreaterThanOrEqual(9)
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid open/close toggling', () => {
      const onClose = vi.fn()
      const { rerender } = render(<KeyboardShortcutsHelp isOpen={false} onClose={onClose} />)

      // Open
      rerender(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)
      expect(screen.getByText('⌨️ Keyboard Shortcuts')).toBeInTheDocument()

      // Close
      rerender(<KeyboardShortcutsHelp isOpen={false} onClose={onClose} />)
      expect(screen.queryByText('⌨️ Keyboard Shortcuts')).not.toBeInTheDocument()

      // Open again
      rerender(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)
      expect(screen.getByText('⌨️ Keyboard Shortcuts')).toBeInTheDocument()
    })

    it('maintains stable content structure across renders', () => {
      const onClose = vi.fn()
      const { rerender } = render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const initialShortcuts = screen.getAllByRole('row').length

      rerender(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      const afterRerenderShortcuts = screen.getAllByRole('row').length
      expect(afterRerenderShortcuts).toBe(initialShortcuts)
    })

    it('handles onClose callback being undefined gracefully', () => {
      // @ts-expect-error Testing edge case where onClose might be undefined
      const { container } = render(<KeyboardShortcutsHelp isOpen={true} onClose={undefined} />)

      // Component should still render
      expect(screen.getByText('⌨️ Keyboard Shortcuts')).toBeInTheDocument()

      // Clicking close button should not crash
      const closeButton = screen.getByRole('button', { name: /close keyboard shortcuts help/i })
      expect(() => fireEvent.click(closeButton)).not.toThrow()
    })
  })

  describe('Content Accuracy', () => {
    it('displays correct shortcut key for all actions', () => {
      const onClose = vi.fn()
      render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      // Verify each shortcut key appears with its correct description
      const shortcuts = [
        { key: 'Space', description: 'Toggle play/pause' },
        { key: 'Left Arrow', description: 'Previous word' },
        { key: 'Right Arrow', description: 'Next word' },
        { key: 'Up Arrow', description: 'Increase speed by 25 WPM' },
        { key: 'Down Arrow', description: 'Decrease speed by 25 WPM' },
        { key: 'Home', description: 'Jump to beginning' },
        { key: 'End', description: 'Jump to end' },
        { key: 'Escape', description: 'Close document or dialog' },
        { key: '?', description: 'Show this help' },
      ]

      shortcuts.forEach(({ key, description }) => {
        expect(screen.getByText(key)).toBeInTheDocument()
        expect(screen.getByText(description)).toBeInTheDocument()
      })
    })

    it('groups shortcuts into correct categories', () => {
      const onClose = vi.fn()
      const { container } = render(<KeyboardShortcutsHelp isOpen={true} onClose={onClose} />)

      // Check that there are 4 sections (one per category)
      const sections = container.querySelectorAll('.keyboard-help-section')
      expect(sections).toHaveLength(4)
    })
  })
})
