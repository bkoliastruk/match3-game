import { CELL_SIZE, ANIMATION_SPEED } from '../configs/constants';
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
    private readonly speed: number = ANIMATION_SPEED;

    constructor(
        public row: number,
        public col: number,
        public readonly color: GemColors
    ) {
        //Canvas size for GEM
        this.x = this.col * this.size;
        this.y = this.row * this.size;
    }

    public get isMoving(): boolean {
        const targetX = this.col * this.size;
        const targetY = this.row * this.size;
        
        // Перевіряємо різницю з допуском в 1 піксель
        return Math.abs(this.x - targetX) > 1 || Math.abs(this.y - targetY) > 1;
    }

    public update(dt: number): boolean {
        const targetY = this.row * this.size;
        const targetX = this.col * this.size;
        
        // 1. Handle Y movement (Falling)
        if (Math.abs(this.y - targetY) > 1) {
            if (this.y < targetY) {
                // Падаємо вниз
                this.y += this.speed * dt;
                if (this.y > targetY) this.y = targetY; 
            } else {
                // --- ВИПРАВЛЕННЯ ТУТ ---
                // Рухаємось вгору (раніше тут був миттєвий телепорт)
                this.y -= this.speed * dt;
                if (this.y < targetY) this.y = targetY;
            }
        } else {
            this.y = targetY; // Приїхали
        }

        // 2. Handle X movement (Swapping)
        if (Math.abs(this.x - targetX) > 1) {
            if (this.x < targetX) {
                this.x += this.speed * dt;
                if (this.x > targetX) this.x = targetX;
            } else {
                this.x -= this.speed * dt;
                if (this.x < targetX) this.x = targetX;
            }
        } else {
            this.x = targetX;
        }

        return this.isMoving;
    }
}