/**
 * LoadingSpinner Component Tests
 *
 * Tests for loading spinner component including:
 * - Rendering and display
 * - File name display
 * - Cancel button functionality
 * - Accessibility features
 * - ARIA attributes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<LoadingSpinner fileName="test.txt" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('displays the parsing message with file name', () => {
      render(<LoadingSpinner fileName="document.pdf" />);

      // Check for the visible message (not screen reader text)
      const message = screen.getByText((content, element) => {
        return element?.className === 'loading-spinner__message' && /Parsing/i.test(content);
      });
      expect(message).toBeInTheDocument();
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('renders the animated spinner', () => {
      const { container } = render(<LoadingSpinner fileName="test.txt" />);

      const spinner = container.querySelector('.spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('displays different file names correctly', () => {
      const { rerender } = render(<LoadingSpinner fileName="file1.txt" />);
      expect(screen.getByText('file1.txt')).toBeInTheDocument();

      rerender(<LoadingSpinner fileName="another-document.docx" />);
      expect(screen.getByText('another-document.docx')).toBeInTheDocument();
    });
  });

  describe('Cancel Button', () => {
    it('renders cancel button when onCancel is provided', () => {
      const onCancel = vi.fn();
      render(<LoadingSpinner fileName="test.txt" onCancel={onCancel} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('does not render cancel button when onCancel is not provided', () => {
      render(<LoadingSpinner fileName="test.txt" />);

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(<LoadingSpinner fileName="test.txt" onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel only once per click', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(<LoadingSpinner fileName="test.txt" onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('has role="status" for screen readers', () => {
      render(<LoadingSpinner fileName="test.txt" />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
    });

    it('has aria-live="polite" attribute', () => {
      render(<LoadingSpinner fileName="test.txt" />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('has aria-busy="true" attribute', () => {
      render(<LoadingSpinner fileName="test.txt" />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-busy', 'true');
    });

    it('provides screen reader announcement text', () => {
      render(<LoadingSpinner fileName="document.pdf" />);

      // Check for screen reader text
      const srText = screen.getByText(/Parsing file document.pdf. Please wait./i);
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('cancel button has aria-label', () => {
      const onCancel = vi.fn();
      render(<LoadingSpinner fileName="test.txt" onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel file parsing/i });
      expect(cancelButton).toHaveAttribute('aria-label', 'Cancel file parsing');
    });

    it('spinner icon is hidden from screen readers', () => {
      const { container } = render(<LoadingSpinner fileName="test.txt" />);

      const spinnerIcon = container.querySelector('.loading-spinner__icon');
      expect(spinnerIcon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to container', () => {
      const { container } = render(<LoadingSpinner fileName="test.txt" />);

      expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
      expect(container.querySelector('.loading-spinner__container')).toBeInTheDocument();
    });

    it('applies correct CSS classes to spinner', () => {
      const { container } = render(<LoadingSpinner fileName="test.txt" />);

      expect(container.querySelector('.spinner')).toBeInTheDocument();
    });

    it('applies correct CSS classes to message', () => {
      const { container } = render(<LoadingSpinner fileName="test.txt" />);

      expect(container.querySelector('.loading-spinner__message')).toBeInTheDocument();
      expect(container.querySelector('.loading-spinner__filename')).toBeInTheDocument();
    });

    it('applies correct CSS class to cancel button', () => {
      const onCancel = vi.fn();
      const { container } = render(<LoadingSpinner fileName="test.txt" onCancel={onCancel} />);

      expect(container.querySelector('.loading-spinner__cancel')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty file name', () => {
      render(<LoadingSpinner fileName="" />);

      // Check for the visible message (not screen reader text)
      const message = screen.getByText((content, element) => {
        return element?.className === 'loading-spinner__message' && /Parsing/i.test(content);
      });
      expect(message).toBeInTheDocument();
    });

    it('handles very long file names', () => {
      const longFileName = 'this-is-a-very-long-file-name-that-might-cause-layout-issues-in-the-ui.txt';
      render(<LoadingSpinner fileName={longFileName} />);

      expect(screen.getByText(longFileName)).toBeInTheDocument();
    });

    it('handles file names with special characters', () => {
      const specialFileName = 'file-with-special-chars_@#$%.pdf';
      render(<LoadingSpinner fileName={specialFileName} />);

      expect(screen.getByText(specialFileName)).toBeInTheDocument();
    });

    it('handles unicode file names', () => {
      const unicodeFileName = '文档.txt';
      render(<LoadingSpinner fileName={unicodeFileName} />);

      expect(screen.getByText(unicodeFileName)).toBeInTheDocument();
    });
  });
});
