import sharp from 'sharp'
import { copyFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = process.argv[2]
const out = process.argv[3] || join(__dirname, 'docs/assets/logo.png')

// Remove near-black background; keep charcoal/gold artwork.
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const px = Buffer.from(data)
const tol = 22 // pure black bg; charcoal art is typically darker gray but > this

for (let i = 0; i < px.length; i += 4) {
  const r = px[i]
  const g = px[i + 1]
  const b = px[i + 2]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min

  // Black / near-black and low chroma => transparent
  if (max <= tol && chroma <= 8) {
    px[i + 3] = 0
    continue
  }

  // Soft fringe: near-black anti-alias fade
  if (max < 40 && chroma <= 12) {
    const a = Math.round(((max - tol) / (40 - tol)) * 255)
    px[i + 3] = Math.max(0, Math.min(255, a))
  }
}

await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile(out)

console.log('Wrote transparent PNG:', out)
