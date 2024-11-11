document.addEventListener('DOMContentLoaded', function() {
    const game = new Game();
    const settings = new Settings();
    const theme = new Theme();
    
    const mainMenu = document.getElementById('mainMenu');
    const songSelectMenu = document.getElementById('songSelectMenu');
    const startButton = document.getElementById('startButton');
    const backToMain = document.getElementById('backToMain');
    const songButtons = document.querySelectorAll('.song-select-btn');

    // 게임 시작 버튼 클릭 시 노래 선택 메뉴로 전환
    startButton.addEventListener('click', () => {
        mainMenu.classList.add('hidden');
        songSelectMenu.classList.add('active');
    });

    // 뒤로 가기 버튼
    backToMain.addEventListener('click', () => {
        mainMenu.classList.remove('hidden');
        songSelectMenu.classList.remove('active');
    });

    // 노래 선택 버튼들
    songButtons.forEach(button => {
        button.addEventListener('click', () => {
            const songId = button.dataset.song;
            document.getElementById('startScreen').style.display = 'none';
            game.startGame(songId);
        });
    });
}); 