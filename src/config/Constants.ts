import { Color } from '../types/Game';

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 600;

export const CELL_SIZE = 80;
export const BOARD_PADDING = 16;

export const HUD_HEIGHT = 70;

export const COLORS: Record<Color, number> = {
  red: 0xff5555,
  blue: 0x4488ff,
  green: 0x55cc55,
  yellow: 0xffcc44,
  purple: 0xaa55ff,
  orange: 0xff8844,
};

export const DRAG_THRESHOLD = 12;
export const TOTAL_LEVELS = 50;

export const SCENE_KEYS = {
  Boot: 'BootScene',
  Menu: 'MenuScene',
  LevelSelect: 'LevelSelectScene',
  Game: 'GameScene',
  Tutorial: 'TutorialScene',
  Pause: 'PauseScene',
  GameOver: 'GameOverScene',
} as const;

export const FONT_HEADER = '"Bungee", "Arial Black", sans-serif';
export const FONT_BODY = 'Arial, sans-serif';
