# GAME_DESIGN.md - Game Mechanics & Design

---

## 🎮 Core Mechanics

### The Game Loop

```
1. LEVEL STARTS
   ├─ Player see grid + block arrangement
   ├─ Can tap/drag block to move
   └─ Goal shown: "Remove all blocks"

2. GAMEPLAY
   ├─ Player drag block off board
   ├─ Order MATTERS (dependency chain)
   ├─ Wrong order = dead-end (no more moves)
   └─ Correct path = all blocks removed

3. WIN CONDITION
   ├─ All blocks removed = LEVEL UP
   ├─ Show completion time (optional)
   └─ Unlock next level

4. LOSE CONDITION (Dead-End)
   ├─ Player stuck (no valid moves)
   ├─ Show "Stuck! Restart?"
   └─ Rewarded video to continue or restart
```

---

## 📐 Grid System

### Board Specifications

| Aspect | Value | Reason |
|--------|-------|--------|
| Grid Size | 6x6 / 7x7 | Mobile screen fit |
| Tile Size | 50px (mobile), 80px (desktop) | Touch target friendly |
| Max Blocks | 20-25 | Solvable in <5 min |
| Empty Spaces | 10-15 | Room to move blocks |

### Movement Rules

**Valid Move:**
- Drag block horizontally/vertically OFF board
- Block must have clear path (no obstacles)
- Can remove block from any edge

**Invalid Move:**
- Block surrounded (no exit path)
- Block dependency unsolved (other blocks blocking)

---

## 🧩 Block Types & Logic

### Block Categories

**Type 1: Single Blocks**
```
[R] - Remove anytime
```

**Type 2: Linked Blocks (Group)**
```
[R][R]  - Both same color must be together
         - Remove as unit
```

**Type 3: Dependency Chain**
```
[B] on top of [R]  - Must remove [B] first
                   - Then [R]
```

**Type 4: Color Logic (Advanced)**
```
[R][B][R]  - Must remove matching pairs first
           - Or in specific sequence
```

### Block Properties

```javascript
interface Block {
  id: string              // Unique identifier
  color: Color            // Visual color
  position: [x, y]        // Grid coordinates
  size: [width, height]   // In grid units (1x1, 2x1, etc)
  linkedTo?: string[]     // Other block IDs
  removable: boolean      // Can be removed now?
  animation: string       // Removal effect
}
```

---

## 📊 Difficulty Progression

### Level Structure

**Early Levels (1-10): Tutorial Zone**
- Single color blocks
- 5-8 blocks total
- Obvious solution
- Focus: Learn mechanics

**Mid Levels (11-30): Expansion**
- Mixed colors
- 12-15 blocks
- Some thinking needed
- Focus: Optimize removal order

**Hard Levels (31-50): Challenge**
- Complex dependencies
- 18-25 blocks
- Multiple valid solutions (choose optimal)
- Focus: Strategy & planning

**Expert (50+): Mastery**
- Extreme constraints
- Minimum moves required
- Time pressure (optional speedrun mode)
- Focus: Optimization

### Difficulty Curve Algorithm

```
difficulty_score = blocks_count + (color_variations * 0.5) + (dependencies * 2)

Level 1: Score 5   → Easy tutorial
Level 10: Score 25  → Medium
Level 30: Score 55  → Hard
Level 50: Score 85+ → Expert
```

---

## 🎯 Level Design Philosophy

### Principles

1. **Solvability** - Always has solution (even if hard)
2. **Clarity** - Player understands rules after 5 sec
3. **Fairness** - Never unfair/random. Pure logic
4. **Progression** - New element per 5 levels
5. **Replayability** - Multiple solve paths for same level

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

**Block Removal:**
```
On Drag:
  ├─ Highlight valid drop zones
  └─ Dim invalid zones

On Remove:
  ├─ Particle effect (dissolve/explode)
  ├─ Color-matched particles
  └─ Brief "pop" sound (ASMR key)

On Level Complete:
  ├─ Confetti animation
  ├─ Victory sound
  └─ "Next Level" button
```

### Sound Design (ASMR Focus)

| Event | Sound | Duration | Volume |
|-------|-------|----------|--------|
| Block drag start | Soft click | 200ms | Low |
| Block removal | Pop/dissolve | 400ms | Medium |
| Level complete | Victory jingle | 1.5s | Medium |
| Error (dead-end) | Sad trombone (light) | 600ms | Low |

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

| Device | Grid Size | Tile Size | Optimal Play |
|--------|-----------|-----------|--------------|
| Mobile (320px) | 6x6 | 40px | Excellent |
| Tablet (768px) | 7x7 | 80px | Excellent |
| Desktop (1024px+) | 7x7 | 80px | Good (bigger screen) |

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
BLOCK_MOVED
LEVEL_COMPLETED
LEVEL_FAILED
HINT_USED
UNDO_USED (if supported)

// Monetization
AD_IMPRESSION
AD_CLICKED
IAP_ATTEMPTED
IAP_COMPLETED

// Engagement
SESSION_START
SESSION_END
PROGRESSION_CHECKPOINT (every 5 levels)
RETENTION_D1, D7, D30
```

---

## 🔗 Related Documents

- [TECH_STACK.md](./TECH_STACK.md) - Implementation details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Code structure
- [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md) - Ad/IAP placement
