// Addition & Subtraction Worksheet Generator

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
            case 'addition':
                return 'Addition';
            case 'subtraction':
                return 'Subtraction';
            case 'mixed':
            default:
                return 'Addition & Subtraction';
        }
    }

    function syncTitleWithOperation() {
        if (!titleIsAuto) return;
        const operation = document.querySelector('input[name="operation"]:checked')?.value || 'mixed';
        worksheetTitle.value = getOperationTitle(operation);
    }

    // If user edits title manually, stop auto-updating it
    worksheetTitle.addEventListener('input', () => {
        const currentValue = worksheetTitle.value.trim();
        const op = document.querySelector('input[name="operation"]:checked')?.value || 'mixed';
        titleIsAuto = currentValue === '' || currentValue === getOperationTitle(op);
    });

    // Change title when operation changes (only if not manually overridden)
    operationInputs.forEach(input => {
        input.addEventListener('change', () => {
            syncTitleWithOperation();
            generateWorksheet();
        });
    });

    // Live update when level changes
    levelInputs.forEach(input => {
        input.addEventListener('change', () => {
            generateWorksheet();
        });
    });

    // Generate problems based on difficulty level
    function generateProblem(level, operation) {
        let num1, num2, result;
        
        if (operation === 'addition') {
            switch(level) {
                case 1: // 2자리 + 1자리
                    num1 = Math.floor(Math.random() * 90) + 10; // 10-99
                    num2 = Math.floor(Math.random() * 9) + 1; // 1-9
                    result = num1 + num2;
                    break;
                case 2: // 2자리 + 2자리
                    num1 = Math.floor(Math.random() * 90) + 10; // 10-99
                    num2 = Math.floor(Math.random() * 90) + 10; // 10-99
                    result = num1 + num2;
                    break;
                case 3: // 3자리 + 2자리
                    // 결과가 3자리(<=999)로 유지되도록 생성
                    for (let tries = 0; tries < 50; tries++) {
                        num1 = Math.floor(Math.random() * 900) + 100; // 100-999
                        num2 = Math.floor(Math.random() * 90) + 10; // 10-99
                        result = num1 + num2;
                        if (result <= 999) break;
                    }
                    break;
                default:
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 9) + 1;
                    result = num1 + num2;
            }
            return { num1, num2, result, operator: '+' };
        } else if (operation === 'subtraction') {
            switch(level) {
                case 1: // 2자리 - 1자리 (답이 2자리 또는 1자리)
                    num1 = Math.floor(Math.random() * 90) + 10; // 10-99
                    num2 = Math.floor(Math.random() * 9) + 1; // 1-9
                    // num1이 num2보다 크도록 보장
                    if (num1 <= num2) {
                        num1 = num2 + Math.floor(Math.random() * 80) + 10;
                    }
                    result = num1 - num2;
                    break;
                case 2: // 2자리 - 2자리 (답이 2자리 또는 1자리)
                    num1 = Math.floor(Math.random() * 90) + 10; // 10-99
                    num2 = Math.floor(Math.random() * (num1 - 10)) + 10; // 10 to num1-1
                    result = num1 - num2;
                    break;
                case 3: // 3자리 - 2자리 (답이 3자리 또는 2자리)
                    num1 = Math.floor(Math.random() * 900) + 100; // 100-999
                    num2 = Math.floor(Math.random() * 90) + 10; // 10-99
                    // num1이 num2보다 크도록 보장
                    if (num1 <= num2) {
                        num1 = num2 + Math.floor(Math.random() * 800) + 100;
                    }
                    result = num1 - num2;
                    break;
                default:
                    num1 = Math.floor(Math.random() * 90) + 10;
                    num2 = Math.floor(Math.random() * 9) + 1;
                    if (num1 <= num2) {
                        num1 = num2 + Math.floor(Math.random() * 80) + 10;
                    }
                    result = num1 - num2;
            }
            return { num1, num2, result, operator: '-' };
        } else {
            // Mixed: randomly choose addition or subtraction
            const isAddition = Math.random() > 0.5;
            if (isAddition) {
                return generateProblem(level, 'addition');
            } else {
                return generateProblem(level, 'subtraction');
            }
        }
    }

    // Convert number to array of digits
    function numberToDigits(num) {
        return num.toString().split('').map(Number);
    }

    // Generate worksheet
    function generateWorksheet() {
        syncTitleWithOperation();
        const title = worksheetTitle.value || 'Addition & Subtraction Worksheet';
        const level = parseInt(document.querySelector('input[name="level"]:checked').value);
        const operation = document.querySelector('input[name="operation"]:checked').value;
        const numPages = Math.max(1, parseInt(numPagesInput.value) || 1);
        const showTitle = showTitleCheckbox.checked;
        
        // Generate problems
        currentProblems = [];
        for (let i = 0; i < numPages * PROBLEMS_PER_PAGE; i++) {
            currentProblems.push(generateProblem(level, operation));
        }
        
        // Reset answer mode
        answerMode = false;
        answerBtn.classList.remove('active');
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        worksheetPreview.classList.remove('answers-on');
        
        // Render worksheet
        // Preview always shows only 1 page (page 1)
        renderWorksheetPage(showTitle, title, 0);
        printBtn.disabled = false;
    }
    
    // Render one page into preview (0-based pageIndex)
    function renderWorksheetPage(showTitle, title, pageIndex) {
        let html = '';
        
        // Add header section with logo and student info
        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div>';
        html += '</div>';
        html += '<div class="info-group">';
        html += '<div class="info-line">';
        html += '<label>Name:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '<div class="info-line">';
        html += '<label>Date:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        // Title slot is always rendered to keep layout fixed; visibility toggled via class
        html += `<div class="puzzle-title title-slot">${title}</div>`;
        
        // Problems grid
        html += '<div class="problems-grid">';
        const start = pageIndex * PROBLEMS_PER_PAGE;
        const end = Math.min(start + PROBLEMS_PER_PAGE, currentProblems.length);
        for (let i = start; i < end; i++) {
            html += renderProblemHTML(currentProblems[i], i, answerMode);
        }
        html += '</div>';
        
        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        
        worksheetPreview.innerHTML = html;
        worksheetPreview.classList.toggle('title-off', !showTitle);
    }
    
    // Toggle answers
    function toggleAnswers() {
        answerMode = !answerMode;
        
        if (answerMode) {
            answerBtn.classList.add('active');
            answerBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Answers';
        } else {
            answerBtn.classList.remove('active');
            answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
        }

        // 레이아웃은 그대로 두고(자리 고정), 표시만 토글 (opacity)
        worksheetPreview.classList.toggle('answers-on', answerMode);
    }
    
    // Render problem as HTML string
    function renderProblemHTML(problem, index, showAnswer) {
        const { num1, num2, result, operator } = problem;
        const digits1 = numberToDigits(num1);
        const digits2 = numberToDigits(num2);
        const digitsResult = numberToDigits(result);
        
        // 한 문제당 가로폭을 "답 3자리" 기준으로 고정: 연산자 1칸 + 숫자 3칸 = 4칸
        const maxLength = 3;
        const cols = 4;
        
        let html = `<div class="problem-item" style="--cols:${cols}">`;
        
        // Problem number (positioned absolutely)
        html += `<div class="problem-number">(${index + 1})</div>`;
        
        // Problem content wrapper
        html += '<div class="problem-content">';
        
        // First number (right-aligned)
        html += '<div class="problem-row">';
        html += '<span class="op-col"></span>';
        for (let i = 0; i < maxLength - digits1.length; i++) {
            html += '<span class="digit"> </span>';
        }
        digits1.forEach(digit => {
            html += `<span class="digit">${digit}</span>`;
        });
        html += '</div>';
        
        // Operator and second number
        html += '<div class="problem-row operator">';
        html += `<span class="op-col">${operator} </span>`;
        for (let i = 0; i < maxLength - digits2.length; i++) {
            html += '<span class="digit"> </span>';
        }
        digits2.forEach(digit => {
            html += `<span class="digit">${digit}</span>`;
        });
        html += '</div>';
        
        // Line
        html += '<div class="problem-row line"></div>';
        
        // Answer
        html += '<div class="problem-row answer">';
        html += '<span class="op-col"></span>';
        for (let i = 0; i < maxLength - digitsResult.length; i++) {
            html += '<span class="digit"> </span>';
        }
        digitsResult.forEach(digit => {
            // 텍스트는 항상 렌더링(자리 고정), CSS로 보이기/숨기기만 처리
            html += `<span class="digit answer-slot" data-answer="${digit}">${digit}</span>`;
        });
        html += '</div>';
        
        html += '</div>'; // problem-content
        html += '</div>'; // problem-item
        return html;
    }

    // Print worksheet
    function printWorksheet() {
        const numPages = Math.max(1, parseInt(numPagesInput.value) || 1);
        const showTitle = showTitleCheckbox.checked;
        const title = worksheetTitle.value || 'Addition & Subtraction';

        // Build print-only pages (A4) without changing preview
        const printPages = document.createElement('div');
        printPages.id = 'print-pages';

        for (let p = 0; p < numPages; p++) {
            const page = document.createElement('div');
            page.className = 'print-page';
            page.classList.toggle('answers-on', answerMode);
            page.classList.toggle('title-off', !showTitle);

            // reuse same markup as preview page
            const pageHtml = buildPageHTML(showTitle, title, p);
            page.innerHTML = pageHtml;
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);

        // Print, then cleanup and restore preview-only view
        const cleanup = () => {
            printPages.remove();
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    function buildPageHTML(showTitle, title, pageIndex) {
        let html = '';

        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div>';
        html += '</div>';
        html += '<div class="info-group">';
        html += '<div class="info-line">';
        html += '<label>Name:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '<div class="info-line">';
        html += '<label>Date:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += `<div class="puzzle-title title-slot">${title}</div>`;

        html += '<div class="problems-grid">';
        const start = pageIndex * PROBLEMS_PER_PAGE;
        const end = Math.min(start + PROBLEMS_PER_PAGE, currentProblems.length);
        for (let i = start; i < end; i++) {
            html += renderProblemHTML(currentProblems[i], i, answerMode);
        }
        html += '</div>';

        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        return html;
    }

    // Update title visibility when checkbox changes (no layout shift)
    function updateTitleVisibility() {
        const showTitle = showTitleCheckbox.checked;
        const title = worksheetTitle.value || 'Addition & Subtraction';
        const puzzleTitle = document.querySelector('#puzzle-preview .puzzle-title');
        if (puzzleTitle) puzzleTitle.textContent = title;
        worksheetPreview.classList.toggle('title-off', !showTitle);
    }

    // Event listeners
    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    answerBtn.addEventListener('click', toggleAnswers);
    showTitleCheckbox.addEventListener('change', updateTitleVisibility);
    
    // Generate on page load
    syncTitleWithOperation();
    generateWorksheet();
});
