const fs = require('fs');
const path = require('path');

const OUT = __dirname;

function head(title, desc, page, extraCss = '') {
    const canonical = page === 'index'
        ? 'https://ariclass.com/pt/'
        : `https://ariclass.com/pt/${page}.html`;
    const enHref = page === 'index' ? 'https://ariclass.com/' : `https://ariclass.com/${page}.html`;
    return `<!DOCTYPE html>
<html lang="pt">
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
    <link rel="alternate" hreflang="pt" href="${canonical}">
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
                    <p class="site-title">AriClass: Gerador de fichas</p>
                    <p>Crie fichas de inglês, matemática e muito mais em segundos.</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="Abrir menu"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">Início</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">Inglês</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">Caça-palavras</a></li>
                            <li><a href="unscramble.html">Ordenar palavras</a></li>
                            <li><a href="crossword.html">Palavras cruzadas</a></li>
                            <li><a href="matching-lists.html">Associação de palavras</a></li>
                            <li><a href="bingo.html">Bingo</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">Matemática</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">Adição e subtração</a></li>
                            <li><a href="multiplication-table.html">Multiplicação e divisão</a></li>
                            <li><a href="clock.html">Ler as horas</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">Puzzles</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">Sudoku</a></li>
                            <li><a href="maze.html">Labirinto</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">Fichas</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">Lista de verificação</a></li>
                            <li><a href="vocab-test.html">Folha de notas</a></li>
                            <li><a href="writing-paper.html">Papel de escrita</a></li>
                            <li><a href="mind-map.html">Mapa mental</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">Como usar</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">Início</a>
            <a href="word-search.html">Caça-palavras</a>
            <a href="unscramble.html">Ordenar palavras</a>
            <a href="crossword.html">Palavras cruzadas</a>
            <a href="matching-lists.html">Associação de palavras</a>
            <a href="bingo.html">Bingo</a>
            <a href="addition-subtraction.html">Adição e subtração</a>
            <a href="multiplication-table.html">Multiplicação e divisão</a>
            <a href="clock.html">Ler as horas</a>
            <a href="sudoku.html">Sudoku</a>
            <a href="maze.html">Labirinto</a>
            <a href="checklist.html">Lista de verificação</a>
            <a href="vocab-test.html">Folha de notas</a>
            <a href="writing-paper.html">Papel de escrita</a>
            <a href="mind-map.html">Mapa mental</a>
            <a href="how-to-use.html">Como usar</a>
        </nav>
    </header>`;
}

function footer() {
    return `    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>AriClass oferece fichas de exercícios gratuitas de inglês, matemática e muito mais.</p>
            </div>
            <nav class="footer-nav">
                <h3>Links rápidos</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">Início</a></li>
                    <li><a href="word-search.html">Caça-palavras</a></li>
                    <li><a href="unscramble.html">Ordenar palavras</a></li>
                    <li><a href="crossword.html">Palavras cruzadas</a></li>
                    <li><a href="matching-lists.html">Associação de palavras</a></li>
                    <li><a href="bingo.html">Bingo</a></li>
                    <li><a href="sudoku.html">Sudoku</a></li>
                    <li><a href="maze.html">Labirinto</a></li>
                    <li><a href="addition-subtraction.html">Adição e subtração</a></li>
                    <li><a href="multiplication-table.html">Multiplicação e divisão</a></li>
                    <li><a href="clock.html">Ler as horas</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>Informações</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">Política de privacidade</a></li>
                    <li><a href="../terms-of-use.html">Termos de uso</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">Contato</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>Contato</h3>
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
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimir</button>
                    </div>
`
        : `                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                    </div>
`;
    return `            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
${btn}                    <div id="puzzle-preview"></div>
                </div>
            </div>`;
}

function descriptionSection(page) {
    const s = {
        'word-search': `        <div class="description-section">
            <h2>Como criar o seu caça-palavras</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Escreva ou cole as suas palavras (máx. 10/15/20 segundo o nível)</li>
                        <li>Escolha letras maiúsculas ou minúsculas</li>
                        <li>Selecione opções como palavras na diagonal ou ao contrário</li>
                        <li>Clique em "Criar puzzle" para gerar o caça-palavras</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora o reconhecimento de vocabulário e a ortografia</li>
                        <li>Desenvolve o reconhecimento de padrões e a leitura visual</li>
                        <li>Ideal para alunos de ESL/EFL e iniciantes</li>
                        <li>Cria atividades dinâmicas para a aula ou trabalhos de casa</li>
                        <li>Níveis de dificuldade personalizáveis</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Use listas de palavras temáticas para reforçar vocabulário específico</li>
                        <li>Comece com palavras curtas para iniciantes</li>
                        <li>Ative palavras na diagonal e ao contrário para alunos avançados</li>
                        <li>Imprima várias cópias para atividades em sala de aula</li>
                        <li>Use como atividade de aquecimento ou complemento da lição</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'unscramble': `        <div class="description-section">
            <h2>Como criar a sua ficha de ordenar palavras</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Escreva ou cole as frases na caixa de texto</li>
                        <li>Certifique-se de que cada frase termina com ponto (.)</li>
                        <li>Clique em "Criar exercício" para gerar a atividade</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora a compreensão da estrutura das frases</li>
                        <li>Reforça a ordem correta das palavras</li>
                        <li>Ideal para alunos de ESL/EFL</li>
                        <li>Desenvolve o pensamento lógico</li>
                        <li>Reforça a formação correta de frases</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com frases simples e curtas para iniciantes</li>
                        <li>Use vocabulário do tema da lição atual</li>
                        <li>Inclua uma variedade de tipos de frases</li>
                        <li>Imprima com a chave de respostas para facilitar a correção</li>
                        <li>Use como atividade de aquecimento ou revisão</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'crossword': `        <div class="description-section">
            <h2>Como criar as suas palavras cruzadas</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Adicione palavras e as suas definições correspondentes</li>
                        <li>Escolha o tamanho do puzzle conforme as suas necessidades</li>
                        <li>Selecione opções adicionais de visualização</li>
                        <li>Clique em "Criar palavras cruzadas" para gerar</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora o vocabulário e a ortografia</li>
                        <li>Desenvolve a resolução de problemas</li>
                        <li>Ideal para alunos de ESL/EFL</li>
                        <li>Cria atividades dinâmicas para a aula</li>
                        <li>Reforça a compreensão leitora</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Escreva pistas claras e adequadas à idade</li>
                        <li>Use vocabulário temático para lições específicas</li>
                        <li>Comece com puzzles menores para iniciantes</li>
                        <li>Inclua uma mistura de palavras fáceis e difíceis</li>
                        <li>Use como atividade de revisão ou trabalho de casa</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'matching-lists': `        <div class="description-section">
            <h2>Como criar a sua ficha de associação</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Adicione pares de palavras ou frases relacionadas</li>
                        <li>Clique em "Criar exercício" para gerar a ficha</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora a compreensão do vocabulário</li>
                        <li>Reforça a associação de palavras</li>
                        <li>Ideal para alunos de ESL/EFL</li>
                        <li>Cria atividades de associação dinâmicas</li>
                        <li>Reforça as conexões de aprendizagem</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Use pares claros e relacionados</li>
                        <li>Inclua uma mistura de associações fáceis e difíceis</li>
                        <li>Agrupe conceitos relacionados</li>
                        <li>Use como atividade de revisão</li>
                        <li>Combine com outras atividades de aprendizagem</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'bingo': `        <div class="description-section">
            <h2>Como criar o seu jogo de bingo</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Adicione palavras de vocabulário ou use a geração aleatória</li>
                        <li>Escolha o tamanho do tabuleiro (3x3, 4x4 ou 5x5)</li>
                        <li>Selecione o número de jogadores</li>
                        <li>Clique em "Criar bingo" para gerar o jogo</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora o reconhecimento de vocabulário</li>
                        <li>Promove a participação ativa</li>
                        <li>Ideal para atividades em grupo</li>
                        <li>Melhora as competências de leitura</li>
                        <li>Torna a aprendizagem divertida e dinâmica</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Use conjuntos de vocabulário temático</li>
                        <li>Comece com tabuleiros pequenos para alunos mais novos</li>
                        <li>Prepare palavras suficientes para tabuleiros grandes</li>
                        <li>Use como atividade de revisão</li>
                        <li>Crie vários conjuntos para grupos diferentes</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'sudoku': `        <div class="description-section">
            <h2>Como criar o seu puzzle de sudoku</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Selecione o nível de dificuldade (Fácil, Médio, Difícil ou Expert)</li>
                        <li>Clique em "Criar puzzle" para gerar o sudoku</li>
                        <li>Use "Ver respostas" para mostrar a solução</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora o pensamento lógico e a resolução de problemas</li>
                        <li>Reforça o reconhecimento de números e padrões</li>
                        <li>Ideal para a prática de matemática e o desenvolvimento cognitivo</li>
                        <li>Desenvolve a concentração e a atenção ao detalhe</li>
                        <li>Cria atividades dinâmicas para a aula ou trabalhos de casa</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com o nível Fácil para iniciantes</li>
                        <li>Use o nível Médio para alunos familiarizados com sudoku</li>
                        <li>Desafie os avançados com os níveis Difícil ou Expert</li>
                        <li>Imprima com a chave de respostas para facilitar a correção</li>
                        <li>Use como aquecimento ou exercício de enriquecimento matemático</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'maze': `        <div class="description-section">
            <h2>Como criar o seu labirinto</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Selecione o nível de dificuldade (Fácil 10x10, Médio 15x15 ou Difícil 20x20)</li>
                        <li>Clique em "Criar labirinto" para gerar um aleatório</li>
                        <li>Use "Ver respostas" para mostrar o caminho solução a vermelho</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora a resolução de problemas e o pensamento crítico</li>
                        <li>Desenvolve o raciocínio espacial e a perceção visual</li>
                        <li>Promove a paciência e a perseverança</li>
                        <li>Ideal para treino cerebral e desenvolvimento cognitivo</li>
                        <li>Cria atividades dinâmicas para a aula ou trabalhos de casa</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com Fácil (10x10) para alunos mais novos</li>
                        <li>Use Médio (15x15) para a maioria dos alunos</li>
                        <li>Desafie os avançados com Difícil (20x20)</li>
                        <li>Imprima com a chave de respostas (caminho vermelho) para facilitar</li>
                        <li>Use como aquecimento ou exercício de resolução de problemas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'addition-subtraction': `        <div class="description-section">
            <h2>Como criar a sua ficha de adição e subtração</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Escolha o tipo de operação (Adição, Subtração ou Misto)</li>
                        <li>Selecione o nível de dificuldade</li>
                        <li>Defina o número de problemas</li>
                        <li>Clique em "Criar exercício" para gerar os problemas</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Melhora o cálculo mental e as competências aritméticas</li>
                        <li>Reforça o sentido numérico e o valor posicional</li>
                        <li>Ideal para alunos do ensino básico e secundário</li>
                        <li>Cria prática dinâmica para a aula ou trabalhos de casa</li>
                        <li>Níveis de dificuldade personalizáveis</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com níveis mais fáceis para iniciantes</li>
                        <li>Use operações mistas para desafiar os alunos</li>
                        <li>Imprima várias cópias para atividades em sala de aula</li>
                        <li>Use como exercício de aquecimento diário</li>
                        <li>Ajuste o número de problemas conforme o tempo disponível</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'multiplication-table': `        <div class="description-section">
            <h2>Como criar a sua ficha de multiplicação e divisão</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Insira um título para a sua ficha</li>
                        <li>Escolha o tipo de operação (Multiplicação, Divisão ou Misto)</li>
                        <li>Selecione o nível de dificuldade</li>
                        <li>Defina o número de páginas</li>
                        <li>Clique em "Criar exercício"</li>
                        <li>Imprima com o botão de impressão</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Níveis de dificuldade</h3>
                    <ul>
                        <li><strong>Nível 1:</strong> 1 dígito × 1 dígito (até 9×9)</li>
                        <li><strong>Nível 2:</strong> 2 dígitos × 1 dígito (ex. 47×6)</li>
                        <li><strong>Nível 3:</strong> 2 dígitos × 2 dígitos (ex. 34×28)</li>
                        <li>Os problemas de divisão têm sempre respostas inteiras</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com o Nível 1 para iniciantes</li>
                        <li>Use Misto para praticar ambas as operações</li>
                        <li>Imprima várias páginas para exercícios cronometrados</li>
                        <li>Use "Ver respostas" para criar uma chave de respostas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'clock': `        <div class="description-section">
            <h2>Como criar a sua ficha de leitura de horas</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Passos simples para criar</h3>
                    <ol>
                        <li>Escolha um modo: ler as horas ou desenhar os ponteiros</li>
                        <li>Selecione o intervalo de tempo (cada hora, 30, 15 ou 5 min)</li>
                        <li>Defina o número de relógios por página</li>
                        <li>Clique em Criar para obter um novo conjunto de horas</li>
                        <li>Imprima a ficha</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Benefícios educativos</h3>
                    <ul>
                        <li>Ensina a leitura do relógio analógico</li>
                        <li>Desenvolve o sentido numérico e os conceitos de tempo</li>
                        <li>Dois modos para praticar leitura e escrita</li>
                        <li>Dificuldade ajustável com os intervalos de tempo</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas para professores</h3>
                    <ul>
                        <li>Comece com "cada hora" para iniciantes</li>
                        <li>Use "desenhar os ponteiros" para prática avançada</li>
                        <li>Misture layouts de 6 e 9 relógios para variedade</li>
                        <li>Ótimo para lições de vocabulário de tempo em ESL/EFL</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'checklist': `        <div class="description-section">
            <h2>Como usar os modelos de lista de verificação</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa com caixas de verificação</li>
                        <li>Inclui campos de Data e Nome no topo</li>
                        <li>Ideal para listas de tarefas longas</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Duas listas numa página A4</li>
                        <li>Corte pela linha tracejada para separar</li>
                        <li>Ideal para listas curtas — poupa papel!</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Quatro mini-listas numa grelha 2×2</li>
                        <li>Corte cada célula separadamente</li>
                        <li>Ideal para tarefas diárias rápidas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'vocab-test': `        <div class="description-section">
            <h2>Como usar as folhas de notas</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa com linhas de escrita</li>
                        <li>Inclui campos de Data e Nome no topo</li>
                        <li>Ideal para listas de vocabulário longas ou apontamentos</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Duas folhas numa página A4</li>
                        <li>Corte pela linha tracejada para separar</li>
                        <li>Ideal para listas de vocabulário curtas (poupa papel!)</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Quatro mini-folhas numa grelha 2×2 numa página A4</li>
                        <li>Corte cada célula separadamente</li>
                        <li>Ideal para testes rápidos ou pequenas listas de palavras</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'writing-paper': `        <div class="description-section">
            <h2>Como usar o papel de escrita</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa com linhas de escrita em inglês</li>
                        <li>Sistema de 3 linhas: altura das maiúsculas, x-height (tracejado) e linha de base</li>
                        <li>Inclui campos de Data e Nome no topo</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Duas folhas numa página A4</li>
                        <li>Corte pela linha tracejada para separar</li>
                        <li>Ideal para exercícios de escrita mais curtos</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Quatro mini-folhas numa grelha 2×2</li>
                        <li>Corte pelas linhas cruzadas para separar</li>
                        <li>Ideal para prática rápida de escrita</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'mind-map': `        <div class="description-section">
            <h2>Como usar o mapa mental</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>4 ramos</h3>
                    <ul>
                        <li>4 áreas temáticas principais</li>
                        <li>Ideal para categorização simples</li>
                        <li>Mais espaço por ramo para escrever</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>6 ramos</h3>
                    <ul>
                        <li>6 áreas temáticas principais</li>
                        <li>Perfeito para a maioria das tarefas de brainstorming</li>
                        <li>Layout equilibrado em torno do centro</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>8 ramos</h3>
                    <ul>
                        <li>8 áreas temáticas principais</li>
                        <li>Ideal para mapas mentais detalhados</li>
                        <li>Ótimo para temas complexos</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'secret-code': `        <div class="description-section">
            <h2>Como usar o código secreto</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Como funciona</h3>
                    <ul>
                        <li>Cada letra de A a Z recebe um símbolo único</li>
                        <li>As palavras são mostradas como sequências de símbolos</li>
                        <li>Os alunos usam a chave para descodificar cada palavra</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Dicas</h3>
                    <ul>
                        <li>Até 15 palavras por ficha de exercícios</li>
                        <li>Clique em Criar para obter um novo código aleatório de cada vez</li>
                        <li>Use a opção Chave de respostas para autocorreção</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Ideal para</h3>
                    <ul>
                        <li>Revisão de vocabulário de forma divertida</li>
                        <li>Atividade para quem termina mais cedo</li>
                        <li>Prática de ortografia</li>
                    </ul>
                </div>
            </div>
        </div>`,
    };
    return s[page] || '';
}

const pages = {};

// INDEX
pages['index'] = `${head('AriClass - Gerador gratuito de fichas de exercícios', 'Crie fichas de exercícios gratuitas de matemática, inglês e muito mais. Caça-palavras, palavras cruzadas, bingo, adição, multiplicação, relógio e mais — prontas para imprimir.', 'index', '').replace('<link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('index')}
    <main class="main-content">
        <div class="section-title">
            <h1>Gerador gratuito de fichas de exercícios</h1>
            <p>Escolha o tipo de exercício e estará pronto para imprimir em segundos</p>
        </div>
        <div class="worksheet-section" id="section-english">
            <div class="worksheet-section-header english-section-header">
                <i class="fas fa-book-open"></i><span>Exercícios de inglês</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/word-search-preview.png" alt="Caça-palavras" loading="eager">
                    <h3>Caça-palavras</h3>
                    <p>Crie caça-palavras com o seu próprio vocabulário</p>
                    <a href="word-search.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/unscramble-preview.png" alt="Ordenar palavras" loading="lazy">
                    <h3>Ordenar palavras</h3>
                    <p>Exercícios para praticar a ordem das palavras nas frases</p>
                    <a href="unscramble.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/crossword-preview.png" alt="Palavras cruzadas" loading="lazy">
                    <h3>Palavras cruzadas</h3>
                    <p>Crie palavras cruzadas para praticar vocabulário</p>
                    <a href="crossword.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/matching-lists-preview.png" alt="Associação de palavras" loading="lazy">
                    <h3>Associação de palavras</h3>
                    <p>Ligue palavras ou conceitos relacionados</p>
                    <a href="matching-lists.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/bingo-preview.png" alt="Bingo" loading="lazy">
                    <h3>Bingo</h3>
                    <p>Cartões de bingo personalizados para praticar vocabulário</p>
                    <a href="bingo.html" class="create-btn">Criar</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-math">
            <div class="worksheet-section-header math-section-header">
                <i class="fas fa-calculator"></i><span>Exercícios de matemática</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/addition-subtraction-preview.png" alt="Adição e subtração" loading="lazy">
                    <h3>Adição e subtração</h3>
                    <p>Fichas de prática de adição e subtração</p>
                    <a href="addition-subtraction.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/multiplication-table-preview.png" alt="Multiplicação e divisão" loading="lazy">
                    <h3>Multiplicação e divisão</h3>
                    <p>Fichas de prática de multiplicação e divisão</p>
                    <a href="multiplication-table.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/clock-preview.png" alt="Ler as horas" loading="lazy">
                    <h3>Ler as horas</h3>
                    <p>Fichas para praticar a leitura do relógio analógico</p>
                    <a href="clock.html" class="create-btn">Criar</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-puzzles">
            <div class="worksheet-section-header puzzle-section-header">
                <i class="fas fa-puzzle-piece"></i><span>Puzzles e jogos</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/sudoku-preview.png" alt="Sudoku" loading="lazy">
                    <h3>Sudoku</h3>
                    <p>Sudoku de diferentes dificuldades para treinar a lógica</p>
                    <a href="sudoku.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/maze-preview.png" alt="Labirinto" loading="lazy">
                    <h3>Labirinto</h3>
                    <p>Labirintos de diferentes tamanhos para resolver problemas</p>
                    <a href="maze.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Secret Code.png" alt="Código secreto" loading="lazy">
                    <h3>Código secreto</h3>
                    <p>Decifre palavras usando uma tabela de símbolos</p>
                    <a href="secret-code.html" class="create-btn">Criar</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-sheets">
            <div class="worksheet-section-header template-section-header">
                <i class="fas fa-clipboard-list"></i><span>Fichas imprimíveis</span>
            </div>
            <div class="worksheet-grid worksheet-grid-coming-soon">
                <div class="worksheet-card">
                    <img src="../images/Checklist.png" alt="Lista de verificação" loading="lazy">
                    <h3>Lista de verificação</h3>
                    <p>Listas com caixas de seleção — layout de 1, 2 ou 4 por página</p>
                    <a href="checklist.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Note Sheet.png" alt="Folha de notas" loading="lazy">
                    <h3>Folha de notas</h3>
                    <p>Folha imprimível com data e nome — layout de 1, 2 ou 4 por página</p>
                    <a href="vocab-test.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Writing Paper.png" alt="Papel de escrita" loading="lazy">
                    <h3>Papel de escrita</h3>
                    <p>Papel com linhas para praticar a escrita em inglês</p>
                    <a href="writing-paper.html" class="create-btn">Criar</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Mind Map.png" alt="Mapa mental" loading="lazy">
                    <h3>Mapa mental</h3>
                    <p>Mapa mental para brainstorming e organização de ideias</p>
                    <a href="mind-map.html" class="create-btn">Criar</a>
                </div>
            </div>
        </div>
    </main>
    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2>Por que escolher AriClass?</h2>
                <p>Funcionalidades para facilitar a criação de exercícios</p><br>
            </div>
            <div class="features-grid">
                <div class="feature-card"><i class="fas fa-bolt"></i><h3>Rápido</h3><p>Crie exercícios em segundos com uma interface intuitiva</p></div>
                <div class="feature-card"><i class="fas fa-print"></i><h3>Pronto para imprimir</h3><p>Todos os exercícios são otimizados para papel A4</p></div>
                <div class="feature-card"><i class="fas fa-cog"></i><h3>Personalizável</h3><p>Ajuste as opções de acordo com os objetivos da sua aula</p></div>
                <div class="feature-card"><i class="fas fa-download"></i><h3>Sem registro</h3><p>Comece a usar sem precisar criar uma conta</p></div>
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
pages['word-search'] = `${head('Caça-palavras gratuito - AriClass', 'Crie caça-palavras imprimíveis com o seu próprio vocabulário. Ideal para professores de inglês e alunos de todos os níveis.', 'word-search', '')}
<body>
${nav('word-search')}
    <div class="generator-container">
        <h1>Caça-palavras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir palavras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Misturar pré-visualização"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Digite as palavras (uma por linha)&#10;Máximo 20 palavras"></textarea>
                    <button id="add-word-btn" class="clear-btn"><i class="fas fa-trash"></i> Apagar</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option"><input type="radio" id="level1" name="level" value="1"><label for="level1">Nível 1 (Fácil)</label></div>
                            <div class="level-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nível 2 (Médio)</label></div>
                            <div class="level-option"><input type="radio" id="level3" name="level" value="3" checked><label for="level3">Nível 3 (Difícil)</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words"> MAIÚSCULAS</label>
                            <label><input type="radio" name="case" id="lowercase-words" checked> minúsculas</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="show-word-list" checked> Mostrar lista de palavras</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> Incluir palavras na diagonal</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> Incluir palavras ao contrário</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar puzzle</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('word-search')}
    </div>
    <script src="../js/wordSearch.js"></script>
${footer()}`;

// UNSCRAMBLE
pages['unscramble'] = `${head('Ordenar palavras - AriClass', 'Crie fichas para ordenar palavras em frases. Perfeito para praticar gramática e vocabulário.', 'unscramble', '\n    <link rel="stylesheet" href="../css/unscramble.css">')}
<body>
${nav('unscramble')}
    <div class="generator-container">
        <h1>Ordenar palavras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir frases</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Misturar pré-visualização"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="Digite as frases. Cada frase deve terminar com ponto (.), ponto de interrogação (?) ou exclamação (!)."></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Apagar tudo</button>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="capitalize-first" checked> Maiúscula no início</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamanho da fonte</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeno</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espaçamento entre questões</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-compact" name="question-spacing" value="compact"><label for="spacing-compact">Compacto</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="question-spacing" value="wide"><label for="spacing-wide">Amplo</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('unscramble')}
    </div>
    <script src="../js/unscramble.js"></script>
${footer()}`;

// CROSSWORD
pages['crossword'] = `${head('Palavras cruzadas gratuitas - AriClass', 'Crie palavras cruzadas imprimíveis com o seu próprio vocabulário. Perfeito para professores de idiomas.', 'crossword', '\n    <link rel="stylesheet" href="../css/crossword.css">')}
<body>
${nav('crossword')}
    <div class="generator-container">
        <h1>Palavras cruzadas</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir palavras e pistas</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> Adicionar palavra</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Apagar tudo</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar palavras cruzadas</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled><i class="fas fa-print"></i> Imprimir</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Ver respostas</button>
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
pages['matching-lists'] = `${head('Associação de palavras - AriClass', 'Crie fichas de associação de palavras imprimíveis. Ideal para professores de idiomas e alunos.', 'matching-lists', '\n    <link rel="stylesheet" href="../css/matching-lists.css">')}
<body>
${nav('matching-lists')}
    <div class="generator-container">
        <h1>Associação de palavras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir pares de palavras</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> Adicionar par</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Apagar tudo</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="uppercase" name="letter-case" value="uppercase"><label for="uppercase">MAIÚSCULAS</label></div>
                            <div class="case-option"><input type="radio" id="lowercase" name="letter-case" value="lowercase" checked><label for="lowercase">minúsculas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">Tamanho da fonte</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeno</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Ver respostas</button>
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
pages['bingo'] = `${head('Bingo gratuito - AriClass', 'Crie cartões de bingo imprimíveis com as suas próprias palavras. Ideal para sala de aula e aprendizado de idiomas.', 'bingo', '\n    <link rel="stylesheet" href="../css/bingo.css">')}
<body>
${nav('bingo')}
    <div class="generator-container">
        <h1>Bingo</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Bingo">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir palavras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Misturar pré-visualização"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="wordInput" class="vocab-textarea" placeholder="Digite as palavras (uma por linha)"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Apagar tudo</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamanho do tabuleiro</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="board-3" name="board-size" value="3"><label for="board-3">3 x 3</label></div>
                            <div class="case-option"><input type="radio" id="board-4" name="board-size" value="4" checked><label for="board-4">4 x 4</label></div>
                            <div class="case-option"><input type="radio" id="board-5" name="board-size" value="5"><label for="board-5">5 x 5</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Tamanho da fonte</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeno</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group option-checkboxes">
                        <label class="check-option-label"><input type="checkbox" id="top-align"> Alinhar palavras ao topo</label>
                        <label class="check-option-label"><input type="checkbox" id="free-space"> Espaço livre (FREE)</label>
                    </div>
                    <div class="option-group">
                        <h2>Número de jogadores <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">Cada jogador recebe um cartão de bingo único. Uma página é gerada por jogador na impressão.</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar bingo</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('bingo')}
    </div>
    <script src="../js/bingo.js"></script>
${footer()}`;

// SUDOKU
pages['sudoku'] = `${head('Sudoku gratuito - AriClass', 'Crie fichas de sudoku imprimíveis com diferentes níveis de dificuldade. Ideal para sala de aula e em casa.', 'sudoku', '\n    <link rel="stylesheet" href="../css/sudoku.css">')}
<body>
${nav('sudoku')}
    <div class="generator-container">
        <h1>Sudoku</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Nível de dificuldade</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked><label for="difficulty-easy">Fácil</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-medium" name="difficulty" value="medium"><label for="difficulty-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-hard" name="difficulty" value="hard"><label for="difficulty-hard">Difícil</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-expert" name="difficulty" value="expert"><label for="difficulty-expert">Especialista</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar puzzle</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Ver respostas</button>
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
pages['maze'] = `${head('Labirinto gratuito - AriClass', 'Crie labirintos imprimíveis de diferentes dificuldades. Ideal para sala de aula e atividades em casa.', 'maze', '\n    <link rel="stylesheet" href="../css/maze.css">')}
<body>
${nav('maze')}
    <div class="generator-container">
        <h1>Labirinto</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Nível de dificuldade</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="diff-easy" name="difficulty" value="easy"><label for="diff-easy">Fácil</label></div>
                            <div class="case-option"><input type="radio" id="diff-medium" name="difficulty" value="medium" checked><label for="diff-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="diff-hard" name="difficulty" value="hard"><label for="diff-hard">Difícil</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Tipo de labirinto</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="type-grid" name="maze-type" value="grid" checked><label for="type-grid">Grelha</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar labirinto</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Ver respostas</button>
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
pages['addition-subtraction'] = `${head('Adição e subtração - AriClass', 'Crie fichas de exercícios de adição e subtração imprimíveis com diferentes níveis de dificuldade.', 'addition-subtraction', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">')}
<body>
${nav('addition-subtraction')}
    <div class="generator-container">
        <h1>Adição e subtração</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="addition-only" value="addition" checked> Só adição</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> Só subtração</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Misto</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nível de dificuldade</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Nível 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nível 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Nível 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problemas por página</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Padrão</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Mais</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Ver respostas</button>
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
pages['multiplication-table'] = `${head('Multiplicação e divisão - AriClass', 'Crie fichas de exercícios de multiplicação e divisão imprimíveis com diferentes níveis de dificuldade.', 'multiplication-table', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">\n    <link rel="stylesheet" href="../css/multiplication-table.css">')}
<body>
${nav('multiplication-table')}
    <div class="generator-container">
        <h1>Multiplicação e divisão</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> Só multiplicação</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="division-only" value="division"> Só divisão</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Misto</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nível de dificuldade</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Nível 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nível 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Nível 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problemas por página</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Padrão</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Mais</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Ver respostas</button>
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
pages['clock'] = `${head('Ler as horas - AriClass', 'Crie fichas de exercícios para ler as horas num relógio analógico. Ideal para crianças e alunos do ensino básico.', 'clock', '\n    <link rel="stylesheet" href="../css/clock.css">')}
<body>
${nav('clock')}
    <div class="generator-container">
        <h1>Ler as horas</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2 style="text-align:center">Modo</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="mode-read" name="clock-mode" value="read" checked><label for="mode-read">Ler as horas</label></div>
                            <div class="case-option"><input type="radio" id="mode-draw" name="clock-mode" value="draw"><label for="mode-draw">Desenhar os ponteiros</label></div>
                        </div>
                        <div style="text-align:center;margin-top:0.5rem;">
                            <label><input type="checkbox" id="hide-time-label"> <s>12:00</s></label>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">Cor dos ponteiros</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="color-bw" name="clock-color" value="bw"><label for="color-bw">P&amp;B</label></div>
                            <div class="case-option"><input type="radio" id="color-color" name="clock-color" value="color" checked><label for="color-color">Cor</label></div>
                        </div>
                    </div>
                    <div class="option-group" id="interval-option-group">
                        <h2 style="text-align:center">Intervalo de tempo</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="interval-hour" name="clock-interval" value="hour"><label for="interval-hour">1 hora</label></div>
                            <div class="case-option"><input type="radio" id="interval-half" name="clock-interval" value="half"><label for="interval-half">30 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked><label for="interval-quarter">15 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-five" name="clock-interval" value="five"><label for="interval-five">5 min</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">Número de relógios</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="count-1" name="clock-count" value="1"><label for="count-1">1</label></div>
                            <div class="case-option"><input type="radio" id="count-6" name="clock-count" value="6"><label for="count-6">6</label></div>
                            <div class="case-option"><input type="radio" id="count-9" name="clock-count" value="9"><label for="count-9">9</label></div>
                            <div class="case-option"><input type="radio" id="count-12" name="clock-count" value="12" checked><label for="count-12">12</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('clock')}
    </div>
    <script src="../js/clock.js"></script>
${footer()}`;

// CHECKLIST
pages['checklist'] = `${head('Lista de verificação - AriClass', 'Crie listas de verificação imprimíveis com caixas de seleção. Layout de 1, 2 ou 4 por página.', 'checklist', '\n    <link rel="stylesheet" href="../css/checklist.css">')}
<body>
${nav('checklist')}
    <div class="generator-container">
        <h1>Lista de verificação</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título</h2>
                    <div class="case-options" style="justify-content:center;margin:12px 0 14px;">
                        <div class="case-option"><input type="radio" id="title-text" name="title-type" value="text" checked><label for="title-text">Texto</label></div>
                        <div class="case-option"><input type="radio" id="title-line" name="title-type" value="line"><label for="title-line">Sublinhado</label></div>
                        <div class="case-option"><input type="radio" id="title-none" name="title-type" value="none"><label for="title-none">Nenhum</label></div>
                    </div>
                    <input type="text" id="worksheet-title" placeholder="Digite o título">
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Layout <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corte pela linha pontilhada para obter 2 fichas. 4 por página: Corte em cruz para obter 4 fichas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Colunas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="columns" value="1" checked><label for="col-1">1 coluna</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="columns" value="2"><label for="col-2">2 colunas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espaçamento</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estreito</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal"><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide" checked><label for="spacing-wide">Amplo</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Numeração</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="num-yes" name="numbering" value="yes" checked><label for="num-yes">Sim</label></div>
                            <div class="case-option"><input type="radio" id="num-no" name="numbering" value="no"><label for="num-no">Não</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimir</button>
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
pages['vocab-test'] = `${head('Folha de notas - AriClass', 'Crie folhas de notas imprimíveis com linhas. Layout de 1, 2 ou 4 por página.', 'vocab-test', '\n    <link rel="stylesheet" href="../css/vocab-test.css">')}
<body>
${nav('vocab-test')}
    <div class="generator-container">
        <h1>Folha de notas</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Layout <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corte pela linha pontilhada para obter 2 fichas. 4 por página: Corte em cruz para obter 4 fichas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Estilo da linha</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="style-solid" name="linestyle" value="solid" checked><label for="style-solid">Sólido</label></div>
                            <div class="case-option"><input type="radio" id="style-dashed" name="linestyle" value="dashed"><label for="style-dashed">Tracejado</label></div>
                            <div class="case-option"><input type="radio" id="style-bold" name="linestyle" value="bold"><label for="style-bold">Negrito</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espaçamento entre linhas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estreito</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Amplo</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimir</button>
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
pages['writing-paper'] = `${head('Papel de escrita - AriClass', 'Crie papel de escrita imprimível com linhas. Ideal para praticar a escrita em inglês.', 'writing-paper', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/writing-paper.css">')}
<body>
${nav('writing-paper')}
    <div class="generator-container">
        <h1>Papel de escrita</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Layout <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corte pela linha pontilhada para obter 2 fichas. 4 por página: Corte em cruz para obter 4 fichas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espaçamento entre linhas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estreito</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Amplo</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Cor das linhas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="color-bw" name="linecolor" value="bw"><label for="color-bw">P&amp;B</label></div>
                            <div class="case-option"><input type="radio" id="color-red" name="linecolor" value="red" checked><label for="color-red">Vermelho</label></div>
                            <div class="case-option"><input type="radio" id="color-blue" name="linecolor" value="blue"><label for="color-blue">Azul</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimir</button>
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
pages['mind-map'] = `${head('Mapa mental - AriClass', 'Crie mapas mentais imprimíveis para brainstorming e organização de ideias.', 'mind-map', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/mind-map.css">')}
<body>
${nav('mind-map')}
    <div class="generator-container">
        <h1>Mapa mental</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Mind Map">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Forma central</h2>
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
                        <h2>Tamanho central</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="sz-small" name="centersize" value="small"><label for="sz-small">Pequeno</label></div>
                            <div class="case-option"><input type="radio" id="sz-medium" name="centersize" value="medium" checked><label for="sz-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="sz-large" name="centersize" value="large"><label for="sz-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Cor das linhas</h2>
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
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimir</button>
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
pages['secret-code'] = `${head('Código secreto - AriClass', 'Crie fichas de código secreto imprimíveis. Os alunos decifram palavras usando uma tabela de símbolos.', 'secret-code', '\n    <link rel="stylesheet" href="../css/secret-code.css">')}
<body>
${nav('secret-code')}
    <div class="generator-container">
        <h1>Código secreto</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título da ficha</h2>
                    <input type="text" id="worksheet-title" placeholder="Digite o título" value="Secret Code">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Inserir palavras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Digite uma palavra por linha&#10;Máximo 15 palavras"></textarea>
                    <div class="word-count-display" id="word-count-display"></div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamanho da fonte</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="fs-small" name="fontsize" value="small"><label for="fs-small">Pequeno</label></div>
                            <div class="case-option"><input type="radio" id="fs-medium" name="fontsize" value="medium" checked><label for="fs-medium">Médio</label></div>
                            <div class="case-option"><input type="radio" id="fs-large" name="fontsize" value="large"><label for="fs-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Layout</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="layout" value="1" checked><label for="col-1">1 coluna</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="layout" value="2"><label for="col-2">2 colunas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Chave de cifra</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="cipher-new" name="cipherkey" value="new" checked><label for="cipher-new">Nova chave</label></div>
                            <div class="case-option"><input type="radio" id="cipher-lock" name="cipherkey" value="lock"><label for="cipher-lock">Manter chave</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Gerar aleatoriamente</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Criar ficha</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Pré-visualização</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-key-btn" class="print-btn"><i class="fas fa-key"></i> Ver chave</button>
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
pages['how-to-use'] = `${head('Como usar AriClass - Guia para professores', 'Aprenda a usar AriClass para criar fichas de exercícios gratuitas de inglês e matemática.', 'how-to-use', '').replace('\n    <link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('how-to-use')}
    <div class="how-to-use-container" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;">
        <h1 style="text-align:center;margin-bottom:2rem;">Como usar AriClass</h1>
        <div style="margin-bottom:2rem;">
            <h2>1. Escolha o tipo de exercício</h2>
            <p>Selecione o tipo de exercício no menu de navegação ou na página inicial. Há exercícios de inglês, matemática, puzzles e fichas imprimíveis.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>2. Personalize as opções</h2>
            <p>Digite as suas palavras ou escolha as opções disponíveis (dificuldade, tamanho de fonte, layout, etc.). A pré-visualização é atualizada em tempo real.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>3. Imprima a ficha</h2>
            <p>Clique no botão "Imprimir" para imprimir diretamente do navegador. Também pode guardar como PDF a partir da caixa de diálogo de impressão.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>Dicas</h2>
            <ul style="padding-left:1.5rem;line-height:2;">
                <li>Não é necessário registo — comece a usar imediatamente!</li>
                <li>Todos os exercícios são otimizados para papel A4.</li>
                <li>Use o botão "Gerar aleatoriamente" para criar exercícios de prática rápida.</li>
                <li>Pode gerar várias páginas de uma vez.</li>
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

console.log('\nAll pt/ pages generated!');
