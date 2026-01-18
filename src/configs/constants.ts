import type { GemType } from '../types/types';

// Gems configuration
export const GEM_COLORS: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// Board configuration
export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;

// Visual configuration
export const CELL_SIZE = 60; // size of pixels
export const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;
export const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;

// Speed animation
export const ANIMATION_SPEED = 0.2;