document.addEventListener('DOMContentLoaded', function () {
    const generateBtn  = document.getElementById('generate-btn');
    const printBtn     = document.getElementById('print-btn');
    const answerBtn    = document.getElementById('answer-btn');
    const preview      = document.getElementById('puzzle-preview');
    const titleInput   = document.getElementById('worksheet-title');
    const showTitleChk = document.getElementById('show-title');

    let currentBlanks   = null;
    let currentPerRow   = 8;
    let showingAnswers  = false;

    // ── Helpers ───────────────────────────────────────────────────
    function getCountBy()    { return parseInt(document.querySelector('input[name="count-by"]:checked').value) || 1; }
    function getStartNum()   { return parseInt(document.getElementById('start-num').value) || 0; }
    function getDifficulty() { return document.querySelector('input[name="difficulty"]:checked').value; }
    function getSize()       { return document.querySelector('input[name="seq-size"]:checked').value; }
    function getItemsPerRow() { return { small: 8, medium: 6, large: 4 }[getSize()] || 8; }
    function getRows()        { return { small: 8, medium: 6, large: 5 }[getSize()] || 8; }
    function getNumPages()    { return parseInt(document.getElementById('pageCount').textContent) || 1; }

    function escXml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // ── Blank generation ──────────────────────────────────────────
    function generateBlanks(totalItems, difficulty, perRow) {
        const prob = { easy: 0.30, medium: 0.55, hard: 0.75 }[difficulty] || 0.55;
        return Array.from({ length: totalItems }, (_, i) => {
            return (i % perRow === 0) ? false : Math.random() < prob;
        });
    }

    // ── Render ────────────────────────────────────────────────────
    function buildPage(blanks, perRow, rows, startIdx, size, title, year, showTitle) {
        const countBy  = getCountBy();
        const startNum = getStartNum();
        let html = '<div class="ns-page">';
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';
        html += `<div class="puzzle-title" style="${showTitle ? '' : 'visibility:hidden;'}">${escXml(title)}</div>`;
        html += `<div class="seq-worksheet size-${size}">`;
        for (let row = 0; row < rows; row++) {
            html += '<div class="seq-row">';
            for (let col = 0; col < perRow; col++) {
                const idx     = startIdx + row * perRow + col;
                const num     = startNum + idx * countBy;
                const isBlank = blanks[idx];
                if (col > 0) html += '<span class="seq-arrow">&#8594;</span>';
                if (isBlank) {
                    const showCls = showingAnswers ? ' show-answer' : '';
                    html += `<div class="seq-box seq-blank${showCls}"><span class="seq-answer">${num}</span></div>`;
                } else {
                    html += `<div class="seq-box seq-given">${num}</div>`;
                }
            }
            html += '</div>';
        }
        html += '</div>';
        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        html += '</div>';
        return html;
    }

    function render(blanks, perRow) {
        const size      = getSize();
        const rows      = getRows();
        const title     = titleInput.value.trim() || 'Number Sequence';
        const year      = new Date().getFullYear();
        const showTitle = showTitleChk.checked;
        preview.innerHTML = buildPage(blanks, perRow, rows, 0, size, title, year, showTitle);
    }

    // ── Generate ──────────────────────────────────────────────────
    function generate() {
        const perRow   = getItemsPerRow();
        const rows     = getRows();
        const pages    = getNumPages();
        currentPerRow  = perRow;
        // Generate blanks for max pages upfront so page count changes don't reshuffle
        currentBlanks  = generateBlanks(rows * perRow * 10, getDifficulty(), perRow);
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        answerBtn.classList.remove('active');
        render(currentBlanks, currentPerRow);
    }

    // ── Event listeners ───────────────────────────────────────────
    generateBtn.addEventListener('click', generate);
    printBtn.addEventListener('click', function() {
        if (!currentBlanks) { window.print(); return; }
        const originalHTML = preview.innerHTML;
        const size      = getSize();
        const rows      = getRows();
        const perRow    = currentPerRow;
        const pages     = getNumPages();
        const title     = titleInput.value.trim() || 'Number Sequence';
        const year      = new Date().getFullYear();
        const showTitle = showTitleChk.checked;
        const perPage   = rows * perRow;
        for (let p = 1; p < pages; p++) {
            preview.innerHTML += buildPage(currentBlanks, perRow, rows, p * perPage, size, title, year, showTitle);
        }
        window.print();
        preview.innerHTML = originalHTML;
    });

    answerBtn.addEventListener('click', function () {
        if (!currentBlanks) return;
        showingAnswers = !showingAnswers;
        this.innerHTML = showingAnswers
            ? '<i class="fas fa-eye-slash"></i> Hide Answers'
            : '<i class="fas fa-eye"></i> Show Answers';
        this.classList.toggle('active', showingAnswers);
        render(currentBlanks, currentPerRow);
    });

    titleInput.addEventListener('input',    () => { if (currentBlanks) render(currentBlanks, currentPerRow); });
    showTitleChk.addEventListener('change', () => { if (currentBlanks) render(currentBlanks, currentPerRow); });

    document.getElementById('increasePage').addEventListener('click', function() {
        const cur = getNumPages();
        if (cur < 10) { document.getElementById('pageCount').textContent = cur + 1; if (currentBlanks) render(currentBlanks, currentPerRow); }
    });
    document.getElementById('decreasePage').addEventListener('click', function() {
        const cur = getNumPages();
        if (cur > 1) { document.getElementById('pageCount').textContent = cur - 1; if (currentBlanks) render(currentBlanks, currentPerRow); }
    });

    ['count-by', 'difficulty', 'seq-size'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
            r.addEventListener('change', generate);
        });
    });
    document.getElementById('start-num').addEventListener('change', generate);

    generate();
});
