import { Gem } from './Gem';
import type { GemColors } from '../types/types';
import { GEM_COLORS, BOARD_ROWS, BOARD_COLS} from '../configs/constants';

export class Grid {
    private cells: Gem[][];

    constructor() {
        this.cells = [];
        this.initializeGrid();
    }

    /**
     * Creates a new empty grid and populates it.
     * Ensures no initial Match-3 combinations exist.
     */
    public initializeGrid(): void {
        this.cells = [];
        
        for (let r = 0; r < BOARD_ROWS; r++) {
            const row: Gem[] = [];

            for (let c = 0; c < BOARD_COLS; c++) {
                // Select a type that doesn't create a match
                const color = this.getRandomTypeNoMatch(r, c, row);
                row.push(new Gem(r, c, color));
            }

            this.cells.push(row);
        }
    }

    /**
     * Safely retrieves a Gem by coordinates.
     * Returns null if coordinates are out of bounds.
     */
    public getGem(row: number, col: number): Gem | null {
        if (this.isValidPosition(row, col)) {
            return this.cells[row][col];
        }
        return null;
    }

    
    // Returns all gems as a single flat array.
    public getAllGems(): Gem[] {
        return this.cells.flat();
    }

    /**
     * Performs a logical swap of two gems.
     * Updates their positions in the 'cells' array and their internal row/col properties.
     */
    public swapGems(gem1: Gem, gem2: Gem): void {
        // 1. Swap references in the grid array
        this.cells[gem1.row][gem1.col] = gem2;
        this.cells[gem2.row][gem2.col] = gem1;

        // 2. Update internal logical coordinates
        const tempRow = gem1.row;
        const tempCol = gem1.col;

        gem1.row = gem2.row;
        gem1.col = gem2.col;

        gem2.row = tempRow;
        gem2.col = tempCol;
    }

    /**
     * Generates a random gem type while checking left and top neighbors
     * to prevent creating a match during generation.
     */
    private getRandomTypeNoMatch(r: number, c: number, currentRow: Gem[]): GemColors {
        let color: GemColors;
        let isMatch: boolean;

        do {
            isMatch = false;
            // Generate a random index from 0 to GEM_COLORS.length - 1
            const randomIdx = Math.floor(Math.random() * GEM_COLORS.length);
            
            // Retrieve the actual string gem color
            color = GEM_COLORS[randomIdx];

            // Check horizontal (left)
            if (c >= 2) {
                const left1 = currentRow[c - 1];
                const left2 = currentRow[c - 2];
                if (left1.color === color && left2.color === color) {
                    isMatch = true;
                }
            }

            // Check vertical (top)
            if (r >= 2) {
                const top1 = this.cells[r - 1][c];
                const top2 = this.cells[r - 2][c];
                if (top1.color === color && top2.color === color) {
                    isMatch = true;
                }
            }
        } while (isMatch);

        return color;
    }

    public findMatches(): boolean {
        let hasFoundMatch = false;

        this.getAllGems().forEach(gem => gem.isMatch = false);

        // Check Horizontal Matches
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS - 2; c++) {
                const gem1 = this.cells[r][c];
                const gem2 = this.cells[r][c + 1];
                const gem3 = this.cells[r][c + 2];

                if (gem1.color === gem2.color && gem1.color === gem3.color) {
                    gem1.isMatch = true;
                    gem2.isMatch = true;
                    gem3.isMatch = true;
                    hasFoundMatch = true;
                }
            }
        }

        // Check Vertical Matches
        for (let c = 0; c < BOARD_COLS; c++) {
            for (let r = 0; r < BOARD_ROWS - 2; r++) {
                const gem1 = this.cells[r][c];
                const gem2 = this.cells[r + 1][c];
                const gem3 = this.cells[r + 2][c];

                if (gem1.color === gem2.color && gem1.color === gem3.color) {
                    gem1.isMatch = true;
                    gem2.isMatch = true;
                    gem3.isMatch = true;
                    hasFoundMatch = true;
                }
            }
        }

        return hasFoundMatch;
    }

    private getRandomSimpleColor(): GemColors {
        const randomIdx = Math.floor(Math.random() * GEM_COLORS.length);
        return GEM_COLORS[randomIdx];
    }


    public applyGravity(): void {
        for (let c = 0; c < BOARD_COLS; c++) {
            let columnGems: Gem[] = [];

            for (let r = 0; r < BOARD_ROWS; r++) {
                columnGems.push(this.cells[r][c]);
            }

            const survivingGems = columnGems.filter(gem => !gem.isMatch);
            const emptySlots = BOARD_ROWS - survivingGems.length;
            const newGems: Gem[] = [];

            for (let i = 0; i < emptySlots; i++) {
                const randomColor = this.getRandomSimpleColor();

                newGems.push(new Gem(0, c, randomColor));
            }

            const newColumn = [...newGems, ...survivingGems];

            for (let r = 0; r < BOARD_ROWS; r++) {
                const gem = newColumn[r];

                gem.row = r;
                gem.col = c;
                gem.isMatch = false;
                gem.snapToGrid(); 

                this.cells[r][c] = gem;
            }
        }
    }

    /**
     * Updates all gems in the grid.
     * @param deltaTime Time elapsed in seconds.
     */
    public update(deltaTime: number): void {
        this.getAllGems().forEach(gem => gem.update(deltaTime));
    }

    /**
     * Validates if the given coordinates are within the board boundaries.
     */
    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
    }
}