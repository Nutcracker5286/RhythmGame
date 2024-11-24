class DifficultySystem {
    constructor() {
        this.difficultyLevels = {
            easy: {
                noteSpeed: 1.0,
                noteSpacing: 1.2,
                beatMultiplier: 0.5,
                forgiveness: 0.2
            },
            normal: {
                noteSpeed: 1.5,
                noteSpacing: 1.0,
                beatMultiplier: 1.0,
                forgiveness: 0.15
            },
            hard: {
                noteSpeed: 2.0,
                noteSpacing: 0.8,
                beatMultiplier: 1.5,
                forgiveness: 0.1
            },
            expert: {
                noteSpeed: 2.5,
                noteSpacing: 0.6,
                beatMultiplier: 2.0,
                forgiveness: 0.05
            }
        };
    }

    getDifficultySettings(level) {
        return this.difficultyLevels[level] || this.difficultyLevels.normal;
    }
}
