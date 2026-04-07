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

    // Function to get max sentences based on spacing and title
    function getMaxSentences() {
        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        const hasTitle = showTitle.checked;
        if (spacing === 'compact') return hasTitle ? 8 : 9;
        if (spacing === 'normal') return hasTitle ? 7 : 8;
        return hasTitle ? 6 : 7; // wide
    }

    // Function to get random sentences based on spacing
    function getRandomSentences() {
        const maxSentences = getMaxSentences();
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
            puzzlePreview.classList.remove('spacing-compact', 'spacing-normal', 'spacing-wide');
            puzzlePreview.classList.add(`spacing-${this.value}`);
            if (scrambledSentences.length > 0) displayWorksheet();
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
        const maxSentences = getMaxSentences();
        const warningDiv = document.querySelector('.sentence-limit-warning') || document.createElement('div');
        warningDiv.className = 'sentence-limit-warning';
        if (sentences.length > maxSentences) {
            const removeCount = sentences.length - maxSentences;
            warningDiv.textContent = `Please remove ${removeCount} sentence(s). Maximum ${maxSentences} sentences allowed.`;
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

        // Add title if enabled
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Unscramble the Sentence';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Add scrambled sentences
        if (scrambledSentences.length > 0) {
            const maxPerPage = getMaxSentences();
            const displayed = scrambledSentences.slice(0, maxPerPage);
            html += '<div class="sentence-list">';
            displayed.forEach((words, index) => {
                html += createSentenceItem(words, index, originalSentences[index]);
            });
            html += '</div>';
        } else {
            // Empty state
            html += '<div class="empty-state">';
            html += 'Enter sentences to generate the worksheet.';
            html += '</div>';
        }

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

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
    function createSentenceItem(words, index, originalSentence, displayNumber) {
        const num = displayNumber !== undefined ? displayNumber : index + 1;
        let html = '<div class="sentence-item">';
        html += '<div class="sentence-line">';
        html += `<span class="sentence-number">${num}.</span>`;
        html += `<span class="scrambled-words">${words.join(' / ')}</span>`;
        html += '</div>';
        if (answerMode) {
            html += `<div class="answer-line answer-shown">${originalSentence.text}${originalSentence.punctuation}</div>`;
        } else {
            html += `<div class="answer-line">&nbsp;</div>`;
        }
        html += '</div>';
        return html;
    }

    // Build a single print page HTML (header + sentences + footer)
    function buildPrintPageHTML(sentences, originals, startNumber) {
        const currentYear = new Date().getFullYear();
        let html = '';
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';
        html += '<div class="sentence-list">';
        sentences.forEach((words, i) => {
            html += createSentenceItem(words, i, originals[i], startNumber + i);
        });
        html += '</div>';
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        return html;
    }

    function toggleAnswers() {
        answerMode = !answerMode;
        answerBtn.classList.toggle('active');
        displayWorksheet();
    }

    function printWorksheet() {
        const maxPerPage = getMaxSentences();
        const total = scrambledSentences.length;

        // If everything fits on one page, just print
        if (total <= maxPerPage) {
            window.print();
            return;
        }

        // Build extra pages for sentences beyond page 1
        const extraContainer = document.createElement('div');
        extraContainer.id = 'unscramble-extra-pages';

        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        let startIndex = maxPerPage;

        while (startIndex < total) {
            const endIndex = Math.min(startIndex + maxPerPage, total);
            const pageSentences = scrambledSentences.slice(startIndex, endIndex);
            const pageOriginals = originalSentences.slice(startIndex, endIndex);

            const pageDiv = document.createElement('div');
            pageDiv.className = `extra-print-page spacing-${spacing}`;
            pageDiv.innerHTML = buildPrintPageHTML(pageSentences, pageOriginals, startIndex + 1);
            extraContainer.appendChild(pageDiv);

            startIndex = endIndex;
        }

        document.body.appendChild(extraContainer);

        const cleanup = () => {
            extraContainer.remove();
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);

        window.print();
    }
}); 