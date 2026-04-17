document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const sentenceList = document.getElementById('sentence-list');
    const resetWordsBtn = document.getElementById('reset-words-btn');
    if (resetWordsBtn) resetWordsBtn.addEventListener('click', () => {
        if (sentenceList.value.trim()) generateWorksheet(true);
    });
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
    let firstWordIndices = [];
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

    // Function to get max sentences based on spacing, title, and font size
    function getMaxSentences() {
        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        const hasTitle = showTitle.checked;
        const fontSize = document.querySelector('input[name="font-size"]:checked').value;
        if (fontSize === 'large') {
            if (spacing === 'compact') return hasTitle ? 7 : 8;
            if (spacing === 'normal') return hasTitle ? 6 : 7;
            return hasTitle ? 5 : 6; // wide
        }
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
        updateSentenceCountDisplay();
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
            updateSentenceCountDisplay();
            if (scrambledSentences.length > 0) displayWorksheet();
        });
    });

    // Font size controls
    const fontSizeOptions = document.querySelectorAll('input[name="font-size"]');
    puzzlePreview.classList.add('font-medium');

    fontSizeOptions.forEach(option => {
        option.addEventListener('change', function() {
            puzzlePreview.classList.remove('font-small', 'font-medium', 'font-large');
            puzzlePreview.classList.add(`font-${this.value}`);
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

    // Sentence count display
    const sentenceCountDisplay = document.createElement('div');
    sentenceCountDisplay.id = 'sentence-count-display';
    sentenceList.parentElement.insertBefore(sentenceCountDisplay, sentenceList.nextSibling);

    function updateSentenceCountDisplay() {
        const text = sentenceList.value.trim();
        const allSentences = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (allSentences.length === 0) { sentenceCountDisplay.innerHTML = ''; return; }
        const max = getMaxSentences();
        const pages = Math.ceil(allSentences.length / max);
        const pageText = pages > 1 ? ` &nbsp;|&nbsp; ${pages} pages` : '';
        sentenceCountDisplay.innerHTML =
            `<span style="color:#555;font-size:13px;font-weight:500">${allSentences.length} sentences${pageText}</span>`;
    }

    sentenceList.addEventListener('input', updateSentenceCountDisplay);

    // Event Listeners
    generateBtn.addEventListener('click', () => generateWorksheet(false));
    printBtn.addEventListener('click', printWorksheet);
    clearButton.addEventListener('click', clearAll);
    capitalizeFirst.addEventListener('change', updateCapitalization);
    showTitle.addEventListener('change', () => {
        updateSentenceCountDisplay();
        displayWorksheet();
    });

    // Initialize empty worksheet on page load
    generateEmptyWorksheet();

    function clearAll() {
        sentenceList.value = '';
        updateSentenceCountDisplay();
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

    function getSentences() {
        const text = sentenceList.value.trim();
        if (!text) return [];

        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                const last = line.slice(-1);
                const hasPunct = ['.', '!', '?'].includes(last);
                return {
                    text: hasPunct ? line.slice(0, -1).trim() : line,
                    punctuation: hasPunct ? last : '.'
                };
            });
    }

    function shuffleWords(sentence, useRandomSeed) {
        const words = sentence.split(' ').filter(word => word.length > 0);
        if (words.length <= 1) return { words, firstIdx: 0 };

        const firstWord = words[0];

        // Tag each word with its original index to track the first word
        const indexed = words.map((w, i) => ({ w, i }));

        const shuffledIndexed = useRandomSeed ?
            shuffleWithSeed(indexed, Math.random() * 10000) :
            shuffleWithSeed(indexed, lastSeed++);

        const firstIdx = shuffledIndexed.findIndex(({ i }) => i === 0);

        if (capitalizeFirst.checked) {
            return {
                words: shuffledIndexed.map(({ w, i }) => i === 0 ? firstWord : w.toLowerCase()),
                firstIdx
            };
        }

        return { words: shuffledIndexed.map(({ w }) => w.toLowerCase()), firstIdx };
    }

    function generateWorksheet(randomize) {
        const sentences = getSentences();
        
        if (sentences.length === 0) return;

        // Reset seed for consistent shuffling
        if (!randomize) {
            lastSeed = 1;
        }

        originalSentences = sentences;
        firstWordIndices = [];
        scrambledSentences = sentences.map(sentence => {
            const { words, firstIdx } = shuffleWords(sentence.text, randomize);
            firstWordIndices.push(firstIdx);
            return words;
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

        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
    }

    function updateCapitalization() {
        if (scrambledSentences.length > 0) {
            scrambledSentences = scrambledSentences.map((words, index) => {
                const firstWord = originalSentences[index].text.split(' ')[0];
                const firstIdx = firstWordIndices[index];
                return words.map((word, i) => {
                    if (capitalizeFirst.checked && i === firstIdx) {
                        return firstWord;
                    }
                    return word.toLowerCase();
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

        if (total <= maxPerPage) {
            window.print();
            return;
        }

        // Save original preview content
        const originalHTML = puzzlePreview.innerHTML;

        // Build all pages inside puzzle-preview
        const spacing = document.querySelector('input[name="question-spacing"]:checked').value;
        let allHTML = originalHTML;

        let startIndex = maxPerPage;
        while (startIndex < total) {
            const endIndex = Math.min(startIndex + maxPerPage, total);
            const pageSentences = scrambledSentences.slice(startIndex, endIndex);
            const pageOriginals = originalSentences.slice(startIndex, endIndex);

            allHTML += `<div class="us-page-break spacing-${spacing}">`;
            allHTML += buildPrintPageHTML(pageSentences, pageOriginals, startIndex + 1);
            allHTML += '</div>';

            startIndex = endIndex;
        }

        puzzlePreview.innerHTML = allHTML;
        window.print();
        puzzlePreview.innerHTML = originalHTML;
    }

}); 