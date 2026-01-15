/**
 * Core application types for FastReader
 */

/**
 * Represents a parsed document ready for RSVP display
 */
export interface ParsedDocument {
  /** Array of words extracted from the document */
  words: string[];
  /** Original file name */
  fileName: string;
  /** Total number of words in the document */
  totalWords: number;
  /** File size in bytes (optional metadata) */
  fileSize?: number;
}

/**
 * Main application state structure
 */
export interface AppState {
  /** Currently loaded document, null if no document loaded */
  currentDocument: ParsedDocument | null;
  /** Current word index (0-indexed) during playback */
  currentWordIndex: number;
  /** Whether RSVP playback is currently active */
  isPlaying: boolean;
  /** Reading speed in words per minute (WPM) */
  speed: number;
  /** Whether the app is currently parsing/loading a file */
  isLoading: boolean;
  /** Error message to display, null if no error */
  error: string | null;
}

/**
 * Props for RSVP display components
 */
export interface RSVPDisplayProps {
  /** Current word to display */
  word: string;
  /** Total number of words */
  totalWords: number;
  /** Current word index (0-indexed) */
  currentIndex: number;
}

/**
 * Props for playback control components
 */
export interface PlaybackControlProps {
  /** Whether playback is active */
  isPlaying: boolean;
  /** Callback to toggle play/pause */
  onTogglePlay: () => void;
  /** Callback to go to previous word */
  onPrevious: () => void;
  /** Callback to go to next word */
  onNext: () => void;
  /** Whether controls are disabled (e.g., no document loaded) */
  disabled?: boolean;
}

/**
 * Props for speed control components
 */
export interface SpeedControlProps {
  /** Current speed in WPM */
  speed: number;
  /** Callback when speed changes */
  onSpeedChange: (newSpeed: number) => void;
  /** Whether control is disabled */
  disabled?: boolean;
}

/**
 * Result from the useRSVPPlayback hook
 */
export interface RSVPPlaybackHook {
  /** Current word index */
  currentIndex: number;
  /** Whether playback is active */
  isPlaying: boolean;
  /** Start or resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Go to next word */
  next: () => void;
  /** Go to previous word */
  previous: () => void;
  /** Jump to specific word index */
  jumpTo: (index: number) => void;
}

/**
 * Constants for speed limits (WPM - words per minute)
 */
export const SPEED_LIMITS = {
  /** Minimum reading speed */
  MIN_WPM: 50,
  /** Maximum reading speed (scientifically validated limit) */
  MAX_WPM: 350,
  /** Speed threshold for showing warning */
  WARNING_WPM: 300,
  /** Default reading speed */
  DEFAULT_WPM: 250,
} as const;
