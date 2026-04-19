/**
 * AriClass Korean Page Builder
 * Generates ko/ versions of all worksheet pages
 */

const fs = require('fs');
const path = require('path');

// Pages to generate in ko/
const pages = [
  'word-search',
  'unscramble',
  'crossword',
  'matching-lists',
  'bingo',
  'sudoku',
  'maze',
  'addition-subtraction',
  'multiplication-table',
  'clock'
];

// Pages that exist in ko/ (for link resolution)
const koPages = new Set([
  'index.html', 'how-to-use.html',
  'word-search.html', 'unscramble.html', 'crossword.html', 'matching-lists.html',
  'bingo.html', 'sudoku.html', 'maze.html', 'addition-subtraction.html',
  'multiplication-table.html', 'clock.html'
]);

// Korean nav / common UI strings
const commonKO = {
  navHome: '홈',
  navWorksheets: '학습지',
  navHowToUse: '사용 방법',
  navWordSearch: '단어 찾기',
  navUnscramble: '문장 배열',
  navCrossword: '십자말풀이',
  navMatchingLists: '단어 연결',
  navBingo: '빙고 게임',
  navSudoku: '스도쿠',
  navMaze: '미로 퍼즐',
  navAddSub: '덧셈 &amp; 뺄셈',
  navMultDiv: '곱셈 &amp; 나눗셈',
  navClock: '시계 읽기',
  siteTitle: '아리클래스 : 학습지 생성기',
  siteSubtitle: '교사와 학생에게 맞춤 학습지를 제공합니다',
  footerAbout: '아리클래스는 교사와 학생을 위한 무료 학습지 생성 사이트입니다.',
  footerQuickLinks: '바로가기',
  footerInfo: '정보',
  footerPrivacy: '개인정보처리방침',
  footerTerms: '이용약관',
  footerContact: '문의하기',
  footerContactTitle: '문의',
  footerRights: '© 2025 Ariclass. All rights reserved.',
  previewLabel: '미리보기',
  worksheetTitle: '학습지 제목',
  showTitle: '제목 보이기',
  showTitleFull: '학습지 제목 보이기',
  printBtn: '<i class="fas fa-print"></i> 출력하기',
  showAnswers: '<i class="fas fa-eye"></i> 정답 보기',
  randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
  generateBtn: '<i class="fas fa-magic"></i> 학습지 만들기',
  generatePuzzle: '<i class="fas fa-magic"></i> 퍼즐 만들기',
  clearBtn: '<i class="fas fa-trash"></i> 초기화',
  clearAll: '<i class="fas fa-trash"></i> 전체 삭제',
  fontSmall: '작게',
  fontMedium: '보통',
  fontLarge: '크게',
  difficultyLevel: '난이도',
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  expert: '전문가',
  level1Easy: 'Level 1 (쉬움)',
  level2Medium: 'Level 2 (보통)',
  level3Hard: 'Level 3 (어려움)',
};

// Per-page content replacements
const pageKO = {
  'word-search': {
    metaTitle: '무료 단어 찾기 학습지 생성기 - 아리클래스',
    metaDesc: '맞춤 어휘로 단어 찾기 퍼즐을 무료로 만들어보세요. 교사, 학생, ESL 수업에 최적화된 학습지입니다.',
    canonical: 'https://ariclass.com/ko/word-search.html',
    h1: '단어 찾기',
    enterWords: '단어 입력',
    enterWordsPlaceholder: '단어를 입력하세요 (각 단어는 줄바꿈으로 구분)\n최대 20개',
    clearBtn: '<i class="fas fa-trash"></i> 초기화',
    generateBtn: '<i class="fas fa-magic"></i> 퍼즐 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    showWordList: '단어 목록 표시',
    diagonal: '대각선 방향 포함',
    reverse: '역방향 포함',
    descTitle: '단어 찾기 학습지 만들기',
    descStep1: '상단에 학습지 제목을 입력하세요',
    descStep2: '단어 입력 칸에 단어를 입력하세요 (레벨에 따라 10/15/20개)',
    descStep3: '대문자 또는 소문자를 선택하세요',
    descStep4: '대각선, 역방향 옵션을 선택하세요',
    descStep5: '"퍼즐 만들기" 버튼을 클릭하세요',
    descStep6: '출력 버튼으로 학습지를 인쇄하세요',
  },
  'unscramble': {
    metaTitle: '무료 문장 배열 학습지 생성기 - 아리클래스',
    metaDesc: '문장 배열 학습지를 무료로 만들어보세요. 교사와 학생을 위한 영어 어순 연습 문제를 바로 출력하세요.',
    canonical: 'https://ariclass.com/ko/unscramble.html',
    h1: '문장 배열',
    enterSentences: '문장 입력',
    sentencePlaceholder: '문장을 입력하세요. 각 문장은 마침표(.), 물음표(?), 느낌표(!)로 끝나야 합니다.',
    capitalizeFirst: '섞인 문장의 첫 글자를 대문자로',
    layoutFormat: '레이아웃',
    oneColumn: '1열',
    twoColumns: '2열',
    spacing: '문제 간격',
    compact: '좁게',
    normal: '보통',
    wide: '넓게',
    generateBtn: '<i class="fas fa-magic"></i> 학습지 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    clearBtn: '<i class="fas fa-trash-alt"></i> 전체 삭제',
    descTitle: '문장 배열 학습지 만들기',
  },
  'crossword': {
    metaTitle: '무료 십자말풀이 생성기 - 아리클래스',
    metaDesc: '단어와 힌트를 입력해 십자말풀이를 무료로 만들어보세요. 어휘 연습과 ESL 수업에 딱 맞습니다.',
    canonical: 'https://ariclass.com/ko/crossword.html',
    h1: '십자말풀이',
    enterWordsClues: '단어와 힌트 입력',
    addWord: '<i class="fas fa-plus"></i> 단어 추가',
    clearAll: '<i class="fas fa-trash"></i> 전체 삭제',
    generateBtn: '<i class="fas fa-magic"></i> 퍼즐 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    showAnswersBtn: '<i class="fas fa-eye"></i> 정답 보기',
    descTitle: '십자말풀이 만들기',
  },
  'matching-lists': {
    metaTitle: '무료 단어 연결 학습지 생성기 - 아리클래스',
    metaDesc: '단어, 뜻, 개념을 연결하는 학습지를 무료로 만들어보세요. 어휘 복습과 ESL 수업에 최적입니다.',
    canonical: 'https://ariclass.com/ko/matching-lists.html',
    h1: '단어 연결',
    enterWordPairs: '단어 짝 입력',
    addPair: '<i class="fas fa-plus"></i> 단어 짝 추가',
    clearAll: '<i class="fas fa-trash"></i> 전체 삭제',
    fontSize: '글자 크기',
    generateBtn: '<i class="fas fa-magic"></i> 목록 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    showAnswersBtn: '<i class="fas fa-eye"></i> 정답 보기',
    descTitle: '단어 연결 학습지 만들기',
  },
  'bingo': {
    metaTitle: '무료 빙고 카드 생성기 - 아리클래스',
    metaDesc: '맞춤 단어로 빙고 카드를 무료로 만들어보세요. 보드 크기 선택 후 플레이어별 고유 카드를 바로 출력하세요.',
    canonical: 'https://ariclass.com/ko/bingo.html',
    h1: '빙고 게임 생성기',
    enterWords: '단어 입력',
    enterWordsPlaceholder: '단어를 입력하세요 (한 줄에 하나씩)',
    boardSize: '보드 크기',
    fontSize: '글자 크기',
    numPlayers: '플레이어 수',
    numPlayersTooltip: '플레이어마다 고유한 빙고 카드가 생성됩니다. 출력 시 플레이어 수만큼 페이지가 생성됩니다.',
    clearBtn: '<i class="fas fa-trash"></i> 초기화',
    generateBtn: '<i class="fas fa-magic"></i> 빙고 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    descTitle: '빙고 게임 만들기',
  },
  'sudoku': {
    metaTitle: '무료 스도쿠 생성기 - 아리클래스',
    metaDesc: '쉬움, 보통, 어려움 등 다양한 난이도의 스도쿠를 무료로 생성하세요. 수학 연습과 논리 사고력 향상에 도움이 됩니다.',
    canonical: 'https://ariclass.com/ko/sudoku.html',
    h1: '스도쿠',
    generateBtn: '<i class="fas fa-magic"></i> 퍼즐 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    showAnswersBtn: '<i class="fas fa-check-circle"></i> 정답 보기',
    descTitle: '스도쿠 만들기',
  },
  'maze': {
    metaTitle: '무료 미로 퍼즐 생성기 - 아리클래스',
    metaDesc: '다양한 크기와 난이도의 미로 퍼즐을 무료로 생성하세요. 아이들과 수업에 딱 맞는 문제 해결 활동입니다.',
    canonical: 'https://ariclass.com/ko/maze.html',
    h1: '미로 퍼즐',
    mazeType: '미로 유형',
    mazeGrid: '격자형',
    generateBtn: '<i class="fas fa-magic"></i> 퍼즐 만들기',
    randomBtn: '<i class="fas fa-random"></i> 랜덤 생성',
    showAnswersBtn: '<i class="fas fa-check-circle"></i> 정답 보기',
    descTitle: '미로 퍼즐 만들기',
  },
  'addition-subtraction': {
    metaTitle: '무료 덧셈 뺄셈 학습지 생성기 - 아리클래스',
    metaDesc: '난이도 조절 가능한 덧셈, 뺄셈 수학 학습지를 무료로 만들어보세요. 세로 형식으로 바로 출력 가능합니다.',
    canonical: 'https://ariclass.com/ko/addition-subtraction.html',
    h1: '덧셈 &amp; 뺄셈',
    additionOnly: '덧셈만',
    subtractionOnly: '뺄셈만',
    mixed: '혼합',
    generateBtn: '<i class="fas fa-magic"></i> 학습지 만들기',
    showAnswersBtn: '<i class="fas fa-eye"></i> 정답 보기',
    pagesLabel: '페이지 수:',
    pagesTooltip: '각 페이지마다 새로운 랜덤 문제가 생성됩니다.',
    descTitle: '덧셈 &amp; 뺄셈 학습지 만들기',
  },
  'multiplication-table': {
    metaTitle: '무료 곱셈 나눗셈 학습지 생성기 - 아리클래스',
    metaDesc: '난이도 조절 가능한 곱셈, 나눗셈 수학 학습지를 무료로 만들어보세요. 연습 문제를 바로 출력하세요.',
    canonical: 'https://ariclass.com/ko/multiplication-table.html',
    h1: '곱셈 &amp; 나눗셈',
    multiplicationOnly: '곱셈만',
    divisionOnly: '나눗셈만',
    mixed: '혼합',
    generateBtn: '<i class="fas fa-magic"></i> 학습지 만들기',
    showAnswersBtn: '<i class="fas fa-eye"></i> 정답 보기',
    pagesLabel: '페이지 수:',
    pagesTooltip: '각 페이지마다 새로운 랜덤 문제가 생성됩니다.',
    descTitle: '곱셈 &amp; 나눗셈 학습지 만들기',
  },
  'clock': {
    metaTitle: '무료 시계 읽기 학습지 생성기 - 아리클래스',
    metaDesc: '아날로그 시계 읽기 및 시침 그리기 학습지를 무료로 만들어보세요. 초등학생 시간 개념 학습에 딱입니다.',
    canonical: 'https://ariclass.com/ko/clock.html',
    h1: '시계 읽기',
    mode: '모드',
    modeRead: '몇 시일까요?',
    modeDraw: '시침 그리기',
    handColor: '시침 색상',
    handBW: '흑백',
    handColor2: '컬러',
    timeInterval: '시간 단위',
    numClocks: '시계 개수',
    generateBtn: '<i class="fas fa-magic"></i> 생성하기',
    pagesLabel: '페이지 수:',
    pagesTooltip: '각 페이지마다 새로운 랜덤 문제가 생성됩니다.',
    descTitle: '시계 읽기 학습지 만들기',
  }
};

// Language selector HTML (ko selected)
const langSelectorKO = `<select id="language-selector">
                    <option value="en">English</option>
                    <option value="ko" selected>한국어</option>
                </select>`;

// Common nav template
function buildNav(currentPage) {
  return `<ul class="nav-links">
                    <li><a href="index.html">${commonKO.navHome}</a></li>
                    <li class="dropdown">
                        <a href="javascript:void(0)">${commonKO.navWorksheets}</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">${commonKO.navWordSearch}</a></li>
                            <li><a href="unscramble.html">${commonKO.navUnscramble}</a></li>
                            <li><a href="crossword.html">${commonKO.navCrossword}</a></li>
                            <li><a href="matching-lists.html">${commonKO.navMatchingLists}</a></li>
                            <li><a href="bingo.html">${commonKO.navBingo}</a></li>
                            <li><a href="sudoku.html">${commonKO.navSudoku}</a></li>
                            <li><a href="maze.html">${commonKO.navMaze}</a></li>
                            <li><a href="addition-subtraction.html">${commonKO.navAddSub}</a></li>
                            <li><a href="multiplication-table.html">${commonKO.navMultDiv}</a></li>
                            <li><a href="clock.html">${commonKO.navClock}</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">${commonKO.navHowToUse}</a></li>
                </ul>`;
}

function buildMobileNav() {
  return `<nav class="mobile-nav" id="mobileNav">
        <a href="index.html">${commonKO.navHome}</a>
        <a href="word-search.html">${commonKO.navWordSearch}</a>
        <a href="unscramble.html">${commonKO.navUnscramble}</a>
        <a href="crossword.html">${commonKO.navCrossword}</a>
        <a href="matching-lists.html">${commonKO.navMatchingLists}</a>
        <a href="bingo.html">${commonKO.navBingo}</a>
        <a href="sudoku.html">${commonKO.navSudoku}</a>
        <a href="maze.html">${commonKO.navMaze}</a>
        <a href="addition-subtraction.html">${commonKO.navAddSub}</a>
        <a href="multiplication-table.html">${commonKO.navMultDiv}</a>
        <a href="clock.html">${commonKO.navClock}</a>
        <a href="how-to-use.html">${commonKO.navHowToUse}</a>
    </nav>`;
}

function buildFooter() {
  return `<footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>${commonKO.footerAbout}</p>
            </div>
            <nav class="footer-nav">
                <h3>${commonKO.footerQuickLinks}</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">${commonKO.navHome}</a></li>
                    <li><a href="word-search.html">${commonKO.navWordSearch}</a></li>
                    <li><a href="unscramble.html">${commonKO.navUnscramble}</a></li>
                    <li><a href="crossword.html">${commonKO.navCrossword}</a></li>
                    <li><a href="matching-lists.html">${commonKO.navMatchingLists}</a></li>
                    <li><a href="bingo.html">${commonKO.navBingo}</a></li>
                    <li><a href="sudoku.html">${commonKO.navSudoku}</a></li>
                    <li><a href="maze.html">${commonKO.navMaze}</a></li>
                    <li><a href="addition-subtraction.html">${commonKO.navAddSub}</a></li>
                    <li><a href="multiplication-table.html">${commonKO.navMultDiv}</a></li>
                    <li><a href="clock.html">${commonKO.navClock}</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>${commonKO.footerInfo}</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">${commonKO.footerPrivacy}</a></li>
                    <li><a href="../terms-of-use.html">${commonKO.footerTerms}</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">${commonKO.footerContact}</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>${commonKO.footerContactTitle}</h3>
                <a href="mailto:yourtap1000@gmail.com">yourtap1000@gmail.com</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>${commonKO.footerRights}</p>
        </div>
    </footer>`;
}

function buildLangScript(currentPage) {
  // Determine English equivalent page
  const enPage = `../${currentPage}.html`;
  return `<script>
        (function() {
            var btn = document.getElementById('hamburgerBtn');
            var nav = document.getElementById('mobileNav');
            if (!btn || !nav) return;
            btn.addEventListener('click', function() {
                btn.classList.toggle('open');
                nav.classList.toggle('open');
            });
        })();
        document.getElementById('language-selector').addEventListener('change', function() {
            if (this.value === 'en') {
                window.location.href = '${enPage}';
            }
        });
    </script>`;
}

function buildHeader(page) {
  const p = pageKO[page];
  const cssExtra = getCssExtra(page);
  const adsense = `<!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5619502783367221"
     crossorigin="anonymous"></script>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${p.metaDesc}">
    <title>${p.metaTitle}</title>
    <link rel="canonical" href="${p.canonical}">
    <link rel="alternate" hreflang="en" href="https://ariclass.com/${page}.html">
    <link rel="alternate" hreflang="ko" href="${p.canonical}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon.ico">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/generator.css">
    ${cssExtra}<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ${adsense}
</head>
<body>
    <div class="utility-nav">
        <div class="container">
            <div class="language-select">
                ${langSelectorKO}
            </div>
        </div>
    </div>
    <header>
        <div class="main-header">
            <div class="container">
                <div class="logo">
                    <a href="index.html">
                        <img src="../images/main-logo.png" alt="AriClass Logo" class="logo-img">
                    </a>
                </div>
                <div class="site-description">
                    <p class="site-title">${commonKO.siteTitle}</p>
                    <p>${commonKO.siteSubtitle}</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                ${buildNav(page)}
            </div>
        </nav>
        ${buildMobileNav()}
    </header>`;
}

function getCssExtra(page) {
  const cssMap = {
    'crossword': '    <link rel="stylesheet" href="../css/crossword.css">\n    ',
    'matching-lists': '    <link rel="stylesheet" href="../css/matching-lists.css">\n    ',
    'bingo': '    <link rel="stylesheet" href="../css/bingo.css">\n    ',
    'sudoku': '    <link rel="stylesheet" href="../css/sudoku.css">\n    ',
    'maze': '    <link rel="stylesheet" href="../css/maze.css">\n    ',
    'addition-subtraction': '    <link rel="stylesheet" href="../css/addition-subtraction.css">\n    ',
    'multiplication-table': '    <link rel="stylesheet" href="../css/multiplication-table.css">\n    ',
    'clock': '    <link rel="stylesheet" href="../css/clock.css">\n    ',
  };
  return cssMap[page] || '';
}

// ---- Page content builders ----

function buildWordSearch() {
  const p = pageKO['word-search'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                </div>
                <div class="word-input">
                    <h2>${p.enterWords}</h2>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="${p.enterWordsPlaceholder}"></textarea>
                    <button id="add-word-btn" class="clear-btn">
                        ${p.clearBtn}
                    </button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option">
                                <input type="radio" id="level1" name="level" value="1">
                                <label for="level1">${commonKO.level1Easy}</label>
                            </div>
                            <div class="level-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">${commonKO.level2Medium}</label>
                            </div>
                            <div class="level-option">
                                <input type="radio" id="level3" name="level" value="3" checked>
                                <label for="level3">${commonKO.level3Hard}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words" checked> 대문자</label>
                            <label><input type="radio" name="case" id="lowercase-words"> 소문자</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="show-word-list" checked> ${p.showWordList}</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> ${p.diagonal}</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> ${p.reverse}</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>${p.descStep1}</li>
                        <li>${p.descStep2}</li>
                        <li>${p.descStep3}</li>
                        <li>${p.descStep4}</li>
                        <li>${p.descStep5}</li>
                        <li>${p.descStep6}</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>어휘 인식 및 철자 능력 향상</li>
                        <li>패턴 인식 및 시각적 탐색 능력 향상</li>
                        <li>ESL/EFL 학생과 초등학생에게 적합</li>
                        <li>수업 또는 숙제 활동으로 활용 가능</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>주제별 단어 목록으로 어휘를 집중 학습하세요</li>
                        <li>초보자는 짧은 단어부터 시작하세요</li>
                        <li>고급 학생에게는 대각선과 역방향 옵션을 사용하세요</li>
                        <li>수업 활동으로 여러 장 출력해서 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/wordSearch.js"></script>`;
}

function buildUnscramble() {
  const p = pageKO['unscramble'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitleFull}</label>
                    </div>
                </div>
                <div class="word-input">
                    <h2>${p.enterSentences}</h2>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="${p.sentencePlaceholder}"></textarea>
                    <button id="clearButton" class="clear-btn">${p.clearBtn}</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <label><input type="checkbox" id="capitalize-first" checked> ${p.capitalizeFirst}</label>
                    </div>
                    <div class="option-group">
                        <h2>${p.layoutFormat}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="one-column" name="column-format" value="1" checked>
                                <label for="one-column">${p.oneColumn}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="two-columns" name="column-format" value="2">
                                <label for="two-columns">${p.twoColumns}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>${p.spacing}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-compact" name="question-spacing" value="compact">
                                <label for="spacing-compact">${p.compact}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked>
                                <label for="spacing-normal">${p.normal}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="question-spacing" value="wide">
                                <label for="spacing-wide">${p.wide}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>텍스트 박스에 문장을 입력하세요</li>
                        <li>각 문장은 마침표(.)로 끝나야 합니다</li>
                        <li>"학습지 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>문장 구조 이해력 향상</li>
                        <li>어순 파악 능력 향상</li>
                        <li>ESL/EFL 학생에게 적합</li>
                        <li>논리적 사고력 개발</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>초보자는 짧고 간단한 문장부터 시작하세요</li>
                        <li>현재 수업 주제의 어휘를 활용하세요</li>
                        <li>워밍업 또는 복습 활동으로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/unscramble.js"></script>`;
}

function buildCrossword() {
  const p = pageKO['crossword'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitle}</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>${p.enterWordsClues}</h2>
                        <button id="reset-words-btn" class="reset-btn" title="초기화">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn">${p.addWord}</button>
                    <button id="clear-all-btn" class="clear-btn">${p.clearAll}</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn">${commonKO.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled>${commonKO.printBtn}</button>
                        <button class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>단어와 힌트를 입력하세요</li>
                        <li>"퍼즐 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>어휘 및 철자 능력 향상</li>
                        <li>문제 해결 능력 개발</li>
                        <li>ESL/EFL 학생에게 적합</li>
                        <li>독해력 강화</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>명확하고 학생 수준에 맞는 힌트를 작성하세요</li>
                        <li>특정 수업에 맞는 주제별 어휘를 활용하세요</li>
                        <li>초보자는 작은 퍼즐부터 시작하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/crossword.js"></script>`;
}

function buildMatchingLists() {
  const p = pageKO['matching-lists'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitle}</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>${p.enterWordPairs}</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="초기화">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn">${p.addPair}</button>
                    <button id="clear-all-btn" class="clear-btn">${p.clearAll}</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="uppercase" name="letter-case" value="uppercase">
                                <label for="uppercase">대문자</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="lowercase" name="letter-case" value="lowercase" checked>
                                <label for="lowercase">소문자</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">${p.fontSize}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="font-small" name="font-size" value="small">
                                <label for="font-small">${commonKO.fontSmall}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-medium" name="font-size" value="medium" checked>
                                <label for="font-medium">${commonKO.fontMedium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-large" name="font-size" value="large">
                                <label for="font-large">${commonKO.fontLarge}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                        <button class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>연결할 단어 짝을 추가하세요</li>
                        <li>"목록 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>어휘 이해력 향상</li>
                        <li>단어 연상 능력 향상</li>
                        <li>ESL/EFL 학생에게 적합</li>
                        <li>학습 연결고리 강화</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>명확하고 관련성 있는 단어 짝을 사용하세요</li>
                        <li>복습 활동으로 활용하세요</li>
                        <li>다른 학습 활동과 함께 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/matching-lists.js"></script>`;
}

function buildBingo() {
  const p = pageKO['bingo'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요" value="Bingo Game">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitle}</label>
                    </div>
                </div>
                <div class="word-input">
                    <h2>${p.enterWords}</h2>
                    <textarea id="wordInput" class="vocab-textarea" placeholder="${p.enterWordsPlaceholder}"></textarea>
                    <button id="clearButton" class="clear-btn">${p.clearBtn}</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>${p.boardSize}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="board-3" name="board-size" value="3">
                                <label for="board-3">3 x 3</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="board-4" name="board-size" value="4" checked>
                                <label for="board-4">4 x 4</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="board-5" name="board-size" value="5">
                                <label for="board-5">5 x 5</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>${p.fontSize}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="font-small" name="font-size" value="small">
                                <label for="font-small">${commonKO.fontSmall}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-medium" name="font-size" value="medium" checked>
                                <label for="font-medium">${commonKO.fontMedium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-large" name="font-size" value="large">
                                <label for="font-large">${commonKO.fontLarge}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>${p.numPlayers} <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">${p.numPlayersTooltip}</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>단어를 입력하거나 랜덤 생성을 사용하세요</li>
                        <li>빙고 보드 크기를 선택하세요 (3x3, 4x4, 5x5)</li>
                        <li>플레이어 수를 선택하세요</li>
                        <li>"빙고 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>어휘 인식 능력 향상</li>
                        <li>적극적인 수업 참여 유도</li>
                        <li>그룹 활동에 적합</li>
                        <li>재미있고 참여적인 학습 환경 조성</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>주제별 어휘 세트를 활용하세요</li>
                        <li>어린 학생에게는 작은 보드부터 시작하세요</li>
                        <li>복습 활동으로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/bingo.js"></script>`;
}

function buildSudoku() {
  const p = pageKO['sudoku'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitleFull}</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>${commonKO.difficultyLevel}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked>
                                <label for="difficulty-easy">${commonKO.easy}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-medium" name="difficulty" value="medium">
                                <label for="difficulty-medium">${commonKO.medium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-hard" name="difficulty" value="hard">
                                <label for="difficulty-hard">${commonKO.hard}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-expert" name="difficulty" value="expert">
                                <label for="difficulty-expert">${commonKO.expert}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                        <button id="answer-btn" class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>난이도를 선택하세요 (쉬움, 보통, 어려움, 전문가)</li>
                        <li>"퍼즐 만들기" 버튼을 클릭하세요</li>
                        <li>"정답 보기"로 정답을 확인하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>논리적 사고력 및 문제 해결 능력 향상</li>
                        <li>수 인식 및 패턴 인식 향상</li>
                        <li>집중력 및 주의력 개발</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>초보자는 쉬움 단계부터 시작하세요</li>
                        <li>고급 학생에게는 어려움 또는 전문가 단계를 사용하세요</li>
                        <li>워밍업 활동이나 수학 심화 문제로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/sudoku.js"></script>`;
}

function buildMaze() {
  const p = pageKO['maze'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitleFull}</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>${commonKO.difficultyLevel}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="diff-easy" name="difficulty" value="easy">
                                <label for="diff-easy">${commonKO.easy}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="diff-medium" name="difficulty" value="medium" checked>
                                <label for="diff-medium">${commonKO.medium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="diff-hard" name="difficulty" value="hard">
                                <label for="diff-hard">${commonKO.hard}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>${p.mazeType}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="type-grid" name="maze-type" value="grid" checked>
                                <label for="type-grid">${p.mazeGrid}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">${p.randomBtn}</button>
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                        <button id="answer-btn" class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>난이도를 선택하세요 (쉬움 10x10, 보통 15x15, 어려움 20x20)</li>
                        <li>"퍼즐 만들기" 버튼을 클릭하세요</li>
                        <li>"정답 보기"로 빨간색 경로를 확인하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>문제 해결 및 비판적 사고력 향상</li>
                        <li>공간 감각 및 시각적 인식 향상</li>
                        <li>인내심 및 집중력 개발</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>어린 학생은 쉬움(10x10)부터 시작하세요</li>
                        <li>대부분의 학생에게는 보통(15x15)을 사용하세요</li>
                        <li>워밍업 또는 문제 해결 활동으로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/maze.js"></script>`;
}

function buildAdditionSubtraction() {
  const p = pageKO['addition-subtraction'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitleFull}</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="operation" id="addition-only" value="addition" checked> ${p.additionOnly}</label>
                            <label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> ${p.subtractionOnly}</label>
                            <label><input type="radio" name="operation" id="mixed" value="mixed"> ${p.mixed}</label>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">${commonKO.difficultyLevel}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="level1" name="level" value="1" checked>
                                <label for="level1">${commonKO.level1Easy}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">${commonKO.level2Medium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level3" name="level" value="3">
                                <label for="level3">${commonKO.level3Hard}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ${p.pagesLabel}
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">${p.pagesTooltip}</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                        <button id="answer-btn" class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>연산 유형을 선택하세요 (덧셈, 뺄셈, 혼합)</li>
                        <li>난이도를 선택하세요</li>
                        <li>페이지 수를 설정하세요</li>
                        <li>"학습지 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>암산 및 계산 능력 향상</li>
                        <li>수 감각 및 자릿값 이해 강화</li>
                        <li>초등학생에게 적합</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>초보자는 쉬운 단계부터 시작하세요</li>
                        <li>혼합 연산으로 학생에게 도전을 제공하세요</li>
                        <li>매일 워밍업 활동으로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/addition-subtraction.js"></script>`;
}

function buildMultiplicationTable() {
  const p = pageKO['multiplication-table'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitleFull}</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> ${p.multiplicationOnly}</label>
                            <label><input type="radio" name="operation" id="division-only" value="division"> ${p.divisionOnly}</label>
                            <label><input type="radio" name="operation" id="mixed" value="mixed"> ${p.mixed}</label>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">${commonKO.difficultyLevel}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="level1" name="level" value="1" checked>
                                <label for="level1">${commonKO.level1Easy}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">${commonKO.level2Medium}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level3" name="level" value="3">
                                <label for="level3">${commonKO.level3Hard}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ${p.pagesLabel}
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">${p.pagesTooltip}</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                        <button id="answer-btn" class="answer-btn">${p.showAnswersBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>학습지 제목을 입력하세요</li>
                        <li>연산 유형을 선택하세요 (곱셈, 나눗셈, 혼합)</li>
                        <li>난이도를 선택하세요</li>
                        <li>페이지 수를 설정하세요</li>
                        <li>"학습지 만들기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>곱셈 및 나눗셈 능력 향상</li>
                        <li>수학적 유창성 강화</li>
                        <li>초등학생에게 적합</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>구구단 연습에 활용하세요</li>
                        <li>혼합 연산으로 학생에게 도전을 제공하세요</li>
                        <li>매일 워밍업 활동으로 활용하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/multiplication-table.js"></script>`;
}

function buildClock() {
  const p = pageKO['clock'];
  return `
    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>${commonKO.worksheetTitle}</h2>
                    <input type="text" id="worksheet-title" placeholder="학습지 제목을 입력하세요" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> ${commonKO.showTitle}</label>
                    </div>
                </div>
                <div class="options clock-options">
                    <div class="option-group">
                        <h2 style="text-align:center">${p.mode}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="mode-read" name="clock-mode" value="read" checked>
                                <label for="mode-read">${p.modeRead}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="mode-draw" name="clock-mode" value="draw">
                                <label for="mode-draw">${p.modeDraw}</label>
                                <label style="display:flex;align-items:center;gap:0.2rem;margin-left:0.6rem;font-size:0.8rem;color:#888;cursor:pointer;">
                                    <input type="checkbox" id="hide-time-label"><s>12:00</s>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">${p.handColor}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="color-bw" name="clock-color" value="bw">
                                <label for="color-bw">${p.handBW}</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="color-color" name="clock-color" value="color" checked>
                                <label for="color-color">${p.handColor2}</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">${p.timeInterval}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="interval-hour" name="clock-interval" value="hour">
                                <label for="interval-hour">1시간</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-half" name="clock-interval" value="half">
                                <label for="interval-half">30분</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked>
                                <label for="interval-quarter">15분</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-five" name="clock-interval" value="five">
                                <label for="interval-five">5분</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">${p.numClocks}</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="count-1" name="clock-count" value="1">
                                <label for="count-1">1</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="count-6" name="clock-count" value="6">
                                <label for="count-6">6</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="count-9" name="clock-count" value="9">
                                <label for="count-9">9</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="count-12" name="clock-count" value="12" checked>
                                <label for="count-12">12</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center; border-top: 1px solid #e0e0e0; padding-top: 1rem;">
                        <label>
                            ${p.pagesLabel}
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">${p.pagesTooltip}</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn">${p.generateBtn}</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">${commonKO.previewLabel}</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">${commonKO.printBtn}</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>${p.descTitle}</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>만드는 방법</h3>
                    <ol>
                        <li>모드를 선택하세요: 시간 읽기 또는 시침 그리기</li>
                        <li>시간 단위를 선택하세요 (1시간, 30분, 15분, 5분)</li>
                        <li>페이지당 시계 개수를 설정하세요</li>
                        <li>"생성하기" 버튼을 클릭하세요</li>
                        <li>출력 버튼으로 학습지를 인쇄하세요</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>교육적 효과</h3>
                    <ul>
                        <li>아날로그 시계 읽기 능력 향상</li>
                        <li>수 감각 및 시간 개념 강화</li>
                        <li>읽기와 쓰기 두 가지 모드 제공</li>
                        <li>시간 단위별 난이도 조절 가능</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>선생님 팁</h3>
                    <ul>
                        <li>초보자는 "1시간" 단위부터 시작하세요</li>
                        <li>5분 단위로 고급 학생에게 도전을 제공하세요</li>
                        <li>시침 그리기 모드로 실기 연습을 해보세요</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/clock.js"></script>`;
}

const contentBuilders = {
  'word-search': buildWordSearch,
  'unscramble': buildUnscramble,
  'crossword': buildCrossword,
  'matching-lists': buildMatchingLists,
  'bingo': buildBingo,
  'sudoku': buildSudoku,
  'maze': buildMaze,
  'addition-subtraction': buildAdditionSubtraction,
  'multiplication-table': buildMultiplicationTable,
  'clock': buildClock,
};

// Generate all pages
if (!fs.existsSync('ko')) fs.mkdirSync('ko');

for (const page of pages) {
  const header = buildHeader(page);
  const content = contentBuilders[page]();
  const footer = buildFooter();
  const langScript = buildLangScript(page);

  const html = `${header}

${content}

${footer}

${langScript}
</body>
</html>
`;

  fs.writeFileSync(`ko/${page}.html`, html, 'utf8');
  console.log(`Generated ko/${page}.html`);
}

console.log('\nAll Korean pages generated successfully!');
