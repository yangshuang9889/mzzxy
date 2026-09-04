(() => {
    const ROWS = 5, COLS = 4;

    // ===== 音效 =====
    let audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    const SFX = {
        move() {
            if (!soundOn) return;
            const ctx = getAudioCtx(), t = ctx.currentTime;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(600, t);
            o.frequency.exponentialRampToValueAtTime(400, t + 0.08);
            g.gain.setValueAtTime(0.15, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            o.connect(g).connect(ctx.destination);
            o.start(t); o.stop(t + 0.08);
        },
        select() {
            if (!soundOn) return;
            const ctx = getAudioCtx(), t = ctx.currentTime;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(800, t);
            g.gain.setValueAtTime(0.1, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            o.connect(g).connect(ctx.destination);
            o.start(t); o.stop(t + 0.06);
        },
        win() {
            if (!soundOn) return;
            const ctx = getAudioCtx(), t = ctx.currentTime;
            [523, 659, 784, 1047].forEach((freq, i) => {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'triangle';
                o.frequency.setValueAtTime(freq, t + i * 0.15);
                g.gain.setValueAtTime(0.2, t + i * 0.15);
                g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.4);
                o.connect(g).connect(ctx.destination);
                o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.4);
            });
        },
        lose() {
            if (!soundOn) return;
            const ctx = getAudioCtx(), t = ctx.currentTime;
            [400, 350, 300, 250].forEach((freq, i) => {
                const o = ctx.createOscillator(), g = ctx.createGain();
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(freq, t + i * 0.2);
                g.gain.setValueAtTime(0.12, t + i * 0.2);
                g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.3);
                o.connect(g).connect(ctx.destination);
                o.start(t + i * 0.2); o.stop(t + i * 0.2 + 0.3);
            });
        },
        tick() {
            if (!soundOn) return;
            const ctx = getAudioCtx(), t = ctx.currentTime;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'square';
            o.frequency.setValueAtTime(1000, t);
            g.gain.setValueAtTime(0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
            o.connect(g).connect(ctx.destination);
            o.start(t); o.stop(t + 0.03);
        }
    };

    // ===== 关卡数据 =====
    const DEFAULT_MD = `# 华容道关卡数据

## 经典横刀立马

| ID | 名称 | 宽 | 高 | 行 | 列 |
|----|------|----|----|----|----|
| caocao | 曹操 | 2 | 2 | 0 | 1 |
| zhangfei | 张飞 | 1 | 2 | 0 | 0 |
| zhaoyun | 赵云 | 1 | 2 | 0 | 3 |
| guanyu | 关羽 | 2 | 1 | 2 | 1 |
| machao | 马超 | 1 | 2 | 3 | 0 |
| huangzhong | 黄忠 | 1 | 2 | 3 | 3 |
| b1 | 卒 | 1 | 1 | 2 | 0 |
| b2 | 卒 | 1 | 1 | 2 | 3 |
| b3 | 卒 | 1 | 1 | 3 | 1 |
| b4 | 卒 | 1 | 1 | 3 | 2 |

## 兵分三路

| ID | 名称 | 宽 | 高 | 行 | 列 |
|----|------|----|----|----|----|
| caocao | 曹操 | 2 | 2 | 0 | 0 |
| zhangfei | 张飞 | 1 | 2 | 0 | 2 |
| huangzhong | 黄忠 | 1 | 2 | 0 | 3 |
| guanyu | 关羽 | 2 | 1 | 2 | 0 |
| machao | 马超 | 1 | 2 | 2 | 2 |
| zhaoyun | 赵云 | 1 | 2 | 2 | 3 |
| b1 | 卒 | 1 | 1 | 3 | 0 |
| b2 | 卒 | 1 | 1 | 3 | 1 |
| b3 | 卒 | 1 | 1 | 4 | 0 |
| b4 | 卒 | 1 | 1 | 4 | 1 |

## 层层包围

| ID | 名称 | 宽 | 高 | 行 | 列 |
|----|------|----|----|----|----|
| caocao | 曹操 | 2 | 2 | 0 | 1 |
| zhangfei | 张飞 | 1 | 2 | 0 | 0 |
| zhaoyun | 赵云 | 1 | 2 | 0 | 3 |
| machao | 马超 | 1 | 2 | 2 | 0 |
| huangzhong | 黄忠 | 1 | 2 | 2 | 3 |
| guanyu | 关羽 | 2 | 1 | 3 | 1 |
| b1 | 卒 | 1 | 1 | 2 | 1 |
| b2 | 卒 | 1 | 1 | 2 | 2 |
| b3 | 卒 | 1 | 1 | 4 | 0 |
| b4 | 卒 | 1 | 1 | 4 | 3 |`;

    function parseMD(md) {
        const layouts = [];
        const sections = md.split(/^## /m).slice(1);
        for (const sec of sections) {
            const lines = sec.trim().split('\n');
            const name = lines[0].trim();
            const tableLines = lines.filter(l => l.startsWith('|'));
            if (tableLines.length < 2) continue;
            const rows = tableLines.slice(1).filter(r => !/\|-+\|/.test(r));
            const blocks = rows.map(row => {
                const cols = row.split('|').map(c => c.trim()).filter(Boolean);
                return {
                    id: cols[0], name: cols[1],
                    w: parseInt(cols[2]), h: parseInt(cols[3]),
                    r: parseInt(cols[4]), c: parseInt(cols[5])
                };
            });
            layouts.push({ name, blocks });
        }
        return layouts;
    }

    async function loadFromMD() {
        const saved = localStorage.getItem('hrd_levels_md');
        if (saved) return parseMD(saved);
        try {
            const resp = await fetch('levels.md?t=' + Date.now());
            if (resp.ok) {
                const text = await resp.text();
                const parsed = parseMD(text);
                if (parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return parseMD(DEFAULT_MD);
    }

    // ===== 游戏状态 =====
    let CELL = 80, GAP = 3, PAD = 6;
    let timeLimit = parseInt(localStorage.getItem('hrd_timeLimit')) || 480;
    let soundOn = localStorage.getItem('hrd_sound') !== 'off';
    let bgmOn = localStorage.getItem('hrd_bgm') !== 'off';
    let controlMode = localStorage.getItem('hrd_control') || 'click';
    let difficulty = localStorage.getItem('hrd_difficulty') || 'normal';
    let oneStepWin = false;
    let unlockedMedium = localStorage.getItem('hrd_unlocked_medium') === '1';
    let unlockedHard = localStorage.getItem('hrd_unlocked_hard') === '1';

    const bgm = document.getElementById('bgm');
    bgm.src = '1.mp3';
    bgm.volume = 0.5;

    function playBGM() {
        if (!bgmOn) return;
        bgm.load();
        bgm.play().catch(() => {
            const resume = () => { bgm.play().catch(() => {}); document.removeEventListener('touchstart', resume); document.removeEventListener('click', resume); };
            document.addEventListener('touchstart', resume, { once: true });
            document.addEventListener('click', resume, { once: true });
        });
    }

    const API_BASE = localStorage.getItem('hrd_api') || 'https://hrsapi.xn--yrv04v.com';
    let LAYOUTS = [];
    let currentLevel = 0;

    async function api(path, method = 'GET', body = null) {
        try {
            const opts = { method, headers: { 'Content-Type': 'application/json' } };
            if (body) opts.body = JSON.stringify(body);
            const resp = await fetch(API_BASE + path, opts);
            return await resp.json();
        } catch (e) { return null; }
    }

    async function trackOnline(join) {
        const url = API_BASE + '/api/online';
        if (join) {
            await api('/api/online', 'POST', { action: 'join' });
        } else {
            const data = JSON.stringify({ action: 'leave' });
            try {
                navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }));
            } catch (e) {
                fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true }).catch(() => {});
            }
        }
    }

    async function updateOnlineCount() {
        const data = await api('/api/online');
        if (data) document.getElementById('onlineCount').textContent = data.online;
    }

    // ===== 棋盘尺寸 =====
    function updateDimensions() {
        const boardEl = document.querySelector('.board');
        const boardWidth = (boardEl && boardEl.offsetWidth > 0) ? boardEl.offsetWidth : Math.min(340, window.innerWidth - 32);
        CELL = Math.floor((Math.max(boardWidth, 280) - 12) / 4);
        GAP = Math.max(2, Math.floor(CELL * 0.04));
        PAD = Math.max(4, Math.floor(CELL * 0.07));
    }
    window.addEventListener('resize', () => { updateDimensions(); render(); });

    // ===== 游戏变量 =====
    let blocks = [];
    let board = [];
    let selected = null;
    let moveCount = 0;
    let seconds = timeLimit;
    let timer = null;
    let started = false;
    let won = false;
    let lost = false;
    let history = [];

    // ===== DOM 引用 =====
    const boardEl = document.getElementById('board');
    const timerEl = document.getElementById('timer');
    const timerLabel = document.getElementById('timerLabel');
    const movesEl = document.getElementById('moves');
    const undoBtn = document.getElementById('undoBtn');
    const restartBtn = document.getElementById('restartBtn');
    const levelSel = document.getElementById('level');
    const winOverlay = document.getElementById('winOverlay');
    const winStats = document.getElementById('winStats');
    const playAgainBtn = document.getElementById('playAgain');
    const loseOverlay = document.getElementById('loseOverlay');
    const loseStats = document.getElementById('loseStats');
    const retryBtn = document.getElementById('retryBtn');
    const startScreen = document.getElementById('startScreen');
    const startBtn = document.getElementById('startBtn');
    const startLevel = document.getElementById('startLevel');
    const gameContainer = document.getElementById('gameContainer');
    const gameTitle = document.getElementById('gameTitle');

    // ===== 棋盘逻辑 =====
    function initBoard() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    }

    function placeBlock(b) {
        for (let dr = 0; dr < b.h; dr++)
            for (let dc = 0; dc < b.w; dc++)
                board[b.r + dr][b.c + dc] = b.id;
    }

    function removeBlock(b) {
        for (let dr = 0; dr < b.h; dr++)
            for (let dc = 0; dc < b.w; dc++)
                board[b.r + dr][b.c + dc] = null;
    }

    function canMove(b, dr, dc) {
        const nr = b.r + dr, nc = b.c + dc;
        if (nr < 0 || nr + b.h > ROWS || nc < 0 || nc + b.w > COLS) return false;
        removeBlock(b);
        for (let r = nr; r < nr + b.h; r++)
            for (let c = nc; c < nc + b.w; c++)
                if (board[r][c] !== null) { placeBlock(b); return false; }
        placeBlock(b);
        return true;
    }

    function saveState() {
        history.push(blocks.map(b => ({ r: b.r, c: b.c })));
        if (history.length > 200) history.shift();
        undoBtn.disabled = false;
    }

    function undo() {
        if (history.length === 0) return;
        const state = history.pop();
        initBoard();
        state.forEach((s, i) => { blocks[i].r = s.r; blocks[i].c = s.c; });
        blocks.forEach(b => placeBlock(b));
        moveCount = Math.max(0, moveCount - 1);
        movesEl.textContent = moveCount;
        SFX.move();
        selected = null;
        render();
        if (history.length === 0) undoBtn.disabled = true;
    }

    function doMove(b, dr, dc) {
        if (won || lost || !canMove(b, dr, dc)) return;
        if (!started) startTimer();
        saveState();
        removeBlock(b);
        b.r += dr;
        b.c += dc;
        placeBlock(b);
        moveCount++;
        movesEl.textContent = moveCount;
        SFX.move();
        render();
        checkWin();
        if (oneStepWin && !won) {
            const cao = blocks.find(b2 => b2.id === 'caocao');
            if (cao) { cao.r = ROWS - 2; cao.c = 1; }
            render();
            won = true;
            stopTimer();
            SFX.win();
            setTimeout(showWin, 300);
        }
    }

    function checkWin() {
        const cao = blocks.find(b => b.id === 'caocao');
        if (cao && cao.r + cao.h === ROWS && cao.c <= 1 && cao.c + cao.w >= 3) {
            won = true;
            stopTimer();
            SFX.win();
            setTimeout(showWin, 600);
        }
    }

    // ===== 计时器 =====
    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function startTimer() {
        started = true;
        timer = setInterval(() => {
            if (timeLimit === 0) {
                seconds++;
                timerEl.textContent = formatTime(seconds);
            } else {
                seconds--;
                timerEl.textContent = formatTime(seconds);
                if (seconds <= 10 && seconds > 0) SFX.tick();
                if (seconds <= 60) timerEl.parentElement.classList.add('timer-warning');
                if (seconds <= 0) {
                    lost = true;
                    stopTimer();
                    SFX.lose();
                    setTimeout(showLose, 500);
                }
            }
        }, 1000);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    // ===== 游戏结果 =====
    function showWin() {
        const elapsed = timeLimit === 0 ? seconds : timeLimit - seconds;
        winStats.textContent = `用时 ${elapsed} 秒，共 ${moveCount} 步`;
        currentLevel = parseInt(levelSel.value);
        const lvlName = LAYOUTS[currentLevel] ? LAYOUTS[currentLevel].name : '';
        if (difficulty === 'normal' && !unlockedMedium) {
            unlockedMedium = true;
            localStorage.setItem('hrd_unlocked_medium', '1');
            winStats.textContent += '\n解锁中等难度！';
        } else if (difficulty === 'medium' && !unlockedHard) {
            unlockedHard = true;
            localStorage.setItem('hrd_unlocked_hard', '1');
            winStats.textContent += '\n解锁变态难度！';
        }
        if (lvlName === '小泽回家') {
            bgm.pause();
            const videoOverlay = document.getElementById('videoOverlay');
            const videoFrame = document.getElementById('videoFrame');
            videoFrame.src = 'https://player.bilibili.com/player.html?bvid=BV1wdZABRE3x&autoplay=1&t=2684&end=3214';
            videoOverlay.style.display = 'flex';
            setTimeout(() => { videoOverlay.style.display = 'none'; videoFrame.src = ''; }, (53*60+34 - 44*60-44) * 1000);
        } else {
            winOverlay.style.display = 'flex';
        }
    }

    function showLose() {
        const elapsed = timeLimit === 0 ? seconds : timeLimit;
        loseStats.textContent = `已走 ${moveCount} 步，用时 ${elapsed} 秒`;
        loseOverlay.style.display = 'flex';
    }

    // ===== 新游戏 =====
    function newGame() {
        stopTimer();
        blocks = []; board = []; selected = null;
        moveCount = 0;

        if (difficulty === 'normal') {
            timeLimit = 0;
        } else if (difficulty === 'medium') {
            timeLimit = parseInt(localStorage.getItem('hrd_timeLimit')) || 480;
        } else if (difficulty === 'hard') {
            const hardTimes = [240, 300, 360, 420, 480];
            timeLimit = hardTimes[Math.floor(Math.random() * hardTimes.length)];
        }

        seconds = timeLimit === 0 ? 0 : timeLimit;
        started = false; won = false; lost = false; history = [];
        timerEl.textContent = formatTime(seconds);
        timerLabel.textContent = timeLimit === 0 ? '已用' : '剩余';
        timerEl.parentElement.classList.remove('timer-warning');
        movesEl.textContent = '0';
        undoBtn.disabled = true;
        winOverlay.style.display = 'none';
        loseOverlay.style.display = 'none';

        const layout = LAYOUTS[levelSel.value];
        const caocao = { ...layout.blocks.find(b => b.id === 'caocao') };
        const generals = layout.blocks.filter(b => b.id !== 'caocao' && (b.w > 1 || b.h > 1)).map(b => ({ ...b }));
        const pawns = layout.blocks.filter(b => b.w === 1 && b.h === 1).map(b => ({ ...b }));
        const shuffledGenerals = generals.sort(() => Math.random() - 0.5);

        for (let attempt = 0; attempt < 500; attempt++) {
            initBoard();
            blocks = [];

            const tryPlace = (b, preferBottom, preferTop) => {
                const positions = [];
                for (let r = 0; r <= ROWS - b.h; r++)
                    for (let c = 0; c <= COLS - b.w; c++)
                        positions.push({ r, c });
                if (preferBottom) {
                    positions.sort((a, b) => b.r - a.r || Math.random() - 0.5);
                } else if (preferTop) {
                    positions.sort((a, b) => a.r - b.r || Math.random() - 0.5);
                } else {
                    for (let i = positions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [positions[i], positions[j]] = [positions[j], positions[i]];
                    }
                }
                for (const pos of positions) {
                    b.r = pos.r; b.c = pos.c;
                    let ok = true;
                    for (let dr = 0; dr < b.h && ok; dr++)
                        for (let dc = 0; dc < b.w && ok; dc++)
                            if (board[b.r + dr][b.c + dc] !== null) ok = false;
                    if (ok) { placeBlock(b); blocks.push(b); return true; }
                }
                return false;
            };

            if (!tryPlace(caocao, false, true)) continue;
            let allOk = true;
            for (const g of shuffledGenerals) {
                if (!tryPlace(g, false, false)) { allOk = false; break; }
            }
            if (!allOk) continue;

            const emptySlots = [];
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    if (board[r][c] === null) emptySlots.push({ r, c });
            for (let i = emptySlots.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [emptySlots[i], emptySlots[j]] = [emptySlots[j], emptySlots[i]];
            }

            const shuffledPawns = pawns.sort(() => Math.random() - 0.5);
            shuffledPawns.forEach((b, idx) => {
                if (idx < emptySlots.length) {
                    b.r = emptySlots[idx].r;
                    b.c = emptySlots[idx].c;
                    blocks.push(b);
                    placeBlock(b);
                }
            });
            break;
        }
        render();
    }

    // ===== 渲染 =====
    function getValidMoves(b) {
        const moves = [];
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            if (canMove(b, dr, dc)) moves.push({ r: b.r + dr, c: b.c + dc, w: b.w, h: b.h, dr, dc });
        }
        return moves;
    }

    function render() {
        boardEl.innerHTML = '';
        const cs = CELL;

        if (selected && controlMode === 'click') {
            getValidMoves(selected).forEach(m => {
                const hint = document.createElement('div');
                hint.className = 'move-hint';
                hint.style.left = (PAD + m.c * (cs + GAP)) + 'px';
                hint.style.top = (PAD + m.r * (cs + GAP)) + 'px';
                hint.style.width = (m.w * cs + (m.w - 1) * GAP) + 'px';
                hint.style.height = (m.h * cs + (m.h - 1) * GAP) + 'px';
                hint.addEventListener('click', e => { e.stopPropagation(); doMove(selected, m.dr, m.dc); selected = null; render(); });
                hint.addEventListener('mousedown', e => e.preventDefault());
                boardEl.appendChild(hint);
            });
        }

        blocks.forEach(b => {
            const el = document.createElement('div');
            el.className = 'block';
            el.dataset.id = b.id;

            if (b.id === 'caocao') el.classList.add('cao-cao');
            else if (b.w === 2 && b.h === 1) el.classList.add('horizontal');
            else if (b.w === 1 && b.h === 2) el.classList.add('vertical');
            else el.classList.add('pawn');

            if (selected === b) el.classList.add('selected');

            el.style.width = b.w * cs + (b.w - 1) * GAP + 'px';
            el.style.height = b.h * cs + (b.h - 1) * GAP + 'px';
            el.style.left = (PAD + b.c * (cs + GAP)) + 'px';
            el.style.top = (PAD + b.r * (cs + GAP)) + 'px';
            el.style.fontSize = b.id === 'caocao' ? Math.floor(cs * 0.25) + 'px' : (b.w === 1 && b.h === 1) ? Math.floor(cs * 0.18) + 'px' : Math.floor(cs * 0.2) + 'px';
            el.textContent = b.name;

            el.addEventListener('mousedown', e => onPointerDown(e, b));
            el.addEventListener('touchstart', e => onPointerDown(e, b), { passive: false });
            boardEl.appendChild(el);
        });
    }

    // ===== 输入处理 =====
    let dragBlock = null, dragStartX = 0, dragStartY = 0, dragMoved = false;

    function onPointerDown(e, b) {
        e.preventDefault();
        if (won || lost) return;

        if (selected && selected !== b) {
            const dx = b.c - selected.c;
            const dy = b.r - selected.r;
            if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (Math.abs(dx) + Math.abs(dy) === 1)) {
                doMove(selected, dy, dx);
                selected = null;
                render();
                return;
            }
        }

        if (controlMode === 'click') {
            selected = (selected === b) ? null : b;
            if (selected) SFX.select();
            render();
            return;
        }

        // 拖动模式
        selected = (selected === b) ? null : b;
        if (selected) SFX.select();
        render();

        const pt = e.touches ? e.touches[0] : e;
        dragBlock = b;
        dragStartX = pt.clientX;
        dragStartY = pt.clientY;
        dragMoved = false;

        const onMove = ev => {
            ev.preventDefault();
            const p = ev.touches ? ev.touches[0] : ev;
            const dx = p.clientX - dragStartX;
            const dy = p.clientY - dragStartY;
            const threshold = ('ontouchstart' in window) ? CELL * 0.2 : CELL * 0.3;

            if (!dragMoved) {
                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) dragMoved = true;
                else return;
            }

            let dr = 0, dc = 0;
            if (Math.abs(dx) > Math.abs(dy)) dc = dx > 0 ? 1 : -1;
            else dr = dy > 0 ? 1 : -1;

            if (dragBlock && canMove(dragBlock, dr, dc)) {
                doMove(dragBlock, dr, dc);
                selected = dragBlock;
            }

            dragStartX = p.clientX;
            dragStartY = p.clientY;
            dragMoved = false;
        };

        const onUp = () => {
            dragBlock = null;
            dragMoved = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
    }

    document.addEventListener('keydown', e => {
        if (!selected || won || lost) return;
        const map = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
        const d = map[e.key];
        if (d) { e.preventDefault(); doMove(selected, d[0], d[1]); }
    });

    // ===== 关卡选择 =====
    function buildLevelSelect() {
        [levelSel, startLevel].forEach(sel => {
            sel.innerHTML = '';
            LAYOUTS.forEach((l, i) => {
                const opt = document.createElement('option');
                opt.value = i; opt.textContent = l.name;
                sel.appendChild(opt);
            });
        });
    }

    // ===== 事件绑定 =====
    undoBtn.addEventListener('click', undo);
    restartBtn.addEventListener('click', newGame);
    levelSel.addEventListener('change', () => { gameTitle.textContent = LAYOUTS[levelSel.value].name; newGame(); });
    retryBtn.addEventListener('click', newGame);
    document.getElementById('closeVideoBtn').addEventListener('click', () => {
        document.getElementById('videoOverlay').style.display = 'none';
        document.getElementById('videoFrame').src = '';
    });

    // ===== 复制链接按钮 =====
    document.getElementById('copyUrlBtn').addEventListener('click', () => {
        const url = 'hrd.xn--yrv04v.com';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
        } else {
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
        const btn = document.getElementById('copyUrlBtn');
        btn.textContent = '已复制';
        setTimeout(() => { btn.textContent = '复制链接 hrd.xn--yrv04v.com'; }, 2000);
    });

    startBtn.addEventListener('click', () => {
        levelSel.value = startLevel.value;
        gameTitle.textContent = LAYOUTS[levelSel.value].name;
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        playBGM();
        updateDimensions();
        newGame();
    });

    startLevel.addEventListener('change', () => { levelSel.value = startLevel.value; });

    const gameSettingsBtn = document.getElementById('gameSettingsBtn');
    const backBtn = document.getElementById('backBtn');

    gameSettingsBtn.addEventListener('click', () => {
        settingsOverlay.style.display = 'flex';
    });

    backBtn.addEventListener('click', () => {
        stopTimer();
        bgm.pause();
        bgm.currentTime = 0;
        gameContainer.style.display = 'none';
        startScreen.style.display = 'flex';
    });

    // ===== 设置 =====
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const difficultySel = document.getElementById('difficulty');
    const timeLimitSel = document.getElementById('timeLimit');
    const timeLimitRow = document.getElementById('timeLimitRow');
    const soundToggleSel = document.getElementById('soundToggle');
    const bgmToggleSel = document.getElementById('bgmToggle');
    const controlModeSel = document.getElementById('controlMode');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');

    function updateDifficultyUI() {
        timeLimitRow.style.display = difficultySel.value === 'normal' ? 'none' : 'flex';
    }

    function initDifficultyOptions() {
        difficultySel.innerHTML = '<option value="normal">普通</option>';
        if (unlockedMedium) difficultySel.innerHTML += '<option value="medium">中等</option>';
        if (unlockedHard) difficultySel.innerHTML += '<option value="hard">变态</option>';
        difficultySel.value = difficulty;
    }

    initDifficultyOptions();
    timeLimitSel.value = timeLimit;
    soundToggleSel.value = soundOn ? 'on' : 'off';
    bgmToggleSel.value = bgmOn ? 'on' : 'off';
    controlModeSel.value = controlMode;
    updateDifficultyUI();

    settingsBtn.addEventListener('click', () => {
        initDifficultyOptions();
        difficultySel.value = difficulty;
        timeLimitSel.value = timeLimit;
        soundToggleSel.value = soundOn ? 'on' : 'off';
        bgmToggleSel.value = bgmOn ? 'on' : 'off';
        controlModeSel.value = controlMode;
        updateDifficultyUI();
        settingsOverlay.style.display = 'flex';
    });

    difficultySel.addEventListener('change', updateDifficultyUI);

    closeSettingsBtn.addEventListener('click', () => { settingsOverlay.style.display = 'none'; });

    saveSettingsBtn.addEventListener('click', () => {
        difficulty = difficultySel.value;
        timeLimit = parseInt(timeLimitSel.value);
        soundOn = soundToggleSel.value === 'on';
        bgmOn = bgmToggleSel.value === 'on';
        controlMode = controlModeSel.value;
        const pwd = document.getElementById('passwordInput').value.trim();
        oneStepWin = (pwd === '泽少最帅');
        if (oneStepWin) {
            difficulty = 'normal';
            difficultySel.value = 'normal';
            timeLimit = 9999;
            timeLimitSel.value = '0';
        }
        localStorage.setItem('hrd_difficulty', difficulty);
        localStorage.setItem('hrd_timeLimit', timeLimit);
        localStorage.setItem('hrd_sound', soundOn ? 'on' : 'off');
        localStorage.setItem('hrd_bgm', bgmOn ? 'on' : 'off');
        localStorage.setItem('hrd_control', controlMode);
        if (bgmOn) playBGM(); else bgm.pause();
        settingsOverlay.style.display = 'none';
    });

    settingsOverlay.addEventListener('click', e => { if (e.target === settingsOverlay) settingsOverlay.style.display = 'none'; });

    // ===== 说明 =====
    const helpBtn = document.getElementById('helpBtn');
    const helpOverlay = document.getElementById('helpOverlay');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    helpBtn.addEventListener('click', () => { helpOverlay.style.display = 'flex'; });
    closeHelpBtn.addEventListener('click', () => { helpOverlay.style.display = 'none'; });
    helpOverlay.addEventListener('click', e => { if (e.target === helpOverlay) helpOverlay.style.display = 'none'; });

    // ===== 排行榜 =====
    const rankBtn = document.getElementById('rankBtn');
    const rankOverlay = document.getElementById('rankOverlay');
    const rankList = document.getElementById('rankList');
    const rankTabsContainer = document.getElementById('rankTabs');
    const closeRankBtn = document.getElementById('closeRankBtn');
    const submitOverlay = document.getElementById('submitOverlay');
    const playerNameInput = document.getElementById('playerName');
    const submitInfo = document.getElementById('submitInfo');
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    const cancelSubmitBtn = document.getElementById('cancelSubmitBtn');

    let pendingSubmit = null;

    function buildRankTabs() {
        rankTabsContainer.innerHTML = '<button class="rank-tab active" data-level="all">全部</button>';
        LAYOUTS.forEach((layout, i) => {
            const tab = document.createElement('button');
            tab.className = 'rank-tab'; tab.dataset.level = i; tab.textContent = layout.name;
            rankTabsContainer.appendChild(tab);
        });
        rankTabsContainer.querySelectorAll('.rank-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                rankTabsContainer.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadRanks(tab.dataset.level);
            });
        });
    }

    async function loadRanks(filterLevel) {
        const data = await api('/api/rank');
        if (!data) { rankList.innerHTML = '<div class="rank-empty">无法连接服务器</div>'; return; }
        let ranks = data.ranks;
        if (filterLevel !== 'all') ranks = ranks.filter(r => r.level == filterLevel);
        if (ranks.length === 0) { rankList.innerHTML = '<div class="rank-empty">暂无记录</div>'; return; }
        rankList.innerHTML = ranks.map((r, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
            return `<div class="rank-item"><span class="rank-num">${medal}</span><span class="rank-name">${r.name}</span><span class="rank-moves">${r.moves}步</span><span class="rank-time">${r.elapsed}s</span></div>`;
        }).join('');
    }

    rankBtn.addEventListener('click', () => { loadRanks('all'); rankOverlay.style.display = 'flex'; });
    closeRankBtn.addEventListener('click', () => { rankOverlay.style.display = 'none'; });
    rankOverlay.addEventListener('click', e => { if (e.target === rankOverlay) rankOverlay.style.display = 'none'; });

    winOverlay.addEventListener('click', e => { if (e.target === winOverlay) winOverlay.style.display = 'none'; });

    playAgainBtn.addEventListener('click', () => {
        winOverlay.style.display = 'none';
        const elapsed = timeLimit === 0 ? seconds : timeLimit - seconds;
        pendingSubmit = { level: currentLevel, moves: moveCount, elapsed };
        const savedName = localStorage.getItem('hrd_name') || '';
        playerNameInput.value = savedName;
        submitInfo.textContent = `${LAYOUTS[currentLevel].name} - ${moveCount}步 ${elapsed}秒`;
        submitOverlay.style.display = 'flex';
    });

    confirmSubmitBtn.addEventListener('click', async () => {
        const name = playerNameInput.value.trim();
        if (!name) { alert('请输入昵称'); return; }
        localStorage.setItem('hrd_name', name);
        pendingSubmit.name = name;
        await api('/api/rank', 'POST', pendingSubmit);
        pendingSubmit = null;
        submitOverlay.style.display = 'none';
        loadRanks('all');
        rankOverlay.style.display = 'flex';
        newGame();
    });

    cancelSubmitBtn.addEventListener('click', () => { pendingSubmit = null; submitOverlay.style.display = 'none'; newGame(); });
    submitOverlay.addEventListener('click', e => { if (e.target === submitOverlay) { pendingSubmit = null; submitOverlay.style.display = 'none'; newGame(); } });

    // ===== 初始化 =====
    (async () => {
        LAYOUTS = await loadFromMD();
        buildLevelSelect();
        buildRankTabs();

        if (!localStorage.getItem('hrd_visited')) {
            localStorage.setItem('hrd_visited', '1');
            settingsOverlay.style.display = 'flex';
        }

        trackOnline(true);
        updateOnlineCount();
        setInterval(updateOnlineCount, 30000);
        window.addEventListener('beforeunload', () => trackOnline(false));
    })();
})();
