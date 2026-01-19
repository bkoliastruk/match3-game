import { CELL_SIZE } from '../configs/constants';
import { Gem } from '../logic/Gem';

export class Figure {
    private centerX: number;
    private centerY: number;
    private radius: number;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private gem: Gem
    ){
        this.centerX = this.gem.x + CELL_SIZE / 2;
        this.centerY = this.gem.y + CELL_SIZE / 2;
        this.radius = (CELL_SIZE / 2) - 5;
    }

    private getGemColor(type: string): string {
        switch (type) {
            case 'red': return '#e74c3c';
            case 'blue': return '#3498db';
            case 'green': return '#2ecc71';
            case 'yellow': return '#f1c40f';
            case 'purple': return '#9b59b6';
            case 'orange': return '#e67e22';
            default: return '#95a5a6';
        }
    }

    public draw() {
        this.ctx.beginPath();

        // if () {
            
        // }

        this.ctx.fillStyle = this.getGemColor(this.gem.type);
        this.ctx.fill();
        this.ctx.closePath();
    }

    private drawCircle() {
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);

    }

    private drawSquare(): void {
        const size = this.radius * 1.7; 
        const offset = size / 2;

        this.ctx.rect(this.centerX - offset, this.centerY - offset, size, size);
    }

    private drawTriangle(cx: number, cy: number, r: number): void {
        const visualR = r * 1.1; 
        
        const height = visualR * (Math.sqrt(3) / 2); // Height of equilateral triangle
        
        this.ctx.moveTo(cx, cy - visualR);
        this.ctx.lineTo(cx + visualR * 0.866, cy + visualR * 0.5);
        this.ctx.lineTo(cx - visualR * 0.866, cy + visualR * 0.5);
    }

    private drawPolygon(cx: number, cy: number, r: number, sides: number): void {
        const angleStep = (Math.PI * 2) / sides;
        const startAngle = -Math.PI / 2;

        this.ctx.moveTo(
            cx + r * Math.cos(startAngle),
            cy + r * Math.sin(startAngle)
        );

        for (let i = 1; i < sides; i++) {
            const angle = startAngle + angleStep * i;
            this.ctx.lineTo(
                cx + r * Math.cos(angle),
                cy + r * Math.sin(angle)
            );
        }
    }
}