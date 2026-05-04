var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

// ── SVG constants ──────────────────────────────────────────────
const SVG_W       = 740;
const LADDER_L    = 60;
const LADDER_R    = 680;
const PAD_TOP     = 65;
const PAD_BOT     = 65;
const RUNG_ROWS   = 12;
const CELL_H      = 58;
const DIAG_DY     = CELL_H * 0.45;
const PATH_COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];
const COLOR_NAMES = ['Red','Blue','Green','Yellow','Purple','Orange','Pink','Teal'];

function getDynR(cols) {
    const minColGap = 110;
    const ladderSpan = Math.max(LADDER_R - LADDER_L, (cols - 1) * minColGap);
    return LADDER_L + ladderSpan;
}
function xPos(col, cols, dynR) {
    const r = dynR !== undefined ? dynR : LADDER_R;
    return LADDER_L + (cols > 1 ? col * (r - LADDER_L) / (cols - 1) : 0);
}
function yPos(row) { return PAD_TOP + row * CELL_H; }

function escXml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Rung generation ────────────────────────────────────────────
// Even-numbered gaps use even rows (2,4,6,8,10).
// Odd-numbered gaps use odd rows (3,5,7,9).
// Adjacent gaps always have opposite parity → zero chance of conflict.
// Spacing between rungs within each gap is fixed at 2 rows (= 2×CELL_H),
// so the visual gap between lines is always uniform.
function generateRungs(cols, complexity) {
    const gaps     = cols - 1;
    const diagProb = { low: 0, medium: 0.30, high: 0.50 }[complexity] || 0;
    const density  = { low: 0.55, medium: 0.78, high: 0.97 }[complexity] || 0.78;

    const minRow = 2;
    const maxRow = RUNG_ROWS - 2;   // rows 2..10

    const rungs = [];

    function pickShape() {
        return Math.random() < diagProb
            ? (Math.random() < 0.5 ? 'd_down' : 'd_up')
            : 'h';
    }

    for (let g = 0; g < gaps; g++) {
        const startRow = minRow + (g % 2); // gap 0 → row 2, gap 1 → row 3, …
        for (let r = startRow; r <= maxRow; r += 2) {
            if (Math.random() < density) {
                rungs.push({ row: r, col: g, shape: pickShape() });
            }
        }
    }

    return rungs;
}

// ── Entry/exit coords for a rung crossing ─────────────────────
function getEntryExit(rg, goingRight, cols, dynR) {
    const yr = yPos(rg.row);
    const x1 = xPos(rg.col, cols, dynR);
    const x2 = xPos(rg.col + 1, cols, dynR);
    if (rg.shape === 'h') {
        return goingRight
            ? { ex: x1, ey: yr,           lx: x2, ly: yr }
            : { ex: x2, ey: yr,           lx: x1, ly: yr };
    } else if (rg.shape === 'd_down') {
        return goingRight
            ? { ex: x1, ey: yr - DIAG_DY, lx: x2, ly: yr + DIAG_DY }
            : { ex: x2, ey: yr + DIAG_DY, lx: x1, ly: yr - DIAG_DY };
    } else {
        return goingRight
            ? { ex: x1, ey: yr + DIAG_DY, lx: x2, ly: yr - DIAG_DY }
            : { ex: x2, ey: yr - DIAG_DY, lx: x1, ly: yr + DIAG_DY };
    }
}

// ── Path tracing ───────────────────────────────────────────────
function tracePath(startCol, rungs, cols, dynR) {
    let col = startCol;
    const pts = [{ x: xPos(col, cols, dynR), y: yPos(0) }];
    for (let r = 1; r < RUNG_ROWS; r++) {
        const right = rungs.find(rg => rg.row === r && rg.col === col);
        const left  = col > 0 ? rungs.find(rg => rg.row === r && rg.col === col - 1) : null;
        if (right) {
            const e = getEntryExit(right, true, cols, dynR);
            pts.push({ x: e.ex, y: e.ey });
            col++;
            pts.push({ x: e.lx, y: e.ly });
        } else if (left) {
            const e = getEntryExit(left, false, cols, dynR);
            pts.push({ x: e.ex, y: e.ey });
            col--;
            pts.push({ x: e.lx, y: e.ly });
        } else {
            pts.push({ x: xPos(col, cols, dynR), y: yPos(r) });
        }
    }
    pts.push({ x: xPos(col, cols, dynR), y: yPos(RUNG_ROWS) });
    return { pts, destCol: col };
}

// ── SVG builder ────────────────────────────────────────────────
function buildSVG(cols, topLabels, botLabels, rungs, paths, showAnswers, winnerSet, dynR) {
    const ladderSpan = dynR - LADDER_L;
    const colGap     = cols > 1 ? ladderSpan / (cols - 1) : ladderSpan;
    const svgW       = dynR + (SVG_W - LADDER_R);
    const labelFs    = Math.min(20, Math.max(10, Math.floor(colGap / 6)));
    const maxChars   = Math.min(12, Math.max(4, Math.floor(colGap / (labelFs * 0.65))));

    const svgH = PAD_TOP + RUNG_ROWS * CELL_H + PAD_BOT;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" style="display:block;">`;

    if (showAnswers) {
        paths.forEach(({ pts }, i) => {
            const color = PATH_COLORS[i % PATH_COLORS.length];
            const d = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
            s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-opacity="0.5" stroke-linejoin="round" stroke-linecap="round"/>`;
        });
    }

    for (let c = 0; c < cols; c++) {
        s += `<line x1="${xPos(c,cols,dynR).toFixed(1)}" y1="${yPos(0)}" x2="${xPos(c,cols,dynR).toFixed(1)}" y2="${yPos(RUNG_ROWS)}" stroke="#444" stroke-width="2.5"/>`;
    }

    rungs.forEach(rg => {
        const x1 = xPos(rg.col, cols, dynR), x2 = xPos(rg.col + 1, cols, dynR);
        const yr = yPos(rg.row);
        let y1, y2;
        if (rg.shape === 'h')           { y1 = yr;           y2 = yr; }
        else if (rg.shape === 'd_down') { y1 = yr - DIAG_DY; y2 = yr + DIAG_DY; }
        else                            { y1 = yr + DIAG_DY; y2 = yr - DIAG_DY; }
        s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#444" stroke-width="2.5"/>`;
    });

    for (let c = 0; c < cols; c++) {
        const color = showAnswers ? PATH_COLORS[c % PATH_COLORS.length] : '#222';
        const label = escXml((topLabels[c] || `Player ${c + 1}`).substring(0, maxChars));
        s += `<text x="${xPos(c,cols,dynR).toFixed(1)}" y="${yPos(0) - 10}" text-anchor="middle" font-size="${labelFs}" fill="${color}" font-weight="bold" font-family="sans-serif">${label}</text>`;
    }

    for (let c = 0; c < cols; c++) {
        const pathIdx = paths.findIndex(p => p.destCol === c);
        let color = '#222', label, fw = 'normal';

        if (winnerSet !== null) {
            const isWin = winnerSet.has(c);
            label = isWin ? '🏆 WIN' : 'LOSE';
            color = showAnswers && pathIdx >= 0
                ? PATH_COLORS[pathIdx % PATH_COLORS.length]
                : (isWin ? '#e67e22' : '#aaa');
            fw = isWin ? 'bold' : 'normal';
        } else {
            color = showAnswers && pathIdx >= 0 ? PATH_COLORS[pathIdx % PATH_COLORS.length] : '#222';
            label = escXml((botLabels[c] || `Result ${c + 1}`).substring(0, maxChars));
        }

        s += `<text x="${xPos(c,cols,dynR).toFixed(1)}" y="${yPos(RUNG_ROWS) + 22}" text-anchor="middle" font-size="${labelFs}" fill="${color}" font-weight="${fw}" font-family="sans-serif">${label}</text>`;
    }

    s += '</svg>';
    return s;
}

// ── DOM logic ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn   = document.getElementById('generate-btn');
    const randomGenBtn  = document.getElementById('random-generate-btn');
    const printBtn      = document.getElementById('print-btn');
    const answerBtn     = document.getElementById('answer-btn');
    const preview       = document.getElementById('puzzle-preview');
    const titleInput    = document.getElementById('worksheet-title');
    const showTitle     = document.getElementById('show-title');
    const rwCheck       = document.getElementById('random-winner');
    const winCounter    = document.getElementById('winner-counter');
    const pairCont      = document.getElementById('pair-container');

    let savedData = null;
    let showingAnswers = false;

    // ── Helpers ──
    function getCols()        { return parseInt(document.getElementById('playerCount').textContent) || 4; }
    function getWinnerCount() { return parseInt(document.getElementById('winnerCount').textContent) || 1; }

    function clampWinner() {
        const wc = document.getElementById('winnerCount');
        wc.textContent = Math.min(getCols() - 1, Math.max(1, parseInt(wc.textContent) || 1));
    }

    function updateWinnerCounterState() {
        const active = rwCheck.checked;
        winCounter.classList.toggle('counter-disabled', !active);
        winCounter.querySelectorAll('button').forEach(b => b.disabled = !active);
    }

    function updateBotDisabled() {
        const disabled = rwCheck.checked;
        pairCont.querySelectorAll('.ladder-bot-input').forEach(inp => inp.disabled = disabled);
        pairCont.classList.toggle('bot-disabled', disabled);
        document.getElementById('result-col-label').style.opacity = disabled ? '0.4' : '1';
    }

    // ── Player counter ──
    document.getElementById('increasePlayer').addEventListener('click', function() {
        const cur = getCols();
        if (cur < 8) {
            document.getElementById('playerCount').textContent = cur + 1;
            clampWinner();
            rebuildPairs();
            generate();
        }
    });
    document.getElementById('decreasePlayer').addEventListener('click', function() {
        const cur = getCols();
        if (cur > 2) {
            document.getElementById('playerCount').textContent = cur - 1;
            clampWinner();
            rebuildPairs();
            generate();
        }
    });

    // ── Winner counter ──
    document.getElementById('increaseWinner').addEventListener('click', function() {
        if (!rwCheck.checked) return;
        const cur = getWinnerCount();
        if (cur < getCols() - 1) {
            document.getElementById('winnerCount').textContent = cur + 1;
            if (savedData) generate();
        }
    });
    document.getElementById('decreaseWinner').addEventListener('click', function() {
        if (!rwCheck.checked) return;
        const cur = getWinnerCount();
        if (cur > 1) {
            document.getElementById('winnerCount').textContent = cur - 1;
            if (savedData) generate();
        }
    });

    // ── Random winner toggle ──
    rwCheck.addEventListener('change', function() {
        updateWinnerCounterState();
        updateBotDisabled();
        if (savedData) generate();
    });

    // ── Pair form ──
    function rebuildPairs() {
        const cols = getCols();
        const oldTop = Array.from({ length: 8 }, (_, i) => document.getElementById(`top-${i}`)?.value || '');
        const oldBot = Array.from({ length: 8 }, (_, i) => document.getElementById(`bot-${i}`)?.value || '');

        pairCont.innerHTML = '';
        for (let i = 0; i < cols; i++) {
            const row = document.createElement('div');
            row.className = 'ladder-pair';
            row.innerHTML = `
                <span class="ladder-pair-num">${i + 1}.</span>
                <div class="input-limit-wrap">
                    <input type="text" id="top-${i}" class="word-input-field" placeholder="Player ${i + 1}" maxlength="12" value="${escXml(oldTop[i])}">
                </div>
                <div class="input-limit-wrap">
                    <input type="text" id="bot-${i}" class="word-input-field ladder-bot-input" placeholder="Result ${i + 1}" maxlength="12" value="${escXml(oldBot[i])}">
                </div>
            `;
            pairCont.appendChild(row);

            ['top', 'bot'].forEach(prefix => {
                const inp = document.getElementById(`${prefix}-${i}`);
                const check = () => inp.classList.toggle('at-limit', inp.value.length >= 12);
                inp.addEventListener('input', check);
                inp.addEventListener('blur', () => { inp.scrollLeft = 0; });
                check();
            });
        }
        pairCont.addEventListener('input', function() { if (savedData) render(); });
        updateBotDisabled();
    }

    function getTopLabels() {
        return Array.from({ length: getCols() }, (_, i) => document.getElementById(`top-${i}`)?.value.trim() || '');
    }
    function getBotLabels() {
        return Array.from({ length: getCols() }, (_, i) => document.getElementById(`bot-${i}`)?.value.trim() || '');
    }

    // ── Generate ──
    function generate() {
        const cols       = getCols();
        const complexity = document.querySelector('input[name="complexity"]:checked').value;
        const rungs      = generateRungs(cols, complexity);
        const dynR       = getDynR(cols);
        const paths      = Array.from({ length: cols }, (_, i) => tracePath(i, rungs, cols, dynR));

        let winnerSet = null;
        if (rwCheck.checked) {
            const wc = getWinnerCount();
            winnerSet = new Set(shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, wc));
        }

        savedData = { cols, rungs, paths, winnerSet, dynR };
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> ' + _showTxt;
        answerBtn.classList.remove('active');
        render();
    }

    // ── Random Generate ──
    function randomGenerate() {
        const cols = getCols();
        for (let i = 0; i < cols; i++) {
            const t = document.getElementById(`top-${i}`);
            if (t) t.value = COLOR_NAMES[i] || `Player ${i + 1}`;
            const b = document.getElementById(`bot-${i}`);
            if (b) b.value = '';
        }
        rwCheck.checked = true;
        document.getElementById('winnerCount').textContent = '1';
        updateWinnerCounterState();
        updateBotDisabled();
        generate();
    }

    function render() {
        if (!savedData) return;
        const { cols, rungs, paths, winnerSet, dynR } = savedData;
        const year  = new Date().getFullYear();
        const title = titleInput.value.trim() || 'Ladder Game';

        let html = '';
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        // Always reserve title space (visibility:hidden when unchecked)
        html += `<div class="puzzle-title" style="${showTitle.checked ? '' : 'visibility:hidden;'}">${escXml(title)}</div>`;

        html += '<div class="ladder-svg-wrap">';
        html += buildSVG(cols, getTopLabels(), getBotLabels(), rungs, paths, showingAnswers, winnerSet, dynR);
        html += '</div>';
        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        preview.innerHTML = html;
    }

    // ── Reset pairs ──
    document.getElementById('reset-pairs-btn').addEventListener('click', function() {
        const cols = getCols();
        for (let i = 0; i < cols; i++) {
            ['top', 'bot'].forEach(prefix => {
                const inp = document.getElementById(`${prefix}-${i}`);
                if (inp) { inp.value = ''; inp.classList.remove('at-limit'); inp.scrollLeft = 0; }
            });
        }
        if (savedData) render();
    });

    // ── Event listeners ──
    generateBtn.addEventListener('click', generate);
    randomGenBtn.addEventListener('click', randomGenerate);
    printBtn.addEventListener('click', () => window.print());

    answerBtn.addEventListener('click', function() {
        if (!savedData) return;
        showingAnswers = !showingAnswers;
        this.innerHTML = showingAnswers
            ? '<i class="fas fa-eye-slash"></i> ' + _hideTxt
            : '<i class="fas fa-eye"></i> ' + _showTxt;
        this.classList.toggle('active', showingAnswers);
        render();
    });

    document.querySelectorAll('input[name="complexity"]').forEach(r => {
        r.addEventListener('change', function() { if (savedData) generate(); });
    });
    titleInput.addEventListener('input',  function() { if (savedData) render(); });
    showTitle.addEventListener('change',  function() { if (savedData) render(); });

    // ── Init ──
    updateWinnerCounterState();
    rebuildPairs();
    generate();
});
