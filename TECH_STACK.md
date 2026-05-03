# TECH_STACK.md - Technology Stack & Requirements

---

## 🛠️ Technology Overview

### Recommended Stack

```
Frontend Framework: Phaser 3
Language: TypeScript
Build Tool: Webpack 5
Package Manager: npm
Runtime: Browser (WebGL 2.0)
State: Zustand (lightweight)
Build Target: HTML5 / WebGL
```

### Why Phaser 3?

| Aspect | Phaser 3 | Reason |
|--------|----------|--------|
| Portal Support | ✓ Excellent | Native support Poki/CrazyGames |
| Documentation | ✓ Complete | 23+ tutorials available |
| File Size | ✓ Optimal | ~500KB minified (good for web) |
| 2D Puzzle | ✓ Perfect | Canvas 2D rendering ideal |
| Physics | Limited | OK - grid-based (no real physics needed) |
| Community | ✓ Active | Good plugins ecosystem |
| Licensing | GPL-3.0 | Free (OK for F2P) |

---

## 📦 Dependencies

### Core

```json
{
  "phaser": "^3.55.2",
  "typescript": "^5.0.0",
  "zustand": "^4.4.0"
}
```

### Build & Dev

```json
{
  "webpack": "^5.88.0",
  "webpack-cli": "^5.1.0",
  "ts-loader": "^9.5.0",
  "terser-webpack-plugin": "^5.3.9",
  "compression-webpack-plugin": "^10.2.0"
}
```

### Ad Networks (Multi-provider)

```json
{
  "gumroad-sdk": "optional",
  "adunit": "optional"
}
```

Note: SDKs optional. Integrate programmatically via script tags.

---

## 🏗️ Project Structure

```
src/
├── main.ts                 // Entry point
├── config/
│   ├── GameConfig.ts       // Phaser config
│   ├── Constants.ts        // Game constants
│   └── Levels.ts           // Level definitions
│
├── scenes/
│   ├── BootScene.ts        // Preload, init
│   ├── MenuScene.ts        // Main menu UI
│   ├── GameScene.ts        // Main gameplay
│   ├── PauseScene.ts       // Pause overlay
│   └── GameOverScene.ts    // Level complete/failed
│
├── entities/
│   ├── Block.ts            // Block entity
│   ├── Grid.ts             // Grid manager
│   └── Level.ts            // Level data
│
├── managers/
│   ├── GameStateManager.ts // Game state (Zustand)
│   ├── InputManager.ts     // Touch/mouse input
│   ├── AudioManager.ts     // Sound effects
│   ├── AdManager.ts        // Ad handling
│   └── AnalyticsManager.ts // Event tracking
│
├── systems/
│   ├── LevelSystem.ts      // Level progression
│   ├── ScoreSystem.ts      // Scoring logic
│   ├── MovementSystem.ts   // Block movement
│   └── CollisionSystem.ts  // Validation
│
├── utils/
│   ├── PlatformDetect.ts   // Device detection
│   ├── MobileOptimize.ts   // Mobile tweaks
│   ├── Performance.ts      // Performance tools
│   └── Helpers.ts          // Utility functions
│
├── types/
│   ├── Game.ts             // Game interfaces
│   ├── Block.ts            // Block types
│   └── Level.ts            // Level types
│
└── assets/
    ├── images/             // Sprites, UI graphics
    ├── audio/              // Sound effects
    └── data/               // Level JSON
```

---

## 🔧 Build Configuration

### Webpack Setup

```javascript
// webpack.config.js (Key parts)

module.exports = {
  mode: 'production',
  
  entry: './src/main.ts',
  output: {
    filename: 'game.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },

  plugins: [
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotli',
      test: /\.(js|css|html)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],

  devServer: {
    port: 3000,
    hot: true,
    compress: true,
  },
};
```

### Size Optimization

**Target:** Initial load ≤20MB

```bash
# Build & analyze
npm run build
npm run analyze

# Expected output:
# game.min.js.br: ~450KB
# assets/: ~2-3MB
# Total: ~2.5-3.5MB (compressed)
```

---

## 💻 Development Setup

### Prerequisites

```bash
# Node.js 18+
node -v  # v18.0.0 or higher

# npm 9+
npm -v   # 9.0.0 or higher
```

### Installation

```bash
# Clone repo / initialize
git clone <repo>
cd fixed-platform-puzzle

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Setup

```bash
# .env.local (development)
VITE_POKI_SDK_ENABLED=false
VITE_CRAZY_GAMES_SDK_ENABLED=false
VITE_ANALYTICS_ENABLED=false

# .env.production
VITE_POKI_SDK_ENABLED=true
VITE_CRAZY_GAMES_SDK_ENABLED=true
VITE_ANALYTICS_ENABLED=true
```

---

## 🎮 Phaser 3 Configuration

```typescript
// src/config/GameConfig.ts

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS, // Canvas for better mobile perf
  
  render: {
    pixelArt: true,      // Sharp pixel graphics
    antialias: false,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 1200,
    expandParent: true,
    min: {
      width: 240,
      height: 300,
    },
    max: {
      width: 1920,
      height: 2400,
    },
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }, // No gravity needed
    },
  },

  scene: [
    BootScene,
    MenuScene,
    GameScene,
    PauseScene,
    GameOverScene,
  ],
};
```

---

## 📱 Browser Compatibility

### Required Support

| Browser | Minimum | Notes |
|---------|---------|-------|
| Chrome | 80+ | Full support |
| Firefox | 75+ | Full support |
| Safari | 13+ | Full support |
| Edge | 80+ | Full support |
| Mobile Safari | 13+ | iOS touch support |
| Chrome Mobile | 80+ | Android support |

### WebGL Requirements

- WebGL 2.0 preferred (fallback to WebGL 1.0)
- Canvas 2D as backup renderer

---

## 🔌 SDK Integration

### Poki SDK

```javascript
// In HTML head
<script src="https://cdn.poki.com/sdk.js"></script>

// In game code
if (typeof PokiSDK !== 'undefined') {
  PokiSDK.init()
    .then(() => console.log('Poki SDK ready'))
    .catch(err => console.error('Poki SDK error', err));
}

// Events to track
PokiSDK.gameStart?.();
PokiSDK.gameLoadingStart?.();
PokiSDK.gameLoadingStop?.();
```

### CrazyGames SDK v3

```javascript
// In HTML head
<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>

// In game code
CrazyGames.SDK.init()
  .then(() => console.log('CrazyGames SDK ready'))
  .catch(err => console.error('CrazyGames SDK error', err));

// Track events
CrazyGames.SDK.game.gameplay?.();
CrazyGames.SDK.game.adStart?.();
CrazyGames.SDK.game.adEnd?.();
```

---

## 📊 Performance Targets

### Load Time

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial JS | <2s | Time to first interactable game |
| Total Assets | <5s | All images/audio loaded |
| First Frame | <100ms | Frame time after load |

### Runtime Performance

| Metric | Target | Note |
|--------|--------|------|
| FPS | 60 stable | Desktop & mobile |
| Memory | <80MB | On device |
| CPU Usage | <30% | Mobile average |

### Asset Size

```
game.min.js (bundle): ~450KB
game.min.css: ~50KB
Images (spritesheet): ~2MB
Audio (ASMR): ~500KB
Total: ~3MB (before compression)
After Brotli: ~800KB
```

---

## 🧪 Testing Stack

### Unit Testing

```json
{
  "jest": "^29.0.0",
  "ts-jest": "^29.0.0"
}
```

### E2E Testing (Optional)

```json
{
  "playwright": "^1.40.0"
}
```

### Performance Testing

```bash
npm run lighthouse  # Speed metrics
npm run bundle-analyze  # Size analysis
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build

# Output directory: dist/
# ├── game.min.js
# ├── game.min.js.br (compressed)
# ├── index.html
# └── assets/
```

### Hosting Options

1. **Poki Direct** - Upload via dashboard
2. **CrazyGames Direct** - Upload via portal
3. **Own Hosting** - Netlify / Vercel (optional)

### File Structure for Portal

```
dist/
├── index.html         (entry point)
├── game.min.js        (core game)
├── images/            (sprites, UI)
├── audio/             (sounds)
└── manifest.json      (optional)
```

---

## 📚 Learning Resources

### Phaser 3
- [Official Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Tutorials](https://phaser.io/tutorials)
- [Examples](https://labs.phaser.io/)

### TypeScript
- [Handbook](https://www.typescriptlang.org/docs/)
- [Game Type Definitions](https://github.com/photonstorm/phaser/tree/master/types)

### Web Performance
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

---

## 🔗 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Code patterns
- [SUBMISSION_REQUIREMENTS.md](./SUBMISSION_REQUIREMENTS.md) - Platform specs
- [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) - Timeline
