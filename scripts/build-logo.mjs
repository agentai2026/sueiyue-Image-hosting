import sharp from 'sharp'
import { copyFileSync, writeFileSync, statSync } from 'fs'

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#243038"/>
      <stop offset="100%" stop-color="#15191E"/>
    </linearGradient>
  </defs>
  <rect x="56" y="56" width="400" height="400" rx="92" ry="92" fill="url(#g)"/>
  <path d="M118 348 L220 198 L286 278 L340 230 L394 348 Z" fill="#F4F0E8"/>
  <circle cx="346" cy="176" r="42" fill="#E0B14A"/>
</svg>`

writeFileSync('docs/assets/logo.svg', svg)
await sharp(Buffer.from(svg)).png().toFile('docs/assets/logo.png')

for (const t of [
  'docs/assets/brand.png',
  'docs/assets/og.png',
  'frontend-dist/img/logo.e8dbfa27.png',
  'frontend-dist/static/media/logo.png',
  'frontend-dist/static/media/logo-dark.png',
]) {
  copyFileSync('docs/assets/logo.png', t)
}

const c = await sharp('docs/assets/logo.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
console.log({
  cornerA: c.data[3],
  size: c.info.width,
  bytes: statSync('docs/assets/logo.png').size,
})
