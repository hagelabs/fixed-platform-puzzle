# 🎮 The Kinetic Puzzle - Complete Level Design Prompt

**Versi:** 1.0  
**Untuk Game:** The Kinetic Puzzle (Phaser 4)  
**Format:** All-in-One Comprehensive Guide

---

## TABLE OF CONTENTS

1. Quick Start
2. Game Mechanics Reference
3. Difficulty Factors
4. Level Template & Format
5. Solvability Verification
6. Request Examples
7. AI Checklist
8. Red Flags
9. Progression Framework

---

## QUICK START

### For Redesigning Existing Level

REQUEST:

Make Level 7 harder.

Current state:

- Grid: 8x8
- Blocks: 4 simple red blocks
- Obstacles: 2
- No dependencies, no constraints
- Current playtime: ~30 seconds

Target difficulty:

- Playtime: 60-90 seconds
- Add: 1 constrained block (yellow)
- Add: 1 dependency chain (depth 1)
- Keep grid 8x8

Constraints:

- Must remain learnable
- Keep complexity medium

DELIVER:

1. New grid layout (ASCII)
2. Block definitions
3. Step-by-step solution
4. Solvability verification
5. Difficulty breakdown

---

## GAME MECHANICS REFERENCE

### Mechanic 1: Sliding Momentum

Player swipes/drags block → Block slides until hitting Wall/Obstacle/Block

Example:
0 1 2 3 4
0 # # # # #
1 # R . . #

Drag R right: (1,1) → (1,4) [hits wall]

### Mechanic 2: Removal Phase

Block at exit zone → Player drag out → Block removed

Example:
Block at (1,4) = RIGHT edge
Player drag out: Block REMOVED ✓

### Mechanic 3: Constrained Exits

Red Block: Any exit
Yellow Block (↑↓←→): Only matching direction
Blue Block: Locked until dependency resolved

Example:
Yellow with ↑ = TOP exit only
Yellow with → = RIGHT exit only

### Mechanic 4: Dependency Chains

A depends B = A locked until B removed
A→B→C = Remove C, then B, then A

CRITICAL: No circular dependencies (A depends B, B depends A = invalid)

### Mechanic 5: Obstacles

Static, cannot move, act as collision points

Example:
0 1 2 3 4
0 # # # # #
1 # R . O #

Drag R right: hits O, stops at (1,2)

---

## DIFFICULTY FACTORS

### Factor 1: Dependency Depth

| Depth | Difficulty              |
| ----- | ----------------------- |
| 0     | Easy (all independent)  |
| 1     | Medium (A depends B)    |
| 2     | Hard (A→B→C)            |
| 3+    | Very Hard (long chains) |

### Factor 2: Constrained Exits

| Pattern                   | Difficulty |
| ------------------------- | ---------- |
| All simple                | Easy       |
| 1-2 constrained           | Medium     |
| 3+ constrained mixed      | Hard       |
| All constrained + complex | Very Hard  |

### Factor 3: Spatial Dead-Ends

| Scenario                      | Difficulty |
| ----------------------------- | ---------- |
| Open grid                     | Easy       |
| 2-3 obstacles                 | Medium     |
| 4+ obstacles                  | Hard       |
| Block multiple simultaneously | Very Hard  |

### Factor 4: Visual Complexity

| Scenario           | Difficulty |
| ------------------ | ---------- |
| 6x6 + 3 blocks     | Easy       |
| 8x8 + 4-5 blocks   | Medium     |
| 9x9 + 6 blocks     | Hard       |
| 10x10+ + 7+ blocks | Very Hard  |

### Factor 5: Execution Complexity

| Scenario                   | Difficulty |
| -------------------------- | ---------- |
| Linear A→B→C               | Easy       |
| Partial parallelism        | Medium     |
| Complex interleaving       | Hard       |
| Blocking/unblocking cycles | Very Hard  |

---

## LEVEL TEMPLATE & FORMAT

### Complete Level Definition

LEVEL [X]: [Name/Theme]

GRID LAYOUT:

0 1 2 3 4 5 6 7 8
0 # # # # # # # # #
1 # . . O . . . . #
2 # R1. . . . Y1. #
3 # . . . . . . . #
4 # . . B1. . . . #
5 # # # # # # # # #

LEGEND:

- # = Wall
- . = Empty
- O = Obstacle
- R = Red (Simple)
- Y = Yellow (Constrained)
- B = Blue (Dependent)

BLOCKS DEFINITION:

Block R1 (Red - Simple):

- Position: (2, 1)
- Exit constraint: NONE
- Dependency: NONE
- Outcome: Must be removed

Block Y1 (Yellow - Constrained):

- Position: (2, 6)
- Exit constraint: RIGHT (→)
- Dependency: NONE
- Outcome: Must be removed

Block B1 (Blue - Dependent):

- Position: (4, 3)
- Exit constraint: NONE
- Depends on: Y1
- Outcome: Must be removed

OBSTACLES:

- O1: (1, 4)
- O2: (5, 6)

SOLVABILITY CHECKLIST:
✓ Total blocks: 3
✓ Dependent blocks: 1
✓ Max dependency depth: 1
✓ All blocks reachable: YES
✓ No circular dependencies: YES

DIFFICULTY ASSESSMENT:

Dependency Factor: Medium
→ Single depth-1 chain

Constraint Factor: Easy-Medium
→ Only 1 constrained block

Spatial Factor: Medium
→ 9x9 grid with 2 obstacles

Execution Factor: Easy
→ Clear removal order

OVERALL DIFFICULTY: Medium
TARGET PLAYTIME: 60-90 seconds

---

## SOLVABILITY VERIFICATION

### Solution Path

Step 1: Move R1 right

- (2,1) → (2,8) [hits wall]
- R1 at RIGHT edge

Step 2: Drag R1 out

- R1 REMOVED ✓

Step 3: Move Y1 right

- (2,6) → (2,8) [hits wall]
- Y1 at RIGHT edge
- Constraint: RIGHT (→) ✓ MATCHES

Step 4: Drag Y1 out

- Y1 REMOVED ✓
- B1 now unlocked

Step 5: Move B1 left

- B1 depends Y1 → Y1 removed ✓
- (4,3) → (4,1) [hits wall]
- B1 at LEFT edge

Step 6: Drag B1 out

- B1 REMOVED ✓

FINAL RESULT:

- All blocks removed
- Level SOLVABLE ✓

### Dependency Validation

B1 → Y1

- No circular dependencies ✓
- All dependencies resolvable ✓

### Reachability Check

Can R1 reach exit? (2,1) → (2,8) = RIGHT edge ✓
Can Y1 reach RIGHT exit? (2,6) → (2,8) = RIGHT edge ✓
Can B1 reach exit? After Y1 removed: (4,3) → (4,1) = LEFT edge ✓

ALL BLOCKS REACHABLE ✓

---

## REQUEST EXAMPLES

### Example 1: Redesign

REQUEST:

Make Level 10 harder.

CURRENT:

- Grid: 8x8
- Blocks: 3 red, 1 yellow
- Obstacles: 2
- No dependencies
- Playtime: 45 sec

TARGET:

- Playtime: 90-120 sec
- Add: 1 dependent (blue)
- Add: 1 constrained (yellow)
- Add: 1 obstacle
- Keep grid 8x8

DELIVER:

1. New grid (ASCII)
2. Block definitions
3. Step-by-step solution
4. Solvability verification
5. Difficulty breakdown
6. Comparison to Level 9

---

### Example 2: Create New

REQUEST:

Create Level 18 (hard level, expert phase).

SPECIFICATIONS:

- Grid: 9x9
- Blocks: 6 total (2 red, 2 yellow, 2 blue)
- Obstacles: 4
- Dependency depth: max 2
- Include: 1 false path

DIFFICULTY:

- Dependency: Hard (depth 2)
- Constraint: Medium-Hard
- Spatial: Hard
- Playtime: 120-150 sec

DELIVER:

1. Complete grid (ASCII)
2. Block definitions (all 6)
3. Full solution path
4. Dependency graph
5. Reachability proof
6. Difficulty assessment
7. Design rationale

---

## AI CHECKLIST

AI MUST deliver ALL:

✓ Grid layout (ASCII)
✓ Block definitions (all with type, position, constraints, dependency)
✓ Obstacle positions
✓ Step-by-step solution (every move)
✓ Dependency validation (no circular deps)
✓ Reachability proof (all blocks can reach valid exit)
✓ Dead-end analysis
✓ Difficulty breakdown (each factor rated)
✓ Overall difficulty stated
✓ Target playtime estimated
✓ Comparison to adjacent levels
✓ Design rationale
✓ Final confirmation: "Level SOLVABLE: YES ✓"

---

## RED FLAGS

❌ CRITICAL (Must fix):

- Circular dependency (A→B, B→A)
- Impossible constraint (Yellow ↑ at bottom edge, no top exit)
- Unreachable block (surrounded, no path to exit)
- Broken dependency chain (parent unreachable)
- Non-existent parent (depends on block that doesn't exist)

⚠️ WARNING (Reconsider):

- No clear aha moment
- Solution too obvious
- False path without purpose
- Inconsistent difficulty curve
- Too many blocks for grid size

---

## PROGRESSION FRAMEWORK

### Phase 1: Introduction (Levels 1-5)

Level 1: 6x6, 1 red, 0 obstacles, no deps → Easy (15-30 sec)
Level 2: 6x6, 2-3 red, 0-1 obstacles, no deps → Easy (20-40 sec)
Level 3: 7x7, 1 red + 1 yellow, 1 obstacle, no deps → Easy (30-50 sec)
Level 4: 7x7, 1 red + 1 blue, 1 obstacle, depth 1 → Easy-Med (40-60 sec)
Level 5: 7x7, 2 red + 1 yellow + 1 blue, 1-2 obstacles, depth 1 → Med (45-70 sec)

### Phase 2: Foundation (Levels 6-10)

Level 6: 8x8, 2R+1Y+1B, 2-3 obstacles, depth 1 → Med (60-90 sec)
Level 7: 8x8, 2R+2Y, 2 obstacles, simple → Med (60-90 sec)
Level 8: 8x8, 2R+2Y+1B, 2-3 obstacles, depth 2 → Med-Hard (75-105 sec)
Level 9: 8x8, 3R+1Y, 3 obstacles, depth 1, false path → Med-Hard (75-100 sec)
Level 10: 8x8, 2R+2Y+1B, 3 obstacles, depth 2 → Med-Hard (90-120 sec)

### Phase 3: Advanced (Levels 11-17)

Level 11: 9x9, 2R+2Y+2B, 3-4 obstacles, parallel chains → Hard (100-130 sec)
Level 12: 9x9, 2R+2Y+1B, 3 obstacles, constrained+dependent → Hard (100-140 sec)
Level 13: 9x9+, 3R+2Y+1B, 4 obstacles, depth 2 → Hard (110-150 sec)
Level 14: 9x9, 1R+3Y, 3 obstacles, no deps → Hard (100-140 sec)
Level 15: 9x9, 2R+2Y+2B, 4 obstacles, depth 2+spatial → Hard (120-160 sec)
Level 16: 9x9, 2R+2Y+1B, 4 obstacles, false path mastery → Hard (120-160 sec)
Level 17: 10x9, 3R+2Y+2B, 4-5 obstacles, parallel/depth 2 → Hard (140-180 sec)

### Phase 4: Expert (Levels 18-25)

Levels 18-20: Depth 3+, interacting systems → Very Hard (150-200+ sec)
Levels 21-23: Max complexity, 10x10+, 7-8 blocks → Very Hard (180-240+ sec)
Levels 24-25: Elegant endgame, balanced design → Hard→Med (120-180 sec)

---

## KEY PRINCIPLES

✓ Solvability is non-negotiable
✓ Difficulty = understanding, not punishment
✓ Curve must be smooth (max 15% jump)
✓ Mechanics teach organically
✓ Player satisfaction first

---

**Version:** 1.0 | **Status:** Complete & Ready | **Last Updated:** 2025
