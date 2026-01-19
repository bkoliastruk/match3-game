import type { GemColors, Figures } from '../types/types';

// Gems configuration
export const GEM_COLORS: GemColors[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// Board configuration
export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;

// Visual configuration
export const CELL_SIZE = 60; // size of pixels
export const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;
export const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;

// Speed animation
export const ANIMATION_SPEED = 0.2;

// Figure/Color mapping
export const FIGURE_COLOR_MAPPING: Record<GemColors, Figures> = {
    red: 'triangle',
    blue: 'polygon',
    green: 'polygon',
    yellow: 'square',
    purple: 'circle',
    orange: 'circle'
};

export const GEM_COLOR_ID_MAPPING: Record<GemColors, string> = {
    red: '#e74c3c',
    blue: '#3498db',
    green: '#2ecc71',
    yellow: '#f1c40f',
    purple:'#9b59b6',
    orange: '#e67e22'
}

export const BACKGROUND_COLOR: string = '#2c4359';

// Default VALUES
export const DEFAULT_COLOR_ID: string = '#95a5a6';
export const DEFAULT_FIGURE_NAME: string = 'circle';