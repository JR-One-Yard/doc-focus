import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Add DOM APIs required by pdfjs-dist
// These are not included in jsdom but are needed for PDF rendering in tests
if (typeof DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    m11 = 1
    m12 = 0
    m13 = 0
    m14 = 0
    m21 = 0
    m22 = 1
    m23 = 0
    m24 = 0
    m31 = 0
    m32 = 0
    m33 = 1
    m34 = 0
    m41 = 0
    m42 = 0
    m43 = 0
    m44 = 1

    constructor() {
      // Minimal DOMMatrix implementation for PDF.js
    }
  } as unknown as typeof DOMMatrix
}

// Add Path2D stub for canvas operations
if (typeof Path2D === 'undefined') {
  global.Path2D = class Path2D {
    constructor() {
      // Minimal Path2D implementation
    }
  } as unknown as typeof Path2D
}

// Add OffscreenCanvas stub
if (typeof OffscreenCanvas === 'undefined') {
  // @ts-expect-error - OffscreenCanvas stub for tests
  global.OffscreenCanvas = class OffscreenCanvas {
    width: number
    height: number

    constructor(width: number, height: number) {
      this.width = width
      this.height = height
    }

    getContext() {
      return null
    }
  }
}

// Add File.prototype.arrayBuffer polyfill for jsdom
// This is needed for PDF parsing tests
if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function (): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(this)
    })
  }
}
