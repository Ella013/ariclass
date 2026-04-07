// Multiplication & Division Worksheet Generator

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const printBtn = document.getElementById('print-btn');
    const answerBtn = document.getElementById('answer-btn');
    const worksheetPreview = document.getElementById('puzzle-preview');
    const worksheetTitle = document.getElementById('worksheet-title');
    const numPagesInput = document.getElementById('num-pages');
    const showTitleCheckbox = document.getElementById('show-title');
    const operationInputs = document.querySelectorAll('input[name="operation"]');
    const levelInputs = document.querySelectorAll('input[name="level"]');

    let currentProblems = [];
    let answerMode = false;
    let titleIsAuto = true;
    const PROBLEMS_PER_PAGE = 15;

    function getOperationTitle(operation) {
        switch (operation) {
            case 'multiplication': return 'Multiplication';
            case 'division':       return 'Division';
            case 'mixed':
            default:               return 'Multiplication & Division';
        }
    }

    function syncTitleWithOperation() {
        if (!titleIsAuto) return;
        const operation = document.querySelector('input[name="operation"]:checked')?.value || 'multiplication';
        worksheetTitle.value = getOperationTitle(operation);
    }

    worksheetTitle.addEventListener('input', () => {
        const v = worksheetTitle.value.trim();
        const op = document.querySelector('input[name="operation"]:checked')?.value || 'multiplication';
        titleIsAuto = v === '' || v === getOperationTitle(op);
    });

    operationInputs.forEach(input => {
        input.addEventListener('change', () => { syncTitleWithOperation(); generateWorksheet(); });
    });
    levelInputs.forEach(input => {
        input.addEventListener('change', generateWorksheet);
    });

    // ── Problem generation ──────────────────────────────────────

    function generateProblem(level, operation) {
        if (operation === 'mixed') {
            return generateProblem(level, Math.random() < 0.5 ? 'multiplication' : 'division');
        }

        if (operation === 'multiplication') {
            let num1, num2;
            switch (level) {
                case 1: // 1-digit × 1-digit
                    num1 = Math.floor(Math.random() * 9) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
                    break;
                case 2: // 2-digit × 1-digit
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 9) + 2;
                    break;
                case 3: // 2-digit × 2-digit
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 90) + 10;
                    break;
                default:
                    num1 = Math.floor(Math.random() * 9) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
            }
            return { num1, num2, result: num1 * num2, operator: '×' };
        }

        // Division: always whole-number answer, no remainder
        // Strategy: pick quotient and divisor, compute dividend
        let quotient, divisor, dividend;
        switch (level) {
            case 1: // dividend up to 81, divisor 2-9
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 9) + 1;
                dividend = divisor * quotient;
                break;
            case 2: // 2-digit quotient, 1-digit divisor
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 90) + 10;
                dividend = divisor * quotient;
                break;
            case 3: // 2-digit quotient, 2-digit divisor
                divisor  = Math.floor(Math.random() * 11) + 2; // 2-12
                quotient = Math.floor(Math.random() * 90) + 10;
                dividend = divisor * quotient;
                break;
            default:
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 9) + 1;
                dividend = divisor * quotient;
        }
        // num1 = dividend (top), num2 = divisor (bottom), result = quotient
        return { num1: dividend, num2: divisor, result: quotient, operator: '÷' };
    }

    // ── Rendering ───────────────────────────────────────────────

    function numberToDigits(num) {
        return num.toString().split('').map(Number);
    }

    function getMaxLength(level) {
        // Level 1: max result 81 → 2 digits. But for division num1 can be 81 too.
        // Level 2: multiply max 99×9=891 → 3 digits
        // Level 3: multiply max 99×99=9801 → 4 digits. Division num1 max 12×99=1188 → 4 digits
        return [0, 2, 3, 4][level] || 3;
    }

    function renderProblemHTML(problem, index) {
        const { num1, num2, result, operator } = problem;

        if (operator === '÷') {
            return renderDivisionHTML(problem, index);
        }
        return renderMultiplicationHTML(problem, index);
    }

    // Multiplication: vertical format (same as addition/subtraction)
    function renderMultiplicationHTML(problem, index) {
        const { num1, num2, result } = problem;
        const digits1      = numberToDigits(num1);
        const digits2      = numberToDigits(num2);
        const digitsResult = numberToDigits(result);

        const level     = parseInt(document.querySelector('input[name="level"]:checked').value);
        const maxLength = getMaxLength(level);
        const cols      = maxLength + 1;

        let html = `<div class="problem-item" style="--cols:${cols}">`;
        html += `<div class="problem-number">(${index + 1})</div>`;
        html += '<div class="problem-content">';

        html += '<div class="problem-row">';
        html += '<span class="op-col"></span>';
        for (let i = 0; i < maxLength - digits1.length; i++) html += '<span class="digit"> </span>';
        digits1.forEach(d => { html += `<span class="digit">${d}</span>`; });
        html += '</div>';

        html += '<div class="problem-row operator">';
        html += '<span class="op-col">×</span>';
        for (let i = 0; i < maxLength - digits2.length; i++) html += '<span class="digit"> </span>';
        digits2.forEach(d => { html += `<span class="digit">${d}</span>`; });
        html += '</div>';

        html += '<div class="problem-row line"></div>';

        html += '<div class="problem-row answer">';
        html += '<span class="op-col"></span>';
        for (let i = 0; i < maxLength - digitsResult.length; i++) html += '<span class="digit"> </span>';
        digitsResult.forEach(d => {
            html += `<span class="digit answer-slot" data-answer="${d}">${d}</span>`;
        });
        html += '</div>';

        html += '</div></div>';
        return html;
    }

    // Division: long-division bracket format
    // num1 = dividend (inside), num2 = divisor (left), result = quotient (top)
    function renderDivisionHTML(problem, index) {
        const { num1, num2, result } = problem;

        // SVG bracket: top horizontal bar + vertical line that curves slightly right in the middle
        // viewBox: width=80 (horizontal bar), height=44 (vertical part)
        const w = 80, h = 44, curve = 5;
        const bracketSVG = `<svg class="div-svg-bracket" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <path d="M 0,0 L ${w},0" stroke="#333" stroke-width="2" fill="none"/>
  <path d="M 0,0 Q ${curve},${h/2} 0,${h}" stroke="#333" stroke-width="2" fill="none"/>
</svg>`;

        let html = `<div class="problem-item div-item">`;
        html += `<div class="problem-number">(${index + 1})</div>`;
        html += '<div class="div-problem">';
        html += `<span class="div-divisor">${num2}</span>`;
        html += '<div class="div-bracket-wrap">';
        html += `<div class="div-answer"><span class="answer-slot" data-answer="${result}">${result}</span></div>`;
        html += `<div class="div-bracket">${bracketSVG}<span class="div-dividend">${num1}</span></div>`;
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function buildPageHTML(showTitle, title, pageIndex) {
        let html = '';

        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        html += `<div class="puzzle-title title-slot">${title}</div>`;

        const operation = document.querySelector('input[name="operation"]:checked').value;
        const perPage   = operation === 'mixed' ? 15 : PROBLEMS_PER_PAGE;
        html += '<div class="problems-grid">';
        const start = pageIndex * perPage;
        const end   = Math.min(start + perPage, currentProblems.length);
        for (let i = start; i < end; i++) {
            html += renderProblemHTML(currentProblems[i], i % perPage);
        }
        html += '</div>';

        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        return html;
    }

    // ── Generate & render ────────────────────────────────────────

    function generateWorksheet() {
        syncTitleWithOperation();
        const title     = worksheetTitle.value || 'Multiplication & Division';
        const level     = parseInt(document.querySelector('input[name="level"]:checked').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;
        const numPages  = Math.max(1, parseInt(numPagesInput.value) || 1);
        const showTitle = showTitleCheckbox.checked;

        currentProblems = [];
        if (operation === 'mixed') {
            // Per page: 7 multiplication + 8 division = 15 total
            for (let p = 0; p < numPages; p++) {
                for (let i = 0; i < 7; i++) currentProblems.push(generateProblem(level, 'multiplication'));
                for (let i = 0; i < 8; i++) currentProblems.push(generateProblem(level, 'division'));
            }
        } else {
            for (let i = 0; i < numPages * PROBLEMS_PER_PAGE; i++) {
                currentProblems.push(generateProblem(level, operation));
            }
        }

        answerMode = false;
        answerBtn.classList.remove('active');
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        worksheetPreview.classList.remove('answers-on');

        worksheetPreview.innerHTML = buildPageHTML(showTitle, title, 0);
        worksheetPreview.classList.toggle('title-off', !showTitle);
        printBtn.disabled = false;
    }

    function toggleAnswers() {
        answerMode = !answerMode;
        answerBtn.classList.toggle('active', answerMode);
        answerBtn.innerHTML = answerMode
            ? '<i class="fas fa-eye-slash"></i> Hide Answers'
            : '<i class="fas fa-eye"></i> Show Answers';
        worksheetPreview.classList.toggle('answers-on', answerMode);
    }

    function printWorksheet() {
        const numPages  = Math.max(1, parseInt(numPagesInput.value) || 1);
        const showTitle = showTitleCheckbox.checked;
        const title     = worksheetTitle.value || 'Multiplication & Division';
        const level     = parseInt(document.querySelector('input[name="level"]:checked').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;
        const perPage   = operation === 'mixed' ? 15 : PROBLEMS_PER_PAGE;

        const printPages = document.createElement('div');
        printPages.id = 'print-pages';

        for (let p = 0; p < numPages; p++) {
            // Generate fresh random problems for each print page
            const pageProblems = [];
            if (operation === 'mixed') {
                for (let i = 0; i < 7; i++) pageProblems.push(generateProblem(level, 'multiplication'));
                for (let i = 0; i < 8; i++) pageProblems.push(generateProblem(level, 'division'));
            } else {
                for (let i = 0; i < perPage; i++) pageProblems.push(generateProblem(level, operation));
            }

            // Build page HTML directly from pageProblems
            let html = '';
            html += '<div class="student-header">';
            html += '<div class="header-left"><div class="puzzle-header">';
            html += '<img src="/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
            html += '</div></div>';
            html += '<div class="info-group">';
            html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
            html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
            html += '</div></div>';
            html += `<div class="puzzle-title title-slot">${title}</div>`;
            html += '<div class="problems-grid">';
            pageProblems.forEach((prob, i) => { html += renderProblemHTML(prob, i); });
            html += '</div>';
            const currentYear = new Date().getFullYear();
            html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

            const page = document.createElement('div');
            page.className = 'print-page';
            page.classList.toggle('answers-on', answerMode);
            page.classList.toggle('title-off', !showTitle);
            page.innerHTML = html;
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);
        const cleanup = () => { printPages.remove(); window.removeEventListener('afterprint', cleanup); };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    function updateTitleVisibility() {
        const showTitle  = showTitleCheckbox.checked;
        const title      = worksheetTitle.value || 'Multiplication & Division';
        const titleEl    = document.querySelector('#puzzle-preview .puzzle-title');
        if (titleEl) titleEl.textContent = title;
        worksheetPreview.classList.toggle('title-off', !showTitle);
    }

    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    answerBtn.addEventListener('click', toggleAnswers);
    showTitleCheckbox.addEventListener('change', updateTitleVisibility);

    syncTitleWithOperation();
    generateWorksheet();
});
