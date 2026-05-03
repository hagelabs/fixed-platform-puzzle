# GAME_DESIGN.md - Game Mechanics & Design

---

## 🎮 Core Mechanics

### Game Fusion: Sokoban + Unpuzzle

**Core Concept:**

- **Sokoban Element:** Block movement dengan constraint path & obstacle (harus geser ke arah tertentu dulu)
- **Unpuzzle Element:** Block removal dengan order dependency (hapus dalam urutan yang benar)
- **Hybrid:** Kombinasi keduanya membuat puzzle lebih kompleks & strategic

### The Game Loop

```
1. LEVEL STARTS
   ├─ Player see grid + block arrangement + OBSTACLE WALLS
   ├─ Can tap/drag block to move (hanya ke arah valid)
   ├─ Goal shown: "Remove all blocks in correct order"
   └─ Obstacle = path constraint (misal: harus geser KIRI dulu, baru ATAS)

2. GAMEPLAY (Sokoban Phase + Dead-End Detection)
   ├─ Player drag block to navigate AROUND OBSTACLES
   ├─ Block hanya bisa keluar dari board jika sudah di posisi EXIT yang benar
   ├─ Wrong path = block terjebak di dalam, harus geser balik (inefficient)
   │
   ├─ DEAD-END DETECTION (after setiap move):
   │  ├─ System check: Apakah block current ini bisa di-remove? (path to exit available?)
   │  ├─ System check: Apakah ada block lain yang masih bisa dimove?
   │  └─ Jika SEMUA block terjebak = DEAD-END ❌
   │
   ├─ If Dead-End Detected:
   │  ├─ Show warning: "You're stuck! No blocks can be removed."
   │  ├─ Player choices: [Restart] [Undo Last Move] [Use Hint]
   │  └─ Restart = no cost, player learns dari mistake
   │
   └─ If valid moves exist:
      └─ Continue play (Unpuzzle removal phase)

3. REMOVAL PHASE (Unpuzzle)
   ├─ When block reaches valid EXIT position
   ├─ Player can drag it OFF the board
   ├─ Poof! Block removed with particle effect
   ├─ Order MATTERS: Some blocks depend on others being removed first
   └─ Wrong removal order = blocks become unremovable (dead-end!)

4. WIN CONDITION
   ├─ All blocks successfully removed = LEVEL UP ✅
   ├─ Show completion: Moves count + Time elapsed + Stars rating
   └─ Unlock next level

5. LOSE CONDITION (Dead-End Dead-Lock)
   ├─ Player is stuck AND chooses to restart
   ├─ Show message: "Great try! Some sequences are trickier than others."
   ├─ Options: [Restart] [View Solution] [Next Level (skip)]
   └─ Restart has no penalty, builds puzzle-solving skill
```

---

## 📐 Grid System

### Board Specifications

| Aspect       | Value                         | Reason                |
| ------------ | ----------------------------- | --------------------- |
| Grid Size    | 6x6 / 7x7                     | Mobile screen fit     |
| Tile Size    | 50px (mobile), 80px (desktop) | Touch target friendly |
| Max Blocks   | 20-25                         | Solvable in <5 min    |
| Empty Spaces | 10-15                         | Room to move blocks   |

### Movement Rules (Sokoban-Style)

**Valid Move:**

- Drag block horizontally/vertically only (no diagonal)
- Block must have clear path (no obstacles, no other blocks)
- Block can only move in directions WITHOUT obstacles blocking
- Multiple moves required: e.g., move LEFT first, then move UP to exit
- Can remove block from designated EXIT zones only (marked on board)

**Invalid Move (will be blocked):**

- Drag block into OBSTACLE WALL (red/dark blocks cannot pass)
- Block surrounded by obstacles on all sides = DEAD-END ⚠️
- Block blocked by another block (can't push through, must move other block first)

**Exit Zones:**

- Each level has 1-4 exit points (marked on board edges)
- Block MUST reach exit zone to be removed
- Some blocks only removable from SPECIFIC exit (adds constraint)
- Example:
  ```
  RED block can only exit from LEFT or TOP
  BLUE block can only exit from RIGHT
  GREEN block can exit from ANY side
  ```

**Obstacle Mechanic (NEW - Sokoban Element):**

```
Example Level:
┌─────────────────┐
│   EXIT (top)    │
├─────────────────┤
│ ███ RED BLOCK   │
│ ███ (obstacle)  │
│ ███            │
│                 │
│ BLU BLOCK ███   │
│           ███   │
│           ███   │
└─────────────────┘

RED Block Path Constraint:
  ✓ Must move DOWN first (down the corridor)
  ✓ Then move LEFT to reach exit
  ✗ Cannot go UP directly (obstacle blocks)
  ✗ Cannot go RIGHT (wall)

Result: Player must plan movement sequence!
```

---

## 🧩 Block Types & Logic

### Block Categories (Unpuzzle Element)

**Type 1: Simple Blocks**

```
[R] - Remove anytime (no constraints)
    - Can exit from any side
    - No dependencies
```

**Type 2: Path-Constrained Blocks (Sokoban Element)**

```
[B]→ - Block with constraint path
    - Must navigate AROUND obstacles
    - Example: Must move UP first, then LEFT to exit
    - Adds strategic planning layer
```

**Type 3: Dependency Chain (Removal Order)**

```
[X] on top of [Y]  - Must remove [X] FIRST
                   - Then can remove [Y]
                   - If [X] is blocked = [Y] stays locked
```

**Type 4: Linked Blocks (Grouped)**

```
[R]─[R]  - Both blocks linked together
         - Must remove TOGETHER as unit
         - If one is trapped = both are trapped
```

**Type 5: Obstacle Blocks (Fixed Walls)**

```
███ - Cannot be moved or removed
    - Permanent obstacle on board
    - Forces players to navigate around them
    - Creates puzzle complexity
```

### Block Properties

```javascript
interface Block {
  id: string                    // Unique identifier
  color: Color                  // Visual color
  position: [x, y]              // Grid coordinates
  size: [width, height]         // In grid units (1x1, 2x1, etc)

  // Movement constraints (Sokoban)
  type: 'simple' | 'constrained' | 'obstacle'
  allowedExits?: string[]       // ['TOP', 'LEFT'] = only these sides
  pathConstraint?: PathRule     // e.g., "must move LEFT before UP"

  // Removal constraints (Unpuzzle)
  linkedTo?: string[]           // Other block IDs (grouped blocks)
  blockedBy?: string[]          // Must remove these first (dependency)
  removable: boolean            // Can be removed NOW?

  // Visual & animation
  animation: string             // Removal effect (pop, dissolve, etc)
}

interface PathRule {
  description: string           // "Move LEFT first, then UP"
  allowedDirections: string[]   // ['LEFT', 'UP'] in order
  deadEndCheck: boolean         // Enable dead-end detection?
}

interface DeadEnd {
  detected: boolean             // Is game in dead-end state?
  reason: string                // "All blocks trapped by obstacles"
  affectedBlocks: string[]      // Block IDs that are stuck
  suggestions: string[]         // Hint suggestions
}
```

### Dead-End Detection System

```
After every move, system checks:

1. Can current block be removed?
   └─ Does it have valid path to an exit zone?

2. Do remaining blocks have ANY valid moves?
   ├─ Check if block can move without obstacles
   ├─ Check if block dependencies are satisfied
   └─ If NO = all blocks are stuck

3. If dead-end detected:
   ├─ Show visual warning
   ├─ Suggest: Undo last move / Restart / Use hint
   ├─ Log to analytics (for level tuning)
   └─ Calculate: How many moves before dead-end?

4. Learning system:
   ├─ If frequent dead-ends: Level too hard, tune
   ├─ If rare dead-ends: Level good difficulty
   └─ Use for difficulty progression tuning
```

---

## 🎨 Level Design Examples (Sokoban + Unpuzzle Hybrid)

### Example 1: Simple Path Constraint (Tutorial Level)

```
Level 5: "Navigate Around"

┌───────────────┐
│ EXIT (LEFT)   │
├───────────────┤
│ RED███████    │ ← RED block
│     ███████   │ ← Obstacle wall
│               │
│       BLUE    │
└───────────────┘

Solution:
1. Move RED DOWN (navigate below obstacle)
2. Move RED LEFT to reach exit
3. Remove RED

Why hard? Because RED can't go directly UP-LEFT.
Must plan path around obstacle.
```

### Example 2: Dependency + Path Constraint (Medium Level)

```
Level 15: "Dependency Puzzle"

┌─────────────────┐
│ EXIT   EXIT     │
├─────────────────┤
│ ███ YELLOW█████ │ ← YELLOW on RIGHT
│ ███             │ ← Obstacle blocks both
│ RED             │ ← RED below
│                 │
│ BLUE            │
└─────────────────┘

Constraints:
- RED blocks BLUE's exit path (blocking)
- YELLOW can't reach LEFT exit (obstacle)
- YELLOW can only exit RIGHT

Solution sequence:
1. Move RED UP (clear BLUE's path)
2. Move RED DOWN again? No, deadlock! ✗
2. Move BLUE LEFT to exit
3. Move RED LEFT to exit
4. Move YELLOW RIGHT to exit

Why hard? Order + obstacle navigation combo!
```

### Example 3: Complex Dead-End Puzzle (Hard Level)

```
Level 32: "Dead-End Trap"

┌───────────────────┐
│  EXIT    EXIT     │
├───────────────────┤
│███████ GRN███████ │ ← GREEN top-right
│███████     ███████ │ ← Obstacles
│ RED    BLU        │
│                   │
└───────────────────┘

Constraints:
- If you remove RED first → BLUE trapped (dead-end!)
- If you remove BLU first → GREEN blocked by obstacle
- Correct: Remove BLU → RED → GREEN

Why hard? First choice seems logical but creates dead-end!
Teaches: Plan entire sequence before first move.
```

---

## 📊 Difficulty Progression (with Dead-End Tuning)

### Level Structure

**Early Levels (1-10): Tutorial Zone**

- Single color blocks only
- 3-5 blocks total
- NO obstacles (pure unpuzzle)
- NO dependencies
- Obvious solution
- Focus: Learn removal mechanic

**Early-Mid Levels (11-15): Introduce Obstacles**

- Mixed colors introduced
- 5-8 blocks total
- START introducing simple obstacles
- Simple path constraints (must move one direction first)
- Rare dead-ends (maybe 1 per level if mistake)
- Focus: Learn path navigation (Sokoban element)

**Mid Levels (16-30): Expansion & Complexity**

- 10-12 blocks total
- Multiple obstacles creating labyrinth
- Dependency chains (block A must be removed before B)
- Path constraints getting complex
- Dead-end possibility: 2-3 ways to trap yourself
- Focus: Plan entire sequence before moving

**Hard Levels (31-50): Challenge & Optimization**

- 15-20 blocks total
- Complex obstacle layouts
- Multiple dependency chains
- Dead-end possibility: 4+ ways to fail, only 1-2 win paths
- Time pressure (optional): Speedrun mode available
- Focus: Strategic thinking & optimization

**Expert (50+): Mastery & Speedrun**

- 20-25 blocks total
- Extreme constraint combinations
- Minimum moves required (optimal solution: 8-12 moves only)
- Dead-end possibility: Most mistakes = dead-end
- Leaderboard competition (fastest solve)
- Focus: Perfect execution

### Difficulty Curve Algorithm (Updated)

```
difficulty_score = (block_count × 1.0)
                 + (obstacle_count × 1.5)
                 + (dependency_chains × 2.0)
                 + (exit_constraints × 1.2)
                 + (dead_end_paths × 0.8)

Examples:
Level 1:  blocks=3, obstacles=0, deps=0, constraints=0
          Score = 3 → EASY

Level 15: blocks=8, obstacles=3, deps=1, constraints=2
          Score = 8 + 4.5 + 2 + 2.4 = 16.9 → MEDIUM

Level 30: blocks=12, obstacles=5, deps=2, constraints=3
          Score = 12 + 7.5 + 4 + 3.6 = 27.1 → HARD

Level 50: blocks=20, obstacles=8, deps=3, constraints=4
          Score = 20 + 12 + 6 + 4.8 = 42.8 → EXPERT
```

### Dead-End Tuning Strategy

```
Target Dead-End Rates (for good difficulty balance):

Early levels (1-15):
  ✓ Dead-ends per level: 0-1 ways to fail
  ✓ Teaches: "One solution path is sufficient"

Mid levels (16-30):
  ✓ Dead-ends per level: 2-4 ways to fail
  ✓ Teaches: "Multiple solutions, must avoid traps"

Hard levels (31-50):
  ✓ Dead-ends per level: 4-8 ways to fail
  ✓ Teaches: "Almost every move can be wrong"

Expert (50+):
  ✓ Dead-ends per level: 8+ ways to fail
  ✓ Teaches: "Perfect sequence required"

Analytics metric: Track player dead-end frequency
  - If > 60% fail from dead-end = level too hard, reduce constraints
  - If < 20% encounter dead-end = level too easy, add obstacles
  - Sweet spot: 35-45% players hit dead-end once per level
```

---

## 🎯 Level Design Philosophy

### Principles

1. **Solvability** - Always has solution (even if hard)
2. **Clarity** - Player understands rules + obstacles after 10 seconds
3. **Fairness** - Never unfair/random. Dead-ends are due to strategy, not luck
4. **Fair Dead-Ends** - If dead-end happens, player should learn why
   - Obstacle placement should be VISIBLE from start
   - Dependency chains should be LOGICAL (not hidden)
   - Path constraints should be clear (maybe hint first time?)
5. **Progression** - New obstacle type per 5 levels
6. **Replayability** - Multiple solve paths for same level (except expert mode)

### Level Generation Strategy

**Early Game (1-20):**

- Manually designed
- Clear difficulty progression
- Each teaches 1 new concept

**Mid Game (21-50):**

- Procedural with hand-crafted adjustments
- Mix of easy wins + challenge spikes
- Test edge cases

**Late Game (50+):**

- Procedural with difficulty floor
- Ensure minimum 3-5 min solve time
- Speedrun variants

---

## 🎨 Visual & Audio Design

### Visual Feedback

**Board Setup:**

```
Block colors: Bright, distinct
Obstacles: Dark gray/black, unmovable
Exit zones: Faint outline glow (show where blocks exit)
Grid lines: Subtle (not distracting)
```

**Block Drag Interaction:**

```
On Tap Block:
  ├─ Highlight block with glow
  ├─ Show VALID move directions (green arrows)
  ├─ Dim invalid directions (blocked by obstacle/block)
  └─ Preview: Show path block will take

On Drag:
  ├─ Semi-transparent block follows finger
  ├─ Path lights up green (safe path)
  ├─ Path shows red if will cause dead-end (preview)
  ├─ Obstacle walls pulse red if blocking path
  └─ Other blocks dim slightly

On Release (Valid Move):
  ├─ Smooth animation to new position
  ├─ If reaches exit: Show "Ready to remove!" indicator
  └─ If still on board: Stay in place

On Release (Invalid Move):
  ├─ Block bounces back to original position
  ├─ Red "X" appears (invalid direction)
  └─ Soft error sound
```

**Block Removal:**

```
On Remove (Block at EXIT):
  ├─ Particle effect (color-matched dissolve)
  ├─ Brief "pop" sound (ASMR)
  ├─ Block fades out + satisfying animation
  └─ Show "+1 points" floating text

On Undo Move:
  ├─ Block slides back to previous position
  ├─ Smooth reverse animation
  └─ Visual indicator: "Undo: (block name)"
```

**Dead-End Detection Visual:**

```
When Dead-End Detected:
  ├─ Screen flashes ONCE (subtle red tint, 300ms)
  ├─ Warning overlay appears: "You're stuck!"
  ├─ Affected blocks pulse red gently (show which blocks are stuck)
  ├─ Show message: "No blocks can move. Dead-end reached."
  ├─ Buttons appear: [Restart] [Undo Last Move] [Show Hint]
  └─ Continue button only if hint used

Visual Hint (what went wrong):
  ├─ Highlight the block that got stuck
  ├─ Show obstacle blocking its path (pulse the obstacle)
  ├─ Arrow showing "Block needs to go this way"
  └─ Optional: Show first correct move as suggestion
```

**Level Complete:**

```
On All Blocks Removed:
  ├─ Confetti animation (board-specific color theme)
  ├─ Victory sound (uplifting, not annoying)
  ├─ Stars rating appears: ⭐⭐⭐
  │  ├─ 3 stars: Solved with < moves_threshold
  │  ├─ 2 stars: Solved with moves_threshold
  │  └─ 1 star: Solved with > moves_threshold (dead-ends?)
  ├─ Show stats:
  │  ├─ Total moves
  │  ├─ Time elapsed
  │  ├─ Dead-ends encountered (if any)
  │  └─ Best possible moves (feedback)
  ├─ Button: [Next Level] [Restart] [View Solution]
  └─ Unlock cosmetic reward (every 5 levels)
```

### Sound Design (ASMR Focus)

| Event            | Sound                | Duration | Volume |
| ---------------- | -------------------- | -------- | ------ |
| Block drag start | Soft click           | 200ms    | Low    |
| Block removal    | Pop/dissolve         | 400ms    | Medium |
| Level complete   | Victory jingle       | 1.5s     | Medium |
| Error (dead-end) | Sad trombone (light) | 600ms    | Low    |

**Key:** Satisfying but NOT annoying. Loop-friendly.

### UI Components

```
┌─────────────────────────────┐
│  Level 15    Score: 1,250   │
│  Moves: 8 / 10             │
├─────────────────────────────┤
│                             │
│        [ Grid Board ]       │
│        (6x6 / 7x7)          │
│                             │
├─────────────────────────────┤
│  [Hint] [Undo] [Restart]    │
│  [Pause] [Settings]         │
└─────────────────────────────┘
```

---

## 🏆 Progression & Meta-Game

### Level Progression

```
Campaign Mode:
├─ Level 1-50 (Story progression)
├─ Level 51-100 (Challenge expansion)
└─ Level 101+ (Infinite / procedural)
```

### Unlockables

**By Level:**

- Level 10: Cosmetic block skins unlock
- Level 25: Challenge mode available
- Level 50: Speedrun leaderboard
- Level 100: Expert pack (time limits)

**By Achievement:**

- Solve without hints → Badge
- Solve in <X min → Badge
- 7-day streak → Cosmetic reward
- Speedrun top 10 → Leaderboard placement

### Cosmetics System

**Block Skins:**

- Default (locked/standard)
- Neon glow (earned: Level 10)
- Glass blocks (purchased: $0.99)
- Marble (earned: 50 levels)
- Custom colors (event rewards)

**Board Themes:**

- Classic grid
- Minimalist (no grid lines)
- Dark mode
- Ocean theme

---

## 🎮 Input & Controls

### Touch Input (Mobile)

```javascript
// Tap-to-select, drag-to-move
Tap Block → Highlight + show move zones
Drag → Visual feedback (semi-transparent)
Release → Confirm move (if valid)
```

### Mouse Input (Desktop)

```javascript
// Click-to-select, drag-to-move (same as touch)
Click Block → Select + highlight valid paths
Drag → Smooth animation
Release → Confirm
```

### Keyboard Input (Optional)

```
Arrow Keys → Navigate selected block
Space → Confirm move
R → Restart level
Esc → Pause/menu
```

---

## ⚙️ Game States

```
STATE MACHINE:

LOADING
  └─→ MAIN_MENU
       ├─→ LEVEL_SELECT
       │    └─→ GAMEPLAY
       │         ├─→ PAUSED
       │         └─→ LEVEL_COMPLETE
       │              └─→ NEXT_LEVEL / MAIN_MENU
       │
       └─→ SETTINGS
            └─→ MAIN_MENU
```

---

## 📱 Responsive Design

### Screen Breakpoints

| Device            | Grid Size | Tile Size | Optimal Play         |
| ----------------- | --------- | --------- | -------------------- |
| Mobile (320px)    | 6x6       | 40px      | Excellent            |
| Tablet (768px)    | 7x7       | 80px      | Excellent            |
| Desktop (1024px+) | 7x7       | 80px      | Good (bigger screen) |

**Strategy:** Adapt grid size (not tile size) for responsive play.

---

## 🔧 Special Features (Post-MVP)

### Challenge Mode (Week 2+)

```
- Time limit (3 min)
- Move limit (max 12 moves)
- Combo bonus (consecutive correct moves)
- Leaderboard ranking
```

### Daily Challenge (Week 3+)

```
- 1 puzzle/day
- Unique procedural level
- Global leaderboard
- Exclusive reward track
```

### Speedrun Mode (Month 2+)

```
- Optimize move count
- Beat personal best
- YouTube shareable times
- Ranking by level
```

---

## 📊 Analytics Events to Track

```javascript
// Core gameplay
LEVEL_STARTED
BLOCK_MOVED {blockId, fromPos, toPos, direction}
BLOCK_REMOVED {blockId, totalMovesForThis, time}
LEVEL_COMPLETED {moves, time, stars, deadEndsHit}
HINT_USED {blockId, hintType}
UNDO_USED {blockId, previousPos}

// Dead-End specific
DEAD_END_DETECTED {levelId, blocksAffected, moveCount}
DEAD_END_RESOLVED {method} // "undo" | "restart" | "hint"
INVALID_MOVE_ATTEMPTED {blockId, direction, reason} // "obstacle" | "block" | "boundary"

// Progression
PROGRESSION_CHECKPOINT (every 5 levels)
LEVEL_FAILED {reason, deadEndCount}
CHALLENGE_MODE_STARTED
SPEEDRUN_STARTED

// Engagement & retention
SESSION_START
SESSION_END
RETENTION_D1, D7, D30
DAILY_STREAK {days}
COSMETIC_UNLOCKED {itemId}

// Monetization (future)
AD_IMPRESSION
AD_CLICKED
IAP_ATTEMPTED
IAP_COMPLETED

// Debug/Tuning
LEVEL_DIFFICULTY_RATING (player feedback after level)
SOLUTION_VIEWED {blockSequence, optimalMoves}
```

### Dead-End Tuning Dashboard (Internal)

```
Per Level Metrics:
├─ Dead-end rate: % of players hitting dead-end
├─ Undo rate: % of players using undo
├─ Hint rate: % of players using hints
├─ Average moves to complete: vs optimal solution
├─ Average time to complete: expected range?
└─ Star distribution: How many get 3-stars vs 1-star?

Target metrics:
├─ Dead-end rate: 35-45% (if higher = too hard, tune)
├─ Undo rate: 20-30%
├─ Hint rate: 15-25%
└─ 3-star rate: 30-40% (not everyone should get 3-stars)
```

---

## 🔗 Related Documents

- [TECH_STACK.md](./TECH_STACK.md) - Implementation details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Code structure
- [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md) - Ad/IAP placement
