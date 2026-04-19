// Multiplication & Division Worksheet Generator

var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

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

    function getBaseProblemsPerPage() {
        const checked = document.querySelector('input[name="problems-per-page"]:checked');
        return checked ? parseInt(checked.value) : 15;
    }

    function getColsPerRow() {
        return getBaseProblemsPerPage() === 20 ? 4 : 3;
    }

    function getProblemsPerPage() {
        const base = getBaseProblemsPerPage();
        const cols = getColsPerRow();
        return showTitleCheckbox.checked ? base : base + cols;
    }

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
                case 1:
                    num1 = Math.floor(Math.random() * 9) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
                    break;
                case 2:
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 9) + 2;
                    break;
                case 3:
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 90) + 10;
                    break;
                default:
                    num1 = Math.floor(Math.random() * 9) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
            }
            return { num1, num2, result: num1 * num2, operator: '×' };
        }

        // Division: always whole-number answer
        let quotient, divisor, dividend;
        switch (level) {
            case 1:
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 9) + 1;
                dividend = divisor * quotient;
                break;
            case 2:
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 90) + 10;
                dividend = divisor * quotient;
                break;
            case 3:
                divisor  = Math.floor(Math.random() * 11) + 2;
                quotient = Math.floor(Math.random() * 90) + 10;
                dividend = divisor * quotient;
                break;
            default:
                divisor  = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 9) + 1;
                dividend = divisor * quotient;
        }
        return { num1: dividend, num2: divisor, result: quotient, operator: '÷' };
    }

    function generateProblemsForPage(level, operation, count) {
        const problems = [];
        if (operation === 'mixed') {
            const half = Math.floor(count / 2);
            for (let i = 0; i < half; i++) problems.push(generateProblem(level, 'multiplication'));
            for (let i = 0; i < count - half; i++) problems.push(generateProblem(level, 'division'));
        } else {
            for (let i = 0; i < count; i++) problems.push(generateProblem(level, operation));
        }
        return problems;
    }

    // ── Rendering ───────────────────────────────────────────────

    function numberToDigits(num) {
        return num.toString().split('').map(Number);
    }

    function getMaxLength(level) {
        return [0, 2, 3, 4][level] || 3;
    }

    function renderProblemHTML(problem, index) {
        if (problem.operator === '÷') return renderDivisionHTML(problem, index);
        return renderMultiplicationHTML(problem, index);
    }

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

    function renderDivisionHTML(problem, index) {
        const { num1, num2, result } = problem;

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

    function buildPageHTML(showTitle, title, problems, startIndex) {
        const cols = getColsPerRow();
        let html = '';

        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        html += `<div class="puzzle-title title-slot"${showTitle ? '' : ' style="display:none"'}>${title}</div>`;

        html += `<div class="problems-grid cols-${cols}">`;
        problems.forEach((prob, i) => {
            html += renderProblemHTML(prob, startIndex + i);
        });
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
        const perPage   = getProblemsPerPage();

        currentProblems = [];
        for (let p = 0; p < numPages; p++) {
            const pageProblems = generateProblemsForPage(level, operation, perPage);
            currentProblems.push(...pageProblems);
        }

        answerMode = false;
        answerBtn.classList.remove('active');
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> ' + _showTxt;
        worksheetPreview.classList.remove('answers-on');

        worksheetPreview.innerHTML = buildPageHTML(showTitle, title, currentProblems.slice(0, perPage), 0);
        worksheetPreview.classList.toggle('title-off', !showTitle);
        printBtn.disabled = false;
    }

    function toggleAnswers() {
        answerMode = !answerMode;
        answerBtn.classList.toggle('active', answerMode);
        answerBtn.innerHTML = answerMode
            ? '<i class="fas fa-eye-slash"></i> ' + _hideTxt
            : '<i class="fas fa-eye"></i> ' + _showTxt;
        worksheetPreview.classList.toggle('answers-on', answerMode);
    }

    function printWorksheet() {
        const numPages  = Math.max(1, parseInt(numPagesInput.value) || 1);
        const showTitle = showTitleCheckbox.checked;
        const title     = worksheetTitle.value || 'Multiplication & Division';
        const level     = parseInt(document.querySelector('input[name="level"]:checked').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;
        const perPage   = getProblemsPerPage();

        const printPages = document.createElement('div');
        printPages.id = 'print-pages';

        for (let p = 0; p < numPages; p++) {
            const pageProblems = p === 0
                ? currentProblems.slice(0, perPage)
                : generateProblemsForPage(level, operation, perPage);

            const page = document.createElement('div');
            page.className = 'print-page';
            page.classList.toggle('answers-on', answerMode);
            page.classList.toggle('title-off', !showTitle);
            page.innerHTML = buildPageHTML(showTitle, title, pageProblems, p * perPage);
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);
        const cleanup = () => { printPages.remove(); window.removeEventListener('afterprint', cleanup); };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    answerBtn.addEventListener('click', toggleAnswers);
    showTitleCheckbox.addEventListener('change', generateWorksheet);
    document.querySelectorAll('input[name="problems-per-page"]').forEach(input => {
        input.addEventListener('change', generateWorksheet);
    });

    syncTitleWithOperation();
    generateWorksheet();
});
