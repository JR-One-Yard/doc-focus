/**
 * FileUpload Component
 *
 * Provides drag-and-drop and click-to-upload interface for document files.
 * Supports TXT, PDF, EPUB, and DOCX formats up to 50 MB.
 *
 * Spec: specs/file-management.md (File Upload, lines 18-45)
 */

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

interface FileUploadProps {
  /** Callback when a valid file is selected */
  onFileSelect: (file: File) => void;
  /** Callback when file validation fails */
  onError?: (error: string) => void;
  /** Whether the upload is currently disabled */
  disabled?: boolean;
}

// Maximum file size: 50 MB (as per spec)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

// Large file warning threshold: 10 MB (as per spec)
const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024; // 10 MB in bytes

// Supported file types
const ACCEPTED_FILE_TYPES = {
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
  'application/epub+zip': ['.epub'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

/**
 * FileUpload Component
 *
 * Renders a drag-and-drop upload area with visual feedback and file validation.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   onFileSelect={(file) => console.log('Selected:', file.name)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
export function FileUpload({ onFileSelect, onError, disabled = false }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        const errors = rejection.errors || [];

        if (errors.some((e: any) => e.code === 'file-too-large')) {
          const sizeMB = (rejection.file.size / (1024 * 1024)).toFixed(2);
          onError?.(
            `File too large. Maximum file size is 50 MB. Your file: ${sizeMB} MB`
          );
        } else if (errors.some((e: any) => e.code === 'file-invalid-type')) {
          onError?.(
            'Unsupported file type. Please upload a .txt, .pdf, .epub, or .docx file.'
          );
        } else {
          onError?.('Unable to upload this file. Please try another file.');
        }
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Warn about large files (>10 MB)
        if (file.size > LARGE_FILE_THRESHOLD) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
          console.warn(
            `Large file detected (${sizeMB} MB). Parsing may take longer.`
          );
        }

        onFileSelect(file);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false, // Single file upload for MVP
    disabled,
  });

  return (
    <div
      {...getRootProps({
        role: undefined, // Let dropzone handle the role
        tabIndex: disabled ? -1 : undefined, // Let dropzone handle tabIndex
        'aria-label': 'Upload file area',
      })}
      className={`file-upload ${isDragActive ? 'file-upload--active' : ''} ${
        disabled ? 'file-upload--disabled' : ''
      }`}
    >
      <input
        {...getInputProps({
          'aria-label': 'File input',
        })}
      />

      <div className="file-upload__content">
        {isDragActive ? (
          <>
            <div className="file-upload__icon" aria-hidden="true">
              📥
            </div>
            <p className="file-upload__text file-upload__text--primary">
              Drop your file here
            </p>
          </>
        ) : (
          <>
            <div className="file-upload__icon" aria-hidden="true">
              📄
            </div>
            <p className="file-upload__text file-upload__text--primary">
              Drag & drop a file here
            </p>
            <p className="file-upload__text file-upload__text--secondary">
              or click to browse
            </p>
            <div className="file-upload__info">
              <p className="file-upload__supported-types">
                Supported: TXT, PDF, EPUB, DOCX
              </p>
              <p className="file-upload__size-limit">Maximum size: 50 MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
