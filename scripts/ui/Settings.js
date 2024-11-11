class Settings {
    constructor() {
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettings = document.getElementById('saveSettings');
        this.resolutionSelect = document.getElementById('resolution');
        this.themeSelect = document.getElementById('theme');
        this.gameContainer = document.getElementById('gameContainer');

        this.initializeEventListeners();
        this.loadCurrentSettings();
    }

    initializeEventListeners() {
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', () => {
                this.openSettings();
            });
        }

        if (this.closeSettings) {
            this.closeSettings.addEventListener('click', () => {
                this.closeSettingsModal();
            });
        }

        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', () => {
                this.saveCurrentSettings();
            });
        }

        // 모달 외부 클릭시 닫기
        window.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
    }

    openSettings() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'block';
            this.loadCurrentSettings();
        }
    }

    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'none';
        }
    }

    loadCurrentSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            resolution: 'fullscreen',
            theme: 'warm'
        };

        // 해상도 설정 적용
        if (this.resolutionSelect) {
            this.resolutionSelect.value = settings.resolution;
        }

        // 테마 설정 적용
        if (this.themeSelect) {
            this.themeSelect.value = settings.theme;
        }

        // 해상도 적용
        this.applyResolution(settings.resolution);

        // 테마 적용
        const theme = new Theme();
        theme.applyTheme(settings.theme);
    }

    saveCurrentSettings() {
        const settings = {
            resolution: this.resolutionSelect ? this.resolutionSelect.value : 'fullscreen',
            theme: this.themeSelect ? this.themeSelect.value : 'warm'
        };

        // 설정을 localStorage에 저장
        localStorage.setItem('gameSettings', JSON.stringify(settings));

        // 해상도 적용
        this.applyResolution(settings.resolution);

        // 테마 적용
        const theme = new Theme();
        theme.applyTheme(settings.theme);

        // 모달 닫기
        this.closeSettingsModal();
    }

    applyResolution(resolution) {
        if (!this.gameContainer) return;

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
} 