/**
 * Tests for ErrorMessage Component
 *
 * Tests error display, retry action, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  describe('rendering', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="Test error message" onRetry={vi.fn()} />);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should render default title', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(
        <ErrorMessage message="Test error" onRetry={vi.fn()} title="Upload Failed" />
      );

      expect(screen.getByText('Upload Failed')).toBeInTheDocument();
    });

    it('should render retry button by default', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('should hide retry button when showRetry is false', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} showRetry={false} />);

      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('should render error icon', () => {
      const { container } = render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const icon = container.querySelector('.error-message__icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent('⚠️');
    });
  });

  describe('accessibility', () => {
    it('should have alert role', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-live="assertive"', () => {
      const { container } = render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should hide decorative icon from screen readers', () => {
      const { container } = render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const icon = container.querySelector('.error-message__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have ARIA label on retry button', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const button = screen.getByRole('button', { name: /try again with a different file/i });
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('interactions', () => {
    it('should call onRetry when retry button is clicked', async () => {
      const onRetry = vi.fn();
      const user = userEvent.setup();

      render(<ErrorMessage message="Test error" onRetry={onRetry} />);

      const button = screen.getByRole('button', { name: /try again/i });
      await user.click(button);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry only once per click', async () => {
      const onRetry = vi.fn();
      const user = userEvent.setup();

      render(<ErrorMessage message="Test error" onRetry={onRetry} />);

      const button = screen.getByRole('button', { name: /try again/i });
      await user.click(button);
      await user.click(button);

      expect(onRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('error message content', () => {
    it('should display file type error message', () => {
      render(
        <ErrorMessage
          message="Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file."
          onRetry={vi.fn()}
        />
      );

      expect(
        screen.getByText(/Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file./i)
      ).toBeInTheDocument();
    });

    it('should display file size error message', () => {
      render(
        <ErrorMessage
          message="File too large. Maximum file size is 50 MB. Your file: 75.00 MB"
          onRetry={vi.fn()}
        />
      );

      expect(screen.getByText(/File too large/i)).toBeInTheDocument();
      expect(screen.getByText(/75.00 MB/i)).toBeInTheDocument();
    });

    it('should display parsing error message', () => {
      render(
        <ErrorMessage
          message="Unable to read this file. The file may be corrupted or password-protected. Please try a different file."
          onRetry={vi.fn()}
        />
      );

      expect(screen.getByText(/Unable to read this file/i)).toBeInTheDocument();
      expect(screen.getByText(/corrupted or password-protected/i)).toBeInTheDocument();
    });

    it('should display empty content error message', () => {
      render(
        <ErrorMessage
          message="This file contains no text. Please upload a file with readable content."
          onRetry={vi.fn()}
        />
      );

      expect(screen.getByText(/This file contains no text/i)).toBeInTheDocument();
      expect(screen.getByText(/readable content/i)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply base CSS class', () => {
      const { container } = render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      const errorDiv = container.querySelector('.error-message');
      expect(errorDiv).toBeInTheDocument();
    });

    it('should apply CSS classes to all sub-elements', () => {
      const { container } = render(<ErrorMessage message="Test error" onRetry={vi.fn()} />);

      expect(container.querySelector('.error-message__content')).toBeInTheDocument();
      expect(container.querySelector('.error-message__icon')).toBeInTheDocument();
      expect(container.querySelector('.error-message__text')).toBeInTheDocument();
      expect(container.querySelector('.error-message__title')).toBeInTheDocument();
      expect(container.querySelector('.error-message__description')).toBeInTheDocument();
      expect(container.querySelector('.error-message__retry-button')).toBeInTheDocument();
    });
  });
});
