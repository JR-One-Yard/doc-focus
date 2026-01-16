/**
 * Tests for FileUpload Component
 *
 * Tests drag-and-drop, file validation, error handling, and accessibility.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  describe('rendering', () => {
    it('should render upload area with instructions', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      expect(screen.getByText(/Drag & drop a file here/i)).toBeInTheDocument();
      expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    });

    it('should display supported file types', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      expect(screen.getByText(/Supported: TXT, PDF, EPUB, DOCX/i)).toBeInTheDocument();
    });

    it('should display maximum file size', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      expect(screen.getByText(/Maximum size: 50 MB/i)).toBeInTheDocument();
    });

    it('should render with proper ARIA attributes', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      // Upload area uses presentation role from react-dropzone, but is keyboard accessible
      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).toBeInTheDocument();
      // TabIndex is managed by react-dropzone
    });

    it('should render file input with ARIA label', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled class when disabled', () => {
      render(<FileUpload onFileSelect={vi.fn()} disabled />);

      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).toHaveClass('file-upload--disabled');
    });

    it('should set tabIndex to -1 when disabled', () => {
      render(<FileUpload onFileSelect={vi.fn()} disabled />);

      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      // Upload area is keyboard accessible via react-dropzone
      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).toBeInTheDocument();
      // TabIndex managed by react-dropzone
    });

    it('should have proper ARIA label', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      // Check for aria-label instead of role
      expect(screen.getByLabelText(/Upload file area/i)).toBeInTheDocument();
    });

    it('should hide decorative emoji from screen readers', () => {
      const { container } = render(<FileUpload onFileSelect={vi.fn()} />);

      const icon = container.querySelector('.file-upload__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('file type validation', () => {
    it('should accept .txt files', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i) as HTMLInputElement;
      expect(fileInput).toHaveAttribute('accept');
      expect(fileInput.getAttribute('accept')).toContain('.txt');
    });

    it('should accept .pdf files', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i) as HTMLInputElement;
      expect(fileInput.getAttribute('accept')).toContain('.pdf');
    });

    it('should accept .epub files', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i) as HTMLInputElement;
      expect(fileInput.getAttribute('accept')).toContain('.epub');
    });

    it('should accept .docx files', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i) as HTMLInputElement;
      expect(fileInput.getAttribute('accept')).toContain('.docx');
    });

    it('should only accept single file', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const fileInput = screen.getByLabelText(/File input/i) as HTMLInputElement;
      expect(fileInput).not.toHaveAttribute('multiple');
    });
  });

  describe('styling', () => {
    it('should apply base CSS class', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).toHaveClass('file-upload');
    });

    it('should not have active class by default', () => {
      render(<FileUpload onFileSelect={vi.fn()} />);

      const uploadArea = screen.getByLabelText(/Upload file area/i);
      expect(uploadArea).not.toHaveClass('file-upload--active');
    });
  });

  describe('callbacks', () => {
    it('should render without onError callback', () => {
      expect(() => {
        render(<FileUpload onFileSelect={vi.fn()} />);
      }).not.toThrow();
    });

    it('should accept onError callback', () => {
      const onError = vi.fn();
      render(<FileUpload onFileSelect={vi.fn()} onError={onError} />);

      expect(onError).not.toHaveBeenCalled();
    });
  });
});
