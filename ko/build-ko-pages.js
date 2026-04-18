// Script to generate Korean versions of new pages
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KO = __dirname;

const KO_NAV = `    <div class="utility-nav">
        <div class="container">
            <div class="language-select">
                <select id="language-selector">
                    <option value="en">English</option>
                    <option value="ko" selected>한국어</option>
                </select>
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
                    <h1>아리클래스 : 학습지 생성기</h1>
                    <p>영어, 수학 등 맞춤 학습지를 몇 초 만에 만들어보세요. 교사와 학생 모두에게 완벽!</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">홈</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">영어</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">단어 찾기</a></li>
                            <li><a href="unscramble.html">문장 배열</a></li>
                            <li><a href="crossword.html">십자말풀이</a></li>
                            <li><a href="matching-lists.html">단어 연결</a></li>
                            <li><a href="bingo.html">빙고 게임</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">수학</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">덧셈 &amp; 뺄셈</a></li>
                            <li><a href="multiplication-table.html">곱셈 &amp; 나눗셈</a></li>
                            <li><a href="clock.html">시계 읽기</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">퍼즐</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">스도쿠</a></li>
                            <li><a href="maze.html">미로 퍼즐</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">인쇄용 시트</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">체크리스트</a></li>
                            <li><a href="vocab-test.html">노트 시트</a></li>
                            <li><a href="writing-paper.html">쓰기 노트</a></li>
                            <li><a href="mind-map.html">마인드맵</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">사용 방법</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">홈</a>
            <a href="word-search.html">단어 찾기</a>
            <a href="unscramble.html">문장 배열</a>
            <a href="crossword.html">십자말풀이</a>
            <a href="matching-lists.html">단어 연결</a>
            <a href="bingo.html">빙고 게임</a>
            <a href="addition-subtraction.html">덧셈 &amp; 뺄셈</a>
            <a href="multiplication-table.html">곱셈 &amp; 나눗셈</a>
            <a href="clock.html">시계 읽기</a>
            <a href="sudoku.html">스도쿠</a>
            <a href="maze.html">미로 퍼즐</a>
            <a href="checklist.html">체크리스트</a>
            <a href="vocab-test.html">노트 시트</a>
            <a href="writing-paper.html">쓰기 노트</a>
            <a href="mind-map.html">마인드맵</a>
            <a href="how-to-use.html">사용 방법</a>
        </nav>
    </header>`;

const KO_FOOTER = `    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>아리클래스는 영어, 수학 등 다양한 과목의 무료 학습지를 제공합니다.</p>
            </div>
            <nav class="footer-nav">
                <h3>바로가기</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">홈</a></li>
                    <li><a href="word-search.html">단어 찾기</a></li>
                    <li><a href="unscramble.html">문장 배열</a></li>
                    <li><a href="checklist.html">체크리스트</a></li>
                    <li><a href="vocab-test.html">노트 시트</a></li>
                    <li><a href="addition-subtraction.html">덧셈 &amp; 뺄셈</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>정보</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">개인정보처리방침</a></li>
                    <li><a href="../terms-of-use.html">이용약관</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">문의하기</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>문의하기</h3>
                <a href="mailto:yourtap1000@gmail.com">yourtap1000@gmail.com</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 Ariclass. All rights reserved.</p>
        </div>
    </footer>`;

function readEN(fname) {
    return fs.readFileSync(path.join(ROOT, fname), 'utf8');
}

function fixPaths(html) {
    return html
        .replace(/href="favicon\.ico"/g, 'href="../favicon.ico"')
        .replace(/href="css\//g, 'href="../css/')
        .replace(/src="js\//g, 'src="../js/')
        .replace(/src="images\//g, 'src="../images/');
}

function replaceNavFooter(html, enFile, koFile, langHandlerEn) {
    // Replace utility-nav through </header>
    html = html.replace(
        /<div class="utility-nav">[\s\S]*?<\/header>/,
        KO_NAV
    );
    // Replace footer
    html = html.replace(
        /<footer>[\s\S]*?<\/footer>/,
        KO_FOOTER
    );
    // Add language selector handler before </script> near hamburger
    const langScript = `\n        document.getElementById('language-selector').addEventListener('change', function() {\n            if (this.value === 'en') window.location.href = '${langHandlerEn}';\n        });`;
    html = html.replace(
        "btn.classList.toggle('open');\n                nav.classList.toggle('open');\n            });\n        })();",
        "btn.classList.toggle('open');\n                nav.classList.toggle('open');\n            });\n        })();" + langScript
    );
    return html;
}

// ── 1. checklist.html ──────────────────────────────────────────────
{
    let h = readEN('checklist.html');
    h = h.replace('lang="en"', 'lang="ko"');
    h = h.replace(
        '<meta name="description" content="Free printable checklist templates for teachers and students. Choose 1, 2, or 4 per page layout — ready to print in seconds.">',
        '<meta name="description" content="교사와 학생을 위한 무료 인쇄용 체크리스트 템플릿. 1, 2, 4장 레이아웃 선택 가능 — 바로 출력 가능.">'
    );
    h = h.replace('<title>Free Checklist Generator - AriClass</title>',
        '<title>무료 체크리스트 생성기 - 아리클래스</title>');
    h = fixPaths(h);
    h = replaceNavFooter(h, 'checklist.html', 'checklist.html', '../checklist.html');
    // content
    h = h.replace('<h1>Checklist</h1>', '<h1>체크리스트</h1>');
    h = h.replace('>Worksheet Title</h2>', '>학습지 제목</h2>');
    h = h.replace('>Text</label>', '>텍스트</label>');
    h = h.replace('>Line</label>', '>밑줄</label>');
    h = h.replace('>None</label>', '>없음</label>');
    h = h.replace('placeholder="Enter worksheet title"', 'placeholder="학습지 제목을 입력하세요"');
    h = h.replace('>Layout <span', '>레이아웃 <span');
    h = h.replace('2 per page: Cut along the dashed line to separate into 2 sheets. 4 per page: Cut along the cross lines to separate into 4 sheets.',
        '2장: 점선을 따라 잘라 2장으로 분리하세요. 4장: 십자 선을 따라 잘라 4장으로 분리하세요.');
    h = h.replace('>1 per page</label>', '>1장</label>');
    h = h.replace('>2 per page</label>', '>2장</label>');
    h = h.replace('>4 per page</label>', '>4장</label>');
    h = h.replace('>Columns</h2>', '>열 수</h2>');
    h = h.replace('>1 Column</label>', '>1열</label>');
    h = h.replace('>2 Columns</label>', '>2열</label>');
    h = h.replace('>Row Spacing</h2>', '>줄 간격</h2>');
    h = h.replace('>Narrow</label>', '>좁게</label>');
    h = h.replace('>Normal</label>', '>보통</label>');
    h = h.replace('>Wide</label>', '>넓게</label>');
    h = h.replace('>Numbering</h2>', '>번호 매기기</h2>');
    h = h.replace('>With Numbers</label>', '>번호 있음</label>');
    h = h.replace('>Without</label>', '>번호 없음</label>');
    h = h.split('fa-print"></i> Print Worksheet').join('fa-print"></i> 학습지 인쇄');
    h = h.replace('>Preview</div>', '>미리보기</div>');
    h = h.replace('How to Use Checklist Templates', '체크리스트 템플릿 사용 방법');
    h = h.replace('<h3>1 Per Page</h3>', '<h3>1장</h3>');
    h = h.replace('Full A4 portrait page with checkbox rows', '체크박스 줄이 있는 A4 전체 페이지');
    h = h.replace('Includes Date and Name fields at the top', '상단에 날짜 및 이름 칸 포함');
    h = h.replace('Great for longer task lists or to-do items', '긴 할 일 목록에 적합');
    h = h.replace('<h3>2 Per Page</h3>', '<h3>2장</h3>');
    h = h.replace('Two checklists on one A4 page', 'A4 한 페이지에 체크리스트 2개');
    h = h.replace('Cut along the dashed line to separate', '점선을 따라 잘라 분리하세요');
    h = h.replace("Perfect for shorter lists \u2014 saves paper!", '짧은 목록에 적합 — 용지 절약!');
    h = h.replace('<h3>4 Per Page</h3>', '<h3>4장</h3>');
    h = h.replace('Four mini checklists in a 2\u00d72 grid', '2×2 격자의 미니 체크리스트 4개');
    h = h.replace('Cut out each cell separately', '각 칸을 잘라 사용하세요');
    h = h.replace('Ideal for quick daily tasks or small assignments', '간단한 일일 과제나 소규모 활동에 적합');
    fs.writeFileSync(path.join(KO, 'checklist.html'), h, 'utf8');
    console.log('checklist.html done');
}

// ── 2. vocab-test.html ─────────────────────────────────────────────
{
    let h = readEN('vocab-test.html');
    h = h.replace('lang="en"', 'lang="ko"');
    h = h.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="교사와 학생을 위한 무료 인쇄용 노트 시트. 1, 2, 4장 레이아웃 선택 가능 — 바로 출력 가능.">');
    h = h.replace(/<title>[^<]*<\/title>/, '<title>무료 노트 시트 생성기 - 아리클래스</title>');
    h = fixPaths(h);
    h = replaceNavFooter(h, 'vocab-test.html', 'vocab-test.html', '../vocab-test.html');
    h = h.replace('<h1>Note Sheet</h1>', '<h1>노트 시트</h1>');
    h = h.replace('>Layout <span', '>레이아웃 <span');
    h = h.replace('2 per page: Cut along the dashed line to separate into 2 sheets. 4 per page: Cut along the cross lines to separate into 4 sheets.',
        '2장: 점선을 따라 잘라 2장으로 분리하세요. 4장: 십자 선을 따라 잘라 4장으로 분리하세요.');
    h = h.replace('>1 per page</label>', '>1장</label>');
    h = h.replace('>2 per page</label>', '>2장</label>');
    h = h.replace('>4 per page</label>', '>4장</label>');
    h = h.replace('>Line Style</h2>', '>줄 스타일</h2>');
    h = h.replace('>Solid</label>', '>실선</label>');
    h = h.replace('>Dashed</label>', '>점선</label>');
    h = h.replace('>Bold</label>', '>굵은선</label>');
    h = h.replace('>Line Spacing</h2>', '>줄 간격</h2>');
    h = h.replace('>Narrow</label>', '>좁게</label>');
    h = h.replace('>Normal</label>', '>보통</label>');
    h = h.replace('>Wide</label>', '>넓게</label>');
    h = h.split('fa-print"></i> Print Worksheet').join('fa-print"></i> 학습지 인쇄');
    h = h.replace('>Preview</div>', '>미리보기</div>');
    h = h.replace('How to Use Note Sheets', '노트 시트 사용 방법');
    h = h.replace('<h3>1 Per Page</h3>', '<h3>1장</h3>');
    h = h.replace('Full A4 portrait page with writing lines', '줄이 있는 A4 전체 페이지');
    h = h.replace('Includes Date and Name fields at the top', '상단에 날짜 및 이름 칸 포함');
    h = h.replace('Great for longer vocabulary lists or note-taking', '긴 어휘 목록이나 노트 필기에 적합');
    h = h.replace('<h3>2 Per Page</h3>', '<h3>2장</h3>');
    h = h.replace('Two sheets on one A4 page (landscape halves)', 'A4 한 페이지에 노트 시트 2개');
    h = h.replace('Cut along the dashed line to separate', '점선을 따라 잘라 분리하세요');
    h = h.replace('Great for shorter vocabulary lists (saves paper!)', '짧은 어휘 목록에 적합 (용지 절약!)');
    h = h.replace('<h3>4 Per Page</h3>', '<h3>4장</h3>');
    h = h.replace('Four mini sheets in a 2\u00d72 grid on one A4 page', '2×2 격자의 미니 노트 시트 4개');
    h = h.replace('Cut out each cell separately', '각 칸을 잘라 사용하세요');
    h = h.replace('Perfect for quick quizzes or small word lists', '빠른 퀴즈나 소규모 단어 목록에 적합');
    fs.writeFileSync(path.join(KO, 'vocab-test.html'), h, 'utf8');
    console.log('vocab-test.html done');
}

// ── 3. writing-paper.html ──────────────────────────────────────────
{
    let h = readEN('writing-paper.html');
    h = h.replace('lang="en"', 'lang="ko"');
    h = h.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="영어 필기 및 문장 연습을 위한 무료 인쇄용 줄 노트 생성기.">');
    h = h.replace(/<title>[^<]*<\/title>/, '<title>무료 쓰기 노트 생성기 - 아리클래스</title>');
    h = fixPaths(h);
    h = replaceNavFooter(h, 'writing-paper.html', 'writing-paper.html', '../writing-paper.html');
    h = h.replace('<h1>Writing Paper</h1>', '<h1>쓰기 노트</h1>');
    h = h.replace('>Layout <span', '>레이아웃 <span');
    h = h.replace('2 per page: Cut along the dashed line to separate into 2 sheets. 4 per page: Cut along the cross lines to separate into 4 sheets.',
        '2장: 점선을 따라 잘라 2장으로 분리하세요. 4장: 십자 선을 따라 잘라 4장으로 분리하세요.');
    h = h.replace('>1 per page</label>', '>1장</label>');
    h = h.replace('>2 per page</label>', '>2장</label>');
    h = h.replace('>4 per page</label>', '>4장</label>');
    h = h.replace('>Line Spacing</h2>', '>줄 간격</h2>');
    h = h.replace('>Narrow</label>', '>좁게</label>');
    h = h.replace('>Normal</label>', '>보통</label>');
    h = h.replace('>Wide</label>', '>넓게</label>');
    h = h.replace('>Line Color</h2>', '>줄 색상</h2>');
    h = h.replace('>Black &amp; White</label>', '>흑백</label>');
    h = h.replace('>Red</label>', '>빨간색</label>');
    h = h.replace('>Blue</label>', '>파란색</label>');
    h = h.split('fa-print"></i> Print Worksheet').join('fa-print"></i> 학습지 인쇄');
    h = h.replace('>Preview</div>', '>미리보기</div>');
    h = h.replace('How to Use Writing Paper', '쓰기 노트 사용 방법');
    h = h.replace('<h3>1 Per Page</h3>', '<h3>1장</h3>');
    h = h.replace('Full A4 page with English ruling lines', '영어 줄이 있는 A4 전체 페이지');
    h = h.replace('3-line system: cap height, x-height (dashed), baseline', '3선 시스템: 대문자 높이, x-높이(점선), 기준선');
    h = h.replace('Includes Date and Name fields at the top', '상단에 날짜 및 이름 칸 포함');
    h = h.replace('<h3>2 Per Page</h3>', '<h3>2장</h3>');
    h = h.replace('Two sheets on one A4 page', 'A4 한 페이지에 쓰기 노트 2개');
    h = h.replace('Cut along the dashed line to separate', '점선을 따라 잘라 분리하세요');
    h = h.replace('Great for shorter writing exercises', '짧은 쓰기 연습에 적합');
    h = h.replace('<h3>4 Per Page</h3>', '<h3>4장</h3>');
    h = h.replace('Four mini sheets in a 2\u00d72 grid', '2×2 격자의 미니 쓰기 노트 4개');
    h = h.replace('Cut along the cross lines to separate', '십자 선을 따라 잘라 분리하세요');
    h = h.replace('Perfect for quick writing practice', '간단한 쓰기 연습에 적합');
    fs.writeFileSync(path.join(KO, 'writing-paper.html'), h, 'utf8');
    console.log('writing-paper.html done');
}

// ── 4. mind-map.html ───────────────────────────────────────────────
{
    let h = readEN('mind-map.html');
    h = h.replace('lang="en"', 'lang="ko"');
    h = h.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="브레인스토밍과 아이디어 정리를 위한 무료 마인드맵 템플릿 생성기.">');
    h = h.replace(/<title>[^<]*<\/title>/, '<title>무료 마인드맵 생성기 - 아리클래스</title>');
    h = fixPaths(h);
    h = replaceNavFooter(h, 'mind-map.html', 'mind-map.html', '../mind-map.html');
    h = h.replace('<h1>Mind Map</h1>', '<h1>마인드맵</h1>');
    h = h.replace('>Worksheet Title</h2>', '>학습지 제목</h2>');
    h = h.replace('placeholder="Enter worksheet title"', 'placeholder="학습지 제목을 입력하세요"');
    h = h.replace('>Center Shape</h2>', '>중앙 모양</h2>');
    h = h.replace('>Lightbulb</label>', '>전구</label>');
    h = h.replace('>Rounded Box</label>', '>둥근 상자</label>');
    h = h.replace('>Circle</label>', '>원</label>');
    h = h.replace('>Oval</label>', '>타원</label>');
    h = h.replace('>Underline</label>', '>밑줄</label>');
    h = h.replace('>None</label>', '>없음</label>');
    h = h.replace('>Center Size</h2>', '>중앙 크기</h2>');
    h = h.replace('>Small</label>', '>작게</label>');
    h = h.replace('>Medium</label>', '>보통</label>');
    h = h.replace('>Large</label>', '>크게</label>');
    h = h.replace('>Line Color</h2>', '>선 색상</h2>');
    h = h.replace('>Gray</label>', '>회색</label>');
    h = h.replace('>Black</label>', '>검정</label>');
    h = h.replace('>Blue</label>', '>파랑</label>');
    h = h.replace('>Green</label>', '>초록</label>');
    h = h.replace('>Red</label>', '>빨강</label>');
    h = h.split('fa-print"></i> Print Worksheet').join('fa-print"></i> 학습지 인쇄');
    h = h.replace('>Preview</div>', '>미리보기</div>');
    h = h.replace('How to Use Mind Map', '마인드맵 사용 방법');
    h = h.replace('<h3>4 Branches</h3>', '<h3>가지 4개</h3>');
    h = h.replace('4 main topic areas', '주제 영역 4개');
    h = h.replace('Great for simple categorization', '간단한 분류에 적합');
    h = h.replace('More space per branch for writing', '각 가지에 더 넓은 쓰기 공간');
    h = h.replace('<h3>6 Branches</h3>', '<h3>가지 6개</h3>');
    h = h.replace('6 main topic areas', '주제 영역 6개');
    h = h.replace('Perfect for most brainstorming tasks', '대부분의 브레인스토밍 활동에 적합');
    h = h.replace('Balanced layout around the center', '중앙 주변에 균형 잡힌 배치');
    h = h.replace('<h3>8 Branches</h3>', '<h3>가지 8개</h3>');
    h = h.replace('8 main topic areas', '주제 영역 8개');
    h = h.replace('Best for detailed mind mapping', '세밀한 마인드맵 작성에 최적');
    h = h.replace('Great for complex topics', '복잡한 주제에 적합');
    fs.writeFileSync(path.join(KO, 'mind-map.html'), h, 'utf8');
    console.log('mind-map.html done');
}

// ── 5. secret-code.html ────────────────────────────────────────────
{
    let h = readEN('secret-code.html');
    h = h.replace('lang="en"', 'lang="ko"');
    h = h.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="암호표를 이용해 기호를 영어 단어로 해독하는 시크릿 코드 학습지 생성기.">');
    h = h.replace(/<title>[^<]*<\/title>/, '<title>무료 시크릿 코드 생성기 - 아리클래스</title>');
    h = fixPaths(h);
    h = replaceNavFooter(h, 'secret-code.html', 'secret-code.html', '../secret-code.html');
    h = h.replace('<h1>Secret Code</h1>', '<h1>시크릿 코드</h1>');
    h = h.replace('>Worksheet Title</h2>', '>학습지 제목</h2>');
    h = h.replace('placeholder="Enter worksheet title"', 'placeholder="학습지 제목을 입력하세요"');
    h = h.replace('Show worksheet title', '학습지 제목 보이기');
    h = h.replace('>Enter Your Words</h2>', '>단어 입력</h2>');
    h = h.replace('title="Reset all words"', 'title="단어 초기화"');
    h = h.replace('placeholder="Enter one word per line&#10;Maximum 15 words"', 'placeholder="단어를 한 줄씩 입력하세요&#10;최대 15개"');
    h = h.replace('>Font Size</h2>', '>글씨 크기</h2>');
    h = h.replace('>Small</label>', '>작게</label>');
    h = h.replace('>Medium</label>', '>보통</label>');
    h = h.replace('>Large</label>', '>크게</label>');
    h = h.replace('>Layout</h2>', '>레이아웃</h2>');
    h = h.replace('(sentences)</span>', '(문장)</span>');
    h = h.replace('(words)</span>', '(단어)</span>');
    h = h.replace('>Cipher Key</h2>', '>암호 키</h2>');
    h = h.replace('> New Key</label>', '> 새 암호키</label>');
    h = h.replace('> Lock Key</label>', '> 암호키 고정</label>');
    h = h.replace('fa-random"></i> Randomly Generated', 'fa-random"></i> 랜덤 생성');
    h = h.replace('fa-key"></i> Generate', 'fa-key"></i> 생성');
    h = h.replace('>Preview</div>', '>미리보기</div>');
    h = h.split('fa-print"></i> Print Worksheet').join('fa-print"></i> 학습지 인쇄');
    h = h.replace('fa-eye"></i> Answer Key', 'fa-eye"></i> 정답지');
    h = h.replace('<p>Enter words and click Generate</p>', '<p>단어를 입력하고 생성 버튼을 클릭하세요</p>');
    h = h.replace('How to Use Secret Code', '시크릿 코드 사용 방법');
    h = h.replace('<h3>How It Works</h3>', '<h3>작동 원리</h3>');
    h = h.replace('Each letter A\u2013Z is assigned a unique symbol', 'A~Z 각 알파벳에 고유한 기호가 배정됩니다');
    h = h.replace('Words are shown as symbol sequences', '단어가 기호 순서로 표시됩니다');
    h = h.replace('Students use the code key to decode each word', '학생들이 암호표를 이용해 각 단어를 해독합니다');
    h = h.replace('<h3>Tips</h3>', '<h3>사용 팁</h3>');
    h = h.replace('Up to 15 words per worksheet', '학습지당 최대 15개 단어');
    h = h.replace('Click Generate for a new random cipher each time', '생성 버튼을 클릭할 때마다 새 암호가 생성됩니다');
    h = h.replace('Use the Answer Key option for self-checking', '자가 채점을 위해 정답지 옵션을 활용하세요');
    h = h.replace('<h3>Best For</h3>', '<h3>활용 방법</h3>');
    h = h.replace('Vocabulary review in a fun way', '재미있는 어휘 복습');
    h = h.replace('Fast finisher activity', '일찍 끝낸 학생을 위한 활동');
    h = h.replace('Spelling practice', '철자 연습');
    fs.writeFileSync(path.join(KO, 'secret-code.html'), h, 'utf8');
    console.log('secret-code.html done');
}

console.log('All done');
