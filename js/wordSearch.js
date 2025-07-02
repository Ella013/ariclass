// Add these variables at the top of the file, outside any function
let answerMode = false;
let currentAnswers = [];

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
            console.log('Level changed to:', selectedLevel);
            generateEmptyPuzzle();
        });
    });

    // Initialize with one word input
    addWordInput();

    // Generate empty puzzle on page load
    generateEmptyPuzzle();

    // Event Listeners
    generateBtn.addEventListener('click', generatePuzzle);
    randomGenerateBtn.addEventListener('click', generateRandomPuzzle);
    printBtn.addEventListener('click', printPuzzle);
    if (addWordBtn) {
        addWordBtn.addEventListener('click', clearAll);
    }
    
    // Add event listeners for case change
    uppercaseWords.addEventListener('change', generateEmptyPuzzle);
    lowercaseWords.addEventListener('change', generateEmptyPuzzle);

    // Add case toggle button listener
    caseToggleBtn.addEventListener('click', function() {
        if (uppercaseWords.checked) {
            lowercaseWords.checked = true;
        } else {
            uppercaseWords.checked = true;
        }
        generateEmptyPuzzle();
    });

    // Logo image upload handlers
    headerImage.addEventListener('change', function(e) {
        handleImageUpload(e, 'header');
    });

    footerImage.addEventListener('change', function(e) {
        handleImageUpload(e, 'footer');
    });

    // Text input handlers
    headerText.addEventListener('input', updatePreview);
    footerText.addEventListener('input', updatePreview);

    // Add keyboard event listener to vocab list
    vocabList.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const currentInput = e.target;
            const word = currentInput.value.trim();

            if (word !== '') {
                if (vocabList.children.length < 10) {
                    addWordInput();
                }
            }
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

        // Add title
        html += '<div class="puzzle-title">Word Search</div>';

        // Add puzzle grid with level class and data attributes
        html += `<div class="puzzle-grid level-${selectedLevel}">`;
        for (let y = 0; y < grid.length; y++) {
            html += '<div class="puzzle-row">';
            for (let x = 0; x < grid[y].length; x++) {
                let cellClasses = ['puzzle-cell'];
                let cellAttributes = `data-row="${y}" data-col="${x}"`;
                
                if (answerMode && currentAnswers && currentAnswers.length > 0) {
                    for (let answer of currentAnswers) {
                        const isPartOfWord = answer.positions.some(pos => pos.row === y && pos.col === x);
                        if (isPartOfWord) {
                            cellClasses.push('answer-highlight');
                        }
                    }
                }
                
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
        if (wordCount >= 10) {
            alert('Maximum 10 words allowed');
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
            .slice(0, 10); // Maximum 10 words
            
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

    function validateWords() {
        const words = getWords();
        const maxLength = getMaxWordLength();
        
        // Check word count
        if (words.length > 10) {
            showWarning('Maximum 10 words allowed. Please remove some words.');
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

    function generatePuzzle() {
        const words = getWords();
        if (!validateWords()) return;

        // Create puzzle grid
        const gridSize = getGridSize(selectedLevel);
        const grid = createEmptyGrid(gridSize);
        
        // Initialize answers array
        const answers = [];
        
        // Fixed starting positions and directions for each word
        const fixedPlacements = [
            { direction: [0, 1], startPos: { x: 1, y: 1 } },  // horizontal right
            { direction: [1, 0], startPos: { x: 2, y: 0 } },  // vertical down
            { direction: [1, 1], startPos: { x: 0, y: 0 } },  // diagonal down-right
            { direction: [-1, 1], startPos: { x: gridSize-1, y: 0 } },  // diagonal up-right
            { direction: [0, -1], startPos: { x: gridSize-2, y: 2 } },  // horizontal left
            { direction: [-1, 0], startPos: { x: 3, y: gridSize-1 } },  // vertical up
            { direction: [-1, -1], startPos: { x: gridSize-1, y: gridSize-1 } },  // diagonal up-left
            { direction: [1, -1], startPos: { x: 0, y: gridSize-1 } },  // diagonal down-left
            { direction: [0, 1], startPos: { x: 2, y: 3 } },  // another horizontal right
            { direction: [1, 0], startPos: { x: 4, y: 2 } }   // another vertical down
        ];

        // Place words using fixed positions
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let placed = false;
            let currentPlacementIndex = i % fixedPlacements.length;
            
            while (!placed) {
                const placement = fixedPlacements[currentPlacementIndex];
                const { direction, startPos } = placement;

                if (canPlaceWord(grid, word, startPos.x, startPos.y, direction)) {
                    const positions = [];
                    for (let j = 0; j < word.length; j++) {
                        const x = startPos.x + direction[0] * j;
                        const y = startPos.y + direction[1] * j;
                        positions.push({
                            row: y,
                            col: x
                        });
                        grid[y][x] = word[j];
                    }
                    answers.push({
                        word: word,
                        positions: positions
                    });
                    placed = true;
                } else {
                    // Try next placement
                    currentPlacementIndex = (currentPlacementIndex + 1) % fixedPlacements.length;
                    
                    // If we've tried all fixed placements, try random positions with the same direction
                    if (currentPlacementIndex === i % fixedPlacements.length) {
                        const randomX = Math.floor(Math.random() * gridSize);
                        const randomY = Math.floor(Math.random() * gridSize);
                        if (canPlaceWord(grid, word, randomX, randomY, direction)) {
                            const positions = [];
                            for (let j = 0; j < word.length; j++) {
                                const x = randomX + direction[0] * j;
                                const y = randomY + direction[1] * j;
                                positions.push({
                                    row: y,
                                    col: x
                                });
                                grid[y][x] = word[j];
                            }
                            answers.push({
                                word: word,
                                positions: positions
                            });
                            placed = true;
                        }
                    }
                }
            }
        }

        fillEmptySpaces(grid, true);  // Use fixed letters
        currentAnswers = answers;
        
        displayPuzzle(grid, words, answers);
        printBtn.disabled = false;
    }

    function validateWord(word) {
        const maxLength = getMaxWordLength();
        if (word.length > maxLength) {
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
        const size = grid.length;
        const placedWords = [];
        const directions = getDirections();

        // Sort words by length (longest first)
        words.sort((a, b) => b.length - a.length);

        for (let word of words) {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startX = Math.floor(Math.random() * size);
                const startY = Math.floor(Math.random() * size);

                if (canPlaceWord(grid, word, startX, startY, direction)) {
                    placeWord(grid, word, startX, startY, direction);
                    placedWords.push(word);
                    placed = true;
                }

                attempts++;
            }

            if (!placed) {
                return placedWords; // Return partial list of placed words
            }
        }

        return placedWords;
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
        for (let i = 0; i < word.length; i++) {
            const x = startX + dx * i;
            const y = startY + dy * i;
            grid[y][x] = word[i];
        }
    }

    function fillEmptySpaces(grid, useFixed = true) {
        const gridSize = grid.length;
        const letters = uppercaseWords.checked ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
        
        if (useFixed) {
            const fixedGrid = fixedLetters[gridSize.toString()];
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (grid[y][x] === '') {
                        grid[y][x] = uppercaseWords.checked ? fixedGrid[y][x] : fixedGrid[y][x].toLowerCase();
                    }
                }
            }
        } else {
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (grid[y][x] === '') {
                        grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                    }
                }
            }
        }
    }

    function displayPuzzle(grid, words = [], answers = []) {
        // Update currentAnswers before generating HTML
        currentAnswers = answers;
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

        // Add title (default or custom)
        const title = worksheetTitle.value.trim() || 'Word Search';
        html += `<div class="puzzle-title">${title}</div>`;

        // Add puzzle grid with data attributes for row and column
        html += `<div class="puzzle-grid level-${selectedLevel}">`;
        for (let y = 0; y < grid.length; y++) {
            html += '<div class="puzzle-row">';
            for (let x = 0; x < grid[y].length; x++) {
                // Check if this cell is part of an answer
                let cellClasses = ['puzzle-cell'];
                let cellAttributes = `data-row="${y}" data-col="${x}"`;
                
                if (answerMode && currentAnswers && currentAnswers.length > 0) {
                    for (let answer of currentAnswers) {
                        const isPartOfWord = answer.positions.some(pos => pos.row === y && pos.col === x);
                        if (isPartOfWord) {
                            cellClasses.push('answer-highlight');
                        }
                    }
                }
                
                html += `<div class="${cellClasses.join(' ')}" ${cellAttributes}>${grid[y][x]}</div>`;
            }
            html += '</div>';
        }
        html += '</div>';

        if (showWordList.checked && words.length > 0) {
            html += '<div class="word-list">';
            html += '<h3>Find these words:</h3>';
            html += '<ul>';
            for (let word of words) {
                html += `<li>${word}</li>`;
            }
            html += '</ul>';
            html += '</div>';
        }

        puzzlePreview.innerHTML = html;
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
        console.log('Showing answers:', currentAnswers); // Debug log
        if (currentAnswers && currentAnswers.length > 0) {
            const puzzleGrid = document.querySelector('.puzzle-grid');
            if (!puzzleGrid) return;

            currentAnswers.forEach(answer => {
                answer.positions.forEach(pos => {
                    const cell = puzzleGrid.querySelector(`.puzzle-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
                    if (cell) {
                        cell.classList.add('answer-highlight');
                    }
                });
            });
        }
    }

    function hideAnswers() {
        document.querySelectorAll('.puzzle-cell.answer-highlight').forEach(cell => {
            cell.classList.remove('answer-highlight');
        });
    }

    // Add new function for random puzzle generation
    function generateRandomPuzzle() {
        const randomWords = getRandomWords();
        if (!validateWords(randomWords)) return;
        
        // Set the random words to the input
        const wordList = document.getElementById('word-list');
        wordList.value = randomWords.join('\n');
        
        // Generate the puzzle with these words
        generatePuzzle();
    }
}); 