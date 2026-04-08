const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const hamburgerBtn = `        <button class="hamburger" id="hamburgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>`;

let changed = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // 잘못된 위치(main-header 밖)에 있는 hamburger 제거 후 올바른 위치에 재삽입
    // 현재: </div>\n        </div>\n    </header.main-header>\n    <button...>\n    <nav class="top-menu">
    // 목표: main-header container 안에서 site-description 뒤, main-header 닫기 전

    // 1. 잘못 삽입된 버튼 제거
    html = html.replace(/\s*<button class="hamburger" id="hamburgerBtn"[^>]*>[\s\S]*?<\/button>\s*(?=<nav class="top-menu">)/g, '\n    ');

    // 2. main-header의 container div 끝 (site-description 이후) 에 삽입
    // 패턴: </div>\n        </div>\n    </div>  (3번째 </div>가 main-header container)
    // main-header > container > [logo, site-description] 구조
    // "</div>\n    </div>\n    <nav class=\"top-menu\">" 앞의 "</div>" 바로 전에 삽입
    html = html.replace(
        /(<\/div>\s*<\/div>\s*)(\s*<nav class="top-menu">)/,
        `$1        ${hamburgerBtn}\n$2`
    );

    fs.writeFileSync(filePath, html, 'utf8');
    changed++;
    console.log(`  fixed: ${file}`);
});

console.log(`\nDone. ${changed} files fixed.`);
