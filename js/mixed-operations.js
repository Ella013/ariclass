// Mixed Operations Worksheet Generator

document.addEventListener('DOMContentLoaded', function() {
    var generateBtn = document.getElementById('generate-btn');
    var printBtn = document.getElementById('print-btn');
    var answerBtn = document.getElementById('answer-btn');
    var preview = document.getElementById('puzzle-preview');
    var titleInput = document.getElementById('worksheet-title');
    var showTitleCb = document.getElementById('show-title');
    var numPagesInput = document.getElementById('num-pages');

    var currentProblems = [];
    var answerMode = false;

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getEnabledOps() {
        var ops = [];
        document.querySelectorAll('input[name="mo-op"]:checked').forEach(function(cb) {
            ops.push(cb.value);
        });
        return ops.length ? ops : ['add'];
    }

    function getLevel() {
        return parseInt(document.querySelector('input[name="level"]:checked').value);
    }

    function getOperandCount() {
        return parseInt(document.querySelector('input[name="mo-operands"]:checked').value);
    }

    function getRows() {
        var s = document.querySelector('input[name="mo-spacing"]:checked').value;
        if (s === 'small')  return 18;
        if (s === 'large')  return 8;
        return 12;
    }

    function getColCount() {
        return getOperandCount() === 2 ? 3 : 2;
    }

    function getProblemsPerPage() {
        // Always generate one extra row so title toggle can reveal it without regenerating
        return (getRows() + 1) * getColCount();
    }

    function opToSym(op) {
        if (op === 'add') return '+';
        if (op === 'sub') return '−';
        if (op === 'mul') return '×';
        return '÷';
    }

    function applyOp(a, b, op) {
        if (op === 'add') return a + b;
        if (op === 'sub') return a - b;
        if (op === 'mul') return a * b;
        return a / b;
    }

    function findDivisor(n, min, max) {
        var candidates = [];
        for (var d = Math.max(2, min); d <= Math.min(max, n); d++) {
            if (n % d === 0) candidates.push(d);
        }
        return candidates.length ? candidates[rand(0, candidates.length - 1)] : null;
    }

    function getStartNum(level) {
        if (level === 1) return rand(2, 9);
        if (level === 2) return rand(10, 99);
        return Math.random() < 0.5 ? rand(10, 99) : rand(100, 999);
    }

    // Get a valid next operand given the current running value and operator
    function getNextNum(op, current, level) {
        if (op === 'add') {
            if (level === 1) return rand(1, 9);
            if (level === 2) return rand(10, 99);
            return rand(10, 99); // cap for multi-step
        }
        if (op === 'sub') {
            var min = level === 1 ? 1 : 10;
            var max = Math.min(level === 1 ? 9 : 99, current - 1);
            if (max < 1) return null;
            if (max < min) return rand(1, max);
            return rand(min, max);
        }
        if (op === 'mul') {
            // Small multiplier to prevent explosion
            if (level === 1) return rand(2, 9);
            return rand(2, 9);
        }
        // div: find exact divisor
        var dMax = level === 1 ? 9 : 20;
        var d = findDivisor(current, 2, Math.min(dMax, current));
        return d; // may be null
    }

    // 2-operand problems: retry until result ≤ 999
    function gen2Problem(level, ops) {
        for (var attempt = 0; attempt < 50; attempt++) {
            var op = ops[rand(0, ops.length - 1)];
            var a, b, result;

            if (op === 'add') {
                if (level === 1) { a = rand(1,9); b = rand(1,9); }
                else if (level === 2) { a = rand(10,99); b = rand(10,99); }
                else { a = rand(100,899); b = rand(10,99); }
                result = a + b;
            } else if (op === 'sub') {
                if (level === 1) { a = rand(2,9); b = rand(1,a-1); }
                else if (level === 2) {
                    a = rand(10,99); b = rand(10,99);
                    if (a <= b) { var t=a; a=b; b=t; }
                    if (a === b) a = Math.min(99, a+1);
                } else { a = rand(110,999); b = rand(10,99); }
                result = a - b;
            } else if (op === 'mul') {
                if (level === 1) { a = rand(1,9); b = rand(1,9); }
                else { a = rand(10,99); b = rand(10,99); }
                result = a * b;
            } else { // div
                var q, d;
                if (level === 1) {
                    d = rand(2,9); q = rand(1, Math.max(1, Math.floor(9/d)));
                } else if (level === 2) {
                    d = rand(10,20); q = rand(2, Math.max(2, Math.floor(99/d)));
                } else {
                    d = rand(10,30);
                    var minQ = Math.ceil(100/d), maxQ = Math.floor(999/d);
                    q = rand(minQ, Math.min(maxQ, 50));
                }
                a = q * d; b = d; result = q;
            }

            if (result > 999 || result <= 0 || !Number.isInteger(result)) continue;
            return { numbers: [a, b], syms: [opToSym(op)], result: result };
        }
        // Fallback
        var fa = level === 1 ? rand(1,4) : rand(10,40);
        var fb = level === 1 ? rand(1,4) : rand(10,40);
        return { numbers: [fa, fb], syms: ['+'], result: fa + fb };
    }

    // Multi-operand problems (3 or 4 numbers)
    function genMultiProblem(numOps, level, ops) {
        for (var attempt = 0; attempt < 60; attempt++) {
            var numbers = [getStartNum(level)];
            var syms = [];
            var current = numbers[0];
            var ok = true;

            for (var i = 1; i < numOps; i++) {
                var op = ops[rand(0, ops.length - 1)];
                var b = getNextNum(op, current, level);
                if (b === null || b === undefined || b <= 0) { ok = false; break; }
                var next = applyOp(current, b, op);
                if (next <= 0 || !Number.isInteger(next) || next > 999) { ok = false; break; }
                syms.push(opToSym(op));
                numbers.push(b);
                current = next;
            }

            if (!ok) continue;

            // For 4-number problems with multiple ops available, ensure at least 2 different operators
            if (numOps === 4 && ops.length >= 2) {
                var seen = {};
                syms.forEach(function(s) { seen[s] = true; });
                if (Object.keys(seen).length < 2) continue;
            }

            return { numbers: numbers, syms: syms, result: current };
        }

        // Fallback: pure addition, capped at 999
        var ns = [getStartNum(level)], ss = [], res = ns[0];
        for (var j = 1; j < numOps; j++) {
            var n = level === 1 ? rand(1,4) : rand(10,20);
            if (res + n > 999) n = 1;
            ns.push(n); ss.push('+'); res += n;
        }
        return { numbers: ns, syms: ss, result: res };
    }

    function generateProblem(level, ops, numOperands) {
        if (numOperands === 2) return gen2Problem(level, ops);
        return genMultiProblem(numOperands, level, ops);
    }

    function renderProblemHTML(prob, index) {
        var ans = prob.result.toString();
        var expr = '';
        for (var i = 0; i < prob.numbers.length; i++) {
            if (i > 0) expr += ' ' + prob.syms[i-1] + ' ';
            expr += prob.numbers[i];
        }
        return '<div class="mo-problem">' +
            '<span class="mo-num">(' + (index + 1) + ')</span>' +
            '<span class="mo-expr">' + expr + ' =</span>' +
            '<span class="mo-blank"><span class="answer-slot" data-answer="' + ans + '">' + ans + '</span></span>' +
            '</div>';
    }

    function buildHeader() {
        return '<div class="student-header">' +
            '<div class="header-left"><div class="puzzle-header">' +
            '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">' +
            '</div></div>' +
            '<div class="info-group">' +
            '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>' +
            '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>' +
            '</div></div>';
    }

    function buildPageContent(showTitle, title, problems, startIndex) {
        var rows = showTitle ? getRows() : getRows() + 1;
        var cols = getColCount();
        var colClass = cols === 3 ? 'cols-3' : 'cols-2';
        var pageProblems = problems.slice(0, rows * cols);
        var html = buildHeader();
        html += '<div class="mo-page-body">';
        html += '<div class="puzzle-title title-slot">' + title + '</div>';
        html += '<div class="mo-grid ' + colClass + '" style="grid-template-rows: repeat(' + rows + ', 1fr)">';
        for (var i = 0; i < pageProblems.length; i++) {
            html += renderProblemHTML(pageProblems[i], startIndex + i);
        }
        html += '</div></div>';
        var yr = new Date().getFullYear();
        html += '<div class="copyright-footer">&copy; ' + yr + ' AriClass. All rights reserved.</div>';
        return html;
    }

    function generateWorksheet() {
        var title = titleInput.value || 'Mixed Operations';
        var level = getLevel();
        var ops = getEnabledOps();
        var n = getOperandCount();
        var numPages = Math.max(1, parseInt(numPagesInput.value) || 1);
        var ppp = getProblemsPerPage();

        currentProblems = [];
        for (var i = 0; i < numPages * ppp; i++) {
            currentProblems.push(generateProblem(level, ops, n));
        }

        answerMode = false;
        answerBtn.classList.remove('active');
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        preview.classList.remove('answers-on');

        var showTitle = showTitleCb.checked;
        preview.innerHTML = buildPageContent(showTitle, title, currentProblems.slice(0, ppp), 0);
        preview.classList.toggle('title-off', !showTitle);
        printBtn.disabled = false;
    }

    function toggleAnswers() {
        answerMode = !answerMode;
        if (answerMode) {
            answerBtn.classList.add('active');
            answerBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answers';
        } else {
            answerBtn.classList.remove('active');
            answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        }
        preview.classList.toggle('answers-on', answerMode);
    }

    function printWorksheet() {
        var title = titleInput.value || 'Mixed Operations';
        var level = getLevel();
        var ops = getEnabledOps();
        var n = getOperandCount();
        var numPages = Math.max(1, parseInt(numPagesInput.value) || 1);
        var ppp = getProblemsPerPage();
        var showTitle = showTitleCb.checked;

        var printPages = document.createElement('div');
        printPages.id = 'print-pages';

        for (var p = 0; p < numPages; p++) {
            var problems;
            if (p === 0) {
                problems = currentProblems.slice(0, ppp);
            } else {
                problems = [];
                for (var i = 0; i < ppp; i++) {
                    problems.push(generateProblem(level, ops, n));
                }
            }
            var page = document.createElement('div');
            page.className = 'print-page';
            page.classList.toggle('answers-on', answerMode);
            page.classList.toggle('title-off', !showTitle);
            page.innerHTML = buildPageContent(showTitle, title, problems, p * ppp);
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);
        var cleanup = function() { printPages.remove(); window.removeEventListener('afterprint', cleanup); };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    answerBtn.addEventListener('click', toggleAnswers);
    showTitleCb.addEventListener('change', function() {
        var showTitle = showTitleCb.checked;
        var title = titleInput.value || 'Mixed Operations';
        var ppp = getProblemsPerPage();
        preview.innerHTML = buildPageContent(showTitle, title, currentProblems.slice(0, ppp), 0);
        preview.classList.toggle('title-off', !showTitle);
    });
    document.querySelectorAll('input[name="mo-op"]').forEach(function(cb) {
        cb.addEventListener('change', generateWorksheet);
    });
    document.querySelectorAll('input[name="level"]').forEach(function(inp) {
        inp.addEventListener('change', generateWorksheet);
    });
    document.querySelectorAll('input[name="mo-spacing"]').forEach(function(inp) {
        inp.addEventListener('change', generateWorksheet);
    });
    document.querySelectorAll('input[name="mo-operands"]').forEach(function(inp) {
        inp.addEventListener('change', generateWorksheet);
    });

    generateWorksheet();
});
