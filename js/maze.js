var _lang = (function() {
    var p = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    var codes = ['es','fr','pt','ko','ja','zh'];
    return p.find(function(s){ return codes.indexOf(s) !== -1; }) || 'en';
})();
var _showTxt = { en:'Show Answers', ko:'답 보기', ja:'答えを見る', es:'Ver respuestas', fr:'Voir les réponses', pt:'Ver respostas', zh:'查看答案' }[_lang] || 'Show Answers';
var _hideTxt = { en:'Hide Answers', ko:'답 가리기', ja:'答えを隠す', es:'Ocultar respuestas', fr:'Masquer les réponses', pt:'Ocultar respostas', zh:'隐藏答案' }[_lang] || 'Hide Answers';

document.addEventListener('DOMContentLoaded', function () {

    // ── DOM ──────────────────────────────────────────────────────────────────
    const worksheetTitle   = document.getElementById('worksheet-title');
    const showTitle        = document.getElementById('show-title');
    const generateBtn      = document.getElementById('generate-btn');
    const randomGenerateBtn= document.getElementById('random-generate-btn');
    const printBtn         = document.getElementById('print-btn');
    const answerBtn        = document.getElementById('answer-btn');
    const puzzlePreview    = document.getElementById('puzzle-preview');
    const getDifficulty = () => (document.querySelector('input[name="difficulty"]:checked') || { value: 'medium' }).value;

    // ── State ─────────────────────────────────────────────────────────────────
    let currentMaze     = null;
    let currentSolution = null;
    let showingAnswers  = false;

    // ── Config ────────────────────────────────────────────────────────────────
    // Larger grids = denser, more challenging mazes
    const MAZE_SIZE = { easy: 12, medium: 20, hard: 30 };

    // Pure perfect maze — no loops.
    // DFS spanning tree guarantees every branch genuinely dead-ends (no way out).
    const LOOP_RATIO = { easy: 0, medium: 0, hard: 0 };

    // 4-directional helpers
    const DIRS = [
        { dr: -1, dc:  0, wall: 'top',    opp: 'bottom' },
        { dr:  0, dc:  1, wall: 'right',  opp: 'left'   },
        { dr:  1, dc:  0, wall: 'bottom', opp: 'top'    },
        { dr:  0, dc: -1, wall: 'left',   opp: 'right'  }
    ];

    // ── Event listeners ───────────────────────────────────────────────────────
    generateBtn.addEventListener('click',       generateMaze);
    randomGenerateBtn.addEventListener('click', generateMaze);
    printBtn.addEventListener('click',          () => window.print());
    showTitle.addEventListener('change',        updatePreview);
    worksheetTitle.addEventListener('input',    updatePreview);
    document.querySelectorAll('input[name="difficulty"]').forEach(r =>
        r.addEventListener('change', () => { if (currentMaze) generateMaze(); }));

    answerBtn.addEventListener('click', function () {
        if (!currentMaze) return;
        showingAnswers = !showingAnswers;
        updatePreview();
        this.innerHTML = showingAnswers
            ? '<i class="fas fa-eye-slash"></i> ' + _hideTxt
            : '<i class="fas fa-check-circle"></i> ' + _showTxt;
        this.classList.toggle('active');
    });

    // Auto-generate on page load
    generateMaze();

    // ═════════════════════════════════════════════════════════════════════════
    // MAZE GENERATION
    // ═════════════════════════════════════════════════════════════════════════

    function generateMaze() {
        const difficulty    = getDifficulty();
        const size          = MAZE_SIZE[difficulty];
        // Accept mazes where the solution path length falls in a sweet spot:
        //   min  → path is long & winding (not a short straight shot)
        //   max  → path doesn't consume the whole maze, leaving room for dead ends
        // The remaining cells (~45–62 %) form genuine dead-end branches off the path.
        const totalCells = size * size;
        const minLen = { easy: 0.34, medium: 0.38, hard: 0.42 };
        const maxLen = { easy: 0.56, medium: 0.56, hard: 0.56 };
        const lo = Math.floor(totalCells * minLen[difficulty]);
        const hi = Math.floor(totalCells * maxLen[difficulty]);

        let maze, solution, attempts = 0;
        do {
            maze     = buildMaze(size, difficulty);
            solution = solveMaze(maze, size);
            attempts++;
        } while ((solution.length < lo || solution.length > hi) && attempts < 50);

        currentMaze         = maze;
        currentSolution     = solution;
        showingAnswers      = false;
        answerBtn.innerHTML = '<i class="fas fa-check-circle"></i> ' + _showTxt;
        answerBtn.classList.remove('active');
        updatePreview();
        printBtn.disabled = false;
    }

    /**
     * Build a maze using iterative DFS (recursive backtracking).
     * Produces a perfect maze (unique solution), then optionally adds extra
     * passages (loops) to increase difficulty.
     */
    function buildMaze(size, difficulty) {
        // 1. Initialise every cell with all 4 walls intact
        const maze = Array.from({ length: size }, () =>
            Array.from({ length: size }, () =>
                ({ top: true, right: true, bottom: true, left: true })
            )
        );

        // 2. Iterative DFS — pure random neighbour selection.
        //    Produces a spanning tree where dead-end branches spread in all directions.
        //    Solution length is controlled externally via rejection sampling.
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const stack   = [[0, 0]];
        visited[0][0] = true;

        while (stack.length > 0) {
            const [r, c] = stack[stack.length - 1];
            const unvisited = [];

            for (const { dr, dc, wall, opp } of DIRS) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
                    unvisited.push({ nr, nc, wall, opp });
                }
            }

            if (unvisited.length > 0) {
                const { nr, nc, wall, opp } = unvisited[Math.floor(Math.random() * unvisited.length)];
                maze[r][c][wall]  = false;
                maze[nr][nc][opp] = false;
                visited[nr][nc]   = true;
                stack.push([nr, nc]);
            } else {
                stack.pop();
            }
        }

        // 3. Add extra passages (loops) proportional to difficulty
        const ratio = LOOP_RATIO[difficulty] || 0;
        if (ratio > 0) {
            addLoops(maze, size, ratio);
        }

        // 4. Guaranteed openings: START = top of [0,0], END = bottom of [size-1,size-1]
        maze[0][0].top                       = false;
        maze[size - 1][size - 1].bottom      = false;

        return maze;
    }

    /**
     * Remove a subset of remaining internal walls to create branching dead-end passages.
     * Avoids cells immediately adjacent to the start/end corner so entrances stay clean.
     * Walls are sampled evenly from all 4 quadrants so detours appear throughout the maze.
     */
    function addLoops(maze, size, ratio) {
        // Divide the maze into quadrants and collect candidate walls per quadrant
        const mid = Math.floor(size / 2);
        const quadrants = [
            { rMin: 1,   rMax: mid,      cMin: 0,   cMax: mid      },
            { rMin: 1,   rMax: mid,      cMin: mid, cMax: size - 1  },
            { rMin: mid, rMax: size - 1, cMin: 0,   cMax: mid      },
            { rMin: mid, rMax: size - 1, cMin: mid, cMax: size - 1  }
        ];

        const byQuadrant = quadrants.map(({ rMin, rMax, cMin, cMax }) => {
            const walls = [];
            for (let r = rMin; r < rMax; r++) {
                for (let c = cMin; c < cMax; c++) {
                    // Skip cells too close to start (0,0) or end (size-1,size-1)
                    if ((r <= 1 && c <= 1) || (r >= size - 2 && c >= size - 2)) continue;
                    if (c + 1 < size && maze[r][c].right)
                        walls.push([r, c, 'right', 'left', r, c + 1]);
                    if (r + 1 < size && maze[r][c].bottom)
                        walls.push([r, c, 'bottom', 'top', r + 1, c]);
                }
            }
            return walls;
        });

        // Total walls to remove, spread evenly across quadrants
        const totalWalls = byQuadrant.reduce((s, q) => s + q.length, 0);
        const totalCount = Math.floor(totalWalls * ratio);
        const perQuadrant = Math.ceil(totalCount / 4);

        for (const walls of byQuadrant) {
            // Fisher-Yates shuffle
            for (let i = walls.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [walls[i], walls[j]] = [walls[j], walls[i]];
            }
            const count = Math.min(perQuadrant, walls.length);
            for (let i = 0; i < count; i++) {
                const [r, c, wall, opp, nr, nc] = walls[i];
                maze[r][c][wall]  = false;
                maze[nr][nc][opp] = false;
            }
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // SOLVER (BFS — finds shortest path)
    // ═════════════════════════════════════════════════════════════════════════

    function solveMaze(maze, size) {
        const prev    = Array.from({ length: size }, () => Array(size).fill(null));
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const queue   = [[0, 0]];
        visited[0][0] = true;

        while (queue.length > 0) {
            const [r, c] = queue.shift();

            // Reached the exit
            if (r === size - 1 && c === size - 1) {
                return reconstructPath(prev, r, c);
            }

            for (const { dr, dc, wall } of DIRS) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size
                    && !visited[nr][nc] && !maze[r][c][wall]) {
                    visited[nr][nc]  = true;
                    prev[nr][nc]     = [r, c];
                    queue.push([nr, nc]);
                }
            }
        }

        return []; // No path found
    }

    function reconstructPath(prev, endR, endC) {
        const path = [];
        let cur     = [endR, endC];
        while (cur !== null) {
            path.unshift(cur);
            cur = prev[cur[0]][cur[1]];
        }
        return path;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // RENDERING
    // ═════════════════════════════════════════════════════════════════════════

    function updatePreview() {
        if (!currentMaze) { displayEmptyPreview(); return; }

        const difficulty = getDifficulty();
        const size       = MAZE_SIZE[difficulty];
        const title      = worksheetTitle.value || 'Maze Puzzle';

        // Stroke widths scale with maze size so walls look consistent
        const sw  = (2.5 * size) / 500;     // internal wall stroke
        const bsw = sw * 2.0;               // outer border stroke (thicker for clear boundary)
        const pad = 0.15;                   // SVG padding so border isn't clipped

        let h = '<div class="worksheet-page">';

        // ── Student header ────────────────────────────────────────────────────
        h += `
        <div class="student-header">
            <div class="header-left">
                <div class="puzzle-header">
                    <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
                </div>
            </div>
            <div class="info-group">
                <div class="info-line"><label>Name:</label><div class="input-field"></div></div>
                <div class="info-line"><label>Date:</label><div class="input-field"></div></div>
            </div>
        </div>`;

        h += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;

        // ── SVG maze ──────────────────────────────────────────────────────────
        h += '<div class="maze-container"><div class="maze-wrapper">';
        h += `<svg class="maze-svg"
                viewBox="${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}"
                width="600" height="600"
                style="max-width:100%;height:auto;aspect-ratio:1;">`;

        // Outer border (4 lines, with gaps for start and end)
        // Top  : gap from x=0 to x=1  (start entrance)
        h += line(1, 0, size, 0, bsw);
        // Bottom: gap from x=size-1 to x=size  (end exit)
        h += line(0, size, size - 1, size, bsw);
        // Left border (full)
        h += line(0, 0, 0, size, bsw);
        // Right border (full)
        h += line(size, 0, size, size, bsw);

        // Internal walls
        // Strategy: for each cell draw its TOP wall (if r > 0) and LEFT wall (if c > 0).
        // This covers every internal wall exactly once.
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = currentMaze[r][c];
                if (r > 0 && cell.top)   h += line(c, r, c + 1, r, sw);
                if (c > 0 && cell.left)  h += line(c, r, c, r + 1, sw);
            }
        }

        // ── Start / End markers ───────────────────────────────────────────────
        const mr = 0.22; // marker radius
        const fs = 0.26; // font size
        h += `<circle cx="0.5" cy="0.5" r="${mr}" fill="#4CAF50" opacity="0.85"/>`;
        h += `<text x="0.5" y="${0.5 + fs * 0.38}" text-anchor="middle" font-size="${fs}" fill="#fff" font-weight="bold">S</text>`;
        h += `<circle cx="${size - 0.5}" cy="${size - 0.5}" r="${mr}" fill="#F44336" opacity="0.85"/>`;
        h += `<text x="${size - 0.5}" y="${size - 0.5 + fs * 0.38}" text-anchor="middle" font-size="${fs}" fill="#fff" font-weight="bold">E</text>`;

        // ── Solution path ─────────────────────────────────────────────────────
        if (showingAnswers && currentSolution && currentSolution.length > 0) {
            const psw = (6 * size) / 500;
            let d = '';
            currentSolution.forEach(([r, c], i) => {
                d += `${i === 0 ? 'M' : 'L'} ${c + 0.5} ${r + 0.5} `;
            });
            h += `<path d="${d}" stroke="#e53935" stroke-width="${psw}"
                    fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
        }

        h += '</svg>';
        h += '</div></div>'; // maze-wrapper, maze-container

        const year = new Date().getFullYear();
        h += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        h += '</div>'; // worksheet-page

        puzzlePreview.innerHTML = h;
    }

    /** Render a simple bordered placeholder before any maze is generated. */
    function displayEmptyPreview() {
        const title = showTitle.checked ? (worksheetTitle.value || 'Maze Puzzle') : '';
        let h = '<div class="worksheet-page">';
        h += `
        <div class="student-header">
            <div class="header-left">
                <div class="puzzle-header">
                    <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
                </div>
            </div>
            <div class="info-group">
                <div class="info-line"><label>Name:</label><div class="input-field"></div></div>
                <div class="info-line"><label>Date:</label><div class="input-field"></div></div>
            </div>
        </div>`;
        h += `<div class="puzzle-title" style="visibility:${showTitle.checked ? 'visible' : 'hidden'}">${title}</div>`;
        h += `<div class="maze-container"><div class="maze-wrapper">
            <svg class="maze-svg" viewBox="-0.1 -0.1 10.2 10.2" width="600" height="600"
                 style="max-width:100%;height:auto;aspect-ratio:1;">
                <rect x="0" y="0" width="10" height="10" fill="none" stroke="#000" stroke-width="0.04"/>
            </svg>
        </div></div>`;
        const year = new Date().getFullYear();
        h += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        h += '</div>';
        puzzlePreview.innerHTML = h;
        printBtn.disabled = true;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Return an SVG <line> element string. */
    function line(x1, y1, x2, y2, strokeWidth) {
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
    }

});
