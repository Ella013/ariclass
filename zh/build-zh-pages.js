const fs = require('fs');
const path = require('path');

const OUT = __dirname;

function head(title, desc, page, extraCss = '') {
    const canonical = page === 'index'
        ? 'https://ariclass.com/zh/'
        : `https://ariclass.com/zh/${page}.html`;
    const enHref = page === 'index' ? 'https://ariclass.com/' : `https://ariclass.com/${page}.html`;
    return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${enHref}">
    <link rel="alternate" hreflang="ko" href="https://ariclass.com/ko/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="ja" href="https://ariclass.com/ja/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="es" href="https://ariclass.com/es/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="fr" href="https://ariclass.com/fr/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="pt" href="https://ariclass.com/pt/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="zh" href="${canonical}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon.ico">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/generator.css">${extraCss}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5619502783367221" crossorigin="anonymous"></script>
</head>`;
}

function nav(active) {
    return `    <div class="utility-nav">
        <div class="container">
            <div class="language-select"></div>
        </div>
    </div>
    <header>
        <div class="main-header">
            <div class="container">
                <div class="logo">
                    <a href="index.html"><img src="../images/main-logo.png" alt="AriClass Logo" class="logo-img"></a>
                </div>
                <div class="site-description">
                    <p class="site-title">AriClass：练习题生成器</p>
                    <p>几秒内生成英语、数学等各类可打印练习题。</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="打开菜单"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">首页</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">英语</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">单词搜索</a></li>
                            <li><a href="unscramble.html">单词排序</a></li>
                            <li><a href="crossword.html">填字游戏</a></li>
                            <li><a href="matching-lists.html">单词匹配</a></li>
                            <li><a href="bingo.html">宾果游戏</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">数学</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">加法与减法</a></li>
                            <li><a href="multiplication-table.html">乘法与除法</a></li>
                            <li><a href="clock.html">认识时钟</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">益智游戏</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">数独</a></li>
                            <li><a href="maze.html">迷宫</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">打印模板</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">清单</a></li>
                            <li><a href="vocab-test.html">笔记纸</a></li>
                            <li><a href="writing-paper.html">书写纸</a></li>
                            <li><a href="mind-map.html">思维导图</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">使用方法</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">首页</a>
            <a href="word-search.html">单词搜索</a>
            <a href="unscramble.html">单词排序</a>
            <a href="crossword.html">填字游戏</a>
            <a href="matching-lists.html">单词匹配</a>
            <a href="bingo.html">宾果游戏</a>
            <a href="addition-subtraction.html">加法与减法</a>
            <a href="multiplication-table.html">乘法与除法</a>
            <a href="clock.html">认识时钟</a>
            <a href="sudoku.html">数独</a>
            <a href="maze.html">迷宫</a>
            <a href="checklist.html">清单</a>
            <a href="vocab-test.html">笔记纸</a>
            <a href="writing-paper.html">书写纸</a>
            <a href="mind-map.html">思维导图</a>
            <a href="how-to-use.html">使用方法</a>
        </nav>
    </header>`;
}

function footer() {
    return `    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>AriClass 提供英语、数学等各类免费练习题。</p>
            </div>
            <nav class="footer-nav">
                <h3>快速链接</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">首页</a></li>
                    <li><a href="word-search.html">单词搜索</a></li>
                    <li><a href="unscramble.html">单词排序</a></li>
                    <li><a href="crossword.html">填字游戏</a></li>
                    <li><a href="matching-lists.html">单词匹配</a></li>
                    <li><a href="bingo.html">宾果游戏</a></li>
                    <li><a href="sudoku.html">数独</a></li>
                    <li><a href="maze.html">迷宫</a></li>
                    <li><a href="addition-subtraction.html">加法与减法</a></li>
                    <li><a href="multiplication-table.html">乘法与除法</a></li>
                    <li><a href="clock.html">认识时钟</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>信息</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">隐私政策</a></li>
                    <li><a href="../terms-of-use.html">使用条款</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">联系我们</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>联系我们</h3>
                <a href="mailto:yourtap1000@gmail.com">yourtap1000@gmail.com</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 Ariclass. All rights reserved.</p>
        </div>
    </footer>
    <script src="../js/mouse-fx.js"></script>
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
    </script>
    <script src="../js/lang-selector.js"></script>
</body>
</html>`;
}

function previewSection(printBtnTop = false) {
    const btn = printBtnTop
        ? `                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> 打印</button>
                    </div>
`
        : `                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                    </div>
`;
    return `            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
${btn}                    <div id="puzzle-preview"></div>
                </div>
            </div>`;
}

function descriptionSection(page) {
    const s = {
        'word-search': `        <div class="description-section">
            <h2>如何创建单词搜索题</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>在顶部输入练习标题</li>
                        <li>输入或粘贴单词（根据级别最多10/15/20个）</li>
                        <li>选择大写或小写字母</li>
                        <li>选择对角线或反向单词等附加选项</li>
                        <li>点击"创建题目"生成单词搜索题</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高词汇识别能力和拼写技能</li>
                        <li>培养图案识别和视觉扫描能力</li>
                        <li>非常适合ESL/EFL学生和初学者</li>
                        <li>为课堂或家庭作业创建有趣的活动</li>
                        <li>可自定义难度级别</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>使用主题词汇列表强化特定词汇</li>
                        <li>从较短的单词开始，适合初学者</li>
                        <li>为高级学生启用对角线和反向单词</li>
                        <li>打印多份用于课堂活动</li>
                        <li>用作热身活动或课程补充</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'unscramble': `        <div class="description-section">
            <h2>如何创建单词排序练习</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>在文本框中输入或粘贴句子</li>
                        <li>确保每个句子以句号（.）结尾</li>
                        <li>点击"创建练习"生成活动</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高对句子结构的理解</li>
                        <li>强化正确的语序</li>
                        <li>非常适合ESL/EFL学生</li>
                        <li>培养逻辑思维能力</li>
                        <li>强化正确的句子构成</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从简单短句开始，适合初学者</li>
                        <li>使用当前课程主题的词汇</li>
                        <li>包含多种句子类型</li>
                        <li>附带答案键打印，便于批改</li>
                        <li>用作热身或复习活动</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'crossword': `        <div class="description-section">
            <h2>如何创建填字游戏</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>添加单词及其对应的提示</li>
                        <li>根据需要选择题目大小</li>
                        <li>选择附加显示选项</li>
                        <li>点击"创建填字"生成题目</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高词汇量和拼写技能</li>
                        <li>培养解决问题的能力</li>
                        <li>非常适合ESL/EFL学生</li>
                        <li>为课堂创建有趣的活动</li>
                        <li>强化阅读理解能力</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>编写清晰且符合年龄的提示</li>
                        <li>使用主题词汇进行特定课程</li>
                        <li>从较小的谜题开始，适合初学者</li>
                        <li>混合简单和有挑战性的单词</li>
                        <li>用作复习活动或家庭作业</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'matching-lists': `        <div class="description-section">
            <h2>如何创建单词匹配练习</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>添加相关单词或短语对</li>
                        <li>点击"创建练习"生成练习纸</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高词汇理解能力</li>
                        <li>强化单词联想能力</li>
                        <li>非常适合ESL/EFL学生</li>
                        <li>创建有趣的匹配活动</li>
                        <li>强化学习联系</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>使用清晰相关的词对</li>
                        <li>混合简单和有挑战性的匹配</li>
                        <li>将相关概念分组</li>
                        <li>用作复习活动</li>
                        <li>与其他学习活动结合</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'bingo': `        <div class="description-section">
            <h2>如何创建宾果游戏</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>添加词汇单词或使用随机生成</li>
                        <li>选择宾果板大小（3x3、4x4或5x5）</li>
                        <li>选择玩家数量</li>
                        <li>点击"创建宾果"生成游戏</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高词汇识别能力</li>
                        <li>促进积极参与</li>
                        <li>非常适合小组活动</li>
                        <li>提高阅读技能</li>
                        <li>使学习变得有趣且充满活力</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>使用主题词汇集</li>
                        <li>为年幼学生从较小的板子开始</li>
                        <li>为较大的板子准备足够的单词</li>
                        <li>用作复习活动</li>
                        <li>为不同小组创建多套</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'sudoku': `        <div class="description-section">
            <h2>如何创建数独题</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>选择难度级别（简单、中等、困难或专家）</li>
                        <li>点击"创建题目"生成数独</li>
                        <li>使用"查看答案"显示解答</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高逻辑思维和解决问题的能力</li>
                        <li>强化数字识别和图案识别</li>
                        <li>非常适合数学练习和认知发展</li>
                        <li>培养专注力和注意力</li>
                        <li>为课堂或家庭作业创建有趣的活动</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从简单级别开始，适合初学者</li>
                        <li>为熟悉数独的学生使用中等级别</li>
                        <li>用困难或专家级别挑战高级学生</li>
                        <li>附带答案键打印，便于批改</li>
                        <li>用作热身活动或数学拓展练习</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'maze': `        <div class="description-section">
            <h2>如何创建迷宫题</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>选择难度级别（简单10x10、中等15x15或困难20x20）</li>
                        <li>点击"创建迷宫"生成随机迷宫</li>
                        <li>使用"查看答案"以红色显示解答路径</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高解决问题和批判性思维能力</li>
                        <li>培养空间推理和视觉感知能力</li>
                        <li>培养耐心和坚持不懈</li>
                        <li>非常适合大脑训练和认知发展</li>
                        <li>为课堂或家庭作业创建有趣的活动</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从简单（10x10）开始，适合年幼学生</li>
                        <li>大多数学生使用中等（15x15）</li>
                        <li>用困难（20x20）挑战高级学生</li>
                        <li>附带答案键（红色路径）打印，便于检查</li>
                        <li>用作热身活动或解决问题练习</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'addition-subtraction': `        <div class="description-section">
            <h2>如何创建加减法练习纸</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>选择运算类型（加法、减法或混合）</li>
                        <li>选择难度级别</li>
                        <li>设置题目数量</li>
                        <li>点击"创建练习"生成题目</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>提高心算和计算技能</li>
                        <li>强化数感和位值理解</li>
                        <li>非常适合小学和中学生</li>
                        <li>为课堂或家庭作业创建有趣的练习</li>
                        <li>可自定义难度级别</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从较简单的级别开始，适合初学者</li>
                        <li>使用混合运算挑战学生</li>
                        <li>打印多份用于课堂活动</li>
                        <li>用作每日热身练习</li>
                        <li>根据可用时间调整题目数量</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'multiplication-table': `        <div class="description-section">
            <h2>如何创建乘除法练习纸</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>输入练习标题</li>
                        <li>选择运算类型（乘法、除法或混合）</li>
                        <li>选择难度级别</li>
                        <li>设置页数</li>
                        <li>点击"创建练习"</li>
                        <li>使用打印按钮打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>难度级别</h3>
                    <ul>
                        <li><strong>级别1：</strong>1位数×1位数（最高9×9）</li>
                        <li><strong>级别2：</strong>2位数×1位数（如47×6）</li>
                        <li><strong>级别3：</strong>2位数×2位数（如34×28）</li>
                        <li>除法题的答案始终为整数</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从级别1开始，适合初学者</li>
                        <li>使用混合模式练习两种运算</li>
                        <li>打印多页用于计时练习</li>
                        <li>使用"查看答案"创建答案键</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'clock': `        <div class="description-section">
            <h2>如何创建时钟练习纸</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>创建步骤</h3>
                    <ol>
                        <li>选择模式：读取时间或画指针</li>
                        <li>选择时间间隔（每小时、30分、15分或5分）</li>
                        <li>设置每页时钟数量</li>
                        <li>点击创建获取新的时间组合</li>
                        <li>打印练习纸</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>教育益处</h3>
                    <ul>
                        <li>教授模拟时钟读取技能</li>
                        <li>建立数感和时间概念</li>
                        <li>两种模式用于读写练习</li>
                        <li>通过时间间隔调整难度</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>教师提示</h3>
                    <ul>
                        <li>从"每小时"开始，适合初学者</li>
                        <li>使用"画指针"进行高级练习</li>
                        <li>混合6和9个时钟布局增加多样性</li>
                        <li>非常适合ESL/EFL时间词汇课</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'checklist': `        <div class="description-section">
            <h2>如何使用清单模板</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>每页1个</h3>
                    <ul>
                        <li>带有复选框行的完整A4页</li>
                        <li>顶部包含日期和姓名字段</li>
                        <li>非常适合较长的任务列表</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页2个</h3>
                    <ul>
                        <li>一张A4页上有两个清单</li>
                        <li>沿虚线裁剪分开</li>
                        <li>非常适合较短的列表——节省纸张！</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页4个</h3>
                    <ul>
                        <li>2×2网格中有四个迷你清单</li>
                        <li>分别裁剪每个格子</li>
                        <li>非常适合快速日常任务</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'vocab-test': `        <div class="description-section">
            <h2>如何使用笔记纸</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>每页1个</h3>
                    <ul>
                        <li>带有书写线的完整A4页</li>
                        <li>顶部包含日期和姓名字段</li>
                        <li>非常适合较长的词汇列表或记笔记</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页2个</h3>
                    <ul>
                        <li>一张A4页上有两张纸</li>
                        <li>沿虚线裁剪分开</li>
                        <li>非常适合较短的词汇列表（节省纸张！）</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页4个</h3>
                    <ul>
                        <li>一张A4页上的2×2网格中有四张迷你纸</li>
                        <li>分别裁剪每个格子</li>
                        <li>非常适合快速测验或小词汇列表</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'writing-paper': `        <div class="description-section">
            <h2>如何使用书写纸</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>每页1个</h3>
                    <ul>
                        <li>带有英语书写线的完整A4页</li>
                        <li>3线系统：大写高度、x高度（虚线）和基线</li>
                        <li>顶部包含日期和姓名字段</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页2个</h3>
                    <ul>
                        <li>一张A4页上有两张纸</li>
                        <li>沿虚线裁剪分开</li>
                        <li>非常适合较短的书写练习</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>每页4个</h3>
                    <ul>
                        <li>2×2网格中有四张迷你纸</li>
                        <li>沿交叉线裁剪分开</li>
                        <li>非常适合快速书写练习</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'mind-map': `        <div class="description-section">
            <h2>如何使用思维导图</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>4个分支</h3>
                    <ul>
                        <li>4个主要主题区域</li>
                        <li>非常适合简单分类</li>
                        <li>每个分支有更多书写空间</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>6个分支</h3>
                    <ul>
                        <li>6个主要主题区域</li>
                        <li>非常适合大多数头脑风暴任务</li>
                        <li>围绕中心的平衡布局</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>8个分支</h3>
                    <ul>
                        <li>8个主要主题区域</li>
                        <li>非常适合详细的思维导图</li>
                        <li>非常适合复杂主题</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'secret-code': `        <div class="description-section">
            <h2>如何使用密码练习</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>工作原理</h3>
                    <ul>
                        <li>A到Z的每个字母被分配一个唯一符号</li>
                        <li>单词以符号序列形式显示</li>
                        <li>学生使用密码本解码每个单词</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>使用提示</h3>
                    <ul>
                        <li>每张练习纸最多15个单词</li>
                        <li>点击创建每次获取新的随机密码</li>
                        <li>使用答案键选项进行自我检查</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>最适合</h3>
                    <ul>
                        <li>以有趣的方式复习词汇</li>
                        <li>提前完成的学生的活动</li>
                        <li>拼写练习</li>
                    </ul>
                </div>
            </div>
        </div>`,
    };
    return s[page] || '';
}

const pages = {};

// INDEX
pages['index'] = `${head('AriClass - 免费练习题生成器', '免费生成数学、英语等各类练习题。单词搜索、填字游戏、宾果、加法、乘法、时钟等——随时可打印。', 'index', '').replace('<link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('index')}
    <main class="main-content">
        <div class="section-title">
            <h1>免费练习题生成器</h1>
            <p>选择练习类型，几秒内即可打印</p>
        </div>
        <div class="worksheet-section" id="section-english">
            <div class="worksheet-section-header english-section-header">
                <i class="fas fa-book-open"></i><span>英语练习</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/word-search-preview.png" alt="单词搜索" loading="eager">
                    <h3>单词搜索</h3>
                    <p>用自己的单词创建单词搜索游戏</p>
                    <a href="word-search.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/unscramble-preview.png" alt="单词排序" loading="lazy">
                    <h3>单词排序</h3>
                    <p>练习句子中单词顺序的练习题</p>
                    <a href="unscramble.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/crossword-preview.png" alt="填字游戏" loading="lazy">
                    <h3>填字游戏</h3>
                    <p>创建填字游戏练习词汇</p>
                    <a href="crossword.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/matching-lists-preview.png" alt="单词匹配" loading="lazy">
                    <h3>单词匹配</h3>
                    <p>连接相关的单词或概念</p>
                    <a href="matching-lists.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/bingo-preview.png" alt="宾果游戏" loading="lazy">
                    <h3>宾果游戏</h3>
                    <p>自定义宾果卡片练习词汇</p>
                    <a href="bingo.html" class="create-btn">创建</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-math">
            <div class="worksheet-section-header math-section-header">
                <i class="fas fa-calculator"></i><span>数学练习</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/addition-subtraction-preview.png" alt="加法与减法" loading="lazy">
                    <h3>加法与减法</h3>
                    <p>加减法练习题</p>
                    <a href="addition-subtraction.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/multiplication-table-preview.png" alt="乘法与除法" loading="lazy">
                    <h3>乘法与除法</h3>
                    <p>乘除法练习题</p>
                    <a href="multiplication-table.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/clock-preview.png" alt="认识时钟" loading="lazy">
                    <h3>认识时钟</h3>
                    <p>练习读取模拟时钟的练习题</p>
                    <a href="clock.html" class="create-btn">创建</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-puzzles">
            <div class="worksheet-section-header puzzle-section-header">
                <i class="fas fa-puzzle-piece"></i><span>益智游戏</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/sudoku-preview.png" alt="数独" loading="lazy">
                    <h3>数独</h3>
                    <p>不同难度的数独训练逻辑思维</p>
                    <a href="sudoku.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/maze-preview.png" alt="迷宫" loading="lazy">
                    <h3>迷宫</h3>
                    <p>不同大小的迷宫解题练习</p>
                    <a href="maze.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Secret Code.png" alt="密码" loading="lazy">
                    <h3>密码</h3>
                    <p>用符号表解密单词</p>
                    <a href="secret-code.html" class="create-btn">创建</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-sheets">
            <div class="worksheet-section-header template-section-header">
                <i class="fas fa-clipboard-list"></i><span>打印模板</span>
            </div>
            <div class="worksheet-grid worksheet-grid-coming-soon">
                <div class="worksheet-card">
                    <img src="../images/Checklist.png" alt="清单" loading="lazy">
                    <h3>清单</h3>
                    <p>带复选框的清单——每页1、2或4张</p>
                    <a href="checklist.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Note Sheet.png" alt="笔记纸" loading="lazy">
                    <h3>笔记纸</h3>
                    <p>带日期和姓名的打印纸——每页1、2或4张</p>
                    <a href="vocab-test.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Writing Paper.png" alt="书写纸" loading="lazy">
                    <h3>书写纸</h3>
                    <p>带横线的书写练习纸</p>
                    <a href="writing-paper.html" class="create-btn">创建</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Mind Map.png" alt="思维导图" loading="lazy">
                    <h3>思维导图</h3>
                    <p>用于头脑风暴和概念整理的思维导图</p>
                    <a href="mind-map.html" class="create-btn">创建</a>
                </div>
            </div>
        </div>
    </main>
    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2>为什么选择 AriClass？</h2>
                <p>让练习题创建更简单的功能</p><br>
            </div>
            <div class="features-grid">
                <div class="feature-card"><i class="fas fa-bolt"></i><h3>快速</h3><p>通过直观界面几秒内创建练习题</p></div>
                <div class="feature-card"><i class="fas fa-print"></i><h3>即时可打印</h3><p>所有练习题均针对A4纸张优化</p></div>
                <div class="feature-card"><i class="fas fa-cog"></i><h3>可定制</h3><p>根据课堂目标调整选项</p></div>
                <div class="feature-card"><i class="fas fa-download"></i><h3>无需注册</h3><p>无需创建账户即可开始使用</p></div>
            </div>
        </div>
    </section>
    <script>
        function scrollToCenter(id) {
            var target = document.getElementById(id);
            if (!target) return;
            var scroller = document.scrollingElement || document.documentElement;
            var dest = Math.max(0, target.getBoundingClientRect().top + scroller.scrollTop
                       - (window.innerHeight / 2) + (target.offsetHeight / 2));
            var start = scroller.scrollTop;
            var duration = 600;
            var startTime = null;
            function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
            function step(ts) {
                if (!startTime) startTime = ts;
                var p = Math.min((ts - startTime) / duration, 1);
                scroller.scrollTop = start + (dest - start) * ease(p);
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
        if (history.scrollRestoration) history.scrollRestoration = 'manual';
        document.querySelectorAll('a[href*="#section-"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var parts = this.getAttribute('href').split('#');
                if (parts[0] && parts[0] !== 'index.html' && parts[0] !== '') return;
                e.preventDefault();
                scrollToCenter(parts[1]);
            });
        });
        window.addEventListener('load', function() {
            var hash = window.location.hash;
            if (hash && hash.indexOf('section-') !== -1) {
                setTimeout(function() { scrollToCenter(hash.slice(1)); }, 50);
            }
        });
    </script>
${footer()}`;

// WORD SEARCH
pages['word-search'] = `${head('免费单词搜索 - AriClass', '用自己的词汇创建可打印的单词搜索游戏。适合英语老师和各级学生。', 'word-search', '')}
<body>
${nav('word-search')}
    <div class="generator-container">
        <h1>单词搜索</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入单词</h2>
                        <button id="reset-words-btn" class="reset-btn" title="打乱预览"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="每行输入一个单词&#10;最多20个单词"></textarea>
                    <button id="add-word-btn" class="clear-btn"><i class="fas fa-trash"></i> 清除</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option"><input type="radio" id="level1" name="level" value="1"><label for="level1">级别1（简单）</label></div>
                            <div class="level-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">级别2（中等）</label></div>
                            <div class="level-option"><input type="radio" id="level3" name="level" value="3" checked><label for="level3">级别3（困难）</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words"> 大写</label>
                            <label><input type="radio" name="case" id="lowercase-words" checked> 小写</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="show-word-list" checked> 显示单词列表</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> 包含对角线单词</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> 包含反向单词</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('word-search')}
    </div>
    <script src="../js/wordSearch.js"></script>
${footer()}`;

// UNSCRAMBLE
pages['unscramble'] = `${head('单词排序 - AriClass', '创建句子单词排序练习题。非常适合练习语法和词汇。', 'unscramble', '\n    <link rel="stylesheet" href="../css/unscramble.css">')}
<body>
${nav('unscramble')}
    <div class="generator-container">
        <h1>单词排序</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入句子</h2>
                        <button id="reset-words-btn" class="reset-btn" title="打乱预览"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="输入句子，每个句子以句号（.）、问号（?）或感叹号（!）结尾。"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> 全部清除</button>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="capitalize-first" checked> 首字母大写</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>字体大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">小</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">中</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">大</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>题目间距</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-compact" name="question-spacing" value="compact"><label for="spacing-compact">紧凑</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked><label for="spacing-normal">正常</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="question-spacing" value="wide"><label for="spacing-wide">宽松</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('unscramble')}
    </div>
    <script src="../js/unscramble.js"></script>
${footer()}`;

// CROSSWORD
pages['crossword'] = `${head('免费填字游戏 - AriClass', '用自己的词汇创建可打印填字游戏。非常适合语言老师。', 'crossword', '\n    <link rel="stylesheet" href="../css/crossword.css">')}
<body>
${nav('crossword')}
    <div class="generator-container">
        <h1>填字游戏</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入单词和提示</h2>
                        <button id="reset-words-btn" class="reset-btn" title="重置"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> 添加单词</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> 全部清除</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成填字游戏</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled><i class="fas fa-print"></i> 打印</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('crossword')}
    </div>
    <script src="../js/crossword.js"></script>
${footer()}`;

// MATCHING LISTS
pages['matching-lists'] = `${head('单词匹配 - AriClass', '创建可打印的单词匹配练习题。适合语言老师和学生。', 'matching-lists', '\n    <link rel="stylesheet" href="../css/matching-lists.css">')}
<body>
${nav('matching-lists')}
    <div class="generator-container">
        <h1>单词匹配</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入词对</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="重置"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> 添加词对</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> 全部清除</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="uppercase" name="letter-case" value="uppercase"><label for="uppercase">大写</label></div>
                            <div class="case-option"><input type="radio" id="lowercase" name="letter-case" value="lowercase" checked><label for="lowercase">小写</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">字体大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">小</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">中</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">大</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('matching-lists')}
    </div>
    <script src="../js/matching-lists.js"></script>
${footer()}`;

// BINGO
pages['bingo'] = `${head('免费宾果游戏 - AriClass', '用自己的单词创建可打印宾果卡片。适合课堂和语言学习。', 'bingo', '\n    <link rel="stylesheet" href="../css/bingo.css">')}
<body>
${nav('bingo')}
    <div class="generator-container">
        <h1>宾果游戏</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Bingo">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入单词</h2>
                        <button id="reset-words-btn" class="reset-btn" title="打乱预览"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="wordInput" class="vocab-textarea" placeholder="每行输入一个单词"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> 全部清除</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>棋盘大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="board-3" name="board-size" value="3"><label for="board-3">3 x 3</label></div>
                            <div class="case-option"><input type="radio" id="board-4" name="board-size" value="4" checked><label for="board-4">4 x 4</label></div>
                            <div class="case-option"><input type="radio" id="board-5" name="board-size" value="5"><label for="board-5">5 x 5</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>字体大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">小</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">中</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">大</label></div>
                        </div>
                    </div>
                    <div class="option-group option-checkboxes">
                        <label class="check-option-label"><input type="checkbox" id="top-align"> 单词顶部对齐</label>
                        <label class="check-option-label"><input type="checkbox" id="free-space"> 自由格（FREE）</label>
                    </div>
                    <div class="option-group">
                        <h2>玩家数量 <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">每位玩家获得一张独特的宾果卡片。打印时每位玩家生成一页。</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成宾果</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('bingo')}
    </div>
    <script src="../js/bingo.js"></script>
${footer()}`;

// SUDOKU
pages['sudoku'] = `${head('免费数独 - AriClass', '创建不同难度的可打印数独题。适合课堂和家庭使用。', 'sudoku', '\n    <link rel="stylesheet" href="../css/sudoku.css">')}
<body>
${nav('sudoku')}
    <div class="generator-container">
        <h1>数独</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>难度级别</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked><label for="difficulty-easy">简单</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-medium" name="difficulty" value="medium"><label for="difficulty-medium">中等</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-hard" name="difficulty" value="hard"><label for="difficulty-hard">困难</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-expert" name="difficulty" value="expert"><label for="difficulty-expert">专家</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>页数</h2>
                        <label>页数：<input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('sudoku')}
    </div>
    <script src="../js/sudoku.js"></script>
${footer()}`;

// MAZE
pages['maze'] = `${head('免费迷宫 - AriClass', '创建不同难度的可打印迷宫。适合课堂和家庭活动。', 'maze', '\n    <link rel="stylesheet" href="../css/maze.css">')}
<body>
${nav('maze')}
    <div class="generator-container">
        <h1>迷宫</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>难度级别</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="diff-easy" name="difficulty" value="easy"><label for="diff-easy">简单</label></div>
                            <div class="case-option"><input type="radio" id="diff-medium" name="difficulty" value="medium" checked><label for="diff-medium">中等</label></div>
                            <div class="case-option"><input type="radio" id="diff-hard" name="difficulty" value="hard"><label for="diff-hard">困难</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>迷宫类型</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="type-grid" name="maze-type" value="grid" checked><label for="type-grid">网格</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成迷宫</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('maze')}
    </div>
    <script src="../js/maze.js"></script>
${footer()}`;

// ADDITION-SUBTRACTION
pages['addition-subtraction'] = `${head('加法与减法 - AriClass', '创建不同难度的可打印加减法练习题。', 'addition-subtraction', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">')}
<body>
${nav('addition-subtraction')}
    <div class="generator-container">
        <h1>加法与减法</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="addition-only" value="addition" checked> 仅加法</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> 仅减法</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> 混合</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">难度级别</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">级别1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">级别2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">级别3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">每页题目数</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">标准</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">更多</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">页数</h2>
                        <label>页数：<input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('addition-subtraction')}
    </div>
    <script src="../js/addition-subtraction.js"></script>
${footer()}`;

// MULTIPLICATION TABLE
pages['multiplication-table'] = `${head('乘法与除法 - AriClass', '创建不同难度的可打印乘除法练习题。', 'multiplication-table', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">\n    <link rel="stylesheet" href="../css/multiplication-table.css">')}
<body>
${nav('multiplication-table')}
    <div class="generator-container">
        <h1>乘法与除法</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> 仅乘法</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="division-only" value="division"> 仅除法</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> 混合</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">难度级别</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">级别1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">级别2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">级别3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">每页题目数</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">标准</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">更多</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">页数</h2>
                        <label>页数：<input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> 查看答案</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('multiplication-table')}
    </div>
    <script src="../js/multiplication-table.js"></script>
${footer()}`;

// CLOCK
pages['clock'] = `${head('认识时钟 - AriClass', '创建读取模拟时钟的可打印练习题。适合儿童和小学生。', 'clock', '\n    <link rel="stylesheet" href="../css/clock.css">')}
<body>
${nav('clock')}
    <div class="generator-container">
        <h1>认识时钟</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2 style="text-align:center">模式</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="mode-read" name="clock-mode" value="read" checked><label for="mode-read">读取时间</label></div>
                            <div class="case-option"><input type="radio" id="mode-draw" name="clock-mode" value="draw"><label for="mode-draw">绘制指针</label></div>
                        </div>
                        <div style="text-align:center;margin-top:0.5rem;">
                            <label><input type="checkbox" id="hide-time-label"> <s>12:00</s></label>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">指针颜色</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="color-bw" name="clock-color" value="bw"><label for="color-bw">黑白</label></div>
                            <div class="case-option"><input type="radio" id="color-color" name="clock-color" value="color" checked><label for="color-color">彩色</label></div>
                        </div>
                    </div>
                    <div class="option-group" id="interval-option-group">
                        <h2 style="text-align:center">时间间隔</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="interval-hour" name="clock-interval" value="hour"><label for="interval-hour">1小时</label></div>
                            <div class="case-option"><input type="radio" id="interval-half" name="clock-interval" value="half"><label for="interval-half">30分钟</label></div>
                            <div class="case-option"><input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked><label for="interval-quarter">15分钟</label></div>
                            <div class="case-option"><input type="radio" id="interval-five" name="clock-interval" value="five"><label for="interval-five">5分钟</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">时钟数量</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="count-1" name="clock-count" value="1"><label for="count-1">1</label></div>
                            <div class="case-option"><input type="radio" id="count-6" name="clock-count" value="6"><label for="count-6">6</label></div>
                            <div class="case-option"><input type="radio" id="count-9" name="clock-count" value="9"><label for="count-9">9</label></div>
                            <div class="case-option"><input type="radio" id="count-12" name="clock-count" value="12" checked><label for="count-12">12</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">页数</h2>
                        <label>页数：<input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('clock')}
    </div>
    <script src="../js/clock.js"></script>
${footer()}`;

// CHECKLIST
pages['checklist'] = `${head('清单 - AriClass', '创建带复选框的可打印清单。每页1、2或4张布局。', 'checklist', '\n    <link rel="stylesheet" href="../css/checklist.css">')}
<body>
${nav('checklist')}
    <div class="generator-container">
        <h1>清单</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>标题</h2>
                    <div class="case-options" style="justify-content:center;margin:12px 0 14px;">
                        <div class="case-option"><input type="radio" id="title-text" name="title-type" value="text" checked><label for="title-text">文字</label></div>
                        <div class="case-option"><input type="radio" id="title-line" name="title-type" value="line"><label for="title-line">下划线</label></div>
                        <div class="case-option"><input type="radio" id="title-none" name="title-type" value="none"><label for="title-none">无</label></div>
                    </div>
                    <input type="text" id="worksheet-title" placeholder="请输入标题">
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>布局 <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">每页2张：沿虚线裁剪得到2张。每页4张：沿十字线裁剪得到4张。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1张</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2张</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4张</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>列数</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="columns" value="1" checked><label for="col-1">1列</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="columns" value="2"><label for="col-2">2列</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行间距</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">窄</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal"><label for="spacing-normal">正常</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide" checked><label for="spacing-wide">宽</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>编号</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="num-yes" name="numbering" value="yes" checked><label for="num-yes">有</label></div>
                            <div class="case-option"><input type="radio" id="num-no" name="numbering" value="no"><label for="num-no">无</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> 打印</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> 打印</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('checklist')}
    </div>
    <script src="../js/checklist.js"></script>
${footer()}`;

// VOCAB TEST
pages['vocab-test'] = `${head('笔记纸 - AriClass', '创建带横线的可打印笔记纸。每页1、2或4张布局。', 'vocab-test', '\n    <link rel="stylesheet" href="../css/vocab-test.css">')}
<body>
${nav('vocab-test')}
    <div class="generator-container">
        <h1>笔记纸</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>布局 <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">每页2张：沿虚线裁剪得到2张。每页4张：沿十字线裁剪得到4张。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1张</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2张</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4张</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>线条样式</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="style-solid" name="linestyle" value="solid" checked><label for="style-solid">实线</label></div>
                            <div class="case-option"><input type="radio" id="style-dashed" name="linestyle" value="dashed"><label for="style-dashed">虚线</label></div>
                            <div class="case-option"><input type="radio" id="style-bold" name="linestyle" value="bold"><label for="style-bold">粗线</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行间距</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">窄</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">正常</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">宽</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> 打印</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> 打印</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('vocab-test')}
    </div>
    <script src="../js/vocab-test.js"></script>
${footer()}`;

// WRITING PAPER
pages['writing-paper'] = `${head('书写纸 - AriClass', '创建带横线的可打印书写练习纸。非常适合练习英语书写。', 'writing-paper', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/writing-paper.css">')}
<body>
${nav('writing-paper')}
    <div class="generator-container">
        <h1>书写纸</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>布局 <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">每页2张：沿虚线裁剪得到2张。每页4张：沿十字线裁剪得到4张。</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1张</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2张</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4张</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>行间距</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">窄</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">正常</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">宽</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>线条颜色</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="color-bw" name="linecolor" value="bw"><label for="color-bw">黑白</label></div>
                            <div class="case-option"><input type="radio" id="color-red" name="linecolor" value="red" checked><label for="color-red">红色</label></div>
                            <div class="case-option"><input type="radio" id="color-blue" name="linecolor" value="blue"><label for="color-blue">蓝色</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> 打印</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> 打印</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('writing-paper')}
    </div>
    <script src="../js/writing-paper.js"></script>
${footer()}`;

// MIND MAP
pages['mind-map'] = `${head('思维导图 - AriClass', '创建用于头脑风暴和概念整理的可打印思维导图。', 'mind-map', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/mind-map.css">')}
<body>
${nav('mind-map')}
    <div class="generator-container">
        <h1>思维导图</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Mind Map">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>中心形状</h2>
                        <div class="shape-options">
                            <div class="shape-option"><input type="radio" id="shape-bulb" name="centershape" value="bulb" checked><label for="shape-bulb"><i class="fas fa-lightbulb"></i></label></div>
                            <div class="shape-option"><input type="radio" id="shape-rect" name="centershape" value="rect"><label for="shape-rect"><i class="fas fa-square"></i></label></div>
                            <div class="shape-option"><input type="radio" id="shape-circle" name="centershape" value="circle"><label for="shape-circle"><i class="fas fa-circle"></i></label></div>
                            <div class="shape-option"><input type="radio" id="shape-oval" name="centershape" value="oval"><label for="shape-oval"><i class="fas fa-egg"></i></label></div>
                            <div class="shape-option"><input type="radio" id="shape-line" name="centershape" value="line"><label for="shape-line"><i class="fas fa-minus"></i></label></div>
                            <div class="shape-option"><input type="radio" id="shape-none" name="centershape" value="none"><label for="shape-none"><i class="fas fa-times"></i></label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>中心大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="sz-small" name="centersize" value="small"><label for="sz-small">小</label></div>
                            <div class="case-option"><input type="radio" id="sz-medium" name="centersize" value="medium" checked><label for="sz-medium">中</label></div>
                            <div class="case-option"><input type="radio" id="sz-large" name="centersize" value="large"><label for="sz-large">大</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>线条颜色</h2>
                        <div class="color-options">
                            <div class="color-option"><input type="radio" id="col-gray" name="centercolor" value="gray" checked><label for="col-gray" style="background:#999;"></label></div>
                            <div class="color-option"><input type="radio" id="col-black" name="centercolor" value="black"><label for="col-black" style="background:#222;"></label></div>
                            <div class="color-option"><input type="radio" id="col-blue" name="centercolor" value="blue"><label for="col-blue" style="background:#3b82f6;"></label></div>
                            <div class="color-option"><input type="radio" id="col-green" name="centercolor" value="green"><label for="col-green" style="background:#22c55e;"></label></div>
                            <div class="color-option"><input type="radio" id="col-red" name="centercolor" value="red"><label for="col-red" style="background:#ef4444;"></label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> 打印</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> 打印</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('mind-map')}
    </div>
    <script src="../js/mind-map.js"></script>
${footer()}`;

// SECRET CODE
pages['secret-code'] = `${head('密码 - AriClass', '创建可打印密码练习题。学生用符号表解密单词。', 'secret-code', '\n    <link rel="stylesheet" href="../css/secret-code.css">')}
<body>
${nav('secret-code')}
    <div class="generator-container">
        <h1>密码</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>练习题标题</h2>
                    <input type="text" id="worksheet-title" placeholder="请输入标题" value="Secret Code">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> 显示标题</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>输入单词</h2>
                        <button id="reset-words-btn" class="reset-btn" title="重置"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="每行输入一个单词&#10;最多15个单词"></textarea>
                    <div class="word-count-display" id="word-count-display"></div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>字体大小</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="fs-small" name="fontsize" value="small"><label for="fs-small">小</label></div>
                            <div class="case-option"><input type="radio" id="fs-medium" name="fontsize" value="medium" checked><label for="fs-medium">中</label></div>
                            <div class="case-option"><input type="radio" id="fs-large" name="fontsize" value="large"><label for="fs-large">大</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>布局</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="layout" value="1" checked><label for="col-1">1列</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="layout" value="2"><label for="col-2">2列</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>密码密钥</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="cipher-new" name="cipherkey" value="new" checked><label for="cipher-new">新密钥</label></div>
                            <div class="case-option"><input type="radio" id="cipher-lock" name="cipherkey" value="lock"><label for="cipher-lock">保留密钥</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> 随机生成</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> 生成题目</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">预览</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> 打印</button>
                        <button id="answer-key-btn" class="print-btn"><i class="fas fa-key"></i> 查看密钥</button>
                    </div>
                    <div id="puzzle-preview"></div>
                </div>
            </div>
        </div>
        ${descriptionSection('secret-code')}
    </div>
    <script src="../js/secret-code.js"></script>
${footer()}`;

// HOW TO USE
pages['how-to-use'] = `${head('如何使用 AriClass - 教师指南', '学习如何使用 AriClass 创建免费的英语和数学练习题。', 'how-to-use', '').replace('\n    <link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('how-to-use')}
    <div class="how-to-use-container" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;">
        <h1 style="text-align:center;margin-bottom:2rem;">如何使用 AriClass</h1>
        <div style="margin-bottom:2rem;">
            <h2>1. 选择练习类型</h2>
            <p>从导航菜单或首页选择练习类型。有英语练习、数学练习、益智游戏和可打印模板。</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>2. 自定义选项</h2>
            <p>输入单词或选择可用选项（难度、字体大小、布局等）。预览会实时更新。</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>3. 打印练习题</h2>
            <p>点击"打印"按钮直接从浏览器打印。也可以在打印对话框中保存为PDF。</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>使用技巧</h2>
            <ul style="padding-left:1.5rem;line-height:2;">
                <li>无需注册——立即开始使用！</li>
                <li>所有练习题均针对A4纸张优化。</li>
                <li>使用"随机生成"按钮快速创建练习题。</li>
                <li>可以一次生成多页。</li>
            </ul>
        </div>
    </div>
${footer()}`;

// ── Write files ───────────────────────────────────────────────────

Object.entries(pages).forEach(([name, html]) => {
    const file = path.join(OUT, name + '.html');
    fs.writeFileSync(file, html, 'utf8');
    console.log('✓ ' + name + '.html');
});

console.log('\nAll zh/ pages generated!');
