document.addEventListener('DOMContentLoaded', function () {
    const generateBtn    = document.getElementById('generate-btn');
    const randomBtn      = document.getElementById('random-generate-btn');
    const printBtn       = document.getElementById('print-btn');
    const answerKeyBtn   = document.getElementById('answer-key-btn');
    const puzzlePreview  = document.getElementById('puzzle-preview');
    const vocabList      = document.getElementById('vocab-list');
    const titleInput     = document.getElementById('worksheet-title');
    const showTitleCheck = document.getElementById('show-title');
    const wordCountDisp  = document.getElementById('word-count-display');
    const resetWordsBtn  = document.getElementById('reset-words-btn');
    if (resetWordsBtn) resetWordsBtn.addEventListener('click', () => { vocabList.value = ''; updateWordCount(); currentCipher = buildCipher(); renderPreview([]); });

    const MAX_WORDS      = 15;
    const MAX_CHARS_2COL = 7;

    const SYMBOL_POOL = [
        '★','▲','●','■','♦','☆','△','○','□','◇',
        '♠','♥','♣','✿','#','@','&','%','$','✓',
        '✗','⊕','≈','∞','Ω','§'
    ];

    // 1-column: short phrases (capitalize first letter + period in textarea)
    const RANDOM_PHRASES = [
        ['Big red apple.','Hot sunny day.','Cold blue sea.','Fast wild fox.','Cute brown dog.'],
        ['Run and jump.','Sit and read.','Sing and play.','Draw a star.','Eat your lunch.'],
        ['I love cats.','She is brave.','We are kind.','He can swim.','They have fun.'],
        ['Bright new day.','Long dark night.','Soft warm bed.','Clean fresh air.','Wide open sky.']
    ];

    // Large 2-column: very short 2-word phrases that fit on one line
    const RANDOM_PHRASES_SHORT = [
        'Run fast.','Sit down.','Look up.','Come in.','Go home.',
        'Be kind.','Stay calm.','Work hard.','Play well.','Think big.',
        'Act now.','Read more.','Help out.','Be brave.','Try again.',
        'Do good.','Love life.','Keep going.','Stand up.','Move on.'
    ];

    // 2-column: short single words (≤ MAX_CHARS_2COL)
    const RANDOM_WORDS_2COL = [
        ['cat','dog','fish','frog','lion','bear','duck','wolf','bird','star'],
        ['red','blue','pink','gold','gray','dark','bold','calm','warm','cool'],
        ['run','jump','sing','swim','draw','read','play','cook','hide','find'],
        ['sun','moon','star','rain','snow','wind','fire','rock','soil','leaf'],
        ['book','desk','door','lamp','wall','chair','clock','cup','pen','bag']
    ];

    let currentCipher = null;
    let showAnswers   = false;

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function buildCipher() {
        const syms = shuffle(SYMBOL_POOL);
        const cipher = {};
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((l, i) => cipher[l] = syms[i]);
        return cipher;
    }

    // Encode a line: handle spaces with wide gap, period stays at end
    function encodeLine(line, cipher) {
        const trimmed   = line.trim();
        const hasPeriod = trimmed.endsWith('.');
        const text      = hasPeriod ? trimmed.slice(0, -1) : trimmed;
        const words     = text.split(/\s+/).filter(w => w.length > 0);

        const encodedWords = words.map(w =>
            w.toUpperCase().split('').map(c => cipher[c] || c).join('\u2002\u2002')
        );
        const joined = encodedWords.join('\u2002\u2002\u2002\u2002\u2002\u2002');
        return hasPeriod ? joined + '\u2002\u2002.' : joined;
    }

    function getLayout()   { return document.querySelector('input[name="layout"]:checked').value; }
    function getFontSize() { return document.querySelector('input[name="fontsize"]:checked').value; }

    // How many problems fit on one page
    function getCapacity() {
        const fs       = getFontSize();
        const twoCol   = getLayout() === '2';
        const hasTitle = showTitleCheck.checked;

        // Approximate rows that fit (1-col basis)
        const base = { small: 9, medium: 8, large: 7 }[fs];
        const adj  = hasTitle ? 0 : 1; // extra room without title
        const rows = base + adj;

        return twoCol ? rows * 2 : rows;
    }

    function getWords() {
        return vocabList.value
            .split('\n')
            .map(w => w.trim())
            .filter(w => w.length > 0)
            .slice(0, MAX_WORDS);
    }

    function updateWordCount() {
        const layout = getLayout();
        const words  = getWords();
        const count  = words.length;
        let html;

        if (layout === '2') {
            html = `${count} words`;
            const over = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length > MAX_CHARS_2COL);
            if (over.length > 0) {
                html += `<br><span class="sc-warn">Too long for 2 columns (max ${MAX_CHARS_2COL} letters): </span>`;
                html += over.map(w => `<span class="sc-warn-word">${w}</span>`).join(', ');
            }
            wordCountDisp.style.color = '#888';
        } else {
            html = `${count} sentences`;
            wordCountDisp.style.color = '#888';
        }

        wordCountDisp.innerHTML = html;
    }

    function buildCipherKeyHTML(cipher) {
        const pairs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l =>
            `<div class="sc-key-pair">
                <span class="sc-key-letter">${l}</span>
                <span class="sc-key-eq">=</span>
                <span class="sc-key-sym">${cipher[l]}</span>
            </div>`
        ).join('');
        return `<div class="sc-key-box">
                    <div class="sc-key-title">Code Key</div>
                    <div class="sc-key-grid">${pairs}</div>
                </div>`;
    }

    function buildProblemsHTML(words, cipher, placeholderCount) {
        const items = words.length > 0 ? words : Array(placeholderCount).fill('');
        return items.map((word, i) => {
            const encoded = word ? encodeLine(word, cipher) : '';
            const answer  = (showAnswers && word) ? `<span class="sc-answer-text">${word.toUpperCase()}</span>` : '';
            return `<div class="sc-problem">
                        <div class="sc-problem-top">
                            <span class="sc-num">${i + 1}.</span>
                            <span class="sc-encoded">${encoded}</span>
                        </div>
                        <div class="sc-answer-line">${answer}</div>
                    </div>`;
        }).join('');
    }

    function buildPageHTML(words, cipher, includeCipherKey = true) {
        const titleText    = titleInput.value.trim() || 'Secret Code';
        const titleVisible = showTitleCheck.checked;
        const twoCol       = getLayout() === '2';
        const fontSize     = getFontSize();
        const year         = new Date().getFullYear();
        const placeholder  = getCapacity();
        const colClass     = twoCol ? 'sc-two-col' : '';
        const fsClass      = 'sc-fs-' + fontSize;
        const titleClass   = titleVisible ? 'puzzle-title' : 'puzzle-title sc-hidden';

        return `<div class="student-header">
                <div class="header-left">
                    <div class="puzzle-header">
                        <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
                    </div>
                </div>
                <div class="info-group">
                    <div class="info-line"><label>Name:</label><div class="input-field"></div></div>
                    <div class="info-line"><label>Date:</label><div class="input-field"></div></div>
                </div>
            </div>
            <div class="${titleClass}">${titleText}</div>
            <div class="sc-problems ${colClass} ${fsClass}">${buildProblemsHTML(words, cipher, placeholder)}</div>
            ${includeCipherKey ? buildCipherKeyHTML(cipher) : ''}
            <div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
    }

    function renderPreview(words) {
        const capacity  = getCapacity();
        const pageWords = words.slice(0, capacity);
        puzzlePreview.innerHTML = buildPageHTML(pageWords, currentCipher || buildCipher());

        answerKeyBtn.innerHTML = showAnswers
            ? '<i class="fas fa-eye-slash"></i> Hide Answers'
            : '<i class="fas fa-eye"></i> Answer Key';
    }

    function isLocked() {
        const r = document.querySelector('input[name="cipherkey"]:checked');
        return r && r.value === 'lock';
    }

    function generate() {
        if (!isLocked()) currentCipher = buildCipher();
        renderPreview(getWords());
    }

    function generateRandom() {
        const layout = getLayout();
        const isLarge = getFontSize() === 'large';
        let picked;
        const count = getCapacity();
        if (layout === '2') {
            picked = shuffle(RANDOM_WORDS_2COL.flat()).slice(0, count);
        } else if (isLarge) {
            picked = shuffle(RANDOM_PHRASES_SHORT).slice(0, count);
        } else {
            picked = shuffle(RANDOM_PHRASES.flat()).slice(0, count);
        }
        vocabList.value = picked.join('\n');
        updateWordCount();
        if (!isLocked()) currentCipher = buildCipher();
        renderPreview(picked);
    }

    function softRender() {
        if (!currentCipher) currentCipher = buildCipher();
        renderPreview(getWords());
    }

    // Print: split words across pages
    printBtn.addEventListener('click', () => {
        const words    = getWords();
        const capacity = getCapacity();
        const cipher   = currentCipher || buildCipher();
        const extras   = document.createElement('div');
        extras.id      = 'sc-extra-pages';

        // Split words into pages
        const chunks = [];
        if (words.length === 0) {
            chunks.push([]);
        } else {
            for (let i = 0; i < words.length; i += capacity) {
                chunks.push(words.slice(i, i + capacity));
            }
        }

        // Pages 2+ from word overflow (always)
        for (let c = 1; c < chunks.length; c++) {
            const div = document.createElement('div');
            div.className = 'sc-print-page';
            div.innerHTML = buildPageHTML(chunks[c], cipher);
            extras.appendChild(div);
        }

        document.body.appendChild(extras);
        window.print();
        document.body.removeChild(extras);
    });

    generateBtn.addEventListener('click', generate);
    randomBtn.addEventListener('click', generateRandom);
    vocabList.addEventListener('input', () => { updateWordCount(); softRender(); });
    titleInput.addEventListener('input', softRender);
    showTitleCheck.addEventListener('change', softRender);
    document.querySelectorAll('input[name="fontsize"]').forEach(r => r.addEventListener('change', softRender));
    document.querySelectorAll('input[name="layout"]').forEach(r => r.addEventListener('change', () => { updateWordCount(); softRender(); }));

    answerKeyBtn.addEventListener('click', () => {
        showAnswers = !showAnswers;
        renderPreview(getWords());
    });

    updateWordCount();
    currentCipher = buildCipher();
    renderPreview([]);
});
