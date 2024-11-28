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

    draw(ctx, accentColor, textColor) {
        if (!this.shrinking) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${accentColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
            ctx.strokeStyle = `${textColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.stroke();
        }

        // 파티클 그리기
        this.particles.forEach(particle => particle.draw(ctx, accentColor, textColor));
    }
} 