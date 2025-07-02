document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const addWordBtn = document.getElementById('add-word-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const wordClueContainer = document.querySelector('.word-clue-container');
    const showNumbers = document.getElementById('show-numbers');
    const showGrid = document.getElementById('show-grid');
    const separateAnswerKey = document.getElementById('separate-answer-key');
    let currentPuzzle = null;

    // Initialize with one empty word-clue pair
    addWordCluePair();

    // Event Listeners
    addWordBtn.addEventListener('click', addWordCluePair);
    clearAllBtn.addEventListener('click', clearAll);
    generateBtn.addEventListener('click', generatePuzzle);
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', updatePreview);

    // Show initial preview
    displayEmptyPreview();

    // Add word-clue pair
    function addWordCluePair() {
        const pair = document.createElement('div');
        pair.className = 'word-clue-pair';
        pair.innerHTML = `
            <input type="text" class="word-input-field" placeholder="Enter word">
            <input type="text" class="clue-input-field" placeholder="Enter clue">
            <button class="remove-pair"><i class="fas fa-times"></i></button>
        `;

        // Add event listener to remove button
        pair.querySelector('.remove-pair').addEventListener('click', function() {
            if (document.querySelectorAll('.word-clue-pair').length > 1) {
                pair.remove();
            }
        });

        // Add event listener to word input for uppercase
        pair.querySelector('.word-input-field').addEventListener('input', function(e) {
            this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
        });

        wordClueContainer.appendChild(pair);
    }

    // Display empty preview
    function displayEmptyPreview() {
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

        // Add title if enabled
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Create a sample crossword layout (similar to the image)
        const gridSize = 15;
        const sampleLayout = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
        
        // Define the visible cells (1 means visible, null means blocked)
        // First word (horizontal)
        sampleLayout[0][0] = '1';
        sampleLayout[0][1] = 1;
        sampleLayout[0][2] = 1;
        
        // Second word (vertical)
        sampleLayout[0][0] = '2';
        sampleLayout[1][0] = 1;
        
        // Third word (horizontal)
        sampleLayout[1][0] = '3';
        sampleLayout[1][1] = 1;
        sampleLayout[1][2] = 1;
        sampleLayout[1][3] = 1;
        sampleLayout[1][4] = 1;
        
        // Fourth word (vertical)
        sampleLayout[2][3] = '4';
        sampleLayout[3][3] = 1;
        
        // Fifth word (horizontal)
        sampleLayout[3][0] = '5';
        sampleLayout[3][1] = 1;
        sampleLayout[3][2] = 1;
        sampleLayout[3][3] = 1;
        sampleLayout[3][4] = 1;
        sampleLayout[3][5] = 1;
        sampleLayout[3][6] = 1;

        // Add puzzle grid with the sample layout
        html += '<div class="crossword-grid" style="grid-template-columns: repeat(8, 2rem);">';
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 8; x++) {
                const cell = sampleLayout[y] && sampleLayout[y][x];
                if (cell === undefined) continue;
                
                const cellClass = cell === null ? 'cell-blocked' : 'crossword-cell';
                const numberHtml = typeof cell === 'string' ? `<span class="cell-number">${cell}</span>` : '';
                html += `<div class="${cellClass}">${numberHtml}</div>`;
            }
        }
        html += '</div>';

        // Add clue lists
        html += '<div class="clue-lists">';
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<ul class="clue-list">';
        html += '<li class="clue-item"><span class="clue-number">1.</span>Enter your words and clues to generate a crossword puzzle</li>';
        html += '</ul>';
        html += '</div>';
        
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<ul class="clue-list">';
        html += '<li class="clue-item"><span class="clue-number">1.</span>Enter your words and clues to generate a crossword puzzle</li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';

        puzzlePreview.innerHTML = html;
        printBtn.disabled = true;
    }

    // Clear all word-clue pairs
    function clearAll() {
        wordClueContainer.innerHTML = '';
        addWordCluePair();
        displayEmptyPreview();
    }

    // Get puzzle size
    function getPuzzleSize() {
        const sizeRadios = document.querySelectorAll('input[name="puzzle-size"]');
        for (const radio of sizeRadios) {
            if (radio.checked) {
                switch (radio.value) {
                    case 'small': return 10;
                    case 'medium': return 15;
                    case 'large': return 20;
                    default: return 15;
                }
            }
        }
        return 15; // Default size
    }

    // Get words and clues
    function getWordsAndClues() {
        const pairs = document.querySelectorAll('.word-clue-pair');
        const wordsAndClues = [];

        pairs.forEach(pair => {
            const word = pair.querySelector('.word-input-field').value.trim();
            const clue = pair.querySelector('.clue-input-field').value.trim();
            if (word && clue) {
                wordsAndClues.push({ word, clue });
            }
        });

        return wordsAndClues;
    }

    // Generate crossword puzzle
    function generatePuzzle() {
        const wordsAndClues = getWordsAndClues();
        
        if (wordsAndClues.length < 2) {
            alert('Please enter at least 2 words and their clues.');
            return;
        }

        const size = getPuzzleSize();
        currentPuzzle = new CrosswordPuzzle(size, wordsAndClues);
        currentPuzzle.generate();

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

        // Add title if enabled
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add puzzle grid
        html += currentPuzzle.generateHTML(showNumbers.checked, showGrid.checked, false);

        // Add clue lists
        html += '<div class="clue-lists">';
        
        // Across clues
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<ul class="clue-list">';
        currentPuzzle.acrossClues.forEach(clue => {
            html += `<li class="clue-item"><span class="clue-number">${clue.number}.</span>${clue.clue}</li>`;
        });
        html += '</ul>';
        html += '</div>';

        // Down clues
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<ul class="clue-list">';
        currentPuzzle.downClues.forEach(clue => {
            html += `<li class="clue-item"><span class="clue-number">${clue.number}.</span>${clue.clue}</li>`;
        });
        html += '</ul>';
        html += '</div>';
        html += '</div>';

        // Add answer key only if enabled and as a new page
        if (separateAnswerKey.checked) {
            html += '<div class="answer-sheet page-break">';
            html += '<div class="answer-sheet-title">Answer Key</div>';
            html += currentPuzzle.generateHTML(showNumbers.checked, showGrid.checked, true);
            html += '</div>';
        }

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    // Update preview
    function updatePreview() {
        if (!currentPuzzle) return;

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

        // Add title if enabled
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add puzzle grid
        html += currentPuzzle.generateHTML(showNumbers.checked, showGrid.checked, false);

        // Add clue lists
        html += '<div class="clue-lists">';
        
        // Across clues
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<ul class="clue-list">';
        currentPuzzle.acrossClues.forEach(clue => {
            html += `<li class="clue-item"><span class="clue-number">${clue.number}.</span>${clue.clue}</li>`;
        });
        html += '</ul>';
        html += '</div>';

        // Down clues
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<ul class="clue-list">';
        currentPuzzle.downClues.forEach(clue => {
            html += `<li class="clue-item"><span class="clue-number">${clue.number}.</span>${clue.clue}</li>`;
        });
        html += '</ul>';
        html += '</div>';
        html += '</div>';

        // Add answer key if enabled
        if (separateAnswerKey.checked) {
            html += '<div class="answer-sheet">';
            html += '<div class="answer-sheet-title">Answer Key</div>';
            html += currentPuzzle.generateHTML(showNumbers.checked, showGrid.checked, true);
            html += '</div>';
        }

        puzzlePreview.innerHTML = html;
    }

    // Print worksheet
    function printWorksheet() {
        const showAnswers = document.getElementById('showAnswers').checked;
        const content = document.getElementById('worksheetContent');
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Copy the current stylesheet links
        const stylesheets = document.getElementsByTagName('link');
        let styleLinks = '';
        for (let i = 0; i < stylesheets.length; i++) {
            if (stylesheets[i].rel === 'stylesheet') {
                styleLinks += stylesheets[i].outerHTML;
            }
        }
        
        // Generate the content with or without answers
        const crosswordPuzzle = new CrosswordPuzzle(/* your parameters here */);
        const puzzleHTML = crosswordPuzzle.generateHTML(true, true, showAnswers);
        
        // Set the content of the print window
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Crossword Puzzle</title>
                ${styleLinks}
                <style>
                    @media print {
                        @page {
                            margin: 1cm;
                        }
                    }
                </style>
            </head>
            <body>
                ${content.innerHTML}
            </body>
            </html>
        `);
        
        // Wait for stylesheets to load then print
        printWindow.document.addEventListener('load', () => {
            printWindow.print();
            printWindow.close();
        }, true);
    }
});

// Crossword Puzzle Class
class CrosswordPuzzle {
    constructor(size, wordsAndClues) {
        this.size = size;
        this.wordsAndClues = wordsAndClues;
        this.grid = Array(size).fill().map(() => Array(size).fill(null));
        this.acrossClues = [];
        this.downClues = [];
        this.usedWords = new Set();
    }

    generate() {
        // Sort words by length (longest first)
        this.wordsAndClues.sort((a, b) => b.word.length - a.word.length);

        // Place first word horizontally in the middle
        if (this.wordsAndClues.length > 0) {
            const firstWord = this.wordsAndClues[0];
            const middleY = Math.floor(this.size / 2);
            const startX = Math.floor((this.size - firstWord.word.length) / 2);
            this.placeWord(firstWord.word, firstWord.clue, startX, middleY, true);
        }

        // Try to place remaining words by finding intersections
        for (let i = 1; i < this.wordsAndClues.length; i++) {
            const { word, clue } = this.wordsAndClues[i];
            if (!this.usedWords.has(word)) {
                let placed = false;
                
                // Try to find intersections with already placed words
                for (let y = 0; y < this.size && !placed; y++) {
                    for (let x = 0; x < this.size && !placed; x++) {
                        if (this.grid[y][x] !== null) {
                            const letter = this.grid[y][x];
                            
                            // Check if current word contains this letter
                            const letterIndex = word.indexOf(letter);
                            if (letterIndex !== -1) {
                                // Try placing vertically if the intersecting word is horizontal
                                if (this.isHorizontalWord(x, y)) {
                                    const startY = y - letterIndex;
                                    if (this.canPlaceWord(word, x, startY, false)) {
                                        this.placeWord(word, clue, x, startY, false);
                                        placed = true;
                                    }
                                }
                                // Try placing horizontally if the intersecting word is vertical
                                else if (this.isVerticalWord(x, y)) {
                                    const startX = x - letterIndex;
                                    if (this.canPlaceWord(word, startX, y, true)) {
                                        this.placeWord(word, clue, startX, y, true);
                                        placed = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Trim the grid to remove empty space
        this.trimGrid();
    }

    isHorizontalWord(x, y) {
        // Check if part of a horizontal word
        return (x > 0 && this.grid[y][x-1] !== null) || 
               (x < this.size-1 && this.grid[y][x+1] !== null);
    }

    isVerticalWord(x, y) {
        // Check if part of a vertical word
        return (y > 0 && this.grid[y-1][x] !== null) || 
               (y < this.size-1 && this.grid[y+1][x] !== null);
    }

    canPlaceWord(word, startX, startY, across) {
        // Check if out of bounds
        if (startX < 0 || startY < 0) return false;
        if (across && startX + word.length > this.size) return false;
        if (!across && startY + word.length > this.size) return false;

        let hasIntersection = this.usedWords.size === 0;  // First word doesn't need intersection
        
        // Check each position
        for (let i = 0; i < word.length; i++) {
            const x = across ? startX + i : startX;
            const y = across ? startY : startY + i;
            const currentCell = this.grid[y][x];

            // Check if cell is empty or matches the letter
            if (currentCell !== null) {
                if (currentCell !== word[i]) return false;
                hasIntersection = true;
            } else {
                // Check adjacent cells (perpendicular to word direction)
                if (across) {
                    if (y > 0 && this.grid[y-1][x] !== null) return false;
                    if (y < this.size-1 && this.grid[y+1][x] !== null) return false;
                } else {
                    if (x > 0 && this.grid[y][x-1] !== null) return false;
                    if (x < this.size-1 && this.grid[y][x+1] !== null) return false;
                }
            }

            // Check for words running parallel
            if (across) {
                if (i === 0 && x > 0 && this.grid[y][x-1] !== null) return false;
                if (i === word.length-1 && x < this.size-1 && this.grid[y][x+1] !== null) return false;
            } else {
                if (i === 0 && y > 0 && this.grid[y-1][x] !== null) return false;
                if (i === word.length-1 && y < this.size-1 && this.grid[y+1][x] !== null) return false;
            }
        }

        return hasIntersection;
    }

    placeWord(word, clue, startX, startY, across) {
        const number = this.getNextNumber();
        
        // Place the word
        for (let i = 0; i < word.length; i++) {
            const x = across ? startX + i : startX;
            const y = across ? startY : startY + i;
            this.grid[y][x] = word[i];
        }

        // Add clue to appropriate list
        if (across) {
            this.acrossClues.push({ number, clue, word });
        } else {
            this.downClues.push({ number, clue, word });
        }

        this.usedWords.add(word);
    }

    trimGrid() {
        let minX = this.size, minY = this.size, maxX = 0, maxY = 0;

        // Find the bounds of used cells
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x] !== null) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        // Add padding
        minX = Math.max(0, minX - 1);
        minY = Math.max(0, minY - 1);
        maxX = Math.min(this.size - 1, maxX + 1);
        maxY = Math.min(this.size - 1, maxY + 1);

        // Create new trimmed grid
        const newGrid = [];
        for (let y = minY; y <= maxY; y++) {
            const row = [];
            for (let x = minX; x <= maxX; x++) {
                row.push(this.grid[y][x]);
            }
            newGrid.push(row);
        }
        this.grid = newGrid;
    }

    generateHTML(showNumbers, showGrid, showAnswers) {
        const width = this.grid[0].length;
        let html = `<div class="crossword-grid">`;
        
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cell = this.grid[y][x];
                if (cell === null) continue; // Skip empty cells
                
                const number = this.getCellNumber(x, y);
                const numberHtml = showNumbers && number ? `<span class="cell-number">${number}</span>` : '';
                const letter = showAnswers ? cell : '';
                
                html += `
                    <div class="crossword-cell" style="grid-column: ${x + 1}; grid-row: ${y + 1};">
                        ${numberHtml}
                        <span class="cell-letter">${letter}</span>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }

    getCellNumber(x, y) {
        // A cell gets a number if it's the start of an across or down word
        const cell = this.grid[y][x];
        if (cell === null) return null;

        // Check if it's the start of an across word
        const isAcrossStart = (x === 0 || this.grid[y][x-1] === null) &&
                            (x < this.grid[y].length-1 && this.grid[y][x+1] !== null);

        // Check if it's the start of a down word
        const isDownStart = (y === 0 || this.grid[y-1][x] === null) &&
                          (y < this.grid.length-1 && this.grid[y+1][x] !== null);

        if (isAcrossStart || isDownStart) {
            // Find the corresponding clue number
            const number = this.acrossClues.find(c => c.word[0] === cell)?.number ||
                         this.downClues.find(c => c.word[0] === cell)?.number;
            return number;
        }

        return null;
    }

    getNextNumber() {
        return Math.max(
            0,
            ...this.acrossClues.map(c => c.number),
            ...this.downClues.map(c => c.number)
        ) + 1;
    }
} 