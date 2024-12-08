class AudioManager {
    constructor() {
        this.initAudioContext();
        this.songs = {};
        this.currentSong = null;
        this.isPlaying = false;
        this.audioSource = null;
        this.gainNode = null;
    }

    setSongs(songList) {
        // Convert SongManager's song list to AudioManager's format
        songList.forEach(song => {
            this.songs[song.id] = {
                url: song.file,
                bpm: song.bpm,
                difficulty: song.difficulty
            };
        });
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (!this.audioContext.createGain) {
                throw new Error('Web Audio API not supported');
            }
            
            this.setupAudioNodes();
        } catch (error) {
            console.error('오디오 초기화 실패:', error);
            alert('이 브라우저는 Web Audio API를 지원하지 않습니다.');
        }
    }

    setupAudioNodes() {
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        
        this.gainNode.connect(this.audioContext.destination);
        this.analyser.connect(this.gainNode);
    }

    async loadSong(songId) {
        if (this.audioSource) {
            this.cleanup();
        }

        try {
            const song = this.songs[songId];
            if (!song) throw new Error('존재하지 않는 곡입니다.');

            const response = await fetch(song.url);
            if (!response.ok) throw new Error('음원 로드 실패');

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.currentSong = {
                buffer: audioBuffer,
                bpm: song.bpm,
                offset: song.offset || 0,
                difficulty: song.difficulty,
                startTime: 0
            };

            return true;

        } catch (error) {
            console.error('음원 로드 실패:', error);
            alert('음원을 불러올 수 없습니다.');
            return false;
        }
    }

    play() {
        if (!this.currentSong || this.isPlaying) return;

        try {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.currentSong.buffer;
            
            this.audioSource.connect(this.analyser);
            this.currentSong.startTime = this.audioContext.currentTime;
            
            this.audioSource.start(0);
            this.isPlaying = true;

        } catch (error) {
            console.error('재생 실패:', error);
            this.cleanup();
        }
    }

    cleanup() {
        if (this.audioSource) {
            try {
                this.audioSource.stop();
            } catch (e) {
                // 이미 정지된 상태에서 stop()을 호출할 경우 에러가 발생할 수 있음
            }
            this.audioSource.disconnect();
            this.audioSource = null;
        }
        this.isPlaying = false;
        this.currentSong = null;
    }

    pause() {
        if (this.audioContext && this.isPlaying) {
            this.audioContext.suspend();
            this.isPlaying = false;
        }
    }

    resume() {
        if (this.audioContext && !this.isPlaying) {
            this.audioContext.resume();
            this.isPlaying = true;
        }
    }

    setVolume(value) {
        if (this.gainNode) {
            this.gainNode.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    getBeatTime() {
        return this.audioContext ? this.audioContext.currentTime - this.currentSong.startTime : 0;
    }

    setOnBeatCallback(callback) {
        this.onBeat = callback;
    }

    stop() {
        this.cleanup();
    }
} 