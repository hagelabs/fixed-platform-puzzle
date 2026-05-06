# Typography

Source: `src/ui/Theme.ts` → `FONT_NEO`, `FONT_BODY_NEO`, `neoTextStyle()`, `neoHeaderStyle()`.

## Font stacks

| Variable | Value | Use |
|---|---|---|
| `FONT_NEO` | `"Bungee", "Arial Black", "Helvetica Neue", sans-serif` | Headers, scene titles, big buttons, level numbers |
| `FONT_BODY_NEO` | `"Arial Black", "Helvetica Neue", Arial, sans-serif` | Bold body text, button labels, HUD counters |

`Bungee` is loaded via Google Fonts in `src/index.html`. `Arial Black` is the bundled fallback. Document fonts are awaited via `document.fonts.load('700 32px "Bungee"')` in `src/main.ts:waitForFonts()` before Phaser starts so first paint never flickers.

## Type scale (used in shipping screens)

| Tier | Px | Family | Where |
|---|---|---|---|
| Hero title | 80–94 | FONT_NEO | `MenuScene` "KINETIC PUZZLE", `GameOverScene` "CLEARED!" |
| Section title | 56–72 | FONT_NEO | `PauseScene` "PAUSED" |
| Big button | 40–44 | FONT_BODY_NEO bold | Default `neoButton` text size |
| Stats / row | 28–36 | FONT_NEO | "LEVEL X · Y MOVES", level grid numbers |
| Sub / hint | 22–26 | FONT_NEO | Subtitles, tagline pills |
| Caption | 18–22 | FONT_NEO | Footer text, watch-button counter |

## Helpers

```ts
neoTextStyle(size: number, colorHex?: string): TextStyle
// fontFamily: FONT_BODY_NEO  ·  fontStyle: 'bold'  ·  color: ink

neoHeaderStyle(size: number, colorHex?: string): TextStyle
// fontFamily: FONT_NEO  ·  color: ink (no bold — Bungee is already heavy)
```

## Text resolution patch

Phaser rasterizes `Text` glyphs to a texture at default `resolution: 1`. Because the canvas is upscaled via `Phaser.Scale.FIT`, default text would be blurry on HiDPI screens. `src/main.ts:patchTextResolution()` overrides `GameObjectFactory.text` to set `setResolution(min(4, dpr*2))` on every text object, sharpening rendering without manual per-call setup.

## Letter spacing

Default Phaser tracking is fine for FONT_NEO. Manually-built signage (logo, splash) uses `letter-spacing="2"` (px) on `<text>` for the title plate and `"3"` for the tagline pill. Mirror those values when adding new logo plates.

## Line height

Single-line buttons + HUD; `lineHeight` not configured. For multi-line body text (e.g. tutorial copy), use Phaser's default which renders at ~1.2× font-size; no override needed.

## Constants alias (legacy)

`src/config/Constants.ts` also exports `FONT_HEADER` and `FONT_BODY` with identical values. New code should import from `src/ui/Theme.ts` (`FONT_NEO` / `FONT_BODY_NEO`).
