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
        this.gameEndThreshold = 10; // 놓친 노트 개수 임계값
        this.missedNotes = 0;
        
        // SongManager 초기화 (UI 초기화 없이)
        this.songManager = new SongManager(false);
        this.audioManager = new AudioManager();
        
        // ScoreSystem 초기화 추가
        this.scoreSystem = new ScoreSystem();
        
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
        
        // HP 시스템 추가

        
        this.maxHp = 100;
        this.currentHp = this.maxHp;
        this.hpDecreaseRate = {
            miss: 20,     // 미스 시 HP 감소량
            good: 5,      // GOOD 판정 시 HP 회복량
            great: 8,     // GREAT 판정 시 HP 변화
            perfect: 10    // PERFECT 판정 시 HP 회복량 (미스 감소량의 50%)
        };
        
        // 콤보에 따른 HP 보정
        this.comboHpBonus = 0.1; // 10콤보당 HP 감소량 10% 감소
        this.maxComboBonus = 0.5; // 최대 50%까지 HP 감소량 감소

        this.difficultySystem = new DifficultySystem();
    }

    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    async startGame(songId) {
        try {
            // 노래 데이터 가져오기
            const song = await this.songManager.getSong(songId);
            if (!song) {
                console.error('노래를 찾을 수 없습니다.');
                return;
            }

            // AudioManager에 현재 노래 목록 업데이트
            this.audioManager.setSongs([song]);
            
            // 오디오 로드
            const loaded = await this.audioManager.loadSong(songId);
            if (!loaded) {
                console.error('Failed to load song');
                return;
            }

            // 현재 노래 정보 저장
            this.currentSong = song;

            // 난이도 설정 적용
            const difficultySettings = this.difficultySystem.applyDifficultyToGame(this, song.difficulty);
            
            // 노트 생성 간격 설정
            this.noteSpawnInterval = (60 / song.bpm) * 1000 * difficultySettings.beatMultiplier;
            
            // 게임 상태 초기화
            this.resetGame();
            
            // 게임 시작
            this.isPlaying = true;
            this.audioManager.play();
            this.gameLoop();

        } catch (error) {
            console.error('게임 시작 중 오류 발생:', error);
        }
    }

    createCircle() {
        // 난이도에 따른 노트 생성 확률 체크
        if (Math.random() > this.noteFrequency) return;

        const canvas = document.getElementById('gameCanvas');
        const x = Math.random() * (canvas.width - 100) + 50;
        const y = Math.random() * (canvas.height - 100) + 50;
        const radius = 30;
        
        const circle = new Circle(x, y, radius);
        circle.lifetime = this.noteLifetime || 2000; // 난이도별 노트 지속 시간 적용
        this.circles.push(circle);
    }

    handleClick(e) {
        if (!this.isPlaying) return; // 게임이 시작되지 않았으면 클릭 무시
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let hitNote = false;
        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            if (circle.isClicked(x, y)) {
                this.createParticles(x, y);
                
                const timeDiff = (Date.now() - circle.createdAt) / circle.lifetime;
                let hitResult;
                
                if (timeDiff <= 0.5) {
                    hitResult = this.scoreSystem.evaluateHit('perfect');
                    this.updateHp('perfect');
                } else if (timeDiff <= 0.8) {
                    hitResult = this.scoreSystem.evaluateHit('great');
                    this.updateHp('great');
                } else if (timeDiff <= 1.0) {
                    hitResult = this.scoreSystem.evaluateHit('good');
                    this.updateHp('good');
                } else {
                    hitResult = this.scoreSystem.evaluateHit('miss');
                    this.updateHp('miss');
                }
                
                this.showJudgementText(x, y - 50, hitResult.text);
                this.updateScore(this.scoreSystem.currentScore);
                
                this.circles.splice(i, 1);
                hitNote = true;
                break;
            }
        }

        // 노트가 없거나 노트를 놓쳤을 때는 미스 처리하지 않음
        if (!hitNote && this.circles.length > 0) {
            this.scoreSystem.evaluateHit('miss');
            this.updateHp('miss');
            this.showJudgementText(x, y - 50, "미스!");
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

        // 만료된 노트 처리
        for (let i = this.circles.length - 1; i >= 0; i--) {
            const circle = this.circles[i];
            
            // 노트가 만료되었는지 확인
            if (circle.checkExpired()) {
                this.circles.splice(i, 1);
                this.scoreSystem.evaluateHit('miss'); // 미스 처리 추가
                this.updateHp('miss'); // HP 감소
                this.missedNotes++;
                this.checkGameEnd();
                continue;
            }

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

    checkGameEnd() {
        // HP가 0이 되었거나 노래가 끝났을 때
        if (this.currentHp <= 0 || !this.audioManager.isPlaying) {
            const reason = this.currentHp <= 0 ? 'hp' : 'complete';
            this.endGame(reason);
        }
    }

    endGame(reason) {
        this.isPlaying = false;
        this.audioManager.stop();
        
        // ScoreSystem에서 상세 결과 가져오기
        const scoreResults = this.scoreSystem.getResults();
        
        // URL 파라미터 생성
        const params = new URLSearchParams();
        params.append('songId', this.currentSong.id);
        params.append('songTitle', encodeURIComponent(this.currentSong.title));
        params.append('artist', encodeURIComponent(this.currentSong.artist));
        params.append('finalScore', scoreResults.finalScore);
        params.append('maxCombo', scoreResults.maxCombo);
        params.append('accuracy', scoreResults.accuracy);
        params.append('hitResults', JSON.stringify({
            perfect: scoreResults.hitResults.perfect,
            great: scoreResults.hitResults.great,
            good: scoreResults.hitResults.good,
            miss: scoreResults.hitResults.miss
        }));
        params.append('reason', reason);

        // 결과 페이지로 이동
        window.location.href = `result.html?${params.toString()}`;
    }

    updateHp(judgement) {
        let hpChange = 0;
        const comboMultiplier = Math.min(
            1 - (Math.floor(this.scoreSystem.combo / 10) * this.comboHpBonus),
            1 - this.maxComboBonus
        );

        switch(judgement) {
            case 'miss':
                hpChange = -(this.hpDrainRate * 2) * comboMultiplier; // 기본 drain의 2배
                break;
            case 'good':
                hpChange = this.hpDrainRate * 0.3 * comboMultiplier; // 30% 회복
                break;
            case 'great':
                hpChange = this.hpDrainRate * 0.5; // 50% 회복
                break;
            case 'perfect':
                hpChange = this.hpDrainRate * 0.8 * (1 + (this.scoreSystem.combo * 0.005));
                break;
        }

        this.currentHp = Math.min(Math.max(0, this.currentHp + hpChange), this.maxHp);
        this.updateHpBar();
        
        if (this.currentHp <= 0) {
            this.checkGameEnd();
        }
    }

    updateHpBar() {
        const hpBar = document.getElementById('hpBar');
        if (hpBar) {
            hpBar.style.width = `${this.currentHp}%`;
            hpBar.style.backgroundColor = this.getHpColor();
        }
    }

    getHpColor() {
        if (this.currentHp > 66) return '#4CAF50';
        if (this.currentHp > 33) return '#FFC107';
        return '#F44336';
    }

    gameOver(reason) {
        this.isPlaying = false;
        this.audioManager.stop();
        
        // 결과 데이터 준비
        const results = {
            songId: this.currentSong?.id || '',
            songTitle: this.currentSong?.title || '알 수 없는 곡',
            finalScore: this.score,
            maxCombo: this.scoreSystem.maxCombo,
            accuracy: this.scoreSystem.getResults().accuracy,
            hitResults: this.scoreSystem.hitResults,
            reason: reason
        };

        // 게과 페이지로 이동
        const queryParams = new URLSearchParams(results).toString();
        window.location.href = `result.html?${queryParams}`;
    }

    showGameOverModal(results) {
        const modal = document.createElement('div');
        modal.className = 'modal game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${results.reason === 'hp' ? '게임 오버!' : '게임 완료!'}</h2>
                <p>최종 점수: ${results.finalScore}</p>
                <p>최대 콤보: ${results.maxCombo}</p>
                <p>정확도: ${results.accuracy}%</p>
                <div class="game-over-buttons">
                    <button onclick="game.retryGame()" class="button">다시 시도</button>
                    <button onclick="game.goToSongSelect()" class="button">곡 선택</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    retryGame() {
        const songId = this.currentSong.id;
        document.querySelector('.game-over-modal').remove();
        this.resetGame();
        this.startGame(songId);
    }

    resetGame() {
        this.score = 0;
        this.currentHp = this.maxHp;
        this.circles = [];
        this.scoreSystem.reset();
        this.updateHpBar();
    }

    // 판정 텍스트 표시 메서드 추가
    showJudgementText(x, y, text) {
        const judgement = document.createElement('div');
        judgement.className = 'judgement-text';
        judgement.textContent = text;
        judgement.style.left = `${x}px`;
        judgement.style.top = `${y}px`;
        
        this.canvas.parentElement.appendChild(judgement);
        
        // 애니메이션 후 제거
        setTimeout(() => {
            judgement.remove();
        }, 1000);
    }

    checkHit(x, y) {
        // ... 기존 코드 ...
        const timingDiff = circle.getTimingDifference();
        
        // 난이도에 따른 판정 범위 적용
        if (timingDiff <= this.hitWindows.perfect) {
            this.scoreSystem.addScore('perfect');
            this.showJudgementText(x, y, '퍼펙트!');
        } else if (timingDiff <= this.hitWindows.great) {
            this.scoreSystem.addScore('great');
            this.showJudgementText(x, y, '그레이트!');
        } else if (timingDiff <= this.hitWindows.good) {
            this.scoreSystem.addScore('good');
            this.showJudgementText(x, y, '굿!');
        } else {
            this.scoreSystem.addScore('miss');
            this.showJudgementText(x, y, '미스');
        }
    }
}