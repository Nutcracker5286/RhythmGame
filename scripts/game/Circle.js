class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.shrinking = false;
        this.opacity = 1;
        this.particles = [];
    }

    isClicked(x, y) {
        const distance = Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        );
        return distance <= this.radius && !this.shrinking;
    }

    draw(ctx) {
        if (!this.shrinking) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 97, ${this.opacity})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.stroke();
        }

        // 파티클 그리기
        this.particles.forEach(particle => particle.draw(ctx));
    }
} 