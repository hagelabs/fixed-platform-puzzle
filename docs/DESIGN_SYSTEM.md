# Kinetic Puzzle — Design System

Style: **Neo-brutalist**. Bold blocks, thick ink borders, hard offset shadows, cream background, rounded corners. No gradients. No drop-shadow blur. Solid fills only.

## Files

| Doc | Topic |
|---|---|
| [COLORS.md](./COLORS.md) | Palette tokens, block colors, hover states |
| [TYPOGRAPHY.md](./TYPOGRAPHY.md) | Fonts, text styles, sizing |
| [COMPONENTS.md](./COMPONENTS.md) | neoButton, neoPill, neoTile, backgrounds, icons |
| [SPACING.md](./SPACING.md) | Borders, corner radii, shadow offsets, board dims |

## Source of truth

- **Palette / borders / corners**: `src/ui/Theme.ts` → `TOKENS`
- **Block colors**: `src/config/Constants.ts` → `COLORS`
- **Fonts**: `src/ui/Theme.ts` → `FONT_NEO`, `FONT_BODY_NEO`
- **Game canvas**: `src/config/Constants.ts` → `GAME_WIDTH=1920`, `GAME_HEIGHT=1080`

## Core principles

1. **Ink-on-cream**. Every UI piece sits on `#fbf3d5` background dotted-grid backdrop.
2. **Thick ink borders**. 6px `#111` border on every interactive surface.
3. **Hard offset shadow**. 6px solid ink shadow, no blur, never matches fill.
4. **Solid color blocks**. Saturated mid-pastels. No gradients, no inner shading.
5. **Rounded corners**. Buttons/tiles 18px radius; pills 32px.
6. **Press affordance**. On `pointerdown`, surface translates +4px x/y; on hover, 8% darker fill + 6% scale.
7. **Block colors are semantic**. Red/blue/yellow encode mechanic role (simple / dependent / constrained), not aesthetic choice.

## Animation primitives

Defined in `src/ui/Theme.ts`:
- `popIn(target, delay)` — scale `0 → 1`, 380ms `Back.easeOut`.
- `slideUpIn(target, delay, offset)` — Y-translate 72px from below, fade in.
- Hover scale: `1 → 1.06`, 140ms `Back.easeOut`.
- Press scale: `1 → 0.98`, 80ms.
- Idle pulse (passive): `1 ↔ 1.04`, 1400ms yoyo (sin ease).

Settle: every interactive returns to baseline scale + position on `pointerout` / `pointerup`.
