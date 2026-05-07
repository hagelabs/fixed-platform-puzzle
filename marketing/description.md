# Marketing Copy

## Title

Kinetic Puzzle

## Short description (≤150 chars)

Slide blocks across the grid and escape through portals. Order matters — one wrong move dead-ends the level. Pure logic, no timer.

## Long description (≤1000 chars)

Kinetic Puzzle is a block and grid puzzle brain teaser. Blocks slide with momentum until they hit a wall, an obstacle, or another block. Drag them out through edge portals — but only if the order, direction, and dependencies line up.

Master four block types:

- Red simple — slides any direction, exits any portal.
- Yellow constrained — only moves and exits in its arrow direction.
- Blue dependent — locked until its prerequisite block leaves the board.
- Gray obstacle — fixed walls that block momentum.

Features:

- 50 hand-crafted levels, ramping from gentle slides to multi-step dependency chains
- Slide momentum mechanics — every push counts
- Neo-brutalism art style with chunky tiles and tactile feedback
- No timers, no ads mid-puzzle
- Auto-save progress, undo, and hint support
- Plays great on mobile, tablet, and desktop

Perfect for puzzle fans who like to think before they move.

## How to Play

### Goal

Remove every red, yellow, and blue block from the board through the orange edge portals. Gray obstacle blocks stay where they are.

### Block types

- **Red (Simple)** — slides any cardinal direction, exits through any aligned portal.
- **Yellow (Constrained)** — chevron arrow shows the only direction it can slide and exit.
- **Blue (Dependent)** — chained icon. Locked (dim) until its prerequisite block exits. Then it lights up and becomes movable.
- **Gray (Obstacle)** — immovable wall.

### Movement rule

Blocks slide with momentum: they keep going in the swiped direction until they hit a wall, an obstacle, or another block. To exit, line a block up with a portal and slide toward it.

### Desktop controls

- **Mouse swipe** — click and drag a block in a cardinal direction (up / down / left / right), then release. The block slides until it hits something.
- **Drag-to-exit** — drag a block past the board edge through an aligned portal to remove it.
- **Undo / Hint / Restart / Pause** — bottom and top HUD buttons.
- **Esc** — pause.

### Mobile / touch controls

- **Swipe** — touch a block, swipe in a cardinal direction, release. Same momentum rule applies.
- **Drag-to-exit** — hold a block and drag it past the edge through a portal to remove.
- **Tap** — HUD buttons (undo, hint, restart, pause) all tap-friendly.

### Tips

- Plan the exit order. Removing a blue block's prerequisite first unlocks it.
- Yellow blocks ignore swipes against their arrow — read the chevron.
- Watch for dead-ends: if no block can reach a portal, you're stuck. Use undo or restart.

## Tags

puzzle, logic, casual, sliding, block, brain, sokoban, unpuzzle

## Categories

- Puzzle (primary)
- Casual

## Asset checklist

- [x] thumbnail.svg (960x540) — `marketing/thumbnail.svg`
- [ ] thumbnail.png (960x540) — convert from SVG before upload (Poki requires PNG)
- [ ] thumbnail.png (1280x720) — CrazyGames preferred size, convert from SVG
- [ ] screenshots — capture from running build (3-4 images @ 1280x720)
  - `screenshot-menu.png` — main menu
  - `screenshot-gameplay.png` — mid-puzzle
  - `screenshot-win.png` — level complete
  - `screenshot-levelselect.png` — level grid

## Capture workflow

1. `npm run build && npm run dev`
2. Open http://localhost:3000 in Chrome
3. Resize devtools viewport to 1280x720
4. DevTools > Capture screenshot (Cmd+Shift+P → "Capture screenshot")
5. Save into `marketing/screenshots/`
