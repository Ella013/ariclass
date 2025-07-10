document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordInput = document.getElementById('wordInput');
    const randomWordsBtn = document.getElementById('randomWordsBtn');
    const boardSizeSelect = document.getElementById('boardSize');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const generateBtn = document.getElementById('generateBtn');
    const previewArea = document.getElementById('previewArea');
    const decreasePlayerBtn = document.getElementById('decreasePlayer');
    const increasePlayerBtn = document.getElementById('increasePlayer');
    const playerCountSpan = document.getElementById('playerCount');
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitleCheckbox = document.getElementById('show-title');
    const printBtn = document.getElementById('print-btn');
    const resetWordsBtn = document.getElementById('reset-words-btn');

    // State
    let playerCount = 2;
    let words = [];
    let originalWords = [];

    // Sample words for random generation
    const sampleWords = [
        'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
        'Fig', 'Grape', 'Honeydew', 'Ice cream', 'Jackfruit',
        'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange',
        'Papaya', 'Quince', 'Raspberry', 'Strawberry', 'Tangerine',
        'Ugli fruit', 'Vanilla', 'Watermelon', 'Xigua', 'Yuzu'
    ];

    // Event Listeners
    decreasePlayerBtn.addEventListener('click', () => updatePlayerCount(-1));
    increasePlayerBtn.addEventListener('click', () => updatePlayerCount(1));
    randomWordsBtn.addEventListener('click', generateRandomWords);
    shuffleBtn.addEventListener('click', shuffleAndGenerate);
    generateBtn.addEventListener('click', generateWorksheet);
    printBtn.addEventListener('click', printWorksheet);
    resetWordsBtn.addEventListener('click', resetWords);
    
    // Save original words when input changes
    wordInput.addEventListener('input', () => {
        originalWords = wordInput.value.split('\n').filter(word => word.trim() !== '');
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
        previewArea.innerHTML = '';
        printBtn.disabled = true;
    }

    function createBingoBoard(size, words) {
        const board = document.createElement('div');
        board.className = 'bingo-board';

        if (showTitleCheckbox.checked && worksheetTitle.value.trim()) {
            const title = document.createElement('h2');
            title.textContent = worksheetTitle.value.trim();
            board.appendChild(title);
        }

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        // If we don't have enough words, we'll reuse them
        let boardWords = [...words];
        while (boardWords.length < size * size) {
            boardWords = [...boardWords, ...words];
        }

        const shuffledWords = shuffleArray(boardWords).slice(0, size * size);

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.textContent = shuffledWords[i];
            grid.appendChild(cell);
        }

        board.appendChild(grid);
        return board;
    }

    function createBingoPage(boardsPerPage = 2) {
        const page = document.createElement('div');
        page.className = 'bingo-page';

        // Add page divider
        const divider = document.createElement('div');
        divider.className = 'page-divider';
        page.appendChild(divider);

        // Create boards for this page
        for (let i = 0; i < boardsPerPage; i++) {
            const size = parseInt(boardSizeSelect.value);
            page.appendChild(createBingoBoard(size, words));
        }

        return page;
    }

    function shuffleAndGenerate() {
        if (originalWords.length === 0) {
            alert('Please enter some words first!');
            return;
        }
        words = shuffleArray([...originalWords]);
        generateWorksheet();
    }

    function generateWorksheet() {
        words = wordInput.value.split('\n').filter(word => word.trim() !== '');
        originalWords = [...words];
        
        if (words.length === 0) {
            alert('Please enter some words first!');
            return;
        }

        previewArea.innerHTML = '';
        const pagesNeeded = Math.ceil(playerCount / 2);
        
        for (let i = 0; i < pagesNeeded; i++) {
            const remainingPlayers = playerCount - (i * 2);
            const boardsOnThisPage = Math.min(2, remainingPlayers);
            const page = createBingoPage(boardsOnThisPage);
            previewArea.appendChild(page);
        }

        printBtn.disabled = false;
    }

    function printWorksheet() {
        window.print();
    }
}); 