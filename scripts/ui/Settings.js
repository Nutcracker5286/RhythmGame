class Settings {
    constructor() {
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettings = document.getElementById('saveSettings');
        this.resolutionSelect = document.getElementById('resolution');
        this.gameContainer = document.getElementById('gameContainer');
        this.startScreenColorPrimary = document.getElementById('startScreenColorPrimary');
        this.startScreenColorSecondary = document.getElementById('startScreenColorSecondary');
        this.startScreen = document.getElementById('startScreen');

        this.initializeEventListeners();
        this.loadCurrentSettings();
    }

    initializeEventListeners() {
        // 설정 모달 열기
        this.settingsButton.addEventListener('click', () => {
            this.settingsModal.style.display = 'block';
            this.loadCurrentSettings();
        });

        // 설정 모달 닫기
        this.closeSettings.addEventListener('click', () => {
            this.settingsModal.style.display = 'none';
        });

        // 모달 외부 클릭시 닫기
        window.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.settingsModal.style.display = 'none';
            }
        });

        // 설정 저장
        this.saveSettings.addEventListener('click', () => this.saveCurrentSettings());
    }

    loadCurrentSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            resolution: 'fullscreen',
            theme: 'warm',
            startScreenColorPrimary: '#2C1810',
            startScreenColorSecondary: '#FF8C61'
        };

        this.resolutionSelect.value = settings.resolution;
        this.startScreenColorPrimary.value = settings.startScreenColorPrimary;
        this.startScreenColorSecondary.value = settings.startScreenColorSecondary;

        this.applyResolution(settings.resolution);
        this.applyStartScreenColors(
            settings.startScreenColorPrimary,
            settings.startScreenColorSecondary
        );
    }

    saveCurrentSettings() {
        const settings = {
            resolution: this.resolutionSelect.value,
            theme: document.body.className.replace('theme-', ''),
            startScreenColorPrimary: this.startScreenColorPrimary.value,
            startScreenColorSecondary: this.startScreenColorSecondary.value
        };

        this.applyResolution(settings.resolution);
        this.applyStartScreenColors(
            settings.startScreenColorPrimary,
            settings.startScreenColorSecondary
        );

        localStorage.setItem('gameSettings', JSON.stringify(settings));
        this.settingsModal.style.display = 'none';
    }

    applyResolution(resolution) {
        if (resolution === 'fullscreen') {
            this.gameContainer.style.width = '100vw';
            this.gameContainer.style.height = '100vh';
            this.gameContainer.classList.remove('windowed');
        } else {
            const [width, height] = resolution.split('x');
            this.gameContainer.style.width = `${width}px`;
            this.gameContainer.style.height = `${height}px`;
            this.gameContainer.classList.add('windowed');
        }
    }

    applyStartScreenColors(primary, secondary) {
        this.startScreen.style.background = `linear-gradient(
            135deg,
            ${primary}E6 0%,
            ${secondary}CC 100%
        )`;
    }
} 