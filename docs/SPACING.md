# Spacing, Borders & Dimensions

Source: `src/ui/Theme.ts` → `TOKENS`, `src/config/Constants.ts`.

## Frame primitives (`TOKENS`)

| Token | Value | Use |
|---|---|---|
| `borderPx` | `6` | Thickness of ink border on every neo-frame |
| `shadowOffset` | `6` | Hard offset shadow distance (x = y) |
| `cornerR` | `18` | Default corner radius for tiles + buttons |
| `pillCornerR` | `32` | Reserved for pill-shape components |

The press translation in `neoButton` is hardcoded to `4px` (about ⅔ of `shadowOffset`). Resist re-using `borderPx` for press; they're conceptually different.

## Recommended sizes

### Buttons
| Variant | Width | Height | Text size |
|---|---|---|---|
| Primary CTA | 500 | 116 | 40–44 |
| Standard action | 380–504 | 100–108 | 32–40 |
| HUD pill | 100 | 86 | 32 |
| Compact pill | 116 | 100 | 44 |
| Sub action / footer | 200–240 | 70–96 | 22–32 |

### Tiles
| Variant | Width | Height |
|---|---|---|
| Level-select cell | 100 | 100 |
| HUD chip | 172 | 86 |
| Modal backdrop | up to 1200 × 720 |

### Touch target
Minimum interactive size **86×86 px** in 1920×1080 design space (~45×45 css px after `Phaser.Scale.FIT` to mobile portrait). Below that, expand `setInteractive` rect manually.

### Grouping
- Buttons stacked vertically: gap `≥ 24px` (so `shadow` + `borderPx` of one doesn't kiss the next).
- Buttons in a row: gap `≥ 32px`.
- Buttons relative to screen edge: margin `≥ 64px` (lets the bottom-right ink shadow breathe).

## Game canvas

| Constant | Value |
|---|---|
| `GAME_WIDTH` | `1920` |
| `GAME_HEIGHT` | `1080` |
| `HUD_HEIGHT` | `126` (top reserved for level chip + moves counter + pause pill) |

Scale mode `Phaser.Scale.FIT` + `Phaser.Scale.CENTER_BOTH`. The render layer is upscaled with `roundPixels: true` and per-text resolution patch (see [TYPOGRAPHY.md](./TYPOGRAPHY.md)).

## Board

| Constant | Value |
|---|---|
| `CELL_SIZE` | `180` (logical px before grid auto-fits to viewport) |
| `BOARD_PADDING` | `32` |
| Max grid | `MAX_LEVEL_COLS × MAX_LEVEL_ROWS` (= 10×10 in current shipping levels) |

`Grid` (`src/entities/Grid.ts`) computes a single shared `cellSize` from the worst-case grid dim across all levels so blocks render the same physical size in every level.

## Color contrast

All ink-on-fill text uses `#111` on light fills (mint/sky/yellow/red/blue). Contrast > 7:1 (WCAG AAA) on every accent. The single low-contrast pair is `obstacleGray` blocks on cream backdrop — intentional, since obstacles are non-interactive and visual de-emphasis is desirable.

## Don'ts

- Do not vary `borderPx` per component. The visual rhythm depends on identical thickness everywhere.
- Do not soften `shadowOffset` to `< 6`. Smaller looks like lazy drop-shadow, not neo-brut.
- Do not use radii outside `{ 14, 18, 22, 32 }`. Anything else breaks the shape language.
