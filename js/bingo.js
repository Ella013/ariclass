document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordInput = document.getElementById('wordInput');
    const resetWordsBtn = document.getElementById('reset-words-btn');
    if (resetWordsBtn) resetWordsBtn.addEventListener('click', shufflePreview);
    const randomGenerateBtn = document.getElementById('random-generate-btn');
    const boardSizeRadios = document.querySelectorAll('input[name="board-size"]');
    const generateBtn = document.getElementById('generate-btn');
    const previewArea = document.getElementById('puzzle-preview');
    const decreasePlayerBtn = document.getElementById('decreasePlayer');
    const increasePlayerBtn = document.getElementById('increasePlayer');
    const playerCountSpan = document.getElementById('playerCount');
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitleCheckbox = document.getElementById('show-title');
    const printBtn = document.getElementById('print-btn');
    const clearButton = document.getElementById('clearButton');
    const freeSpaceCheckbox = document.getElementById('free-space');
    const topAlignCheckbox = document.getElementById('top-align');

    // State
    let playerCount = 2;
    let words = [];
    let originalWords = [];
    let cellGrid = [];       // size*size array: word string or null (null = empty cell)
    let wordToCellMap = {};  // word → cell index
    let freeSpaceIdx = -1;
    let freeSpaceSymbol = '';

    // Sample words for random generation
    const sampleWords = [
        'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
        'Fig', 'Grape', 'Honeydew', 'Ice cream', 'Jackfruit',
        'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange',
        'Papaya', 'Quince', 'Raspberry', 'Strawberry', 'Tangerine',
        'Ugli fruit', 'Vanilla', 'Watermelon', 'Xigua', 'Yuzu'
    ];

    // Word count display
    const wordCountDisplay = document.createElement('div');
    wordCountDisplay.id = 'word-count-display';
    wordInput.parentElement.parentElement.insertBefore(wordCountDisplay, wordInput.parentElement.nextSibling);

    function updateWordCountDisplay() {
        const list = wordInput.value.split('\n').filter(w => w.trim() !== '');
        const size = getBoardSize();
        const hasFreeSpace = freeSpaceCheckbox && freeSpaceCheckbox.checked;
        const max = size * size - (hasFreeSpace ? 1 : 0);

        if (list.length === 0) { wordCountDisplay.innerHTML = ''; return; }
        const color = list.length > max ? 'red' : '#555';
        wordCountDisplay.innerHTML = `<span style="color:${color};font-size:13px;font-weight:500">${list.length} / ${max} words</span>`;
    }

    // Event Listeners
    decreasePlayerBtn.addEventListener('click', () => { updatePlayerCount(-1); });
    increasePlayerBtn.addEventListener('click', () => { updatePlayerCount(1); });
    randomGenerateBtn.addEventListener('click', generateRandomWords);
    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    clearButton.addEventListener('click', resetWords);

    // Free space change: reset grid and re-sync
    if (freeSpaceCheckbox) {
        freeSpaceCheckbox.addEventListener('change', () => {
            resetCellGrid();
            updateWordCountDisplay();
            const completed = getCompletedWords();
            if (completed.length > 0) {
                syncCellGrid(completed);
                renderBoardFromGrid();
            } else {
                displayEmptyPreview();
            }
        });
    }

    // Top align: just re-render existing grid
    if (topAlignCheckbox) {
        topAlignCheckbox.addEventListener('change', () => {
            if (cellGrid.some(c => c !== null)) renderBoardFromGrid();
            else displayEmptyPreview();
        });
    }

    // Incremental word placement: place words one by one as user presses Enter
    wordInput.addEventListener('input', () => {
        words = wordInput.value.split('\n').filter(w => w.trim() !== '');
        originalWords = [...words];
        updateWordCountDisplay();
        const completed = getCompletedWords();
        syncCellGrid(completed);
        if (cellGrid.some(c => c !== null)) {
            renderBoardFromGrid();
        } else {
            displayEmptyPreview();
        }
    });

    // Board size change: reset grid and re-sync
    boardSizeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            resetCellGrid();
            updateWordCountDisplay();
            const completed = getCompletedWords();
            if (completed.length > 0) {
                syncCellGrid(completed);
                renderBoardFromGrid();
            } else {
                displayEmptyPreview();
            }
        });
    });

    // Font size change: re-render without moving words
    const fontSizeInputs = document.querySelectorAll('input[name="font-size"]');
    fontSizeInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (cellGrid.some(c => c !== null)) renderBoardFromGrid();
            else displayEmptyPreview();
        });
    });

    // Show title change: re-render without moving words
    showTitleCheckbox.addEventListener('change', () => {
        if (cellGrid.some(c => c !== null)) renderBoardFromGrid();
        else displayEmptyPreview();
    });

    // Worksheet title change: re-render without moving words
    worksheetTitle.addEventListener('input', () => {
        if (showTitleCheckbox.checked) {
            if (cellGrid.some(c => c !== null)) renderBoardFromGrid();
            else displayEmptyPreview();
        }
    });

    // Functions
    function updatePlayerCount(change) {
        playerCount = Math.max(2, Math.min(6, playerCount + change));
        playerCountSpan.textContent = playerCount;
    }

    function getBoardSize() {
        const selectedRadio = document.querySelector('input[name="board-size"]:checked');
        return selectedRadio ? parseInt(selectedRadio.value) : 4;
    }

    // Initialize cellGrid with nulls (+ free space if checked)
    function resetCellGrid() {
        const size = getBoardSize();
        const totalCells = size * size;
        cellGrid = new Array(totalCells).fill(null);
        wordToCellMap = {};
        freeSpaceIdx = -1;
        freeSpaceSymbol = '';

        if (freeSpaceCheckbox && freeSpaceCheckbox.checked) {
            freeSpaceIdx = Math.floor(Math.random() * totalCells);
            freeSpaceSymbol = Math.random() < 0.5 ? '♡' : '♧';
            cellGrid[freeSpaceIdx] = freeSpaceSymbol;
        }
    }

    // Returns words that are "committed" (have a newline after them)
    // The last word on the last line is still being typed if the text doesn't end with \n
    function getCompletedWords() {
        const value = wordInput.value;
        if (!value) return [];
        const lines = value.split('\n');
        if (value.endsWith('\n')) {
            return lines.filter(w => w.trim() !== '');
        } else {
            return lines.slice(0, -1).filter(w => w.trim() !== '');
        }
    }

    // Sync cellGrid with targetWords:
    // - Remove words no longer in targetWords
    // - Add new words to random empty cells (existing words stay in place)
    function syncCellGrid(targetWords) {
        const size = getBoardSize();
        const totalCells = size * size;

        if (cellGrid.length !== totalCells) {
            resetCellGrid();
        }

        // Remove words no longer present
        const targetSet = new Set(targetWords);
        for (const word of Object.keys(wordToCellMap)) {
            if (!targetSet.has(word)) {
                cellGrid[wordToCellMap[word]] = null;
                delete wordToCellMap[word];
            }
        }

        // Place new words into random empty cells
        for (const word of targetWords) {
            if (wordToCellMap[word] !== undefined) continue; // already placed
            const emptyCells = [];
            for (let i = 0; i < totalCells; i++) {
                if (cellGrid[i] === null) emptyCells.push(i);
            }
            if (emptyCells.length === 0) break; // board full
            const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            cellGrid[randomIdx] = word;
            wordToCellMap[word] = randomIdx;
        }
    }

    // Render the current cellGrid state into the preview
    function renderBoardFromGrid() {
        const size = getBoardSize();
        previewArea.innerHTML = '';
        const page = document.createElement('div');
        page.className = 'bingo-page';
        page.appendChild(createBingoBoard(size, words, [...cellGrid]));
        previewArea.appendChild(page);
        printBtn.disabled = false;
    }

    function generateRandomWords() {
        const size = getBoardSize();
        const hasFreeSpace = freeSpaceCheckbox && freeSpaceCheckbox.checked;
        const max = size * size - (hasFreeSpace ? 1 : 0);
        const shuffled = [...sampleWords].sort(() => Math.random() - 0.5).slice(0, max);
        // Trailing \n so all words are treated as "committed"
        wordInput.value = shuffled.join('\n') + '\n';
        words = [...shuffled];
        originalWords = [...shuffled];
        updateWordCountDisplay();
        resetCellGrid();
        syncCellGrid(shuffled);
        renderBoardFromGrid();
    }

    // Shuffle word positions in the preview without changing the textarea content
    function shufflePreview() {
        const completed = getCompletedWords();
        resetCellGrid();
        syncCellGrid(completed);
        if (cellGrid.some(c => c !== null)) renderBoardFromGrid();
        else displayEmptyPreview();
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function resetWords() {
        wordInput.value = '';
        originalWords = [];
        words = [];
        updateWordCountDisplay();
        resetCellGrid();
        displayEmptyPreview();
        printBtn.disabled = true;
    }

    function displayEmptyPreview() {
        const size = getBoardSize();
        const fontSizeInput = document.querySelector('input[name="font-size"]:checked');
        const fontSize = fontSizeInput ? fontSizeInput.value : 'medium';
        const position = (topAlignCheckbox && topAlignCheckbox.checked) ? 'top' : 'middle';

        previewArea.innerHTML = '';

        const page = document.createElement('div');
        page.className = 'bingo-page';

        const board = document.createElement('div');
        board.className = `bingo-board font-${fontSize} pos-${position}`;

        const header = document.createElement('div');
        header.className = 'student-header';
        header.innerHTML = `
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
        `;
        board.appendChild(header);

        const titleEl = document.createElement('div');
        titleEl.className = 'puzzle-title';
        titleEl.textContent = worksheetTitle.value.trim() || 'Bingo Game';
        titleEl.style.visibility = showTitleCheckbox.checked ? 'visible' : 'hidden';
        board.appendChild(titleEl);

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        for (let j = 0; j < size * size; j++) {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            const row = Math.floor(j / size);
            const col = j % size;
            if (col === size - 1) cell.classList.add('last-col');
            if (row === size - 1) cell.classList.add('last-row');
            grid.appendChild(cell);
        }

        board.appendChild(grid);

        const copyrightFooter = document.createElement('div');
        copyrightFooter.className = 'copyright-footer';
        copyrightFooter.textContent = `© ${new Date().getFullYear()} AriClass. All rights reserved.`;
        board.appendChild(copyrightFooter);

        page.appendChild(board);
        previewArea.appendChild(page);
        printBtn.disabled = false;
    }

    function createBingoBoard(size, words, savedLayout = null, fixedSymbol = null) {
        const board = document.createElement('div');

        const fontSizeInput = document.querySelector('input[name="font-size"]:checked');
        const fontSize = fontSizeInput ? fontSizeInput.value : 'medium';
        const position = (topAlignCheckbox && topAlignCheckbox.checked) ? 'top' : 'middle';

        board.className = `bingo-board font-${fontSize} pos-${position}`;

        const header = document.createElement('div');
        header.className = 'student-header';
        header.innerHTML = `
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
        `;
        board.appendChild(header);

        const title = document.createElement('div');
        title.className = 'puzzle-title';
        title.textContent = worksheetTitle.value.trim() || 'Bingo Game';
        title.style.visibility = showTitleCheckbox.checked ? 'visible' : 'hidden';
        board.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        const hasFreeSpace = freeSpaceCheckbox && freeSpaceCheckbox.checked;

        let cellWords;
        if (savedLayout && savedLayout.length === size * size) {
            cellWords = savedLayout;
        } else {
            // Generate fresh random layout (used for print extra players)
            const wordSlots = hasFreeSpace ? size * size - 1 : size * size;
            let boardWords = [...words];
            while (boardWords.length < wordSlots) {
                boardWords = [...boardWords, ...words];
            }
            const wordList = shuffleArray(boardWords).slice(0, wordSlots);
            if (hasFreeSpace) {
                const freeIdx = Math.floor(Math.random() * (size * size));
                const symbol = fixedSymbol || (Math.random() < 0.5 ? '♡' : '♧');
                cellWords = [...wordList];
                cellWords.splice(freeIdx, 0, symbol);
            } else {
                cellWords = wordList;
            }
        }

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            const word = cellWords[i];
            const isFreeSpace = word === '♡' || word === '♧';
            if (isFreeSpace) {
                cell.classList.add('free-space');
            }
            cell.textContent = word || '';

            const row = Math.floor(i / size);
            const col = i % size;
            if (col === size - 1) cell.classList.add('last-col');
            if (row === size - 1) cell.classList.add('last-row');

            grid.appendChild(cell);
        }

        board.appendChild(grid);

        const copyrightFooter = document.createElement('div');
        copyrightFooter.className = 'copyright-footer';
        copyrightFooter.textContent = `© ${new Date().getFullYear()} AriClass. All rights reserved.`;
        board.appendChild(copyrightFooter);

        return board;
    }

    // Generate button: create layout only if none exists yet
    function generateWorksheet() {
        words = wordInput.value.split('\n').filter(word => word.trim() !== '');
        originalWords = [...words];

        if (words.length === 0) {
            resetCellGrid();
            displayEmptyPreview();
            return;
        }

        // If board already has content, just re-render without reshuffling
        if (cellGrid.some(c => c !== null)) {
            renderBoardFromGrid();
            return;
        }

        // First time: fresh randomized board with all words
        resetCellGrid();
        syncCellGrid(words);
        renderBoardFromGrid();
    }

    // Initialize with empty preview
    displayEmptyPreview();

    function printWorksheet() {
        if (words.length === 0 || playerCount <= 1) {
            window.print();
            return;
        }

        const originalHTML = previewArea.innerHTML;
        const size = getBoardSize();

        // Add pages for remaining players (2 to playerCount), each with a fresh random board
        // Use the same free space symbol as player 1
        for (let i = 1; i < playerCount; i++) {
            const page = document.createElement('div');
            page.className = 'bingo-page';
            page.appendChild(createBingoBoard(size, words, null, freeSpaceSymbol || null));
            previewArea.appendChild(page);
        }

        window.print();
        previewArea.innerHTML = originalHTML;
    }
});
