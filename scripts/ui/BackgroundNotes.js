class BackgroundNotes {
    constructor() {
        this.notes = [];
        this.container = document.createElement('div');
        this.container.className = 'background-notes';
        document.getElementById('mainMenu').appendChild(this.container);
        
        this.noteTypes = ['♪', '♫', '♬', '♩', '𝄞', '𝅘𝅥𝅮', '𝅗𝅥', '𝄢'];
        
        this.init();
    }

    init() {
        // 초기 음표 수 증가
        for (let i = 0; i < 40; i++) {
            this.createNote();
        }
        
        // 더 자주 음표 생성
        setInterval(() => {
            if (this.notes.length < 50) {
                this.createNote();
            }
        }, 500);
    }

    createNote() {
        const note = document.createElement('div');
        note.className = 'music-note';
        
        note.textContent = this.noteTypes[Math.floor(Math.random() * this.noteTypes.length)];
        const size = Math.random() < 0.3 ? 'large' : 
                    Math.random() < 0.6 ? 'medium' : 'small';
        note.classList.add(`note-${size}`);
        
        // 검정색 음표로 통일
        note.style.color = '#000000';
        // 미세한 그림자로 깊이감 추가
        note.style.textShadow = '0 0 1px rgba(0, 0, 0, 0.5)';
        
        const startX = Math.random() * (window.innerWidth + 200) - 100;
        note.style.left = `${startX}px`;
        note.style.top = '-50px';
        
        this.container.appendChild(note);
        this.notes.push(note);

        anime({
            targets: note,
            translateY: window.innerHeight + 100,
            translateX: anime.random(-200, 200),
            rotate: {
                value: anime.random(-720, 720),
                duration: anime.random(3000, 8000),
            },
            opacity: [
                { value: 0, duration: 0 },
                { value: 1, duration: 100 },
                { value: 1, duration: 3000 },
                { value: 0, duration: 500 }
            ],
            duration: anime.random(4000, 10000),
            easing: 'easeOutSine',
            complete: () => {
                note.remove();
                this.notes = this.notes.filter(n => n !== note);
            }
        });
    }
} 