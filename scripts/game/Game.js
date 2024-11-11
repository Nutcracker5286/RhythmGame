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
        this.audioManager = new AudioManager();
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        this.audioManager.setOnBeatCallback(() => {
            this.createCircle();
        });
    }

    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    async startGame(songId) {
        const loaded = await this.audioManager.loadSong(songId);
        if (!loaded) {
            console.error('Failed to load song');
            return;
        }

        this.isPlaying = true;
        this.score = 0;
        this.circles = [];
        this.currentSong = songId;
        this.updateScore(0);
        
        const difficulty = this.audioManager.getDifficulty();
        this.circleSpeed = 3 + difficulty;
        
        this.audioManager.play();
        this.gameLoop();
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
        const themeColors = {
            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim(),
            text: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
            hover: getComputedStyle(document.documentElement).getPropertyValue('--hover-color').trim()
        };

        const colors = [
            themeColors.primary,
            themeColors.hover,
            themeColors.text,
            this.adjustColor(themeColors.primary, 20),
            this.adjustColor(themeColors.primary, -20)
        ];

        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.left = `${circle.x}px`;
            particle.style.top = `${circle.y}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            this.canvas.parentElement.appendChild(particle);
            particles.push(particle);
        }

        anime({
            targets: particles,
            translateX: () => anime.random(-150, 150),
            translateY: () => anime.random(-150, 150),
            scale: [
                {value: 1, duration: 100, easing: 'easeOutQuad'},
                {value: 0, duration: 900, easing: 'easeInQuad'}
            ],
            rotate: () => anime.random(-360, 360),
            opacity: [
                {value: 1, duration: 100, easing: 'easeOutQuad'},
                {value: 0, duration: 900, easing: 'easeInQuad'}
            ],
            duration: 1000,
            easing: 'easeOutExpo',
            complete: () => {
                particles.forEach(p => p.remove());
            }
        });
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + amount));
        const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + amount));
        const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + amount));
        
        return `#${[r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
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

        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            
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
        this.circles.forEach(circle => {
            if (!circle.shrinking) {
                const accentColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-accent')
                    .trim();
                
                this.ctx.beginPath();
                this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `${accentColor}CC`;
                this.ctx.fill();
                this.ctx.strokeStyle = `${accentColor}`;
                this.ctx.stroke();
            }
        });
    }

    gameLoop() {
        if (!this.isPlaying) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    pause() {
        this.isPlaying = false;
        this.audioManager.pause();
    }

    resume() {
        this.isPlaying = true;
        this.audioManager.resume();
        this.gameLoop();
    }

    stop() {
        this.isPlaying = false;
        this.audioManager.stop();
    }
} 