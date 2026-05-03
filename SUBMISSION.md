# SUBMISSION.md

End-to-end submission workflow for Poki and CrazyGames.

---

## Build artifact

```bash
npm run build
```

Output: `dist/`
- `index.html` (965 B, minified)
- `game.<hash>.js` + `phaser.<hash>.js` (split, minified, source-map free)
- `*.br` Brotli pre-compressed (≤80% smaller)
- `*.gz` Gzip fallback

Measured (May 2026):
- Brotli total: ~278 KB (Phaser 272 KB + game 6.5 KB)
- Gzip total: ~347 KB
- Raw minified total: 1.31 MB

Both well under the platform 800 KB / 20 MB targets.

---

## Pre-submission checklist

### Technical
- [x] Webpack 5 production build, Terser minified
- [x] Brotli + Gzip compression (CompressionPlugin q11)
- [x] HTML minified (`HtmlWebpackPlugin.minify`)
- [x] Code split: phaser vendor chunk separated
- [x] Touch + mouse input both wired (`InputManager`)
- [x] No console errors on cold load (verified webpack stats clean)
- [x] Auto-save via Zustand `persist` middleware → `localStorage`
- [x] Save/load tested (refresh persists `unlockedLevel`, `score`, `audioEnabled`)
- [x] Game canvas locked at 960×600, hosted in centered website frame (`src/index.html` `.game-frame` w/ `aspect-ratio: 960/600`)
- [x] First-run interactive tutorial (`TutorialScene` overlays Level 1 w/ guided arrow + bubbles; persisted `tutorialDone` flag)
- [x] Responsive grid sizing (`Grid.cellSize` adapts to viewport)
- [x] No flashing >3 Hz (only fade-in at 250ms, scene-bound)
- [ ] **Manual:** test on real Android + iOS device
- [ ] **Manual:** profile load time in Chrome DevTools (target <2s)
- [ ] **Manual:** 60 FPS check on low-end device

### Poki SDK (verified against https://sdk.poki.com/html5.html)
- [x] Script: `https://game-cdn.poki.com/scripts/v2/poki-sdk.js` (matches doc)
- [x] `PokiSDK.init()` awaited in `SDKManager.init()` before Phaser boot (`main.ts`)
- [x] `PokiSDK.gameLoadingFinished()` in `BootScene.create()` after Phaser ready
- [x] `PokiSDK.gameplayStart()` on `GameScene.create()` after `commercialBreak()` resolves
- [x] `PokiSDK.gameplayStop()` on GameScene SHUTDOWN + `endLevel`
- [x] `PokiSDK.commercialBreak()` called BEFORE `gameplayStart()` (per doc), every 2 level starts. `gameplayStop()` invoked first to comply.
- [x] `PokiSDK.rewardedBreak({ size: 'medium' })` w/ object opts (per doc signature) for hint + dead-end continue
- [x] `PokiSDK.customEvent()` mirrors Analytics events (kept as best-effort, optional)

### CrazyGames SDK v3 (verified against https://docs.crazygames.com/sdk/intro/)
- [x] Script: `https://sdk.crazygames.com/crazygames-sdk-v3.js` (matches doc)
- [x] `await CrazyGames.SDK.init()` — required, awaited in `SDKManager.init()`
- [x] `CrazyGames.SDK.game.loadingStart()` on init, `loadingStop()` after Phaser ready
- [x] `CrazyGames.SDK.game.gameplayStart/Stop()` on level enter/exit
- [x] `CrazyGames.SDK.game.happytime()` on level win
- [x] `CrazyGames.SDK.ad.requestAd('midgame'|'rewarded')` for interstitial + rewarded
- [x] Removed `analytics.trackEvent` — not in v3 core spec; CrazyGames analytics are platform-side
- [x] `environment` field is read-aware (SDK auto-stubs on non-CG domains; localhost shows demo ads)

### Content
- [x] Original artwork (procedural rectangles, no copyrighted content)
- [x] Family-friendly (no violence, no text content beyond UI labels)
- [x] No external dependencies beyond Phaser + Zustand (CDN-loaded SDKs)
- [x] ESRB E-equivalent

---

## Poki upload

1. Sign up at https://developers.poki.com/
2. Dashboard → My Games → Create New Game
3. Fill in metadata from `marketing/poki.json`:
   - Title, category (Puzzle), tags
   - Description copy from `marketing/description.md`
4. **Convert thumbnail to PNG:**
   ```bash
   # Using ImageMagick (install: brew install imagemagick librsvg)
   magick marketing/thumbnail.svg -resize 960x540 marketing/thumbnail.png
   ```
5. Capture screenshots:
   - `npm run dev` → http://localhost:3000
   - DevTools → set viewport 1280x720 → Cmd+Shift+P → "Capture screenshot"
   - Save into `marketing/screenshots/` (menu, gameplay, win, levelselect)
6. Build:
   ```bash
   mkdir -p submission && npm run package:poki
   ```
   Output: `submission/poki-build.zip`
7. Dashboard → Upload Build → drag `poki-build.zip`
8. Test on Poki staging (`https://poki.dev/games/<game-id>`):
   - SDK calls visible in DevTools console
   - Mobile + desktop responsive
   - No 404s
9. Submit for Basic Launch review (1-7 day QA)

---

## CrazyGames upload

1. Sign up at https://developer.crazygames.com/
2. Submit a Game → Upload Build
3. Fill metadata from `marketing/crazygames.json`
4. Convert thumbnail to **1280x720** PNG (CrazyGames preferred):
   ```bash
   magick marketing/thumbnail.svg -resize 1280x720 marketing/thumbnail-cg.png
   ```
5. Build + zip:
   ```bash
   mkdir -p submission && npm run package:crazygames
   ```
6. Drag `submission/crazygames-build.zip` into portal
7. Validation auto-checks compression (Brotli files present), size, file count
8. Test via preview URL across Chrome desktop + iOS Safari + Chrome mobile
9. Submit for review (24-72 hrs)

---

## Manual playtest before submission

```bash
npm run build && cd dist && python3 -m http.server 8080
```

Open http://localhost:8080 in:
- Chrome desktop
- Chrome DevTools device emulation: iPhone 12, Pixel 5, iPad
- Safari iOS (real device, ngrok tunnel)
- Android Chrome (real device)

Walk through:
1. Boot → Menu (audio toggle works)
2. Play → first level (drag block off edge)
3. Pause overlay (resume + restart + menu work)
4. Win → confetti, NEXT LEVEL → interstitial cadence
5. Hit a stuck state → CONTINUE rewarded ad
6. Hint button → rewarded → block pulses
7. Refresh page → progress + audio prefs persist
8. Rotate device → grid resizes correctly
9. 10+ minute session → no FPS drops, no leaked listeners

If any step fails, fix before submission.

---

## Resubmission

If rejected:
1. Read feedback in dashboard
2. Reproduce issue locally
3. Fix in code, `npm run build`
4. Upload new build, append change notes
5. CrazyGames + Poki accept incremental updates without re-review delay if metadata unchanged

---

## File map

```
marketing/
  thumbnail.svg          # 960x540 source thumbnail
  manifest.json          # PWA-ish metadata
  poki.json              # Poki upload metadata
  crazygames.json        # CrazyGames upload metadata
  description.md         # Marketing copy + asset checklist
  screenshots/           # (manual) capture from running game
submission/
  poki-build.zip         # generated by npm run package:poki
  crazygames-build.zip   # generated by npm run package:crazygames
dist/
  index.html
  game.*.js + .br + .gz
  phaser.*.js + .br + .gz
SUBMISSION.md            # this file
```
