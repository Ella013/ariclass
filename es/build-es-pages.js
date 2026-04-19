const fs = require('fs');
const path = require('path');

const OUT = __dirname;

// ── Common templates ──────────────────────────────────────────────

function head(title, desc, page, extraCss = '') {
    const canonical = page === 'index'
        ? 'https://ariclass.com/es/'
        : `https://ariclass.com/es/${page}.html`;
    const enHref = page === 'index' ? 'https://ariclass.com/' : `https://ariclass.com/${page}.html`;
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" hreflang="en" href="${enHref}">
    <link rel="alternate" hreflang="ko" href="https://ariclass.com/ko/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="ja" href="https://ariclass.com/ja/${page === 'index' ? '' : page + '.html'}">
    <link rel="alternate" hreflang="es" href="${canonical}">
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon.ico">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/generator.css">${extraCss}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5619502783367221" crossorigin="anonymous"></script>
</head>`;
}

function nav(active) {
    const pages = {
        'word-search': 'Sopa de letras',
        'unscramble': 'Ordenar palabras',
        'crossword': 'Crucigrama',
        'matching-lists': 'Emparejamiento',
        'bingo': 'Bingo',
        'addition-subtraction': 'Suma y resta',
        'multiplication-table': 'Multiplicación y división',
        'clock': 'Leer el reloj',
        'sudoku': 'Sudoku',
        'maze': 'Laberinto',
        'checklist': 'Lista de control',
        'vocab-test': 'Hoja de notas',
        'writing-paper': 'Papel de escritura',
        'mind-map': 'Mapa mental',
        'how-to-use': 'Cómo usar',
    };
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
                    <p class="site-title">AriClass: Generador de ejercicios</p>
                    <p>Crea hojas de ejercicios de inglés, matemáticas y más en segundos.</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="Abrir menú"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">Inicio</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">Inglés</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">Sopa de letras</a></li>
                            <li><a href="unscramble.html">Ordenar palabras</a></li>
                            <li><a href="crossword.html">Crucigrama</a></li>
                            <li><a href="matching-lists.html">Emparejamiento</a></li>
                            <li><a href="bingo.html">Bingo</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">Matemáticas</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">Suma y resta</a></li>
                            <li><a href="multiplication-table.html">Multiplicación y división</a></li>
                            <li><a href="clock.html">Leer el reloj</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">Puzzles</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">Sudoku</a></li>
                            <li><a href="maze.html">Laberinto</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">Hojas</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">Lista de control</a></li>
                            <li><a href="vocab-test.html">Hoja de notas</a></li>
                            <li><a href="writing-paper.html">Papel de escritura</a></li>
                            <li><a href="mind-map.html">Mapa mental</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">Cómo usar</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">Inicio</a>
            <a href="word-search.html">Sopa de letras</a>
            <a href="unscramble.html">Ordenar palabras</a>
            <a href="crossword.html">Crucigrama</a>
            <a href="matching-lists.html">Emparejamiento</a>
            <a href="bingo.html">Bingo</a>
            <a href="addition-subtraction.html">Suma y resta</a>
            <a href="multiplication-table.html">Multiplicación y división</a>
            <a href="clock.html">Leer el reloj</a>
            <a href="sudoku.html">Sudoku</a>
            <a href="maze.html">Laberinto</a>
            <a href="checklist.html">Lista de control</a>
            <a href="vocab-test.html">Hoja de notas</a>
            <a href="writing-paper.html">Papel de escritura</a>
            <a href="mind-map.html">Mapa mental</a>
            <a href="how-to-use.html">Cómo usar</a>
        </nav>
    </header>`;
}

function footer() {
    return `    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>AriClass ofrece hojas de ejercicios gratuitas para inglés, matemáticas y más.</p>
            </div>
            <nav class="footer-nav">
                <h3>Enlaces rápidos</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="word-search.html">Sopa de letras</a></li>
                    <li><a href="unscramble.html">Ordenar palabras</a></li>
                    <li><a href="crossword.html">Crucigrama</a></li>
                    <li><a href="matching-lists.html">Emparejamiento</a></li>
                    <li><a href="bingo.html">Bingo</a></li>
                    <li><a href="sudoku.html">Sudoku</a></li>
                    <li><a href="maze.html">Laberinto</a></li>
                    <li><a href="addition-subtraction.html">Suma y resta</a></li>
                    <li><a href="multiplication-table.html">Multiplicación y división</a></li>
                    <li><a href="clock.html">Leer el reloj</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>Información</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">Política de privacidad</a></li>
                    <li><a href="../terms-of-use.html">Términos de uso</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">Contacto</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>Contacto</h3>
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
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
${btn}                    <div id="puzzle-preview"></div>
                </div>
            </div>`;
}

function descriptionSection(page) {
    const s = {
        'word-search': `        <div class="description-section">
            <h2>Cómo crear tu sopa de letras</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Escribe o pega tus palabras (máximo 10/15/20 según el nivel)</li>
                        <li>Elige letras mayúsculas o minúsculas</li>
                        <li>Selecciona opciones como palabras diagonales o al revés</li>
                        <li>Haz clic en "Crear puzzle" para generar la sopa de letras</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora el reconocimiento de vocabulario y la ortografía</li>
                        <li>Desarrolla el reconocimiento de patrones y la exploración visual</li>
                        <li>Ideal para estudiantes de ESL/EFL y principiantes</li>
                        <li>Crea actividades dinámicas para el aula o tareas</li>
                        <li>Niveles de dificultad personalizables</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Usa listas de palabras temáticas para reforzar vocabulario específico</li>
                        <li>Empieza con palabras cortas para principiantes</li>
                        <li>Activa palabras diagonales y al revés para estudiantes avanzados</li>
                        <li>Imprime varias copias para actividades en clase</li>
                        <li>Úsalo como actividad de calentamiento o complemento de lección</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'unscramble': `        <div class="description-section">
            <h2>Cómo crear tu hoja de ordenar palabras</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Escribe o pega las oraciones en el cuadro de texto</li>
                        <li>Asegúrate de que cada oración termine con punto (.)</li>
                        <li>Haz clic en "Crear ejercicio" para generar la actividad</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora la comprensión de la estructura de las oraciones</li>
                        <li>Refuerza el orden correcto de las palabras</li>
                        <li>Ideal para estudiantes de ESL/EFL</li>
                        <li>Desarrolla el pensamiento lógico</li>
                        <li>Refuerza la formación correcta de oraciones</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con oraciones simples y cortas para principiantes</li>
                        <li>Usa vocabulario del tema de la lección actual</li>
                        <li>Incluye una variedad de tipos de oraciones</li>
                        <li>Imprime con la clave de respuestas para facilitar la corrección</li>
                        <li>Úsalo como actividad de calentamiento o repaso</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'crossword': `        <div class="description-section">
            <h2>Cómo crear tu crucigrama</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Añade palabras y sus pistas correspondientes</li>
                        <li>Elige el tamaño del puzzle según tus necesidades</li>
                        <li>Selecciona opciones adicionales de visualización</li>
                        <li>Haz clic en "Crear crucigrama" para generarlo</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora el vocabulario y la ortografía</li>
                        <li>Desarrolla la resolución de problemas</li>
                        <li>Ideal para estudiantes de ESL/EFL</li>
                        <li>Crea actividades dinámicas para el aula</li>
                        <li>Refuerza la comprensión lectora</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Escribe pistas claras y apropiadas para la edad</li>
                        <li>Usa vocabulario temático para lecciones específicas</li>
                        <li>Empieza con puzzles pequeños para principiantes</li>
                        <li>Incluye una mezcla de palabras fáciles y difíciles</li>
                        <li>Úsalo como actividad de repaso o tarea</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'matching-lists': `        <div class="description-section">
            <h2>Cómo crear tu hoja de emparejamiento</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Añade pares de palabras o frases relacionadas</li>
                        <li>Haz clic en "Crear ejercicio" para generar la hoja</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora la comprensión del vocabulario</li>
                        <li>Refuerza la asociación de palabras</li>
                        <li>Ideal para estudiantes de ESL/EFL</li>
                        <li>Crea actividades de emparejamiento dinámicas</li>
                        <li>Refuerza las conexiones de aprendizaje</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Usa pares claros y relacionados</li>
                        <li>Incluye una mezcla de emparejamientos fáciles y difíciles</li>
                        <li>Agrupa conceptos relacionados</li>
                        <li>Úsalo como actividad de repaso</li>
                        <li>Combínalo con otras actividades de aprendizaje</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'bingo': `        <div class="description-section">
            <h2>Cómo crear tu juego de bingo</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Añade palabras de vocabulario o usa la generación aleatoria</li>
                        <li>Elige el tamaño del tablero (3x3, 4x4 o 5x5)</li>
                        <li>Selecciona el número de jugadores</li>
                        <li>Haz clic en "Crear bingo" para generar el juego</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora el reconocimiento de vocabulario</li>
                        <li>Fomenta la participación activa</li>
                        <li>Ideal para actividades grupales</li>
                        <li>Mejora las habilidades de lectura</li>
                        <li>Hace el aprendizaje divertido y dinámico</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Usa conjuntos de vocabulario temático</li>
                        <li>Empieza con tableros pequeños para estudiantes más jóvenes</li>
                        <li>Prepara suficientes palabras para tableros grandes</li>
                        <li>Úsalo como actividad de repaso</li>
                        <li>Crea múltiples conjuntos para diferentes grupos</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'sudoku': `        <div class="description-section">
            <h2>Cómo crear tu puzzle de sudoku</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Selecciona el nivel de dificultad (Fácil, Medio, Difícil o Experto)</li>
                        <li>Haz clic en "Crear puzzle" para generar el sudoku</li>
                        <li>Usa "Ver respuestas" para mostrar la solución</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora el pensamiento lógico y la resolución de problemas</li>
                        <li>Refuerza el reconocimiento de números y patrones</li>
                        <li>Ideal para la práctica de matemáticas y el desarrollo cognitivo</li>
                        <li>Desarrolla la concentración y la atención al detalle</li>
                        <li>Crea actividades dinámicas para el aula o tareas</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con el nivel Fácil para principiantes</li>
                        <li>Usa el nivel Medio para estudiantes familiarizados con el sudoku</li>
                        <li>Desafía a los avanzados con los niveles Difícil o Experto</li>
                        <li>Imprime con la clave de respuestas para facilitar la corrección</li>
                        <li>Úsalo como calentamiento o ejercicio de enriquecimiento matemático</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'maze': `        <div class="description-section">
            <h2>Cómo crear tu laberinto</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Selecciona el nivel de dificultad (Fácil 10x10, Medio 15x15 o Difícil 20x20)</li>
                        <li>Haz clic en "Crear laberinto" para generar uno aleatorio</li>
                        <li>Usa "Ver respuestas" para mostrar el camino solución en rojo</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora la resolución de problemas y el pensamiento crítico</li>
                        <li>Desarrolla el razonamiento espacial y la percepción visual</li>
                        <li>Fomenta la paciencia y la perseverancia</li>
                        <li>Ideal para el entrenamiento cerebral y el desarrollo cognitivo</li>
                        <li>Crea actividades dinámicas para el aula o tareas</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con Fácil (10x10) para estudiantes más jóvenes</li>
                        <li>Usa Medio (15x15) para la mayoría de los estudiantes</li>
                        <li>Desafía a los avanzados con Difícil (20x20)</li>
                        <li>Imprime con la clave de respuestas (camino rojo) para facilitar la corrección</li>
                        <li>Úsalo como calentamiento o ejercicio de resolución de problemas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'addition-subtraction': `        <div class="description-section">
            <h2>Cómo crear tu hoja de suma y resta</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Elige el tipo de operación (Suma, Resta o Mixto)</li>
                        <li>Selecciona el nivel de dificultad</li>
                        <li>Establece el número de problemas</li>
                        <li>Haz clic en "Crear ejercicio" para generar los problemas</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Mejora el cálculo mental y las habilidades aritméticas</li>
                        <li>Refuerza el sentido numérico y el valor posicional</li>
                        <li>Ideal para estudiantes de primaria y secundaria</li>
                        <li>Crea práctica dinámica para el aula o tareas</li>
                        <li>Niveles de dificultad personalizables para diferentes habilidades</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con niveles más fáciles para principiantes</li>
                        <li>Usa operaciones mixtas para desafiar a los estudiantes</li>
                        <li>Imprime varias copias para actividades en clase</li>
                        <li>Úsalo como ejercicio de calentamiento diario</li>
                        <li>Ajusta el número de problemas según el tiempo disponible</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'multiplication-table': `        <div class="description-section">
            <h2>Cómo crear tu hoja de multiplicación y división</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Escribe un título para tu ejercicio</li>
                        <li>Elige el tipo de operación (Multiplicación, División o Mixto)</li>
                        <li>Selecciona el nivel de dificultad</li>
                        <li>Establece el número de páginas</li>
                        <li>Haz clic en "Crear ejercicio"</li>
                        <li>Imprime con el botón de imprimir</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Niveles de dificultad</h3>
                    <ul>
                        <li><strong>Nivel 1:</strong> 1 dígito × 1 dígito (hasta 9×9)</li>
                        <li><strong>Nivel 2:</strong> 2 dígitos × 1 dígito (ej. 47×6)</li>
                        <li><strong>Nivel 3:</strong> 2 dígitos × 2 dígitos (ej. 34×28)</li>
                        <li>Los problemas de división siempre tienen respuestas enteras</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con el Nivel 1 para principiantes</li>
                        <li>Usa Mixto para practicar ambas operaciones</li>
                        <li>Imprime varias páginas para ejercicios cronometrados</li>
                        <li>Usa "Ver respuestas" para crear una clave de respuestas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'clock': `        <div class="description-section">
            <h2>Cómo crear tu hoja de leer el reloj</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Pasos para crear</h3>
                    <ol>
                        <li>Elige un modo: leer la hora o dibujar las agujas</li>
                        <li>Selecciona el intervalo de tiempo (cada hora, 30, 15 o 5 min)</li>
                        <li>Establece el número de relojes por página</li>
                        <li>Haz clic en Crear para obtener un nuevo conjunto de horas</li>
                        <li>Imprime el ejercicio</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Beneficios educativos</h3>
                    <ul>
                        <li>Enseña a leer el reloj analógico</li>
                        <li>Desarrolla el sentido numérico y los conceptos de tiempo</li>
                        <li>Dos modos para practicar lectura y escritura</li>
                        <li>Dificultad ajustable con los intervalos de tiempo</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos para profesores</h3>
                    <ul>
                        <li>Empieza con "cada hora" para principiantes</li>
                        <li>Usa "dibujar las agujas" para práctica avanzada</li>
                        <li>Mezcla diseños de 6 y 9 relojes para variedad</li>
                        <li>Ideal para lecciones de vocabulario de tiempo en ESL/EFL</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'checklist': `        <div class="description-section">
            <h2>Cómo usar las plantillas de lista de control</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa con casillas de verificación</li>
                        <li>Incluye campos de Fecha y Nombre en la parte superior</li>
                        <li>Ideal para listas de tareas largas</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Dos listas en una página A4</li>
                        <li>Corta por la línea discontinua para separar</li>
                        <li>Ideal para listas cortas — ¡ahorra papel!</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Cuatro mini listas en una cuadrícula 2×2</li>
                        <li>Corta cada celda por separado</li>
                        <li>Ideal para tareas diarias rápidas o trabajos pequeños</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'vocab-test': `        <div class="description-section">
            <h2>Cómo usar las hojas de notas</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa con líneas de escritura</li>
                        <li>Incluye campos de Fecha y Nombre en la parte superior</li>
                        <li>Ideal para listas de vocabulario largas o toma de notas</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Dos hojas en una página A4</li>
                        <li>Corta por la línea discontinua para separar</li>
                        <li>Ideal para listas de vocabulario cortas (¡ahorra papel!)</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Cuatro mini hojas en una cuadrícula 2×2 en una página A4</li>
                        <li>Corta cada celda por separado</li>
                        <li>Ideal para pruebas rápidas o listas de palabras pequeñas</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'writing-paper': `        <div class="description-section">
            <h2>Cómo usar el papel de escritura</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 por página</h3>
                    <ul>
                        <li>Página A4 completa con renglones de escritura en inglés</li>
                        <li>Sistema de 3 líneas: altura de mayúsculas, x-height (discontinuo) y línea base</li>
                        <li>Incluye campos de Fecha y Nombre en la parte superior</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 por página</h3>
                    <ul>
                        <li>Dos hojas en una página A4</li>
                        <li>Corta por la línea discontinua para separar</li>
                        <li>Ideal para ejercicios de escritura más cortos</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 por página</h3>
                    <ul>
                        <li>Cuatro mini hojas en una cuadrícula 2×2</li>
                        <li>Corta por las líneas en cruz para separar</li>
                        <li>Ideal para práctica de escritura rápida</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'mind-map': `        <div class="description-section">
            <h2>Cómo usar el mapa mental</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>4 ramas</h3>
                    <ul>
                        <li>4 áreas de temas principales</li>
                        <li>Ideal para categorización simple</li>
                        <li>Más espacio por rama para escribir</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>6 ramas</h3>
                    <ul>
                        <li>6 áreas de temas principales</li>
                        <li>Ideal para la mayoría de las tareas de lluvia de ideas</li>
                        <li>Diseño equilibrado alrededor del centro</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>8 ramas</h3>
                    <ul>
                        <li>8 áreas de temas principales</li>
                        <li>Ideal para mapas mentales detallados</li>
                        <li>Excelente para temas complejos</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'secret-code': `        <div class="description-section">
            <h2>Cómo usar el código secreto</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Cómo funciona</h3>
                    <ul>
                        <li>A cada letra de la A a la Z se le asigna un símbolo único</li>
                        <li>Las palabras se muestran como secuencias de símbolos</li>
                        <li>Los estudiantes usan la clave para descifrar cada palabra</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Consejos</h3>
                    <ul>
                        <li>Hasta 15 palabras por hoja de ejercicios</li>
                        <li>Haz clic en Crear para obtener un nuevo cifrado aleatorio cada vez</li>
                        <li>Usa la opción Clave de respuestas para la autocorrección</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Ideal para</h3>
                    <ul>
                        <li>Repaso de vocabulario de forma divertida</li>
                        <li>Actividad para quienes terminan antes</li>
                        <li>Práctica de ortografía</li>
                    </ul>
                </div>
            </div>
        </div>`,
    };
    return s[page] || '';
}

// ── Pages ─────────────────────────────────────────────────────────

const pages = {};

// INDEX
pages['index'] = `${head('AriClass - Generador gratuito de hojas de ejercicios', 'Crea hojas de ejercicios gratuitas de matemáticas, inglés y más. Sopa de letras, crucigrama, bingo, suma, multiplicación, reloj y más — listas para imprimir.', 'index', '').replace('<link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('index')}
    <main class="main-content">
        <div class="section-title">
            <h1>Generador gratuito de hojas de ejercicios</h1>
            <p>Elige el tipo de ejercicio y estará listo para imprimir en segundos</p>
        </div>
        <div class="worksheet-section" id="section-english">
            <div class="worksheet-section-header english-section-header">
                <i class="fas fa-book-open"></i><span>Ejercicios de Inglés</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/word-search-preview.png" alt="Sopa de letras" loading="eager">
                    <h3>Sopa de letras</h3>
                    <p>Crea sopas de letras con tus propias palabras</p>
                    <a href="word-search.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/unscramble-preview.png" alt="Ordenar palabras" loading="lazy">
                    <h3>Ordenar palabras</h3>
                    <p>Ejercicios para practicar el orden de las palabras</p>
                    <a href="unscramble.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/crossword-preview.png" alt="Crucigrama" loading="lazy">
                    <h3>Crucigrama</h3>
                    <p>Crea crucigramas para practicar vocabulario</p>
                    <a href="crossword.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/matching-lists-preview.png" alt="Emparejamiento" loading="lazy">
                    <h3>Emparejamiento</h3>
                    <p>Conecta palabras o conceptos relacionados</p>
                    <a href="matching-lists.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/bingo-preview.png" alt="Bingo" loading="lazy">
                    <h3>Bingo</h3>
                    <p>Tarjetas de bingo personalizadas para practicar vocabulario</p>
                    <a href="bingo.html" class="create-btn">Crear</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-math">
            <div class="worksheet-section-header math-section-header">
                <i class="fas fa-calculator"></i><span>Ejercicios de Matemáticas</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/addition-subtraction-preview.png" alt="Suma y resta" loading="lazy">
                    <h3>Suma y resta</h3>
                    <p>Hojas de práctica de suma y resta</p>
                    <a href="addition-subtraction.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/multiplication-table-preview.png" alt="Multiplicación y división" loading="lazy">
                    <h3>Multiplicación y división</h3>
                    <p>Hojas de práctica de multiplicación y división</p>
                    <a href="multiplication-table.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/clock-preview.png" alt="Leer el reloj" loading="lazy">
                    <h3>Leer el reloj</h3>
                    <p>Hojas para practicar la lectura del reloj analógico</p>
                    <a href="clock.html" class="create-btn">Crear</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-puzzles">
            <div class="worksheet-section-header puzzle-section-header">
                <i class="fas fa-puzzle-piece"></i><span>Puzzles y Juegos</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/sudoku-preview.png" alt="Sudoku" loading="lazy">
                    <h3>Sudoku</h3>
                    <p>Sudoku de distintas dificultades para entrenar la lógica</p>
                    <a href="sudoku.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/maze-preview.png" alt="Laberinto" loading="lazy">
                    <h3>Laberinto</h3>
                    <p>Laberintos de distintos tamaños para resolver problemas</p>
                    <a href="maze.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Secret Code.png" alt="Código secreto" loading="lazy">
                    <h3>Código secreto</h3>
                    <p>Descifra palabras usando una tabla de símbolos</p>
                    <a href="secret-code.html" class="create-btn">Crear</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-sheets">
            <div class="worksheet-section-header template-section-header">
                <i class="fas fa-clipboard-list"></i><span>Hojas imprimibles</span>
            </div>
            <div class="worksheet-grid worksheet-grid-coming-soon">
                <div class="worksheet-card">
                    <img src="../images/Checklist.png" alt="Lista de control" loading="lazy">
                    <h3>Lista de control</h3>
                    <p>Listas de verificación con casillas — diseño 1, 2 o 4 por página</p>
                    <a href="checklist.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Note Sheet.png" alt="Hoja de notas" loading="lazy">
                    <h3>Hoja de notas</h3>
                    <p>Hoja imprimible con fecha y nombre — diseño 1, 2 o 4 por página</p>
                    <a href="vocab-test.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Writing Paper.png" alt="Papel de escritura" loading="lazy">
                    <h3>Papel de escritura</h3>
                    <p>Papel con renglones para practicar escritura en inglés</p>
                    <a href="writing-paper.html" class="create-btn">Crear</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Mind Map.png" alt="Mapa mental" loading="lazy">
                    <h3>Mapa mental</h3>
                    <p>Mapa mental para lluvia de ideas y organización</p>
                    <a href="mind-map.html" class="create-btn">Crear</a>
                </div>
            </div>
        </div>
    </main>
    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2>¿Por qué elegir AriClass?</h2>
                <p>Funciones para facilitar la creación de ejercicios</p><br>
            </div>
            <div class="features-grid">
                <div class="feature-card"><i class="fas fa-bolt"></i><h3>Rápido</h3><p>Crea ejercicios en segundos con una interfaz intuitiva</p></div>
                <div class="feature-card"><i class="fas fa-print"></i><h3>Listo para imprimir</h3><p>Todos los ejercicios están optimizados para papel A4</p></div>
                <div class="feature-card"><i class="fas fa-cog"></i><h3>Personalizable</h3><p>Ajusta las opciones según los objetivos de tu clase</p></div>
                <div class="feature-card"><i class="fas fa-download"></i><h3>Sin registro</h3><p>Empieza a usar sin necesidad de crear una cuenta</p></div>
            </div>
        </div>
    </section>
${footer()}`;

// WORD SEARCH
pages['word-search'] = `${head('Sopa de letras gratuita - AriClass', 'Crea sopas de letras imprimibles con tu propio vocabulario. Ideal para profesores de ESL y estudiantes de todos los niveles.', 'word-search', '')}
<body>
${nav('word-search')}
    <div class="generator-container">
        <h1>Sopa de letras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar palabras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mezclar vista previa"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Ingresa las palabras (una por línea)&#10;Máximo 20 palabras"></textarea>
                    <button id="add-word-btn" class="clear-btn"><i class="fas fa-trash"></i> Borrar</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option"><input type="radio" id="level1" name="level" value="1"><label for="level1">Nivel 1 (Fácil)</label></div>
                            <div class="level-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nivel 2 (Medio)</label></div>
                            <div class="level-option"><input type="radio" id="level3" name="level" value="3" checked><label for="level3">Nivel 3 (Difícil)</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words"> MAYÚSCULAS</label>
                            <label><input type="radio" name="case" id="lowercase-words" checked> minúsculas</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="show-word-list" checked> Mostrar lista de palabras</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> Incluir palabras diagonales</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> Incluir palabras al revés</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear puzzle</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('word-search')}
    </div>
    <script src="../js/wordSearch.js"></script>
${footer()}`;

// UNSCRAMBLE
pages['unscramble'] = `${head('Ordenar palabras - AriClass', 'Crea hojas de ejercicios para ordenar palabras en oraciones. Perfecto para practicar gramática y vocabulario.', 'unscramble', '\n    <link rel="stylesheet" href="../css/unscramble.css">')}
<body>
${nav('unscramble')}
    <div class="generator-container">
        <h1>Ordenar palabras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar oraciones</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mezclar vista previa"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="Ingresa las oraciones. Cada oración debe terminar con punto (.), signo de interrogación (?) o exclamación (!)."></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Borrar todo</button>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="capitalize-first" checked> Mayúscula al inicio</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamaño de fuente</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeño</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Mediano</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacio entre preguntas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-compact" name="question-spacing" value="compact"><label for="spacing-compact">Compacto</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="question-spacing" value="wide"><label for="spacing-wide">Amplio</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('unscramble')}
    </div>
    <script src="../js/unscramble.js"></script>
${footer()}`;

// CROSSWORD
pages['crossword'] = `${head('Crucigrama gratuito - AriClass', 'Crea crucigramas imprimibles con tu propio vocabulario. Perfecto para profesores de idiomas.', 'crossword', '\n    <link rel="stylesheet" href="../css/crossword.css">')}
<body>
${nav('crossword')}
    <div class="generator-container">
        <h1>Crucigrama</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar palabras y pistas</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> Agregar palabra</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Borrar todo</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear crucigrama</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled><i class="fas fa-print"></i> Imprimir</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Ver respuestas</button>
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
pages['matching-lists'] = `${head('Emparejamiento de palabras - AriClass', 'Crea hojas de emparejamiento de palabras imprimibles. Ideal para profesores de idiomas y estudiantes.', 'matching-lists', '\n    <link rel="stylesheet" href="../css/matching-lists.css">')}
<body>
${nav('matching-lists')}
    <div class="generator-container">
        <h1>Emparejamiento de palabras</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar pares de palabras</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> Agregar par</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Borrar todo</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="uppercase" name="letter-case" value="uppercase"><label for="uppercase">MAYÚSCULAS</label></div>
                            <div class="case-option"><input type="radio" id="lowercase" name="letter-case" value="lowercase" checked><label for="lowercase">minúsculas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">Tamaño de fuente</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeño</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Mediano</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Ver respuestas</button>
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
pages['bingo'] = `${head('Bingo gratuito - AriClass', 'Crea tarjetas de bingo imprimibles con tus propias palabras. Ideal para el aula y aprendizaje de idiomas.', 'bingo', '\n    <link rel="stylesheet" href="../css/bingo.css">')}
<body>
${nav('bingo')}
    <div class="generator-container">
        <h1>Bingo</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Bingo">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar palabras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mezclar vista previa"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="wordInput" class="vocab-textarea" placeholder="Ingresa las palabras (una por línea)"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Borrar todo</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamaño del tablero</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="board-3" name="board-size" value="3"><label for="board-3">3 x 3</label></div>
                            <div class="case-option"><input type="radio" id="board-4" name="board-size" value="4" checked><label for="board-4">4 x 4</label></div>
                            <div class="case-option"><input type="radio" id="board-5" name="board-size" value="5"><label for="board-5">5 x 5</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Tamaño de fuente</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Pequeño</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Mediano</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group option-checkboxes">
                        <label class="check-option-label"><input type="checkbox" id="top-align"> Alinear palabras arriba</label>
                        <label class="check-option-label"><input type="checkbox" id="free-space"> Espacio libre (FREE)</label>
                    </div>
                    <div class="option-group">
                        <h2>Número de jugadores <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">Cada jugador recibe una tarjeta de bingo única. Al imprimir se genera una página por jugador.</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear bingo</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('bingo')}
    </div>
    <script src="../js/bingo.js"></script>
${footer()}`;

// SUDOKU
pages['sudoku'] = `${head('Sudoku gratuito - AriClass', 'Crea hojas de sudoku imprimibles con distintos niveles de dificultad. Ideal para el aula y el hogar.', 'sudoku', '\n    <link rel="stylesheet" href="../css/sudoku.css">')}
<body>
${nav('sudoku')}
    <div class="generator-container">
        <h1>Sudoku</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Nivel de dificultad</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked><label for="difficulty-easy">Fácil</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-medium" name="difficulty" value="medium"><label for="difficulty-medium">Medio</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-hard" name="difficulty" value="hard"><label for="difficulty-hard">Difícil</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-expert" name="difficulty" value="expert"><label for="difficulty-expert">Experto</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear puzzle</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Ver respuestas</button>
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
pages['maze'] = `${head('Laberinto gratuito - AriClass', 'Crea laberintos imprimibles de distintas dificultades. Ideal para el aula y actividades en casa.', 'maze', '\n    <link rel="stylesheet" href="../css/maze.css">')}
<body>
${nav('maze')}
    <div class="generator-container">
        <h1>Laberinto</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Nivel de dificultad</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="diff-easy" name="difficulty" value="easy"><label for="diff-easy">Fácil</label></div>
                            <div class="case-option"><input type="radio" id="diff-medium" name="difficulty" value="medium" checked><label for="diff-medium">Medio</label></div>
                            <div class="case-option"><input type="radio" id="diff-hard" name="difficulty" value="hard"><label for="diff-hard">Difícil</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Tipo de laberinto</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="type-grid" name="maze-type" value="grid" checked><label for="type-grid">Cuadrícula</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear laberinto</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Ver respuestas</button>
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
pages['addition-subtraction'] = `${head('Suma y resta - AriClass', 'Crea hojas de ejercicios de suma y resta imprimibles con distintos niveles de dificultad.', 'addition-subtraction', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">')}
<body>
${nav('addition-subtraction')}
    <div class="generator-container">
        <h1>Suma y resta</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="addition-only" value="addition" checked> Solo suma</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> Solo resta</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Mixto</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nivel de dificultad</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Nivel 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nivel 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Nivel 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problemas por página</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Estándar</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Más</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Ver respuestas</button>
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
pages['multiplication-table'] = `${head('Multiplicación y división - AriClass', 'Crea hojas de ejercicios de multiplicación y división imprimibles con distintos niveles de dificultad.', 'multiplication-table', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">\n    <link rel="stylesheet" href="../css/multiplication-table.css">')}
<body>
${nav('multiplication-table')}
    <div class="generator-container">
        <h1>Multiplicación y división</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> Solo multiplicación</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="division-only" value="division"> Solo división</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Mixto</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nivel de dificultad</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Nivel 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Nivel 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Nivel 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problemas por página</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Estándar</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Más</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Número de páginas</h2>
                        <label>Páginas: <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Ver respuestas</button>
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
pages['clock'] = `${head('Leer el reloj - AriClass', 'Crea hojas de ejercicios de lectura del reloj analógico. Ideal para niños y estudiantes de primaria.', 'clock', '\n    <link rel="stylesheet" href="../css/clock.css">')}
<body>
${nav('clock')}
    <div class="generator-container">
        <h1>Leer el reloj</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2 style="text-align:center">Modo</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="mode-read" name="clock-mode" value="read" checked><label for="mode-read">Leer la hora</label></div>
                            <div class="case-option"><input type="radio" id="mode-draw" name="clock-mode" value="draw"><label for="mode-draw">Dibujar las agujas</label></div>
                        </div>
                        <div style="text-align:center;margin-top:0.5rem;">
                            <label><input type="checkbox" id="hide-time-label"> <s>12:00</s></label>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">Color de las agujas</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="color-bw" name="clock-color" value="bw"><label for="color-bw">B&amp;N</label></div>
                            <div class="case-option"><input type="radio" id="color-color" name="clock-color" value="color" checked><label for="color-color">Color</label></div>
                        </div>
                    </div>
                    <div class="option-group" id="interval-option-group">
                        <h2 style="text-align:center">Intervalo de tiempo</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="interval-hour" name="clock-interval" value="hour"><label for="interval-hour">1 hora</label></div>
                            <div class="case-option"><input type="radio" id="interval-half" name="clock-interval" value="half"><label for="interval-half">30 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked><label for="interval-quarter">15 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-five" name="clock-interval" value="five"><label for="interval-five">5 min</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">Número de relojes</h2>
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
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('clock')}
    </div>
    <script src="../js/clock.js"></script>
${footer()}`;

// CHECKLIST
pages['checklist'] = `${head('Lista de control - AriClass', 'Crea listas de verificación imprimibles con casillas. Diseño de 1, 2 o 4 por página.', 'checklist', '\n    <link rel="stylesheet" href="../css/checklist.css">')}
<body>
${nav('checklist')}
    <div class="generator-container">
        <h1>Lista de control</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título</h2>
                    <div class="case-options" style="justify-content:center;margin:12px 0 14px;">
                        <div class="case-option"><input type="radio" id="title-text" name="title-type" value="text" checked><label for="title-text">Texto</label></div>
                        <div class="case-option"><input type="radio" id="title-line" name="title-type" value="line"><label for="title-line">Subrayado</label></div>
                        <div class="case-option"><input type="radio" id="title-none" name="title-type" value="none"><label for="title-none">Sin título</label></div>
                    </div>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título">
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Diseño <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corta por la línea discontinua para obtener 2 hojas. 4 por página: Corta en cruz para obtener 4 hojas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Columnas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="columns" value="1" checked><label for="col-1">1 columna</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="columns" value="2"><label for="col-2">2 columnas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacio</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estrecho</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Amplio</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Numeración</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="num-yes" name="numbering" value="yes" checked><label for="num-yes">Sí</label></div>
                            <div class="case-option"><input type="radio" id="num-no" name="numbering" value="no"><label for="num-no">No</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
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
pages['vocab-test'] = `${head('Hoja de notas - AriClass', 'Crea hojas de notas imprimibles con renglones. Diseño de 1, 2 o 4 por página.', 'vocab-test', '\n    <link rel="stylesheet" href="../css/vocab-test.css">')}
<body>
${nav('vocab-test')}
    <div class="generator-container">
        <h1>Hoja de notas</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Diseño <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corta por la línea discontinua para obtener 2 hojas. 4 por página: Corta en cruz para obtener 4 hojas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Estilo de línea</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="style-solid" name="linestyle" value="solid" checked><label for="style-solid">Sólido</label></div>
                            <div class="case-option"><input type="radio" id="style-dashed" name="linestyle" value="dashed"><label for="style-dashed">Discontinuo</label></div>
                            <div class="case-option"><input type="radio" id="style-bold" name="linestyle" value="bold"><label for="style-bold">Grueso</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacio entre líneas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estrecho</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Amplio</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
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
pages['writing-paper'] = `${head('Papel de escritura - AriClass', 'Crea papel de escritura imprimible con renglones. Ideal para practicar escritura en inglés.', 'writing-paper', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/writing-paper.css">')}
<body>
${nav('writing-paper')}
    <div class="generator-container">
        <h1>Papel de escritura</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Diseño <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 por página: Corta por la línea discontinua para obtener 2 hojas. 4 por página: Corta en cruz para obtener 4 hojas.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 página</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 páginas</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 páginas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacio entre líneas</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Estrecho</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Amplio</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Color de línea</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="color-bw" name="linecolor" value="bw"><label for="color-bw">B&amp;N</label></div>
                            <div class="case-option"><input type="radio" id="color-red" name="linecolor" value="red" checked><label for="color-red">Rojo</label></div>
                            <div class="case-option"><input type="radio" id="color-blue" name="linecolor" value="blue"><label for="color-blue">Azul</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
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
pages['mind-map'] = `${head('Mapa mental - AriClass', 'Crea mapas mentales imprimibles para lluvia de ideas y organización de conceptos.', 'mind-map', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/mind-map.css">')}
<body>
${nav('mind-map')}
    <div class="generator-container">
        <h1>Mapa mental</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Mind Map">
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
                        <h2>Tamaño central</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="sz-small" name="centersize" value="small"><label for="sz-small">Pequeño</label></div>
                            <div class="case-option"><input type="radio" id="sz-medium" name="centersize" value="medium" checked><label for="sz-medium">Mediano</label></div>
                            <div class="case-option"><input type="radio" id="sz-large" name="centersize" value="large"><label for="sz-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Color de líneas</h2>
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
                <div class="preview-label">Vista previa</div>
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
pages['secret-code'] = `${head('Código secreto - AriClass', 'Crea hojas de código secreto imprimibles. Los alumnos descifran palabras usando una tabla de símbolos.', 'secret-code', '\n    <link rel="stylesheet" href="../css/secret-code.css">')}
<body>
${nav('secret-code')}
    <div class="generator-container">
        <h1>Código secreto</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Título del ejercicio</h2>
                    <input type="text" id="worksheet-title" placeholder="Ingresa el título" value="Secret Code">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Mostrar título</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Ingresar palabras</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Reiniciar"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Ingresa una palabra por línea&#10;Máximo 15 palabras"></textarea>
                    <div class="word-count-display" id="word-count-display"></div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Tamaño de fuente</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="fs-small" name="fontsize" value="small"><label for="fs-small">Pequeño</label></div>
                            <div class="case-option"><input type="radio" id="fs-medium" name="fontsize" value="medium" checked><label for="fs-medium">Mediano</label></div>
                            <div class="case-option"><input type="radio" id="fs-large" name="fontsize" value="large"><label for="fs-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Diseño</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="layout" value="1" checked><label for="col-1">1 columna</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="layout" value="2"><label for="col-2">2 columnas</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Clave de cifrado</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="cipher-new" name="cipherkey" value="new" checked><label for="cipher-new">Nueva clave</label></div>
                            <div class="case-option"><input type="radio" id="cipher-lock" name="cipherkey" value="lock"><label for="cipher-lock">Mantener clave</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Generar aleatorio</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Crear ejercicio</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Vista previa</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimir</button>
                        <button id="answer-key-btn" class="print-btn"><i class="fas fa-key"></i> Ver clave</button>
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
pages['how-to-use'] = `${head('Cómo usar AriClass - Guía para profesores', 'Aprende a usar AriClass para crear hojas de ejercicios gratuitas de inglés y matemáticas.', 'how-to-use', '').replace('\n    <link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('how-to-use')}
    <div class="how-to-use-container" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;">
        <h1 style="text-align:center;margin-bottom:2rem;">Cómo usar AriClass</h1>
        <div style="margin-bottom:2rem;">
            <h2>1. Elige el tipo de ejercicio</h2>
            <p>Selecciona el tipo de ejercicio desde el menú de navegación o la página de inicio. Hay ejercicios de inglés, matemáticas, puzzles y hojas imprimibles.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>2. Personaliza las opciones</h2>
            <p>Ingresa tus palabras o elige las opciones disponibles (dificultad, tamaño de fuente, diseño, etc.). La vista previa se actualiza en tiempo real.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>3. Imprime el ejercicio</h2>
            <p>Haz clic en el botón "Imprimir" para imprimir directamente desde el navegador. También puedes guardar como PDF desde el cuadro de diálogo de impresión.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>Consejos</h2>
            <ul style="padding-left:1.5rem;line-height:2;">
                <li>No se necesita registro — ¡empieza a usar de inmediato!</li>
                <li>Todos los ejercicios están optimizados para papel A4.</li>
                <li>Usa el botón "Generar aleatorio" para crear ejercicios de práctica rápida.</li>
                <li>Puedes generar múltiples páginas a la vez.</li>
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

console.log('\nAll es/ pages generated!');
