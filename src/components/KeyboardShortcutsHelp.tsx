import { useFocusTrap } from '../hooks/useFocusTrap'
import './KeyboardShortcutsHelp.css'

export interface KeyboardShortcutsHelpProps {
  /** Whether the help modal is visible */
  isOpen: boolean
  /** Callback when user closes the help modal */
  onClose: () => void
}

interface Shortcut {
  key: string
  description: string
  category: 'playback' | 'navigation' | 'speed' | 'other'
}

const KEYBOARD_SHORTCUTS: Shortcut[] = [
  { key: 'Space', description: 'Toggle play/pause', category: 'playback' },
  { key: 'Left Arrow', description: 'Previous word', category: 'navigation' },
  { key: 'Right Arrow', description: 'Next word', category: 'navigation' },
  { key: 'Home', description: 'Jump to beginning', category: 'navigation' },
  { key: 'End', description: 'Jump to end', category: 'navigation' },
  { key: 'Up Arrow', description: 'Increase speed by 25 WPM', category: 'speed' },
  { key: 'Down Arrow', description: 'Decrease speed by 25 WPM', category: 'speed' },
  { key: 'Escape', description: 'Close document or dialog', category: 'other' },
  { key: '?', description: 'Show this help', category: 'other' },
]

const CATEGORY_LABELS = {
  playback: 'Playback',
  navigation: 'Navigation',
  speed: 'Speed Control',
  other: 'Other',
}

/**
 * KeyboardShortcutsHelp component
 *
 * Displays a modal dialog showing all available keyboard shortcuts
 * Helps users discover keyboard navigation features
 *
 * Spec: specs/user-interface.md (Keyboard Navigation, line 124)
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  // Focus trap to keep keyboard focus within modal
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen)

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  // Group shortcuts by category
  const categories = ['playback', 'navigation', 'speed', 'other'] as const
  const groupedShortcuts = categories.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    shortcuts: KEYBOARD_SHORTCUTS.filter((s) => s.category === category),
  }))

  return (
    <div className="keyboard-help-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="keyboard-help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
        aria-describedby="keyboard-help-description"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="keyboard-help-header">
          <h2 id="keyboard-help-title">⌨️ Keyboard Shortcuts</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts help"
          >
            ×
          </button>
        </div>

        <div className="keyboard-help-content" id="keyboard-help-description">
          <p className="keyboard-help-intro">
            FastReader is fully keyboard-accessible. Use these shortcuts for hands-free reading:
          </p>

          {groupedShortcuts.map(({ category, label, shortcuts }) => (
            <div key={category} className="keyboard-help-section">
              <h3 className="keyboard-help-section-title">{label}</h3>
              <table className="keyboard-shortcuts-table">
                <tbody>
                  {shortcuts.map(({ key, description }) => (
                    <tr key={key}>
                      <td className="keyboard-key">
                        <kbd>{key}</kbd>
                      </td>
                      <td className="keyboard-description">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="keyboard-help-note">
            <strong>Tip:</strong> When the progress bar is focused, you can also use arrow keys and Home/End to navigate.
          </div>
        </div>

        <div className="keyboard-help-footer">
          <button className="close-action-button" onClick={onClose}>
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
