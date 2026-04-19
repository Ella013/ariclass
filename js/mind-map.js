document.addEventListener('DOMContentLoaded', function () {
    const printBtn      = document.getElementById('print-btn');
    const printBtnTop   = document.getElementById('print-btn-top');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const titleInput     = document.getElementById('worksheet-title');
    const showTitleCheck = document.getElementById('show-title');

    function getBranches() {
        return parseInt(document.querySelector('input[name="branches"]:checked').value, 10);
    }

    function buildHeader(titleText, titleVisible) {
        return `
        <div class="student-header">
            <div class="header-left">
                <div class="puzzle-header">
                    <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
                </div>
            </div>
            <div class="info-group">
                <div class="info-line">
                    <label>Name:</label>
                    <div class="input-field"></div>
                </div>
                <div class="info-line">
                    <label>Date:</label>
                    <div class="input-field"></div>
                </div>
            </div>
        </div>
        <div class="puzzle-title" style="visibility:${titleVisible ? 'visible' : 'hidden'}">${titleText}</div>`;
    }

    function getShape() {
        const r = document.querySelector('input[name="centershape"]:checked');
        return r ? r.value : 'bulb';
    }

    function getSize() {
        const r = document.querySelector('input[name="centersize"]:checked');
        return r ? r.value : 'medium';
    }

    function getColor() {
        const r = document.querySelector('input[name="centercolor"]:checked');
        return { gray: '#bbb', blue: '#6aaee0', green: '#72c49a', red: '#e05a5a', black: '#333' }[r ? r.value : 'gray'];
    }

    function buildMindMapSVG() {
        const shape   = getShape();
        const sizeKey = getSize();
        const s       = { small: 0.55, medium: 0.78, large: 1.0 }[sizeKey];
        const sw  = { small: 1.2 / s, medium: 1.6 / s, large: 1.6 / s }[sizeKey];
        const sw2 = { small: 1.0 / s, medium: 1.3 / s, large: 1.3 / s }[sizeKey];
        const col = getColor();
        // Center placed at (90, 88) — slightly above the SVG midpoint to sit higher on the page
        const cx = 90, cy = 88;

        let shapeHTML;
        if (shape === 'circle') {
            shapeHTML = `<circle cx="0" cy="0" r="42" fill="none" stroke="${col}" stroke-width="${sw}"/>`;
        } else if (shape === 'rect') {
            shapeHTML = `<rect x="-54" y="-30" width="108" height="60" rx="16" fill="none" stroke="${col}" stroke-width="${sw}"/>`;
        } else if (shape === 'oval') {
            shapeHTML = `<ellipse cx="0" cy="0" rx="60" ry="28" fill="none" stroke="${col}" stroke-width="${sw}"/>`;
        } else if (shape === 'line') {
            shapeHTML = `<line x1="-55" y1="0" x2="55" y2="0" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
        } else if (shape === 'none') {
            shapeHTML = '';
        } else {
            // Lightbulb: original paths centered around (90,115) → shifted to (0,0)
            shapeHTML = `
            <g transform="translate(-90,-115)">
                <path d="M90,68 C108,68 122,82 122,98 C122,111 114,121 107,129 C105,132 103,136 103,140 L77,140 C77,136 75,132 73,129 C66,121 58,111 58,98 C58,82 72,68 90,68 Z"
                      fill="none" stroke="${col}" stroke-width="${sw}" stroke-linejoin="round"/>
                <line x1="77" y1="140" x2="103" y2="140" stroke="${col}" stroke-width="${sw2}"/>
                <line x1="77" y1="147" x2="103" y2="147" stroke="${col}" stroke-width="${sw2}"/>
                <line x1="80" y1="154" x2="100" y2="154" stroke="${col}" stroke-width="${sw2}"/>
                <path d="M82,154 Q90,162 98,154" fill="none" stroke="${col}" stroke-width="${sw2}" stroke-linecap="round"/>
            </g>`;
        }

        return `
        <svg class="mm-svg" viewBox="0 0 180 210" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(${cx},${cy}) scale(${s})">
                ${shapeHTML}
            </g>
        </svg>`;
    }

    function updatePreview() {
        const year = new Date().getFullYear();
        const titleText    = titleInput.value.trim() || 'Mind Map';
        const titleVisible = showTitleCheck.checked;

        const html =
            buildHeader(titleText, titleVisible) +
            buildMindMapSVG() +
            `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
    }

    titleInput.addEventListener('input', updatePreview);
    showTitleCheck.addEventListener('change', updatePreview);
    document.querySelectorAll('input[name="centershape"]').forEach(r => r.addEventListener('change', updatePreview));
    document.querySelectorAll('input[name="centersize"]').forEach(r => r.addEventListener('change', updatePreview));
    document.querySelectorAll('input[name="centercolor"]').forEach(r => r.addEventListener('change', updatePreview));
    if (printBtn)    printBtn.addEventListener('click', () => window.print());
    if (printBtnTop) printBtnTop.addEventListener('click', () => window.print());

    updatePreview();
});
