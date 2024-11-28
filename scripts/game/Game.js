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
        
        // SongManager 초기화 (UI 초기화 없이)
        this.songManager = new SongManager(false);
        this.audioManager = new AudioManager();
        
        // 노래 데이터 전달
        this.songManager.loadSongs().then(() => {
            this.audioManager.setSongs(this.songManager.songs);
        });
        
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
        // 노래 데이터가 로드될 때까지 대기
        if (!this.audioManager.songs[songId]) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const loaded = await this.audioManager.loadSong(songId);
        if (!loaded) {
            console.error('Failed to load song');
            return;
        }

        this.isPlaying = true;
        this.score = 0;
        this.audioManager.play();
        this.gameLoop();
    }

    createCircle() {
        const canvas = document.getElementById('gameCanvas');
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        const radius = 30;
        
        const circle = new Circle(x, y, radius);
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
                this.createParticles(x, y);
                this.circles.splice(i, 1);
                this.updateScore(this.score + 100);
                break;
            }
        }
    }

    createParticles(x, y) {
        const colors = ['#FF8C61', '#FFB961', '#FF6161'];
        const particles = [];

        // 파티클 요소 생성
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            this.canvas.parentElement.appendChild(particle);
            particles.push(particle);
        }

        // 애니메이션 설정
        anime({
            targets: particles,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            scale: [1, 0],
            opacity: [1, 0],
            easing: 'easeOutExpo',
            duration: 1000,
            complete: () => {
                particles.forEach(particle => particle.remove());
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
        // CSS 변수에서 테마 색상 가져오기
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryBg = computedStyle.getPropertyValue('--primary-bg').trim();
        const accentColor = computedStyle.getPropertyValue('--primary-accent').trim();
        const textColor = computedStyle.getPropertyValue('--text-color').trim();
        
        // 배경 그리기
        this.ctx.fillStyle = primaryBg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 원과 파티클 그리기
        this.circles.forEach(circle => {
            circle.draw(this.ctx, accentColor, textColor);
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