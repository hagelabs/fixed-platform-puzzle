import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./Constants";
import { BootScene } from "../scenes/BootScene";
import { MenuScene } from "../scenes/MenuScene";
import { LevelSelectScene } from "../scenes/LevelSelectScene";
import { GameScene } from "../scenes/GameScene";
import { TutorialScene } from "../scenes/TutorialScene";
import { PauseScene } from "../scenes/PauseScene";
import { GameOverScene } from "../scenes/GameOverScene";

function computeZoom(): number {
  if (typeof window === "undefined") return 1;
  const dpr = window.devicePixelRatio || 1;
  const fitScale = Math.min(
    window.innerWidth / GAME_WIDTH,
    window.innerHeight / GAME_HEIGHT
  );
  // Backing buffer = GAME_WIDTH * zoom. Match physical pixels = CSS_size * dpr.
  // CSS_size = GAME_WIDTH * fitScale, so backing target = GAME_WIDTH * fitScale * dpr.
  // Cap at 4 to bound GPU memory; floor at dpr so tiny windows still get DPR-sharp text.
  const target = Math.max(dpr, fitScale * dpr);
  return Math.min(4, target);
}

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0d1117",
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
    powerPreference: "high-performance",
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    zoom: computeZoom(),
  },
  audio: {
    noAudio: true,
  },
  scene: [
    BootScene,
    MenuScene,
    LevelSelectScene,
    GameScene,
    TutorialScene,
    PauseScene,
    GameOverScene,
  ],
};
