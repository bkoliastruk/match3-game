import { CELL_SIZE } from '../configs/constants';
import type { GemType } from '../types/types';

export class Gem {
    // Visual coordinates (pixel position)
    public x: number;
    public y: number;
    
    // Constant configuration for this instance
    public readonly size: number = CELL_SIZE;
    
    // State flags
    public isMatch: boolean = false;
    public isSelected: boolean = false;

    constructor(
        public row: number,
        public col: number,
        public readonly type: GemType
    ) {
        this.x = this.col * this.size;
        this.y = this.row * this.size;
    }

    //Snaps the visual coordinates (x, y) to match the logical grid position (row, col)
    public snapToGrid(): void {
        this.x = this.col * this.size;
        this.y = this.row * this.size;
    }
}