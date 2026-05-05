import { Color } from "../types/Game";

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 600;

export const CELL_SIZE = 80;
export const BOARD_PADDING = 16;

export const HUD_HEIGHT = 70;

export const COLORS: Record<Color, number> = {
  red: 0xe56b6f,
  blue: 0x7fb7e8,
  green: 0xb8e5c8,
  yellow: 0xffd96a,
  purple: 0xc9a4d8,
  orange: 0xf2a76b,
};

export const DRAG_THRESHOLD = 12;
export const TOTAL_LEVELS = 25;

export const SCENE_KEYS = {
  Boot: "BootScene",
  Menu: "MenuScene",
  LevelSelect: "LevelSelectScene",
  Game: "GameScene",
  Tutorial: "TutorialScene",
  Pause: "PauseScene",
  GameOver: "GameOverScene",
} as const;

export const FONT_HEADER = '"Bungee", "Arial Black", sans-serif';
export const FONT_BODY = '"Arial Black", "Helvetica Neue", Arial, sans-serif';
