const fs = require('fs');
const path = require('path');

const NAV = `    <div class="utility-nav">
        <div class="container">
            <div class="language-select">
                <select id="language-selector">
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                    <option value="ja" selected>日本語</option>
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
                    <p class="site-title">アリクラス：プリント作成ツール</p>
                    <p>教師と生徒のための無料プリント作成サービス</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="メニューを開く"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">ホーム</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">英語</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">単語探し</a></li>
                            <li><a href="unscramble.html">文章並び替え</a></li>
                            <li><a href="crossword.html">クロスワード</a></li>
                            <li><a href="matching-lists.html">単語マッチング</a></li>
                            <li><a href="bingo.html">ビンゴゲーム</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">算数</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">足し算・引き算</a></li>
                            <li><a href="multiplication-table.html">掛け算・割り算</a></li>
                            <li><a href="clock.html">時計の読み方</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">パズル</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">数独</a></li>
                            <li><a href="maze.html">迷路パズル</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">印刷用シート</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">チェックリスト</a></li>
                            <li><a href="vocab-test.html">ノートシート</a></li>
                            <li><a href="writing-paper.html">作文用紙</a></li>
                            <li><a href="mind-map.html">マインドマップ</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">使い方</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">ホーム</a>
            <a href="word-search.html">単語探し</a>
            <a href="unscramble.html">文章並び替え</a>
            <a href="crossword.html">クロスワード</a>
            <a href="matching-lists.html">単語マッチング</a>
            <a href="bingo.html">ビンゴゲーム</a>
            <a href="addition-subtraction.html">足し算・引き算</a>
            <a href="multiplication-table.html">掛け算・割り算</a>
            <a href="clock.html">時計の読み方</a>
            <a href="sudoku.html">数独</a>
            <a href="maze.html">迷路パズル</a>
            <a href="checklist.html">チェックリスト</a>
            <a href="vocab-test.html">ノートシート</a>
            <a href="writing-paper.html">作文用紙</a>
            <a href="mind-map.html">マインドマップ</a>
            <a href="how-to-use.html">使い方</a>
        </nav>
    </header>`;

function footer(enPage) {
    return `<footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>アリクラスは英語・算数など様々な科目の無料プリントを提供します。</p>
            </div>
            <nav class="footer-nav">
                <h3>クイックリンク</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">ホーム</a></li>
                    <li><a href="word-search.html">単語探し</a></li>
                    <li><a href="unscramble.html">文章並び替え</a></li>
                    <li><a href="crossword.html">クロスワード</a></li>
                    <li><a href="matching-lists.html">単語マッチング</a></li>
                    <li><a href="bingo.html">ビンゴゲーム</a></li>
                    <li><a href="sudoku.html">数独</a></li>
                    <li><a href="maze.html">迷路パズル</a></li>
                    <li><a href="addition-subtraction.html">足し算・引き算</a></li>
                    <li><a href="multiplication-table.html">掛け算・割り算</a></li>
                    <li><a href="clock.html">時計の読み方</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>情報</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">プライバシーポリシー</a></li>
                    <li><a href="../terms-of-use.html">利用規約</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">お問い合わせ</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>お問い合わせ</h3>
                <a href="mailto:yourtap1000@gmail.com">yourtap1000@gmail.com</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 Ariclass. All rights reserved.</p>
        </div>
    </footer>
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
        document.getElementById('language-selector').addEventListener('change', function() {
            if (this.value === 'en') window.location.href = '../${enPage}.html';
            if (this.value === 'ko') window.location.href = '../ko/${enPage}.html';
        });
    </script>
    <script src="../js/mouse-fx.js"></script>
</body>
</html>`;
}

function head(title, desc, canonical, enPage, cssExtras) {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${desc}">
    <title>${title}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="https://ariclass.com/${enPage}.html">
    <link rel="alternate" hreflang="ko" href="https://ariclass.com/ko/${enPage}.html">
    <link rel="alternate" hreflang="ja" href="https://ariclass.com/ja/${enPage}.html">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon.ico">
${cssExtras}    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/generator.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5619502783367221"
     crossorigin="anonymous"></script>
</head>
<body>`;
}

// ─────────────────────────────────────────────────────────
// crossword.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'crossword.html'), `${head('無料クロスワードパズル作成ツール - アリクラス','オリジナルの単語とヒントでクロスワードパズルを無料で作成。','https://ariclass.com/ja/crossword.html','crossword','    <link rel="stylesheet" href="../css/crossword.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>クロスワードパズル作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語とヒントを入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="リセット">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> 単語を追加</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> 全て削除</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled><i class="fas fa-print"></i> 印刷する</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> 答えを見る</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>クロスワードパズルの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>単語とヒントを入力してください</li>
                        <li>「パズルを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>語彙・スペリング能力の向上</li>
                        <li>問題解決能力の発達</li>
                        <li>ESL/EFL生徒に最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>明確で生徒レベルに合ったヒントを書きましょう</li>
                        <li>授業テーマに関連した語彙を使いましょう</li>
                        <li>初心者は小さいパズルから始めましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/crossword.js"></script>
${footer('crossword')}`);
console.log('✓ crossword.html');

// ─────────────────────────────────────────────────────────
// matching-lists.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'matching-lists.html'), `${head('無料単語マッチングプリント作成ツール - アリクラス','単語と定義をつなぐマッチングプリントを無料で作成。','https://ariclass.com/ja/matching-lists.html','matching-lists','')}
${NAV}

    <div class="generator-container">
        <h1>単語マッチング作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語ペアを入力</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="リセット">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> ペアを追加</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> 全て削除</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="uppercase" name="letter-case" value="uppercase">
                                <label for="uppercase">大文字</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="lowercase" name="letter-case" value="lowercase" checked>
                                <label for="lowercase">小文字</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">文字サイズ</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="font-small" name="font-size" value="small">
                                <label for="font-small">小</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-medium" name="font-size" value="medium" checked>
                                <label for="font-medium">中</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="font-large" name="font-size" value="large">
                                <label for="font-large">大</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> リストを作成</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 印刷する</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> 答えを見る</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>単語マッチングプリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>ペアを入力してください（単語と定義など）</li>
                        <li>「リストを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>語彙と定義の結びつけ能力向上</li>
                        <li>関連概念の理解促進</li>
                        <li>ESL/EFL生徒に最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>単語と訳語、単語と定義など様々な組み合わせで使えます</li>
                        <li>復習活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/matching-lists.js"></script>
${footer('matching-lists')}`);
console.log('✓ matching-lists.html');

// ─────────────────────────────────────────────────────────
// clock.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'clock.html'), `${head('無料時計の読み方プリント作成ツール - アリクラス','アナログ時計の読み方・書き方プリントを無料で作成。','https://ariclass.com/ja/clock.html','clock','    <link rel="stylesheet" href="../css/clock.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>時計の読み方プリント作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options clock-options">
                    <div class="option-group">
                        <h2 style="text-align:center">モード</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="mode-read" name="clock-mode" value="read" checked>
                                <label for="mode-read">何時ですか？</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="mode-draw" name="clock-mode" value="draw">
                                <label for="mode-draw">針を描く</label>
                                <label style="display:flex;align-items:center;gap:0.2rem;margin-left:0.6rem;font-size:0.8rem;color:#888;cursor:pointer;">
                                    <input type="checkbox" id="hide-time-label"><s>12:00</s>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">針の色</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="color-bw" name="clock-color" value="bw">
                                <label for="color-bw">白黒</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="color-color" name="clock-color" value="color" checked>
                                <label for="color-color">カラー</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" id="interval-option-group">
                        <h2 style="text-align:center">時間の刻み</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="interval-hour" name="clock-interval" value="hour">
                                <label for="interval-hour">1時間</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-half" name="clock-interval" value="half">
                                <label for="interval-half">30分</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked>
                                <label for="interval-quarter">15分</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="interval-five" name="clock-interval" value="five">
                                <label for="interval-five">5分</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">時計の数</h2>
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
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">各ページに新しいランダム問題が生成されます。</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 作成する</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 印刷する</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>時計の読み方プリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>モードを選択してください（何時ですか？・針を描く）</li>
                        <li>時間の刻みを選択してください</li>
                        <li>1ページの時計の数を設定してください</li>
                        <li>「作成する」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>アナログ時計の読み方を学べます</li>
                        <li>数の概念と時間の理解を深めます</li>
                        <li>読む・書くの2モードで練習できます</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者は1時間刻みから始めましょう</li>
                        <li>慣れてきたら5分刻みに挑戦しましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/clock.js"></script>
${footer('clock')}`);
console.log('✓ clock.html');

// ─────────────────────────────────────────────────────────
// sudoku.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'sudoku.html'), `${head('無料数独プリント作成ツール - アリクラス','様々な難易度の数独パズルを無料で作成。すぐに印刷できます。','https://ariclass.com/ja/sudoku.html','sudoku','    <link rel="stylesheet" href="../css/sudoku.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>数独作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>難易度</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked>
                                <label for="difficulty-easy">簡単</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-medium" name="difficulty" value="medium">
                                <label for="difficulty-medium">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-hard" name="difficulty" value="hard">
                                <label for="difficulty-hard">難しい</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="difficulty-expert" name="difficulty" value="expert">
                                <label for="difficulty-expert">エキスパート</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;justify-content:center;">
                        <label>
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">各ページに新しいランダム数独が生成されます。</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 印刷する</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> 答えを見る</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>数独の作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>難易度を選択してください</li>
                        <li>ページ数を設定してください</li>
                        <li>「パズルを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>論理的思考力の向上</li>
                        <li>集中力・問題解決能力の発達</li>
                        <li>全年齢に対応</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者は簡単レベルから始めましょう</li>
                        <li>複数ページを印刷して練習量を確保しましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/sudoku.js"></script>
${footer('sudoku')}`);
console.log('✓ sudoku.html');

// ─────────────────────────────────────────────────────────
// maze.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'maze.html'), `${head('無料迷路パズル作成ツール - アリクラス','様々な難易度の迷路パズルを無料で作成。すぐに印刷できます。','https://ariclass.com/ja/maze.html','maze','    <link rel="stylesheet" href="../css/maze.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>迷路パズル作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>難易度</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="diff-easy" name="difficulty" value="easy">
                                <label for="diff-easy">簡単</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="diff-medium" name="difficulty" value="medium" checked>
                                <label for="diff-medium">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="diff-hard" name="difficulty" value="hard">
                                <label for="diff-hard">難しい</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>迷路の種類</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="type-grid" name="maze-type" value="grid" checked>
                                <label for="type-grid">グリッド型</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 印刷する</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> 答えを見る</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>迷路パズルの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>難易度を選択してください（簡単10x10、普通15x15、難しい20x20）</li>
                        <li>「パズルを作成」ボタンをクリックしてください</li>
                        <li>「答えを見る」で赤いルートを確認してください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>問題解決・批判的思考力の向上</li>
                        <li>空間認識力・視覚的認識の向上</li>
                        <li>忍耐力・集中力の発達</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>小さい子は簡単（10x10）から始めましょう</li>
                        <li>ほとんどの生徒には普通（15x15）がおすすめです</li>
                        <li>ウォームアップや問題解決活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/maze.js"></script>
${footer('maze')}`);
console.log('✓ maze.html');

// ─────────────────────────────────────────────────────────
// checklist.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'checklist.html'), `${head('無料チェックリスト作成ツール - アリクラス','チェックボックス付きの印刷用チェックリストを無料で作成。1・2・4枚レイアウトから選べます。','https://ariclass.com/ja/checklist.html','checklist','    <link rel="stylesheet" href="../css/checklist.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>チェックリスト作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>タイトル</h2>
                    <div class="case-options" style="justify-content:center; margin:12px 0 14px;">
                        <div class="case-option">
                            <input type="radio" id="title-text" name="title-type" value="text" checked>
                            <label for="title-text">テキスト</label>
                        </div>
                        <div class="case-option">
                            <input type="radio" id="title-line" name="title-type" value="line">
                            <label for="title-line">下線</label>
                        </div>
                        <div class="case-option">
                            <input type="radio" id="title-none" name="title-type" value="none">
                            <label for="title-none">なし</label>
                        </div>
                    </div>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>レイアウト <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2枚：点線に沿って切り取り2枚に分けてください。4枚：十字線に沿って切り取り4枚に分けてください。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="layout-1" name="layout" value="1" checked>
                                <label for="layout-1">1枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-2" name="layout" value="2">
                                <label for="layout-2">2枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-4" name="layout" value="4">
                                <label for="layout-4">4枚</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>列数</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="col-1" name="columns" value="1" checked>
                                <label for="col-1">1列</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="col-2" name="columns" value="2">
                                <label for="col-2">2列</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行の間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-narrow" name="spacing" value="narrow">
                                <label for="spacing-narrow">狭い</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="spacing" value="normal">
                                <label for="spacing-normal">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="spacing" value="wide" checked>
                                <label for="spacing-wide">広い</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>番号付け</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="num-yes" name="numbering" value="yes" checked>
                                <label for="num-yes">番号あり</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="num-no" name="numbering" value="no">
                                <label for="num-no">番号なし</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn">
                        <i class="fas fa-print"></i> 印刷する
                    </button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>チェックリストの使い方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1枚</h3>
                    <ul>
                        <li>A4全ページのチェックリスト</li>
                        <li>長いリストに最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2枚</h3>
                    <ul>
                        <li>A4一枚に2つのチェックリスト</li>
                        <li>点線に沿って切り取って配布</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4枚</h3>
                    <ul>
                        <li>2×2グリッドのミニチェックリスト4枚</li>
                        <li>十字線に沿って切り取って使用</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/checklist.js"></script>
${footer('checklist')}`);
console.log('✓ checklist.html');

// ─────────────────────────────────────────────────────────
// vocab-test.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'vocab-test.html'), `${head('無料ノートシート作成ツール - アリクラス','日付・名前欄付きのノートシートを無料で作成。1・2・4枚レイアウトから選べます。','https://ariclass.com/ja/vocab-test.html','vocab-test','    <link rel="stylesheet" href="../css/vocab-test.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>ノートシート作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>レイアウト <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2枚：点線に沿って切り取り2枚に分けてください。4枚：十字線に沿って切り取り4枚に分けてください。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="layout-1" name="layout" value="1" checked>
                                <label for="layout-1">1枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-2" name="layout" value="2">
                                <label for="layout-2">2枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-4" name="layout" value="4">
                                <label for="layout-4">4枚</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>線のスタイル</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="style-solid" name="linestyle" value="solid" checked>
                                <label for="style-solid">実線</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="style-dashed" name="linestyle" value="dashed">
                                <label for="style-dashed">破線</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="style-bold" name="linestyle" value="bold">
                                <label for="style-bold">太線</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行の間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-narrow" name="spacing" value="narrow">
                                <label for="spacing-narrow">狭い</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="spacing" value="normal" checked>
                                <label for="spacing-normal">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="spacing" value="wide">
                                <label for="spacing-wide">広い</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn">
                        <i class="fas fa-print"></i> 印刷する
                    </button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top">
                            <i class="fas fa-print"></i> 印刷する
                        </button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>ノートシートの使い方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1枚</h3>
                    <ul>
                        <li>罫線付きA4全ページ</li>
                        <li>日付・名前欄付き</li>
                        <li>長い語彙リストやノート取りに最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2枚</h3>
                    <ul>
                        <li>A4一枚にノートシート2枚</li>
                        <li>点線に沿って切り取って使用</li>
                        <li>短い語彙リストに最適（用紙節約！）</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4枚</h3>
                    <ul>
                        <li>2×2グリッドのミニノートシート4枚</li>
                        <li>クイズや少量の単語リストに最適</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/vocab-test.js"></script>
${footer('vocab-test')}`);
console.log('✓ vocab-test.html');

// ─────────────────────────────────────────────────────────
// writing-paper.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'writing-paper.html'), `${head('無料作文用紙作成ツール - アリクラス','英語の書き方・文章練習のための罫線用紙を無料で作成。','https://ariclass.com/ja/writing-paper.html','writing-paper','    <link rel="stylesheet" href="../css/writing-paper.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>作文用紙作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>レイアウト <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2枚：点線に沿って切り取り2枚に分けてください。4枚：十字線に沿って切り取り4枚に分けてください。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="layout-1" name="layout" value="1" checked>
                                <label for="layout-1">1枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-2" name="layout" value="2">
                                <label for="layout-2">2枚</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="layout-4" name="layout" value="4">
                                <label for="layout-4">4枚</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行の間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-narrow" name="spacing" value="narrow">
                                <label for="spacing-narrow">狭い</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="spacing" value="normal" checked>
                                <label for="spacing-normal">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="spacing" value="wide">
                                <label for="spacing-wide">広い</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>線の色</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="color-bw" name="linecolor" value="bw">
                                <label for="color-bw">白黒</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="color-red" name="linecolor" value="red" checked>
                                <label for="color-red">赤</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="color-blue" name="linecolor" value="blue">
                                <label for="color-blue">青</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn">
                        <i class="fas fa-print"></i> 印刷する
                    </button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top">
                            <i class="fas fa-print"></i> 印刷する
                        </button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>作文用紙の使い方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1枚</h3>
                    <ul>
                        <li>英語罫線付きA4全ページ</li>
                        <li>3線システム：大文字の高さ・x高（破線）・ベースライン</li>
                        <li>日付・名前欄付き</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2枚</h3>
                    <ul>
                        <li>A4一枚に作文用紙2枚</li>
                        <li>点線に沿って切り取って使用</li>
                        <li>短い書き取り練習に最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4枚</h3>
                    <ul>
                        <li>2×2グリッドのミニ作文用紙4枚</li>
                        <li>簡単な書き取り練習に最適</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/writing-paper.js"></script>
${footer('writing-paper')}`);
console.log('✓ writing-paper.html');

// ─────────────────────────────────────────────────────────
// mind-map.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'mind-map.html'), `${head('無料マインドマップ作成ツール - アリクラス','ブレインストーミングとアイデア整理のためのマインドマップテンプレートを無料で作成。','https://ariclass.com/ja/mind-map.html','mind-map','    <link rel="stylesheet" href="../css/mind-map.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>マインドマップ作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>タイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Mind Map">
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="show-title" checked>
                            タイトルを表示
                        </label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>中央の形</h2>
                        <div style="display:flex; flex-direction:column; align-items:center; gap:6px">
                            <div style="display:flex; gap:8px">
                                <div class="case-option">
                                    <input type="radio" id="shape-bulb" name="centershape" value="bulb" checked>
                                    <label for="shape-bulb">電球</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="shape-rect" name="centershape" value="rect">
                                    <label for="shape-rect">角丸ボックス</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="shape-circle" name="centershape" value="circle">
                                    <label for="shape-circle">円</label>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px">
                                <div class="case-option">
                                    <input type="radio" id="shape-oval" name="centershape" value="oval">
                                    <label for="shape-oval">楕円</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="shape-line" name="centershape" value="line">
                                    <label for="shape-line">下線</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="shape-none" name="centershape" value="none">
                                    <label for="shape-none">なし</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>中央のサイズ</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="sz-small" name="centersize" value="small">
                                <label for="sz-small">小</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="sz-medium" name="centersize" value="medium" checked>
                                <label for="sz-medium">中</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="sz-large" name="centersize" value="large">
                                <label for="sz-large">大</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>線の色</h2>
                        <div style="display:flex; flex-direction:column; align-items:center; gap:6px">
                            <div style="display:flex; gap:8px">
                                <div class="case-option">
                                    <input type="radio" id="col-gray" name="centercolor" value="gray" checked>
                                    <label for="col-gray"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#bbb;vertical-align:middle;margin-right:4px"></span>グレー</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="col-black" name="centercolor" value="black">
                                    <label for="col-black"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#333;vertical-align:middle;margin-right:4px"></span>黒</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="col-blue" name="centercolor" value="blue">
                                    <label for="col-blue"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#6aaee0;vertical-align:middle;margin-right:4px"></span>青</label>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px">
                                <div class="case-option">
                                    <input type="radio" id="col-green" name="centercolor" value="green">
                                    <label for="col-green"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#72c49a;vertical-align:middle;margin-right:4px"></span>緑</label>
                                </div>
                                <div class="case-option">
                                    <input type="radio" id="col-red" name="centercolor" value="red">
                                    <label for="col-red"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#e05a5a;vertical-align:middle;margin-right:4px"></span>赤</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn">
                        <i class="fas fa-print"></i> 印刷する
                    </button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top">
                            <i class="fas fa-print"></i> 印刷する
                        </button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>マインドマップの使い方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>枝4本</h3>
                    <ul>
                        <li>中央テーマから4つの枝が伸びます</li>
                        <li>各枝に2本のサブ枝があります</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>活用例</h3>
                    <ul>
                        <li>ブレインストーミング</li>
                        <li>アイデアの整理と発展</li>
                        <li>授業内容のまとめ</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>中央に主題を書いて枝を広げましょう</li>
                        <li>グループ活動にも活用できます</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/mind-map.js"></script>
${footer('mind-map')}`);
console.log('✓ mind-map.html');

// ─────────────────────────────────────────────────────────
// secret-code.html
// ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(__dirname, 'secret-code.html'), `${head('無料シークレットコードプリント作成ツール - アリクラス','暗号表を使って記号を英単語に解読するプリントを無料で作成。','https://ariclass.com/ja/secret-code.html','secret-code','    <link rel="stylesheet" href="../css/secret-code.css">\n')}
${NAV}

    <div class="generator-container">
        <h1>シークレットコード作成ツール</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Secret Code">
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="show-title" checked>
                            タイトルを表示
                        </label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="リセット">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="単語を1行ずつ入力してください&#10;最大15単語"></textarea>
                    <div class="word-count-display" id="word-count-display"></div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>文字サイズ</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="fs-small" name="fontsize" value="small">
                                <label for="fs-small">小</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="fs-medium" name="fontsize" value="medium" checked>
                                <label for="fs-medium">中</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="fs-large" name="fontsize" value="large">
                                <label for="fs-large">大</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>レイアウト</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="col-1" name="layout" value="1" checked>
                                <label for="col-1">1 Column <span style="color:#999;font-size:0.82em">（文章）</span></label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="col-2" name="layout" value="2">
                                <label for="col-2">2 Columns <span style="color:#999;font-size:0.82em">（単語）</span></label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>暗号キー</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="cipher-new" name="cipherkey" value="new" checked>
                                <label for="cipher-new"><i class="fas fa-lock-open"></i> 新しい暗号キー</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="cipher-lock" name="cipherkey" value="lock">
                                <label for="cipher-lock"><i class="fas fa-lock"></i> 暗号キーを固定</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn">
                        <i class="fas fa-random"></i> ランダム生成
                    </button>
                    <button class="generate-btn" id="generate-btn">
                        <i class="fas fa-key"></i> 作成する
                    </button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn">
                            <i class="fas fa-print"></i> 印刷する
                        </button>
                        <button id="answer-key-btn" class="print-btn">
                            <i class="fas fa-eye"></i> 解答用紙
                        </button>
                    </div>
                    <div id="puzzle-preview">
                        <div class="empty-state">
                            <i class="fas fa-key"></i>
                            <p>単語を入力して作成ボタンをクリックしてください</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="description-section">
            <h2>シークレットコードの使い方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>仕組み</h3>
                    <ul>
                        <li>A〜Zの各アルファベットに独自の記号が割り当てられます</li>
                        <li>単語が記号の順で表示されます</li>
                        <li>生徒が暗号表を使って各単語を解読します</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>使い方のヒント</h3>
                    <ul>
                        <li>プリントあたり最大15単語</li>
                        <li>作成ボタンをクリックするたびに新しい暗号が生成されます</li>
                        <li>「暗号キーを固定」で同じ暗号を維持できます</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>授業テーマの単語を使いましょう</li>
                        <li>ウォームアップ活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <script src="../js/secret-code.js"></script>
${footer('secret-code')}`);
console.log('✓ secret-code.html');

console.log('\nAll fixes applied!');
