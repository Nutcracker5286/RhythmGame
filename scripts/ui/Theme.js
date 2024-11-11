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
                hover: '#FF6B3D',
                shadow: 'rgba(255, 140, 97, 0.3)',
                menuBg: 'rgba(44, 24, 16, 0.95)',
                menuAccent: 'rgba(255, 140, 97, 0.8)',
                gradient: {
                    start: 'rgba(44, 24, 16, 0.9)',
                    end: 'rgba(255, 140, 97, 0.8)'
                }
            },
            cool: {
                primary: '#1A2C3B',
                accent: '#61B0FF',
                text: '#D6E4FF',
                hover: '#3D96FF',
                shadow: 'rgba(97, 176, 255, 0.3)',
                menuBg: 'rgba(26, 44, 59, 0.95)',
                menuAccent: 'rgba(97, 176, 255, 0.8)',
                gradient: {
                    start: 'rgba(26, 44, 59, 0.9)',
                    end: 'rgba(97, 176, 255, 0.8)'
                }
            },
            dark: {
                primary: '#121212',
                accent: '#404040',
                text: '#FFFFFF',
                hover: '#505050',
                shadow: 'rgba(64, 64, 64, 0.3)',
                menuBg: 'rgba(18, 18, 18, 0.95)',
                menuAccent: 'rgba(64, 64, 64, 0.8)',
                gradient: {
                    start: 'rgba(18, 18, 18, 0.9)',
                    end: 'rgba(64, 64, 64, 0.8)'
                }
            },
            light: {
                primary: '#F5F5F5',
                accent: '#A0A0A0',
                text: '#333333',
                hover: '#888888',
                shadow: 'rgba(160, 160, 160, 0.3)',
                menuBg: 'rgba(245, 245, 245, 0.95)',
                menuAccent: 'rgba(160, 160, 160, 0.8)',
                gradient: {
                    start: 'rgba(245, 245, 245, 0.9)',
                    end: 'rgba(160, 160, 160, 0.8)'
                }
            }
        };

        const selectedTheme = themes[theme];
        
        // CSS 변수 설정
        document.documentElement.style.setProperty('--primary-bg', selectedTheme.primary);
        document.documentElement.style.setProperty('--primary-accent', selectedTheme.accent);
        document.documentElement.style.setProperty('--text-color', selectedTheme.text);
        document.documentElement.style.setProperty('--hover-color', selectedTheme.hover);
        document.documentElement.style.setProperty('--shadow-color', selectedTheme.shadow);
        document.documentElement.style.setProperty('--menu-bg', selectedTheme.gradient.start);
        document.documentElement.style.setProperty('--menu-accent', selectedTheme.gradient.end);
        
        // body 클래스 및 배경색 설정
        document.body.className = `theme-${theme}`;
        document.body.style.backgroundColor = selectedTheme.primary;

        // 메뉴 배경 그라데이션 설정
        const menuElements = document.querySelectorAll('.menu-screen, #songSelectMenu, #mainMenu');
        menuElements.forEach(element => {
            if (element) {
                element.style.background = `linear-gradient(
                    135deg,
                    ${selectedTheme.gradient.start} 0%,
                    ${selectedTheme.gradient.end} 100%
                )`;
            }
        });
    }
} 