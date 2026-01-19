// src/core/main.ts
import { Grid } from '../logic/Grid';
import { Gem } from '../logic/Gem';
import { GameField } from '../graphics/gameField'
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '../configs/constants';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private grid: Grid;
    private lastTime: number = 0;
    private selectedGem: Gem | null = null;
    private isProcessing: boolean = false;

    constructor(canvasId: string) {
        const canvasElement = document.getElementById(canvasId);
        if (!canvasElement) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        this.canvas = canvasElement as HTMLCanvasElement;

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;

        // Set actual canvas size
        this.canvas.width = BOARD_WIDTH;
        this.canvas.height = BOARD_HEIGHT;

        this.grid = new Grid();

        this.loop = this.loop.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.canvas.addEventListener('mousedown', this.handleInput);

        requestAnimationFrame(this.loop);
    }

    /**
     * Handles user clicks with fixed coordinate scaling.
     */
    private async handleInput(event: MouseEvent): Promise<void> {
        if (this.isProcessing) return;

        const rect = this.canvas.getBoundingClientRect();
        
        // This ensures clicks work even if Canvas is resized via CSS
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const col = Math.floor(mouseX / CELL_SIZE);
        const row = Math.floor(mouseY / CELL_SIZE);

        console.log(`Click at Col: ${col}, Row: ${row}`);

        const clickedGem = this.grid.getGem(row, col);
        if (!clickedGem) return;

        if (this.selectedGem === null) {
            this.selectGem(clickedGem);
        } else {
            if (this.selectedGem === clickedGem) {
                this.deselectGem();
            } else if (this.isNeighbor(this.selectedGem, clickedGem)) {
                this.swapGems(this.selectedGem, clickedGem);
            } else {
                this.deselectGem();
                this.selectGem(clickedGem);
            }
        }
    }

    private selectGem(gem: Gem): void {
        this.selectedGem = gem;
        gem.isSelected = true;
        console.log(`Selected gem at ${gem.row},${gem.col}`);
    }

    private deselectGem(): void {
        if (this.selectedGem) {
            this.selectedGem.isSelected = false;
            this.selectedGem = null;
        }
    }

    private isNeighbor(gem1: Gem, gem2: Gem): boolean {
        const rowDiff = Math.abs(gem1.row - gem2.row);
        const colDiff = Math.abs(gem1.col - gem2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    private async handleMatches(): Promise<void> {
        while (this.grid.findMatches()) {
            await new Promise(resolve => setTimeout(resolve, 250));

            this.grid.applyGravity();

            await new Promise(resolve => setTimeout(resolve, 400));
        }
        console.log("Grid is clean. Cascade finished.");
    }

    private async swapGems(gem1: Gem, gem2: Gem): Promise<void> {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // Logical Swap
        this.grid.swapGems(gem1, gem2);
        
        // Wait for swap animation
        await new Promise(resolve => setTimeout(resolve, 300));

        // Initial Match Check
        const hasMatch = this.grid.findMatches();

        if (hasMatch) {
            console.log("Match found! Starting cascade...");
            this.deselectGem();
            
            // Start the cascade sequence (Remove -> Gravity -> Check again)
            await this.handleMatches();
            
        } else {
            console.log("No match. Reverting swap.");
            this.grid.swapGems(gem1, gem2);
            await new Promise(resolve => setTimeout(resolve, 300));
            this.deselectGem();
        }

        this.isProcessing = false; // Finally unlock input
    }

    private loop(timestamp: number): void {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop);
    }

    private update(deltaTime: number): void {
        // Convert ms to seconds for smoother math
        this.grid.update(deltaTime / 1000);
    }

    /**
     * Updated Render: Explicit drawing order for highlights
     */
    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const gems = this.grid.getAllGems();
        
        gems.forEach(gem => {
            const figure = new Figure(this.ctx, gem);
            figure.drawCircle()

            // B. Draw Match Highlight (Inner Glow)
            // If the gem is part of a match (3, 4, or 5 in a row)
            if (gem.isMatch) {
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Semi-transparent white
                this.ctx.fill();
                this.ctx.closePath();
            }

            // C. Draw Selection Border (Outer Ring)
            // Must be drawn LAST to be on top
            if (gem.isSelected) {
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2); // Slightly larger
                this.ctx.strokeStyle = '#ffffff'; // Bright White
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
                this.ctx.closePath();
            } else {
                // Default subtle border
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }
}

window.addEventListener('load', () => {
    new Game('game-canvas');
});