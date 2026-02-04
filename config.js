// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log("页面加载完成，初始化所有功能");

    // ==================== 1. 黑白模式切换 ====================
    const body = document.body;
    const darkModeBtn = document.getElementById('darkModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');

    // 初始化模式
    function initThemeMode() {
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode === 'light') {
            switchToLightMode();
        } else {
            switchToDarkMode();
        }
    }

    // 切换到暗色模式
    function switchToDarkMode() {
        body.classList.remove('light-mode');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
        localStorage.setItem('themeMode', 'dark');
        console.log("已切换到暗色模式");
    }

    // 切换到亮色模式
    function switchToLightMode() {
        body.classList.add('light-mode');
        darkModeBtn.classList.remove('active');
        lightModeBtn.classList.add('active');
        localStorage.setItem('themeMode', 'light');
        console.log("已切换到亮色模式");
    }

    // 绑定模式切换事件
    darkModeBtn.addEventListener('click', switchToDarkMode);
    lightModeBtn.addEventListener('click', switchToLightMode);

    // ==================== 2. 背景音乐控制 ====================
    const bgMusicBtn = document.getElementById('bgMusicBtn');
    const bgAudio = new Audio('audio/1.mp3');
    bgAudio.loop = true;
    let isBgMusicPlaying = false;

    // 背景音乐切换
    bgMusicBtn.addEventListener('click', function() {
        if (isBgMusicPlaying) {
            bgAudio.pause();
            bgMusicBtn.classList.remove('playing');
            isBgMusicPlaying = false;
            console.log("背景音乐已暂停");
        } else {
            // 解决浏览器自动播放限制
            bgAudio.play().then(() => {
                bgMusicBtn.classList.add('playing');
                isBgMusicPlaying = true;
                console.log("背景音乐已播放");
            }).catch(err => {
                console.error("背景音乐播放失败:", err);
                alert("请先点击页面任意位置激活音频播放权限");
            });
        }
    });

    // ==================== 3. 公告栏关闭 ====================
    const announcement = document.getElementById('announcement');
    const announcementClose = document.getElementById('announcementClose');

    announcementClose.addEventListener('click', function() {
        announcement.style.display = 'none';
        console.log("公告栏已关闭");
    });

    // ==================== 4. 轮播图功能 ====================
    const carousel = document.getElementById('carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselIndicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideCount = carouselItems.length;

    // 切换轮播图
    function showSlide(index) {
        // 处理边界
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        // 隐藏所有轮播项
        carouselItems.forEach(item => item.classList.remove('active'));
        // 移除所有指示器激活状态
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));

        // 显示当前轮播项
        carouselItems[index].classList.add('active');
        // 激活当前指示器
        carouselIndicators[index].classList.add('active');
        
        currentSlide = index;
        console.log(`轮播图切换到第${index + 1}张`);
    }

    // 上一张
    carouselPrev.addEventListener('click', function() {
        showSlide(currentSlide - 1);
    });

    // 下一张
    carouselNext.addEventListener('click', function() {
        showSlide(currentSlide + 1);
    });

    // 指示器点击
    carouselIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
        });
    });

    // 自动轮播
    let slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    // 鼠标悬停暂停轮播
    carousel.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });

    // 鼠标离开恢复轮播
    carousel.addEventListener('mouseleave', function() {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    });

    // ==================== 5. B站视频播放 ====================
    const photoCards = document.querySelectorAll('.photo-card');
    const videoCover = document.getElementById('videoCover');
    const videoIframe = document.getElementById('videoIframe');

    // 绑定卡片点击事件
    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除所有卡片激活状态
            photoCards.forEach(c => c.classList.remove('active'));
            // 激活当前卡片
            this.classList.add('active');
            
            // 获取视频链接
            const videoUrl = this.dataset.video;
            console.log("加载视频:", videoUrl);
            
            // 隐藏封面，显示视频
            videoCover.style.opacity = '0';
            setTimeout(() => {
                videoCover.style.display = 'none';
                videoIframe.src = videoUrl;
                videoIframe.classList.add('active');
            }, 300);
        });
    });

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

    // 音乐列表
    const musicTracks = [
        { title: '小院背景音乐1', artist: '纯音乐', src: 'audio/1.mp3' },
        { title: '小院背景音乐2', artist: '纯音乐', src: 'audio/2.mp3' },
        { title: '小院背景音乐3', artist: '纯音乐', src: 'audio/3.mp3' }
    ];

    let currentTrack = 0;
    const audioPlayer = new Audio();
    let isPlaying = false;
    let volumeLevel = 0.8;

    // 初始化音频播放器
    function initAudioPlayer() {
        // 设置音量
        audioPlayer.volume = volumeLevel;
        volumeFill.style.width = `${volumeLevel * 100}%`;
        
        // 渲染播放列表
        renderPlaylist();
        
        // 加载第一首歌
        loadTrack(currentTrack);
        
        // 绑定音频事件
        bindAudioEvents();
        
        console.log("音乐播放器初始化完成");
    }

    // 渲染播放列表
    function renderPlaylist() {
        audioPlaylist.innerHTML = '';
        
        musicTracks.forEach((track, index) => {
            const trackEl = document.createElement('div');
            trackEl.className = `audio-track ${index === currentTrack ? 'active' : ''}`;
            trackEl.innerHTML = `
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            `;
            
            // 点击播放列表项
            trackEl.addEventListener('click', function() {
                currentTrack = index;
                loadTrack(currentTrack);
                playTrack();
            });
            
            audioPlaylist.appendChild(trackEl);
        });
    }

    // 加载曲目
    function loadTrack(index) {
        // 验证曲目存在
        if (!musicTracks[index]) return;
        
        // 更新播放列表激活状态
        document.querySelectorAll('.audio-track').forEach((el, i) => {
            el.classList.toggle('active', i === index);
        });
        
        // 加载音频
        audioPlayer.src = musicTracks[index].src;
        audioPlayer.load();
        
        // 重置进度条
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';
        
        console.log(`加载曲目: ${musicTracks[index].title}`);
    }

    // 播放曲目
    function playTrack() {
        audioPlayer.play().then(() => {
            isPlaying = true;
            playPauseBtn.textContent = '❚❚';
            console.log("播放当前曲目");
        }).catch(err => {
            console.error("播放失败:", err);
            alert("请先点击页面任意位置激活音频播放权限");
        });
    }

    // 暂停曲目
    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        console.log("暂停当前曲目");
    }

    // 格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 绑定音频事件
    function bindAudioEvents() {
        // 播放进度更新
        audioPlayer.addEventListener('timeupdate', function() {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.left = `${progress}%`;
            
            // 更新时间显示
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        // 音频加载完成
        audioPlayer.addEventListener('loadedmetadata', function() {
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        // 播放结束自动下一曲
        audioPlayer.addEventListener('ended', function() {
            nextTrack();
        });

        // 进度条点击
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = pos * audioPlayer.duration;
        });

        // 音量控制
        volumeSlider.addEventListener('click', function(e) {
            const rect = volumeSlider.getBoundingClientRect();
            volumeLevel = (e.clientX - rect.left) / rect.width;
            volumeLevel = Math.max(0, Math.min(1, volumeLevel));
            
            audioPlayer.volume = volumeLevel;
            volumeFill.style.width = `${volumeLevel * 100}%`;
            
            // 更新音量图标
            if (volumeLevel > 0.5) {
                volumeIcon.textContent = '🔊';
            } else if (volumeLevel > 0) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔇';
            }
        });

        // 播放/暂停按钮
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
        });

        // 上一曲
        prevTrackBtn.addEventListener('click', function() {
            prevTrack();
        });

        // 下一曲
        nextTrackBtn.addEventListener('click', function() {
            nextTrack();
        });
    }

    // 上一曲
    function prevTrack() {
        currentTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length;
        loadTrack(currentTrack);
        
        if (isPlaying) {
            playTrack();
        }
    }

    // 下一曲
    function nextTrack() {
        currentTrack = (currentTrack + 1) % musicTracks.length;
        loadTrack(currentTrack);
        
        if (isPlaying) {
            playTrack();
        }
    }

    // ==================== 7. 页脚功能 ====================
    // 回到顶部
    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log("回到页面顶部");
    });

    // 作者弹窗
    const authorBtn = document.getElementById('authorBtn');
    const authorModal = document.getElementById('authorModal');
    const modalClose = document.getElementById('modalClose');

    // 打开弹窗
    authorBtn.addEventListener('click', function() {
        authorModal.classList.add('active');
        console.log("打开作者弹窗");
    });

    // 关闭弹窗
    modalClose.addEventListener('click', function() {
        authorModal.classList.remove('active');
        console.log("关闭作者弹窗");
    });

    // 点击弹窗外区域关闭
    authorModal.addEventListener('click', function(e) {
        if (e.target === authorModal) {
            authorModal.classList.remove('active');
        }
    });

    // ==================== 初始化所有功能 ====================
    initThemeMode();       // 初始化主题模式
    showSlide(0);          // 初始化轮播图
    initAudioPlayer();     // 初始化音乐播放器
    // 确保视频封面图默认显示
    videoCover.style.display = 'block';
    videoCover.style.opacity = '1';

    console.log("所有功能初始化完成，视频封面图已显示");
});