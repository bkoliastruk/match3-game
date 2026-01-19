import { CELL_SIZE, GEM_COLOR_ID_MAPPING, FIGURE_COLOR_MAPPING, DEFAULT_COLOR_ID, DEFAULT_FIGURE_NAME } from '../configs/constants';
import type { GemColors } from '../types/types';
import { Gem } from '../logic/Gem';

export class GemRenderer {
    private centerX: number = 0;
    private centerY: number = 0;
    private radius: number;

    constructor(private ctx: CanvasRenderingContext2D) {
        this.radius = (CELL_SIZE / 2) - 5;
    }

    // Helpers
    private getFigureName(color: GemColors): string {
        return FIGURE_COLOR_MAPPING[color] || DEFAULT_FIGURE_NAME;
    }
    
    private getFillColor(color: GemColors): string {
        return GEM_COLOR_ID_MAPPING[color] || DEFAULT_COLOR_ID;
    }

    // Drawing Primitives
    private drawCircle() {
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    }

    private drawSquare(): void {
        const size = this.radius * 1.7; 
        const offset = size / 2;
        this.ctx.rect(this.centerX - offset, this.centerY - offset, size, size);
    }

    private drawTriangle(): void {
        const visualR = this.radius * 1.1; 
        const offsetY = this.radius * 0.26;

        this.ctx.moveTo(this.centerX, this.centerY - visualR + offsetY);
        this.ctx.lineTo(this.centerX + visualR * 0.866, this.centerY + visualR * 0.5 + offsetY);
        this.ctx.lineTo(this.centerX - visualR * 0.866, this.centerY + visualR * 0.5 + offsetY);
    }

    private drawPolygon(): void {
        const sides = 6;
        const angleStep = (Math.PI * 2) / sides;
        const startAngle = -Math.PI / 2;
        
        this.ctx.moveTo(
            this.centerX + this.radius * Math.cos(startAngle),
            this.centerY + this.radius * Math.sin(startAngle)
        );
        for (let i = 1; i < sides; i++) {
            const angle = startAngle + angleStep * i;
            this.ctx.lineTo(
                this.centerX + this.radius * Math.cos(angle),
                this.centerY + this.radius * Math.sin(angle)
            );
        }
    }

    public draw(gem: Gem) {
        this.centerX = gem.x + CELL_SIZE / 2;
        this.centerY = gem.y + CELL_SIZE / 2;

        this.ctx.beginPath();

        const figureName = this.getFigureName(gem.color);
        switch (figureName) {
            case 'square': this.drawSquare(); break;
            case 'polygon': this.drawPolygon(); break;
            case 'triangle': this.drawTriangle(); break;
            case 'circle': 
            default: this.drawCircle(); break;
        }

        if (gem.isMatch) {
            this.ctx.fillStyle = '#898787';
        } else {
            this.ctx.fillStyle = this.getFillColor(gem.color);
        }

        this.ctx.fill();

        if (gem.isSelected) {
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.stroke();
        } else {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            this.ctx.stroke();
        }

        this.ctx.closePath();
    }
}