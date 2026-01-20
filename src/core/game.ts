import { Grid } from '../logic/Grid';
import { Gem } from '../logic/Gem';
import { GemRenderer } from '../graphics/GemRender';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, BACKGROUND_COLOR, GameState } from '../configs/constants';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private grid: Grid;
    private lastTime: number = 0;
    private selectedGem: Gem | null = null;
    private state: GameState = GameState.IDLE;
    private gemRenderer: GemRenderer;

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
        this.gemRenderer = new GemRenderer(this.ctx);

        this.canvas.width = BOARD_WIDTH;
        this.canvas.height = BOARD_HEIGHT;

        this.grid = new Grid();

        this.loop = this.loop.bind(this);
        this.handleInput = this.handleInput.bind(this);

        this.canvas.addEventListener('mousedown', this.handleInput);

        requestAnimationFrame(this.loop);
    }

    private async handleInput(event: MouseEvent): Promise<void> {
        // Block input if the game is animating
        if (this.state !== GameState.IDLE) return;

        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate scaling factors
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        const col = Math.floor(mouseX / CELL_SIZE);
        const row = Math.floor(mouseY / CELL_SIZE);

        console.log(`Click at Col: ${col}, Row: ${row}`);

        const clickedGem = this.grid.getGem(row, col);
        if (!clickedGem) return;

        // SELECTION LOGIC (Fixed duplication)
        if (this.selectedGem === null) {
            // Select the first gem
            this.selectGem(clickedGem);
        } else {
            // A gem is already selected
            if (this.selectedGem === clickedGem) {
                this.deselectGem();
            } else if (this.isNeighbor(this.selectedGem, clickedGem)) {
                await this.handleSwapInteraction(this.selectedGem, clickedGem);
            } else {
                // Clicked a non-neighbor -> Select the new gem instead
                this.deselectGem();
                this.selectGem(clickedGem);
            }
        }
    }

    // Main interaction method
    private async handleSwapInteraction(gem1: Gem, gem2: Gem): Promise<void> {
        this.state = GameState.ANIMATING; // Lock input

        // 1. Start logical swap
        this.grid.swapGems(gem1, gem2);

        // 2. Wait for swap animation to finish
        await this.waitForAnimations(); 

        // 3. Check for matches
        const hasMatch = this.grid.findMatches();

        if (hasMatch) {
            this.deselectGem();
            // Start the cascade (remove -> fall -> check again)
            await this.processCascade();
        } else {
            // No match found -> Swap back
            this.grid.swapGems(gem1, gem2);
            await this.waitForAnimations();
            this.deselectGem();
        }

        this.state = GameState.IDLE; // Unlock input
    }

    private async processCascade(): Promise<void> {
        let matchesFound = true;

        while (matchesFound) {
            // Short delay to let user see the match
            await this.delay(200);

            // Remove matches and spawn new gems (logic)
            this.grid.applyGravity();

            // Wait for falling animation to finish
            await this.waitForAnimations();

            // Check if falling gems created new matches
            matchesFound = this.grid.findMatches();
        }
    }

    private async waitForAnimations(): Promise<void> {
        return new Promise(resolve => {
            const check = () => {
                if (!this.grid.isAnimating()) {
                    resolve();
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    private loop(timestamp: number): void {
        // Prevent huge delta time on the first frame
        if (this.lastTime === 0) {
            this.lastTime = timestamp;
            requestAnimationFrame(this.loop);
            return;
        }

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop);
    }

    private update(deltaTime: number): void {
        // Convert milliseconds to seconds for physics
        this.grid.update(deltaTime / 1000);
    }

    private render(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const gems = this.grid.getAllGems();
        gems.forEach(gem => {
            this.gemRenderer.draw(gem); 
        });
    }
}

window.addEventListener('load', () => {
    new Game('game-canvas');
});
