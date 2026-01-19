import { CELL_SIZE } from '../configs/constants';
import type { GemColors } from '../types/types';

export class Gem {
    // Visual coordinates (pixel position)
    public x: number;
    public y: number;
    // State flags
    public isMatch: boolean = false;
    public isSelected: boolean = false;

    // Constant configuration for this instance
    public readonly size: number = CELL_SIZE;

    constructor(
        public row: number,
        public col: number,
        public readonly color: GemColors
    ) {
        //Canvas size for GEM
        this.x = this.col * this.size;
        this.y = this.row * this.size;
    }

    public update(deltaTime: number): void {
        const targetX = this.col * this.size;
        const targetY = this.row * this.size;

        // Calculate distance to target
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // Move towards target
        // We multiply by a speed factor (e.g., 10) to control animation speed
        // If distance is very small, snap to exact position to stop jittering
        if (Math.abs(dx) > 1) {
            this.x += dx * 10 * deltaTime; 
        } else {
            this.x = targetX;
        }

        if (Math.abs(dy) > 1) {
            this.y += dy * 10 * deltaTime;
        } else {
            this.y = targetY;
        }
    }

    //Snaps the visual coordinates (x, y) to match the logical grid position (row, col)
    public snapToGrid(): void {
        this.x = this.col * this.size;
        this.y = this.row * this.size;
    }
}