const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const mobileNavHTML = `
    <!-- Mobile Nav Drawer -->
    <nav class="mobile-nav" id="mobileNav">
        <a href="index.html">Home</a>
        <a href="word-search.html">Word Search</a>
        <a href="unscramble.html">Unscramble</a>
        <a href="crossword.html">Crossword Puzzle</a>
        <a href="matching-lists.html">Matching Lists</a>
        <a href="bingo.html">Bingo Game</a>
        <a href="sudoku.html">Sudoku</a>
        <a href="maze.html">Maze Puzzle</a>
        <a href="addition-subtraction.html">Addition &amp; Subtraction</a>
        <a href="how-to-use.html">How to Use</a>
    </nav>`;

const hamburgerBtn = `<button class="hamburger" id="hamburgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>`;

const mobileScript = `
    <script>
        (function() {
            var btn = document.getElementById('hamburgerBtn');
            var nav = document.getElementById('mobileNav');
            if (!btn || !nav) return;
            btn.addEventListener('click', function() {
                btn.classList.toggle('open');
                nav.classList.toggle('open');
            });
        })();
    </script>`;

let changed = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // 이미 처리된 파일 스킵
    if (html.includes('mobileNav')) {
        console.log(`  skip (already done): ${file}`);
        return;
    }

    // 1. </header> 바로 앞에 mobile-nav 삽입
    if (!html.includes('</header>')) {
        console.log(`  skip (no </header>): ${file}`);
        return;
    }
    html = html.replace('</header>', mobileNavHTML + '\n    </header>');

    // 2. main-header 컨테이너 안에 햄버거 버튼 추가 (logo div 다음)
    // logo a 닫힌 후 </div> 다음에 hamburger 추가
    html = html.replace(
        /<div class="main-header">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<nav class="top-menu">/,
        (match) => {
            // container 닫기 전에 hamburger 삽입
            return match.replace(
                /([ \t]*<\/div>\s*<\/div>\s*)(<nav class="top-menu">)/,
                '$1' + '        ' + hamburgerBtn + '\n    $2'
            );
        }
    );

    // 3. </body> 바로 전에 모바일 스크립트 삽입
    html = html.replace('</body>', mobileScript + '\n</body>');

    fs.writeFileSync(filePath, html, 'utf8');
    changed++;
    console.log(`  updated: ${file}`);
});

console.log(`\nDone. ${changed} files updated.`);
