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
    let keyPressed = false;

    // Add keyboard event listeners
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'a' && !keyPressed) {
            keyPressed = true;
            showAnswerLines(true);
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key.toLowerCase() === 'a') {
            keyPressed = false;
            showAnswerLines(false);
        }
    });

    function showAnswerLines(show) {
        const matchingList = document.querySelector('.matching-list');
        if (!matchingList) return;

        // Get all right items
        const rightItems = matchingList.querySelectorAll('.list-column.right .list-item');

        if (show) {
            // Show answer numbers next to right words
            rightItems.forEach((rightItem) => {
                const pairIndex = rightItem.getAttribute('data-pair-index');
                
                // Remove existing answer number if any
                const existingAnswer = rightItem.querySelector('.answer-number');
                if (existingAnswer) {
                    existingAnswer.remove();
                }
                
                // Add answer number
                const answerNumber = document.createElement('span');
                answerNumber.className = 'answer-number';
                answerNumber.textContent = pairIndex;
                rightItem.appendChild(answerNumber);
            });
        } else {
            // Hide answer numbers
            rightItems.forEach((rightItem) => {
                const answerNumber = rightItem.querySelector('.answer-number');
                if (answerNumber) {
                    answerNumber.remove();
                }
            });
        }
    }

    // Sample word pairs for random generation
    const randomPairs = {
        animals: [
            { left: 'dog', right: 'puppy' },
            { left: 'cat', right: 'kitten' },
            { left: 'sheep', right: 'lamb' },
            { left: 'horse', right: 'foal' },
            { left: 'cow', right: 'calf' },
            { left: 'chicken', right: 'chick' },
            { left: 'pig', right: 'piglet' },
            { left: 'goat', right: 'kid' },
            { left: 'duck', right: 'duckling' },
            { left: 'goose', right: 'gosling' },
            { left: 'deer', right: 'fawn' },
            { left: 'lion', right: 'cub' }
        ],
        opposites: [
            { left: 'hot', right: 'cold' },
            { left: 'big', right: 'small' },
            { left: 'fast', right: 'slow' },
            { left: 'high', right: 'low' },
            { left: 'light', right: 'dark' },
            { left: 'happy', right: 'sad' },
            { left: 'strong', right: 'weak' },
            { left: 'rich', right: 'poor' },
            { left: 'young', right: 'old' },
            { left: 'clean', right: 'dirty' },
            { left: 'soft', right: 'hard' },
            { left: 'sweet', right: 'sour' }
        ],
        time: [
            { left: 'morning', right: 'sunrise' },
            { left: 'evening', right: 'sunset' },
            { left: 'spring', right: 'bloom' },
            { left: 'summer', right: 'beach' },
            { left: 'autumn', right: 'harvest' },
            { left: 'winter', right: 'snow' },
            { left: 'today', right: 'present' },
            { left: 'yesterday', right: 'past' },
            { left: 'tomorrow', right: 'future' },
            { left: 'dawn', right: 'begin' },
            { left: 'dusk', right: 'end' },
            { left: 'noon', right: 'midday' }
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

        // Show or hide answer lines
        showAnswerLines(showingAnswers);
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
            <input type="text" class="word-input-field" placeholder="Left word" maxlength="30">
            <input type="text" class="word-input-field" placeholder="Right word" maxlength="30">
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
        
        if (wordPairs.length === 0) {
            displayEmptyPreview();
            return;
        }

        // Get selected font size
        const fontSizeInput = document.querySelector('input[name="font-size"]:checked');
        const fontSize = fontSizeInput ? fontSizeInput.value : 'medium';

        // Get selected case
        const letterCaseInput = document.querySelector('input[name="letter-case"]:checked');
        const letterCase = letterCaseInput ? letterCaseInput.value : 'uppercase';

        // Create shuffled right column
        const rightWords = wordPairs.map(pair => pair.right);
        const shuffledRight = shuffleArray([...rightWords]);

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

        // Create matching list HTML
        html += `
            <div class="matching-list font-${fontSize}">
                <div class="list-column left">
                    ${wordPairs.map((pair, index) => `
                        <div class="list-item" data-index="${index + 1}">
                            <span class="number">${index + 1}.</span>
                            ${letterCase === 'uppercase' ? pair.left.toUpperCase() : pair.left.toLowerCase()}
                            <span class="connection-point"></span>
                        </div>
                    `).join('')}
                </div>
                <div class="list-column right">
                    ${shuffledRight.map((word, index) => {
                        // Find the original pair that contains this word
                        const originalPair = wordPairs.find(pair => pair.right === word);
                        // Get the index of the original pair (1-based to match left items)
                        const pairIndex = wordPairs.indexOf(originalPair) + 1;
                        return `
                        <div class="list-item" data-pair-index="${pairIndex}">
                            <span class="connection-point"></span>
                            ${letterCase === 'uppercase' ? word.toUpperCase() : word.toLowerCase()}
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;

        // Update preview
        puzzlePreview.innerHTML = html;
        printBtn.disabled = false;
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

    // Helper function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}); 