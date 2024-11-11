class Theme {
    constructor() {
        this.themeSelect = document.getElementById('theme');
        this.initializeEventListeners();
        this.loadCurrentTheme();
    }

    initializeEventListeners() {
        if (this.themeSelect) {
            this.themeSelect.addEventListener('change', () => {
                this.applyTheme(this.themeSelect.value);
            });
        }
    }

    loadCurrentTheme() {
        const settings = JSON.parse(localStorage.getItem('gameSettings')) || {
            theme: 'warm'
        };
        if (this.themeSelect) {
            this.themeSelect.value = settings.theme;
        }
        this.applyTheme(settings.theme);
    }

    applyTheme(theme) {
        const themes = {
            warm: {
                primary: '#2C1810',
                accent: '#FF8C61',
                text: '#FFE4D6',
                menuBg: 'rgba(44, 24, 16, 0.95)',
                menuAccent: 'rgba(255, 140, 97, 0.8)'
            },
            cool: {
                primary: '#1A2C3B',
                accent: '#61B0FF',
                text: '#D6E4FF',
                menuBg: 'rgba(26, 44, 59, 0.95)',
                menuAccent: 'rgba(97, 176, 255, 0.8)'
            },
            dark: {
                primary: '#121212',
                accent: '#404040',
                text: '#FFFFFF',
                menuBg: 'rgba(18, 18, 18, 0.95)',
                menuAccent: 'rgba(64, 64, 64, 0.8)'
            },
            light: {
                primary: '#F5F5F5',
                accent: '#A0A0A0',
                text: '#333333',
                menuBg: 'rgba(245, 245, 245, 0.95)',
                menuAccent: 'rgba(160, 160, 160, 0.8)'
            }
        };

        const selectedTheme = themes[theme];
        
        // 기본 테마 클래스 설정
        document.body.className = `theme-${theme}`;
        
        // CSS 변수 설정
        document.documentElement.style.setProperty('--primary-bg', selectedTheme.primary);
        document.documentElement.style.setProperty('--primary-accent', selectedTheme.accent);
        document.documentElement.style.setProperty('--text-color', selectedTheme.text);
        
        // body 배경색 직접 설정
        document.body.style.backgroundColor = selectedTheme.primary;
        
        // 메뉴 배경 설정
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.background = `linear-gradient(
                135deg,
                ${selectedTheme.menuBg} 0%,
                ${selectedTheme.menuAccent} 100%
            )`;
        }

        // 시작 화면 배경 설정
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.style.background = `linear-gradient(
                135deg,
                ${selectedTheme.menuBg} 0%,
                ${selectedTheme.menuAccent} 100%
            )`;
        }

        // 모달 배경 설정
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.background = `linear-gradient(
                135deg,
                ${selectedTheme.menuBg} 0%,
                ${selectedTheme.menuAccent} 100%
            )`;
        }
    }
} 