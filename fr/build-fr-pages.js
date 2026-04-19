const fs = require('fs');
const path = require('path');

const OUT = __dirname;

// ── Common templates ──────────────────────────────────────────────

function head(title, desc, page, extraCss = '') {
    const canonical = page === 'index'
        ? 'https://ariclass.com/fr/'
        : `https://ariclass.com/fr/${page}.html`;
    const enHref = page === 'index' ? 'https://ariclass.com/' : `https://ariclass.com/${page}.html`;
    return `<!DOCTYPE html>
<html lang="fr">
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
    <link rel="alternate" hreflang="fr" href="${canonical}">
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
                    <p class="site-title">AriClass : Générateur de fiches</p>
                    <p>Créez des fiches d'exercices d'anglais, de maths et plus encore en quelques secondes.</p>
                </div>
                <button class="hamburger" id="hamburgerBtn" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
            </div>
        </div>
        <nav class="top-menu">
            <div class="container">
                <ul class="nav-links">
                    <li><a href="index.html">Accueil</a></li>
                    <li class="dropdown">
                        <a href="index.html#section-english">Anglais</a>
                        <ul class="dropdown-menu">
                            <li><a href="word-search.html">Mots mêlés</a></li>
                            <li><a href="unscramble.html">Remettre en ordre</a></li>
                            <li><a href="crossword.html">Mots croisés</a></li>
                            <li><a href="matching-lists.html">Associations</a></li>
                            <li><a href="bingo.html">Bingo</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-math">Mathématiques</a>
                        <ul class="dropdown-menu">
                            <li><a href="addition-subtraction.html">Addition et soustraction</a></li>
                            <li><a href="multiplication-table.html">Multiplication et division</a></li>
                            <li><a href="clock.html">Lire l'heure</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-puzzles">Puzzles</a>
                        <ul class="dropdown-menu">
                            <li><a href="sudoku.html">Sudoku</a></li>
                            <li><a href="maze.html">Labyrinthe</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="index.html#section-sheets">Fiches</a>
                        <ul class="dropdown-menu">
                            <li><a href="checklist.html">Liste de contrôle</a></li>
                            <li><a href="vocab-test.html">Fiche de notes</a></li>
                            <li><a href="writing-paper.html">Papier d'écriture</a></li>
                            <li><a href="mind-map.html">Carte mentale</a></li>
                        </ul>
                    </li>
                    <li><a href="how-to-use.html">Comment utiliser</a></li>
                </ul>
            </div>
        </nav>
        <nav class="mobile-nav" id="mobileNav">
            <a href="index.html">Accueil</a>
            <a href="word-search.html">Mots mêlés</a>
            <a href="unscramble.html">Remettre en ordre</a>
            <a href="crossword.html">Mots croisés</a>
            <a href="matching-lists.html">Associations</a>
            <a href="bingo.html">Bingo</a>
            <a href="addition-subtraction.html">Addition et soustraction</a>
            <a href="multiplication-table.html">Multiplication et division</a>
            <a href="clock.html">Lire l'heure</a>
            <a href="sudoku.html">Sudoku</a>
            <a href="maze.html">Labyrinthe</a>
            <a href="checklist.html">Liste de contrôle</a>
            <a href="vocab-test.html">Fiche de notes</a>
            <a href="writing-paper.html">Papier d'écriture</a>
            <a href="mind-map.html">Carte mentale</a>
            <a href="how-to-use.html">Comment utiliser</a>
        </nav>
    </header>`;
}

function footer() {
    return `    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <img src="../images/main-logo.png" alt="AriClass Logo" class="footer-logo-img">
                <p>AriClass propose des fiches d'exercices gratuites d'anglais, de maths et bien plus.</p>
            </div>
            <nav class="footer-nav">
                <h3>Liens rapides</h3>
                <ul class="footer-nav-list">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="word-search.html">Mots mêlés</a></li>
                    <li><a href="unscramble.html">Remettre en ordre</a></li>
                    <li><a href="crossword.html">Mots croisés</a></li>
                    <li><a href="matching-lists.html">Associations</a></li>
                    <li><a href="bingo.html">Bingo</a></li>
                    <li><a href="sudoku.html">Sudoku</a></li>
                    <li><a href="maze.html">Labyrinthe</a></li>
                    <li><a href="addition-subtraction.html">Addition et soustraction</a></li>
                    <li><a href="multiplication-table.html">Multiplication et division</a></li>
                    <li><a href="clock.html">Lire l'heure</a></li>
                </ul>
            </nav>
            <nav class="footer-nav">
                <h3>Informations</h3>
                <ul class="footer-nav-list">
                    <li><a href="../privacy-policy.html">Politique de confidentialité</a></li>
                    <li><a href="../terms-of-use.html">Conditions d'utilisation</a></li>
                    <li><a href="mailto:yourtap1000@gmail.com">Contact</a></li>
                </ul>
            </nav>
            <div class="footer-contact">
                <h3>Contact</h3>
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
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimer</button>
                    </div>
`
        : `                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                    </div>
`;
    return `            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
${btn}                    <div id="puzzle-preview"></div>
                </div>
            </div>`;
}

function descriptionSection(page) {
    const s = {
        'word-search': `        <div class="description-section">
            <h2>Comment créer votre grille de mots mêlés</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Tapez ou collez vos mots (max 10/15/20 selon le niveau)</li>
                        <li>Choisissez les lettres majuscules ou minuscules</li>
                        <li>Sélectionnez des options comme les mots en diagonale ou à l'envers</li>
                        <li>Cliquez sur "Créer le puzzle" pour générer la grille</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la reconnaissance du vocabulaire et l'orthographe</li>
                        <li>Développe la reconnaissance des formes et la lecture visuelle</li>
                        <li>Parfait pour les apprenants ESL/FLE et les débutants</li>
                        <li>Crée des activités dynamiques pour la classe ou les devoirs</li>
                        <li>Niveaux de difficulté personnalisables</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Utilisez des listes de mots thématiques pour renforcer le vocabulaire</li>
                        <li>Commencez par des mots courts pour les débutants</li>
                        <li>Activez les mots en diagonale et à l'envers pour les avancés</li>
                        <li>Imprimez plusieurs copies pour les activités en classe</li>
                        <li>Utilisez comme activité d'échauffement ou de révision</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'unscramble': `        <div class="description-section">
            <h2>Comment créer votre fiche de remise en ordre</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Tapez ou collez vos phrases dans la zone de texte</li>
                        <li>Assurez-vous que chaque phrase se termine par un point (.)</li>
                        <li>Cliquez sur "Créer l'exercice" pour générer l'activité</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la compréhension de la structure des phrases</li>
                        <li>Renforce l'ordre correct des mots</li>
                        <li>Parfait pour les apprenants ESL/FLE</li>
                        <li>Développe la pensée logique</li>
                        <li>Renforce la formation correcte des phrases</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par des phrases simples et courtes pour les débutants</li>
                        <li>Utilisez le vocabulaire de la leçon en cours</li>
                        <li>Incluez une variété de types de phrases</li>
                        <li>Imprimez avec le corrigé pour faciliter la correction</li>
                        <li>Utilisez comme activité d'échauffement ou de révision</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'crossword': `        <div class="description-section">
            <h2>Comment créer votre mots croisés</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Ajoutez des mots et leurs définitions correspondantes</li>
                        <li>Choisissez la taille du puzzle selon vos besoins</li>
                        <li>Sélectionnez des options d'affichage supplémentaires</li>
                        <li>Cliquez sur "Créer les mots croisés" pour le générer</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore le vocabulaire et l'orthographe</li>
                        <li>Développe la résolution de problèmes</li>
                        <li>Parfait pour les apprenants ESL/FLE</li>
                        <li>Crée des activités dynamiques pour la classe</li>
                        <li>Renforce la compréhension de lecture</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Rédigez des indices clairs et adaptés à l'âge</li>
                        <li>Utilisez du vocabulaire thématique pour des leçons spécifiques</li>
                        <li>Commencez par des puzzles plus petits pour les débutants</li>
                        <li>Incluez un mélange de mots faciles et difficiles</li>
                        <li>Utilisez comme activité de révision ou de devoirs</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'matching-lists': `        <div class="description-section">
            <h2>Comment créer votre fiche d'associations</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Ajoutez des paires de mots ou phrases liées</li>
                        <li>Cliquez sur "Créer l'exercice" pour générer la fiche</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la compréhension du vocabulaire</li>
                        <li>Renforce l'association des mots</li>
                        <li>Parfait pour les apprenants ESL/FLE</li>
                        <li>Crée des activités d'association dynamiques</li>
                        <li>Renforce les connexions d'apprentissage</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Utilisez des paires claires et liées</li>
                        <li>Incluez un mélange d'associations faciles et difficiles</li>
                        <li>Regroupez les concepts liés</li>
                        <li>Utilisez comme activité de révision</li>
                        <li>Combinez avec d'autres activités d'apprentissage</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'bingo': `        <div class="description-section">
            <h2>Comment créer votre jeu de bingo</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Ajoutez des mots de vocabulaire ou utilisez la génération aléatoire</li>
                        <li>Choisissez la taille du tableau (3x3, 4x4 ou 5x5)</li>
                        <li>Sélectionnez le nombre de joueurs</li>
                        <li>Cliquez sur "Créer le bingo" pour générer le jeu</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la reconnaissance du vocabulaire</li>
                        <li>Favorise la participation active</li>
                        <li>Idéal pour les activités en groupe</li>
                        <li>Améliore les compétences en lecture</li>
                        <li>Rend l'apprentissage amusant et dynamique</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Utilisez des ensembles de vocabulaire thématiques</li>
                        <li>Commencez par des tableaux plus petits pour les plus jeunes</li>
                        <li>Préparez suffisamment de mots pour les grands tableaux</li>
                        <li>Utilisez comme activité de révision</li>
                        <li>Créez plusieurs ensembles pour différents groupes</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'sudoku': `        <div class="description-section">
            <h2>Comment créer votre puzzle de sudoku</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Sélectionnez le niveau de difficulté (Facile, Moyen, Difficile ou Expert)</li>
                        <li>Cliquez sur "Créer le puzzle" pour générer le sudoku</li>
                        <li>Utilisez "Voir les réponses" pour afficher la solution</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la pensée logique et la résolution de problèmes</li>
                        <li>Renforce la reconnaissance des chiffres et des formes</li>
                        <li>Idéal pour les mathématiques et le développement cognitif</li>
                        <li>Développe la concentration et l'attention aux détails</li>
                        <li>Crée des activités dynamiques pour la classe ou les devoirs</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par le niveau Facile pour les débutants</li>
                        <li>Utilisez le niveau Moyen pour les élèves familiers avec le sudoku</li>
                        <li>Défiez les avancés avec les niveaux Difficile ou Expert</li>
                        <li>Imprimez avec le corrigé pour faciliter la correction</li>
                        <li>Utilisez comme échauffement ou exercice d'enrichissement mathématique</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'maze': `        <div class="description-section">
            <h2>Comment créer votre labyrinthe</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Sélectionnez le niveau de difficulté (Facile 10x10, Moyen 15x15 ou Difficile 20x20)</li>
                        <li>Cliquez sur "Créer le labyrinthe" pour en générer un aléatoire</li>
                        <li>Utilisez "Voir les réponses" pour afficher le chemin solution en rouge</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore la résolution de problèmes et la pensée critique</li>
                        <li>Développe le raisonnement spatial et la perception visuelle</li>
                        <li>Favorise la patience et la persévérance</li>
                        <li>Idéal pour l'entraînement cérébral et le développement cognitif</li>
                        <li>Crée des activités dynamiques pour la classe ou les devoirs</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par Facile (10x10) pour les plus jeunes</li>
                        <li>Utilisez Moyen (15x15) pour la plupart des élèves</li>
                        <li>Défiez les avancés avec Difficile (20x20)</li>
                        <li>Imprimez avec le corrigé (chemin rouge) pour faciliter la vérification</li>
                        <li>Utilisez comme échauffement ou exercice de résolution de problèmes</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'addition-subtraction': `        <div class="description-section">
            <h2>Comment créer votre fiche d'addition et soustraction</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Choisissez le type d'opération (Addition, Soustraction ou Mixte)</li>
                        <li>Sélectionnez le niveau de difficulté</li>
                        <li>Définissez le nombre de problèmes</li>
                        <li>Cliquez sur "Créer l'exercice" pour générer les problèmes</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Améliore le calcul mental et les compétences arithmétiques</li>
                        <li>Renforce le sens des nombres et la valeur positionnelle</li>
                        <li>Idéal pour les élèves de primaire et de collège</li>
                        <li>Crée des exercices dynamiques pour la classe ou les devoirs</li>
                        <li>Niveaux de difficulté personnalisables</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par des niveaux plus faciles pour les débutants</li>
                        <li>Utilisez des opérations mixtes pour challenger les élèves</li>
                        <li>Imprimez plusieurs copies pour les activités en classe</li>
                        <li>Utilisez comme exercice d'échauffement quotidien</li>
                        <li>Ajustez le nombre de problèmes selon le temps disponible</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'multiplication-table': `        <div class="description-section">
            <h2>Comment créer votre fiche de multiplication et division</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Saisissez un titre pour votre fiche</li>
                        <li>Choisissez le type d'opération (Multiplication, Division ou Mixte)</li>
                        <li>Sélectionnez le niveau de difficulté</li>
                        <li>Définissez le nombre de pages</li>
                        <li>Cliquez sur "Créer l'exercice"</li>
                        <li>Imprimez avec le bouton d'impression</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Niveaux de difficulté</h3>
                    <ul>
                        <li><strong>Niveau 1 :</strong> 1 chiffre × 1 chiffre (jusqu'à 9×9)</li>
                        <li><strong>Niveau 2 :</strong> 2 chiffres × 1 chiffre (ex. 47×6)</li>
                        <li><strong>Niveau 3 :</strong> 2 chiffres × 2 chiffres (ex. 34×28)</li>
                        <li>Les divisions ont toujours des réponses entières</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par le Niveau 1 pour les débutants</li>
                        <li>Utilisez Mixte pour pratiquer les deux opérations</li>
                        <li>Imprimez plusieurs pages pour des exercices chronométrés</li>
                        <li>Utilisez "Voir les réponses" pour créer un corrigé</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'clock': `        <div class="description-section">
            <h2>Comment créer votre fiche de lecture de l'heure</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Étapes simples pour créer</h3>
                    <ol>
                        <li>Choisissez un mode : lire l'heure ou dessiner les aiguilles</li>
                        <li>Sélectionnez l'intervalle de temps (chaque heure, 30, 15 ou 5 min)</li>
                        <li>Définissez le nombre d'horloges par page</li>
                        <li>Cliquez sur Créer pour obtenir un nouvel ensemble d'heures</li>
                        <li>Imprimez la fiche</li>
                    </ol>
                </div>
                <div class="instruction-block">
                    <h3>Bénéfices pédagogiques</h3>
                    <ul>
                        <li>Enseigne la lecture de l'horloge analogique</li>
                        <li>Développe le sens des nombres et les notions de temps</li>
                        <li>Deux modes pour pratiquer la lecture et l'écriture</li>
                        <li>Difficulté ajustable avec les intervalles de temps</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils pour les enseignants</h3>
                    <ul>
                        <li>Commencez par "chaque heure" pour les débutants</li>
                        <li>Utilisez "dessiner les aiguilles" pour la pratique avancée</li>
                        <li>Mélangez les mises en page 6 et 9 horloges pour la variété</li>
                        <li>Idéal pour les leçons de vocabulaire horaire en ESL/FLE</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'checklist': `        <div class="description-section">
            <h2>Comment utiliser les modèles de liste de contrôle</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 par page</h3>
                    <ul>
                        <li>Page A4 complète avec cases à cocher</li>
                        <li>Inclut des champs Date et Nom en haut</li>
                        <li>Idéal pour les longues listes de tâches</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 par page</h3>
                    <ul>
                        <li>Deux listes sur une page A4</li>
                        <li>Découpez sur la ligne pointillée pour séparer</li>
                        <li>Idéal pour les listes courtes — économise le papier !</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 par page</h3>
                    <ul>
                        <li>Quatre mini-listes dans une grille 2×2</li>
                        <li>Découpez chaque cellule séparément</li>
                        <li>Idéal pour les tâches quotidiennes rapides</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'vocab-test': `        <div class="description-section">
            <h2>Comment utiliser les feuilles de notes</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 par page</h3>
                    <ul>
                        <li>Page A4 complète avec lignes d'écriture</li>
                        <li>Inclut des champs Date et Nom en haut</li>
                        <li>Idéal pour les longues listes de vocabulaire ou la prise de notes</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 par page</h3>
                    <ul>
                        <li>Deux feuilles sur une page A4</li>
                        <li>Découpez sur la ligne pointillée pour séparer</li>
                        <li>Idéal pour les listes de vocabulaire courtes (économise le papier !)</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 par page</h3>
                    <ul>
                        <li>Quatre mini-feuilles dans une grille 2×2 sur une page A4</li>
                        <li>Découpez chaque cellule séparément</li>
                        <li>Idéal pour les quiz rapides ou les petites listes de mots</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'writing-paper': `        <div class="description-section">
            <h2>Comment utiliser le papier d'écriture</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>1 par page</h3>
                    <ul>
                        <li>Page A4 complète avec lignes d'écriture anglaise</li>
                        <li>Système à 3 lignes : hauteur des majuscules, x-height (pointillé) et ligne de base</li>
                        <li>Inclut des champs Date et Nom en haut</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>2 par page</h3>
                    <ul>
                        <li>Deux feuilles sur une page A4</li>
                        <li>Découpez sur la ligne pointillée pour séparer</li>
                        <li>Idéal pour les exercices d'écriture plus courts</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>4 par page</h3>
                    <ul>
                        <li>Quatre mini-feuilles dans une grille 2×2</li>
                        <li>Découpez sur les lignes croisées pour séparer</li>
                        <li>Idéal pour la pratique rapide de l'écriture</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'mind-map': `        <div class="description-section">
            <h2>Comment utiliser la carte mentale</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>4 branches</h3>
                    <ul>
                        <li>4 domaines thématiques principaux</li>
                        <li>Idéal pour une catégorisation simple</li>
                        <li>Plus d'espace par branche pour écrire</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>6 branches</h3>
                    <ul>
                        <li>6 domaines thématiques principaux</li>
                        <li>Parfait pour la plupart des remue-méninges</li>
                        <li>Disposition équilibrée autour du centre</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>8 branches</h3>
                    <ul>
                        <li>8 domaines thématiques principaux</li>
                        <li>Idéal pour les cartes mentales détaillées</li>
                        <li>Parfait pour les sujets complexes</li>
                    </ul>
                </div>
            </div>
        </div>`,
        'secret-code': `        <div class="description-section">
            <h2>Comment utiliser le code secret</h2>
            <div class="description-content">
                <div class="instruction-block">
                    <h3>Comment ça fonctionne</h3>
                    <ul>
                        <li>Chaque lettre de A à Z se voit attribuer un symbole unique</li>
                        <li>Les mots sont affichés sous forme de séquences de symboles</li>
                        <li>Les élèves utilisent la clé pour décoder chaque mot</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Conseils</h3>
                    <ul>
                        <li>Jusqu'à 15 mots par fiche d'exercices</li>
                        <li>Cliquez sur Créer pour obtenir un nouveau code aléatoire à chaque fois</li>
                        <li>Utilisez l'option Corrigé pour l'autocorrection</li>
                    </ul>
                </div>
                <div class="instruction-block">
                    <h3>Idéal pour</h3>
                    <ul>
                        <li>La révision du vocabulaire de manière amusante</li>
                        <li>Activité pour ceux qui terminent en avance</li>
                        <li>La pratique de l'orthographe</li>
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
pages['index'] = `${head('AriClass - Générateur gratuit de fiches d\'exercices', 'Créez des fiches d\'exercices gratuites de maths, d\'anglais et plus encore. Mots mêlés, mots croisés, bingo, additions, multiplications, horloge et plus — prêts à imprimer.', 'index', '').replace('<link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('index')}
    <main class="main-content">
        <div class="section-title">
            <h1>Générateur gratuit de fiches d'exercices</h1>
            <p>Choisissez le type d'exercice et il sera prêt à imprimer en quelques secondes</p>
        </div>
        <div class="worksheet-section" id="section-english">
            <div class="worksheet-section-header english-section-header">
                <i class="fas fa-book-open"></i><span>Exercices d'anglais</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/word-search-preview.png" alt="Mots mêlés" loading="eager">
                    <h3>Mots mêlés</h3>
                    <p>Créez des grilles de mots mêlés avec votre propre vocabulaire</p>
                    <a href="word-search.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/unscramble-preview.png" alt="Remettre en ordre" loading="lazy">
                    <h3>Remettre en ordre</h3>
                    <p>Exercices pour pratiquer l'ordre des mots dans les phrases</p>
                    <a href="unscramble.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/crossword-preview.png" alt="Mots croisés" loading="lazy">
                    <h3>Mots croisés</h3>
                    <p>Créez des mots croisés pour pratiquer le vocabulaire</p>
                    <a href="crossword.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/matching-lists-preview.png" alt="Associations" loading="lazy">
                    <h3>Associations</h3>
                    <p>Reliez des mots ou des concepts associés</p>
                    <a href="matching-lists.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/bingo-preview.png" alt="Bingo" loading="lazy">
                    <h3>Bingo</h3>
                    <p>Cartes de bingo personnalisées pour pratiquer le vocabulaire</p>
                    <a href="bingo.html" class="create-btn">Créer</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-math">
            <div class="worksheet-section-header math-section-header">
                <i class="fas fa-calculator"></i><span>Exercices de mathématiques</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/addition-subtraction-preview.png" alt="Addition et soustraction" loading="lazy">
                    <h3>Addition et soustraction</h3>
                    <p>Fiches de pratique d'addition et soustraction</p>
                    <a href="addition-subtraction.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/multiplication-table-preview.png" alt="Multiplication et division" loading="lazy">
                    <h3>Multiplication et division</h3>
                    <p>Fiches de pratique de multiplication et division</p>
                    <a href="multiplication-table.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/clock-preview.png" alt="Lire l'heure" loading="lazy">
                    <h3>Lire l'heure</h3>
                    <p>Fiches pour pratiquer la lecture de l'heure sur une horloge analogique</p>
                    <a href="clock.html" class="create-btn">Créer</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-puzzles">
            <div class="worksheet-section-header puzzle-section-header">
                <i class="fas fa-puzzle-piece"></i><span>Puzzles et jeux</span>
            </div>
            <div class="worksheet-grid">
                <div class="worksheet-card">
                    <img src="../images/sudoku-preview.png" alt="Sudoku" loading="lazy">
                    <h3>Sudoku</h3>
                    <p>Sudoku de différents niveaux pour entraîner la logique</p>
                    <a href="sudoku.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/maze-preview.png" alt="Labyrinthe" loading="lazy">
                    <h3>Labyrinthe</h3>
                    <p>Labyrinthes de différentes tailles pour résoudre des problèmes</p>
                    <a href="maze.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Secret Code.png" alt="Code secret" loading="lazy">
                    <h3>Code secret</h3>
                    <p>Déchiffrez des mots à l'aide d'un tableau de symboles</p>
                    <a href="secret-code.html" class="create-btn">Créer</a>
                </div>
            </div>
        </div>
        <div class="worksheet-section" id="section-sheets">
            <div class="worksheet-section-header template-section-header">
                <i class="fas fa-clipboard-list"></i><span>Fiches imprimables</span>
            </div>
            <div class="worksheet-grid worksheet-grid-coming-soon">
                <div class="worksheet-card">
                    <img src="../images/Checklist.png" alt="Liste de contrôle" loading="lazy">
                    <h3>Liste de contrôle</h3>
                    <p>Listes à cocher — mise en page 1, 2 ou 4 par page</p>
                    <a href="checklist.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Note Sheet.png" alt="Fiche de notes" loading="lazy">
                    <h3>Fiche de notes</h3>
                    <p>Fiche imprimable avec date et nom — mise en page 1, 2 ou 4 par page</p>
                    <a href="vocab-test.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Writing Paper.png" alt="Papier d'écriture" loading="lazy">
                    <h3>Papier d'écriture</h3>
                    <p>Papier ligné pour pratiquer l'écriture en anglais</p>
                    <a href="writing-paper.html" class="create-btn">Créer</a>
                </div>
                <div class="worksheet-card">
                    <img src="../images/Mind Map.png" alt="Carte mentale" loading="lazy">
                    <h3>Carte mentale</h3>
                    <p>Carte mentale pour le brainstorming et l'organisation des idées</p>
                    <a href="mind-map.html" class="create-btn">Créer</a>
                </div>
            </div>
        </div>
    </main>
    <section class="features-section">
        <div class="container">
            <div class="section-header">
                <h2>Pourquoi choisir AriClass ?</h2>
                <p>Des fonctionnalités pour faciliter la création d'exercices</p><br>
            </div>
            <div class="features-grid">
                <div class="feature-card"><i class="fas fa-bolt"></i><h3>Rapide</h3><p>Créez des exercices en quelques secondes avec une interface intuitive</p></div>
                <div class="feature-card"><i class="fas fa-print"></i><h3>Prêt à imprimer</h3><p>Tous les exercices sont optimisés pour le format A4</p></div>
                <div class="feature-card"><i class="fas fa-cog"></i><h3>Personnalisable</h3><p>Ajustez les options selon les objectifs de votre cours</p></div>
                <div class="feature-card"><i class="fas fa-download"></i><h3>Sans inscription</h3><p>Commencez à utiliser sans créer de compte</p></div>
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
pages['word-search'] = `${head('Mots mêlés gratuits - AriClass', 'Créez des grilles de mots mêlés imprimables avec votre propre vocabulaire. Idéal pour les professeurs d\'anglais et les étudiants.', 'word-search', '')}
<body>
${nav('word-search')}
    <div class="generator-container">
        <h1>Mots mêlés</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les mots</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mélanger l'aperçu"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Entrez les mots (un par ligne)&#10;Maximum 20 mots"></textarea>
                    <button id="add-word-btn" class="clear-btn"><i class="fas fa-trash"></i> Effacer</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="level-options">
                            <div class="level-option"><input type="radio" id="level1" name="level" value="1"><label for="level1">Niveau 1 (Facile)</label></div>
                            <div class="level-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Niveau 2 (Moyen)</label></div>
                            <div class="level-option"><input type="radio" id="level3" name="level" value="3" checked><label for="level3">Niveau 3 (Difficile)</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <div style="display: flex; gap: 2rem;">
                            <label><input type="radio" name="case" id="uppercase-words"> MAJUSCULES</label>
                            <label><input type="radio" name="case" id="lowercase-words" checked> minuscules</label>
                        </div>
                    </div>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="show-word-list" checked> Afficher la liste de mots</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="diagonal-words" checked> Inclure les mots en diagonale</label>
                    </div>
                    <div class="option-group">
                        <label><input type="checkbox" id="reverse-words" checked> Inclure les mots à l'envers</label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la grille</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('word-search')}
    </div>
    <script src="../js/wordSearch.js"></script>
${footer()}`;

// UNSCRAMBLE
pages['unscramble'] = `${head('Remettre en ordre - AriClass', 'Créez des fiches pour remettre les mots dans l\'ordre. Parfait pour pratiquer la grammaire et le vocabulaire.', 'unscramble', '\n    <link rel="stylesheet" href="../css/unscramble.css">')}
<body>
${nav('unscramble')}
    <div class="generator-container">
        <h1>Remettre en ordre</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les phrases</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mélanger l'aperçu"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="sentence-list" class="vocab-textarea" placeholder="Entrez les phrases. Chaque phrase doit se terminer par un point (.), un point d'interrogation (?) ou un point d'exclamation (!)."></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Tout effacer</button>
                    <div class="option-group">
                        <label class="check-option-label"><input type="checkbox" id="capitalize-first" checked> Majuscule au début</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Taille de police</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Petite</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Moyenne</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacement entre les questions</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-compact" name="question-spacing" value="compact"><label for="spacing-compact">Compact</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="question-spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="question-spacing" value="wide"><label for="spacing-wide">Large</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('unscramble')}
    </div>
    <script src="../js/unscramble.js"></script>
${footer()}`;

// CROSSWORD
pages['crossword'] = `${head('Mots croisés gratuits - AriClass', 'Créez des mots croisés imprimables avec votre propre vocabulaire. Parfait pour les professeurs de langues.', 'crossword', '\n    <link rel="stylesheet" href="../css/crossword.css">')}
<body>
${nav('crossword')}
    <div class="generator-container">
        <h1>Mots croisés</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les mots et indices</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Réinitialiser"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-clue-container"></div>
                    <button id="add-word-btn" class="add-word-btn"><i class="fas fa-plus"></i> Ajouter un mot</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Tout effacer</button>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer les mots croisés</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn" disabled><i class="fas fa-print"></i> Imprimer</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Voir les réponses</button>
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
pages['matching-lists'] = `${head('Associations de mots - AriClass', 'Créez des fiches d\'associations de mots imprimables. Idéal pour les professeurs de langues et les étudiants.', 'matching-lists', '\n    <link rel="stylesheet" href="../css/matching-lists.css">')}
<body>
${nav('matching-lists')}
    <div class="generator-container">
        <h1>Associations de mots</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les paires de mots</h2>
                        <button id="reset-pairs-btn" class="reset-btn" title="Réinitialiser"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <div class="word-pairs-container">
                        <div class="word-pair-container"></div>
                    </div>
                    <button id="add-pair-btn" class="add-word-btn"><i class="fas fa-plus"></i> Ajouter une paire</button>
                    <button id="clear-all-btn" class="clear-btn"><i class="fas fa-trash"></i> Tout effacer</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="uppercase" name="letter-case" value="uppercase"><label for="uppercase">MAJUSCULES</label></div>
                            <div class="case-option"><input type="radio" id="lowercase" name="letter-case" value="lowercase" checked><label for="lowercase">minuscules</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 class="centered-title">Taille de police</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Petite</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Moyenne</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-random-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button class="answer-btn"><i class="fas fa-eye"></i> Voir les réponses</button>
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
pages['bingo'] = `${head('Bingo gratuit - AriClass', 'Créez des cartes de bingo imprimables avec vos propres mots. Idéal pour la classe et l\'apprentissage des langues.', 'bingo', '\n    <link rel="stylesheet" href="../css/bingo.css">')}
<body>
${nav('bingo')}
    <div class="generator-container">
        <h1>Bingo</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Bingo">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les mots</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Mélanger l'aperçu"><i class="fas fa-random"></i></button>
                    </div>
                    <textarea id="wordInput" class="vocab-textarea" placeholder="Entrez les mots (un par ligne)"></textarea>
                    <button id="clearButton" class="clear-btn"><i class="fas fa-trash-alt"></i> Tout effacer</button>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Taille du plateau</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="board-3" name="board-size" value="3"><label for="board-3">3 x 3</label></div>
                            <div class="case-option"><input type="radio" id="board-4" name="board-size" value="4" checked><label for="board-4">4 x 4</label></div>
                            <div class="case-option"><input type="radio" id="board-5" name="board-size" value="5"><label for="board-5">5 x 5</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Taille de police</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="font-small" name="font-size" value="small"><label for="font-small">Petite</label></div>
                            <div class="case-option"><input type="radio" id="font-medium" name="font-size" value="medium" checked><label for="font-medium">Moyenne</label></div>
                            <div class="case-option"><input type="radio" id="font-large" name="font-size" value="large"><label for="font-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group option-checkboxes">
                        <label class="check-option-label"><input type="checkbox" id="top-align"> Aligner les mots en haut</label>
                        <label class="check-option-label"><input type="checkbox" id="free-space"> Case libre (FREE)</label>
                    </div>
                    <div class="option-group">
                        <h2>Nombre de joueurs <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">Chaque joueur reçoit une carte de bingo unique. Une page est générée par joueur à l'impression.</span></span></h2>
                        <div class="player-counter">
                            <button id="decreasePlayer" type="button"><i class="fas fa-minus"></i></button>
                            <span id="playerCount">2</span>
                            <button id="increasePlayer" type="button"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer le bingo</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('bingo')}
    </div>
    <script src="../js/bingo.js"></script>
${footer()}`;

// SUDOKU
pages['sudoku'] = `${head('Sudoku gratuit - AriClass', 'Créez des grilles de sudoku imprimables de différents niveaux de difficulté. Idéal pour la classe et la maison.', 'sudoku', '\n    <link rel="stylesheet" href="../css/sudoku.css">')}
<body>
${nav('sudoku')}
    <div class="generator-container">
        <h1>Sudoku</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Sudoku Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Niveau de difficulté</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="difficulty-easy" name="difficulty" value="easy" checked><label for="difficulty-easy">Facile</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-medium" name="difficulty" value="medium"><label for="difficulty-medium">Moyen</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-hard" name="difficulty" value="hard"><label for="difficulty-hard">Difficile</label></div>
                            <div class="case-option"><input type="radio" id="difficulty-expert" name="difficulty" value="expert"><label for="difficulty-expert">Expert</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Nombre de pages</h2>
                        <label>Pages : <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer le puzzle</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Voir les réponses</button>
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
pages['maze'] = `${head('Labyrinthe gratuit - AriClass', 'Créez des labyrinthes imprimables de différentes difficultés. Idéal pour la classe et les activités à la maison.', 'maze', '\n    <link rel="stylesheet" href="../css/maze.css">')}
<body>
${nav('maze')}
    <div class="generator-container">
        <h1>Labyrinthe</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Maze Puzzle">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Niveau de difficulté</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="diff-easy" name="difficulty" value="easy"><label for="diff-easy">Facile</label></div>
                            <div class="case-option"><input type="radio" id="diff-medium" name="difficulty" value="medium" checked><label for="diff-medium">Moyen</label></div>
                            <div class="case-option"><input type="radio" id="diff-hard" name="difficulty" value="hard"><label for="diff-hard">Difficile</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Type de labyrinthe</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="type-grid" name="maze-type" value="grid" checked><label for="type-grid">Grille</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer le labyrinthe</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-check-circle"></i> Voir les réponses</button>
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
pages['addition-subtraction'] = `${head('Addition et soustraction - AriClass', 'Créez des fiches d\'exercices d\'addition et de soustraction imprimables de différents niveaux.', 'addition-subtraction', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">')}
<body>
${nav('addition-subtraction')}
    <div class="generator-container">
        <h1>Addition et soustraction</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="addition-only" value="addition" checked> Addition seule</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="subtraction-only" value="subtraction"> Soustraction seule</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Mixte</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Niveau de difficulté</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Niveau 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Niveau 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Niveau 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problèmes par page</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Standard</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Plus</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nombre de pages</h2>
                        <label>Pages : <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Voir les réponses</button>
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
pages['multiplication-table'] = `${head('Multiplication et division - AriClass', 'Créez des fiches d\'exercices de multiplication et division imprimables de différents niveaux.', 'multiplication-table', '\n    <link rel="stylesheet" href="../css/addition-subtraction.css">\n    <link rel="stylesheet" href="../css/multiplication-table.css">')}
<body>
${nav('multiplication-table')}
    <div class="generator-container">
        <h1>Multiplication et division</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><label><input type="radio" name="operation" id="multiplication-only" value="multiplication" checked> Multiplication seule</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="division-only" value="division"> Division seule</label></div>
                            <div class="case-option"><label><input type="radio" name="operation" id="mixed" value="mixed"> Mixte</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Niveau de difficulté</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="level1" name="level" value="1" checked><label for="level1">Niveau 1</label></div>
                            <div class="case-option"><input type="radio" id="level2" name="level" value="2"><label for="level2">Niveau 2</label></div>
                            <div class="case-option"><input type="radio" id="level3" name="level" value="3"><label for="level3">Niveau 3</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="border-bottom:1px solid var(--border-color);padding-bottom:1rem;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Problèmes par page</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="probs-15" name="problems-per-page" value="15" checked><label for="probs-15">Standard</label></div>
                            <div class="case-option"><input type="radio" id="probs-20" name="problems-per-page" value="20"><label for="probs-20">Plus</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nombre de pages</h2>
                        <label>Pages : <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button id="answer-btn" class="answer-btn"><i class="fas fa-eye"></i> Voir les réponses</button>
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
pages['clock'] = `${head('Lire l\'heure - AriClass', 'Créez des fiches d\'exercices pour lire l\'heure sur une horloge analogique. Idéal pour les enfants et les élèves du primaire.', 'clock', '\n    <link rel="stylesheet" href="../css/clock.css">')}
<body>
${nav('clock')}
    <div class="generator-container">
        <h1>Lire l'heure</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Telling Time">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2 style="text-align:center">Mode</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="mode-read" name="clock-mode" value="read" checked><label for="mode-read">Lire l'heure</label></div>
                            <div class="case-option"><input type="radio" id="mode-draw" name="clock-mode" value="draw"><label for="mode-draw">Dessiner les aiguilles</label></div>
                        </div>
                        <div style="text-align:center;margin-top:0.5rem;">
                            <label><input type="checkbox" id="hide-time-label"> <s>12:00</s></label>
                        </div>
                    </div>
                    <div class="option-group" id="color-option-group">
                        <h2 style="text-align:center">Couleur des aiguilles</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="color-bw" name="clock-color" value="bw"><label for="color-bw">N&amp;B</label></div>
                            <div class="case-option"><input type="radio" id="color-color" name="clock-color" value="color" checked><label for="color-color">Couleur</label></div>
                        </div>
                    </div>
                    <div class="option-group" id="interval-option-group">
                        <h2 style="text-align:center">Intervalle de temps</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="interval-hour" name="clock-interval" value="hour"><label for="interval-hour">1 heure</label></div>
                            <div class="case-option"><input type="radio" id="interval-half" name="clock-interval" value="half"><label for="interval-half">30 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-quarter" name="clock-interval" value="quarter" checked><label for="interval-quarter">15 min</label></div>
                            <div class="case-option"><input type="radio" id="interval-five" name="clock-interval" value="five"><label for="interval-five">5 min</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2 style="text-align:center">Nombre d'horloges</h2>
                        <div class="case-options" style="justify-content:center;">
                            <div class="case-option"><input type="radio" id="count-1" name="clock-count" value="1"><label for="count-1">1</label></div>
                            <div class="case-option"><input type="radio" id="count-6" name="clock-count" value="6"><label for="count-6">6</label></div>
                            <div class="case-option"><input type="radio" id="count-9" name="clock-count" value="9"><label for="count-9">9</label></div>
                            <div class="case-option"><input type="radio" id="count-12" name="clock-count" value="12" checked><label for="count-12">12</label></div>
                        </div>
                    </div>
                    <div class="option-group" style="display:flex;flex-direction:column;align-items:center;">
                        <h2 style="text-align:center;font-weight:bold;margin-top:0;margin-bottom:0.6rem;">Nombre de pages</h2>
                        <label>Pages : <input type="number" id="num-pages" min="1" max="10" value="1" style="width:80px;padding:0.4rem;margin-left:0.5rem;border:1px solid var(--border-color);border-radius:4px;"></label>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            ${previewSection()}
        </div>
        ${descriptionSection('clock')}
    </div>
    <script src="../js/clock.js"></script>
${footer()}`;

// CHECKLIST
pages['checklist'] = `${head('Liste de contrôle - AriClass', 'Créez des listes de contrôle imprimables avec des cases à cocher. Mise en page 1, 2 ou 4 par page.', 'checklist', '\n    <link rel="stylesheet" href="../css/checklist.css">')}
<body>
${nav('checklist')}
    <div class="generator-container">
        <h1>Liste de contrôle</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre</h2>
                    <div class="case-options" style="justify-content:center;margin:12px 0 14px;">
                        <div class="case-option"><input type="radio" id="title-text" name="title-type" value="text" checked><label for="title-text">Texte</label></div>
                        <div class="case-option"><input type="radio" id="title-line" name="title-type" value="line"><label for="title-line">Souligné</label></div>
                        <div class="case-option"><input type="radio" id="title-none" name="title-type" value="none"><label for="title-none">Aucun</label></div>
                    </div>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre">
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Mise en page <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 par page : Découpez selon la ligne pointillée pour obtenir 2 fiches. 4 par page : Découpez en croix pour obtenir 4 fiches.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 page</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 pages</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 pages</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Colonnes</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="columns" value="1" checked><label for="col-1">1 colonne</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="columns" value="2"><label for="col-2">2 colonnes</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacement</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Serré</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal"><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide" checked><label for="spacing-wide">Large</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Numérotation</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="num-yes" name="numbering" value="yes" checked><label for="num-yes">Oui</label></div>
                            <div class="case-option"><input type="radio" id="num-no" name="numbering" value="no"><label for="num-no">Non</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimer</button>
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
pages['vocab-test'] = `${head('Fiche de notes - AriClass', 'Créez des fiches de notes imprimables avec des lignes. Mise en page 1, 2 ou 4 par page.', 'vocab-test', '\n    <link rel="stylesheet" href="../css/vocab-test.css">')}
<body>
${nav('vocab-test')}
    <div class="generator-container">
        <h1>Fiche de notes</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Mise en page <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 par page : Découpez selon la ligne pointillée pour obtenir 2 fiches. 4 par page : Découpez en croix pour obtenir 4 fiches.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 page</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 pages</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 pages</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Style de ligne</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="style-solid" name="linestyle" value="solid" checked><label for="style-solid">Solide</label></div>
                            <div class="case-option"><input type="radio" id="style-dashed" name="linestyle" value="dashed"><label for="style-dashed">Pointillé</label></div>
                            <div class="case-option"><input type="radio" id="style-bold" name="linestyle" value="bold"><label for="style-bold">Épais</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacement entre les lignes</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Serré</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Large</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimer</button>
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
pages['writing-paper'] = `${head('Papier d\'écriture - AriClass', 'Créez du papier d\'écriture imprimable avec des lignes. Idéal pour pratiquer l\'écriture en anglais.', 'writing-paper', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/writing-paper.css">')}
<body>
${nav('writing-paper')}
    <div class="generator-container">
        <h1>Papier d'écriture</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="options">
                    <div class="option-group">
                        <h2>Mise en page <span class="tooltip-wrap"><span class="tooltip-icon">?</span><span class="tooltip-box">2 par page : Découpez selon la ligne pointillée pour obtenir 2 fiches. 4 par page : Découpez en croix pour obtenir 4 fiches.</span></span></h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="layout-1" name="layout" value="1" checked><label for="layout-1">1 page</label></div>
                            <div class="case-option"><input type="radio" id="layout-2" name="layout" value="2"><label for="layout-2">2 pages</label></div>
                            <div class="case-option"><input type="radio" id="layout-4" name="layout" value="4"><label for="layout-4">4 pages</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Espacement entre les lignes</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="spacing-narrow" name="spacing" value="narrow"><label for="spacing-narrow">Serré</label></div>
                            <div class="case-option"><input type="radio" id="spacing-normal" name="spacing" value="normal" checked><label for="spacing-normal">Normal</label></div>
                            <div class="case-option"><input type="radio" id="spacing-wide" name="spacing" value="wide"><label for="spacing-wide">Large</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Couleur des lignes</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="color-bw" name="linecolor" value="bw"><label for="color-bw">N&amp;B</label></div>
                            <div class="case-option"><input type="radio" id="color-red" name="linecolor" value="red" checked><label for="color-red">Rouge</label></div>
                            <div class="case-option"><input type="radio" id="color-blue" name="linecolor" value="blue"><label for="color-blue">Bleu</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimer</button>
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
pages['mind-map'] = `${head('Carte mentale - AriClass', 'Créez des cartes mentales imprimables pour le brainstorming et l\'organisation des idées.', 'mind-map', '\n    <link rel="stylesheet" href="../css/vocab-test.css">\n    <link rel="stylesheet" href="../css/mind-map.css">')}
<body>
${nav('mind-map')}
    <div class="generator-container">
        <h1>Carte mentale</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Mind Map">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Forme centrale</h2>
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
                        <h2>Taille centrale</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="sz-small" name="centersize" value="small"><label for="sz-small">Petite</label></div>
                            <div class="case-option"><input type="radio" id="sz-medium" name="centersize" value="medium" checked><label for="sz-medium">Moyenne</label></div>
                            <div class="case-option"><input type="radio" id="sz-large" name="centersize" value="large"><label for="sz-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Couleur des lignes</h2>
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
                    <button class="print-btn" id="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button class="print-btn" id="print-btn-top"><i class="fas fa-print"></i> Imprimer</button>
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
pages['secret-code'] = `${head('Code secret - AriClass', 'Créez des fiches de code secret imprimables. Les élèves déchiffrent des mots à l\'aide d\'un tableau de symboles.', 'secret-code', '\n    <link rel="stylesheet" href="../css/secret-code.css">')}
<body>
${nav('secret-code')}
    <div class="generator-container">
        <h1>Code secret</h1>
        <div class="generator-content">
            <div class="input-section">
                <div class="title-input">
                    <h2>Titre de la fiche</h2>
                    <input type="text" id="worksheet-title" placeholder="Entrez le titre" value="Secret Code">
                    <div class="option-group">
                        <label><input type="checkbox" id="show-title" checked> Afficher le titre</label>
                    </div>
                </div>
                <div class="word-input">
                    <div class="section-header">
                        <h2>Saisir les mots</h2>
                        <button id="reset-words-btn" class="reset-btn" title="Réinitialiser"><i class="fas fa-undo-alt"></i></button>
                    </div>
                    <textarea id="vocab-list" class="vocab-textarea" placeholder="Entrez un mot par ligne&#10;Maximum 15 mots"></textarea>
                    <div class="word-count-display" id="word-count-display"></div>
                </div>
                <div class="options">
                    <div class="option-group">
                        <h2>Taille de police</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="fs-small" name="fontsize" value="small"><label for="fs-small">Petite</label></div>
                            <div class="case-option"><input type="radio" id="fs-medium" name="fontsize" value="medium" checked><label for="fs-medium">Moyenne</label></div>
                            <div class="case-option"><input type="radio" id="fs-large" name="fontsize" value="large"><label for="fs-large">Grande</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Mise en page</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="col-1" name="layout" value="1" checked><label for="col-1">1 colonne</label></div>
                            <div class="case-option"><input type="radio" id="col-2" name="layout" value="2"><label for="col-2">2 colonnes</label></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <h2>Clé de chiffrement</h2>
                        <div class="case-options">
                            <div class="case-option"><input type="radio" id="cipher-new" name="cipherkey" value="new" checked><label for="cipher-new">Nouvelle clé</label></div>
                            <div class="case-option"><input type="radio" id="cipher-lock" name="cipherkey" value="lock"><label for="cipher-lock">Garder la clé</label></div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="generate-btn" id="random-generate-btn"><i class="fas fa-random"></i> Générer aléatoirement</button>
                    <button class="generate-btn" id="generate-btn"><i class="fas fa-magic"></i> Créer la fiche</button>
                </div>
            </div>
            <div class="preview-section">
                <div class="preview-label">Aperçu</div>
                <div class="preview-wrapper">
                    <div class="preview-actions">
                        <button id="print-btn" class="print-btn"><i class="fas fa-print"></i> Imprimer</button>
                        <button id="answer-key-btn" class="print-btn"><i class="fas fa-key"></i> Voir la clé</button>
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
pages['how-to-use'] = `${head('Comment utiliser AriClass - Guide pour professeurs', 'Apprenez à utiliser AriClass pour créer des fiches d\'exercices gratuites d\'anglais et de mathématiques.', 'how-to-use', '').replace('\n    <link rel="stylesheet" href="../css/generator.css">', '')}
<body>
${nav('how-to-use')}
    <div class="how-to-use-container" style="max-width:800px;margin:2rem auto;padding:0 1.5rem;">
        <h1 style="text-align:center;margin-bottom:2rem;">Comment utiliser AriClass</h1>
        <div style="margin-bottom:2rem;">
            <h2>1. Choisissez le type d'exercice</h2>
            <p>Sélectionnez le type d'exercice depuis le menu de navigation ou la page d'accueil. Il y a des exercices d'anglais, de mathématiques, des puzzles et des fiches imprimables.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>2. Personnalisez les options</h2>
            <p>Entrez vos mots ou choisissez les options disponibles (difficulté, taille de police, mise en page, etc.). L'aperçu se met à jour en temps réel.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>3. Imprimez la fiche</h2>
            <p>Cliquez sur le bouton "Imprimer" pour imprimer directement depuis le navigateur. Vous pouvez aussi enregistrer en PDF depuis la boîte de dialogue d'impression.</p>
        </div>
        <div style="margin-bottom:2rem;">
            <h2>Conseils</h2>
            <ul style="padding-left:1.5rem;line-height:2;">
                <li>Aucune inscription nécessaire — commencez immédiatement !</li>
                <li>Tous les exercices sont optimisés pour le format A4.</li>
                <li>Utilisez le bouton "Générer aléatoirement" pour créer rapidement des exercices de pratique.</li>
                <li>Vous pouvez générer plusieurs pages à la fois.</li>
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

console.log('\nAll fr/ pages generated!');
