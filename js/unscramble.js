document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const sentenceList = document.getElementById('sentence-list');
    const generateBtn = document.getElementById('generate-btn');
    const randomGenerateBtn = document.getElementById('random-generate-btn');
    const printBtn = document.getElementById('print-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const worksheetTitle = document.getElementById('worksheet-title');
    const capitalizeFirst = document.getElementById('capitalize-first');
    const showTitle = document.getElementById('show-title');
    const oneColumn = document.getElementById('one-column');
    const twoColumns = document.getElementById('two-columns');
    const clearButton = document.getElementById('clearButton');
    let originalSentences = [];
    let scrambledSentences = [];
    let answerMode = false;
    let lastSeed = 1;

    // Random sentence database
    const randomSentences = [
        "The cat sleeps on the warm windowsill.",
        "My brother plays soccer in the park.",
        "She reads an interesting book every day.",
        "They went to the beach last summer.",
        "The dog chases the yellow ball.",
        "I like to eat ice cream after dinner.",
        "The birds sing in the morning.",
        "He rides his bike to school.",
        "We watched a movie at the theater.",
        "The flowers bloom in the garden.",
        "The children play in the playground.",
        "My sister bakes delicious cookies.",
        "The teacher writes on the blackboard.",
        "The sun shines brightly today.",
        "They built a sandcastle on the beach.",
        "The rabbit hops through the field.",
        "We visited the zoo on Saturday.",
        "The boy draws pictures with crayons.",
        "The fish swim in the blue pond.",
        "She walks her dog in the park."
    ];

    // Function to get random sentences based on layout and spacing
    function getRandomSentences() {
        const layout = twoColumns.checked ? '2column' : '1column';
        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        const hasTitle = showTitle.checked;

        // Calculate max sentences based on current layout
        let maxSentences;
        if (layout === '1column') {
            if (spacing === 'compact') maxSentences = hasTitle ? 8 : 9;
            else if (spacing === 'normal') maxSentences = hasTitle ? 7 : 8;
            else maxSentences = hasTitle ? 6 : 7; // wide
        } else {
            if (spacing === 'compact') maxSentences = hasTitle ? 10 : 11;
            else maxSentences = hasTitle ? 8 : 9; // normal & wide
        }

        // Shuffle and select random sentences
        const shuffledSentences = [...randomSentences]
            .sort(() => Math.random() - 0.5)
            .slice(0, maxSentences)
            .map(text => ({ text: text.slice(0, -1), punctuation: text.slice(-1) }));

        return shuffledSentences;
    }

    // Modify randomGenerateBtn click handler
    randomGenerateBtn.addEventListener('click', () => {
        const sentences = getRandomSentences();
        sentenceList.value = sentences.map(s => s.text + s.punctuation).join('\n');
        generateWorksheet(true);
    });

    // Spacing controls
    const spacingOptions = document.querySelectorAll('input[name="question-spacing"]');

    // Initialize with default spacing
    puzzlePreview.classList.add('spacing-normal');

    spacingOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove all spacing classes first
            puzzlePreview.classList.remove('spacing-compact', 'spacing-normal', 'spacing-wide');
            // Add the selected spacing class
            puzzlePreview.classList.add(`spacing-${this.value}`);
        });
    });

    // Create and add answer button
    const previewActions = document.querySelector('.preview-actions');
    const answerBtn = document.createElement('button');
    answerBtn.className = 'answer-btn';
    answerBtn.innerHTML = '<i class="fas fa-eye"></i> Show Answers';
    answerBtn.addEventListener('click', toggleAnswers);
    previewActions.appendChild(answerBtn);

    // Event Listeners
    generateBtn.addEventListener('click', () => generateWorksheet(false));
    printBtn.addEventListener('click', printWorksheet);
    clearButton.addEventListener('click', clearAll);
    capitalizeFirst.addEventListener('change', updateCapitalization);
    [showTitle, oneColumn, twoColumns].forEach(el => 
        el.addEventListener('change', () => {
            if (scrambledSentences.length > 0) {
                displayWorksheet();
            }
        })
    );

    // Add real-time title visibility toggle
    showTitle.addEventListener('change', () => {
        displayWorksheet();
    });

    // Initialize empty worksheet on page load
    generateEmptyWorksheet();

    function clearAll() {
        sentenceList.value = '';
        generateEmptyWorksheet();
    }

    function generateEmptyWorksheet() {
        originalSentences = [];
        scrambledSentences = [];
        displayWorksheet();
        printBtn.disabled = false;
    }

    // Seeded random number generator for consistent shuffling
    function seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    // Consistent shuffle using seed
    function shuffleWithSeed(array, seed) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function checkSentenceLimit(sentences) {
        const layout = twoColumns.checked ? '2column' : '1column';
        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        const hasTitle = showTitle.checked;
        let maxSentences;
        
        // Calculate lines based on sentence length
        const getLinesCount = (sentence) => {
            const words = sentence.text.split(' ');
            if (layout === '2column') {
                return words.length > 12 ? 3 : 2; // 3 lines if more than 12 words in 2-column
            } else {
                return words.length > 8 ? 2 : 1; // 2 lines if more than 8 words in 1-column
            }
        };

        // Calculate average lines for all sentences
        const avgLines = sentences.reduce((sum, sentence) => sum + getLinesCount(sentence), 0) / sentences.length;

        // Set max sentences based on layout, spacing, and title visibility
        if (layout === '1column') {
            if (avgLines <= 1) { // Single line sentences
                if (spacing === 'compact') maxSentences = hasTitle ? 9 : 10;
                else if (spacing === 'normal') maxSentences = hasTitle ? 8 : 9;
                else maxSentences = hasTitle ? 7 : 8; // wide
            } else { // Two line sentences
                if (spacing === 'compact') maxSentences = hasTitle ? 7 : 8;
                else maxSentences = hasTitle ? 6 : 7; // normal & wide
            }
        } else { // 2column
            if (avgLines > 2) { // Long sentences (3 lines)
                maxSentences = hasTitle ? 8 : 9; // all spacings
            } else { // Short sentences (2 lines)
                if (spacing === 'compact') maxSentences = hasTitle ? 10 : 11;
                else maxSentences = hasTitle ? 8 : 9; // normal & wide
            }
        }

        // Display warning message
        const warningDiv = document.querySelector('.sentence-limit-warning') || document.createElement('div');
        warningDiv.className = 'sentence-limit-warning';
        
        if (sentences.length > maxSentences) {
            const removeCount = sentences.length - maxSentences;
            warningDiv.textContent = `Please remove ${removeCount} sentence(s). Maximum ${maxSentences} sentences allowed for current layout.`;
            if (!warningDiv.parentElement) {
                const wordInput = document.querySelector('.word-input');
                wordInput.insertBefore(warningDiv, wordInput.querySelector('button'));
            }
        } else {
            warningDiv.remove();
        }
        
        return sentences.slice(0, maxSentences);
    }

    function getSentences() {
        const text = sentenceList.value.trim();
        if (!text) return [];
        
        // Split by ., !, or ? and keep the punctuation
        const sentences = text.match(/[^.!?]+[.!?]/g) || [];
        
        // Process each sentence and store punctuation
        let processedSentences = sentences.map(sentence => {
            const trimmed = sentence.trim();
            return {
                text: trimmed.slice(0, -1).trim(),
                punctuation: trimmed.slice(-1)
            };
        }).filter(sentence => sentence.text.length > 0);

        // Apply smart limit
        const limitedSentences = checkSentenceLimit(processedSentences);
        
        // Show warning if sentences were limited
        if (limitedSentences.length < processedSentences.length) {
            const warningDiv = document.querySelector('.sentence-limit-warning') || document.createElement('div');
            warningDiv.className = 'sentence-limit-warning';
            warningDiv.textContent = `Please remove ${processedSentences.length - limitedSentences.length} sentence(s). Maximum ${limitedSentences.length} sentences allowed for current layout.`;
            const wordInput = document.querySelector('.word-input');
            if (!warningDiv.parentElement) {
                wordInput.insertBefore(warningDiv, wordInput.querySelector('button'));
            }
        }
        
        return limitedSentences;
    }

    function shuffleWords(sentence, useRandomSeed) {
        // Split the sentence into words
        const words = sentence.split(' ').filter(word => word.length > 0);
        if (words.length <= 1) return words;

        // Store the first word to handle capitalization
        const firstWord = words[0];

        // Shuffle the words using either consistent or random seed
        const shuffled = useRandomSeed ? 
            shuffleWithSeed(words, Math.random() * 10000) : 
            shuffleWithSeed(words, lastSeed++);

        // Apply capitalization based on the checkbox
        if (capitalizeFirst.checked) {
            return shuffled.map(word => 
                word.toLowerCase() === firstWord.toLowerCase() 
                    ? firstWord 
                    : word.toLowerCase()
            );
        }

        return shuffled.map(word => word.toLowerCase());
    }

    function generateWorksheet(randomize) {
        const sentences = getSentences();
        
        if (sentences.length === 0) {
            const warningDiv = document.querySelector('.sentence-limit-warning') || document.createElement('div');
            warningDiv.className = 'sentence-limit-warning';
            warningDiv.textContent = 'Please enter sentences ending with ., !, or ?';
            const wordInput = document.querySelector('.word-input');
            if (!warningDiv.parentElement) {
                wordInput.insertBefore(warningDiv, wordInput.querySelector('button'));
            }
            return;
        }

        // Reset seed for consistent shuffling
        if (!randomize) {
            lastSeed = 1;
        }

        originalSentences = sentences;
        scrambledSentences = sentences.map(sentence => {
            return shuffleWords(sentence.text, randomize);
        });
        
        // Reset answer mode
        answerMode = false;
        answerBtn.classList.remove('active');
        
        displayWorksheet();
        printBtn.disabled = false;
    }

    function displayWorksheet() {
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
            const title = worksheetTitle.value.trim() || 'Unscramble the Sentence';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add scrambled sentences
        if (scrambledSentences.length > 0) {
            const maxQuestionsPerPage = showTitle.checked ? 10 : 12;
            const useColumns = twoColumns.checked;
            
            if (useColumns) {
                // Create flex container for two columns
                html += '<div class="sentence-container">';
                
                // Calculate split point for even distribution
                const midPoint = Math.ceil(scrambledSentences.length / 2);
                
                // Left column
                html += '<div class="sentence-list column-left">';
                scrambledSentences.slice(0, midPoint).forEach((words, index) => {
                    html += createSentenceItem(words, index, originalSentences[index]);
                });
                html += '</div>';
                
                // Right column
                html += '<div class="sentence-list column-right">';
                scrambledSentences.slice(midPoint).forEach((words, index) => {
                    html += createSentenceItem(words, index + midPoint, originalSentences[index + midPoint]);
                });
                html += '</div>';
                
                html += '</div>'; // Close sentence-container
            } else {
                // Single column layout
                html += '<div class="sentence-list">';
                scrambledSentences.forEach((words, index) => {
                    html += createSentenceItem(words, index, originalSentences[index]);
                });
                html += '</div>';
            }
        } else {
            // Empty state
            html += '<div class="empty-state">';
            html += 'Enter sentences to generate the worksheet.';
            html += '</div>';
        }

        puzzlePreview.innerHTML = html;
    }

    function updateCapitalization() {
        if (scrambledSentences.length > 0) {
            // Reapply capitalization to existing scrambled sentences
            scrambledSentences = scrambledSentences.map((words, index) => {
                const firstWord = originalSentences[index].text.split(' ')[0];
                return words.map((word, wordIndex) => {
                    if (capitalizeFirst.checked && word.toLowerCase() === firstWord.toLowerCase()) {
                        return firstWord;
                    }
                    return capitalizeFirst.checked ? word.toLowerCase() : word.toLowerCase();
                });
            });
            displayWorksheet();
        }
    }

    // Helper function to create sentence item HTML
    function createSentenceItem(words, index, originalSentence) {
        let html = '<div class="sentence-item">';
        html += '<div class="sentence-line">';
        html += `<span class="sentence-number">${index + 1}.</span>`;
        html += `<span class="scrambled-words">${words.join(' / ')}</span>`;
        html += '</div>';
        
        // Calculate number of lines needed only for two-column layout
        let numLines = 1;
        if (twoColumns.checked) {
            // Count actual words (not just characters)
            const wordCount = words.length;
            // If more than 6 words would be on the second line, add another answer line
            numLines = (wordCount > 8) ? 2 : 1;
        }
        if (answerMode) {
            html += `<div class="answer-line answer-shown">${originalSentence.text}${originalSentence.punctuation}</div>`;
        } else {
            // Add multiple answer lines based on the calculated number of lines
            for (let i = 0; i < numLines; i++) {
            html += `<div class="answer-line">&nbsp;</div>`;
            }
        }
        html += '</div>';
        return html;
    }

    function toggleAnswers() {
        answerMode = !answerMode;
        answerBtn.classList.toggle('active');
        displayWorksheet();
    }

    function printWorksheet() {
        // Get current spacing class
        const currentSpacing = document.querySelector('input[name="question-spacing"]:checked').value;
        const spacingClass = `spacing-${currentSpacing}`;

        // Apply spacing class to each sentence item
        puzzlePreview.querySelectorAll('.sentence-item').forEach(item => {
            item.classList.add(spacingClass);
        });

        // Print
        window.print();
    }
}); 