class SongManager {
    constructor() {
        this.songs = this.loadSongs();
        this.bpmDetector = null;
        this.bpmCounts = [];
        this.lastTap = 0;
        
        this.initializeUI();
        this.initializeEventListeners();
    }

    loadSongs() {
        return JSON.parse(localStorage.getItem('customSongs')) || [];
    }

    saveSongs() {
        localStorage.setItem('customSongs', JSON.stringify(this.songs));
    }

    initializeUI() {
        this.updateSongList();
    }

    initializeEventListeners() {
        const form = document.getElementById('songUploadForm');
        const detectBpmBtn = document.getElementById('detectBpm');

        form.addEventListener('submit', (e) => this.handleSongUpload(e));
        detectBpmBtn.addEventListener('click', () => this.startBpmDetection());

        // BPM 수동 측정을 위한 스페이스바 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement.id !== 'songBpm') {
                e.preventDefault();
                this.handleBpmTap();
            }
        });
    }

    async handleSongUpload(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const file = document.getElementById('songFile').files[0];
        
        try {
            // 파일을 Base64로 변환
            const base64 = await this.fileToBase64(file);
            
            const song = {
                id: 'song_' + Date.now(),
                title: document.getElementById('songTitle').value,
                bpm: parseInt(document.getElementById('songBpm').value),
                difficulty: parseInt(document.getElementById('songDifficulty').value),
                file: base64
            };

            this.songs.push(song);
            this.saveSongs();
            this.updateSongList();
            e.target.reset();

        } catch (error) {
            console.error('Failed to upload song:', error);
            alert('음원 추가 중 오류가 발생했습니다.');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    updateSongList() {
        const songList = document.querySelector('.song-list');
        songList.innerHTML = this.songs.map(song => `
            <div class="song-item" data-id="${song.id}">
                <div class="song-info">
                    <h3>${song.title}</h3>
                    <p>BPM: ${song.bpm} / 난이도: ${'★'.repeat(song.difficulty)}</p>
                </div>
                <div class="song-controls">
                    <button class="button" onclick="songManager.previewSong('${song.id}')">미리듣기</button>
                    <button class="button" onclick="songManager.deleteSong('${song.id}')">삭제</button>
                </div>
            </div>
        `).join('');
    }

    startBpmDetection() {
        const file = document.getElementById('songFile').files[0];
        if (!file) {
            alert('먼저 음악 파일을 선택해주세요.');
            return;
        }

        // Web Audio API를 사용한 BPM 감지 로직
        // (실제 구현은 복잡하므로 기본적인 구조만 제공)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const audioBuffer = await audioContext.decodeAudioData(e.target.result);
                const bpm = this.detectBpm(audioBuffer);
                document.getElementById('songBpm').value = Math.round(bpm);
            } catch (error) {
                console.error('BPM 감지 실패:', error);
                alert('BPM을 자동으로 감지할 수 없습니다. 수동으로 입력해주세요.');
            }
        };

        reader.readAsArrayBuffer(file);
    }

    handleBpmTap() {
        const now = Date.now();
        if (this.lastTap) {
            const interval = now - this.lastTap;
            const bpm = Math.round(60000 / interval);
            
            if (bpm >= 60 && bpm <= 200) {  // 유효한 BPM 범위
                this.bpmCounts.push(bpm);
                if (this.bpmCounts.length > 4) {
                    this.bpmCounts.shift();
                }
                
                // 평균 BPM 계산
                const averageBpm = Math.round(
                    this.bpmCounts.reduce((a, b) => a + b) / this.bpmCounts.length
                );
                
                document.getElementById('songBpm').value = averageBpm;
            }
        }
        this.lastTap = now;
    }

    previewSong(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        // 기존 미리듣기 중지
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio = null;
        }

        // 새로운 미리듣기 시작
        this.previewAudio = new Audio(song.file);
        this.previewAudio.play();
        
        // 30초 후 자동 중지
        setTimeout(() => {
            if (this.previewAudio) {
                this.previewAudio.pause();
                this.previewAudio = null;
            }
        }, 30000);
    }

    deleteSong(songId) {
        if (confirm('정말 이 음원을 삭제하시겠습니까?')) {
            this.songs = this.songs.filter(song => song.id !== songId);
            this.saveSongs();
            this.updateSongList();
        }
    }
}

// 인스턴스 생성
const songManager = new SongManager(); 