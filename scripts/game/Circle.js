class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.shrinking = false;
        this.opacity = 1;
        this.particles = [];
        
        this.createdAt = Date.now();
        this.lifetime = 2000; // 기본값, 난이도에 따라 변경됨
        this.expired = false;
    }

    checkExpired() {
        if (!this.expired) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - this.createdAt;
            
            // 노트가 사라지기 전에 페이드아웃 효과
            if (elapsedTime > this.lifetime * 0.7) {  // 수명의 70% 이상 지났을 때
                this.opacity = Math.max(0, 1 - ((elapsedTime - (this.lifetime * 0.7)) / (this.lifetime * 0.3)));
            }

            if (elapsedTime >= this.lifetime) {
                this.expired = true;
                return true;
            }
        }
        return false;
    }

    isClicked(x, y) {
        const distance = Math.sqrt(
            Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
        );
        return distance <= this.radius && !this.shrinking;
    }

    draw(ctx, accentColor, textColor) {
        if (!this.shrinking) {
            const timeLeft = (this.lifetime - (Date.now() - this.createdAt)) / this.lifetime;
            
            // 원 그리기
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${accentColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
            ctx.strokeStyle = `${textColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.stroke();

            // 시간 표시 원 그리기
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.8, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * timeLeft));
            ctx.strokeStyle = `${textColor}88`; // 반투명한 시간 표시
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.lineWidth = 1;
        }

        // 파티클 그리기
        this.particles.forEach(particle => particle.draw(ctx, accentColor, textColor));
    }

    getTimingDifference() {
        const currentTime = Date.now();
        const timeDiff = (currentTime - this.createdAt) / this.lifetime;
        return timeDiff; // 0에 가까울수록 빠른 타이밍
    }
} 