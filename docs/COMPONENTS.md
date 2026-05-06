# Components

Source: `src/ui/Theme.ts`. All components share the neo-brut frame: ink shadow + ink border + colored fill.

## `drawNeoRect` (internal primitive)

```
shadow rect  → offset (+shadowOffset, +shadowOffset)  fill: ink
border rect  → at (0,0)                               fill: ink
inner fill   → inset by borderPx                      fill: <component fill>
```

Three rounded rectangles stacked. Same `cornerR` for shadow + border; inner uses `max(0, cornerR - borderPx/2)`. Reused by every component.

## `neoTile(scene, x, y, w, h, fill, opts?)`

Plain decorative panel.

- Returns `{ container, redraw(newFill) }`.
- Use for level-grid cells, info plates, modal backdrops.
- Not interactive by default.

## `neoButton(scene, x, y, w, h, label, fill, onClick, opts?)`

Primary interactive surface.

| Option | Default | Notes |
|---|---|---|
| `textSize` | `40` | Body-NEO bold |
| `textColor` | `TOKENS.inkHex` | |
| `hoverFill` | `darken(fill, 0.08)` | Auto |

Behavior:
- Hit-test rect = `(0, 0, w + shadowOffset, h + shadowOffset)` so the bottom-right shadow region also clicks.
- `pointerover`: redraw with `hoverFill`, scale `1 → 1.06` (140ms `Back.easeOut`).
- `pointerdown`: translate inner graphics + label by `+4px` x/y, scale `1 → 0.98`.
- `pointerup`: translate back, scale to `1.06`, fire `onClick`.
- `pointerout` while pressed: clear pressed state without firing.

Returns `NeoButtonHandle`:
```ts
{ container, setLabel(t), setFill(f), setEnabled(v) }
// setEnabled(false) → alpha 0.5 + ignore inputs
```

## `neoPill(scene, x, y, label, onClick, opts?)`

Thin wrapper over `neoButton` with pill defaults.

| Option | Default |
|---|---|
| `w` | `116` |
| `h` | `100` |
| `fill` | `TOKENS.white` |
| `textSize` | `44` |

Use for: pause-button (`II`), back arrows (`<`), HUD chips. Pill corner radius is *not* enforced — `cornerR=18` from `drawNeoRect` is used. To get a true rounded-end pill, pass `opts.cornerR` via wrapping `neoTile` or extend `neoButton` opts.

## `dottedBackground(scene)`

Sets camera background to `cream`, then draws a grid of `ink @ 18% alpha` dots, radius 2.2px, spacing 40px. `setDepth(-100)` so always behind everything else. Call once per scene `create()` after layout begins.

## `drawLockIcon(scene, x, y, size?, color?)`

Padlock glyph for locked level tiles + locked themes/skins.

- Default `size = 50`, `color = 0x9a9a9a`.
- Body: rounded rect, height `size * 0.78`.
- Shackle: arc stroke, line width `max(3, size * 0.13)`.

Returns the `Phaser.GameObjects.Graphics` so caller can position / depth-sort.

## `drawChevronIcon(scene, x, y, size, direction, color?)`

Filled triangle pointing `UP`/`DOWN`/`LEFT`/`RIGHT`. Used for:
- Constrained-block direction indicator.
- Back/forward navigation chips.

Color defaults to `TOKENS.ink`.

## Animation helpers

```ts
popIn(scene, target, delay = 0)
// scale 0 → 1, 380ms, 'Back.easeOut'

slideUpIn(scene, target, delay = 0, fromOffset = 72)
// y = baseY + 72  →  y = baseY ; alpha 0 → 1
```

Both used at scene mount for staggered reveals (e.g. `MenuScene` PLAY/LEVEL SELECT/TUTORIAL buttons cascade in).

## Component recipes

### Score plate (HUD)
```
neoTile(scene, x, y, 172, 86, TOKENS.mint)   // level chip
+ Phaser.Text "LV 5" with FONT_NEO 32px, ink
```

### Primary CTA (e.g. PLAY)
```
neoButton(scene, cx, 460, 500, 116, 'PLAY', TOKENS.mint, onPlay)
+ slideUpIn(scene, btn.container, 280)
```

### Header pill (pause / back)
```
neoPill(scene, x, y, 'II', onPause, { w: 100, h: 86, fill: TOKENS.white, textSize: 32 })
```

### Level-grid tile (locked)
```
neoTile(scene, x, y, 100, 100, TOKENS.lockGray)
+ drawLockIcon(scene, x, y, 36)
```

## Don't

- **Do not** use Phaser native `add.rectangle()` for clickable surfaces. Use `neoButton` so press affordance + ink shadow stay consistent.
- **Do not** add extra drop-shadow or glow to a `neoButton`. The hard ink shadow is the only depth cue.
- **Do not** place buttons closer than `shadowOffset + 4` (10px) to each other or the screen edge — shadow will clip.
- **Do not** mix fonts inside one component. One pill = one font family.
