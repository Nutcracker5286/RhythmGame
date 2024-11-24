class UserProfile {
    constructor() {
        this.userData = {
            username: '',
            totalPlayCount: 0,
            totalScore: 0,
            averageAccuracy: 0,
            songRecords: {},
            achievements: []
        };
        this.loadUserData();
    }

    loadUserData() {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            this.userData = JSON.parse(savedData);
        }
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    updateSongRecord(songId, score, accuracy, combo) {
        if (!this.userData.songRecords[songId]) {
            this.userData.songRecords[songId] = {
                highScore: 0,
                bestAccuracy: 0,
                bestCombo: 0,
                playCount: 0
            };
        }

        const record = this.userData.songRecords[songId];
        record.playCount++;
        record.highScore = Math.max(record.highScore, score);
        record.bestAccuracy = Math.max(record.bestAccuracy, accuracy);
        record.bestCombo = Math.max(record.bestCombo, combo);

        this.saveUserData();
    }
} 