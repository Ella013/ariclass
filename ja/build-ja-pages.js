const fs = require('fs');
const path = require('path');

// Shared nav/footer builder
function buildHeader(currentPage, pageTitle, metaDesc, canonical) {
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${metaDesc}">
    <title>${pageTitle}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="https://ariclass.com/${currentPage}.html">
    <link rel="alternate" hreflang="ko" href="https://ariclass.com/ko/${currentPage}.html">
    <link rel="alternate" hreflang="ja" href="https://ariclass.com/ja/${currentPage}.html">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon.ico">`;
}

function buildNavAndFooter(currentPage, enPage) {
    return `    <div class="utility-nav">
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
}

function buildFooterAndScript(enPage) {
    return `
<footer>
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

// ── Page definitions ──────────────────────────────────────────────────────────

const pages = {

'word-search': {
title: '無料単語探しプリント作成ツール - アリクラス',
desc: 'オリジナル語彙で単語探しパズルを無料で作成。教師・生徒・ESL授業に最適なプリントです。',
canonical: 'https://ariclass.com/ja/word-search.html',
cssExtra: '',
h1: '単語探し',
jsFile: '../js/wordSearch.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="単語を入力してください（1行に1単語）&#10;最大20単語"></textarea>
                    <button id="add-word-btn" class="clear-btn">
                        <i class="fas fa-trash"></i> クリア
                    </button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option">
                                <input type="radio" id="level1" name="level" value="1">
                                <label for="level1">Level 1 (簡単)</label>
                            </div>
                            <div class="level-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">Level 2 (普通)</label>
                            </div>
                            <div class="level-option">
                                <input type="radio" id="level3" name="level" value="3" checked>
                                <label for="level3">Level 3 (難しい)</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words"> 大文字</label>
                            <label><input type="radio" name="case" id="lowercase-words" checked> 小文字</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="show-word-list" checked> 単語リストを表示</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> 斜め方向を含める</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> 逆方向を含める</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>単語探しプリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>単語入力欄に単語を入力してください（レベルに応じて10/15/20個）</li>
                        <li>大文字または小文字を選択してください</li>
                        <li>斜め・逆方向のオプションを選択してください</li>
                        <li>「パズルを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>語彙認識・スペリング能力の向上</li>
                        <li>パターン認識・視覚的探索能力の向上</li>
                        <li>ESL/EFL生徒や小学生に最適</li>
                        <li>授業や宿題の活動として活用できます</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>テーマ別単語リストで語彙を集中学習しましょう</li>
                        <li>初心者は短い単語から始めましょう</li>
                        <li>上級者には斜め・逆方向のオプションを使いましょう</li>
                        <li>授業活動用に複数枚印刷して活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'unscramble': {
title: '無料文章並び替えプリント作成ツール - アリクラス',
desc: '英語練習のための文章並び替えプリントを無料で作成。教師と生徒のための語順練習問題をすぐに印刷。',
canonical: 'https://ariclass.com/ja/unscramble.html',
cssExtra: '    <link rel="stylesheet" href="../css/unscramble.css">\n',
h1: '文章並び替え',
jsFile: '../js/unscramble.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>文章を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="文章を入力してください。各文章はピリオド(.)、疑問符(?)、感嘆符(!)で終わる必要があります。"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> 全て削除</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <label><input type="checkbox" id="capitalize-first" checked> 並び替えた文の先頭を大文字に</label>
                    </div>
                    <div class="option-group">
                        <h2>文字サイズ</h2>
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
                    <div class="option-group">
                        <h2>問題の間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-compact" name="question-spacing" value="compact">
                                <label for="spacing-compact">狭い</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked>
                                <label for="spacing-normal">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="question-spacing" value="wide">
                                <label for="spacing-wide">広い</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>文章並び替えプリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>テキストボックスに文章を入力してください</li>
                        <li>各文章はピリオド(.)で終わる必要があります</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>文章構造の理解力向上</li>
                        <li>語順把握能力の向上</li>
                        <li>ESL/EFL生徒に最適</li>
                        <li>論理的思考力の発達</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者は短くシンプルな文章から始めましょう</li>
                        <li>現在の授業テーマの語彙を活用しましょう</li>
                        <li>ウォームアップや復習活動として使いましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'bingo': {
title: '無料ビンゴカード作成ツール - アリクラス',
desc: 'オリジナル単語で無料のビンゴカードを作成。ボードサイズを選んでプレイヤー別のカードをすぐに印刷。',
canonical: 'https://ariclass.com/ja/bingo.html',
cssExtra: '    <link rel="stylesheet" href="../css/bingo.css">\n',
h1: 'ビンゴゲーム作成ツール',
jsFile: '../js/bingo.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください" value="Bingo Game">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <div class="word-input-wrapper">
                        <textarea id="wordInput" class="vocab-textarea" placeholder="単語を入力してください（1行に1単語）"></textarea>
                    </div>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash"></i> クリア</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>ボードサイズ</h2>
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
                        <h2>文字サイズ</h2>
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
                    <div class="option-group option-checkboxes">
                        <label class="check-option-label">
                            <input type="checkbox" id="top-align"> 単語を上揃えにする
                        </label>
                        <label class="check-option-label">
                            <input type="checkbox" id="free-space"> FREEマスを追加
                        </label>
                    </div>
                    <div class="option-group">
                        <h2>プレイヤー数 <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">プレイヤーごとに異なるビンゴカードが生成されます。印刷時にプレイヤー数分のページが作成されます。</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> ビンゴを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>ビンゴゲームの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>プリントのタイトルを入力してください</li>
                        <li>単語を入力するかランダム生成を使ってください</li>
                        <li>ビンゴボードのサイズを選択してください（3x3、4x4、5x5）</li>
                        <li>プレイヤー数を選択してください</li>
                        <li>「ビンゴを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>語彙認識能力の向上</li>
                        <li>積極的な授業参加を促進</li>
                        <li>グループ活動に最適</li>
                        <li>楽しく参加型の学習環境を作れます</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>テーマ別語彙セットを活用しましょう</li>
                        <li>小さい子には小さいボードから始めましょう</li>
                        <li>復習活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'crossword': {
title: '無料クロスワードパズル作成ツール - アリクラス',
desc: 'オリジナルの単語とヒントでクロスワードパズルを無料で作成。教師・ESL授業・生徒向けに最適なプリント。',
canonical: 'https://ariclass.com/ja/crossword.html',
cssExtra: '    <link rel="stylesheet" href="../css/crossword.css">\n',
h1: 'クロスワードパズル作成ツール',
jsFile: '../js/crossword.js',
inputSection: `
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
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <div id="clue-list"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> 単語を追加</button>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash"></i> クリア</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-word-list" checked> 単語リストを表示</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>`,
descSection: `
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
                        <li>授業テーマに関連した単語を使いましょう</li>
                        <li>ヒントは簡潔に書きましょう</li>
                        <li>復習活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'matching-lists': {
title: '無料単語マッチングプリント作成ツール - アリクラス',
desc: '単語と定義をつなぐマッチングプリントを無料で作成。教師・ESL授業に最適。',
canonical: 'https://ariclass.com/ja/matching-lists.html',
cssExtra: '',
h1: '単語マッチング作成ツール',
jsFile: '../js/matching-lists.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>ペアを入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <div id="pair-list"></div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> ペアを追加</button>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash"></i> クリア</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>文字サイズ</h2>
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
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>単語マッチングプリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>ペアを入力してください（単語と定義など）</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
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
                        <li>授業テーマに関連したペアを作りましょう</li>
                        <li>復習活動として活用しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'addition-subtraction': {
title: '無料足し算・引き算プリント作成ツール - アリクラス',
desc: '足し算・引き算の算数プリントを無料で作成。教師と生徒のためにすぐに印刷できます。',
canonical: 'https://ariclass.com/ja/addition-subtraction.html',
cssExtra: '    <link rel="stylesheet" href="../css/math.css">\n',
h1: '足し算・引き算プリント作成ツール',
jsFile: '../js/addition-subtraction.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="operation" id="addition-only" value="addition" checked> 足し算のみ</label>
                            <label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> 引き算のみ</label>
                            <label><input type="radio" name="operation" id="mixed" value="mixed"> 混合</label>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">難易度</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="level1" name="level" value="1" checked>
                                <label for="level1">Level 1 (簡単)</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">Level 2 (普通)</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level3" name="level" value="3">
                                <label for="level3">Level 3 (難しい)</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; display:flex; flex-direction:column; align-items:center;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">1ページの問題数</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option">
                                <input type="radio" id="probs-15" name="problems-per-page" value="15" checked>
                                <label for="probs-15">標準</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="probs-20" name="problems-per-page" value="20">
                                <label for="probs-20">多め</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">各ページに新しいランダム問題が生成されます。</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>足し算・引き算プリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>計算の種類を選択してください（足し算、引き算、混合）</li>
                        <li>難易度を選択してください</li>
                        <li>ページ数を設定してください</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>基本的な計算能力の向上</li>
                        <li>数字の概念理解の促進</li>
                        <li>小学生に最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者はLevel 1から始めましょう</li>
                        <li>毎日の練習として活用しましょう</li>
                        <li>複数ページを設定して十分な練習量を確保しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'multiplication-table': {
title: '無料掛け算・割り算プリント作成ツール - アリクラス',
desc: '掛け算・割り算の算数プリントを無料で作成。教師と生徒のためにすぐに印刷できます。',
canonical: 'https://ariclass.com/ja/multiplication-table.html',
cssExtra: '    <link rel="stylesheet" href="../css/math.css">\n',
h1: '掛け算・割り算プリント作成ツール',
jsFile: '../js/multiplication-table.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> 掛け算のみ</label>
                            <label><input type="radio" name="operation" id="division-only" value="division"> 割り算のみ</label>
                            <label><input type="radio" name="operation" id="mixed" value="mixed"> 混合</label>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">難易度</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="level1" name="level" value="1" checked>
                                <label for="level1">Level 1 (簡単)</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level2" name="level" value="2">
                                <label for="level2">Level 2 (普通)</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="level3" name="level" value="3">
                                <label for="level3">Level 3 (難しい)</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; display:flex; flex-direction:column; align-items:center;">
                        <h2 style="text-align:center; font-weight:bold; margin-top:0; margin-bottom:0.6rem;">1ページの問題数</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option">
                                <input type="radio" id="probs-15" name="problems-per-page" value="15" checked>
                                <label for="probs-15">標準</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="probs-20" name="problems-per-page" value="20">
                                <label for="probs-20">多め</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                            <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">各ページに新しいランダム問題が生成されます。</span></span>
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>掛け算・割り算プリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>計算の種類を選択してください（掛け算、割り算、混合）</li>
                        <li>難易度を選択してください</li>
                        <li>ページ数を設定してください</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>掛け算・割り算の計算力向上</li>
                        <li>数の概念理解の促進</li>
                        <li>小学生に最適</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者はLevel 1から始めましょう</li>
                        <li>毎日の練習として活用しましょう</li>
                        <li>複数ページを設定して十分な練習量を確保しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'clock': {
title: '無料時計の読み方プリント作成ツール - アリクラス',
desc: 'アナログ時計の読み方・書き方プリントを無料で作成。教師と生徒のためにすぐに印刷できます。',
canonical: 'https://ariclass.com/ja/clock.html',
cssExtra: '    <link rel="stylesheet" href="../css/clock.css">\n',
h1: '時計の読み方プリント作成ツール',
jsFile: '../js/clock.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="mode" id="read-mode" value="read" checked> 時刻を読む</label>
                            <label><input type="radio" name="mode" id="draw-mode" value="draw"> 針を描く</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">色</h2>
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
                                <input type="radio" id="clocks-6" name="clock-count" value="6" checked>
                                <label for="clocks-6">6</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="clocks-9" name="clock-count" value="9">
                                <label for="clocks-9">9</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="clocks-12" name="clock-count" value="12">
                                <label for="clocks-12">12</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>時計の読み方プリントの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>モードを選択してください（時刻を読む・針を描く）</li>
                        <li>時間の刻みを選択してください（1時間、30分、15分、5分）</li>
                        <li>1ページの時計の数を設定してください</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
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
        </div>`
},

'sudoku': {
title: '無料数独プリント作成ツール - アリクラス',
desc: '様々な難易度の数独パズルを無料で作成。教師と生徒のためにすぐに印刷できます。',
canonical: 'https://ariclass.com/ja/sudoku.html',
cssExtra: '    <link rel="stylesheet" href="../css/sudoku.css">\n',
h1: '数独作成ツール',
jsFile: '../js/sudoku.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
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
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>`,
descSection: `
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
        </div>`
},

'maze': {
title: '無料迷路パズル作成ツール - アリクラス',
desc: '様々なサイズの迷路パズルを無料で作成。教師と生徒のためにすぐに印刷できます。',
canonical: 'https://ariclass.com/ja/maze.html',
cssExtra: '    <link rel="stylesheet" href="../css/maze.css">\n',
h1: '迷路パズル作成ツール',
jsFile: '../js/maze.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>サイズ</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="maze-small" name="maze-size" value="small" checked>
                                <label for="maze-small">小</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="maze-medium" name="maze-size" value="medium">
                                <label for="maze-medium">中</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="maze-large" name="maze-size" value="large">
                                <label for="maze-large">大</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group" style="display: flex; justify-content: center;">
                        <label>
                            ページ数:
                            <input type="number" id="num-pages" min="1" max="10" value="1" style="width: 80px; padding: 0.4rem; margin-left: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px;">
                        </label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> パズルを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>迷路パズルの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>サイズを選択してください</li>
                        <li>ページ数を設定してください</li>
                        <li>「パズルを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>問題解決能力の向上</li>
                        <li>空間認識力の発達</li>
                        <li>集中力の向上</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者は小サイズから始めましょう</li>
                        <li>複数ページを印刷して練習量を確保しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'checklist': {
title: '無料チェックリスト作成ツール - アリクラス',
desc: 'チェックボックス付きの印刷用チェックリストを無料で作成。1・2・4枚レイアウトから選べます。',
canonical: 'https://ariclass.com/ja/checklist.html',
cssExtra: '    <link rel="stylesheet" href="../css/checklist.css">\n',
h1: 'チェックリスト作成ツール',
jsFile: '../js/checklist.js',
inputSection: `
                <div class="title-input">
                    <h2>タイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>項目を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <textarea id="checklist-items" class="vocab-textarea" placeholder="項目を入力してください（1行に1項目）"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash"></i> クリア</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>レイアウト</h2>
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
                                <input type="radio" id="columns-1" name="columns" value="1" checked>
                                <label for="columns-1">1列</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="columns-2" name="columns" value="2">
                                <label for="columns-2">2列</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-compact" name="spacing" value="compact">
                                <label for="spacing-compact">狭い</label>
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
                        <label><input type="checkbox" id="show-numbers" checked> 番号を表示</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 作成する</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>チェックリストの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>項目を入力してください（1行に1項目）</li>
                        <li>レイアウトと列数を選択してください</li>
                        <li>「作成する」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>活用例</h3>
                    <ul>
                        <li>宿題や課題の確認リスト</li>
                        <li>授業の持ち物リスト</li>
                        <li>学習目標の管理</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>4枚レイアウトは1ページを切り分けて配布できます</li>
                        <li>2列にすると多くの項目を効率よく表示できます</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'vocab-test': {
title: '無料ノートシート作成ツール - アリクラス',
desc: '日付・名前欄付きのノートシートを無料で作成。1・2・4枚レイアウトから選べます。',
canonical: 'https://ariclass.com/ja/vocab-test.html',
cssExtra: '    <link rel="stylesheet" href="../css/vocab-test.css">\n',
h1: 'ノートシート作成ツール',
jsFile: '../js/vocab-test.js',
inputSection: `
                <div class="title-input">
                    <h2>タイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>レイアウト</h2>
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
                        <h2>行数</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="rows-10" name="rows" value="10" checked>
                                <label for="rows-10">10行</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="rows-15" name="rows" value="15">
                                <label for="rows-15">15行</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="rows-20" name="rows" value="20">
                                <label for="rows-20">20行</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 作成する</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>ノートシートの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>レイアウトと行数を選択してください</li>
                        <li>「作成する」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>活用例</h3>
                    <ul>
                        <li>語彙テストや書き取り練習</li>
                        <li>授業ノートのテンプレート</li>
                        <li>各種記録シートとして活用</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>4枚レイアウトは切り分けて配布できます</li>
                        <li>行数を調整して適切なスペースを確保しましょう</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'writing-paper': {
title: '無料作文用紙作成ツール - アリクラス',
desc: '英語の書き方・文章練習のための罫線用紙を無料で作成。すぐに印刷できます。',
canonical: 'https://ariclass.com/ja/writing-paper.html',
cssExtra: '    <link rel="stylesheet" href="../css/writing-paper.css">\n',
h1: '作文用紙作成ツール',
jsFile: '../js/writing-paper.js',
inputSection: `
                <div class="title-input">
                    <h2>タイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>スタイル</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="style-lined" name="paper-style" value="lined" checked>
                                <label for="style-lined">罫線のみ</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="style-dotted" name="paper-style" value="dotted">
                                <label for="style-dotted">補助線付き</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="style-handwriting" name="paper-style" value="handwriting">
                                <label for="style-handwriting">4線</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行の間隔</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="spacing-narrow" name="line-spacing" value="narrow">
                                <label for="spacing-narrow">狭い</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-normal" name="line-spacing" value="normal" checked>
                                <label for="spacing-normal">普通</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="spacing-wide" name="line-spacing" value="wide">
                                <label for="spacing-wide">広い</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 作成する</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>作文用紙の作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>スタイルと行の間隔を選択してください</li>
                        <li>「作成する」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>活用例</h3>
                    <ul>
                        <li>英語の書き方練習</li>
                        <li>文章作成の練習</li>
                        <li>日記や作文の練習</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>先生のヒント</h3>
                    <ul>
                        <li>初心者には4線スタイルが字形の習得に効果的です</li>
                        <li>行の間隔を広めにすると書きやすくなります</li>
                    </ul>
                </div>
            </div>
        </div>`
},

'mind-map': {
title: '無料マインドマップ作成ツール - アリクラス',
desc: 'ブレインストーミングとアイデア整理のためのマインドマップテンプレートを無料で作成。',
canonical: 'https://ariclass.com/ja/mind-map.html',
cssExtra: '    <link rel="stylesheet" href="../css/mind-map.css">\n',
h1: 'マインドマップ作成ツール',
jsFile: '../js/mind-map.js',
inputSection: `
                <div class="title-input">
                    <h2>タイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>テンプレート</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="template-basic" name="template" value="basic" checked>
                                <label for="template-basic">基本</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="template-extended" name="template" value="extended">
                                <label for="template-extended">拡張</label>
                            </div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>色</h2>
                        <div class="case-options">
                            <div class="case-option">
                                <input type="radio" id="color-color" name="map-color" value="color" checked>
                                <label for="color-color">カラー</label>
                            </div>
                            <div class="case-option">
                                <input type="radio" id="color-bw" name="map-color" value="bw">
                                <label for="color-bw">白黒</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 作成する</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>マインドマップの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>テンプレートと色を選択してください</li>
                        <li>「作成する」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
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
        </div>`
},

'secret-code': {
title: '無料シークレットコードプリント作成ツール - アリクラス',
desc: '暗号表を使って記号を英単語に解読するプリントを無料で作成。',
canonical: 'https://ariclass.com/ja/secret-code.html',
cssExtra: '    <link rel="stylesheet" href="../css/secret-code.css">\n',
h1: 'シークレットコード作成ツール',
jsFile: '../js/secret-code.js',
inputSection: `
                <div class="title-input">
                    <h2>プリントのタイトル</h2>
                    <input type="text" id="worksheet-title" placeholder="タイトルを入力してください">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> タイトルを表示</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>単語を入力</h2>
                        <button id="reset-words-btn" class="reset-btn" title="プレビューをシャッフル">
                            <i class="fas fa-random"></i>
                        </button>
                    </div>
                    <textarea id="word-list" class="vocab-textarea" placeholder="単語を入力してください（1行に1単語）"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash"></i> クリア</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-key" checked> 暗号表を表示</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> ランダム生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> プリントを作成</button>
                </div>`,
descSection: `
        <div class="description-section">
            <h2>シークレットコードの作り方</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>作成手順</h3>
                    <ol>
                        <li>タイトルを入力してください</li>
                        <li>単語を入力してください</li>
                        <li>「プリントを作成」ボタンをクリックしてください</li>
                        <li>印刷ボタンでプリントを印刷してください</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育効果</h3>
                    <ul>
                        <li>英語のアルファベット認識の向上</li>
                        <li>解読の楽しさで学習意欲を高める</li>
                        <li>論理的思考力の発達</li>
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
        </div>`
}

};

// ── Generate all pages ────────────────────────────────────────────────────────

const jaDir = __dirname;

for (const [pageName, p] of Object.entries(pages)) {
    // Read CSS from ko/ page to get the right CSS files
    const koPath = path.join(jaDir, '..', 'ko', `${pageName}.html`);
    let extraCss = p.cssExtra;

    // Build the full page
    const html = `${buildHeader(pageName, p.title, p.desc, p.canonical)}
${extraCss}    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/generator.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5619502783367221"
     crossorigin="anonymous"></script>
</head>
<body>
${buildNavAndFooter(pageName, pageName)}

    <div class="generator-container">
        <h1>${p.h1}</h1>
        <div class="generator-content">
            <div class="input-section">${p.inputSection}
            </div>
            <div class="preview-section">
                <div class="preview-label">プレビュー</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 印刷する</button>${
    ['addition-subtraction','multiplication-table'].includes(pageName)
        ? '\n                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> 答えを見る</button>'
        : ''
}
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>${p.descSection}
    </div>
    <script src="${p.jsFile}"></script>
${buildFooterAndScript(pageName)}`;

    const outPath = path.join(jaDir, `${pageName}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`✓ ${pageName}.html`);
}

console.log('\nAll ja/ pages generated!');
