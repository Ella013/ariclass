document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const generateRandomBtn = document.getElementById('generate-random-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const addPairBtn = document.getElementById('add-pair-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const wordPairContainer = document.querySelector('.word-pair-container');
    const answerBtn = document.querySelector('.answer-btn');
    let showingAnswers = false;

    // Sample word pairs for random generation
    const randomPairs = {
        animals: [
            { left: 'DOG', right: 'PUPPY' },
            { left: 'CAT', right: 'KITTEN' },
            { left: 'SHEEP', right: 'LAMB' },
            { left: 'HORSE', right: 'FOAL' },
            { left: 'COW', right: 'CALF' },
            { left: 'CHICKEN', right: 'CHICK' },
            { left: 'PIG', right: 'PIGLET' },
            { left: 'GOAT', right: 'KID' }
        ],
        opposites: [
            { left: 'HOT', right: 'COLD' },
            { left: 'BIG', right: 'SMALL' },
            { left: 'FAST', right: 'SLOW' },
            { left: 'HIGH', right: 'LOW' },
            { left: 'LIGHT', right: 'DARK' },
            { left: 'HAPPY', right: 'SAD' },
            { left: 'STRONG', right: 'WEAK' },
            { left: 'RICH', right: 'POOR' }
        ]
    };

    // Initialize with five empty word pairs
    for (let i = 0; i < 5; i++) {
        addWordPair();
    }

    // Event Listeners
    addPairBtn.addEventListener('click', addWordPair);
    clearAllBtn.addEventListener('click', clearAll);
    generateBtn.addEventListener('click', generateList);
    generateRandomBtn.addEventListener('click', generateRandomList);
    printBtn.addEventListener('click', printWorksheet);
    showTitle.addEventListener('change', updatePreview);

    // Add Show Answers button event listener
    answerBtn.addEventListener('click', function() {
        showingAnswers = !showingAnswers;
        
        // Update button text
        this.innerHTML = showingAnswers ? 
            '<i class="fas fa-eye-slash"></i> Hide Answers' : 
            '<i class="fas fa-eye"></i> Show Answers';
            
        // Update preview
        updatePreview();
    });

    // Reset button event listener
    const resetWordsBtn = document.getElementById('reset-words-btn');
    resetWordsBtn.addEventListener('click', function() {
        wordPairContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            addWordPair();
        }
        displayEmptyPreview();
    });

    // Add word pair
    function addWordPair() {
        const pair = document.createElement('div');
        pair.className = 'word-pair';
        pair.innerHTML = `
            <input type="text" class="word-input-field" placeholder="Left word/phrase" maxlength="30">
            <input type="text" class="word-input-field" placeholder="Right word/phrase" maxlength="30">
            <button class="remove-pair"><i class="fas fa-times"></i></button>
        `;

        // Add event listener to remove button
        const removeButton = pair.querySelector('.remove-pair');
        const allPairs = document.querySelectorAll('.word-pair');
        
        // Hide remove button for the first pair
        if (allPairs.length === 0) {
            removeButton.style.visibility = 'hidden';
        }
        
        removeButton.addEventListener('click', function() {
            if (document.querySelectorAll('.word-pair').length > 1) {
                pair.remove();
                updatePreview();
            }
        });

        // Add event listeners for word inputs
        const inputs = pair.querySelectorAll('.word-input-field');
        inputs[0].addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                inputs[1].focus();
            }
        });

        inputs[1].addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addWordPair();
                // Focus on the left input of the newly added pair
                const pairs = document.querySelectorAll('.word-pair');
                const lastPair = pairs[pairs.length - 1];
                lastPair.querySelector('.word-input-field').focus();
            }
        });

        wordPairContainer.appendChild(pair);
    }

    // Get word pairs
    function getWordPairs() {
        const pairs = document.querySelectorAll('.word-pair');
        const wordPairs = [];

        pairs.forEach((pair, index) => {
            const inputs = pair.querySelectorAll('.word-input-field');
            const leftWord = inputs[0].value.trim();
            const rightWord = inputs[1].value.trim();
            
            if (leftWord && rightWord) {
                wordPairs.push({ left: leftWord, right: rightWord });
            }
        });

        return wordPairs;
    }

    // Generate random list
    function generateRandomList() {
        // Clear existing pairs
        wordPairContainer.innerHTML = '';

        // Select a random category
        const categories = Object.keys(randomPairs);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const pairs = randomPairs[randomCategory];

        // Shuffle pairs and select 5-8 random pairs
        const shuffledPairs = pairs.sort(() => Math.random() - 0.5);
        const numPairs = Math.floor(Math.random() * 4) + 5; // 5 to 8 pairs
        const selectedPairs = shuffledPairs.slice(0, numPairs);

        // Add pairs to the container
        selectedPairs.forEach(pair => {
            const pairElement = document.createElement('div');
            pairElement.className = 'word-pair';
            pairElement.innerHTML = `
                <input type="text" class="word-input-field" placeholder="Left word/phrase" value="${pair.left}" maxlength="30">
                <input type="text" class="word-input-field" placeholder="Right word/phrase" value="${pair.right}" maxlength="30">
                <button class="remove-pair"><i class="fas fa-times"></i></button>
            `;
            wordPairContainer.appendChild(pairElement);
        });

        // Generate the list
        generateList();
    }

    // Generate list
    function generateList() {
        const wordPairs = getWordPairs();
        
        if (wordPairs.length < 2) {
            alert('Please enter at least 2 word pairs.');
            return;
        }

        // Shuffle the right column
        const shuffledRightWords = wordPairs.map(pair => pair.right).sort(() => Math.random() - 0.5);

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

        // Add title if show-title is checked
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Matching Lists';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add matching lists
        html += '<div class="matching-list">';
        html += '<canvas id="connection-canvas"></canvas>';
        
        // Left column (numbers)
        html += '<div class="list-column left">';
        wordPairs.forEach((pair, index) => {
            html += `<div class="list-item" data-index="${index}" data-word="${pair.left}">${pair.left}</div>`;
        });
        html += '</div>';
        
        // Right column (letters)
        html += '<div class="list-column right">';
        shuffledRightWords.forEach((word, index) => {
            const originalPair = wordPairs.find(pair => pair.right === word);
            const originalIndex = wordPairs.indexOf(originalPair);
            html += `<div class="list-item" data-index="${originalIndex}" data-word="${word}">${word}</div>`;
        });
        html += '</div>';
        
        html += '</div>';

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;

        // Initialize line drawing functionality
        initializeLineDrawing();
    }

    // Initialize line drawing
    function initializeLineDrawing() {
        const canvas = document.getElementById('connection-canvas');
        const matchingList = document.querySelector('.matching-list');
        const leftItems = document.querySelectorAll('.list-column.left .list-item');
        const rightItems = document.querySelectorAll('.list-column.right .list-item');
        let selectedItem = null;
        let connections = new Map();
        let lines = [];

        // Set canvas size
        function updateCanvasSize() {
            canvas.width = matchingList.offsetWidth;
            canvas.height = matchingList.offsetHeight;
        }
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Drawing functions
        function drawLine(start, end) {
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function clearCanvas() {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function drawConnections() {
            clearCanvas();
            lines.forEach(line => {
                drawLine(line.start, line.end);
            });
        }

        // Click handlers
        function handleItemClick(e) {
            const item = e.target.closest('.list-item');
            if (!item) return;

            if (!selectedItem) {
                // First item selected
                selectedItem = item;
                item.classList.add('active');
            } else {
                // Second item selected
                const isLeft = selectedItem.closest('.list-column.left');
                const isRightClick = item.closest('.list-column.right');

                if (isLeft && isRightClick || !isLeft && !isRightClick) {
                    // Valid connection attempt
                    const leftItem = isLeft ? selectedItem : item;
                    const rightItem = isLeft ? item : selectedItem;

                    if (leftItem.dataset.index === rightItem.dataset.index) {
                        // Correct match
                        const start = {
                            x: leftItem.offsetLeft + leftItem.offsetWidth + 6,
                            y: leftItem.offsetTop + leftItem.offsetHeight / 2
                        };
                        const end = {
                            x: rightItem.offsetLeft - 6,
                            y: rightItem.offsetTop + rightItem.offsetHeight / 2
                        };

                        lines.push({ start, end });
                        connections.set(leftItem.dataset.index, true);
                        drawConnections();
                    }
                }

                // Reset selection
                selectedItem.classList.remove('active');
                selectedItem = null;
            }
        }

        // Add click listeners
        leftItems.forEach(item => item.addEventListener('click', handleItemClick));
        rightItems.forEach(item => item.addEventListener('click', handleItemClick));
    }

    // Display empty preview
    function displayEmptyPreview() {
        // Generate a sample list using random pairs
        const categories = Object.keys(randomPairs);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const pairs = randomPairs[randomCategory];
        const shuffledPairs = pairs.sort(() => Math.random() - 0.5);
        const selectedPairs = shuffledPairs.slice(0, 5);

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

        // Add title if show-title is checked
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Matching Lists';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add matching lists
        html += '<div class="matching-list">';
        
        // Left column (numbers)
        html += '<div class="list-column left">';
        selectedPairs.forEach((pair, index) => {
            html += `<div class="list-item" style="counter-reset: item ${index + 1}">${pair.left}</div>`;
        });
        html += '</div>';
        
        // Right column (letters)
        html += '<div class="list-column right">';
        const shuffledRight = selectedPairs.map(pair => pair.right).sort(() => Math.random() - 0.5);
        shuffledRight.forEach((word, index) => {
            html += `<div class="list-item" style="counter-reset: item ${index + 1}">${word}</div>`;
        });
        html += '</div>';
        
        html += '</div>';

        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
    }

    // Clear all word pairs
    function clearAll() {
        wordPairContainer.innerHTML = '';
        addWordPair();
        displayEmptyPreview();
    }

    // Update preview
    function updatePreview() {
        generateList();
    }

    // Print worksheet
    function printWorksheet() {
        // Get the worksheet title or use default
        const title = worksheetTitle.value.trim() || 'Matching Lists';
        
        // Store the original title
        const originalTitle = document.title;
        
        // Set the document title to worksheet title (this will be used as the default filename)
        document.title = title;
        
        // Print
        window.print();
        
        // Restore the original title
        document.title = originalTitle;
    }

    // Show initial preview
    displayEmptyPreview();
}); 