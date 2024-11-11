class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.songs = {
            song1: {
                url: '../assets/songs/song1.mp3',
                bpm: 120,
                offset: 0,
                difficulty: 1
            },
            song2: {
                url: '../assets/songs/song2.mp3',
                bpm: 140,
                offset: 0,
                difficulty: 2
            },
            song3: {
                url: '../assets/songs/song3.mp3',
                bpm: 160,
                offset: 0,
                difficulty: 3
            }
        };
        this.currentSong = null;
        this.isPlaying = false;
        this.beatInterval = null;
        this.onBeat = null;
    }

    async loadSong(songId) {
        const song = this.songs[songId];
        if (!song) return;

        try {
            const response = await fetch(song.url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.currentSong = {
                buffer: audioBuffer,
                bpm: song.bpm,
                offset: song.offset,
                difficulty: song.difficulty
            };

            // 비트 간격 계산 (ms)
            this.beatInterval = (60 / song.bpm) * 1000;
            
            return true;
        } catch (error) {
            console.error('Failed to load song:', error);
            return false;
        }
    }

    play() {
        if (!this.currentSong || this.isPlaying) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.currentSong.buffer;
        
        // 오디오 분석을 위한 설정
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // 비트 감지를 위한 설정
        this.analyser.fftSize = 2048;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.start(0);
        this.isPlaying = true;

        // 비트 감지 루프
        const detectBeat = () => {
            if (!this.isPlaying) return;

            this.analyser.getByteFrequencyData(dataArray);
            
            // 저주파 영역의 평균 계산
            let sum = 0;
            const lowFreqRange = 10; // 저주파 범위
            
            for (let i = 0; i < lowFreqRange; i++) {
                sum += dataArray[i];
            }
            
            const average = sum / lowFreqRange;
            
            // 임계값을 넘으면 비트로 간주
            if (average > 200 && this.onBeat) {
                this.onBeat();
            }

            requestAnimationFrame(detectBeat);
        };

        detectBeat();
    }

    pause() {
        if (!this.isPlaying) return;
        this.audioContext.suspend();
        this.isPlaying = false;
    }

    resume() {
        if (this.isPlaying) return;
        this.audioContext.resume();
        this.isPlaying = true;
    }

    stop() {
        this.audioContext.suspend();
        this.isPlaying = false;
        this.currentSong = null;
    }

    setOnBeatCallback(callback) {
        this.onBeat = callback;
    }

    getCurrentTime() {
        return this.audioContext.currentTime;
    }

    getDifficulty() {
        return this.currentSong ? this.currentSong.difficulty : 1;
    }
} 