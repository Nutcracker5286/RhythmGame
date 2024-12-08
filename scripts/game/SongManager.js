class SongManager {
    constructor(initializeUI = true) {
        this.songs = [];
        this.loadSongs().then(() => {
            if (initializeUI) {
                this.initializeUI();
            }
        });
    }

    async getSong(songId) {
        const song = this.songs.find(song => song.id === songId);
        if (song) {
            return song;
        }

        await this.loadSongs();
        return this.songs.find(song => song.id === songId);
    }

    updateSongList() {
        const songListContainer = document.querySelector('.song-list');
        if (!songListContainer) return;
        
        songListContainer.innerHTML = '';
        this.songs.forEach(song => {
            const difficultyClass = `difficulty-${song.difficulty}`;
            const stars = '★'.repeat(song.difficulty) + '☆'.repeat(5 - song.difficulty);
            
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <h3>${song.title} - ${song.artist}</h3>
                <p class="difficulty-stars ${difficultyClass}">난이도: ${stars}</p>
                <p class="song-info">BPM: ${song.bpm} / 길이: ${song.duration || '3:30'}</p>
                <button class="button song-select-btn" onclick="selectSong('${song.id}')">선택</button>
            `;
            songListContainer.appendChild(songItem);
        });
    }

    initializeUI() {
        this.updateSongList();
    }

    async loadSongs() {
        try {
            this.songs = [
                {
                    id: 'song1',
                    title: 'Take You On',
                    artist: 'James Mercy, PhiloSofie',
                    bpm: 120,
                    difficulty: 2,
                    duration: '3:24',
                    url: '../../music/James Mercy, PhiloSofie - Take You On [NCS Release].mp3'
                },
                {
                    id: 'song2',
                    title: 'Royalty',
                    artist: 'Maestro Chives, Egzod, Neoni',
                    bpm: 130,
                    difficulty: 3,
                    duration: '3:32',
                    url: '../../music/Maestro Chives, Egzod, Neoni - Royalty [NCS Release].mp3'
                },
                {
                    id: 'song3',
                    title: 'Army',
                    artist: 'Neoni, Arcando, Besomorph',
                    bpm: 140,
                    difficulty: 4,
                    duration: '2:56',
                    url: '../../music/Neoni, Arcando, Besomorph - Army [NCS Release].mp3'
                },
                {
                    id: 'song4',
                    title: 'Your Poison',
                    artist: 'ROY KNOX',
                    bpm: 150,
                    difficulty: 3,
                    duration: '3:42',
                    url: '../../music/ROY KNOX - Your Poison [NCS Release].mp3'
                },
                {
                    id: 'song5',
                    title: 'Fearless pt. II',
                    artist: 'TULE, Chris Linton',
                    bpm: 160,
                    difficulty: 4,
                    duration: '3:14',
                    url: '../../music/TULE, Chris Linton - Fearless pt. II (feat. Chris Linton) [NCS Release].mp3'
                },
                {
                    id: 'song6',
                    title: 'Mortals',
                    artist: 'Warriyo, Laura Brehm',
                    bpm: 170,
                    difficulty: 5,
                    duration: '3:48',
                    url: '../../music/Warriyo, Laura Brehm - Mortals (feat. Laura Brehm) [NCS Release].mp3'
                }
            ];
            return this.songs;
        } catch (error) {
            console.error('노래 목록을 불러오는데 실패했습니다:', error);
            return [];
        }
    }
} 