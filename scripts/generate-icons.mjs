#!/usr/bin/env node
/**
 * Generate PWA app icons
 * Creates 192x192 and 512x512 PNG icons for FastReader PWA
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// App theme colors
const BACKGROUND_COLOR = '#1a1a1a'; // Dark theme background
const PRIMARY_COLOR = '#ff0000';    // OVP highlight red

/**
 * Create an SVG icon with FastReader branding
 */
function createIconSVG(size) {
  const fontSize = size * 0.15;
  const letterSize = size * 0.4;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${size}" height="${size}" fill="${BACKGROUND_COLOR}"/>

      <!-- Letter F with OVP highlight style -->
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${letterSize}"
        font-weight="bold"
        fill="#f5f5f5"
        text-anchor="middle"
        dominant-baseline="central">
        F
      </text>

      <!-- Red accent bar (represents OVP highlight) -->
      <rect
        x="${size * 0.25}"
        y="${size * 0.7}"
        width="${size * 0.5}"
        height="${size * 0.05}"
        fill="${PRIMARY_COLOR}"
        rx="${size * 0.01}"
      />

      <!-- App name -->
      <text
        x="50%"
        y="${size * 0.88}"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        fill="#f5f5f5"
        text-anchor="middle">
        FastReader
      </text>
    </svg>
  `;
}

/**
 * Generate PNG icon from SVG
 */
async function generateIcon(size, filename) {
  const svg = createIconSVG(size);
  const outputPath = join(publicDir, filename);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✓ Generated ${filename} (${size}x${size})`);
}

/**
 * Generate all required icons
 */
async function generateAllIcons() {
  console.log('Generating FastReader PWA icons...\n');

  try {
    await generateIcon(192, 'icon-192.png');
    await generateIcon(512, 'icon-512.png');

    console.log('\n✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateAllIcons();
