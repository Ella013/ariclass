var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const randomGenerateBtn = document.getElementById('random-generate-btn');
    const printBtn = document.getElementById('print-btn');
    const answerBtn = document.getElementById('answer-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

    // State
    let currentPuzzle = null;
    let showingAnswers = false;
    let savedSolution = null; // Save the solution when generating new puzzle

    // Difficulty levels - number of cells to remove
    const difficultyLevels = {
        easy: 30,    // Remove 30 cells
        medium: 40,  // Remove 40 cells
        hard: 50,    // Remove 50 cells
        expert: 60   // Remove 60 cells
    };

    // Pages input
    const numPagesInput = document.getElementById('num-pages');

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        if (savedSolution) {
            adjustDifficulty(); // Adjust difficulty without regenerating solution
        } else {
            generateSudoku(); // Generate new if no solution exists
        }
    });
    randomGenerateBtn.addEventListener('click', generateSudoku); // Always generate new puzzle
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', updatePreview);
    worksheetTitle.addEventListener('input', updatePreview);
    
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (savedSolution) {
                adjustDifficulty(); // Adjust difficulty without regenerating solution
            }
        });
    });

    // Show Answers button
    answerBtn.addEventListener('click', function() {
        if (!currentPuzzle) return;
        showingAnswers = !showingAnswers;
        updatePreview();
        
        // Update button text
        this.innerHTML = showingAnswers ? 
            '<i class="fas fa-eye-slash"></i> ' + _hideTxt :
            '<i class="fas fa-check-circle"></i> ' + _showTxt;
        this.classList.toggle('active');
    });

    // Generate a complete valid sudoku grid
    function generateCompleteSudoku() {
        const grid = Array(9).fill(null).map(() => Array(9).fill(0));
        
        // Fill diagonal 3x3 boxes first (they are independent)
        fillBox(grid, 0, 0);
        fillBox(grid, 3, 3);
        fillBox(grid, 6, 6);
        
        // Fill remaining cells
        solveSudoku(grid);
        
        return grid;
    }

    // Fill a 3x3 box with random numbers 1-9
    function fillBox(grid, row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(numbers);
        
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                grid[row + i][col + j] = numbers[index++];
            }
        }
    }

    // Solve sudoku using backtracking
    function solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffleArray(numbers);
                    
                    for (const num of numbers) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solveSudoku(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Check if a number can be placed at given position
    function isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) return false;
        }
        
        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        
        return true;
    }

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Generate sudoku puzzle (creates new solution)
    function generateSudoku() {
        // Generate complete solution
        const solution = generateCompleteSudoku();
        savedSolution = solution.map(row => [...row]); // Save solution for difficulty adjustment
        
        // Create puzzle by removing cells based on difficulty
        adjustDifficultyFromSolution(solution);
    }

    // Adjust difficulty without regenerating solution
    function adjustDifficulty() {
        if (!savedSolution) {
            generateSudoku();
            return;
        }
        
        adjustDifficultyFromSolution(savedSolution);
    }

    // Create puzzle from solution by removing cells based on current difficulty
    function adjustDifficultyFromSolution(solution) {
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const cellsToRemove = difficultyLevels[difficulty];
        
        const puzzle = solution.map(row => [...row]);
        const positions = [];
        for (let i = 0; i < 81; i++) {
            positions.push(i);
        }
        shuffleArray(positions);
        
        // Remove cells based on difficulty
        for (let i = 0; i < cellsToRemove; i++) {
            const pos = positions[i];
            const row = Math.floor(pos / 9);
            const col = pos % 9;
            puzzle[row][col] = 0;
        }
        
        currentPuzzle = {
            puzzle: puzzle,
            solution: solution.map(row => [...row])
        };
        
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-check-circle"></i> ' + _showTxt;
        answerBtn.classList.remove('active');
        
        updatePreview();
    }

    // Update preview
    function updatePreview() {
        if (!currentPuzzle) {
            displayEmptyPreview();
            return;
        }

        let html = '';
        
        // Add header section
        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
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

        // Add title if show-title is checked
        const title = worksheetTitle.value.trim() || 'Sudoku Puzzle';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // Add sudoku grid
        html += '<div class="sudoku-grid">';
        const grid = showingAnswers ? currentPuzzle.solution : currentPuzzle.puzzle;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = grid[row][col];
                const isGiven = currentPuzzle.puzzle[row][col] !== 0;
                const isAnswer = showingAnswers && !isGiven && value !== 0;
                
                let cellClass = 'sudoku-cell';
                if (isGiven) {
                    cellClass += ' given';
                } else if (isAnswer) {
                    cellClass += ' answer';
                } else {
                    cellClass += ' empty';
                }
                
                html += `<div class="${cellClass}">${value !== 0 ? value : ''}</div>`;
            }
        }
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    // Build HTML for one sudoku page (puzzle or solution)
    function buildSudokuPageHTML(puzzle, solution, showAnswers) {
        const title = worksheetTitle.value.trim() || 'Sudoku Puzzle';
        let html = '';

        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        html += '<div class="sudoku-grid">';
        const grid = showAnswers ? solution : puzzle;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = grid[row][col];
                const isGiven = puzzle[row][col] !== 0;
                const isAnswer = showAnswers && !isGiven && value !== 0;
                let cellClass = 'sudoku-cell';
                if (isGiven) cellClass += ' given';
                else if (isAnswer) cellClass += ' answer';
                else cellClass += ' empty';
                html += `<div class="${cellClass}">${value !== 0 ? value : ''}</div>`;
            }
        }
        html += '</div>';

        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        return html;
    }

    // Generate a fresh puzzle object (solution + puzzle with holes)
    function generateFreshPuzzle() {
        const solution = generateCompleteSudoku();
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const cellsToRemove = difficultyLevels[difficulty];

        const puzzle = solution.map(row => [...row]);
        const positions = Array.from({ length: 81 }, (_, i) => i);
        shuffleArray(positions);
        for (let i = 0; i < cellsToRemove; i++) {
            const pos = positions[i];
            puzzle[Math.floor(pos / 9)][pos % 9] = 0;
        }
        return { puzzle, solution };
    }

    // Print: page 1 = current preview, pages 2..N = new random puzzles
    function printWorksheet() {
        if (!currentPuzzle) { window.print(); return; }

        const numPages = Math.max(1, parseInt(numPagesInput.value) || 1);
        if (numPages === 1) { window.print(); return; }

        // Build extra pages (page 1 already comes from #puzzle-preview)
        const printPages = document.createElement('div');
        printPages.id = 'sudoku-print-pages';

        for (let p = 1; p < numPages; p++) {
            const { puzzle, solution } = generateFreshPuzzle();
            const page = document.createElement('div');
            page.className = 'sudoku-print-page';
            page.innerHTML = buildSudokuPageHTML(puzzle, solution, showingAnswers);
            printPages.appendChild(page);
        }

        document.body.appendChild(printPages);

        const cleanup = () => {
            printPages.remove();
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    // Display empty preview
    function displayEmptyPreview() {
        let html = '';
        
        // Add header section
        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
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

        // Add title if show-title is checked
        const title = worksheetTitle.value.trim() || 'Sudoku Puzzle';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // Add empty sudoku grid
        html += '<div class="sudoku-grid">';
        for (let i = 0; i < 81; i++) {
            html += '<div class="sudoku-cell empty"></div>';
        }
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        printBtn.disabled = true;
    }

    // Initialize with empty preview
    displayEmptyPreview();
});
