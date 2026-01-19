document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordInput = document.getElementById('wordInput');
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

    // State
    let playerCount = 2;
    let words = [];
    let originalWords = [];
    let savedBoardLayouts = []; // Store word layouts for each board

    // Sample words for random generation
    const sampleWords = [
        'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
        'Fig', 'Grape', 'Honeydew', 'Ice cream', 'Jackfruit',
        'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange',
        'Papaya', 'Quince', 'Raspberry', 'Strawberry', 'Tangerine',
        'Ugli fruit', 'Vanilla', 'Watermelon', 'Xigua', 'Yuzu'
    ];

    // Event Listeners
    decreasePlayerBtn.addEventListener('click', () => {
        updatePlayerCount(-1);
        savedBoardLayouts = []; // Reset layouts when player count changes
        if (words.length > 0) {
            generateWorksheet();
        } else {
            displayEmptyPreview();
        }
    });
    increasePlayerBtn.addEventListener('click', () => {
        updatePlayerCount(1);
        savedBoardLayouts = []; // Reset layouts when player count changes
        if (words.length > 0) {
            generateWorksheet();
        } else {
            displayEmptyPreview();
        }
    });
    randomGenerateBtn.addEventListener('click', generateRandomWords);
    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    clearButton.addEventListener('click', resetWords);
    
    // Save original words when input changes
    wordInput.addEventListener('input', () => {
        originalWords = wordInput.value.split('\n').filter(word => word.trim() !== '');
        savedBoardLayouts = []; // Reset layouts when words change
        if (originalWords.length > 0) generateWorksheet();
    });

    // Board size change event
    boardSizeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            savedBoardLayouts = []; // Reset layouts when board size changes
            if (words.length > 0) {
                generateWorksheet();
            } else {
                displayEmptyPreview();
            }
        });
    });

    // Font size change event
    const fontSizeInputs = document.querySelectorAll('input[name="font-size"]');
    fontSizeInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (words.length > 0) {
                generateWorksheet(true); // Preserve layout when changing font size
            } else {
                displayEmptyPreview();
            }
        });
    });

    // Show title change event
    showTitleCheckbox.addEventListener('change', () => {
        if (words.length > 0) {
            generateWorksheet(true); // Preserve layout when toggling title visibility
        } else {
            displayEmptyPreview();
        }
    });

    // Worksheet title change event
    worksheetTitle.addEventListener('input', () => {
        if (words.length > 0) {
            if (showTitleCheckbox.checked) generateWorksheet(true); // Preserve layout when changing title
        } else {
            displayEmptyPreview();
        }
    });

    // Functions
    function updatePlayerCount(change) {
        playerCount = Math.max(2, Math.min(6, playerCount + change));
        playerCountSpan.textContent = playerCount;
    }

    function generateRandomWords() {
        const shuffled = [...sampleWords].sort(() => Math.random() - 0.5);
        wordInput.value = shuffled.join('\n');
        originalWords = [...shuffled];
        generateWorksheet();
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
        displayEmptyPreview();
        printBtn.disabled = true;
    }

    function displayEmptyPreview() {
        const size = getBoardSize();
        const fontSizeInput = document.querySelector('input[name="font-size"]:checked');
        const fontSize = fontSizeInput ? fontSizeInput.value : 'medium';
        
        previewArea.innerHTML = '';
        
        // Create one empty page per player
        for (let i = 0; i < playerCount; i++) {
            const page = document.createElement('div');
            page.className = 'bingo-page';

            const board = document.createElement('div');
            board.className = `bingo-board font-${fontSize}`;

            // Add header section with logo and student info
            const header = document.createElement('div');
            header.className = 'student-header';
            header.innerHTML = `
                <div class="header-left">
                    <div class="puzzle-header">
                        <img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
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

            // Add title if show-title is checked
            if (showTitleCheckbox.checked && worksheetTitle.value.trim()) {
                const title = document.createElement('div');
                title.className = 'puzzle-title';
                title.textContent = worksheetTitle.value.trim();
                board.appendChild(title);
            }

            // Add empty grid
            const grid = document.createElement('div');
            grid.className = 'bingo-grid';
            grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

            // Create empty cells
            for (let j = 0; j < size * size; j++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                cell.textContent = '';
                
                // Add classes for print border styling
                const row = Math.floor(j / size);
                const col = j % size;
                if (col === size - 1) {
                    cell.classList.add('last-col');
                }
                if (row === size - 1) {
                    cell.classList.add('last-row');
                }
                
                grid.appendChild(cell);
            }

            board.appendChild(grid);
            
            // Add copyright footer
            const copyrightFooter = document.createElement('div');
            copyrightFooter.className = 'copyright-footer';
            const currentYear = new Date().getFullYear();
            copyrightFooter.textContent = `© ${currentYear} AriClass. All rights reserved.`;
            board.appendChild(copyrightFooter);
            
            page.appendChild(board);
            previewArea.appendChild(page);
        }
        
        printBtn.disabled = false;
    }

    function createBingoBoard(size, words, savedLayout = null) {
        const board = document.createElement('div');
        
        // Get selected font size
        const fontSizeInput = document.querySelector('input[name="font-size"]:checked');
        const fontSize = fontSizeInput ? fontSizeInput.value : 'medium';
        
        board.className = `bingo-board font-${fontSize}`;

        // Add header section with logo and student info
        const header = document.createElement('div');
        header.className = 'student-header';
        header.innerHTML = `
            <div class="header-left">
                <div class="puzzle-header">
                    <img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
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

        // Add title if show-title is checked
        if (showTitleCheckbox.checked && worksheetTitle.value.trim()) {
            const title = document.createElement('div');
            title.className = 'puzzle-title';
            title.textContent = worksheetTitle.value.trim();
            board.appendChild(title);
        }

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        // Use saved layout if available, otherwise create new layout
        let cellWords;
        if (savedLayout && savedLayout.length === size * size) {
            cellWords = savedLayout;
        } else {
        // If we don't have enough words, we'll reuse them
        let boardWords = [...words];
        while (boardWords.length < size * size) {
            boardWords = [...boardWords, ...words];
        }
            cellWords = shuffleArray(boardWords).slice(0, size * size);
        }

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.textContent = cellWords[i];
            
            // Add classes for print border styling
            const row = Math.floor(i / size);
            const col = i % size;
            if (col === size - 1) {
                cell.classList.add('last-col');
            }
            if (row === size - 1) {
                cell.classList.add('last-row');
            }
            
            grid.appendChild(cell);
        }

        board.appendChild(grid);
        
        // Add copyright footer
        const copyrightFooter = document.createElement('div');
        copyrightFooter.className = 'copyright-footer';
        const currentYear = new Date().getFullYear();
        copyrightFooter.textContent = `© ${currentYear} AriClass. All rights reserved.`;
        board.appendChild(copyrightFooter);
        
        return board;
    }

    function getBoardSize() {
        const selectedRadio = document.querySelector('input[name="board-size"]:checked');
        return selectedRadio ? parseInt(selectedRadio.value) : 4;
    }

    function createBingoPage(boardsPerPage = 1, savedLayout = null) {
        const page = document.createElement('div');
        page.className = 'bingo-page';

        // Create boards for this page (only 1 board per page)
        const size = getBoardSize();
        page.appendChild(createBingoBoard(size, words, savedLayout));

        return page;
    }

    function generateWorksheet(preserveLayout = false) {
        words = wordInput.value.split('\n').filter(word => word.trim() !== '');
        originalWords = [...words];
        
        if (words.length === 0) {
            displayEmptyPreview();
            savedBoardLayouts = [];
            return;
        }

        previewArea.innerHTML = '';
        
        // Save current layouts if preserving
        if (preserveLayout && savedBoardLayouts.length > 0) {
            // Use saved layouts
            for (let i = 0; i < playerCount; i++) {
                const savedLayout = savedBoardLayouts[i] || null;
                const page = createBingoPage(1, savedLayout);
            previewArea.appendChild(page);
            }
        } else {
            // Create new layouts and save them
            savedBoardLayouts = [];
            for (let i = 0; i < playerCount; i++) {
                const page = createBingoPage(1);
                previewArea.appendChild(page);
                
                // Save the layout of this board
                const grid = page.querySelector('.bingo-grid');
                const cells = grid.querySelectorAll('.bingo-cell');
                const layout = Array.from(cells).map(cell => cell.textContent);
                savedBoardLayouts.push(layout);
            }
        }

        printBtn.disabled = false;
    }

    // Initialize with empty preview
    displayEmptyPreview();

    function printWorksheet() {
        window.print();
    }
}); 