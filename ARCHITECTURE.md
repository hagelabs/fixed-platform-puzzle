# ARCHITECTURE.md - Code Architecture & Design Patterns

---

## 🏗️ Architecture Overview

### High-Level Design

```
┌─────────────────────────────────────┐
│      Phaser Game Instance           │
├─────────────────────────────────────┤
│   Game Scenes (MenuScene, etc)      │
├─────────────────────────────────────┤
│   Managers (Input, Audio, Ads)      │
├─────────────────────────────────────┤
│   Game State (Zustand Store)        │
├─────────────────────────────────────┤
│   Systems (Movement, Collision)     │
├─────────────────────────────────────┤
│   Entities (Block, Grid, Level)     │
├─────────────────────────────────────┤
│   Platform SDK Layer (Poki/Crazy)   │
└─────────────────────────────────────┘
```

---

## 📦 Core Components

### 1. Game State (Zustand)

```typescript
// src/managers/GameStateManager.ts

interface GameState {
  // UI
  currentScene: string;
  isPaused: boolean;

  // Progression
  currentLevel: number;
  totalLevels: number;
  unlockedLevel: number;

  // Gameplay
  moves: number;
  score: number;
  hints: number;

  // Player Data
  playerName: string;
  totalSessions: number;
  d1Retention: boolean;

  // Cosmetics
  selectedBlockSkin: string;
  selectedBoardTheme: string;
}

// Store creation
export const useGameStore = create<GameState>((set, get) => ({
  currentScene: 'MENU',
  isPaused: false,
  currentLevel: 1,
  
  // Actions
  setCurrentScene: (scene: string) => set({ currentScene: scene }),
  incrementScore: (points: number) => 
    set(state => ({ score: state.score + points })),
  
  // Persist to localStorage
  persist: {
    name: 'game-state',
    getStorage: () => localStorage,
  },
}));
```

### 2. Scenes

**Pattern:** Each Phaser Scene = one screen/state

```typescript
// src/scenes/GameScene.ts

export class GameScene extends Phaser.Scene {
  private grid!: Grid;
  private blocks: Block[] = [];
  private inputManager!: InputManager;
  private audioManager!: AudioManager;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load assets (images, audio)
  }

  create() {
    // Initialize game objects
    this.grid = new Grid(this, 6, 6);
    this.loadLevel();
    this.inputManager = new InputManager(this);
    this.audioManager = new AudioManager();
  }

  update(time: number, delta: number) {
    // Per-frame logic
  }

  private loadLevel() {
    const { currentLevel } = useGameStore.getState();
    const levelData = LEVELS[currentLevel];
    
    this.blocks = [];
    levelData.blocks.forEach(blockData => {
      const block = new Block(this, blockData);
      this.blocks.push(block);
    });
  }
}
```

### 3. Entities

**Pattern:** Self-contained game objects

```typescript
// src/entities/Block.ts

export class Block extends Phaser.GameObjects.Container {
  private blockId: string;
  private color: string;
  private gridPosition: [number, number];
  private isDragging = false;
  private initialPosition: [number, number];

  constructor(scene: Phaser.Scene, data: BlockData) {
    super(scene);
    this.blockId = data.id;
    this.color = data.color;
    this.gridPosition = data.position;
    
    this.setupGraphics();
    this.setupInteractivity();
  }

  private setupGraphics() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.getColorHex(this.color), 1);
    graphics.fillRect(0, 0, 50, 50);
    this.add(graphics);
  }

  private setupInteractivity() {
    this.setInteractive();
    this.on('pointerdown', () => this.onDragStart());
    this.on('pointermove', (pointer: Phaser.Input.Pointer) => this.onDrag(pointer));
    this.on('pointerup', () => this.onDragEnd());
  }

  public isRemovable(): boolean {
    // Check if block can be removed
    return true; // simplified
  }

  public remove() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => this.destroy(),
    });
  }
}
```

### 4. Managers

**Pattern:** Singleton-like managers for specific domains

```typescript
// src/managers/InputManager.ts

export class InputManager {
  private selectedBlock: Block | null = null;
  private pointers = new Map<number, Phaser.Input.Pointer>();

  constructor(private scene: Phaser.Scene) {
    this.setupInputListeners();
  }

  private setupInputListeners() {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const block = this.getBlockAtPointer(pointer);
      if (block?.isRemovable()) {
        this.selectedBlock = block;
        this.scene.events.emit('block:selected', block);
      }
    });

    this.scene.input.on('pointerup', () => {
      if (this.selectedBlock) {
        this.scene.events.emit('block:released', this.selectedBlock);
        this.selectedBlock = null;
      }
    });
  }

  private getBlockAtPointer(pointer: Phaser.Input.Pointer): Block | null {
    // Logic to find block under pointer
    return null;
  }
}
```

### 5. Systems

**Pattern:** Pure logic systems decoupled from Phaser

```typescript
// src/systems/MovementSystem.ts

export class MovementSystem {
  public canMoveBlock(
    block: Block,
    grid: Grid,
    direction: Direction
  ): boolean {
    const nextPos = this.calculateNextPosition(block.position, direction);
    
    // Check if next position is valid
    return grid.isEmpty(nextPos) && !grid.isOutOfBounds(nextPos);
  }

  public moveBlock(block: Block, direction: Direction): void {
    const nextPos = this.calculateNextPosition(block.position, direction);
    block.moveTo(nextPos);
  }

  private calculateNextPosition(
    current: [number, number],
    direction: Direction
  ): [number, number] {
    const [x, y] = current;
    switch (direction) {
      case 'UP': return [x, y - 1];
      case 'DOWN': return [x, y + 1];
      case 'LEFT': return [x - 1, y];
      case 'RIGHT': return [x + 1, y];
    }
  }
}
```

---

## 🔄 Data Flow

### Level Progression Flow

```
Game Start
    ↓
[Load Level Data] (from LEVELS[currentLevel])
    ↓
[Create Blocks] (instantiate Block entities)
    ↓
[Render Grid] (visual board)
    ↓
[Wait Input] (player interacts)
    ↓
[Validate Move] (MovementSystem.canMove())
    ↓
[Update Block Position] (grid + visual)
    ↓
[Check Win Condition] (all blocks removed?)
    ├─ YES → Level Complete
    │         └─ Save Progress
    │         └─ Unlock Next Level
    │         └─ Show Reward
    │
    └─ NO → Wait Input (back to [Wait Input])
```

### State Persistence Flow

```
Game State (Zustand)
    ↓
On Change
    ↓
[Serialize to localStorage]
    ↓
On App Load
    ↓
[Deserialize from localStorage]
    ↓
[Restore Game State]
```

---

## 🎯 Key Design Patterns

### 1. Service Locator (Managers)

```typescript
// Easy access to managers
export const ServiceLocator = {
  getAudioManager: () => AudioManager.instance,
  getAdManager: () => AdManager.instance,
  getAnalytics: () => AnalyticsManager.instance,
};

// Usage
const audio = ServiceLocator.getAudioManager();
audio.play('block-remove');
```

### 2. Observer Pattern (Events)

```typescript
// Emit events
this.scene.events.emit('level:complete', { level: 5, score: 1200 });

// Listen to events
this.scene.events.on('level:complete', (data) => {
  useGameStore.setState({ currentLevel: data.level + 1 });
});
```

### 3. Command Pattern (Actions)

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class RemoveBlockCommand implements Command {
  constructor(private block: Block) {}

  execute() {
    this.block.remove();
  }

  undo() {
    this.block.restore();
  }
}
```

### 4. Factory Pattern (Entity Creation)

```typescript
export class BlockFactory {
  static createBlock(
    scene: Phaser.Scene,
    type: BlockType,
    position: [number, number]
  ): Block {
    const config = BLOCK_CONFIGS[type];
    return new Block(scene, {
      ...config,
      position,
    });
  }
}
```

---

## 📊 Type System

### Key Interfaces

```typescript
// src/types/Game.ts

export interface BlockData {
  id: string;
  color: Color;
  position: [number, number];
  size: [width: number, height: number];
  linkedTo?: string[];
}

export interface LevelData {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  blocks: BlockData[];
  maxMoves?: number;
  timeLimit?: number;
}

export interface GameProgress {
  currentLevel: number;
  unlockedLevel: number;
  totalScore: number;
  achievements: string[];
}

export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// src/__tests__/systems/MovementSystem.test.ts

describe('MovementSystem', () => {
  let system: MovementSystem;

  beforeEach(() => {
    system = new MovementSystem();
  });

  it('should allow valid moves', () => {
    const block = { position: [0, 0] };
    const grid = { isEmpty: () => true, isOutOfBounds: () => false };
    
    const result = system.canMoveBlock(block, grid, 'RIGHT');
    expect(result).toBe(true);
  });

  it('should prevent out-of-bounds moves', () => {
    const block = { position: [6, 0] };
    const grid = { isEmpty: () => true, isOutOfBounds: () => true };
    
    const result = system.canMoveBlock(block, grid, 'RIGHT');
    expect(result).toBe(false);
  });
});
```

### Integration Tests

```typescript
// Test full level flow
describe('GameScene', () => {
  it('should complete level when all blocks removed', async () => {
    // Setup scene
    // Simulate moves
    // Assert level complete
  });
});
```

---

## 🔐 Error Handling

### Error Boundaries

```typescript
export class ErrorHandler {
  static handleGameError(error: Error, context: string) {
    console.error(`[${context}] ${error.message}`);
    
    // Track to analytics
    AnalyticsManager.instance.logError({
      context,
      message: error.message,
      stack: error.stack,
    });

    // Show user-friendly message (not technical)
    showErrorNotification('Something went wrong. Restarting...');
    
    // Attempt recovery
    this.attemptRecovery(context);
  }

  private static attemptRecovery(context: string) {
    // Reload scene or reset game state
  }
}
```

---

## 📈 Performance Optimization

### Lazy Loading

```typescript
// Don't load all levels at startup
const getLevelData = async (levelId: number) => {
  // Load on demand
  return LEVELS[levelId];
};
```

### Object Pooling

```typescript
export class BlockPool {
  private available: Block[] = [];
  private inUse: Block[] = [];

  get(config: BlockData): Block {
    const block = this.available.pop() || new Block(config);
    this.inUse.push(block);
    return block;
  }

  release(block: Block) {
    this.inUse = this.inUse.filter(b => b !== block);
    this.available.push(block);
  }
}
```

---

## 🔗 Related Documents

- [TECH_STACK.md](./TECH_STACK.md) - Dependencies
- [GAME_DESIGN.md](./GAME_DESIGN.md) - Game logic
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Implementation order
