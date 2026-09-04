document.addEventListener('DOMContentLoaded', function() {
    // ==================== 1. 主题模式切换 ====================
    const body = document.body;
    const darkModeBtn = document.getElementById('darkModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');

    function initThemeMode() {
        if (localStorage.getItem('themeMode') === 'light') {
            switchToLightMode();
        } else {
            switchToDarkMode();
        }
    }

    function switchToDarkMode() {
        body.classList.remove('light-mode');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
        localStorage.setItem('themeMode', 'dark');
    }

    function switchToLightMode() {
        body.classList.add('light-mode');
        darkModeBtn.classList.remove('active');
        lightModeBtn.classList.add('active');
        localStorage.setItem('themeMode', 'light');
    }

    darkModeBtn.addEventListener('click', switchToDarkMode);
    lightModeBtn.addEventListener('click', switchToLightMode);

    // ==================== 2. 背景音乐控制 ====================
    const bgMusicBtn = document.getElementById('bgMusicBtn');
    const bgAudio = new Audio('audio/1.mp3');
    bgAudio.loop = true;
    let isBgMusicPlaying = false;

    bgMusicBtn.addEventListener('click', function() {
        if (isBgMusicPlaying) {
            bgAudio.pause();
            bgMusicBtn.classList.remove('playing');
            isBgMusicPlaying = false;
        } else {
            bgAudio.play().then(() => {
                bgMusicBtn.classList.add('playing');
                isBgMusicPlaying = true;
            }).catch(() => {
                alert("请先点击页面任意位置激活音频播放权限");
            });
        }
    });

    // ==================== 3. 公告栏关闭 ====================
    document.getElementById('announcementClose').addEventListener('click', function() {
        document.getElementById('announcement').style.display = 'none';
    });

    // ==================== 4. 轮播图功能 ====================
    const carousel = document.getElementById('carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselIndicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideCount = carouselItems.length;

    function showSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        carouselItems.forEach(item => item.classList.remove('active'));
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));

        carouselItems[index].classList.add('active');
        carouselIndicators[index].classList.add('active');
        currentSlide = index;
    }

    document.getElementById('carouselPrev').addEventListener('click', () => showSlide(currentSlide - 1));
    document.getElementById('carouselNext').addEventListener('click', () => showSlide(currentSlide + 1));

    carouselIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    let slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);

    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    });

    // ==================== 5. 卡片点击（支持md和视频） ====================
    const photoCards = document.querySelectorAll('.photo-card, .theater-card');
    const videoCover = document.getElementById('videoCover');
    const videoIframe = document.getElementById('videoIframe');

    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            photoCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const url = this.dataset.video;
            const isMd = url.endsWith('.md');
            const container = document.getElementById('mdContainer');

            videoCover.style.opacity = '0';
            setTimeout(() => {
                videoCover.style.display = 'none';
                if (isMd) {
                    videoIframe.style.display = 'none';
                    fetch(url).then(res => res.text()).then(md => {
                        let mdContainer = container || createMdContainer();
                        mdContainer.innerHTML = simpleMarkdown(md);
                        mdContainer.style.display = 'block';
                    });
                } else {
                    if (container) container.style.display = 'none';
                    videoIframe.style.display = '';
                    videoIframe.src = url;
                    videoIframe.classList.add('active');
                }
            }, 300);
        });
    });

    function createMdContainer() {
        const div = document.createElement('div');
        div.id = 'mdContainer';
        div.className = 'md-container';
        document.getElementById('videoContainer').appendChild(div);
        return div;
    }

    function simpleMarkdown(text) {
        return text
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\((https?:\/\/www\.bilibili\.com\/video\/(BV\w+)[^)]*)\)/g,
                '<iframe src="https://player.bilibili.com/player.html?bvid=$3&autoplay=0&high_quality=1&danmaku=0" frameborder="0" allowfullscreen style="width:100%;height:400px;border-radius:12px;"></iframe>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--primary-color);">$1</a>')
            .replace(/\n/g, '<br>');
    }

    // ==================== 6. 音乐播放器 ====================
    const audioPlaylist = document.getElementById('audioPlaylist');
    const playPauseBtn = document.getElementById('playPause');
    const prevTrackBtn = document.getElementById('prevTrack');
    const nextTrackBtn = document.getElementById('nextTrack');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeFill = document.getElementById('volumeFill');

    const musicTracks = [
        { title: '面会菜', artist: '轻音乐', src: 'audio/1.mp3' },
        { title: '鬼迷心窍', artist: '演唱:五哥', src: 'audio/2.mp3' },
        { title: '当你孤单你会想起谁', artist: '演唱:五哥', src: 'audio/3.mp3' },
        { title: '最近比较烦', artist: '演唱:五哥', src: 'audio/4.mp3' }
    ];

    let currentTrack = 0;
    const audioPlayer = new Audio();
    let isPlaying = false;
    let volumeLevel = 0.8;

    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function renderPlaylist() {
        audioPlaylist.innerHTML = '';
        musicTracks.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = `audio-track ${index === currentTrack ? 'active' : ''}`;
            trackEl.innerHTML = `<div class="track-title">${track.title}</div><div class="track-artist">${track.artist}</div>`;
            trackEl.addEventListener('click', () => { currentTrack = index; loadTrack(currentTrack, true); });
            audioPlaylist.appendChild(trackEl);
        });
    }

    function loadTrack(index, autoPlay = false) {
        if (!musicTracks[index]) return;
        if (isPlaying) audioPlayer.pause();

        document.querySelectorAll('.audio-track').forEach((el, i) => el.classList.toggle('active', i === index));

        audioPlayer.src = musicTracks[index].src;
        audioPlayer.load();
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';

        if (autoPlay) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                playPauseBtn.textContent = '❚❚';
            }).catch(() => alert("请先点击页面任意位置激活音频播放权限"));
        } else {
            isPlaying = false;
            playPauseBtn.textContent = '▶';
        }
    }

    function playTrack() {
        audioPlayer.play().then(() => {
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
        }).catch(() => alert("请先点击页面任意位置激活音频播放权限"));
    }

    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = '▶';
    }

    function nextTrack() {
        currentTrack = (currentTrack + 1) % musicTracks.length;
        loadTrack(currentTrack, true);
    }

    function bindAudioEvents() {
        audioPlayer.addEventListener('timeupdate', function() {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.left = `${progress}%`;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener('ended', nextTrack);

        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            audioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
        });

        volumeSlider.addEventListener('click', function(e) {
            const rect = volumeSlider.getBoundingClientRect();
            volumeLevel = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            audioPlayer.volume = volumeLevel;
            volumeFill.style.width = `${volumeLevel * 100}%`;
            volumeIcon.textContent = volumeLevel > 0.5 ? '🔊' : volumeLevel > 0 ? '🔉' : '🔇';
        });

        playPauseBtn.addEventListener('click', () => isPlaying ? pauseTrack() : playTrack());
        prevTrackBtn.addEventListener('click', () => { currentTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length; loadTrack(currentTrack, true); });
        nextTrackBtn.addEventListener('click', nextTrack);
    }

    function initAudioPlayer() {
        audioPlayer.volume = volumeLevel;
        volumeFill.style.width = `${volumeLevel * 100}%`;
        renderPlaylist();
        loadTrack(currentTrack, false);
        bindAudioEvents();
    }

    // ==================== 7. 页脚功能 ====================
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 提示弹窗
    const tipModal = document.getElementById('tipModal');
    const tipClose = document.getElementById('tipClose');
    const tipVideoIframe = document.getElementById('tipVideoIframe');

    function closeTipModal() {
        tipModal.classList.remove('active');
        tipVideoIframe.src = '';
    }

    tipClose.addEventListener('click', closeTipModal);
    tipModal.addEventListener('click', function(e) {
        if (e.target === tipModal) closeTipModal();
    });

    // ==================== 初始化 ====================
    initThemeMode();
    showSlide(0);
    initAudioPlayer();
});
