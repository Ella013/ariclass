document.addEventListener('DOMContentLoaded', function() {
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');

    generateClocks();

    generateBtn.addEventListener('click', generateClocks);
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', generateClocks);
    document.querySelectorAll('input[name="clock-mode"]').forEach(i =>
        i.addEventListener('change', generateClocks));
    document.querySelectorAll('input[name="clock-interval"]').forEach(i =>
        i.addEventListener('change', generateClocks));
    document.querySelectorAll('input[name="clock-count"]').forEach(i =>
        i.addEventListener('change', generateClocks));

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

    function drawClock(h, m, showHands) {
        const cx = 50, cy = 50;
        let svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="clock-svg">`;

        // Face
        svg += `<circle cx="${cx}" cy="${cy}" r="47" fill="white" stroke="#333" stroke-width="2.5"/>`;

        // Hour marks & numbers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const sin = Math.sin(angle), cos = Math.cos(angle);
            // Tick
            const x1 = cx + 40 * sin, y1 = cy - 40 * cos;
            const x2 = cx + 46 * sin, y2 = cy - 46 * cos;
            svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#333" stroke-width="1.8"/>`;
            // Number
            const nx = cx + 33 * sin, ny = cy - 33 * cos + 3;
            svg += `<text x="${nx.toFixed(2)}" y="${ny.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" font-size="9" font-family="Arial" font-weight="bold" fill="#333">${i}</text>`;
        }

        // Minute ticks (5-min intervals already covered by hour marks; add small ticks between)
        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue;
            const angle = (i * 6) * Math.PI / 180;
            const sin = Math.sin(angle), cos = Math.cos(angle);
            const x1 = cx + 43 * sin, y1 = cy - 43 * cos;
            const x2 = cx + 46 * sin, y2 = cy - 46 * cos;
            svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#aaa" stroke-width="0.8"/>`;
        }

        if (showHands) {
            // Hour hand (shorter so it doesn't cover numbers)
            const hAngle = ((h % 12) + m / 60) * 30 * Math.PI / 180;
            const hx = cx + 18 * Math.sin(hAngle), hy = cy - 18 * Math.cos(hAngle);
            svg += `<line x1="${cx}" y1="${cy}" x2="${hx.toFixed(2)}" y2="${hy.toFixed(2)}" stroke="#222" stroke-width="4" stroke-linecap="round"/>`;

            // Minute hand (slightly shorter to not cover numbers)
            const mAngle = m * 6 * Math.PI / 180;
            const mx = cx + 28 * Math.sin(mAngle), my = cy - 28 * Math.cos(mAngle);
            svg += `<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(2)}" y2="${my.toFixed(2)}" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>`;
        }

        // Center dot
        svg += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="#333"/>`;
        svg += '</svg>';
        return svg;
    }

    function formatTime(h, m) {
        const mm = m.toString().padStart(2, '0');
        return `${h}:${mm}`;
    }

    function generateClocks() {
        const mode = getOption('clock-mode', 'read');
        const interval = getOption('clock-interval', 'quarter');
        const count = parseInt(getOption('clock-count', '12'));
        const showHands = mode === 'read';

        const times = generateTimes(interval).slice(0, count);
        const currentYear = new Date().getFullYear();

        // Determine grid columns: always 3 columns
        const cols = 3;

        let html = '';

        // Header
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Telling Time';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        html += `<div class="clock-grid cols-${cols}">`;
        times.forEach(({ h, m }, idx) => {
            html += '<div class="clock-cell">';
            html += `<div class="clock-number">(${idx + 1})</div>`;
            html += drawClock(h, m, showHands);
            if (showHands) {
                html += '<div class="time-answer"><span class="time-blank"></span> : <span class="time-blank"></span></div>';
            } else {
                html += `<div class="time-label">${formatTime(h, m)}</div>`;
            }
            html += '</div>';
        });
        html += '</div>';

        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    function printWorksheet() {
        const title = worksheetTitle.value.trim() || 'Telling Time';
        const orig = document.title;
        document.title = title;
        window.print();
        document.title = orig;
    }
});
