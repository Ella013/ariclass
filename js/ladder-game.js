var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

const CELL_W  = 100;
const CELL_H  = 36;
const PAD_TOP = 55;
const PAD_BOT = 55;
const PAD_SIDE = 50;
const RUNG_ROWS = 10;
const PATH_COLORS = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e'];

function xPos(col)  { return PAD_SIDE + col * CELL_W; }
function yPos(row)  { return PAD_TOP  + row * CELL_H; }

function escXml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function generateRungs(cols) {
    const rungs = [];
    for (let r = 1; r < RUNG_ROWS; r++) {
        let c = 0;
        while (c < cols - 1) {
            if (Math.random() < 0.45) {
                rungs.push({ row: r, col: c });
                c += 2;
            } else {
                c++;
            }
        }
    }
    return rungs;
}

function tracePath(startCol, rungs) {
    let col = startCol;
    const pts = [{ x: xPos(col), y: yPos(0) }];
    for (let r = 1; r < RUNG_ROWS; r++) {
        const yr = yPos(r);
        const right = rungs.find(rg => rg.row === r && rg.col === col);
        const left  = col > 0 ? rungs.find(rg => rg.row === r && rg.col === col - 1) : null;
        if (right) {
            pts.push({ x: xPos(col), y: yr });
            col++;
            pts.push({ x: xPos(col), y: yr });
        } else if (left) {
            pts.push({ x: xPos(col), y: yr });
            col--;
            pts.push({ x: xPos(col), y: yr });
        } else {
            pts.push({ x: xPos(col), y: yr });
        }
    }
    pts.push({ x: xPos(col), y: yPos(RUNG_ROWS) });
    return { pts, destCol: col };
}

function buildSVG(cols, topLabels, botLabels, rungs, paths, showAnswers) {
    const svgW = PAD_SIDE * 2 + (cols - 1) * CELL_W;
    const svgH = PAD_TOP + RUNG_ROWS * CELL_H + PAD_BOT;

    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" style="max-width:${svgW}px;display:block;margin:0 auto">`;

    // Highlighted paths (behind the ladder)
    if (showAnswers) {
        paths.forEach(({ pts }, i) => {
            const color = PATH_COLORS[i % PATH_COLORS.length];
            const d = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
            s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-opacity="0.5" stroke-linejoin="round" stroke-linecap="round"/>`;
        });
    }

    // Vertical lines
    for (let c = 0; c < cols; c++) {
        s += `<line x1="${xPos(c)}" y1="${yPos(0)}" x2="${xPos(c)}" y2="${yPos(RUNG_ROWS)}" stroke="#444" stroke-width="2.5"/>`;
    }

    // Horizontal rungs
    rungs.forEach(rg => {
        const ry = yPos(rg.row);
        s += `<line x1="${xPos(rg.col)}" y1="${ry}" x2="${xPos(rg.col + 1)}" y2="${ry}" stroke="#444" stroke-width="2.5"/>`;
    });

    // Top labels
    for (let c = 0; c < cols; c++) {
        const color = showAnswers ? PATH_COLORS[c % PATH_COLORS.length] : '#222';
        const label = escXml((topLabels[c] || `P${c + 1}`).substring(0, 12));
        s += `<text x="${xPos(c)}" y="${yPos(0) - 10}" text-anchor="middle" font-size="13" fill="${color}" font-weight="bold" font-family="sans-serif">${label}</text>`;
    }

    // Bottom labels — color matches the path that lands there
    for (let c = 0; c < cols; c++) {
        const pathIdx = paths.findIndex(p => p.destCol === c);
        const color = showAnswers && pathIdx >= 0 ? PATH_COLORS[pathIdx % PATH_COLORS.length] : '#222';
        const label = escXml((botLabels[c] || `R${c + 1}`).substring(0, 12));
        s += `<text x="${xPos(c)}" y="${yPos(RUNG_ROWS) + 22}" text-anchor="middle" font-size="13" fill="${color}" font-family="sans-serif">${label}</text>`;
    }

    s += '</svg>';
    return s;
}

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const printBtn    = document.getElementById('print-btn');
    const answerBtn   = document.getElementById('answer-btn');
    const preview     = document.getElementById('puzzle-preview');
    const titleInput  = document.getElementById('worksheet-title');
    const showTitle   = document.getElementById('show-title');

    let savedData = null;
    let showingAnswers = false;

    function getCols() {
        return parseInt(document.querySelector('input[name="num-players"]:checked').value);
    }

    function getTopLabels() {
        return Array.from({ length: getCols() }, (_, i) =>
            document.getElementById(`top-${i}`)?.value.trim() || ''
        );
    }

    function getBotLabels() {
        return Array.from({ length: getCols() }, (_, i) =>
            document.getElementById(`bot-${i}`)?.value.trim() || ''
        );
    }

    function updateLabelInputs() {
        const cols = getCols();
        const topCont = document.getElementById('top-labels');
        const botCont = document.getElementById('bot-labels');

        // preserve existing values
        const oldTop = Array.from({ length: 8 }, (_, i) => document.getElementById(`top-${i}`)?.value || '');
        const oldBot = Array.from({ length: 8 }, (_, i) => document.getElementById(`bot-${i}`)?.value || '');

        topCont.innerHTML = '';
        botCont.innerHTML = '';

        for (let i = 0; i < cols; i++) {
            const td = document.createElement('div');
            td.className = 'label-input-row';
            td.innerHTML = `<label>${i + 1}.</label><input type="text" id="top-${i}" placeholder="Player ${i + 1}" maxlength="12" value="${escXml(oldTop[i])}">`;
            topCont.appendChild(td);

            const bd = document.createElement('div');
            bd.className = 'label-input-row';
            bd.innerHTML = `<label>${i + 1}.</label><input type="text" id="bot-${i}" placeholder="Result ${i + 1}" maxlength="12" value="${escXml(oldBot[i])}">`;
            botCont.appendChild(bd);
        }

        // re-attach live input listeners
        topCont.addEventListener('input', function() { if (savedData) render(); });
        botCont.addEventListener('input', function() { if (savedData) render(); });
    }

    function generate() {
        const cols  = getCols();
        const rungs = generateRungs(cols);
        const paths = Array.from({ length: cols }, (_, i) => tracePath(i, rungs));
        savedData = { cols, rungs, paths };
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> ' + _showTxt;
        answerBtn.classList.remove('active');
        render();
    }

    function render() {
        if (!savedData) return;
        const { cols, rungs, paths } = savedData;
        const year = new Date().getFullYear();
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

        if (showTitle.checked) {
            html += `<div class="puzzle-title">${escXml(title)}</div>`;
        }

        html += '<div class="ladder-svg-wrap">';
        html += buildSVG(cols, getTopLabels(), getBotLabels(), rungs, paths, showingAnswers);
        html += '</div>';

        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        preview.innerHTML = html;
    }

    generateBtn.addEventListener('click', generate);
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

    document.querySelectorAll('input[name="num-players"]').forEach(r => {
        r.addEventListener('change', function() {
            updateLabelInputs();
            generate();
        });
    });

    titleInput.addEventListener('input', function() { if (savedData) render(); });
    showTitle.addEventListener('change', function() { if (savedData) render(); });

    updateLabelInputs();
    generate();
});
