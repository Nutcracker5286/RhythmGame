class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.circles = [];
        this.score = 0;
        this.isPlaying = false;
        this.currentSong = null;
        this.lastCircleTime = 0;
        this.circleSpeed = 3;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    startGame(songId) {
        this.isPlaying = true;
        this.score = 0;
        this.circles = [];
        this.currentSong = songId;
        this.updateScore(0);
        this.gameLoop();
        this.playMusic(songId);
    }

    createCircle() {
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = Math.random() * (this.canvas.height - 100) + 50;
        const circle = new Circle(x, y, 30);
        this.circles.push(circle);
    }

    handleClick(e) {
        if (!this.isPlaying) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            if (circle.isClicked(x, y)) {
                this.createParticlesForCircle(circle);
                this.circles.splice(i, 1);
                this.updateScore(this.score + 100);
                break;
            }
        }
    }

    createParticlesForCircle(circle) {
        const particleCount = 40;
        const colors = ['#FF8C61', '#FFB996', '#FFE4D6', '#FF6B3D', '#FFA07A'];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 8 + 5;
            const size = Math.random() * 12 + 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = Math.random() > 0.5 ? 'triangle' : 'rectangle';
            
            const particle = new Particle(
                circle.x,
                circle.y,
                angle,
                speed,
                size,
                color,
                shape
            );
            circle.particles.push(particle);
        }
    }

    updateScore(newScore) {
        this.score = newScore;
        document.getElementById('score').textContent = `점수: ${this.score}`;
    }

    update() {
        const currentTime = Date.now();
        if (currentTime - this.lastCircleTime > 1000) {
            this.createCircle();
            this.lastCircleTime = currentTime;
        }

        // 원과 파티클 업데이트
        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            
            // 파티클 업데이트
            for (let j = circle.particles.length - 1; j >= 0; j--) {
                const particle = circle.particles[j];
                if (!particle.update()) {
                    circle.particles.splice(j, 1);
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.circles.forEach(circle => circle.draw(this.ctx));
    }

    gameLoop() {
        if (!this.isPlaying) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    playMusic(songId) {
        // 음악 재생 로직 구현 예정
    }
} 