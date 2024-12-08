class DifficultySystem {
    constructor() {
        this.difficultyLevels = {
            1: {
                noteSpeed: 1.0,
                noteSpacing: 1.2,
                beatMultiplier: 0.3,    // 노트 생성 간격 더 늘림
                forgiveness: 0.2,
                hitWindowPerfect: 0.15,  // 판정 범위 더 관대하게
                hitWindowGreat: 0.20,
                hitWindowGood: 0.25,
                noteLifetime: 2000,      // 2초 (매우 여유로움)
                hpDrainRate: 5,          // HP 감소량
                noteFrequency: 0.7       // 노트 생성 빈도
            },
            2: {
                noteSpeed: 1.3,
                noteSpacing: 1.0,
                beatMultiplier: 0.5,
                forgiveness: 0.15,
                hitWindowPerfect: 0.12,
                hitWindowGreat: 0.16,
                hitWindowGood: 0.20,
                noteLifetime: 1500,      // 1.5초
                hpDrainRate: 8,
                noteFrequency: 0.8
            },
            3: {
                noteSpeed: 1.6,
                noteSpacing: 0.9,
                beatMultiplier: 0.8,
                forgiveness: 0.12,
                hitWindowPerfect: 0.10,
                hitWindowGreat: 0.14,
                hitWindowGood: 0.18,
                noteLifetime: 1200,      // 1초
                hpDrainRate: 12,
                noteFrequency: 1.0
            },
            4: {
                noteSpeed: 2.0,
                noteSpacing: 0.8,
                beatMultiplier: 2.0,     // 노트 더 자주 생성
                forgiveness: 0.08,
                hitWindowPerfect: 0.08,  // 더 엄격한 판정
                hitWindowGreat: 0.11,
                hitWindowGood: 0.14,
                noteLifetime: 1000,      // 1초 (빠른 반응 필요)
                hpDrainRate: 15,         // HP 감소량 증가
                noteFrequency: 1.2       // 노트가 더 자주 생성됨
            },
            5: {
                noteSpeed: 2.5,
                noteSpacing: 0.7,
                beatMultiplier: 3.0,     // 노트 매우 자주 생성
                forgiveness: 0.05,
                hitWindowPerfect: 0.06,  // 매우 엄격한 판정
                hitWindowGreat: 0.08,
                hitWindowGood: 0.10,
                noteLifetime: 800,       // 0.8초 (매우 빠른 반응 필요)
                hpDrainRate: 20,         // HP 감소량 매우 높음
                noteFrequency: 1.5       // 노트가 매우 자주 생성됨
            }
        };
    }

    applyDifficultyToGame(game, level) {
        const settings = this.getDifficultySettings(level);
        
        // 노트 생성 간격 설정 (BPM과 난이도 기반)
        game.noteSpawnInterval = (60 / game.currentSong.bpm) * 1000 * settings.beatMultiplier;
        
        // 노트 이동 속도 조정
        game.noteSpeed = settings.noteSpeed;
        
        // 판정 범위 조정
        game.hitWindows = {
            perfect: settings.hitWindowPerfect,
            great: settings.hitWindowGreat,
            good: settings.hitWindowGood
        };
        
        // HP 시스템 설정
        game.hpDrainRate = settings.hpDrainRate;
        game.missPenalty = 10 + (level * 5);  // 미스 시 HP 감소량 증가
        
        // 노트 생성 빈도 및 수명 설정
        game.noteFrequency = settings.noteFrequency;
        game.noteLifetime = settings.noteLifetime;
        
        return settings;
    }

    getDifficultySettings(level) {
        return this.difficultyLevels[level] || this.difficultyLevels[3];
    }
}
