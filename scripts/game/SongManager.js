class SongManager {
    constructor(initUI = false) {
        this.songs = [];
        this.loadSongs();
        if (initUI) {
            this.initializeUI();
        }
    }

    async loadSongs() {
        const musicFiles = [
            { id: 'song1', title: 'Take You On', artist: 'James Mercy, PhiloSofie', bpm: 120, difficulty: '★★☆☆☆', file: '../music/James Mercy, PhiloSofie - Take You On [NCS Release].mp3' },
            { id: 'song2', title: 'Royalty', artist: 'Maestro Chives, Egzod, Neoni', bpm: 130, difficulty: '★★★☆☆', file: '../music/Maestro Chives, Egzod, Neoni - Royalty [NCS Release].mp3' },
            { id: 'song3', title: 'Army', artist: 'Neoni, Arcando, Besomorph', bpm: 140, difficulty: '★★★★☆', file: '../music/Neoni, Arcando, Besomorph - Army [NCS Release].mp3' },
            { id: 'song4', title: 'Your Poison', artist: 'ROY KNOX', bpm: 150, difficulty: '★★★☆☆', file: '../music/ROY KNOX - Your Poison [NCS Release].mp3' },
            { id: 'song5', title: 'Fearless pt. II', artist: 'TULE, Chris Linton', bpm: 160, difficulty: '★★★★☆', file: '../music/TULE, Chris Linton - Fearless pt. II (feat. Chris Linton) [NCS Release].mp3' },
            { id: 'song6', title: 'Mortals', artist: 'Warriyo, Laura Brehm', bpm: 170, difficulty: '★★★★★', file: '../music/Warriyo, Laura Brehm - Mortals (feat. Laura Brehm) [NCS Release].mp3' }
        ];

        this.songs = musicFiles;
        return this.songs;
    }

    updateSongList() {
        const songListContainer = document.querySelector('.song-list');
        if (!songListContainer) return;
        
        songListContainer.innerHTML = '';
        this.songs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <h3>${song.title} - ${song.artist}</h3>
                <p>난이도: ${song.difficulty}</p>
                <p class="song-info">BPM: ${song.bpm} / 길이: N/A</p>
                <button class="button song-select-btn" onclick="selectSong('${song.id}')">선택</button>
            `;
            songListContainer.appendChild(songItem);
        });
    }

    initializeUI() {
        this.updateSongList();
    }
} 