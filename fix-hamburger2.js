const fs = require('fs');
const path = require('path');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const btn = `\n                <button class="hamburger" id="hamburgerBtn" aria-label="Open menu"><span></span><span></span><span></span></button>`;

let changed = 0;
files.forEach(file => {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');

    // 1. 잘못된 위치의 hamburger 모두 제거
    html = html.replace(/\s*<button class="hamburger" id="hamburgerBtn"[^>]*><span><\/span><span><\/span><span><\/span><\/button>/g, '');

    // 2. site-description 닫히는 </div> 바로 다음, container 닫히는 </div> 전에 삽입
    //    구체적으로: </div>\n            </div>\n        </div>\n        <nav  패턴에서
    //    site-description </div> → container </div> → main-header </div> → <nav
    //    site-description </div> 뒤에 삽입
    html = html.replace(
        /(<\/div>\n)((\s*<\/div>)\n(\s*<\/div>)\n(\s*<nav class="top-menu">))/,
        `$1${btn}\n$2`
    );

    fs.writeFileSync(fp, html, 'utf8');
    changed++;
    console.log('  fixed:', file);
});
console.log(`Done. ${changed} files.`);
