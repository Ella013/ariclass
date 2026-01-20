document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const worksheetTitle = document.getElementById('worksheet-title');
    const showTitle = document.getElementById('show-title');
    const generateBtn = document.getElementById('generate-btn');
    const randomGenerateBtn = document.getElementById('random-generate-btn');
    const printBtn = document.getElementById('print-btn');
    const answerBtn = document.getElementById('answer-btn');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const difficultySelect = document.getElementById('difficulty-select');

    // State
    let currentMaze = null;
    let currentSolution = null;
    let showingAnswers = false;

    // Maze sizes by difficulty
    const mazeSizes = {
        easy: 10,
        medium: 15,
        hard: 20
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateMaze);
    randomGenerateBtn.addEventListener('click', generateMaze);
    printBtn.addEventListener('click', () => window.print());
    showTitle.addEventListener('change', updatePreview);
    worksheetTitle.addEventListener('input', updatePreview);
    difficultySelect.addEventListener('change', function() {
        // If maze is already generated, regenerate with new difficulty
        if (currentMaze) {
            generateMaze();
        }
    });

    // Show Answers button
    answerBtn.addEventListener('click', function() {
        if (!currentMaze) return;
        showingAnswers = !showingAnswers;
        updatePreview();
        
        // Update button text
        this.innerHTML = showingAnswers ? 
            '<i class="fas fa-eye-slash"></i> Hide Answers' : 
            '<i class="fas fa-check-circle"></i> Show Answers';
        this.classList.toggle('active');
    });

    // Initialize with empty preview
    displayEmptyPreview();

    function displayEmptyPreview() {
        const title = showTitle.checked ? worksheetTitle.value || 'Maze Puzzle' : '';
        
        let html = '<div class="worksheet-page">';
        
        // Student header
        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div>';
        html += '</div>';
        html += '<div class="info-group">';
        html += '<div class="info-line">';
        html += '<label>Name:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '<div class="info-line">';
        html += '<label>Date:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        if (title) {
            html += `<div class="puzzle-title">${title}</div>`;
        }

        html += '<div class="maze-container">';
        html += '<div class="maze-wrapper">';
        html += '<svg class="maze-svg" viewBox="-0.1 -0.1 10.2 10.2" width="600" height="600" style="max-width: 100%; height: auto; aspect-ratio: 1;">';
        html += '<rect x="0" y="0" width="10" height="10" fill="none" stroke="#000" stroke-width="0.04"/>';
        html += '</svg>';
        html += '</div>'; // Close maze-wrapper
        html += '</div>'; // Close maze-container

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        html += '</div>';

        puzzlePreview.innerHTML = html;
        printBtn.disabled = true;
    }

    // Generate maze using recursive backtracking
    function generateMaze() {
        const selectedDifficulty = difficultySelect.value;
        const size = mazeSizes[selectedDifficulty];
        
        // Generate maze with retry if validation fails
        let maze;
        let solution;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            maze = generateMazeGrid(size);
            solution = findSolution(maze, size);
            
            // Validate maze difficulty: check path quality, not just count
            if (validateMazeDifficulty(maze, size, solution)) {
                break; // Valid maze
            }
            
            attempts++;
        }
        
        currentMaze = maze;
        currentSolution = solution;
        
        showingAnswers = false;
        answerBtn.innerHTML = '<i class="fas fa-check-circle"></i> Show Answers';
        answerBtn.classList.remove('active');
        
        updatePreview();
        printBtn.disabled = false;
    }
    
    // Basic difficulty validation: 일단 '정상적인 미로'를 보장하는 최소 조건만 사용
    function validateMazeDifficulty(walls, size, mainPath) {
        // 1) 경로는 반드시 존재해야 함
        if (!mainPath || mainPath.length === 0) return false;

        // 2) 너무 짧은 미로는 거절 (최소 전체 셀의 30% 이상은 지나가게)
        const minLength = Math.floor(size * size * 0.3);
        if (mainPath.length < minLength) return false;

        // 나머지 고급 난이도 검증은 잠시 비활성화 (우선 '정상 동작'에 집중)
        return true;
    }
    
    // Check if there are decision points near start (without using mainPath)
    function hasEarlyDecisionPoints(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        // Check cells near start (within 5 cells)
        let decisionPoints = 0;
        for (let row = 0; row < Math.min(6, size); row++) {
            for (let col = 0; col < Math.min(6, size); col++) {
                if (row === 0 && col === 0) continue; // Skip start
                
                let openings = 0;
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                    }
                }
                
                // Junction (3+ openings) is a decision point
                if (openings >= 3) {
                    decisionPoints++;
                }
            }
        }
        
        return decisionPoints >= 2; // Need at least 2 decision points near start
    }
    
    // Count dead ends (cells with only 1 opening)
    function countDeadEnds(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        let deadEndCount = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let openings = 0;
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                    }
                }
                
                if (openings === 1) {
                    deadEndCount++;
                }
            }
        }
        
        return deadEndCount;
    }
    
    // Count junctions (cells with 3+ openings)
    function countJunctions(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        let junctionCount = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let openings = 0;
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                    }
                }
                
                if (openings >= 3) {
                    junctionCount++;
                }
            }
        }
        
        return junctionCount;
    }
    
    // Check for visually deceptive false paths with sufficient regret distance
    // Humans judge by visual straightness and proximity to end, not graph distance
    function checkVisualFalsePaths(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        const endRow = size - 1;
        const endCol = size - 1;
        const minRegret = Math.floor(size * 0.4); // 40% of size
        const requiredFalsePaths = 2; // Need at least 2 visually deceptive false paths
        
        // Find all decision points near start (first 20% of maze area)
        const startArea = Math.floor(size * 0.2);
        const decisionPoints = [];
        
        for (let row = 0; row <= startArea; row++) {
            for (let col = 0; col <= startArea; col++) {
                if (row === 0 && col === 0) continue; // Skip start
                
                let openings = 0;
                const branches = [];
                
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                        branches.push([newRow, newCol]);
                    }
                }
                
                // Junction (3+ openings) is a decision point
                if (openings >= 3) {
                    decisionPoints.push([row, col, branches]);
                }
            }
        }
        
        if (decisionPoints.length === 0) return false;
        
        // Check each decision point for visually deceptive false paths
        let validFalsePathCount = 0;
        
        for (const [decRow, decCol, branches] of decisionPoints) {
            // For each branch, check if it's visually deceptive
            for (const [branchRow, branchCol] of branches) {
                // Calculate visual properties of this branch path
                const visualDist = euclideanDistance(branchRow, branchCol, endRow, endCol);
                const startDist = euclideanDistance(0, 0, endRow, endCol);
                
                // Check if this branch appears closer to end or more direct
                // (visual distance improvement)
                const visualImprovement = startDist - visualDist;
                
                // Calculate path straightness (how direct it appears)
                // Build a path from start through this branch
                const pathStraightness = calculatePathVisualStraightness(
                    [[0, 0], [decRow, decCol], [branchRow, branchCol]], 
                    endRow, endCol
                );
                
                // A visually deceptive path should:
                // 1. Appear closer to end (visual distance improvement > 0)
                // 2. OR appear more straight (straightness > 0.5)
                const isVisuallyDeceptive = visualImprovement > 0 || pathStraightness > 0.5;
                
                if (isVisuallyDeceptive) {
                    // Calculate regret distance: minimum travel to return to end
                    const regretDistance = calculateRegretDistanceToEnd(
                        walls, size, branchRow, branchCol, endRow, endCol
                    );
                    
                    if (regretDistance >= minRegret) {
                        validFalsePathCount++;
                        if (validFalsePathCount >= requiredFalsePaths) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false; // Not enough visually deceptive false paths
    }
    
    // Calculate visual straightness of a path (how direct it appears)
    // Returns value between 0 (very indirect) and 1 (perfectly straight)
    function calculatePathVisualStraightness(path, endRow, endCol) {
        if (path.length < 2) return 0;
        
        const start = path[0];
        const end = path[path.length - 1];
        
        // Direct distance from start to end
        const directDist = euclideanDistance(start[0], start[1], endRow, endCol);
        
        // Actual path distance (sum of Euclidean distances between consecutive points)
        let pathDist = 0;
        for (let i = 0; i < path.length - 1; i++) {
            pathDist += euclideanDistance(
                path[i][0], path[i][1],
                path[i + 1][0], path[i + 1][1]
            );
        }
        
        // Also consider how close the path end is to the actual end
        const pathEndDist = euclideanDistance(end[0], end[1], endRow, endCol);
        const startToEndDist = euclideanDistance(start[0], start[1], endRow, endCol);
        
        // Straightness = direct distance / path distance (closer to 1 is better)
        // Also factor in how close path end is to actual end
        const distanceRatio = pathDist > 0 ? directDist / pathDist : 0;
        const proximityRatio = startToEndDist > 0 ? 
            (startToEndDist - pathEndDist) / startToEndDist : 0;
        
        // Combined score: both straightness and proximity matter
        return (distanceRatio * 0.6 + proximityRatio * 0.4);
    }
    
    // Calculate regret distance: minimum travel to return to end after wrong choice
    // This is the "movement loss" - how much extra distance must be traveled
    function calculateRegretDistanceToEnd(walls, size, startRow, startCol, endRow, endCol) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        // Use BFS to find shortest path from wrong choice to end
        const queue = [[startRow, startCol, 0]];
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        visited[startRow][startCol] = true;
        
        while (queue.length > 0) {
            const [row, col, distance] = queue.shift();
            
            if (row === endRow && col === endCol) {
                return distance; // Return regret distance
            }
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) {
                    visited[newRow][newCol] = true;
                    queue.push([newRow, newCol, distance + 1]);
                }
            }
        }
        
        return Infinity; // Cannot reach end - this is a dead end
    }
    
    // Find false candidate paths (paths that go far before failing)
    function findFalseCandidatePaths(walls, size, mainPath, minLength) {
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        const falsePaths = [];
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        
        // Find paths starting from main path that go far but don't reach end
        function dfsFalsePath(row, col, path, pathLength) {
            // If we reached end, this is not a false path
            if (row === size - 1 && col === size - 1) {
                return;
            }
            
            // If path is long enough and doesn't reach end, it's a false candidate
            if (pathLength >= minLength && !isOnMainPath[row][col]) {
                falsePaths.push([...path]);
                return;
            }
            
            visited[row][col] = true;
            path.push([row, col]);
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) {
                    dfsFalsePath(newRow, newCol, path, pathLength + 1);
                }
            }
            
            path.pop();
            visited[row][col] = false;
        }
        
        // Start from points on main path (not start/end)
        for (let i = 1; i < mainPath.length - 1; i++) {
            const [startRow, startCol] = mainPath[i];
            // Check branches from this point
            for (const [dr, dc, wallKey] of directions) {
                const branchRow = startRow + dr;
                const branchCol = startCol + dc;
                
                if (branchRow >= 0 && branchRow < size && 
                    branchCol >= 0 && branchCol < size &&
                    !isOnMainPath[branchRow][branchCol] &&
                    !walls[startRow][startCol][wallKey]) {
                    // Found a branch, explore it
                    dfsFalsePath(branchRow, branchCol, [[startRow, startCol]], 1);
                }
            }
        }
        
        return falsePaths;
    }
    
    // Check if first 10-15 moves have ambiguity (multiple choices)
    function hasEarlyAmbiguity(walls, size, mainPath) {
        const earlyPath = mainPath.slice(0, Math.min(15, mainPath.length));
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        let ambiguousChoices = 0;
        
        for (let i = 0; i < earlyPath.length - 1; i++) {
            const [row, col] = earlyPath[i];
            let branchCount = 0;
            
            // Count branches (paths not on main path)
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    !isOnMainPath[newRow][newCol] &&
                    !walls[row][col][wallKey]) {
                    branchCount++;
                }
            }
            
            // If there are branches, this is an ambiguous choice point
            if (branchCount > 0) {
                ambiguousChoices++;
            }
        }
        
        // Need at least 2 ambiguous choices in first 10-15 moves
        return ambiguousChoices >= 2;
    }
    
    // Find decoy paths (paths that approach end but don't complete)
    function findDecoyPaths(walls, size, mainPath) {
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        const decoyPaths = [];
        const endRow = size - 1;
        const endCol = size - 1;
        
        // Find paths starting from main path that approach end
        function dfsDecoy(row, col, path, visited) {
            const distToEnd = Math.abs(row - endRow) + Math.abs(col - endCol);
            
            // If we reached within 2 cells of end, this is a decoy path
            if (distToEnd <= 2 && path.length > 5) {
                decoyPaths.push([...path]);
                return;
            }
            
            visited[row][col] = true;
            path.push([row, col]);
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey] &&
                    !isOnMainPath[newRow][newCol]) {
                    dfsDecoy(newRow, newCol, path, visited);
                }
            }
            
            path.pop();
            visited[row][col] = false;
        }
        
        // Start from points on main path
        for (let i = 1; i < mainPath.length - 1; i++) {
            const [startRow, startCol] = mainPath[i];
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[startRow][startCol] = true;
            
            for (const [dr, dc, wallKey] of directions) {
                const branchRow = startRow + dr;
                const branchCol = startCol + dc;
                
                if (branchRow >= 0 && branchRow < size && 
                    branchCol >= 0 && branchCol < size &&
                    !isOnMainPath[branchRow][branchCol] &&
                    !walls[startRow][startCol][wallKey]) {
                    dfsDecoy(branchRow, branchCol, [[startRow, startCol]], visited);
                }
            }
        }
        
        return decoyPaths;
    }
    
    // Count paths from start to end with bounded early exit
    // Returns count up to 6 (if 6+ paths found, returns 6 immediately to avoid exponential explosion)
    function countAllPaths(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        const pathCount = { count: 0 };
        const MAX_COUNT = 6; // Early exit threshold
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        
        function dfsPathCount(row, col) {
            // Early exit if we've found enough paths
            if (pathCount.count >= MAX_COUNT) {
                return;
            }
            
            if (row === size - 1 && col === size - 1) {
                pathCount.count++;
                return;
            }
            
            visited[row][col] = true;
            
            for (const [dr, dc, wallKey] of directions) {
                // Early exit check
                if (pathCount.count >= MAX_COUNT) {
                    visited[row][col] = false;
                    return;
                }
                
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) {
                    dfsPathCount(newRow, newCol);
                }
            }
            
            visited[row][col] = false;
        }
        
        dfsPathCount(0, 0);
        return pathCount.count;
    }

    // Generate a basic, stable maze using classic DFS backtracking (perfect maze)
    // 목표: 일단 '정상적인 미로'를 확실하게 만들어주기 위한 기본 버전
    function generateMazeGrid(size) {
        // Initialize: all cells have all 4 walls initially
        const walls = Array(size).fill(null).map(() => 
            Array(size).fill(null).map(() => ({
                top: true,
                right: true,
                bottom: true,
                left: true
            }))
        );
        
        // Remove outer walls at start and end
        walls[0][0].top = false; // Start: remove top wall
        walls[size - 1][size - 1].bottom = false; // End: remove bottom wall
        
        // 기본 DFS 백트래킹으로 완전 미로 생성 (유일 경로 보장)
        generateBasicDFS(walls, size);
        
        // 가끔 가짜 경로(데드엔드)를 추가해서 헷갈리게 함
        addFalsePaths(walls, size);
        
        // 빈 공간(고립된 셀)이 생기지 않도록 모든 셀을 연결
        ensureAllCellsReachable(walls, size);
        
        // 최종 검증: 모든 셀이 통로에 연결되어 있고 빈칸이 없는지 확인
        validateNoEmptyCells(walls, size);
        
        // 벽 대칭성만 정리 (렌더링 안정성)
        ensureWallsConnected(walls, size);
        
        return walls;
    }
    
    // 완전 미로에 가끔 가짜 경로(데드엔드)를 추가
    // 다른 길로 들어갈 수 있지만 결국 막혀있게 만듦
    function addFalsePaths(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // 가짜 경로 개수: size에 비례
        const numFalsePaths = Math.floor(size * 0.2); // 예: 10x10이면 2개, 20x20이면 4개
        
        let pathsCreated = 0;
        let attempts = 0;
        const maxAttempts = size * size * 3;
        
        while (pathsCreated < numFalsePaths && attempts < maxAttempts) {
            attempts++;
            
            // start(0,0)에서 reachable한 셀만 선택 (빈 공간 방지)
            const reachableCells = getReachableCells(walls, size);
            if (reachableCells.length === 0) break; // 더 이상 reachable한 셀이 없으면 종료
            
            // reachable한 셀 중에서 랜덤 선택
            const [row, col] = reachableCells[Math.floor(Math.random() * reachableCells.length)];
            
            // 이 셀이 통로에 있는지 확인 (최소 1개 이상 벽이 열려있어야 함)
            let openWalls = 0;
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                    if (!walls[row][col][wallKey]) {
                        openWalls++;
                    }
                }
            }
            
            // 통로에 있는 셀이 아니면 스킵
            if (openWalls === 0) continue;
            
            // 이 셀에서 아직 막혀있는 방향 찾기
            const closedDirections = [];
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    walls[row][col][wallKey]) { // 벽이 막혀있으면
                    closedDirections.push([newRow, newCol, wallKey, oppositeWallKey]);
                }
            }
            
            if (closedDirections.length === 0) continue;
            
            // 랜덤하게 하나 선택해서 가짜 경로 시작
            const [startRow, startCol, startWallKey, startOppositeWallKey] = 
                closedDirections[Math.floor(Math.random() * closedDirections.length)];
            
            // 벽을 열어서 가짜 경로 시작
            walls[row][col][startWallKey] = false;
            walls[startRow][startCol][startOppositeWallKey] = false;
            
            // 가짜 경로를 2~5칸 정도 연장한 뒤 막다른 길로 만들기
            let currentRow = startRow;
            let currentCol = startCol;
            const pathLength = 2 + Math.floor(Math.random() * 4); // 2~5칸
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[row][col] = true;
            visited[startRow][startCol] = true;
            
            for (let step = 0; step < pathLength; step++) {
                // 다음 칸으로 갈 수 있는 방향 찾기
                const nextDirections = [];
                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                    const nextRow = currentRow + dr;
                    const nextCol = currentCol + dc;
                    
                    if (nextRow >= 0 && nextRow < size && 
                        nextCol >= 0 && nextCol < size &&
                        !visited[nextRow][nextCol] &&
                        walls[currentRow][currentCol][wallKey]) { // 벽이 막혀있으면
                        nextDirections.push([nextRow, nextCol, wallKey, oppositeWallKey]);
                    }
                }
                
                if (nextDirections.length === 0) {
                    // 더 갈 곳이 없으면 여기서 끝 (데드엔드)
                    break;
                }
                
                // 랜덤하게 하나 선택
                const [nextRow, nextCol, nextWallKey, nextOppositeWallKey] = 
                    nextDirections[Math.floor(Math.random() * nextDirections.length)];
                
                // 벽 열기
                walls[currentRow][currentCol][nextWallKey] = false;
                walls[nextRow][nextCol][nextOppositeWallKey] = false;
                visited[nextRow][nextCol] = true;
                currentRow = nextRow;
                currentCol = nextCol;
            }
            
            // 마지막 셀을 진짜 데드엔드로 만들기 (주변 벽을 모두 닫기)
            // 단, 들어온 방향은 열어둬야 함
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const neighborRow = currentRow + dr;
                const neighborCol = currentCol + dc;
                
                if (neighborRow >= 0 && neighborRow < size && 
                    neighborCol >= 0 && neighborCol < size) {
                    // 이미 열린 벽이 아니면 닫기
                    if (walls[currentRow][currentCol][wallKey] === false) {
                        // 이 방향은 이미 열려있음 (들어온 경로)
                        continue;
                    }
                    // 나머지는 벽을 닫아서 데드엔드로 만들기
                    // (이미 막혀있으면 그대로)
                }
            }
            
            pathsCreated++;
        }
    }
    
    // start(0,0)에서 reachable한 모든 셀 반환
    function getReachableCells(walls, size) {
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        const queue = [[0, 0]];
        visited[0][0] = true;
        const reachable = [[0, 0]];
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) { // 벽이 열려있으면
                    visited[newRow][newCol] = true;
                    queue.push([newRow, newCol]);
                    reachable.push([newRow, newCol]);
                }
            }
        }
        
        return reachable;
    }
    
    // 모든 셀이 start에서 reachable하도록 보장 (빈 공간 제거)
    function ensureAllCellsReachable(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // 최대 5번 반복하여 모든 셀을 연결 시도
        for (let attempt = 0; attempt < 5; attempt++) {
            const reachableCells = getReachableCells(walls, size);
            const reachableSet = new Set();
            for (const [r, c] of reachableCells) {
                reachableSet.add(`${r},${c}`);
            }
            
            // 고립된 셀 찾기
            const isolatedCells = [];
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (!reachableSet.has(`${row},${col}`)) {
                        isolatedCells.push([row, col]);
                    }
                }
            }
            
            // 고립된 셀이 없으면 완료
            if (isolatedCells.length === 0) break;
            
            // 고립된 셀을 가장 가까운 reachable 셀에 연결
            for (const [isoRow, isoCol] of isolatedCells) {
                // 가장 가까운 reachable 셀 찾기 (거리 제한 확대)
                let nearestReachable = null;
                let minDist = Infinity;
                
                for (const [rRow, rCol] of reachableCells) {
                    const dist = Math.abs(isoRow - rRow) + Math.abs(isoCol - rCol);
                    if (dist < minDist && dist <= 5) { // 5칸 이내로 확대
                        minDist = dist;
                        nearestReachable = [rRow, rCol];
                    }
                }
                
                if (nearestReachable) {
                    // 고립된 셀에서 reachable 셀까지 경로 만들기
                    let currentRow = isoRow;
                    let currentCol = isoCol;
                    const [targetRow, targetCol] = nearestReachable;
                    
                    while ((currentRow !== targetRow || currentCol !== targetCol) && 
                           Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol) <= 5) {
                        let bestDir = null;
                        let bestDist = Infinity;
                        
                        for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                            const nextRow = currentRow + dr;
                            const nextCol = currentCol + dc;
                            
                            if (nextRow >= 0 && nextRow < size && 
                                nextCol >= 0 && nextCol < size &&
                                walls[currentRow][currentCol][wallKey]) {
                                
                                const dist = Math.abs(nextRow - targetRow) + 
                                           Math.abs(nextCol - targetCol);
                                
                                if (dist < bestDist) {
                                    bestDist = dist;
                                    bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                }
                            }
                        }
                        
                        if (bestDir) {
                            const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                            walls[currentRow][currentCol][wallKey] = false;
                            walls[nextRow][nextCol][oppositeWallKey] = false;
                            currentRow = nextRow;
                            currentCol = nextCol;
                            
                            // 도달했으면 종료
                            if (currentRow === targetRow && currentCol === targetCol) break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // 최종 검증: 모든 셀이 통로에 연결되어 있고 빈칸이 없는지 확인
    function validateNoEmptyCells(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // 1. 모든 셀이 최소 1개의 열린 벽을 가지는지 확인
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let openWalls = 0;
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                        if (!walls[row][col][wallKey]) {
                            openWalls++;
                        }
                    }
                }
                
                // 모든 벽이 닫혀있는 빈칸 발견 시 가장 가까운 통로에 연결
                if (openWalls === 0) {
                    const reachableCells = getReachableCells(walls, size);
                    if (reachableCells.length > 0) {
                        // 가장 가까운 reachable 셀 찾기
                        let nearest = null;
                        let minDist = Infinity;
                        
                        for (const [rRow, rCol] of reachableCells) {
                            const dist = Math.abs(row - rRow) + Math.abs(col - rCol);
                            if (dist < minDist && dist <= 5) {
                                minDist = dist;
                                nearest = [rRow, rCol];
                            }
                        }
                        
                        if (nearest) {
                            // 빈칸에서 가장 가까운 통로까지 벽 열기
                            const [targetRow, targetCol] = nearest;
                            let currentRow = row;
                            let currentCol = col;
                            
                            while ((currentRow !== targetRow || currentCol !== targetCol) && 
                                   Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol) <= 5) {
                                let bestDir = null;
                                let bestDist = Infinity;
                                
                                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                                    const nextRow = currentRow + dr;
                                    const nextCol = currentCol + dc;
                                    
                                    if (nextRow >= 0 && nextRow < size && 
                                        nextCol >= 0 && nextCol < size &&
                                        walls[currentRow][currentCol][wallKey]) {
                                        
                                        const dist = Math.abs(nextRow - targetRow) + 
                                                   Math.abs(nextCol - targetCol);
                                        
                                        if (dist < bestDist) {
                                            bestDist = dist;
                                            bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                        }
                                    }
                                }
                                
                                if (bestDir) {
                                    const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                                    walls[currentRow][currentCol][wallKey] = false;
                                    walls[nextRow][nextCol][oppositeWallKey] = false;
                                    currentRow = nextRow;
                                    currentCol = nextCol;
                                    
                                    if (currentRow === targetRow && currentCol === targetCol) break;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // 2. 모든 셀이 start에서 reachable한지 최종 확인 및 강제 연결
        let finalReachable = getReachableCells(walls, size);
        let attempts = 0;
        while (finalReachable.length < size * size && attempts < 10) {
            ensureAllCellsReachable(walls, size);
            finalReachable = getReachableCells(walls, size);
            attempts++;
        }
        
        // 3. 여전히 고립된 셀이 있으면 직접 연결
        if (finalReachable.length < size * size) {
            const reachableSet = new Set();
            for (const [r, c] of finalReachable) {
                reachableSet.add(`${r},${c}`);
            }
            
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (!reachableSet.has(`${row},${col}`)) {
                        // 가장 가까운 reachable 셀 찾기
                        let nearest = null;
                        let minDist = Infinity;
                        
                        for (const [rRow, rCol] of finalReachable) {
                            const dist = Math.abs(row - rRow) + Math.abs(col - rCol);
                            if (dist < minDist) {
                                minDist = dist;
                                nearest = [rRow, rCol];
                            }
                        }
                        
                        if (nearest) {
                            // 직접 연결
                            const [targetRow, targetCol] = nearest;
                            let currentRow = row;
                            let currentCol = col;
                            
                            while (currentRow !== targetRow || currentCol !== targetCol) {
                                let bestDir = null;
                                let bestDist = Infinity;
                                
                                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                                    const nextRow = currentRow + dr;
                                    const nextCol = currentCol + dc;
                                    
                                    if (nextRow >= 0 && nextRow < size && 
                                        nextCol >= 0 && nextCol < size &&
                                        walls[currentRow][currentCol][wallKey]) {
                                        
                                        const dist = Math.abs(nextRow - targetRow) + 
                                                   Math.abs(nextCol - targetCol);
                                        
                                        if (dist < bestDist) {
                                            bestDist = dist;
                                            bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                        }
                                    }
                                }
                                
                                if (bestDir) {
                                    const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                                    walls[currentRow][currentCol][wallKey] = false;
                                    walls[nextRow][nextCol][oppositeWallKey] = false;
                                    currentRow = nextRow;
                                    currentCol = nextCol;
                                    
                                    if (currentRow === targetRow && currentCol === targetCol) break;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Classic recursive-backtracker (iterative) perfect maze generator
    // 직선이 너무 길지 않도록 MAX_STRAIGHT로 살짝만 제어
    // 모든 셀을 반드시 방문하도록 보장
    function generateBasicDFS(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        const stack = [];
        
        const MAX_STRAIGHT = 6;
        
        // stack element: [row, col, lastDirIndex, straightLen]
        stack.push([0, 0, -1, 0]);
        visited[0][0] = true;
        let visitedCount = 1;
        
        while (stack.length > 0) {
            const top = stack[stack.length - 1];
            const row = top[0];
            const col = top[1];
            const lastDirIndex = top[2];
            const straightLen = top[3];
            
            // 후보 방향 수집
            const candidates = [];
            for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                const [dr, dc, wallKey, oppositeWallKey] = directions[dirIndex];
                const nr = row + dr;
                const nc = col + dc;
                
                if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
                if (visited[nr][nc]) continue;
                
                // 직선이 너무 길어지는 것만 막기
                if (lastDirIndex === dirIndex && straightLen >= MAX_STRAIGHT) {
                    continue;
                }
                
                candidates.push([nr, nc, wallKey, oppositeWallKey, dirIndex]);
            }
            
            if (candidates.length === 0) {
                // 더 갈 곳이 없으면 백트래킹
                stack.pop();
                continue;
            }
            
            // 랜덤으로 한 방향 선택
            const [nr, nc, wallKey, oppositeWallKey, dirIndex] =
                candidates[Math.floor(Math.random() * candidates.length)];
            
            // 벽을 열어 통로 생성
            walls[row][col][wallKey] = false;
            walls[nr][nc][oppositeWallKey] = false;
            
            visited[nr][nc] = true;
            visitedCount++;
            
            const nextStraight =
                lastDirIndex === dirIndex ? straightLen + 1 : 1;
            
            stack.push([nr, nc, dirIndex, nextStraight]);
        }
        
        // 모든 셀을 방문하지 못한 경우, 방문하지 못한 셀들을 연결
        if (visitedCount < size * size) {
            connectUnvisitedCells(walls, size, visited);
        }
    }
    
    // 방문하지 못한 셀들을 기존 통로에 연결
    function connectUnvisitedCells(walls, size, visited) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // 방문하지 못한 셀 찾기
        const unvisited = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (!visited[row][col]) {
                    unvisited.push([row, col]);
                }
            }
        }
        
        // 각 방문하지 못한 셀을 가장 가까운 방문한 셀에 연결
        for (const [uvRow, uvCol] of unvisited) {
            let nearestVisited = null;
            let minDist = Infinity;
            
            // 가장 가까운 방문한 셀 찾기
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (visited[row][col]) {
                        const dist = Math.abs(uvRow - row) + Math.abs(uvCol - col);
                        if (dist < minDist && dist <= 3) {
                            minDist = dist;
                            nearestVisited = [row, col];
                        }
                    }
                }
            }
            
            if (nearestVisited) {
                // 방문하지 못한 셀에서 방문한 셀까지 경로 만들기
                let currentRow = uvRow;
                let currentCol = uvCol;
                const [targetRow, targetCol] = nearestVisited;
                
                while ((currentRow !== targetRow || currentCol !== targetCol) && 
                       Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol) <= 3) {
                    let bestDir = null;
                    let bestDist = Infinity;
                    
                    for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                        const nextRow = currentRow + dr;
                        const nextCol = currentCol + dc;
                        
                        if (nextRow >= 0 && nextRow < size && 
                            nextCol >= 0 && nextCol < size &&
                            walls[currentRow][currentCol][wallKey]) {
                            
                            const dist = Math.abs(nextRow - targetRow) + 
                                       Math.abs(nextCol - targetCol);
                            
                            if (dist < bestDist) {
                                bestDist = dist;
                                bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                            }
                        }
                    }
                    
                    if (bestDir) {
                        const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                        walls[currentRow][currentCol][wallKey] = false;
                        walls[nextRow][nextCol][oppositeWallKey] = false;
                        visited[nextRow][nextCol] = true;
                        currentRow = nextRow;
                        currentCol = nextCol;
                        
                        if (currentRow === targetRow && currentCol === targetCol) break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    
    // Generate multiple competing paths from start (NOT a tree structure)
    // Multiple paths expand simultaneously, creating natural competition
    function generateMultipleCompetingPaths(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Track which cells are part of the path network
        const inNetwork = Array(size).fill(null).map(() => Array(size).fill(false));
        inNetwork[0][0] = true; // Start is in network
        
        // Multiple path heads expanding simultaneously
        const pathHeads = [[0, 0]]; // Start with start position
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        visited[0][0] = true;
        
        // Target number of decision points (junctions with 3+ openings)
        const targetJunctions = Math.floor(size * 0.3); // 30% of cells should be junctions
        let junctionCount = 0;
        
        // Expand paths until we reach the end
        while (pathHeads.length > 0 && !inNetwork[size - 1][size - 1]) {
            // Randomly select a path head to expand
            const headIndex = Math.floor(Math.random() * pathHeads.length);
            const [row, col] = pathHeads[headIndex];
            
            // Find available neighbors
            const availableNeighbors = [];
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    walls[row][col][wallKey]) { // Wall exists
                    availableNeighbors.push([newRow, newCol, wallKey, oppositeWallKey]);
                }
            }
            
            if (availableNeighbors.length > 0) {
                // Decision point: if multiple neighbors available, create a junction
                if (availableNeighbors.length > 1 && junctionCount < targetJunctions) {
                    // Create a junction: connect to 2-3 neighbors (not all, to create decision points)
                    const numConnections = 1 + Math.floor(Math.random() * Math.min(2, availableNeighbors.length));
                    const shuffled = availableNeighbors.sort(() => Math.random() - 0.5);
                    
                    for (let i = 0; i < numConnections; i++) {
                        const [newRow, newCol, wallKey, oppositeWallKey] = shuffled[i];
                        
                        // Remove wall
                        walls[row][col][wallKey] = false;
                        walls[newRow][newCol][oppositeWallKey] = false;
                        
                        if (!inNetwork[newRow][newCol]) {
                            inNetwork[newRow][newCol] = true;
                            pathHeads.push([newRow, newCol]);
                            visited[newRow][newCol] = true;
                        }
                    }
                    
                    junctionCount++;
                } else {
                    // Single connection: choose one neighbor
                    const [newRow, newCol, wallKey, oppositeWallKey] = 
                        availableNeighbors[Math.floor(Math.random() * availableNeighbors.length)];
                    
                    // Remove wall
                    walls[row][col][wallKey] = false;
                    walls[newRow][newCol][oppositeWallKey] = false;
                    
                    if (!inNetwork[newRow][newCol]) {
                        inNetwork[newRow][newCol] = true;
                        pathHeads.push([newRow, newCol]);
                        visited[newRow][newCol] = true;
                    }
                }
            } else {
                // No available neighbors, remove this head
                pathHeads.splice(headIndex, 1);
            }
            
            // If we have too many heads, remove some to prevent explosion
            if (pathHeads.length > size * 2) {
                pathHeads.splice(0, pathHeads.length - size * 2);
            }
        }
        
        // Ensure all cells are reachable (connect isolated regions)
        connectIsolatedRegions(walls, size, inNetwork);
    }
    
    // Create visually deceptive decoy paths
    // These paths must be STRAIGHTER and CLOSER to end than the solution
    // NOT calculated - must be visually more appealing
    function createVisualDecoyPaths(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        const endRow = size - 1;
        const endCol = size - 1;
        const numDecoys = 2 + Math.floor(Math.random() * 2); // 2-3 decoys
        
        // Find decision points near start (first 30% of maze)
        const startArea = Math.floor(size * 0.3);
        const decisionPoints = [];
        
        for (let row = 0; row <= startArea; row++) {
            for (let col = 0; col <= startArea; col++) {
                if (row === 0 && col === 0) continue;
                
                let openings = 0;
                const branches = [];
                
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                        branches.push([newRow, newCol]);
                    }
                }
                
                if (openings >= 2) { // Decision point
                    decisionPoints.push([row, col, branches]);
                }
            }
        }
        
        if (decisionPoints.length === 0) return;
        
        decisionPoints.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(numDecoys, decisionPoints.length); i++) {
            const [decRow, decCol, branches] = decisionPoints[i];
            
            // Find a branch that can become a visually deceptive decoy
            for (const [branchRow, branchCol] of branches) {
                // Check if this branch can be extended toward end in a straight line
                const currentDist = euclideanDistance(branchRow, branchCol, endRow, endCol);
                const startDist = euclideanDistance(decRow, decCol, endRow, endCol);
                
                // This branch should be visually closer to end
                if (currentDist < startDist) {
                    // Create a straight path toward end (visually deceptive)
                    let currentRow = branchRow;
                    let currentCol = branchCol;
                    const targetLength = Math.floor(size * 0.5); // Decoy should be substantial
                    const visited = Array(size).fill(null).map(() => Array(size).fill(false));
                    visited[decRow][decCol] = true;
                    visited[branchRow][branchCol] = true;
                    
                    for (let step = 0; step < targetLength; step++) {
                        // Find direction that gets closest to end (visually)
                        let bestDir = null;
                        let bestDist = Infinity;
                        
                        for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                            const nextRow = currentRow + dr;
                            const nextCol = currentCol + dc;
                            
                            if (nextRow >= 0 && nextRow < size && 
                                nextCol >= 0 && nextCol < size &&
                                !visited[nextRow][nextCol] &&
                                walls[currentRow][currentCol][wallKey]) {
                                
                                const dist = euclideanDistance(nextRow, nextCol, endRow, endCol);
                                
                                if (dist < bestDist) {
                                    bestDist = dist;
                                    bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                }
                            }
                        }
                        
                        if (bestDir) {
                            const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                            walls[currentRow][currentCol][wallKey] = false;
                            walls[nextRow][nextCol][oppositeWallKey] = false;
                            visited[nextRow][nextCol] = true;
                            currentRow = nextRow;
                            currentCol = nextCol;
                            
                            // If we're very close to end, create dead end (strong decoy)
                            if (bestDist <= 3 && Math.random() < 0.6) {
                                break; // Create dead end near end
                            }
                        } else {
                            break;
                        }
                    }
                    break; // One decoy per decision point
                }
            }
        }
    }
    
    // Create long false paths: choice → long travel → failure
    // These paths go far before revealing they're wrong
    function createLongFalsePaths(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        const endRow = size - 1;
        const endCol = size - 1;
        const numFalsePaths = 2 + Math.floor(Math.random() * 2); // 2-3 false paths
        const minFalsePathLength = Math.floor(size * 0.5); // At least 50% of size
        
        // Find decision points in first 40% of maze
        const startArea = Math.floor(size * 0.4);
        const decisionPoints = [];
        
        for (let row = 0; row <= startArea; row++) {
            for (let col = 0; col <= startArea; col++) {
                if (row === 0 && col === 0) continue;
                
                let openings = 0;
                const branches = [];
                
                for (const [dr, dc, wallKey] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !walls[row][col][wallKey]) {
                        openings++;
                        branches.push([newRow, newCol]);
                    }
                }
                
                if (openings >= 2) {
                    decisionPoints.push([row, col, branches]);
                }
            }
        }
        
        if (decisionPoints.length === 0) return;
        
        decisionPoints.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(numFalsePaths, decisionPoints.length); i++) {
            const [decRow, decCol, branches] = decisionPoints[i];
            
            if (branches.length === 0) continue;
            
            // Select a random branch
            const [branchRow, branchCol] = branches[Math.floor(Math.random() * branches.length)];
            
            // Create a long path that goes far before failing
            let currentRow = branchRow;
            let currentCol = branchCol;
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[decRow][decCol] = true;
            visited[branchRow][branchCol] = true;
            
            // Travel long distance (away from end to create false sense of progress)
            for (let step = 0; step < minFalsePathLength; step++) {
                const available = [];
                
                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                    const nextRow = currentRow + dr;
                    const nextCol = currentCol + dc;
                    
                    if (nextRow >= 0 && nextRow < size && 
                        nextCol >= 0 && nextCol < size &&
                        !visited[nextRow][nextCol] &&
                        walls[currentRow][currentCol][wallKey]) {
                        
                        // Prefer directions that don't immediately go to end
                        // Create a path that feels like progress but isn't
                        const distToEnd = euclideanDistance(nextRow, nextCol, endRow, endCol);
                        available.push([nextRow, nextCol, wallKey, oppositeWallKey, distToEnd]);
                    }
                }
                
                if (available.length > 0) {
                    // Sort by distance to end (prefer medium distance - not too close, not too far)
                    available.sort((a, b) => {
                        const midDist = size * 0.5;
                        const aScore = Math.abs(a[4] - midDist);
                        const bScore = Math.abs(b[4] - midDist);
                        return aScore - bScore; // Prefer medium distance
                    });
                    
                    const [nextRow, nextCol, wallKey, oppositeWallKey] = available[0];
                    walls[currentRow][currentCol][wallKey] = false;
                    walls[nextRow][nextCol][oppositeWallKey] = false;
                    visited[nextRow][nextCol] = true;
                    currentRow = nextRow;
                    currentCol = nextCol;
                } else {
                    break;
                }
            }
            
            // Create dead end (failure point)
            // The path has traveled far, now it fails
        }
    }
    
    // Connect isolated regions to the main network
    function connectIsolatedRegions(walls, size, inNetwork) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find isolated cells
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (!inNetwork[row][col]) {
                    // Find nearest network cell
                    let nearestNetwork = null;
                    let minDist = Infinity;
                    
                    for (let r = 0; r < size; r++) {
                        for (let c = 0; c < size; c++) {
                            if (inNetwork[r][c]) {
                                const dist = Math.abs(row - r) + Math.abs(col - c);
                                if (dist < minDist && dist <= 3) {
                                    minDist = dist;
                                    nearestNetwork = [r, c];
                                }
                            }
                        }
                    }
                    
                    if (nearestNetwork) {
                        // Create path to nearest network cell
                        let currentRow = row;
                        let currentCol = col;
                        const targetRow = nearestNetwork[0];
                        const targetCol = nearestNetwork[1];
                        
                        while ((currentRow !== targetRow || currentCol !== targetCol) && 
                               Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol) <= 3) {
                            let bestDir = null;
                            let bestDist = Infinity;
                            
                            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                                const nextRow = currentRow + dr;
                                const nextCol = currentCol + dc;
                                
                                if (nextRow >= 0 && nextRow < size && 
                                    nextCol >= 0 && nextCol < size &&
                                    walls[currentRow][currentCol][wallKey]) {
                                    
                                    const dist = Math.abs(nextRow - targetRow) + 
                                                 Math.abs(nextCol - targetCol);
                                    
                                    if (dist < bestDist) {
                                        bestDist = dist;
                                        bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                    }
                                }
                            }
                            
                            if (bestDir) {
                                const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                                walls[currentRow][currentCol][wallKey] = false;
                                walls[nextRow][nextCol][oppositeWallKey] = false;
                                inNetwork[nextRow][nextCol] = true;
                                currentRow = nextRow;
                                currentCol = nextCol;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Add loops connecting different regions (not around mainPath)
    // Creates "choice → long travel → result confirmation" structure
    function addRegionConnectingLoops(walls, size) {
        // Divide maze into regions (e.g., quadrants or sections)
        const numRegions = 4;
        const regionSize = Math.floor(size / 2);
        const regions = [
            { minRow: 0, maxRow: regionSize, minCol: 0, maxCol: regionSize }, // Top-left
            { minRow: 0, maxRow: regionSize, minCol: regionSize, maxCol: size - 1 }, // Top-right
            { minRow: regionSize, maxRow: size - 1, minCol: 0, maxCol: regionSize }, // Bottom-left
            { minRow: regionSize, maxRow: size - 1, minCol: regionSize, maxCol: size - 1 } // Bottom-right
        ];
        
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find cells in each region that are on paths
        const regionCells = Array(numRegions).fill(null).map(() => []);
        
        for (let regionIdx = 0; regionIdx < numRegions; regionIdx++) {
            const region = regions[regionIdx];
            
            for (let row = region.minRow; row <= region.maxRow; row++) {
                for (let col = region.minCol; col <= region.maxCol; col++) {
                    // Check if cell is on a path (has at least one open wall)
                    let openWalls = 0;
                    if (!walls[row][col].top) openWalls++;
                    if (!walls[row][col].right) openWalls++;
                    if (!walls[row][col].bottom) openWalls++;
                    if (!walls[row][col].left) openWalls++;
                    
                    if (openWalls > 0) {
                        regionCells[regionIdx].push([row, col]);
                    }
                }
            }
        }
        
        // Create loops between different regions
        const numLoops = 3 + Math.floor(Math.random() * 3); // 3-5 loops
        
        for (let loopIdx = 0; loopIdx < numLoops; loopIdx++) {
            // Select two different regions
            const region1Idx = Math.floor(Math.random() * numRegions);
            let region2Idx = Math.floor(Math.random() * numRegions);
            while (region2Idx === region1Idx) {
                region2Idx = Math.floor(Math.random() * numRegions);
            }
            
            const region1Cells = regionCells[region1Idx];
            const region2Cells = regionCells[region2Idx];
            
            if (region1Cells.length === 0 || region2Cells.length === 0) continue;
            
            // Select random cells from each region
            const cell1 = region1Cells[Math.floor(Math.random() * region1Cells.length)];
            const cell2 = region2Cells[Math.floor(Math.random() * region2Cells.length)];
            
            const [row1, col1] = cell1;
            const [row2, col2] = cell2;
            
            // Create a path connecting these two regions
            // Use greedy path finding
            let currentRow = row1;
            let currentCol = col1;
            const targetRow = row2;
            const targetCol = col2;
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[row1][col1] = true;
            
            let pathLength = 0;
            const maxPathLength = size * 1.5; // Allow longer paths
            
            while (pathLength < maxPathLength && 
                   (currentRow !== targetRow || currentCol !== targetCol)) {
                // Find best direction toward target
                let bestDir = null;
                let bestDist = Infinity;
                
                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                    const nextRow = currentRow + dr;
                    const nextCol = currentCol + dc;
                    
                    if (nextRow >= 0 && nextRow < size && 
                        nextCol >= 0 && nextCol < size &&
                        walls[currentRow][currentCol][wallKey] && // Wall exists
                        !visited[nextRow][nextCol]) {
                        
                        const dist = Math.abs(nextRow - targetRow) + 
                                     Math.abs(nextCol - targetCol);
                        
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                        }
                    }
                }
                
                if (bestDir) {
                    const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                    walls[currentRow][currentCol][wallKey] = false;
                    walls[nextRow][nextCol][oppositeWallKey] = false;
                    visited[nextRow][nextCol] = true;
                    currentRow = nextRow;
                    currentCol = nextCol;
                    pathLength++;
                } else {
                    break; // Can't extend further
                }
            }
        }
    }
    
    // Add decision points (junctions and loops) to create more interesting choices
    function addDecisionPoints(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find cells that could become decision points (currently have 2 walls)
        const candidateCells = [];
        for (let row = 1; row < size - 1; row++) {
            for (let col = 1; col < size - 1; col++) {
                let wallCount = 0;
                if (walls[row][col].top) wallCount++;
                if (walls[row][col].right) wallCount++;
                if (walls[row][col].bottom) wallCount++;
                if (walls[row][col].left) wallCount++;
                
                // Cells with 2 walls can become junctions (3 openings)
                if (wallCount === 2) {
                    candidateCells.push([row, col]);
                }
            }
        }
        
        // Randomly select some candidates to become decision points
        const numDecisions = Math.min(Math.floor(size * 0.15), candidateCells.length);
        candidateCells.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numDecisions; i++) {
            const [row, col] = candidateCells[i];
            
            // Find a neighbor to connect (create a loop/junction)
            const neighbors = [];
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    walls[row][col][wallKey]) {
                    neighbors.push([newRow, newCol, wallKey, oppositeWallKey]);
                }
            }
            
            if (neighbors.length > 0) {
                // Connect to one neighbor to create a junction
                const [newRow, newCol, wallKey, oppositeWallKey] = 
                    neighbors[Math.floor(Math.random() * neighbors.length)];
                
                walls[row][col][wallKey] = false;
                walls[newRow][newCol][oppositeWallKey] = false;
            }
        }
    }
    
    // Add random branches without using mainPath
    // Creates additional paths and dead ends to increase complexity
    function addRandomBranches(walls, size) {
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find cells that are on paths (have at least one open wall)
        const pathCells = [];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let openWalls = 0;
                if (!walls[row][col].top) openWalls++;
                if (!walls[row][col].right) openWalls++;
                if (!walls[row][col].bottom) openWalls++;
                if (!walls[row][col].left) openWalls++;
                
                if (openWalls > 0) {
                    pathCells.push([row, col]);
                }
            }
        }
        
        // Add random branches from random path cells
        const numBranches = Math.floor(size * 0.3); // 30% of size
        pathCells.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(numBranches, pathCells.length); i++) {
            const [row, col] = pathCells[i];
            
            // Skip start and end cells
            if ((row === 0 && col === 0) || (row === size - 1 && col === size - 1)) {
                continue;
            }
            
            // Find available walls to open (create branch)
            const availableWalls = [];
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size &&
                    walls[row][col][wallKey]) {
                    availableWalls.push([newRow, newCol, wallKey, oppositeWallKey]);
                }
            }
            
            if (availableWalls.length > 0 && Math.random() < 0.4) { // 40% chance to add branch
                const [newRow, newCol, wallKey, oppositeWallKey] = 
                    availableWalls[Math.floor(Math.random() * availableWalls.length)];
                
                walls[row][col][wallKey] = false;
                walls[newRow][newCol][oppositeWallKey] = false;
                
                // Optionally extend the branch a bit (30% chance)
                if (Math.random() < 0.3) {
                    let currentRow = newRow;
                    let currentCol = newCol;
                    const branchLength = 2 + Math.floor(Math.random() * 3); // 2-4 cells
                    
                    for (let step = 0; step < branchLength; step++) {
                        const nextWalls = [];
                        for (const [dr, dc, nextWallKey, nextOppositeWallKey] of directions) {
                            const nextRow = currentRow + dr;
                            const nextCol = currentCol + dc;
                            
                            if (nextRow >= 0 && nextRow < size && 
                                nextCol >= 0 && nextCol < size &&
                                walls[currentRow][currentCol][nextWallKey]) {
                                nextWalls.push([nextRow, nextCol, nextWallKey, nextOppositeWallKey]);
                            }
                        }
                        
                        if (nextWalls.length > 0) {
                            const [nextRow, nextCol, nextWallKey, nextOppositeWallKey] = 
                                nextWalls[Math.floor(Math.random() * nextWalls.length)];
                            walls[currentRow][currentCol][nextWallKey] = false;
                            walls[nextRow][nextCol][nextOppositeWallKey] = false;
                            currentRow = nextRow;
                            currentCol = nextCol;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // OLD: Add decoy paths that visually appear closer to end or more direct than main path
    // Uses visual distance (Euclidean) and straightness, not DFS distance
    // DEPRECATED: This function uses mainPath and is no longer called
    function addVisualDecoys(walls, size) {
        const endRow = size - 1;
        const endCol = size - 1;
        
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find main path for comparison
        const mainPath = findSolution(walls, size);
        if (!mainPath || mainPath.length === 0) return;
        
        // Calculate main path characteristics
        const mainPathStraightness = calculateStraightness(mainPath);
        const mainPathVisualDist = calculateVisualDistance(mainPath, endRow, endCol);
        
        // Create 2-3 decoy paths
        const numDecoys = 2 + Math.floor(Math.random() * 2); // 2-3 decoys
        
        for (let decoyIdx = 0; decoyIdx < numDecoys; decoyIdx++) {
            // Start from a point that's not too close to start
            const startOffset = 3 + Math.floor(Math.random() * Math.floor(size * 0.3));
            let startPoint = null;
            
            // Find a good starting point (on existing path, not too close to start)
            for (let i = startOffset; i < mainPath.length - 5; i++) {
                const [row, col] = mainPath[i];
                // Check if we can branch from here
                for (const [dr, dc, wallKey] of directions) {
                    const branchRow = row + dr;
                    const branchCol = col + dc;
                    
                    if (branchRow >= 0 && branchRow < size && 
                        branchCol >= 0 && branchCol < size &&
                        walls[row][col][wallKey]) {
                        const oppositeWallKey = directions.find(d => d[0] === -dr && d[1] === -dc)[2];
                        startPoint = [row, col, branchRow, branchCol, wallKey, oppositeWallKey];
                        break;
                    }
                }
                if (startPoint) break;
            }
            
            if (!startPoint) continue;
            
            const [startRow, startCol, branchRow, branchCol, wallKey, oppositeWallKey] = startPoint;
            
            // Create branch
            walls[startRow][startCol][wallKey] = false;
            walls[branchRow][branchCol][oppositeWallKey] = false;
            
            // Build decoy path that is visually closer or more direct
            let currentRow = branchRow;
            let currentCol = branchCol;
            const decoyPath = [[startRow, startCol], [branchRow, branchCol]];
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[startRow][startCol] = true;
            visited[branchRow][branchCol] = true;
            
            // Extend decoy path toward end with visual/straightness optimization
            const targetLength = Math.floor(size * 0.6); // Decoy should be substantial
            let pathLength = 2;
            
            while (pathLength < targetLength) {
                const currentVisualDist = euclideanDistance(currentRow, currentCol, endRow, endCol);
                const currentStraightness = calculatePathStraightness(decoyPath);
                
                // Find best next step: prefer visually closer to end AND more straight
                const candidates = [];
                
                for (const [dr, dc, nextWallKey, nextOppositeWallKey] of directions) {
                    const nextRow = currentRow + dr;
                    const nextCol = currentCol + dc;
                    
                    if (nextRow >= 0 && nextRow < size && 
                        nextCol >= 0 && nextCol < size &&
                        !visited[nextRow][nextCol] &&
                        walls[currentRow][currentCol][nextWallKey]) {
                        
                        const nextVisualDist = euclideanDistance(nextRow, nextCol, endRow, endCol);
                        const testPath = [...decoyPath, [nextRow, nextCol]];
                        const nextStraightness = calculatePathStraightness(testPath);
                        
                        // Score: lower visual distance is better, higher straightness is better
                        const distImprovement = currentVisualDist - nextVisualDist;
                        const straightnessImprovement = nextStraightness - currentStraightness;
                        
                        // Prefer moves that get visually closer AND maintain/improve straightness
                        const score = distImprovement * 2 + straightnessImprovement * 3;
                        
                        candidates.push([nextRow, nextCol, nextWallKey, nextOppositeWallKey, 
                                       nextVisualDist, nextStraightness, score]);
                    }
                }
                
                if (candidates.length === 0) break;
                
                // Sort by score (higher is better)
                candidates.sort((a, b) => b[6] - a[6]);
                
                // 70% chance to pick best, 30% chance to pick from top 3
                let chosen;
                if (Math.random() < 0.7) {
                    chosen = candidates[0];
                } else {
                    const top3 = candidates.slice(0, Math.min(3, candidates.length));
                    chosen = top3[Math.floor(Math.random() * top3.length)];
                }
                
                const [nextRow, nextCol, nextWallKey, nextOppositeWallKey] = chosen;
                
                // Remove wall
                walls[currentRow][currentCol][nextWallKey] = false;
                walls[nextRow][nextCol][nextOppositeWallKey] = false;
                
                decoyPath.push([nextRow, nextCol]);
                visited[nextRow][nextCol] = true;
                currentRow = nextRow;
                currentCol = nextCol;
                pathLength++;
                
                // Check if we're visually close to end (within 3 cells Euclidean distance)
                const distToEnd = euclideanDistance(currentRow, currentCol, endRow, endCol);
                if (distToEnd <= 3) {
                    // 50% chance to block (strong decoy), 50% to reconnect
                    if (Math.random() < 0.5) {
                        // Block - create dead end
                        break;
                    } else {
                        // Reconnect to create loop (find nearest path cell)
                        let nearestPath = null;
                        let minDist = Infinity;
                        
                        // Check all cells in network
                        for (let r = 0; r < size; r++) {
                            for (let c = 0; c < size; c++) {
                                if (visited[r][c] && (r !== currentRow || c !== currentCol)) {
                                    const dist = euclideanDistance(currentRow, currentCol, r, c);
                                    if (dist < minDist && dist >= 2 && dist <= 4) {
                                        minDist = dist;
                                        nearestPath = [r, c];
                                    }
                                }
                            }
                        }
                        
                        if (nearestPath) {
                            // Create connection
                            let reconnectRow = currentRow;
                            let reconnectCol = currentCol;
                            const targetRow = nearestPath[0];
                            const targetCol = nearestPath[1];
                            
                            let reconnectSteps = 0;
                            while (reconnectSteps < 4 && 
                                   (reconnectRow !== targetRow || reconnectCol !== targetCol)) {
                                let bestDir = null;
                                let bestDist = Infinity;
                                
                                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                                    const nextRow = reconnectRow + dr;
                                    const nextCol = reconnectCol + dc;
                                    
                                    if (nextRow >= 0 && nextRow < size && 
                                        nextCol >= 0 && nextCol < size &&
                                        walls[reconnectRow][reconnectCol][wallKey]) {
                                        
                                        const dist = euclideanDistance(nextRow, nextCol, targetRow, targetCol);
                                        if (dist < bestDist) {
                                            bestDist = dist;
                                            bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                        }
                                    }
                                }
                                
                                if (bestDir) {
                                    const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                                    walls[reconnectRow][reconnectCol][wallKey] = false;
                                    walls[nextRow][nextCol][oppositeWallKey] = false;
                                    reconnectRow = nextRow;
                                    reconnectCol = nextCol;
                                    reconnectSteps++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    
    // Calculate Euclidean distance (visual distance)
    function euclideanDistance(row1, col1, row2, col2) {
        const dr = row2 - row1;
        const dc = col2 - col1;
        return Math.sqrt(dr * dr + dc * dc);
    }
    
    // Calculate path straightness (how direct the path is)
    // Returns value between 0 (very zigzag) and 1 (perfectly straight)
    function calculateStraightness(path) {
        if (path.length < 2) return 0;
        
        const start = path[0];
        const end = path[path.length - 1];
        const directDistance = euclideanDistance(start[0], start[1], end[0], end[1]);
        const pathLength = path.length - 1; // Number of steps
        
        if (pathLength === 0) return 1;
        
        // Straightness = direct distance / path length
        // Closer to 1 means more straight
        return directDistance / pathLength;
    }
    
    // Calculate straightness for a path (helper for incremental calculation)
    function calculatePathStraightness(path) {
        return calculateStraightness(path);
    }
    
    // Calculate average visual distance of path from end
    function calculateVisualDistance(path, endRow, endCol) {
        if (path.length === 0) return Infinity;
        
        let totalDist = 0;
        for (const [row, col] of path) {
            totalDist += euclideanDistance(row, col, endRow, endCol);
        }
        return totalDist / path.length;
    }
    
    // Ensure wall symmetry between adjacent cells
    // Walls must always be symmetric: cell.top == neighbor.bottom, etc.
    // This function does NOT delete walls, only fixes symmetry
    function ensureWallsConnected(walls, size) {
        // Fix wall symmetry - ensure both sides of a wall match
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = walls[row][col];
                
                // Check top wall symmetry
                if (row > 0) {
                    const neighbor = walls[row - 1][col];
                    // If one side has wall, the other must too
                    if (cell.top && !neighbor.bottom) {
                        neighbor.bottom = true; // Fix symmetry by adding neighbor's wall
                    } else if (!cell.top && neighbor.bottom) {
                        neighbor.bottom = false; // Fix symmetry by removing neighbor's wall
                    }
                }
                
                // Check left wall symmetry
                if (col > 0) {
                    const neighbor = walls[row][col - 1];
                    // If one side has wall, the other must too
                    if (cell.left && !neighbor.right) {
                        neighbor.right = true; // Fix symmetry by adding neighbor's wall
                    } else if (!cell.left && neighbor.right) {
                        neighbor.right = false; // Fix symmetry by removing neighbor's wall
                    }
                }
                
                // Check bottom wall symmetry
                if (row < size - 1) {
                    const neighbor = walls[row + 1][col];
                    // If one side has wall, the other must too
                    if (cell.bottom && !neighbor.top) {
                        neighbor.top = true; // Fix symmetry by adding neighbor's wall
                    } else if (!cell.bottom && neighbor.top) {
                        neighbor.top = false; // Fix symmetry by removing neighbor's wall
                    }
                }
                
                // Check right wall symmetry
                if (col < size - 1) {
                    const neighbor = walls[row][col + 1];
                    // If one side has wall, the other must too
                    if (cell.right && !neighbor.left) {
                        neighbor.left = true; // Fix symmetry by adding neighbor's wall
                    } else if (!cell.right && neighbor.left) {
                        neighbor.left = false; // Fix symmetry by removing neighbor's wall
                    }
                }
            }
        }
    }
    
    // Inject loops to create alternative paths with deep loops (6-10 cells)
    // Loops must start 2-4 cells away from main path and travel 6-10 cells before rejoining
    function injectLoops(walls, size) {
        const mainPath = findSolution(walls, size);
        if (!mainPath || mainPath.length === 0) return;
        
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        // Determine number of loops based on difficulty (size)
        let targetLoops;
        if (size <= 10) {
            targetLoops = 2 + Math.floor(Math.random() * 2); // 2-3 for easy
        } else if (size <= 15) {
            targetLoops = 4 + Math.floor(Math.random() * 3); // 4-6 for medium
        } else {
            targetLoops = 7 + Math.floor(Math.random() * 4); // 7-10 for hard
        }
        
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Find loop start points: 2-4 cells away from main path
        const loopStarts = [];
        for (let i = 5; i < mainPath.length - 5; i++) {
            const [mpRow, mpCol] = mainPath[i];
            
            // Find cells 2-4 cells away from this main path point
            for (let dr = -4; dr <= 4; dr++) {
                for (let dc = -4; dc <= 4; dc++) {
                    const dist = Math.abs(dr) + Math.abs(dc);
                    if (dist >= 2 && dist <= 4) {
                        const startRow = mpRow + dr;
                        const startCol = mpCol + dc;
                        
                        if (startRow >= 0 && startRow < size && 
                            startCol >= 0 && startCol < size &&
                            !isOnMainPath[startRow][startCol] &&
                            walls[startRow][startCol]) {
                            loopStarts.push([startRow, startCol, mpRow, mpCol]);
                        }
                    }
                }
            }
        }
        
        // Shuffle and select loop starts
        loopStarts.sort(() => Math.random() - 0.5);
        
        let loopsCreated = 0;
        for (const [startRow, startCol, targetRow, targetCol] of loopStarts) {
            if (loopsCreated >= targetLoops) break;
            
            // Create a loop path: travel 6-10 cells before rejoining main path
            const loopLength = 6 + Math.floor(Math.random() * 5); // 6-10 cells
            let currentRow = startRow;
            let currentCol = startCol;
            const visited = Array(size).fill(null).map(() => Array(size).fill(false));
            visited[startRow][startCol] = true;
            
            // Build loop path toward target (main path point)
            for (let step = 0; step < loopLength; step++) {
                const available = [];
                
                for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                    const newRow = currentRow + dr;
                    const newCol = currentCol + dc;
                    
                    if (newRow >= 0 && newRow < size && 
                        newCol >= 0 && newCol < size &&
                        !visited[newRow][newCol] &&
                        walls[currentRow][currentCol][wallKey]) {
                        
                        const distToTarget = Math.abs(newRow - targetRow) + Math.abs(newCol - targetCol);
                        available.push([newRow, newCol, wallKey, oppositeWallKey, distToTarget]);
                    }
                }
                
                if (available.length > 0) {
                    // Prefer direction toward target, but allow some randomness
                    available.sort((a, b) => {
                        if (Math.abs(a[4] - b[4]) <= 2) {
                            return Math.random() - 0.5; // Random if similar distance
                        }
                        return a[4] - b[4]; // Prefer closer to target
                    });
                    
                    const [nextRow, nextCol, wallKey, oppositeWallKey] = available[0];
                    walls[currentRow][currentCol][wallKey] = false;
                    walls[nextRow][nextCol][oppositeWallKey] = false;
                    visited[nextRow][nextCol] = true;
                    
                    currentRow = nextRow;
                    currentCol = nextCol;
                } else {
                    break; // Can't extend further
                }
            }
            
            // Rejoin to main path (connect current position to nearest main path cell)
            let nearestMainPath = null;
            let minDist = Infinity;
            
            for (const [mpRow, mpCol] of mainPath) {
                const dist = Math.abs(currentRow - mpRow) + Math.abs(currentCol - mpCol);
                if (dist < minDist && dist <= 3) {
                    minDist = dist;
                    nearestMainPath = [mpRow, mpCol];
                }
            }
            
            if (nearestMainPath) {
                // Create path to rejoin
                let reconnectRow = currentRow;
                let reconnectCol = currentCol;
                const targetReconnectRow = nearestMainPath[0];
                const targetReconnectCol = nearestMainPath[1];
                
                while ((reconnectRow !== targetReconnectRow || reconnectCol !== targetReconnectCol) && 
                       Math.abs(reconnectRow - targetReconnectRow) + Math.abs(reconnectCol - targetReconnectCol) <= 3) {
                    let bestDir = null;
                    let bestDist = Infinity;
                    
                    for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                        const nextRow = reconnectRow + dr;
                        const nextCol = reconnectCol + dc;
                        
                        if (nextRow >= 0 && nextRow < size && 
                            nextCol >= 0 && nextCol < size &&
                            walls[reconnectRow][reconnectCol][wallKey]) {
                            
                            const dist = Math.abs(nextRow - targetReconnectRow) + 
                                         Math.abs(nextCol - targetReconnectCol);
                            
                            if (dist < bestDist) {
                                bestDist = dist;
                                bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                            }
                        }
                    }
                    
                    if (bestDir) {
                        const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                        walls[reconnectRow][reconnectCol][wallKey] = false;
                        walls[nextRow][nextCol][oppositeWallKey] = false;
                        reconnectRow = nextRow;
                        reconnectCol = nextCol;
                    } else {
                        break;
                    }
                }
            }
            
            loopsCreated++;
        }
    }
    
    // Create decoy paths that approach near the end
    function createDecoyPaths(walls, size) {
        const mainPath = findSolution(walls, size);
        if (!mainPath || mainPath.length === 0) return;
        
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        // Select 2-4 random points from main path (not too close to start/end)
        const decoyCount = 2 + Math.floor(Math.random() * 3); // 2-4 decoys
        const candidates = mainPath.slice(Math.floor(mainPath.length * 0.2), 
                                          Math.floor(mainPath.length * 0.8));
        
        if (candidates.length < decoyCount) return;
        
        const selectedPoints = [];
        const selectedIndices = new Set();
        while (selectedPoints.length < decoyCount && selectedIndices.size < candidates.length) {
            const idx = Math.floor(Math.random() * candidates.length);
            if (!selectedIndices.has(idx)) {
                selectedIndices.add(idx);
                selectedPoints.push(candidates[idx]);
            }
        }
        
        // End position
        const endRow = size - 1;
        const endCol = size - 1;
        const nearEndDistance = 2; // Manhattan distance <= 2 (must reach very close to end)
        
        for (const [startRow, startCol] of selectedPoints) {
            // Find direction not on main path
            const possibleBranches = [];
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const branchRow = startRow + dr;
                const branchCol = startCol + dc;
                
                if (branchRow >= 0 && branchRow < size && 
                    branchCol >= 0 && branchCol < size &&
                    !isOnMainPath[branchRow][branchCol] &&
                    walls[startRow][startCol][wallKey]) {
                    possibleBranches.push([branchRow, branchCol, wallKey, oppositeWallKey]);
                }
            }
            
            if (possibleBranches.length > 0) {
                const [branchRow, branchCol, wallKey, oppositeWallKey] = 
                    possibleBranches[Math.floor(Math.random() * possibleBranches.length)];
                
                // Create branch
                walls[startRow][startCol][wallKey] = false;
                walls[branchRow][branchCol][oppositeWallKey] = false;
                
                // Extend decoy path toward end
                let currentRow = branchRow;
                let currentCol = branchCol;
                const minLength = Math.floor(size * 0.4); // At least 40% of size
                let pathLength = 0;
                let reachedNearEnd = false;
                
                // Track visited to avoid loops in decoy path itself
                const decoyVisited = Array(size).fill(null).map(() => Array(size).fill(false));
                decoyVisited[startRow][startCol] = true;
                decoyVisited[branchRow][branchCol] = true;
                
                // CRITICAL: Decoy must reach within Manhattan distance 2 of end
                while (pathLength < minLength || !reachedNearEnd) {
                    // Check if we're near end (Manhattan ≤ 2)
                    const manhattanDist = Math.abs(currentRow - endRow) + Math.abs(currentCol - endCol);
                    if (manhattanDist <= 2) {
                        reachedNearEnd = true;
                        
                        // 50% chance to block (strong decoy) or reconnect to main path (loop)
                        if (Math.random() < 0.5) {
                            // Block - create dead end near end (within 2 cells)
                            break;
                        } else {
                            // Reconnect to main path from different direction (create loop)
                            // Find nearest main path cell within distance 2-5, but in different direction
                            let nearestMainPath = null;
                            let minDist = Infinity;
                            
                            for (const [mpRow, mpCol] of mainPath) {
                                const dist = Math.abs(currentRow - mpRow) + Math.abs(currentCol - mpCol);
                                // Ensure it's in a different direction (not just nearby)
                                const directionDiff = Math.abs((currentRow - mpRow) - (currentCol - mpCol));
                                if (dist < minDist && dist >= 2 && dist <= 5 && directionDiff >= 2) {
                                    minDist = dist;
                                    nearestMainPath = [mpRow, mpCol];
                                }
                            }
                            
                            if (nearestMainPath) {
                                // Actually create a path to reconnect (greedy path)
                                let reconnectRow = currentRow;
                                let reconnectCol = currentCol;
                                const targetRow = nearestMainPath[0];
                                const targetCol = nearestMainPath[1];
                                
                                // Greedy path: move toward target, removing walls
                                const reconnectDirections = [
                                    [-1, 0, 'top', 'bottom'],    // up
                                    [0, 1, 'right', 'left'],     // right
                                    [1, 0, 'bottom', 'top'],     // down
                                    [0, -1, 'left', 'right']     // left
                                ];
                                
                                let reconnectSteps = 0;
                                const maxReconnectSteps = 5; // Limit reconnection path length
                                
                                while (reconnectSteps < maxReconnectSteps && 
                                       (reconnectRow !== targetRow || reconnectCol !== targetCol)) {
                                    // Find best direction toward target
                                    let bestDir = null;
                                    let bestDist = Infinity;
                                    
                                    for (const [dr, dc, wallKey, oppositeWallKey] of reconnectDirections) {
                                        const nextRow = reconnectRow + dr;
                                        const nextCol = reconnectCol + dc;
                                        
                                        if (nextRow >= 0 && nextRow < size && 
                                            nextCol >= 0 && nextCol < size &&
                                            walls[reconnectRow][reconnectCol][wallKey]) { // Wall exists
                                            
                                            const distToTarget = Math.abs(nextRow - targetRow) + 
                                                                 Math.abs(nextCol - targetCol);
                                            
                                            if (distToTarget < bestDist) {
                                                bestDist = distToTarget;
                                                bestDir = [nextRow, nextCol, wallKey, oppositeWallKey];
                                            }
                                        }
                                    }
                                    
                                    if (bestDir) {
                                        const [nextRow, nextCol, wallKey, oppositeWallKey] = bestDir;
                                        // Remove wall to create connection
                                        walls[reconnectRow][reconnectCol][wallKey] = false;
                                        walls[nextRow][nextCol][oppositeWallKey] = false;
                                        
                                        reconnectRow = nextRow;
                                        reconnectCol = nextCol;
                                        reconnectSteps++;
                                    } else {
                                        break; // Can't extend further
                                    }
                                }
                                
                                // Reconnection complete (or attempted)
                                break;
                            } else {
                                // No suitable reconnection point, just block
                                break;
                            }
                        }
                    }
                    
                    // Continue extending toward end
                    const available = [];
                    for (const [dr, dc, nextWallKey, nextOppositeWallKey] of directions) {
                        const nextRow = currentRow + dr;
                        const nextCol = currentCol + dc;
                        
                        if (nextRow >= 0 && nextRow < size && 
                            nextCol >= 0 && nextCol < size &&
                            !decoyVisited[nextRow][nextCol] &&
                            walls[currentRow][currentCol][nextWallKey]) {
                            
                            // Prefer direction toward end
                            const currentDist = Math.abs(currentRow - endRow) + Math.abs(currentCol - endCol);
                            const nextDist = Math.abs(nextRow - endRow) + Math.abs(nextCol - endCol);
                            
                            if (nextDist <= currentDist || Math.random() < 0.3) {
                                available.push([nextRow, nextCol, nextWallKey, nextOppositeWallKey, nextDist]);
                            }
                        }
                    }
                    
                    if (available.length > 0) {
                        // Sort by distance to end (prefer closer)
                        available.sort((a, b) => a[4] - b[4]);
                        const [nextRow, nextCol, nextWallKey, nextOppositeWallKey] = available[0];
                        
                        walls[currentRow][currentCol][nextWallKey] = false;
                        walls[nextRow][nextCol][nextOppositeWallKey] = false;
                        decoyVisited[nextRow][nextCol] = true;
                        
                        currentRow = nextRow;
                        currentCol = nextCol;
                        pathLength++;
                    } else {
                        break; // Can't extend further
                    }
                }
            }
        }
    }
    
    // Allow limited loops (2-4) instead of forcing unique solution
    // This preserves maze variety while maintaining puzzle quality
    function allowLimitedLoops(walls, size) {
        // Find the main solution path
        const mainPath = findSolution(walls, size);
        if (!mainPath || mainPath.length === 0) {
            return; // No solution found, skip
        }
        
        // Count current number of alternative paths (loops)
        const alternativePathCount = countAlternativePaths(walls, size, mainPath);
        
        // Allow 2-4 loops, but if there are too many (>6), block some
        // This is much more lenient than ensureUniqueSolution which blocks all
        if (alternativePathCount > 6) {
            // Only block excess loops (keep 2-4)
            const targetLoops = 2 + Math.floor(Math.random() * 3); // 2-4 loops
            const toBlock = alternativePathCount - targetLoops;
            
            blockExcessLoops(walls, size, mainPath, toBlock);
        }
        // If alternativePathCount <= 6, allow it (preserves variety)
    }
    
    // Count number of alternative paths from start to end
    function countAlternativePaths(walls, size, mainPath) {
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        // Use DFS to find all paths from start to end
        const pathCount = { count: 0 };
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        
        function dfsPathCount(row, col, usedNonMainPath) {
            if (row === size - 1 && col === size - 1) {
                if (usedNonMainPath) {
                    pathCount.count++;
                }
                return;
            }
            
            visited[row][col] = true;
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) {
                    
                    const newUsedNonMainPath = usedNonMainPath || !isOnMainPath[newRow][newCol];
                    dfsPathCount(newRow, newCol, newUsedNonMainPath);
                }
            }
            
            visited[row][col] = false;
        }
        
        dfsPathCount(0, 0, false);
        return pathCount.count;
    }
    
    // Block excess loops (only if too many)
    function blockExcessLoops(walls, size, mainPath, toBlock) {
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        const directions = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];
        
        let blocked = 0;
        const maxAttempts = toBlock * 5;
        let attempts = 0;
        
        while (blocked < toBlock && attempts < maxAttempts) {
            attempts++;
            
            // Randomly select a cell on main path
            if (mainPath.length < 3) break;
            const randomIndex = 1 + Math.floor(Math.random() * (mainPath.length - 2));
            const [row, col] = mainPath[randomIndex];
            
            // Check all directions from this main path cell
            for (const [dr, dc, wallKey, oppositeWallKey] of directions) {
                const branchRow = row + dr;
                const branchCol = col + dc;
                
                if (branchRow >= 0 && branchRow < size && 
                    branchCol >= 0 && branchCol < size &&
                    !isOnMainPath[branchRow][branchCol] &&
                    !walls[row][col][wallKey]) { // Path exists
                    
                    // Check if this branch can reach the end
                    if (canReachEndWithoutMainPath(walls, size, branchRow, branchCol, isOnMainPath)) {
                        // Block this alternative path
                        walls[row][col][wallKey] = true;
                        walls[branchRow][branchCol][oppositeWallKey] = true;
                        blocked++;
                        
                        // Recalculate main path
                        const newMainPath = findSolution(walls, size);
                        if (!newMainPath || newMainPath.length === 0) {
                            // Blocking broke the solution, revert
                            walls[row][col][wallKey] = false;
                            walls[branchRow][branchCol][oppositeWallKey] = false;
                            blocked--;
                            break;
                        }
                        
                        // Update isOnMainPath
                        for (let r = 0; r < size; r++) {
                            for (let c = 0; c < size; c++) {
                                isOnMainPath[r][c] = false;
                            }
                        }
                        for (const [r, c] of newMainPath) {
                            isOnMainPath[r][c] = true;
                        }
                        
                        break;
                    }
                }
            }
        }
    }
    
    // Check if a cell can reach the end without going through main path cells
    function canReachEndWithoutMainPath(walls, size, startRow, startCol, isOnMainPath) {
        const directions = [
            [-1, 0, 'top'],    // up
            [0, 1, 'right'],   // right
            [1, 0, 'bottom'],  // down
            [0, -1, 'left']    // left
        ];
        
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        const queue = [[startRow, startCol]];
        visited[startRow][startCol] = true;
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            // If we reached the end, this is an alternative path!
            if (row === size - 1 && col === size - 1) {
                return true;
            }
            
            // Check all neighbors
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) { // No wall means path exists
                    
                    // Don't go through main path cells (except end)
                    // Allow going through end cell to detect alternative paths
                    if (!isOnMainPath[newRow][newCol] || (newRow === size - 1 && newCol === size - 1)) {
                        visited[newRow][newCol] = true;
                        queue.push([newRow, newCol]);
                    }
                }
            }
        }
        
        return false; // Cannot reach end
    }
    
    // Add strategic dead ends using random points instead of turn-based pattern
    // Uses carved state to prevent loops and reduce need for ensureUniqueSolution
    function addStrategicDeadEnds(walls, size) {
        // First, find the main solution path to avoid breaking it
        const mainPath = findSolution(walls, size);
        if (!mainPath || mainPath.length === 0) {
            return; // No solution found, skip
        }
        
        const isOnMainPath = Array(size).fill(null).map(() => Array(size).fill(false));
        for (const [row, col] of mainPath) {
            isOnMainPath[row][col] = true;
        }
        
        // Track which cells are already carved (part of existing paths)
        // This prevents branches from creating loops by connecting to existing paths
        const carved = Array(size).fill(null).map(() => Array(size).fill(false));
        
        // Mark all cells on main path and connected paths as carved
        const directions = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];
        
        // Mark all reachable cells from start as carved
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        const queue = [[0, 0]];
        visited[0][0] = true;
        carved[0][0] = true;
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !walls[row][col][wallKey]) { // No wall means path exists
                    visited[newRow][newCol] = true;
                    carved[newRow][newCol] = true;
                    queue.push([newRow, newCol]);
                }
            }
        }
        
        // Count walls helper
        function countWalls(cell) {
            let count = 0;
            if (cell.top) count++;
            if (cell.right) count++;
            if (cell.bottom) count++;
            if (cell.left) count++;
            return count;
        }
        
        // Select K random points from main path (K = size or size*1.2)
        const K = Math.floor(size * (1 + Math.random() * 0.2)); // size to size*1.2
        const branchPoints = [];
        
        // Get candidate points (skip first and last cell)
        const candidates = mainPath.slice(1, mainPath.length - 1);
        
        // Randomly select K points (or all if fewer)
        const selectedIndices = new Set();
        const numBranches = Math.min(K, candidates.length);
        
        while (selectedIndices.size < numBranches) {
            const idx = Math.floor(Math.random() * candidates.length);
            selectedIndices.add(idx);
        }
        
        for (const idx of selectedIndices) {
            branchPoints.push(candidates[idx]);
        }
        
        // Track branch lengths to prevent pattern repetition
        const usedLengths = [];
        
        // Create branches from random points
        for (const [row, col] of branchPoints) {
            const branchDirections = [
                [-1, 0, 'top', 'bottom'],
                [0, 1, 'right', 'left'],
                [1, 0, 'bottom', 'top'],
                [0, -1, 'left', 'right']
            ];
            
            const possibleBranches = [];
            
            for (const [dr, dc, wallKey, oppositeWallKey] of branchDirections) {
                const branchRow = row + dr;
                const branchCol = col + dc;
                
                // Check if this direction is valid and not on main path
                if (branchRow >= 0 && branchRow < size && 
                    branchCol >= 0 && branchCol < size &&
                    !isOnMainPath[branchRow][branchCol] &&
                    walls[row][col][wallKey] && // Wall exists to remove
                    !carved[branchRow][branchCol]) { // CRITICAL: Only extend into uncarved cells
                    
                    const neighborWalls = countWalls(walls[branchRow][branchCol]);
                    if (neighborWalls >= 3) {
                        possibleBranches.push([branchRow, branchCol, wallKey, oppositeWallKey]);
                    }
                }
            }
            
            if (possibleBranches.length > 0) {
                const [branchRow, branchCol, wallKey, oppositeWallKey] = 
                    possibleBranches[Math.floor(Math.random() * possibleBranches.length)];
                
                // Remove wall to create branch from main path
                walls[row][col][wallKey] = false;
                walls[branchRow][branchCol][oppositeWallKey] = false;
                carved[branchRow][branchCol] = true;
                
                // Extend the dead-end path with varied length (2-10 cells)
                // Avoid repeating same length pattern
                let deadEndLength;
                let attempts = 0;
                do {
                    deadEndLength = 2 + Math.floor(Math.random() * 9); // 2-10 cells
                    attempts++;
                } while (usedLengths.includes(deadEndLength) && attempts < 10);
                
                usedLengths.push(deadEndLength);
                if (usedLengths.length > 5) {
                    usedLengths.shift(); // Keep only recent 5 lengths
                }
                
                let currentRow = branchRow;
                let currentCol = branchCol;
                
                // Calculate distance from branch start to main path
                function distanceToMainPath(row, col) {
                    let minDist = Infinity;
                    for (const [mpRow, mpCol] of mainPath) {
                        const dist = Math.abs(row - mpRow) + Math.abs(col - mpCol);
                        if (dist < minDist) {
                            minDist = dist;
                        }
                    }
                    return minDist;
                }
                
                for (let step = 0; step < deadEndLength; step++) {
                    const availableDirections = [];
                    const availableReconnect = []; // For reconnection to carved cells
                    
                    for (const [dr, dc, nextWallKey, nextOppositeWallKey] of branchDirections) {
                        const nextRow = currentRow + dr;
                        const nextCol = currentCol + dc;
                        
                        if (nextRow >= 0 && nextRow < size && 
                            nextCol >= 0 && nextCol < size &&
                            !isOnMainPath[nextRow][nextCol] &&
                            walls[currentRow][currentCol][nextWallKey]) {
                            
                            const distToMain = distanceToMainPath(nextRow, nextCol);
                            
                            if (!carved[nextRow][nextCol]) {
                                // Uncarved cell - normal extension
                                const nextNeighborWalls = countWalls(walls[nextRow][nextCol]);
                                if (nextNeighborWalls >= 3) {
                                    availableDirections.push([nextRow, nextCol, nextWallKey, nextOppositeWallKey]);
                                }
                            } else {
                                // Carved cell - allow reconnection with 20-35% probability
                                // But only if distance from main path is 2-5 (not too close, not too far)
                                if (distToMain >= 2 && distToMain <= 5 && Math.random() < 0.3) {
                                    // 30% chance to reconnect to carved cell (creates loop)
                                    availableReconnect.push([nextRow, nextCol, nextWallKey, nextOppositeWallKey]);
                                }
                            }
                        }
                    }
                    
                    // Prefer reconnection (creates loops) but also allow normal extension
                    let chosen = null;
                    if (availableReconnect.length > 0 && Math.random() < 0.35) {
                        // 35% chance to use reconnection
                        chosen = availableReconnect[Math.floor(Math.random() * availableReconnect.length)];
                    } else if (availableDirections.length > 0) {
                        chosen = availableDirections[Math.floor(Math.random() * availableDirections.length)];
                    }
                    
                    if (chosen) {
                        const [nextRow, nextCol, nextWallKey, nextOppositeWallKey] = chosen;
                        walls[currentRow][currentCol][nextWallKey] = false;
                        walls[nextRow][nextCol][nextOppositeWallKey] = false;
                        carved[nextRow][nextCol] = true;
                        
                        currentRow = nextRow;
                        currentCol = nextCol;
                    } else {
                        break; // Can't extend further
                    }
                }
            }
        }
    }
    

    // Find solution path using weighted path selection (not just shortest)
    // Prefers paths with branches and backtracking for more interesting solutions
    // Find solution using BFS (single shortest path, not all paths)
    // This avoids exponential path explosion when loops exist
    // Returns the shortest path from start to end using BFS
    function findSolution(maze, size) {
        const directions = [
            [-1, 0, 'top'],    // up
            [0, 1, 'right'],   // right
            [1, 0, 'bottom'],  // down
            [0, -1, 'left']    // left
        ];
        
        // BFS to find shortest path from start to end
        const queue = [[0, 0, []]]; // [row, col, path]
        const visited = Array(size).fill(null).map(() => Array(size).fill(false));
        visited[0][0] = true;
        
        while (queue.length > 0) {
            const [row, col, path] = queue.shift();
            const newPath = [...path, [row, col]];
            
            // Check if reached end
            if (row === size - 1 && col === size - 1) {
                return newPath;
            }
            
            // Explore neighbors
            for (const [dr, dc, wallKey] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < size && 
                    newCol >= 0 && newCol < size && 
                    !visited[newRow][newCol] &&
                    !maze[row][col][wallKey]) {
                    visited[newRow][newCol] = true;
                    queue.push([newRow, newCol, newPath]);
                }
            }
        }
        
        return []; // No path found
    }

    // Update preview
    function updatePreview() {
        if (!currentMaze) {
            displayEmptyPreview();
            return;
        }

        const selectedDifficulty = difficultySelect.value;
        const size = mazeSizes[selectedDifficulty];
        const title = showTitle.checked ? worksheetTitle.value || 'Maze Puzzle' : '';
        
        let html = '<div class="worksheet-page">';
        
        // Student header
        html += '<div class="student-header">';
        html += '<div class="header-left">';
        html += '<div class="puzzle-header">';
        html += '<img src="images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">';
        html += '</div>';
        html += '</div>';
        html += '<div class="info-group">';
        html += '<div class="info-line">';
        html += '<label>Name:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '<div class="info-line">';
        html += '<label>Date:</label>';
        html += '<div class="input-field"></div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        if (title) {
            html += `<div class="puzzle-title">${title}</div>`;
        }

        html += '<div class="maze-container">';
        html += '<div class="maze-wrapper">';
        // Create SVG for line-based maze
        // Add small padding to viewBox to ensure borders are fully visible
        html += `<svg class="maze-svg" id="maze-svg" viewBox="-0.1 -0.1 ${size + 0.2} ${size + 0.2}" width="600" height="600" style="max-width: 100%; height: auto; aspect-ratio: 1;">`;
        
        // Calculate stroke width: approximately 2px at 500px SVG size
        // For proper line-based maze, use consistent stroke width
        const strokeWidth = (2 * size) / 500; // Scales with maze size
        
        // Draw outer border as 4 separate lines (to allow openings at start/end)
        const borderStrokeWidth = strokeWidth * 1.2; // Slightly thicker outer border
        
        // Top border (with opening at start if needed)
        const startCell = currentMaze[0][0];
        if (startCell.top) {
            // Draw full top border
            html += `<line x1="0" y1="0" x2="${size}" y2="0" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        } else {
            // Draw top border with opening at start (0,0) - one full cell opening
            html += `<line x1="1" y1="0" x2="${size}" y2="0" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        }
        
        // Bottom border (with opening at end if needed)
        const endCell = currentMaze[size - 1][size - 1];
        if (endCell.bottom) {
            // Draw full bottom border
            html += `<line x1="0" y1="${size}" x2="${size}" y2="${size}" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        } else {
            // Draw bottom border with opening at end - one full cell opening
            html += `<line x1="0" y1="${size}" x2="${size - 1}" y2="${size}" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        }
        
        // Left border (full) - connects from top to bottom
        html += `<line x1="0" y1="0" x2="0" y2="${size}" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        
        // Right border (full) - connects from top to bottom
        html += `<line x1="${size}" y1="0" x2="${size}" y2="${size}" stroke="#000" stroke-width="${borderStrokeWidth}" stroke-linecap="butt"/>`;
        
        // Draw internal walls
        // Strategy: Draw each wall segment exactly once
        // - Each cell's top and left walls are drawn (if they exist)
        // - This ensures each internal boundary is drawn exactly once
        // - Last row's bottom walls and last column's right walls are handled separately
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const walls = currentMaze[row][col];
                
                // Draw top wall (horizontal line spanning full cell width)
                // Only draw internal top walls (row > 0), outer border already drawn
                if (walls.top && row > 0) {
                    html += `<line x1="${col}" y1="${row}" x2="${col + 1}" y2="${row}" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
                }
                
                // Draw left wall (vertical line spanning full cell height)
                // Only draw internal left walls (col > 0), outer border already drawn
                if (walls.left && col > 0) {
                    html += `<line x1="${col}" y1="${row}" x2="${col}" y2="${row + 1}" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
                }
                
                // Draw bottom wall for last row (internal walls between cells)
                // These connect to the outer bottom border
                if (row === size - 1 && walls.bottom) {
                    const isEndCell = (row === size - 1 && col === size - 1);
                    if (!isEndCell) {
                        // Regular cell in last row - draw bottom wall
                        // This connects to the outer bottom border at y=size
                        html += `<line x1="${col}" y1="${row + 1}" x2="${col + 1}" y2="${row + 1}" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
                    }
                    // End cell with opening - bottom wall is handled by outer border (with opening)
                }
                
                // Draw right wall for last column (internal walls between cells)
                // These connect to the outer right border
                if (col === size - 1 && walls.right && row < size - 1) {
                    // Draw right wall for cells in last column
                    // This connects to the outer right border at x=size
                    html += `<line x1="${col + 1}" y1="${row}" x2="${col + 1}" y2="${row + 1}" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="butt"/>`;
                }
            }
        }
        
        // Draw start marker (top-left, with opening)
        html += `<circle cx="0.5" cy="0.5" r="0.2" fill="#4CAF50" opacity="0.6"/>`;
        html += `<text x="0.5" y="0.55" text-anchor="middle" font-size="0.25" fill="#fff" font-weight="bold">S</text>`;
        
        // Draw end marker (bottom-right, with opening)
        html += `<circle cx="${size - 0.5}" cy="${size - 0.5}" r="0.2" fill="#F44336" opacity="0.6"/>`;
        html += `<text x="${size - 0.5}" y="${size - 0.45}" text-anchor="middle" font-size="0.25" fill="#fff" font-weight="bold">E</text>`;
        
        // Add solution path if showing answers
        if (showingAnswers && currentSolution && currentSolution.length > 0) {
            let pathData = '';
            for (let i = 0; i < currentSolution.length; i++) {
                const [row, col] = currentSolution[i];
                const x = col + 0.5;
                const y = row + 0.5;
                if (i === 0) {
                    pathData = `M ${x} ${y}`;
                } else {
                    pathData += ` L ${x} ${y}`;
                }
            }
            // Solution path stroke width: approximately 4px at 500px SVG size
            const solutionStrokeWidth = (4 * size) / 500;
            html += `<path d="${pathData}" stroke="#e53935" stroke-width="${solutionStrokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        
        html += '</svg>'; // Close maze-svg
        html += '</div>'; // Close maze-wrapper
        html += '</div>'; // Close maze-container

        // Add copyright footer
        const currentYear = new Date().getFullYear();
        html += `<div class="copyright-footer">© ${currentYear} AriClass. All rights reserved.</div>`;
        html += '</div>';

        puzzlePreview.innerHTML = html;
    }
});
