import { Color } from '../types/Game';

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 1200;

export const CELL_SIZE = 120;
export const BOARD_PADDING = 24;

export const HUD_HEIGHT = 140;

export const COLORS: Record<Color, number> = {
  red: 0xff5555,
  blue: 0x4488ff,
  green: 0x55cc55,
  yellow: 0xffcc44,
  purple: 0xaa55ff,
  orange: 0xff8844,
};

export const DRAG_THRESHOLD = 20;
export const TOTAL_LEVELS = 50;

export const SCENE_KEYS = {
  Boot: 'BootScene',
  Menu: 'MenuScene',
  LevelSelect: 'LevelSelectScene',
  Game: 'GameScene',
  Pause: 'PauseScene',
  GameOver: 'GameOverScene',
} as const;
