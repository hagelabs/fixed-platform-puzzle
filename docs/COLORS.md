# Colors

Source: `src/ui/Theme.ts` → `TOKENS` and `src/config/Constants.ts` → `COLORS`.

Phaser uses 0xRRGGBB ints for `Graphics.fillStyle`. Text uses hex strings (`*Hex`).

## Backdrop / Ink (UI base)

| Token | Hex | Int | Use |
|---|---|---|---|
| `cream` / `creamHex` | `#fbf3d5` | `0xfbf3d5` | Page background; dotted-grid base |
| `ink` / `inkHex` | `#111111` | `0x111111` | All borders, shadows, body text |
| `white` / `whiteHex` | `#ffffff` | `0xffffff` | Default `neoPill` fill |

## Accent fills (button / tile faces)

| Token | Hex | Int | Hover token | Hover hex |
|---|---|---|---|---|
| `mint` | `#b8e5c8` | `0xb8e5c8` | `mintHover` | `#a3dab9` |
| `sky` | `#a8d4f0` | `0xa8d4f0` | `skyHover` | `#90c4e8` |
| `yellow` | `#ffd96a` | `0xffd96a` | `yellowHover` | `#f2c850` |
| `red` | `#e56b6f` | `0xe56b6f` | `redHover` | `#d45b5f` |
| `blue` | `#7fb7e8` | `0x7fb7e8` | `blueHover` | `#6da6d8` |
| `danger` | `#f28b82` | `0xf28b82` | (computed via `darken(0.08)`) | — |

Hover is auto-derived in `neoButton` via `darken(fill, 0.08)` if `opts.hoverFill` not specified. Explicit `*Hover` tokens reserved for cases where hand-tuned hover beats the formula.

## Utility colors

| Token | Hex | Int | Use |
|---|---|---|---|
| `lockGray` | `#d9d9d9` | `0xd9d9d9` | Locked level tiles, disabled icons |
| `obstacleGray` | `#4a4a4a` | `0x4a4a4a` | Obstacle (immovable) block fill |
| `exitGlow` | `#ff8a5b` | `0xff8a5b` | Exit-portal accent (warm orange) |
| `exitGlowAccent` | `#ffd96a` | `0xffd96a` | Exit-portal secondary glow |

## Block colors (gameplay)

`src/config/Constants.ts` → `COLORS: Record<Color, number>`. Indexed by the `BlockData.color` field.

| Key | Hex | Int | Mechanic |
|---|---|---|---|
| `red` | `#e56b6f` | `0xe56b6f` | Simple block (no constraint) |
| `blue` | `#7fb7e8` | `0x7fb7e8` | Dependent block (locked until parent removed) |
| `green` | `#b8e5c8` | `0xb8e5c8` | (reserved — currently unused at runtime) |
| `yellow` | `#ffd96a` | `0xffd96a` | Constrained block (single-direction exit) |
| `purple` | `#c9a4d8` | `0xc9a4d8` | (reserved) |
| `orange` | `#f2a76b` | `0xf2a76b` | (reserved) |

> **Semantic rule**: in current shipping levels, only `red` / `blue` / `yellow` appear. The other entries exist for future block types.

## Confetti accent palette

Defined in `src/utils/Effects.ts`. Used only by win-screen confetti, not exported from `TOKENS`. Kept in sync with the `mint / sky / yellow / red / blue` accent set.

## Color-blind notes

- `red` ↔ `blue` chosen to keep luminance contrast > 0.4.
- Mechanic differentiation also signaled by **icon overlays** (lock icon, direction arrow), not color alone.
