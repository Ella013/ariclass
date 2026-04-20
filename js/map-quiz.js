var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

function flagImg(code) {
    return `<img src="https://flagcdn.com/w40/${code}.png" alt="${code}" class="mq-flag-img">`;
}

const GEO_DATA = {
    asia: [
        { code:'jp', country:'Japan' },
        { code:'cn', country:'China' },
        { code:'kr', country:'South Korea' },
        { code:'in', country:'India' },
        { code:'th', country:'Thailand' },
        { code:'vn', country:'Vietnam' },
        { code:'id', country:'Indonesia' },
        { code:'ph', country:'Philippines' },
        { code:'my', country:'Malaysia' },
        { code:'sg', country:'Singapore' },
        { code:'pk', country:'Pakistan' },
        { code:'bd', country:'Bangladesh' },
        { code:'mm', country:'Myanmar' },
        { code:'kh', country:'Cambodia' },
        { code:'mn', country:'Mongolia' },
        { code:'np', country:'Nepal' },
        { code:'lk', country:'Sri Lanka' },
        { code:'la', country:'Laos' },
    ],
    europe: [
        { code:'fr', country:'France' },
        { code:'de', country:'Germany' },
        { code:'gb', country:'United Kingdom' },
        { code:'it', country:'Italy' },
        { code:'es', country:'Spain' },
        { code:'nl', country:'Netherlands' },
        { code:'pl', country:'Poland' },
        { code:'se', country:'Sweden' },
        { code:'no', country:'Norway' },
        { code:'dk', country:'Denmark' },
        { code:'fi', country:'Finland' },
        { code:'pt', country:'Portugal' },
        { code:'gr', country:'Greece' },
        { code:'at', country:'Austria' },
        { code:'ch', country:'Switzerland' },
        { code:'be', country:'Belgium' },
        { code:'hu', country:'Hungary' },
        { code:'cz', country:'Czech Republic' },
    ],
    americas: [
        { code:'us', country:'United States' },
        { code:'ca', country:'Canada' },
        { code:'mx', country:'Mexico' },
        { code:'br', country:'Brazil' },
        { code:'ar', country:'Argentina' },
        { code:'co', country:'Colombia' },
        { code:'cl', country:'Chile' },
        { code:'pe', country:'Peru' },
        { code:'ve', country:'Venezuela' },
        { code:'ec', country:'Ecuador' },
        { code:'bo', country:'Bolivia' },
        { code:'cu', country:'Cuba' },
        { code:'jm', country:'Jamaica' },
        { code:'cr', country:'Costa Rica' },
        { code:'pa', country:'Panama' },
        { code:'uy', country:'Uruguay' },
    ],
    africa: [
        { code:'eg', country:'Egypt' },
        { code:'ng', country:'Nigeria' },
        { code:'za', country:'South Africa' },
        { code:'ke', country:'Kenya' },
        { code:'et', country:'Ethiopia' },
        { code:'gh', country:'Ghana' },
        { code:'tz', country:'Tanzania' },
        { code:'ma', country:'Morocco' },
        { code:'dz', country:'Algeria' },
        { code:'tn', country:'Tunisia' },
        { code:'ug', country:'Uganda' },
        { code:'sn', country:'Senegal' },
        { code:'cm', country:'Cameroon' },
        { code:'zw', country:'Zimbabwe' },
        { code:'zm', country:'Zambia' },
        { code:'mz', country:'Mozambique' },
    ],
    oceania: [
        { code:'au', country:'Australia' },
        { code:'nz', country:'New Zealand' },
        { code:'pg', country:'Papua New Guinea' },
        { code:'fj', country:'Fiji' },
        { code:'ws', country:'Samoa' },
        { code:'to', country:'Tonga' },
        { code:'vu', country:'Vanuatu' },
        { code:'ki', country:'Kiribati' },
    ],
};

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn   = document.getElementById('generate-btn');
    const printBtn      = document.getElementById('print-btn');
    const answerBtn     = document.getElementById('answer-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle     = document.getElementById('show-title');

    let showingAnswers = false;
    let savedData = null;

    generateBtn.addEventListener('click', generate);
    worksheetTitle.addEventListener('input', function() { if (savedData) render(savedData); });
    showTitle.addEventListener('change', function() { if (savedData) render(savedData); });

    generate(); // auto-generate on load

    // Real-time: region change → new generate
    document.querySelectorAll('input[name="region"]').forEach(r => {
        r.addEventListener('change', function() { if (savedData) generate(); });
    });
    // Real-time: font size change → new generate (count changes too)
    document.querySelectorAll('input[name="font-size"]').forEach(r => {
        r.addEventListener('change', function() { if (savedData) generate(); });
    });

    function getCountByFont() {
        const fs = document.querySelector('input[name="font-size"]:checked')?.value || 'medium';
        return { small: 13, medium: 11, large: 9 }[fs];
    }

    function generate() {
        const region = document.querySelector('input[name="region"]:checked').value;
        const count  = getCountByFont();
        let pool = region === 'all'
            ? Object.values(GEO_DATA).flat()
            : (GEO_DATA[region] || []);
        // if region has fewer countries than needed, supplement from other regions
        if (pool.length < count) {
            const others = Object.entries(GEO_DATA)
                .filter(([k]) => k !== region)
                .flatMap(([, v]) => v);
            pool = pool.concat(shuffle(others).slice(0, count - pool.length));
        }
        const picked = shuffle(pool).slice(0, count);
        // right column: shuffled country names with original index
        const rightShuffled = shuffle(picked.map((p, i) => ({ country: p.country, idx: i })));
        savedData = { picked, rightShuffled, region };
        render(savedData);
    }

    function render(data) {
        const { picked, rightShuffled } = data;
        const year = new Date().getFullYear();

        let html = '';

        // Header — same as matching-lists
        html += '<div class="student-header">';
        html += '<div class="header-left"><div class="puzzle-header">';
        html += '<img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div></div>';
        html += '<div class="info-group">';
        html += '<div class="info-line"><label>Name:</label><div class="input-field"></div></div>';
        html += '<div class="info-line"><label>Date:</label><div class="input-field"></div></div>';
        html += '</div></div>';

        // Title
        if (showTitle.checked) {
            const title = worksheetTitle.value.trim() || 'Flag Matching Quiz';
            html += `<div class="puzzle-title">${title}</div>`;
        }

        // Matching list — left: flag images, right: country names
        const fontSize = document.querySelector('input[name="font-size"]:checked')?.value || 'medium';
        html += `<div class="matching-list font-${fontSize}">`;

        // Left column: number + flag image
        html += '<div class="list-column left">';
        picked.forEach((p, i) => {
            html += `<div class="list-item" data-index="${i + 1}">
                <span class="number">${i + 1}.</span>
                <img src="https://flagcdn.com/w40/${p.code}.png" alt="${p.country}" class="mq-flag-img">
                <span class="connection-point"></span>
            </div>`;
        });
        html += '</div>';

        // Right column: shuffled country names
        html += '<div class="list-column right">';
        rightShuffled.forEach((item, i) => {
            html += `<div class="list-item" data-pair-index="${item.idx + 1}">
                <span class="connection-point"></span>
                ${item.country}
                <span class="mq-ans-num" style="display:none;color:#c00;font-weight:bold;margin-left:0.4em;">(${item.idx + 1})</span>
            </div>`;
        });
        html += '</div>';

        html += '</div>'; // .matching-list

        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;

        puzzlePreview.innerHTML = html;
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-eye"></i> ' + _showTxt;
        answerBtn.classList.remove('active');
    }

    answerBtn.addEventListener('click', function() {
        if (!savedData) return;
        showingAnswers = !showingAnswers;
        const ansCells = puzzlePreview.querySelectorAll('.mq-ans-num');
        ansCells.forEach(c => c.style.display = showingAnswers ? 'inline' : 'none');
        this.innerHTML = showingAnswers
            ? '<i class="fas fa-eye-slash"></i> ' + _hideTxt
            : '<i class="fas fa-eye"></i> ' + _showTxt;
        this.classList.toggle('active', showingAnswers);
    });

    printBtn.addEventListener('click', () => window.print());
});
