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
            { left: 'GOAT', right: 'KID' },
            { left: 'DUCK', right: 'DUCKLING' },
            { left: 'GOOSE', right: 'GOSLING' },
            { left: 'DEER', right: 'FAWN' },
            { left: 'LION', right: 'CUB' }
        ],
        opposites: [
            { left: 'HOT', right: 'COLD' },
            { left: 'BIG', right: 'SMALL' },
            { left: 'FAST', right: 'SLOW' },
            { left: 'HIGH', right: 'LOW' },
            { left: 'LIGHT', right: 'DARK' },
            { left: 'HAPPY', right: 'SAD' },
            { left: 'STRONG', right: 'WEAK' },
            { left: 'RICH', right: 'POOR' },
            { left: 'YOUNG', right: 'OLD' },
            { left: 'CLEAN', right: 'DIRTY' },
            { left: 'SOFT', right: 'HARD' },
            { left: 'SWEET', right: 'SOUR' }
        ],
        time: [
            { left: 'MORNING', right: 'SUNRISE' },
            { left: 'EVENING', right: 'SUNSET' },
            { left: 'SPRING', right: 'BLOOM' },
            { left: 'SUMMER', right: 'BEACH' },
            { left: 'AUTUMN', right: 'HARVEST' },
            { left: 'WINTER', right: 'SNOW' },
            { left: 'TODAY', right: 'PRESENT' },
            { left: 'YESTERDAY', right: 'PAST' },
            { left: 'TOMORROW', right: 'FUTURE' },
            { left: 'DAWN', right: 'BEGIN' },
            { left: 'DUSK', right: 'END' },
            { left: 'NOON', right: 'MIDDAY' }
        ]
    };

    // Initialize with five empty word pairs and empty preview
    for (let i = 0; i < 5; i++) {
        addWordPair();
    }
    displayEmptyPreview();

    // Add font size change event listener
    const fontSizeInputs = document.querySelectorAll('input[name="font-size"]');
    fontSizeInputs.forEach(input => {
        input.addEventListener('change', generateList);
    });

    // Add letter case change event listener
    const letterCaseInputs = document.querySelectorAll('input[name="letter-case"]');
    letterCaseInputs.forEach(input => {
        input.addEventListener('change', generateList);
    });

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
            
        // Get the current canvas and its drawing functions
        const canvas = document.getElementById('connection-canvas');
        if (canvas) {
            const matchingList = document.querySelector('.matching-list');
            
            // Clear existing lines
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (showingAnswers) {
                // Draw answer lines
                const wordPairs = getWordPairs();
                const leftColumn = document.querySelectorAll('.list-column.left .list-item');
                const rightColumn = document.querySelectorAll('.list-column.right .list-item');
                const isUpperCase = document.querySelector('input[name="letter-case"]:checked').value === 'uppercase';
                
                // Process each left item in order
                leftColumn.forEach((leftItem, index) => {
                    const currentPair = wordPairs[index];
                    if (!currentPair) return;

                    // Find matching right item based on the original pair
                    const expectedRightWord = isUpperCase ? currentPair.right.toUpperCase() : currentPair.right.toLowerCase();
                    const rightItem = Array.from(rightColumn).find(item => item.textContent === expectedRightWord);

                    if (leftItem && rightItem) {
                        // Calculate dot positions
                        const leftRect = leftItem.getBoundingClientRect();
                        const rightRect = rightItem.getBoundingClientRect();
                        const canvasRect = canvas.getBoundingClientRect();
                        
                        const start = {
                            x: leftRect.right - canvasRect.left + 15, // Position at the dot
                            y: leftRect.top - canvasRect.top + leftRect.height / 2
                        };
                        const end = {
                            x: rightRect.left - canvasRect.left - 15, // Position at the dot
                            y: rightRect.top - canvasRect.top + rightRect.height / 2
                        };
                        
                        // Draw red answer lines
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                });
            }
        }
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
        inputs[0].addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                inputs[1].focus();
            }
        });

        inputs[1].addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentPairs = document.querySelectorAll('.word-pair');
                const currentIndex = Array.from(currentPairs).indexOf(pair);
                
                // If this is the last pair and both inputs have values, add a new pair
                if (currentIndex === currentPairs.length - 1 && 
                    inputs[0].value.trim() !== '' && 
                    inputs[1].value.trim() !== '') {
                    addWordPair();
                    // Focus on the left input of the newly added pair
                    const pairs = document.querySelectorAll('.word-pair');
                    const lastPair = pairs[pairs.length - 1];
                    lastPair.querySelector('.word-input-field').focus();
                } else if (currentIndex < currentPairs.length - 1) {
                    // If not the last pair, move to the next pair's left input
                    const nextPair = currentPairs[currentIndex + 1];
                    nextPair.querySelector('.word-input-field').focus();
                }
                
                // Update the preview if both inputs have values
                if (inputs[0].value.trim() !== '' && inputs[1].value.trim() !== '') {
                    generateList();
                }
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

        // Shuffle pairs and select 8-12 random pairs
        const shuffledPairs = pairs.sort(() => Math.random() - 0.5);
        const numPairs = Math.floor(Math.random() * 5) + 8; // 8 to 12 pairs
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

        // Get selected font size and letter case
        const selectedFontSize = document.querySelector('input[name="font-size"]:checked').value;
        const isUpperCase = document.querySelector('input[name="letter-case"]:checked').value === 'uppercase';

        // Store the current right column order if it exists
        const rightColumn = document.querySelectorAll('.list-column.right .list-item');
        let currentOrder = [];
        if (rightColumn.length > 0) {
            currentOrder = Array.from(rightColumn).map(item => item.textContent.replace('•', '').trim());
        }

        // Convert words based on case selection
        const processedWordPairs = wordPairs.map(pair => ({
            left: isUpperCase ? pair.left.toUpperCase() : pair.left.toLowerCase(),
            right: isUpperCase ? pair.right.toUpperCase() : pair.right.toLowerCase()
        }));

        // Use existing order or create new shuffled order
        let shuffledRightWords;
        if (currentOrder.length === processedWordPairs.length && currentOrder.length > 0) {
            // Only maintain order if the number of pairs hasn't changed
            shuffledRightWords = currentOrder.map(word => 
                isUpperCase ? word.toUpperCase() : word.toLowerCase()
            );
        } else {
            // Create new shuffled order
            shuffledRightWords = [...processedWordPairs].map(pair => pair.right)
                .sort(() => Math.random() - 0.5);
        }

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

        // Add matching lists with font size class
        html += `<div class="matching-list font-${selectedFontSize}">`;
        
        // Left column (numbers)
        html += '<div class="list-column left">';
        processedWordPairs.forEach((pair, index) => {
            html += `<div class="list-item" data-pair-index="${index}">
                <span class="number">${index + 1}.</span>
                <span class="word">${pair.left}</span>
                <span class="dot">•</span>
            </div>`;
        });
        html += '</div>';
        
        // Right column (letters)
        html += '<div class="list-column right">';
        shuffledRightWords.forEach((word, index) => {
            html += `<div class="list-item">
                <span class="dot">•</span>
                <span class="word">${word}</span>
            </div>`;
        });
        html += '</div>';

        // Add canvas after the columns
        html += '<canvas id="connection-canvas"></canvas>';
        
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
            // Redraw lines after resize
            drawConnections();
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
            if (!showingAnswers) { // Only draw user connections when not showing answers
                lines.forEach(line => {
                    drawLine(line.start, line.end);
                });
            }
        }

        // Click handlers
        function handleItemClick(e) {
            if (showingAnswers) return; // Disable clicking when showing answers
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

                    // Calculate dot positions
                    const leftRect = leftItem.getBoundingClientRect();
                    const rightRect = rightItem.getBoundingClientRect();
                    const canvasRect = canvas.getBoundingClientRect();

                    const start = {
                        x: leftRect.right - canvasRect.left + 15, // Position at the dot
                        y: leftRect.top - canvasRect.top + leftRect.height / 2
                    };
                    const end = {
                        x: rightRect.left - canvasRect.left - 15, // Position at the dot
                        y: rightRect.top - canvasRect.top + rightRect.height / 2
                    };

                    lines.push({ start, end });
                    drawConnections();
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
    // displayEmptyPreview(); // This line is now handled by the initialization
}); 