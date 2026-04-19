var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const generateRandomBtn = document.getElementById('generate-random-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const addWordBtn = document.getElementById('add-word-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const wordClueContainer = document.querySelector('.word-clue-container');
    const answerBtn = document.querySelector('.answer-btn');
    let showingAnswers = false;
    let currentPuzzle = null;

    // Initialize with five empty word-clue pairs
    for (let i = 0; i < 5; i++) {
        addWordCluePair();
    }

    function resetAnswerBtn() {
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> ' + _showTxt;
    }

    // Event Listeners
    addWordBtn.addEventListener('click', addWordCluePair);
    clearAllBtn.addEventListener('click', () => { resetAnswerBtn(); clearAll(); });
    generateBtn.addEventListener('click', () => { resetAnswerBtn(); generatePuzzle(); });
    generateRandomBtn.addEventListener('click', () => { resetAnswerBtn(); generateRandomPuzzle(); });
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', updatePreview);

    // Add Show Answers button event listener
    answerBtn.addEventListener('click', function() {
        if (!currentPuzzle) return;
        showingAnswers = !showingAnswers;
        
        // Update button text
        this.innerHTML = showingAnswers ? 
            '<i class="fas fa-eye-slash"></i> ' + _hideTxt :
            '<i class="fas fa-eye"></i> ' + _showTxt;
            
        // Update preview with or without answers
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
        const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // Add puzzle grid with or without answers
        html += currentPuzzle.generateHTML(true, true, showingAnswers);

        // Add clue lists
        html += '<div class="clue-lists">';
        
        // Across clues
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<div class="clue-list">';
        currentPuzzle.acrossClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        
        // Down clues
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<div class="clue-list">';
        currentPuzzle.downClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
    });


    
    // Reset button event listener
    const resetWordsBtn = document.getElementById('reset-words-btn');
    resetWordsBtn.addEventListener('click', function() {
        const wordsAndClues = getWordsAndClues();
        if (wordsAndClues.length >= 2) {
            resetAnswerBtn();
            generatePuzzle(true);
        }
    });

    // Random word lists for different categories
    const randomWords = {
        animals: ['LION', 'TIGER', 'ELEPHANT', 'GIRAFFE', 'MONKEY', 'ZEBRA', 'PENGUIN', 'KANGAROO'],
        colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN'],
        fruits: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO', 'PEACH', 'LEMON', 'CHERRY'],
        countries: ['KOREA', 'JAPAN', 'CHINA', 'AMERICA', 'FRANCE', 'SPAIN', 'ITALY', 'BRAZIL']
    };

    // Generate random puzzle
    function generateRandomPuzzle() {
        // Clear existing words
        wordClueContainer.innerHTML = '';

        // Select a random category
        const categories = Object.keys(randomWords);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = randomWords[randomCategory];

        // Shuffle words and select 5-8 random words
        const shuffledWords = words.sort(() => Math.random() - 0.5);
        const numWords = Math.floor(Math.random() * 4) + 5; // 5 to 8 words
        const selectedWords = shuffledWords.slice(0, numWords);

        // Add first word
        addWordCluePair();
        let pairs = document.querySelectorAll('.word-clue-pair');
        let firstPair = pairs[0];
        firstPair.querySelector('.word-input-field').value = selectedWords[0].toLowerCase();
        firstPair.querySelector('.clue-input-field').value = `Clue for ${selectedWords[0].toLowerCase()}`;

        // Add remaining words
        for (let i = 1; i < selectedWords.length; i++) {
            addWordCluePair();
            pairs = document.querySelectorAll('.word-clue-pair');
            const currentPair = pairs[pairs.length - 1];
            currentPair.querySelector('.word-input-field').value = selectedWords[i].toLowerCase();
            currentPair.querySelector('.clue-input-field').value = `Clue for ${selectedWords[i].toLowerCase()}`;
        }

        // Generate the puzzle
        generatePuzzle();
    }

    // Helper function to update remove button visibility
    function updateRemoveButtonVisibility() {
        const pairs = document.querySelectorAll('.word-clue-pair');
        if (pairs.length > 0) {
            pairs[0].querySelector('.remove-pair').style.visibility = 'hidden';
            for (let i = 1; i < pairs.length; i++) {
                pairs[i].querySelector('.remove-pair').style.visibility = 'visible';
            }
        }
    }

    // Show initial preview
    displayEmptyPreview();

    // Add word-clue pair
    function addWordCluePair() {
        const pair = document.createElement('div');
        pair.className = 'word-clue-pair';
        pair.innerHTML = `
            <input type="text" class="word-input-field" placeholder="Enter word" maxlength="15">
            <input type="text" class="clue-input-field" placeholder="Enter clue">
            <button class="remove-pair"><i class="fas fa-times"></i></button>
        `;

        // Add event listener to remove button and handle visibility
        const removeButton = pair.querySelector('.remove-pair');
        const allPairs = document.querySelectorAll('.word-clue-pair');
        
        // Hide remove button for the first pair
        if (allPairs.length === 0 || allPairs[0] === pair) {
            removeButton.style.visibility = 'hidden';
        }
        
        removeButton.addEventListener('click', function() {
            if (document.querySelectorAll('.word-clue-pair').length > 1) {
                pair.remove();
            }
        });

        // Add event listeners for word input
        const wordInput = pair.querySelector('.word-input-field');
        
        wordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                pair.querySelector('.clue-input-field').focus();
            }
        });

        pair.querySelector('.clue-input-field').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addWordCluePair();
                // Focus on the word input of the newly added pair
                const pairs = document.querySelectorAll('.word-clue-pair');
                const lastPair = pairs[pairs.length - 1];
                lastPair.querySelector('.word-input-field').focus();
            }
        });

        // Add event listener to clue input for validation
        const clueInput = pair.querySelector('.clue-input-field');
        clueInput.addEventListener('input', function(e) {
            // Allow any characters in clue, just trim whitespace
            this.value = this.value.trim();
        });

        wordClueContainer.appendChild(pair);
    }

    // Display empty preview
    function displayEmptyPreview() {
        // Generate a sample puzzle using random words
        const categories = Object.keys(randomWords);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = randomWords[randomCategory];
        const shuffledWords = words.sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, 5);
        const sampleWordsAndClues = selectedWords.map(word => ({
            word: word,
            clue: `Sample clue for ${word.toLowerCase()}`
        }));

        const samplePuzzle = new CrosswordPuzzle(15, sampleWordsAndClues);
        samplePuzzle.generate();
        currentPuzzle = samplePuzzle;  // Set the current puzzle to the sample puzzle

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

        // Add title if show-title is checked
        const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // Add the generated sample puzzle grid (without letters)
        html += samplePuzzle.generateHTML(true, true, false);

        // Add clue lists
        html += '<div class="clue-lists">';
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<div class="clue-list">';
        samplePuzzle.acrossClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<div class="clue-list">';
        samplePuzzle.downClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;  // Enable print button
    }

    // Clear all word-clue pairs
    function clearAll() {
        wordClueContainer.innerHTML = '';
        addWordCluePair();
        displayEmptyPreview();
    }

    // Get puzzle size
    function getPuzzleSize() {
        return 15; // Fixed size
    }

    // Get words and clues
    function getWordsAndClues() {
        const pairs = document.querySelectorAll('.word-clue-pair');
        const wordsAndClues = [];
        console.log('Found word-clue pairs:', pairs.length); // 디버깅용 로그

        pairs.forEach((pair, index) => {
            const wordInput = pair.querySelector('.word-input-field');
            const clueInput = pair.querySelector('.clue-input-field');
            
            if (!wordInput || !clueInput) {
                console.log(`Pair ${index}: Missing input fields`); // 디버깅용 로그
                return;
            }

            const word = wordInput.value.trim();
            const clue = clueInput.value.trim();
            
            console.log(`Pair ${index}: Word="${word}", Clue="${clue}"`); // 디버깅용 로그

            if (word && clue) {
                // Remove any spaces from the word
                const cleanWord = word.replace(/\s+/g, '').toUpperCase();
                if (cleanWord.length > 0) {
                    wordsAndClues.push({ word: cleanWord, clue });
                    console.log(`Added pair ${index}: Word="${cleanWord}", Clue="${clue}"`); // 디버깅용 로그
                }
            }
        });

        console.log('Final words and clues:', wordsAndClues); // 디버깅용 로그
        return wordsAndClues;
    }

    // Generate crossword puzzle
    function generatePuzzle(randomize = false) {
        console.log('Generate puzzle button clicked'); // 디버깅용 로그

        const wordsAndClues = getWordsAndClues();
        console.log('Words and clues:', wordsAndClues); // 디버깅용 로그
        
        if (wordsAndClues.length < 2) {
            alert('Please enter at least 2 words and their clues.');
            return;
        }

        // Check maximum word length against puzzle size
        const size = getPuzzleSize();
        console.log('Puzzle size:', size); // 디버깅용 로그
        
        const maxWordLength = Math.max(...wordsAndClues.map(wc => wc.word.length));
        console.log('Max word length:', maxWordLength); // 디버깅용 로그
        
        if (maxWordLength > size) {
            alert(`One or more words are too long for the selected puzzle size. Please choose a larger puzzle size or use shorter words. Maximum word length should be ${size} characters.`);
            return;
        }

        try {
            currentPuzzle = new CrosswordPuzzle(size, wordsAndClues, randomize);
            const success = currentPuzzle.generate();
            console.log('Puzzle generation success:', success); // 디버깅용 로그
            console.log('Placed words:', currentPuzzle.placedWords); // 디버깅용 로그

            if (!success) {
                alert('Could not generate puzzle with the given words. Try different words or a larger puzzle size.');
                return;
            }

            // Update the preview with the generated puzzle
            updatePreview();
            printBtn.disabled = false;
        } catch (error) {
            console.error('Error generating puzzle:', error);
            alert('Error generating puzzle. Please try different words or a different puzzle size.');
            return;
        }
    }

    // Update preview
    function updatePreview() {
        const puzzle = currentPuzzle;
        if (!puzzle) return;

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

        // Add title if show-title is checked
        const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
        html += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // Add puzzle grid
        html += puzzle.generateHTML(true, true, false);

        // Add clue lists
        html += '<div class="clue-lists">';
        
        // Across clues
        html += '<div class="across-clues">';
        html += '<div class="clue-list-title">Across:</div>';
        html += '<div class="clue-list">';
        puzzle.acrossClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        
        // Down clues
        html += '<div class="down-clues">';
        html += '<div class="clue-list-title">Down:</div>';
        html += '<div class="clue-list">';
        puzzle.downClues.sort((a, b) => a.number - b.number).forEach(clue => {
            html += `<div class="clue-item"><span class="clue-number">${clue.number}.</span> <span class="clue-text">${clue.clue}</span></div>`;
        });
        html += '</div>';
        html += '</div>';
        
        html += '</div>';

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    // Print worksheet
    function printWorksheet() {
        // Get the worksheet title or use default
        const title = worksheetTitle.value.trim() || 'Crossword Puzzle';
        
        // Store the original title
        const originalTitle = document.title;
        
        // Set the document title to worksheet title (this will be used as the default filename)
        document.title = title;
        
        // Print
        window.print();
        
        // Restore the original title
        document.title = originalTitle;
    }
});

// Crossword Puzzle Class
class CrosswordPuzzle {
    constructor(size, wordsAndClues, randomize = false) {
        this.size = size;
        this.wordsAndClues = wordsAndClues;
        this.randomize = randomize;
        this.grid = Array(size).fill().map(() => Array(size).fill(null));
        this.acrossClues = [];
        this.downClues = [];
        this.placedWords = [];
        this.usedWords = new Set();
        this.currentNumber = 1;
    }

    generate() {
        // Reset all data structures
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(null));
        this.acrossClues = [];
        this.downClues = [];
        this.placedWords = [];
        this.usedWords.clear();
        this.currentNumber = 1;

        // Sort words by length (longest first)
        this.wordsAndClues.sort((a, b) => b.word.length - a.word.length);

        // Place first word horizontally in the middle
        const firstWord = this.wordsAndClues[0];
        const middleY = Math.floor(this.size / 2);
        const startX = Math.floor((this.size - firstWord.word.length) / 2);

        if (!this.placeWord(firstWord.word, firstWord.clue, startX, middleY, true)) {
            console.error("Failed to place first word");
            return false;
        }

        // Try to place remaining words
        let placed;
        do {
            placed = false;
            for (const { word, clue } of this.wordsAndClues) {
                if (!this.usedWords.has(word)) {
                    if (this.tryPlaceWord(word, clue)) {
                        placed = true;
                    }
                }
            }
        } while (placed);

        // Try independent placement for remaining words
        for (const { word, clue } of this.wordsAndClues) {
            if (!this.usedWords.has(word)) {
                this.tryPlaceIndependentWord(word, clue);
            }
        }

        // Trim the grid if we have placed words
        if (this.placedWords.length > 0) {
            this.trimGrid();
            return true;
        }

        return false;
    }

    tryPlaceWord(word, clue) {
        let bestScore = -1;
        let bestPlacements = [];

        // Try all possible positions and directions
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                for (const across of [true, false]) {
                    if (this.canPlaceWord(word, x, y, across)) {
                        const score = this.calculatePlacementScore(word, x, y, across);
                        if (score > bestScore) {
                            bestScore = score;
                            bestPlacements = [{ x, y, across }];
                        } else if (score === bestScore && score >= 0) {
                            bestPlacements.push({ x, y, across });
                        }
                    }
                }
            }
        }

        if (bestPlacements.length > 0 && bestScore >= 0) {
            const chosen = this.randomize
                ? bestPlacements[Math.floor(Math.random() * bestPlacements.length)]
                : bestPlacements[0];
            return this.placeWord(word, clue, chosen.x, chosen.y, chosen.across);
        }
        return false;
    }

    tryPlaceIndependentWord(word, clue) {
        // 교차점 없이도 배치 가능한 빈 공간 찾기
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.canPlaceWord(word, x, y, true, false)) {
                    this.placeWord(word, clue, x, y, true, false);
                    return true;
                }
                if (this.canPlaceWord(word, x, y, false, false)) {
                    this.placeWord(word, clue, x, y, false, false);
                    return true;
                }
            }
        }
        return false;
    }

    calculatePlacementScore(word, startX, startY, across) {
        let score = 0;
        let intersections = 0;

        for (let i = 0; i < word.length; i++) {
            const x = across ? startX + i : startX;
            const y = across ? startY : startY + i;
            const letter = word[i];

            // Score intersections
            if (this.grid[y][x] === letter) {
                intersections++;
                score += 2;
            }
        }

        // First word gets a positive score
        if (this.placedWords.length === 0) {
            return 1;
        }

        // Return -1 if no intersections found (except for first word)
        return intersections > 0 ? score : -1;
    }

    canPlaceWord(word, startX, startY, across, requireIntersection = true) {
        // Check boundaries
        if (startX < 0 || startY < 0) return false;
        if (across && startX + word.length > this.size) return false;
        if (!across && startY + word.length > this.size) return false;

        let hasIntersection = false;

        // Check each letter position
        for (let i = 0; i < word.length; i++) {
            const x = across ? startX + i : startX;
            const y = across ? startY : startY + i;

            // Check if current cell is already filled
            if (this.grid[y][x] !== null) {
                // If letter doesn't match, invalid placement
                if (this.grid[y][x] !== word[i]) return false;
                hasIntersection = true;
                continue;
            }

            // Check adjacent cells (no touching words allowed except at intersection)
            if (across) {
                // Check cells above and below
                if (y > 0 && this.grid[y-1][x] !== null) return false;
                if (y < this.size-1 && this.grid[y+1][x] !== null) return false;
            } else {
                // Check cells to left and right
                if (x > 0 && this.grid[y][x-1] !== null) return false;
                if (x < this.size-1 && this.grid[y][x+1] !== null) return false;
            }
        }

        // Check word boundaries
        if (across) {
            // Check cell before word start
            if (startX > 0 && this.grid[startY][startX-1] !== null) return false;
            // Check cell after word end
            if (startX + word.length < this.size && this.grid[startY][startX + word.length] !== null) return false;
        } else {
            // Check cell before word start
            if (startY > 0 && this.grid[startY-1][startX] !== null) return false;
            // Check cell after word end
            if (startY + word.length < this.size && this.grid[startY + word.length][startX] !== null) return false;
        }

        // First word doesn't need intersection
        if (this.placedWords.length === 0) return true;

        return requireIntersection ? hasIntersection : true;
    }

    placeWord(word, clue, startX, startY, across, requireIntersection = true) {
        // Verify placement is valid
        if (!this.canPlaceWord(word, startX, startY, across, requireIntersection)) {
            return false;
        }

        // Check if there's already a number at this position
        let number = null;
        for (const existingWord of this.placedWords) {
            if (existingWord.startX === startX && existingWord.startY === startY) {
                number = existingWord.number;
                break;
            }
        }
        
        // If no existing number was found, get a new one
        if (number === null) {
            number = this.getNextNumber();
        }
        
        // Place the word
        for (let i = 0; i < word.length; i++) {
            const x = across ? startX + i : startX;
            const y = across ? startY : startY + i;
            this.grid[y][x] = word[i];
        }

        // Store word information
        const wordInfo = {
            word,
            clue,
            number,
            startX,
            startY,
            across
        };

        if (across) {
            this.acrossClues.push(wordInfo);
        } else {
            this.downClues.push(wordInfo);
        }

        this.placedWords.push(wordInfo);
        this.usedWords.add(word);
        
        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    generateHTML(showNumbers, showGrid, showAnswers) {
        const width = this.grid[0].length;
        let html = '<table class="crossword-table">';
        
        for (let y = 0; y < this.grid.length; y++) {
            html += '<tr>';
            for (let x = 0; x < this.grid[y].length; x++) {
                const cell = this.grid[y][x];
                if (cell === null) {
                    html += '<td class="cell-blocked"></td>';
                } else {
                    const number = this.getCellNumber(x, y);
                    const numberHtml = number ? `<span class="cell-number">${number}</span>` : '';
                    const letterHtml = showAnswers ? `<span class="cell-letter" style="color:red">${cell.toLowerCase()}</span>` : '';
                    html += `<td class="crossword-cell">${numberHtml}${letterHtml}</td>`;
                }
            }
            html += '</tr>';
        }
        
        html += '</table>';
        return html;
    }

    getCellNumber(x, y) {
        const wordInfo = this.placedWords.find(w => 
            (w.startX === x && w.startY === y)
        );
        return wordInfo ? wordInfo.number : null;
    }

    getNextNumber() {
        return this.currentNumber++;
    }

    trimGrid() {
        let minX = this.size, minY = this.size, maxX = 0, maxY = 0;

        // 사용된 셀의 경계 찾기
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

        // 여백 추가
        minX = Math.max(0, minX - 1);
        minY = Math.max(0, minY - 1);
        maxX = Math.min(this.size - 1, maxX + 1);
        maxY = Math.min(this.size - 1, maxY + 1);

        // 새로운 그리드 생성
        const newGrid = [];
        for (let y = minY; y <= maxY; y++) {
            const row = [];
            for (let x = minX; x <= maxX; x++) {
                row.push(this.grid[y][x]);
            }
            newGrid.push(row);
        }

        // 단어 위치 정보 업데이트
        this.placedWords.forEach(word => {
            word.startX -= minX;
            word.startY -= minY;
        });

        this.grid = newGrid;
    }
} 