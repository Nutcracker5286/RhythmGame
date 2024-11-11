class Particle {
    constructor(x, y, angle, speed, size, color, shape) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.size = size;
        this.originalSize = size;
        this.opacity = 1;
        this.color = color;
        this.shape = shape;
        this.life = 1;
        this.lifeSpeed = 1 / 60;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.vx *= 0.98;
        this.rotation += this.rotationSpeed;
        this.life -= this.lifeSpeed;
        this.opacity = this.life;
        this.size = this.originalSize * (0.3 + this.life * 0.7);

        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.shape === 'triangle') {
            this.drawTriangle(ctx);
        } else {
            this.drawRectangle(ctx);
        }

        ctx.restore();
    }

    drawTriangle(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.866, this.size * 0.5);
        ctx.lineTo(-this.size * 0.866, this.size * 0.5);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF33';
        ctx.stroke();
    }

    drawRectangle(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#FFFFFF33';
        ctx.beginPath();
        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.fill();
        ctx.stroke();
    }
} 