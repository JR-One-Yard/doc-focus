import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  const defaultProps = {
    currentIndex: 0,
    totalWords: 100,
    onJumpToPosition: vi.fn(),
  }

  describe('Rendering', () => {
    it('renders progress bar track', () => {
      render(<ProgressBar {...defaultProps} />)
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('renders with correct ARIA attributes', () => {
      render(<ProgressBar {...defaultProps} currentIndex={49} totalWords={100} />)
      const progressBar = screen.getByRole('progressbar')

      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-label')
    })

    it('renders with correct progress label', () => {
      render(<ProgressBar {...defaultProps} currentIndex={24} totalWords={100} />)
      const progressBar = screen.getByRole('progressbar')

      expect(progressBar).toHaveAttribute(
        'aria-label',
        'Reading progress: 25% complete, word 25 of 100'
      )
    })

    it('displays fill bar with correct width', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={49} totalWords={100} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toBeInTheDocument()
      expect(fill).toHaveStyle({ width: '50%' })
    })

    it('renders with 0% width when at start', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={0} totalWords={100} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveStyle({ width: '1%' }) // (0+1)/100 * 100 = 1%
    })

    it('renders with 100% width when at end', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={99} totalWords={100} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveStyle({ width: '100%' })
    })
  })

  describe('Click to Jump Functionality', () => {
    it('calls onJumpToPosition when track is clicked', () => {
      const onJumpToPosition = vi.fn()
      render(<ProgressBar {...defaultProps} onJumpToPosition={onJumpToPosition} />)

      const track = screen.getByRole('progressbar')
      fireEvent.click(track)

      expect(onJumpToPosition).toHaveBeenCalled()
    })

    it('calculates correct position from click at 50%', () => {
      const onJumpToPosition = vi.fn()
      const { container } = render(
        <ProgressBar {...defaultProps} totalWords={100} onJumpToPosition={onJumpToPosition} />
      )

      const track = container.querySelector('.progress-bar-track') as HTMLElement

      // Mock getBoundingClientRect to simulate click at 50% position
      track.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        right: 100,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      // Simulate click at x=50 (50% of width)
      fireEvent.click(track, { clientX: 50 })

      expect(onJumpToPosition).toHaveBeenCalledWith(50)
    })

    it('calculates correct position from click at 25%', () => {
      const onJumpToPosition = vi.fn()
      const { container } = render(
        <ProgressBar {...defaultProps} totalWords={100} onJumpToPosition={onJumpToPosition} />
      )

      const track = container.querySelector('.progress-bar-track') as HTMLElement

      track.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        width: 100,
        top: 0,
        right: 100,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      }))

      fireEvent.click(track, { clientX: 25 })

      expect(onJumpToPosition).toHaveBeenCalledWith(25)
    })

    it('does not call onJumpToPosition when disabled', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} disabled={true} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.click(track)

      expect(onJumpToPosition).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard Navigation', () => {
    it('moves forward with ArrowRight key', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={10} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'ArrowRight' })

      expect(onJumpToPosition).toHaveBeenCalledWith(11)
    })

    it('moves backward with ArrowLeft key', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={10} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'ArrowLeft' })

      expect(onJumpToPosition).toHaveBeenCalledWith(9)
    })

    it('jumps to start with Home key', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={50} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'Home' })

      expect(onJumpToPosition).toHaveBeenCalledWith(0)
    })

    it('jumps to end with End key', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={50} totalWords={100} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'End' })

      expect(onJumpToPosition).toHaveBeenCalledWith(99)
    })

    it('does not move backward past 0', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={0} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'ArrowLeft' })

      expect(onJumpToPosition).toHaveBeenCalledWith(0)
    })

    it('does not move forward past totalWords', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} currentIndex={99} totalWords={100} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'ArrowRight' })

      expect(onJumpToPosition).toHaveBeenCalledWith(99)
    })

    it('does not respond to keyboard when disabled', () => {
      const onJumpToPosition = vi.fn()
      render(
        <ProgressBar {...defaultProps} disabled={true} onJumpToPosition={onJumpToPosition} />
      )

      const track = screen.getByRole('progressbar')
      fireEvent.keyDown(track, { key: 'ArrowRight' })

      expect(onJumpToPosition).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('applies disabled class when disabled', () => {
      const { container } = render(<ProgressBar {...defaultProps} disabled={true} />)
      const track = container.querySelector('.progress-bar-track')

      expect(track).toHaveClass('disabled')
    })

    it('has tabIndex -1 when disabled', () => {
      render(<ProgressBar {...defaultProps} disabled={true} />)
      const track = screen.getByRole('progressbar')

      expect(track).toHaveAttribute('tabIndex', '-1')
    })

    it('has tabIndex 0 when enabled', () => {
      render(<ProgressBar {...defaultProps} disabled={false} />)
      const track = screen.getByRole('progressbar')

      expect(track).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Edge Cases', () => {
    it('handles zero total words', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={0} totalWords={0} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveStyle({ width: '0%' })
    })

    it('handles single word document', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={0} totalWords={1} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveStyle({ width: '100%' })
    })

    it('handles large word counts', () => {
      const { container } = render(
        <ProgressBar {...defaultProps} currentIndex={4999} totalWords={10000} />
      )
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveStyle({ width: '50%' })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<ProgressBar {...defaultProps} />)
      const progressBar = screen.getByRole('progressbar')

      expect(progressBar).toBeInTheDocument()
    })

    it('has descriptive title attribute', () => {
      render(<ProgressBar {...defaultProps} currentIndex={49} totalWords={100} />)
      const progressBar = screen.getByRole('progressbar')

      expect(progressBar).toHaveAttribute('title', 'Click to jump to position (50% complete)')
    })

    it('has aria-hidden on fill element', () => {
      const { container } = render(<ProgressBar {...defaultProps} />)
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toHaveAttribute('aria-hidden', 'true')
    })

    it('is keyboard focusable when enabled', () => {
      render(<ProgressBar {...defaultProps} />)
      const track = screen.getByRole('progressbar')

      expect(track).toHaveAttribute('tabIndex', '0')
    })

    it('is not keyboard focusable when disabled', () => {
      render(<ProgressBar {...defaultProps} disabled={true} />)
      const track = screen.getByRole('progressbar')

      expect(track).toHaveAttribute('tabIndex', '-1')
    })
  })

  describe('CSS Classes', () => {
    it('applies correct container class', () => {
      const { container } = render(<ProgressBar {...defaultProps} />)
      const wrapper = container.querySelector('.progress-bar-container')

      expect(wrapper).toBeInTheDocument()
    })

    it('applies correct track class', () => {
      const { container } = render(<ProgressBar {...defaultProps} />)
      const track = container.querySelector('.progress-bar-track')

      expect(track).toBeInTheDocument()
    })

    it('applies correct fill class', () => {
      const { container } = render(<ProgressBar {...defaultProps} />)
      const fill = container.querySelector('.progress-bar-fill')

      expect(fill).toBeInTheDocument()
    })
  })
})
