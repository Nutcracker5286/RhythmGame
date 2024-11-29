class ScoreSystem {
    constructor() {
        this.currentScore = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hitResults = {
            perfect: 0,
            great: 0,
            good: 0,
            miss: 0
        };
        this.grades = {
            perfect: { range: 0.65, score: 1000, text: '퍼펙트!' },
            great: { range: 0.9, score: 800, text: '그레이트!' },
            good: { range: 1.1, score: 500, text: '굿!' },
            miss: { range: Infinity, score: 0, text: '미스' }
        };
        this.comboMultiplier = 0.01; // 콤보당 1% 추가 점수
        this.initializeUI();
    }

    initializeUI() {
        const scoreContainer = document.getElementById('score');
        if (!scoreContainer) {
            console.error('점수 컨테이너를 찾을 수 없습니다');
            return;
        }
        
        scoreContainer.innerHTML = `
            <div class="score-display">점수: ${this.currentScore}</div>
            <div class="combo-display">콤보: ${this.combo}</div>
            <div class="grade-display"></div>
        `;
    }

    evaluateHit(grade) {
        let baseScore = 0;
        let text = '';
        
        switch(grade) {
            case 'perfect':
                baseScore = 1000;
                text = '퍼펙트!';
                this.combo++;
                break;
            case 'great':
                baseScore = 800;
                text = '그레이트!';
                this.combo++;
                break;
            case 'good':
                baseScore = 500;
                text = '굿!';
                this.combo++;
                break;
            case 'miss':
                baseScore = 0;
                text = '미스!';
                this.combo = 0;
                break;
        }

        this.hitResults[grade]++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        // 콤보 보너스 계산
        const comboBonus = Math.floor(baseScore * (this.combo * this.comboMultiplier));
        const finalScore = baseScore + comboBonus;
        
        this.currentScore += finalScore;
        this.updateUI(grade, finalScore);
        
        return {
            grade,
            score: finalScore,
            combo: this.combo,
            text: text
        };
    }

    updateUI(grade, score) {
        const scoreDisplay = document.querySelector('.score-display');
        const comboDisplay = document.querySelector('.combo-display');
        const gradeDisplay = document.querySelector('.grade-display');

        if (scoreDisplay) scoreDisplay.textContent = `점수: ${this.currentScore}`;
        if (comboDisplay) comboDisplay.textContent = `콤보: ${this.combo}`;
        if (gradeDisplay) {
            gradeDisplay.textContent = this.grades[grade].text;
            gradeDisplay.className = `grade-display grade-${grade}`;
            
            // 애니메이션 효과
            gradeDisplay.style.animation = 'none';
            gradeDisplay.offsetHeight; // 리플로우 강제
            gradeDisplay.style.animation = 'fadeOut 1s';
        }
    }

    getResults() {
        const totalNotes = Object.values(this.hitResults).reduce((a, b) => a + b, 0);
        const accuracy = totalNotes > 0 ? 
            ((this.hitResults.perfect * 100 + this.hitResults.great * 80 + this.hitResults.good * 50) / totalNotes).toFixed(2) : 
            0;

        return {
            finalScore: this.currentScore,
            maxCombo: this.maxCombo,
            accuracy: accuracy,
            hitResults: this.hitResults
        };
    }

    reset() {
        this.currentScore = 0;
        this.combo = 0;
        this.maxCombo = 0;
        Object.keys(this.hitResults).forEach(key => this.hitResults[key] = 0);
        this.initializeUI();
    }
}
