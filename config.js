document.addEventListener('DOMContentLoaded', function() {
    // ========== 1. 修复明暗模式切换 ==========
    const body = document.body;
    const darkModeBtn = document.getElementById('darkModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');
    
    function initMode() {
        const savedMode = localStorage.getItem('pageMode');
        if (savedMode === 'light') {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    }

    function enableDarkMode() {
        body.classList.remove('light-mode');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
        localStorage.setItem('pageMode', 'dark');
    }

    function enableLightMode() {
        body.classList.add('light-mode');
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
        localStorage.setItem('pageMode', 'light');
    }

    darkModeBtn.addEventListener('click', enableDarkMode);
    lightModeBtn.addEventListener('click', enableLightMode);
    initMode();

    // ========== 2. 背景音乐播放 ==========
    const musicBtn = document.getElementById('musicBtn');
    const audio = new Audio('audio/1.mp3'); 
    let isMusicPlaying = false;

    musicBtn.addEventListener('click', function() {
        if (isMusicPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
            isMusicPlaying = false;
        } else {
            audio.play().then(() => {
                musicBtn.classList.add('playing');
                isMusicPlaying = true;
            }).catch(error => {
                console.error('播放失败:', error);
                alert('播放失败，请检查音频路径或浏览器权限');
            });
        }
    });

    audio.addEventListener('ended', function() {
        musicBtn.classList.remove('playing');
        isMusicPlaying = false;
    });

    audio.addEventListener('error', function() {
        alert('音频文件加载失败，请确认路径是否正确：audio/1.mp3');
    });

    // ========== 3. 粒子特效 ==========
    let lastX = 0, lastY = 0;
    const particleCount = 8;
    const fireworkCount = 15;
    const particleInterval = 15;
    window.lastParticleTime = 0;

    function createTrailParticle(x, y) {
        const dx = x - lastX;
        const dy = y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.5) return;

        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x - size/2}px`;
        particle.style.top = `${y - size/2}px`;

        const tx = (Math.random() - 0.5) * 15 - dx * 1.5;
        const ty = (Math.random() - 0.5) * 15 - dy * 1.5;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animation = `trail 0.8s ease-out forwards`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);

        lastX = x;
        lastY = y;
    }

    function createFireworkParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x - size/2}px`;
        particle.style.top = `${y - size/2}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 30;
        const fx = Math.cos(angle) * distance;
        const fy = Math.sin(angle) * distance;
        particle.style.setProperty('--fx', `${fx}px`);
        particle.style.setProperty('--fy', `${fy}px`);
        particle.style.animation = `firework 1.2s ease-out forwards`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - window.lastParticleTime < particleInterval) return;
        window.lastParticleTime = now;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => createTrailParticle(e.clientX, e.clientY), i * 10);
        }
    });

    document.addEventListener('click', (e) => {
        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => createFireworkParticle(e.clientX, e.clientY), i * 20);
        }
    });

    // ========== 4. 公告关闭 ==========
    const announcement = document.getElementById('announcement');
    const announcementClose = document.getElementById('announcementClose');
    localStorage.removeItem('announcementClosed');
    
    announcementClose.addEventListener('click', () => {
        announcement.classList.add('hidden');
        setTimeout(() => announcement.style.display = 'none', 300);
    });

    // ========== 5. 轮播图 ==========
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateSlideActiveState() {
        carouselItems.forEach((item, i) => item.classList.toggle('active-slide', i === currentIndex));
    }

    function goToSlide(index) {
        index = index < 0 ? totalItems - 1 : index >= totalItems ? 0 : index;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
        currentIndex = index;
        updateSlideActiveState();
    }

    updateSlideActiveState();
    let autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000);

    prevBtn.addEventListener('click', () => { 
        clearInterval(autoPlay); 
        goToSlide(currentIndex - 1); 
        autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000); 
    });
    
    nextBtn.addEventListener('click', () => { 
        clearInterval(autoPlay); 
        goToSlide(currentIndex + 1); 
        autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000); 
    });
    
    indicators.forEach(ind => ind.addEventListener('click', () => { 
        clearInterval(autoPlay); 
        goToSlide(parseInt(ind.dataset.index)); 
        autoPlay = setInterval(() => goToSlide(currentIndex + 1), 5000); 
    }));

    // ========== 6. 修复视频播放 ==========
    const photoCards = document.querySelectorAll('.photo-card, .spring-festival-card');
    const initialImage = document.getElementById('initialImage');
    const videoIframe = document.getElementById('videoIframe');

    // 修复视频播放核心问题
    photoCards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除所有卡片的active状态
            document.querySelectorAll('.photo-card').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.spring-festival-card').forEach(c => c.classList.remove('active'));
            // 给当前点击的卡片添加active状态
            card.classList.add('active');
            
            // 重置iframe状态
            videoIframe.src = '';
            videoIframe.classList.remove('loaded');
            initialImage.style.opacity = '1';
            initialImage.style.display = 'block';
            
            // 延迟加载视频，确保用户交互生效
            setTimeout(() => {
                const videoUrl = card.dataset.video;
                videoIframe.src = videoUrl;
                videoIframe.classList.add('loaded');
                
                // 监听iframe加载完成
                videoIframe.onload = function() {
                    initialImage.style.opacity = '0';
                    setTimeout(() => initialImage.style.display = 'none', 500);
                };
                
                // 视频加载错误处理
                videoIframe.onerror = function() {
                    alert(`视频加载失败，请检查链接是否有效：${videoUrl}`);
                    initialImage.style.opacity = '1';
                    videoIframe.classList.remove('loaded');
                };
            }, 300);
        });
    });

    // ========== 7. 音频播放器 ==========
    const audioTracks = [
        { title: "音乐1 - 最近比较烦", artist: "五哥", src: "audio/1.mp3" },
        { title: "音乐2 - 鬼迷了心窍", artist: "五哥", src: "audio/2.mp3" },
        { title: "音乐3 - 当你孤单你会想起谁", artist: "五哥", src: "audio/3.mp3" }
    ];

    const playerAudio = new Audio();
    let currentTrackIndex = 0;
    let isPlaying = false;
    let volume = 0.7;
    let isDragging = false;

    const audioPlaylist = document.getElementById('audioPlaylist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevTrackBtn = document.getElementById('prevTrackBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeFill = document.getElementById('volumeFill');
    const volumeIcon = document.getElementById('volumeIcon');

    // 初始化播放列表
    function initPlaylist() {
        audioPlaylist.innerHTML = '';
        audioTracks.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = `audio-track ${index === currentTrackIndex ? 'active' : ''}`;
            trackEl.dataset.index = index;
            trackEl.innerHTML = `
                <div class="audio-track-title">${track.title}</div>
                <div class="audio-track-artist">${track.artist}</div>
            `;
            trackEl.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack();
                playTrack();
            });
            audioPlaylist.appendChild(trackEl);
        });
    }

    // 格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 加载音频轨道