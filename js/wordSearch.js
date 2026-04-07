// Add these variables at the top of the file, outside any function
let answerMode = false;
let currentAnswers = [];
let currentWords = []; // Store current words
let currentGrid = null; // Store current grid state

const ANSWER_COLORS = ['#e74c3c', '#2980b9', '#27ae60'];

// Add fixed letters for each grid size
const fixedLetters = {
    '8': [
        ['K', 'X', 'Q', 'R', 'M', 'E', 'K', 'P'],
        ['I', 'C', 'S', 'R', 'Q', 'F', 'G', 'L'],
        ['D', 'V', 'E', 'A', 'M', 'N', 'O', 'W'],
        ['X', 'N', 'E', 'G', 'R', 'F', 'E', 'S'],
        ['L', 'F', 'A', 'E', 'F', 'S', 'M', 'T'],
        ['S', 'W', 'A', 'N', 'Y', 'R', 'M', 'U'],
        ['W', 'K', 'U', 'R', 'H', 'M', 'Y', 'V'],
        ['P', 'C', 'E', 'S', 'I', 'Y', 'B', 'X']
    ],
    '11': [
        ['K', 'X', 'Q', 'R', 'M', 'E', 'K', 'P', 'W', 'Y', 'Z'],
        ['I', 'C', 'S', 'R', 'Q', 'F', 'G', 'L', 'H', 'N', 'B'],
        ['D', 'V', 'E', 'A', 'M', 'N', 'O', 'W', 'T', 'I', 'J'],
        ['X', 'N', 'E', 'G', 'R', 'F', 'E', 'S', 'U', 'C', 'K'],
        ['L', 'F', 'A', 'E', 'F', 'S', 'M', 'T', 'V', 'D', 'L'],
        ['S', 'W', 'A', 'N', 'Y', 'R', 'M', 'U', 'W', 'E', 'M'],
        ['W', 'K', 'U', 'R', 'H', 'M', 'Y', 'V', 'X', 'F', 'N'],
        ['P', 'C', 'E', 'S', 'I', 'Y', 'B', 'X', 'Y', 'G', 'O'],
        ['Q', 'D', 'F', 'T', 'J', 'Z', 'C', 'W', 'Z', 'H', 'P'],
        ['R', 'E', 'G', 'U', 'K', 'A', 'D', 'V', 'A', 'I', 'Q'],
        ['S', 'F', 'H', 'V', 'L', 'B', 'E', 'W', 'B', 'J', 'R']
    ],
    '15': [
        ['K', 'X', 'Q', 'R', 'M', 'E', 'K', 'P', 'W', 'Y', 'Z', 'A', 'B', 'C', 'D'],
        ['I', 'C', 'S', 'R', 'Q', 'F', 'G', 'L', 'H', 'N', 'B', 'E', 'F', 'G', 'H'],
        ['D', 'V', 'E', 'A', 'M', 'N', 'O', 'W', 'T', 'I', 'J', 'I', 'J', 'K', 'L'],
        ['X', 'N', 'E', 'G', 'R', 'F', 'E', 'S', 'U', 'C', 'K', 'M', 'N', 'O', 'P'],
        ['L', 'F', 'A', 'E', 'F', 'S', 'M', 'T', 'V', 'D', 'L', 'Q', 'R', 'S', 'T'],
        ['S', 'W', 'A', 'N', 'Y', 'R', 'M', 'U', 'W', 'E', 'M', 'U', 'V', 'W', 'X'],
        ['W', 'K', 'U', 'R', 'H', 'M', 'Y', 'V', 'X', 'F', 'N', 'Y', 'Z', 'A', 'B'],
        ['P', 'C', 'E', 'S', 'I', 'Y', 'B', 'X', 'Y', 'G', 'O', 'C', 'D', 'E', 'F'],
        ['Q', 'D', 'F', 'T', 'J', 'Z', 'C', 'W', 'Z', 'H', 'P', 'G', 'H', 'I', 'J'],
        ['R', 'E', 'G', 'U', 'K', 'A', 'D', 'V', 'A', 'I', 'Q', 'K', 'L', 'M', 'N'],
        ['S', 'F', 'H', 'V', 'L', 'B', 'E', 'W', 'B', 'J', 'R', 'O', 'P', 'Q', 'R'],
        ['T', 'G', 'I', 'W', 'M', 'C', 'F', 'X', 'C', 'K', 'S', 'S', 'T', 'U', 'V'],
        ['U', 'H', 'J', 'X', 'N', 'D', 'G', 'Y', 'D', 'L', 'T', 'W', 'X', 'Y', 'Z'],
        ['V', 'I', 'K', 'Y', 'O', 'E', 'H', 'Z', 'E', 'M', 'U', 'A', 'B', 'C', 'D'],
        ['W', 'J', 'L', 'Z', 'P', 'F', 'I', 'A', 'F', 'N', 'V', 'E', 'F', 'G', 'H']
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const vocabList = document.getElementById('vocab-list');
    const addWordBtn = document.getElementById('add-word-btn');
    const generateBtn = document.getElementById('generate-btn');
    const randomGenerateBtn = document.getElementById('random-generate-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const headerText = document.getElementById('header-text');
    const footerText = document.getElementById('footer-text');
    const headerImage = document.getElementById('header-image');
    const footerImage = document.getElementById('footer-image');
    const uppercaseWords = document.getElementById('uppercase-words');
    const lowercaseWords = document.getElementById('lowercase-words');
    const showWordList = document.getElementById('show-word-list');
    const diagonalWords = document.getElementById('diagonal-words');
    const reverseWords = document.getElementById('reverse-words');
    const caseToggleBtn = document.getElementById('case-toggle');
    const levelInputs = document.querySelectorAll('input[name="level"]');
    let selectedLevel = '3'; // Default to level 3

    function getMaxWords() {
        if (selectedLevel === '1') return 10;
        if (selectedLevel === '2') return 15;
        return 20; // level 3
    }

    function updatePlaceholder() {
        const textarea = document.getElementById('vocab-list');
        if (textarea) {
            textarea.placeholder = `Enter your words (press Enter for each word)\nMaximum ${getMaxWords()} words`;
        }
    }

    // Set show word list checked by default
    showWordList.checked = true;

    // Add show word list change event listener
    showWordList.addEventListener('change', function() {
        const wordListElement = document.querySelector('.word-list');
        if (wordListElement) {
            wordListElement.style.display = this.checked ? 'block' : 'none';
        }
    });

    // Create and add answer button
    const previewActions = document.querySelector('.preview-actions');
    const answerBtn = document.createElement('button');
    answerBtn.className = 'answer-btn';
    answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
    answerBtn.addEventListener('click', toggleAnswers);
    previewActions.appendChild(answerBtn);

    // Add level selection handling
    levelInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            selectedLevel = e.target.value;
            updatePlaceholder();
            updateWordCountDisplay();
            generateEmptyPuzzle();
        });
    });

    // Initialize with empty puzzle
    generateEmptyPuzzle();

    // Event Listeners
    generateBtn.addEventListener('click', generatePuzzle);
    randomGenerateBtn.addEventListener('click', generateRandomPuzzle);
    printBtn.addEventListener('click', printPuzzle);
    if (addWordBtn) {
        addWordBtn.addEventListener('click', clearAll);
    }
    
    // Add event listeners for case change
    uppercaseWords.addEventListener('change', updateCase);
    lowercaseWords.addEventListener('change', updateCase);

    // Add case toggle button listener
    if (caseToggleBtn) caseToggleBtn.addEventListener('click', function() {
        if (uppercaseWords.checked) {
            lowercaseWords.checked = true;
        } else {
            uppercaseWords.checked = true;
        }
        updateCase();
    });

    // Logo image upload handlers
    if (headerImage) headerImage.addEventListener('change', function(e) {
        handleImageUpload(e, 'header');
    });

    if (footerImage) footerImage.addEventListener('change', function(e) {
        handleImageUpload(e, 'footer');
    });

    // Show title toggle
    if (showTitle) showTitle.addEventListener('change', () => {
        if (currentGrid) displayPuzzle(currentGrid, currentWords, currentAnswers);
    });

    // Text input handlers
    if (headerText) headerText.addEventListener('input', updatePreview);
    if (footerText) footerText.addEventListener('input', updatePreview);

    // Word count display (highlights excess words in red)
    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.id = 'word-count-display';
    vocabList.parentElement.insertBefore(wordCountDisplay, vocabList.nextSibling);

    function updateWordCountDisplay() {
        const text = vocabList.value.trim();
        const allWords = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
        const max = getMaxWords();
        if (allWords.length === 0) {
            wordCountDisplay.innerHTML = '';
            return;
        }
        const countText = `${allWords.length} / ${max} words`;
        const items = allWords.map((w, i) => {
            if (i >= max) {
                return `<span class="word-over-limit">${w}</span>`;
            }
            return `<span class="word-ok">${w}</span>`;
        }).join('');
        wordCountDisplay.innerHTML = `<div class="word-count-label">${countText}${allWords.length > max ? ' — <span class="word-over-limit-msg">excess words (red) will be ignored</span>' : ''}</div><div class="word-count-list">${items}</div>`;
    }

    vocabList.addEventListener('input', updateWordCountDisplay);

    // Add keyboard event listener to vocab list
    vocabList.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    // Clear button functionality
    const clearButton = document.getElementById('clearButton');
    const vocabTextarea = document.getElementById('vocab-list');
    
    clearButton.addEventListener('click', function() {
        vocabTextarea.value = '';
        generateEmptyPuzzle();
    });

    function handleImageUpload(e, position) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    // Store the image data in a data attribute
                    document.getElementById(`${position}-image`).dataset.image = e.target.result;
                    updatePreview();
                };
            };
            reader.readAsDataURL(file);
        }
    }

    function updatePreview() {
        const gridSize = getGridSize(selectedLevel);
        console.log('Updating preview with grid size:', gridSize);
        const grid = createEmptyGrid(gridSize);
        fillEmptySpaces(grid);
        
        let html = '';
        
        // Add header section with logo and student info
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

        // Add title
        const titleText0 = worksheetTitle ? worksheetTitle.value.trim() || 'Word Search' : 'Word Search';
        const titleVisible0 = !showTitle || showTitle.checked;
        html += `<div class="puzzle-title" style="visibility:${titleVisible0 ? 'visible' : 'hidden'}">${titleText0}</div>`;

        // Add puzzle grid with level class and data attributes
        html += `<div class="puzzle-grid level-${selectedLevel}">`;
        for (let y = 0; y < grid.length; y++) {
            html += '<div class="puzzle-row">';
            for (let x = 0; x < grid[y].length; x++) {
                let cellClasses = ['puzzle-cell'];
                let cellAttributes = `data-row="${y}" data-col="${x}"`;
                
                html += `<div class="${cellClasses.join(' ')}" ${cellAttributes}>${grid[y][x]}</div>`;
            }
            html += '</div>';
        }
        html += '</div>';

        // Add empty word list section
        html += '<div class="word-list">';
        html += '<h3>Find these words:</h3>';
        html += '<ul></ul>';
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
    }

    function clearAll() {
        vocabList.value = '';
    }

    function generateEmptyPuzzle() {
        const gridSize = getGridSize(selectedLevel);
        console.log('Generating empty puzzle with size:', gridSize);
        const grid = createEmptyGrid(gridSize);
        fillEmptySpaces(grid);
        displayPuzzle(grid);
        printBtn.disabled = false;
    }

    function addWordInput() {
        const wordCount = vocabList.children.length;
        if (wordCount >= getMaxWords()) {
            alert(`Maximum ${getMaxWords()} words allowed for Level ${selectedLevel}`);
            return;
        }

        const vocabItem = document.createElement('div');
        vocabItem.className = 'vocab-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'english-word';
        input.placeholder = 'Enter a word';
        
        vocabItem.appendChild(input);
        vocabList.appendChild(vocabItem);
        
        input.focus();
    }

    function getWords() {
        const text = vocabList.value.trim();
        if (!text) return [];
        
        const words = text.split('\n')
            .map(word => word.trim())
            .filter(word => word.length > 0)
            .slice(0, getMaxWords()); // Maximum words by level
            
        return words.map(word => 
            uppercaseWords.checked ? word.toUpperCase() : word.toLowerCase()
        );
    }

    function getGridSize(level) {
        switch(level) {
            case '1':
                return 8;  // 8x8 grid for easy
            case '2':
                return 11; // 11x11 grid for medium
            case '3':
                return 15; // 15x15 grid for hard
            default:
                return 15;
        }
    }

    function showWarning(message) {
        const warningDiv = document.querySelector('.word-search-warning') || document.createElement('div');
        warningDiv.className = 'word-search-warning';
        warningDiv.textContent = message;
        const wordInput = document.querySelector('.word-input');
        if (!warningDiv.parentElement) {
            wordInput.appendChild(warningDiv);
        }
    }

    function clearWarning() {
        const existingWarning = document.querySelector('.word-search-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
    }

    function getMaxWordLength() {
        const gridSize = getGridSize(selectedLevel);
        return gridSize - 1;  // Maximum word length should be one less than grid size
    }

    function validateWord(word) {
        if (!word) return false;
        
        const maxLength = getMaxWordLength();
        if (word.length > maxLength) {
            showWarning(`Please enter words with ${maxLength} letters or fewer`);
            return false;
        }

        // Check for non-letter characters
        if (!/^[a-zA-Z]+$/.test(word)) {
            showWarning('Please use only letters (A-Z)');
            return false;
        }

        // Remove any existing warning if validation passes
        clearWarning();
        return true;
    }

    function generatePuzzle() {
        const words = getWords();
        if (!validateWords()) return;

        const gridSize = getGridSize(selectedLevel);

        // Retry the whole placement up to 10 times in case random positions collide.
        // placeWords() returns [false, []] cleanly when a word can't be placed,
        // so there is no risk of an infinite loop.
        let grid, wordPositions, success;
        let attempts = 0;
        do {
            grid = createEmptyGrid(gridSize);
            [success, wordPositions] = placeWords(grid, words);
            attempts++;
        } while (!success && attempts < 10);

        if (!success) {
            showWarning('Could not place all words. Try using fewer or shorter words.');
            return;
        }

        fillEmptySpaces(grid, true);

        const answers = words.map((word, i) => ({
            word: word,
            positions: wordPositions[i]
        }));

        currentAnswers = answers;
        displayPuzzle(grid, words, answers);
        printBtn.disabled = false;
    }

    function validateWords() {
        const words = getWords();
        const maxLength = getMaxWordLength();
        
        // Check word count
        if (words.length > getMaxWords()) {
            showWarning(`Maximum ${getMaxWords()} words allowed for Level ${selectedLevel}. Please remove some words.`);
            return false;
        }

        // Check if any word is empty
        if (words.length === 0) {
            showWarning('Please enter at least one word');
            return false;
        }

        // Check word length
        const tooLongWords = words.filter(word => word.length > maxLength);
        if (tooLongWords.length > 0) {
            showWarning(`Please enter words with ${maxLength} letters or fewer`);
            return false;
        }

        // Remove any existing warning if validation passes
        clearWarning();

        return true;
    }

    function createEmptyGrid(size) {
        const grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            for (let j = 0; j < size; j++) {
                grid[i][j] = '';
            }
        }
        return grid;
    }

    function getDirections() {
        const directions = [
            [0, 1],   // right
            [1, 0],   // down
        ];

        if (diagonalWords.checked) {
            directions.push(
                [1, 1],   // diagonal down-right
                [-1, 1],  // diagonal up-right
            );
        }

        if (reverseWords.checked) {
            const reverseDirections = directions.map(([dx, dy]) => [-dx, -dy]);
            directions.push(...reverseDirections);
        }

        return directions;
    }

    function placeWords(grid, words) {
        const positions = [];
        const gridSize = grid.length;
        const directions = getDirections();
        
        for (const word of words) {
            let placed = false;
            let wordPositions = [];
            
            // Try all possible positions
            for (let attempts = 0; attempts < 300 && !placed; attempts++) {
                const startX = Math.floor(Math.random() * gridSize);
                const startY = Math.floor(Math.random() * gridSize);
                
                // Try directions in random order so all directions are used equally
                const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
                for (const [dx, dy] of shuffledDirs) {
                    if (canPlaceWord(grid, word, startX, startY, [dx, dy])) {
                        wordPositions = placeWord(grid, word, startX, startY, [dx, dy]);
                        placed = true;
                        break;
                    }
                }
            }
            
            if (!placed) {
                return [false, []];
            }
            
            positions.push(wordPositions);
        }
        
        return [true, positions];
    }

    function canPlaceWord(grid, word, startX, startY, [dx, dy]) {
        const size = grid.length;
        const length = word.length;

        // Check if word fits within grid bounds
        if (startX + dx * (length - 1) < 0 || startX + dx * (length - 1) >= size ||
            startY + dy * (length - 1) < 0 || startY + dy * (length - 1) >= size) {
            return false;
        }

        // Check if path is clear or matches existing letters
        for (let i = 0; i < length; i++) {
            const x = startX + dx * i;
            const y = startY + dy * i;
            if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
                return false;
            }
        }

        return true;
    }

    function placeWord(grid, word, startX, startY, [dx, dy]) {
        const positions = [];
        for (let i = 0; i < word.length; i++) {
            const x = startX + (dx * i);
            const y = startY + (dy * i);
            grid[y][x] = word[i];
            positions.push({ row: y, col: x });
        }
        return positions;
    }

    function fillEmptySpaces(grid, useFixed = true) {
        const gridSize = grid.length;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] === '') {
                    if (useFixed && fixedLetters[gridSize] && fixedLetters[gridSize][y] && fixedLetters[gridSize][y][x]) {
                        let letter = fixedLetters[gridSize][y][x];
                        grid[y][x] = uppercaseWords.checked ? letter.toUpperCase() : letter.toLowerCase();
                    } else {
                        const randomIndex = Math.floor(Math.random() * letters.length);
                        let letter = letters[randomIndex];
                        grid[y][x] = uppercaseWords.checked ? letter : letter.toLowerCase();
                    }
                }
            }
        }
        return grid;
    }

    function displayPuzzle(grid, words = [], answers = []) {
        // Store current state
        currentGrid = grid;
        currentWords = words;
        currentAnswers = answers;

        let html = '';
        
        // Add header section with logo and student info
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

        // Add title (default or custom)
        const titleText1 = worksheetTitle.value.trim() || 'Word Search';
        const titleVisible1 = !showTitle || showTitle.checked;
        html += `<div class="puzzle-title" style="visibility:${titleVisible1 ? 'visible' : 'hidden'}">${titleText1}</div>`;

        // Add puzzle grid with data attributes for row and column
        html += `<div class="puzzle-grid level-${selectedLevel}">`;
        for (let y = 0; y < grid.length; y++) {
            html += '<div class="puzzle-row">';
            for (let x = 0; x < grid[y].length; x++) {
                // Check if this cell is part of an answer
                let cellClasses = ['puzzle-cell'];
                let cellAttributes = `data-row="${y}" data-col="${x}"`;
                
                html += `<div class="${cellClasses.join(' ')}" ${cellAttributes}>${grid[y][x]}</div>`;
            }
            html += '</div>';
        }
        html += '</div>';

        // Add word list section with display style based on checkbox
        html += `<div class="word-list" style="display: ${showWordList.checked ? 'block' : 'none'}">`;
        html += '<h3>Find these words:</h3>';
        html += '<ul>';
        for (const word of words) {
            html += `<li>${word}</li>`;
        }
        html += '</ul>';
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        if (answerMode) showAnswers();
    }

    function printPuzzle() {
        window.print();
    }

    // Listen for print-related events
    window.addEventListener('beforeprint', function() {
        // No need to manipulate styles here, CSS will handle it
    });

    window.addEventListener('afterprint', function() {
        // No need to manipulate styles here, CSS will handle it
    });

    // Add this function to toggle answers visibility
    function toggleAnswers() {
        answerMode = !answerMode;
        const answerBtn = document.querySelector('.answer-btn');
        
        if (answerMode) {
            answerBtn.classList.add('active');
            showAnswers();
        } else {
            answerBtn.classList.remove('active');
            hideAnswers();
        }
    }

    // Add these helper functions
    function showAnswers() {
        if (!currentAnswers || currentAnswers.length === 0) return;
        const puzzleGrid = document.querySelector('.puzzle-grid');
        if (!puzzleGrid) return;

        currentAnswers.forEach((answer, ai) => {
            const color = ANSWER_COLORS[ai % ANSWER_COLORS.length];
            answer.positions.forEach(pos => {
                const cell = puzzleGrid.querySelector(`.puzzle-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
                if (cell) {
                    cell.style.color = color;
                    cell.style.fontWeight = 'bold';
                }
            });
        });
    }

    function hideAnswers() {
        document.querySelectorAll('.puzzle-cell').forEach(cell => {
            cell.style.color = '';
            cell.style.fontWeight = '';
            cell.classList.remove('answer-highlight');
        });
    }

    // Add new function for random puzzle generation
    function getRandomWords() {
        const wordLists = {
            easy: ['CAT', 'DOG', 'HAT', 'BAT', 'RAT', 'MAT', 'SAT', 'PAT', 'FAT', 'CAP'],
            medium: ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HOUSE',
                     'JUICE', 'KNIFE', 'LEMON', 'MANGO', 'NIGHT', 'OCEAN', 'PIANO'],
            hard: ['AMAZING', 'BICYCLE', 'CAPTAIN', 'DOLPHIN', 'ELEPHANT', 'FANTASY',
                   'GARDEN', 'HARMONY', 'ISLAND', 'JOURNEY', 'KITCHEN', 'LANTERN',
                   'MONSTER', 'NETWORK', 'ORBITAL', 'PYRAMID', 'QUANTUM', 'RAINBOW',
                   'STUDENT', 'THUNDER']
        };

        let difficulty;
        switch(selectedLevel) {
            case '1': difficulty = 'easy';   break;
            case '2': difficulty = 'medium'; break;
            default:  difficulty = 'hard';
        }

        const availableWords = wordLists[difficulty];
        const numWords = getMaxWords(); // Use the level's maximum word count
        const selectedWords = [];

        // Shuffle a copy and take the first numWords
        const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
        for (const word of shuffled) {
            if (selectedWords.length >= numWords) break;
            selectedWords.push(word);
        }

        return selectedWords;
    }

    function generateRandomPuzzle() {
        const words = getRandomWords().map(word => 
            uppercaseWords.checked ? word.toUpperCase() : word.toLowerCase()
        );
        
        if (!words || words.length === 0) {
            showWarning('Failed to generate random words');
            return;
        }

        const gridSize = getGridSize(selectedLevel);
        const grid = createEmptyGrid(gridSize);
        
        // Place words and store their positions
        const [success, wordPositions] = placeWords(grid, words);
        if (!success) {
            showWarning('Failed to place all words in the puzzle');
            return;
        }

        fillEmptySpaces(grid);

        // Apply case setting to the entire grid
        const finalGrid = grid.map(row =>
            row.map(cell =>
                uppercaseWords.checked ? cell.toUpperCase() : cell.toLowerCase()
            )
        );
        
        // Store current state and display puzzle
        currentGrid = finalGrid;
        currentWords = words;
        currentAnswers = wordPositions.map((positions, index) => ({
            word: words[index],
            positions: positions
        }));
        displayPuzzle(finalGrid, words, currentAnswers);
        
        // Update vocab list with random words
        vocabList.value = words.join('\n');
        printBtn.disabled = false;
    }

    function updateCase() {
        if (!currentGrid) {
            generateEmptyPuzzle();
            return;
        }

        const newGrid = currentGrid.map(row => 
            row.map(cell => 
                uppercaseWords.checked ? cell.toUpperCase() : cell.toLowerCase()
            )
        );

        const newWords = currentWords.map(word => 
            uppercaseWords.checked ? word.toUpperCase() : word.toLowerCase()
        );

        displayPuzzle(newGrid, newWords, currentAnswers);
    }
}); 