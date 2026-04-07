document.addEventListener('DOMContentLoaded', function() {
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');

    const colorOptionGroup = document.getElementById('color-option-group');
    let currentTimes = [];

    function updateColorDisabled() {
        const mode = getOption('clock-mode', 'read');
        colorOptionGroup.classList.toggle('disabled-group', mode === 'draw');
        const hideLabel = document.getElementById('hide-time-label');
        hideLabel.disabled = mode !== 'draw';
        hideLabel.parentElement.style.opacity = mode === 'draw' ? '1' : '0.35';
        hideLabel.parentElement.style.pointerEvents = mode === 'draw' ? '' : 'none';
    }

    generateClocks();
    updateColorDisabled();

    generateBtn.addEventListener('click', generateClocks);
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', () => renderClocks());
    document.querySelectorAll('input[name="clock-mode"]').forEach(i =>
        i.addEventListener('change', () => { updateColorDisabled(); renderClocks(); }));
    document.querySelectorAll('input[name="clock-interval"]').forEach(i =>
        i.addEventListener('change', generateClocks));
    document.querySelectorAll('input[name="clock-count"]').forEach(i =>
        i.addEventListener('change', generateClocks));
    document.querySelectorAll('input[name="clock-color"]').forEach(i =>
        i.addEventListener('change', () => renderClocks()));
    document.getElementById('hide-time-label').addEventListener('change', () => renderClocks());

    function getOption(name, fallback) {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : fallback;
    }

    function generateTimes(interval) {
        const times = [];
        const step = interval === 'hour' ? 60 : interval === 'half' ? 30 : interval === 'quarter' ? 15 : 5;
        for (let h = 1; h <= 12; h++) {
            for (let m = 0; m < 60; m += step) {
                times.push({ h, m });
            }
        }
        // Fisher-Yates shuffle
        for (let i = times.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [times[i], times[j]] = [times[j], times[i]];
        }
        return times;
    }

    function drawClock(h, m, showHands, colorMode, thin = false) {
        const cx = 50, cy = 50;
        const hourColor  = colorMode === 'color' ? '#4CAF50' : '#222';
        const minColor   = colorMode === 'color' ? '#cc0000' : '#222';
        const tickW  = thin ? 1.0 : 1.8;
        const hourW  = thin ? 2.2 : 4;
        const minW   = thin ? 1.4 : 2.5;
        let svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="clock-svg">`;

        // Face
        svg += `<circle cx="${cx}" cy="${cy}" r="47" fill="white" stroke="#333" stroke-width="2.5"/>`;

        // Hour marks & numbers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const sin = Math.sin(angle), cos = Math.cos(angle);
            const x1 = cx + 40 * sin, y1 = cy - 40 * cos;
            const x2 = cx + 46 * sin, y2 = cy - 46 * cos;
            svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#333" stroke-width="${tickW}"/>`;
            const nr = thin ? 36 : 33;
            const nyOffset = thin ? 1 : 3;
            const nx = cx + nr * sin, ny = cy - nr * cos + nyOffset;
            svg += `<text x="${nx.toFixed(2)}" y="${ny.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="${thin ? 8 : 9}" font-family="Arial" font-weight="bold" fill="#333">${i}</text>`;
        }

        // Minute ticks
        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue;
            const angle = (i * 6) * Math.PI / 180;
            const sin = Math.sin(angle), cos = Math.cos(angle);
            const x1 = cx + 43 * sin, y1 = cy - 43 * cos;
            const x2 = cx + 46 * sin, y2 = cy - 46 * cos;
            svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#aaa" stroke-width="0.8"/>`;
        }

        if (showHands) {
            const hAngle = ((h % 12) + m / 60) * 30 * Math.PI / 180;
            const hLen = thin ? 22 : 18;
            const hx = cx + hLen * Math.sin(hAngle), hy = cy - hLen * Math.cos(hAngle);
            svg += `<line x1="${cx}" y1="${cy}" x2="${hx.toFixed(2)}" y2="${hy.toFixed(2)}" stroke="${hourColor}" stroke-width="${hourW}" stroke-linecap="round"/>`;

            const mLen = thin ? 30 : 25;
            const mAngle = m * 6 * Math.PI / 180;
            const mx = cx + mLen * Math.sin(mAngle), my = cy - mLen * Math.cos(mAngle);
            svg += `<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(2)}" y2="${my.toFixed(2)}" stroke="${minColor}" stroke-width="${minW}" stroke-linecap="round"/>`;
        }

        svg += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#333"/>`;
        svg += '</svg>';
        return svg;
    }

    function formatTime(h, m) {
        const mm = m.toString().padStart(2, '0');
        return `${h}:${mm}`;
    }

    function generateClocks() {
        const interval = getOption('clock-interval', 'quarter');
        const count = parseInt(getOption('clock-count', '12'));
        currentTimes = generateTimes(interval).slice(0, count);
        renderClocks();
    }

    function renderClocks() {
        const mode = getOption('clock-mode', 'read');
        const count = parseInt(getOption('clock-count', '12'));
        const showHands = mode === 'read';
        const colorMode = mode === 'draw' ? 'bw' : getOption('clock-color', 'bw');
        const hideTimeLabel = mode === 'draw' && document.getElementById('hide-time-label').checked;
        const times = currentTimes.length ? currentTimes : (() => {
            const interval = getOption('clock-interval', 'quarter');
            currentTimes = generateTimes(interval).slice(0, count);
            return currentTimes;
        })();
        const currentYear = new Date().getFullYear();
        const cols = 3;

        let html = '';
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        const title = worksheetTitle.value.trim() || 'Telling Time';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        const gridCols = count === 1 ? '1fr' : count === 6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
        html += `<div class="clock-grid cols-${cols} count-${count}" style="grid-template-columns:${gridCols}">`;
        times.forEach(({ h, m }, idx) => {
            html += '<div class="clock-cell">';
            if (count > 1) html += `<div class="clock-number">(${idx + 1})</div>`;
            html += drawClock(h, m, showHands, colorMode, count === 1);
            if (showHands) {
                html += '<div class="time-answer"><span class="time-blank"></span> : <span class="time-blank"></span></div>';
            } else {
                html += `<div class="time-label" style="${hideTimeLabel ? 'visibility:hidden' : ''}">${formatTime(h, m)}</div>`;
            }
            html += '</div>';
        });
        html += '</div>';

        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    function buildPageInner(mode, interval, count, startIndex = 1, times = null) {
        const showHands = mode === 'read';
        const colorMode = mode === 'draw' ? 'bw' : getOption('clock-color', 'bw');
        const hideTimeLabel = mode === 'draw' && document.getElementById('hide-time-label').checked;
        if (!times) times = generateTimes(interval).slice(0, count);
        const currentYear = new Date().getFullYear();
        const cols = 3;

        let html = '';
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        const title = worksheetTitle.value.trim() || 'Telling Time';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        const gridCols = count === 1 ? '1fr' : count === 6 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
        html += `<div class="clock-grid cols-${cols} count-${count}" style="grid-template-columns:${gridCols}">`;
        times.forEach(({ h, m }, idx) => {
            html += '<div class="clock-cell">';
            if (count > 1) html += `<div class="clock-number">(${startIndex + idx})</div>`;
            html += drawClock(h, m, showHands, colorMode, count === 1);
            if (showHands) {
                html += '<div class="time-answer"><span class="time-blank"></span> : <span class="time-blank"></span></div>';
            } else {
                html += `<div class="time-label" style="${hideTimeLabel ? 'visibility:hidden' : ''}">${formatTime(h, m)}</div>`;
            }
            html += '</div>';
        });
        html += '</div>';
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        return html;
    }

    function printWorksheet() {
        const mode = getOption('clock-mode', 'read');
        const interval = getOption('clock-interval', 'quarter');
        const count = parseInt(getOption('clock-count', '12'));
        const numPages = parseInt(document.getElementById('num-pages').value) || 1;
        const title = worksheetTitle.value.trim() || 'Telling Time';

        const printPages = document.createElement('div');
        printPages.id = 'print-pages';

        for (let i = 0; i < numPages; i++) {
            const page = document.createElement('div');
            page.className = 'print-page';
            const pageTimes = i === 0 ? currentTimes : generateTimes(interval).slice(0, count);
            page.innerHTML = buildPageInner(mode, interval, count, i * count + 1, pageTimes);
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);
        const orig = document.title;
        document.title = title;
        const cleanup = () => {
            printPages.remove();
            document.title = orig;
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }
});
