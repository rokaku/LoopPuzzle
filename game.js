const I18N = {
  en: window.I18N_EN,
  'zh-TW': window.I18N_ZH_TW
};

// 預設關卡資料庫 (以 key 對應 i18n 文字)
const PUZZLE_DEFINITIONS = [
  {
    id: 'easy_5x5_1',
    titleKey: 'puzzle_easy_5x5_1',
    rows: 5, cols: 5,
    clues: [
      [null, 0, null, 0, null],
      [0, null, 3, null, 0],
      [null, 3, 0, 3, null],
      [0, null, 3, null, 0],
      [null, 0, null, 0, null],
    ]
  },
  {
    id: 'easy_5x5_2',
    titleKey: 'puzzle_easy_5x5_2',
    rows: 5, cols: 5,
    clues: [
      [0, 1, 1, 0, null],
      [1, 2, 2, 1, 0],
      [1, null, 1, 2, 0],
      [0, 2, 2, 3, 1],
      [null, 0, 1, 1, 0],
    ]
  },
  {
    id: 'easy_5x5_3',
    titleKey: 'puzzle_easy_5x5_3',
    rows: 5, cols: 5,
    clues: [
      [0, 1, 0, 1, 0],
      [1, 3, 2, 3, 1],
      [1, 2, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [0, 1, 1, 1, 0],
    ]
  },
  {
    id: 'medium_7x7_1',
    titleKey: 'puzzle_medium_7x7_1',
    rows: 7, cols: 7,
    clues: [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 2, 3, 2, 0, 0],
      [0, 1, 2, 1, 2, 1, 0],
      [0, 1, 2, null, 2, 1, 0],
      [0, 1, 2, 1, 2, 1, 0],
      [0, 0, 2, 3, 2, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ]
  },
  {
    id: 'medium_8x8_1',
    titleKey: 'puzzle_medium_8x8_1',
    rows: 8, cols: 8,
    clues: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 'hard_10x10_1',
    titleKey: 'puzzle_hard_10x10_1',
    rows: 10, cols: 10,
    clues: [
      [0, 0, 0, null, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, null, 0, 0, 0],
      [0, 1, 2, 2, 2, 1, 0, 0, 0, 0],
      [0, 1, 2, 1, 1, 2, 1, 0, null, 0],
      [0, 0, 1, 2, 1, 1, 2, 1, 0, 0],
      [0, null, 0, 1, 2, 1, 1, 2, 1, 0],
      [0, 0, 0, 0, 1, 2, 2, 2, 1, 0],
      [0, 0, 0, 0, null, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
  }
];

let PUZZLES = [...PUZZLE_DEFINITIONS];

// ── Secret / Seeded Puzzle ──────────────────────────────────────────────

function makePRNG(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function strToSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

function encodeSecret(secret) {
  return btoa(unescape(encodeURIComponent(secret)));
}

function decodeSecret(encoded) {
  try { return decodeURIComponent(escape(atob(encoded))); } catch { return null; }
}

function getSecretFromURL() {
  const p = new URLSearchParams(window.location.search);
  const s = p.get('s');
  return s ? decodeSecret(s) : null;
}

function getModeFromURL() {
  const p = new URLSearchParams(window.location.search);
  return p.get('mode');
}

function getSizeFromURL() {
  const p = new URLSearchParams(window.location.search);
  const sz = p.get('sz');
  return sz ? Number(sz) : 7;
}

function getDiffFromURL() {
  const p = new URLSearchParams(window.location.search);
  return p.get('d') || 'normal';
}

function buildSecretURL(secret, size, diff) {
  const base = window.location.href.split('?')[0];
  return base + '?s=' + encodeURIComponent(encodeSecret(secret)) + '&sz=' + size + '&d=' + diff;
}

const DIFF_DENSITY = { easy: 0.85, normal: 0.65, hard: 0.40 };

function checkGridBoundaryLoop(grid, size) {
  const vDegrees = Array.from({ length: size + 1 }, () => Array(size + 1).fill(0));
  let edgeCount = 0;
  for (let r = 0; r <= size; r++) {
    for (let c = 0; c < size; c++) {
      const isEdge = (r === 0 && grid[0][c]) || (r === size && grid[size-1][c]) || (r > 0 && r < size && grid[r-1][c] !== grid[r][c]);
      if (isEdge) {
        vDegrees[r][c]++;
        vDegrees[r][c+1]++;
        edgeCount++;
      }
    }
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size; c++) {
      const isEdge = (c === 0 && grid[r][0]) || (c === size && grid[r][size-1]) || (c > 0 && c < size && grid[r][c-1] !== grid[r][c]);
      if (isEdge) {
        vDegrees[r][c]++;
        vDegrees[r+1][c]++;
        edgeCount++;
      }
    }
  }
  for (let r = 0; r <= size; r++) {
    for (let c = 0; c <= size; c++) {
      if (vDegrees[r][c] !== 0 && vDegrees[r][c] !== 2) return false;
    }
  }
  return edgeCount >= 4;
}

function generateSecretLevel(secret, size = 7, diff = 'normal') {
  const density = DIFF_DENSITY[diff] ?? 0.65;
  const rand = makePRNG(strToSeed(secret + ':' + size));
  let grid = null;

  for (let attempt = 0; attempt < 100; attempt++) {
    const candidate = Array.from({ length: size }, () => Array(size).fill(false));
    const mid = Math.floor(size / 2);
    candidate[mid][mid] = true;
    if (size > 3) candidate[mid][mid - 1] = true;
    const target = Math.floor(size * size * 0.4);
    let count = 2;
    for (let step = 0; step < 500 && count < target; step++) {
      const r = Math.floor(rand() * size);
      const c = Math.floor(rand() * size);
      if (!candidate[r][c]) {
        const adj = (r > 0 && candidate[r-1][c]) || (r < size-1 && candidate[r+1][c]) ||
                    (c > 0 && candidate[r][c-1]) || (c < size-1 && candidate[r][c+1]);
        if (adj) { candidate[r][c] = true; count++; }
      }
    }
    if (checkGridBoundaryLoop(candidate, size)) {
      grid = candidate;
      break;
    }
  }

  // ── 最後一道保險 ─────────────────────────────────────────────────────────
  if (!grid) {
    grid = Array.from({ length: size }, () => Array(size).fill(false));
    grid[Math.floor(size/2)][Math.floor(size/2)] = true;
  }

  const clues = Array.from({ length: size }, () => Array(size).fill(null));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let edges = 0;
      if (r === 0 ? grid[0][c] : grid[r-1][c] !== grid[r][c]) edges++;
      if (r === size-1 ? grid[size-1][c] : grid[r+1][c] !== grid[r][c]) edges++;
      if (c === 0 ? grid[r][0] : grid[r][c-1] !== grid[r][c]) edges++;
      if (c === size-1 ? grid[r][size-1] : grid[r][c+1] !== grid[r][c]) edges++;
      if (grid[r][c] || rand() < 0.25) {
        if (rand() < density) clues[r][c] = edges;
      }
    }
  }
  return { id: 'secret_' + strToSeed(secret) + '_' + size + '_' + diff, isSecret: true, secret, diff, rows: size, cols: size, clues };
}

let currentSecret = null;

// ── 主題切換 ─────────────────────────────────────────────────────────────
let currentTheme = localStorage.getItem('looppuzzle_theme') || 'light';

function applyTheme(theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('btnThemeToggle').textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('btnThemeToggle').textContent = '🌙';
  }
  localStorage.setItem('looppuzzle_theme', theme);
  if (puzzle) renderBoard();
}

// ── 語系 ─────────────────────────────────────────────────────────────────
function detectUserLanguage() {
  const savedLang = localStorage.getItem('looppuzzle_lang');
  if (savedLang && I18N[savedLang]) return savedLang;
  const sysLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
  for (const lang of sysLangs) {
    if (!lang) continue;
    const lower = lang.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-TW';
    if (lower.startsWith('en')) return 'en';
  }
  return 'en';
}

let currentLang = detectUserLanguage();

function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.en;
  const val = dict[key] || I18N.en[key] || key;
  return typeof val === 'function' ? val(...args) : val;
}

function getPuzzleTitle(p) {
  if (p.titleKey) return t(p.titleKey);
  if (p.isRandom) return t('randomPuzzleTitle', p.rows);
  return p.title || 'Puzzle';
}

// ── 遊戲狀態 ──────────────────────────────────────────────────────────────
let currentPuzzleIndex = 0;
let puzzle = PUZZLES[0];
let hLines = [];
let vLines = [];
let undoStack = [];
let timer = 0;
let timerInterval = null;
let timerStarted = false;
let isSolved = false;

let isMouseDown = false;
let dragTargetState = 0;

const CELL_SIZE = 54;
const PADDING = 28;

// ── 介面 ──────────────────────────────────────────────────────────────────
function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t('pageTitle');
  document.getElementById('brandTitle').textContent = t('brandTitle');
  document.getElementById('btnRandom').textContent = t('randomLevel');
  document.getElementById('btnUndo').textContent = t('undo');
  document.getElementById('btnReset').textContent = t('reset');
  document.getElementById('btnHint').textContent = t('hint');
  document.getElementById('btnRules').textContent = t('rules');
  document.getElementById('labelConnectedLines').textContent = t('connectedLines');
  document.getElementById('labelLoopCount').textContent = t('loopCount');
  document.getElementById('instructionsText').innerHTML = t('instructions');
  document.getElementById('winTitle').textContent = t('winTitle');
  document.getElementById('labelTimeElapsed').textContent = t('timeElapsed');
  document.getElementById('labelBestRecord').textContent = t('bestRecord');
  document.getElementById('btnNextLevel').textContent = t('nextLevel');
  document.getElementById('btnReplay').textContent = t('replay');
  document.getElementById('rulesTitle').textContent = t('rulesTitle');
  document.getElementById('rulesP1').innerHTML = t('rulesP1');
  document.getElementById('rulesP2').innerHTML = t('rulesP2');
  document.getElementById('rulesP3').innerHTML = t('rulesP3');
  document.getElementById('rulesP4').innerHTML = t('rulesP4');
  document.getElementById('rulesTip').innerHTML = t('rulesTip');
  document.getElementById('btnCloseRules').textContent = t('rulesClose');

  // Secret Modal
  document.getElementById('secretModalTitle').textContent = t('secretModalTitle');
  document.getElementById('secretModalDesc').textContent = t('secretModalDesc');
  document.getElementById('secretInput').placeholder = t('secretInputPlaceholder');
  document.getElementById('optCluesMore').textContent = t('secretCluesMore');
  document.getElementById('optCluesNormal').textContent = t('secretCluesNormal');
  document.getElementById('optCluesFewer').textContent = t('secretClusesFewer');
  document.getElementById('btnStartSecret').textContent = t('secretGenerate');
  document.getElementById('btnSkipSecret').textContent = t('secretSkip');

  updatePuzzleSelectOptions();
}

function updatePuzzleSelectOptions() {
  const sel = document.getElementById('puzzleSelect');
  const savedVal = currentPuzzleIndex >= 0 ? currentPuzzleIndex : (puzzle ? 'custom' : '');
  sel.innerHTML = '';
  PUZZLES.forEach((p, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    const best = localStorage.getItem('looppuzzle_best_' + p.id);
    opt.textContent = (best ? '✓ ' : '') + getPuzzleTitle(p);
    sel.appendChild(opt);
  });

  if (currentPuzzleIndex === -1 && puzzle) {
    const opt = document.createElement('option');
    opt.value = 'custom';
    opt.textContent = getPuzzleTitle(puzzle);
    sel.appendChild(opt);
  }
  sel.value = savedVal;
}

// ── 初始化 ────────────────────────────────────────────────────────────────
function init() {
  document.getElementById('langSelect').value = currentLang;
  applyTranslations();

  const urlSecret = getSecretFromURL();
  const urlMode = getModeFromURL();

  if (urlSecret) {
    currentSecret = urlSecret;
    const urlSize = getSizeFromURL();
    const urlDiff = getDiffFromURL();
    document.getElementById('secretModal').classList.remove('open');
    loadSecretPuzzle(urlSecret, urlSize, urlDiff);
  } else if (urlMode === 'normal') {
    document.getElementById('secretModal').classList.remove('open');
    document.getElementById('puzzleSelect').style.display = '';
    document.getElementById('btnRandom').style.display = '';
    const newP = generateRandomLevel(5);
    loadCustomPuzzle(newP);
  } else {
    loadDefaultPuzzle(0);
  }

  applyTheme(currentTheme);
  setupEvents();
}

// ── Secret關卡載入 ───────────────────────────────────────────────────────
function loadSecretPuzzle(secret, size = 7, diff = 'normal') {
  puzzle = generateSecretLevel(secret, size, diff);
  currentPuzzleIndex = -1;
  document.getElementById('puzzleSelect').value = '';

  hLines = Array.from({ length: puzzle.rows + 1 }, () => Array(puzzle.cols).fill(0));
  vLines = Array.from({ length: puzzle.rows }, () => Array(puzzle.cols + 1).fill(0));
  undoStack = [];
  isSolved = false;
  timer = 0;
  timerStarted = false;
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  renderBoard();
  validate();

  const prevBest = localStorage.getItem('looppuzzle_best_' + puzzle.id);
  if (prevBest !== null) {
    const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    document.getElementById('winPuzzleTitle').textContent = getPuzzleTitle(puzzle);
    document.getElementById('winTime').textContent = '—';
    document.getElementById('winBestTime').textContent = formatTime(Number(prevBest));
    const revealEl = document.getElementById('secretReveal');
    revealEl.textContent = '🔓 Secret: ' + puzzle.secret;
    revealEl.classList.add('show');
    document.getElementById('btnNextLevel').style.display = 'none';
    document.getElementById('winModal').classList.add('open');
  }
}

// ── 普通關卡載入 ───────────────────────────────────────────────────────────
function loadCustomPuzzle(p) {
  currentPuzzleIndex = -1;
  puzzle = p;
  updatePuzzleSelectOptions();

  hLines = Array.from({ length: puzzle.rows + 1 }, () => Array(puzzle.cols).fill(0));
  vLines = Array.from({ length: puzzle.rows }, () => Array(puzzle.cols + 1).fill(0));
  undoStack = [];
  isSolved = false;
  timer = 0;
  timerStarted = false;
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  renderBoard();
  validate();
}

// ── 預設關卡載入 ───────────────────────────────────────────────────────────
function loadDefaultPuzzle(idx) {
  currentPuzzleIndex = idx;
  puzzle = PUZZLES[idx];
  updatePuzzleSelectOptions();

  hLines = Array.from({ length: puzzle.rows + 1 }, () => Array(puzzle.cols).fill(0));
  vLines = Array.from({ length: puzzle.rows }, () => Array(puzzle.cols + 1).fill(0));
  undoStack = [];
  isSolved = false;
  timer = 0;
  timerStarted = false;
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  renderBoard();
  validate();
}

function updateTimerDisplay() {
  const m = String(Math.floor(timer / 60)).padStart(2, '0');
  const s = String(timer % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}

// ── 盤面渲染 ──────────────────────────────────────────────────────────────
function renderBoard() {
  const svg = document.getElementById('gameSvg');
  const width = puzzle.cols * CELL_SIZE + PADDING * 2;
  const height = puzzle.rows * CELL_SIZE + PADDING * 2;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.innerHTML = '';

  const gridStrokeColor = currentTheme === 'dark' ? '#334155' : '#e2e8f0';

  for (let r = 0; r <= puzzle.rows; r++)
    svg.appendChild(createSvgLine(PADDING, PADDING + r * CELL_SIZE, PADDING + puzzle.cols * CELL_SIZE, PADDING + r * CELL_SIZE, gridStrokeColor, '1', '2 3'));
  for (let c = 0; c <= puzzle.cols; c++)
    svg.appendChild(createSvgLine(PADDING + c * CELL_SIZE, PADDING, PADDING + c * CELL_SIZE, PADDING + puzzle.rows * CELL_SIZE, gridStrokeColor, '1', '2 3'));

  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const clue = puzzle.clues[r][c];
      if (clue !== null) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', PADDING + c * CELL_SIZE + CELL_SIZE / 2);
        text.setAttribute('y', PADDING + r * CELL_SIZE + CELL_SIZE / 2 + 7);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'cell-clue');
        text.setAttribute('id', `clue-${r}-${c}`);
        text.textContent = clue;
        svg.appendChild(text);
      }
    }
  }

  for (let r = 0; r <= puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'edge-group');
      const x1 = PADDING + c * CELL_SIZE, y1 = PADDING + r * CELL_SIZE;
      const x2 = PADDING + (c + 1) * CELL_SIZE, y2 = y1;
      const prev = createSvgLine(x1 + 6, y1, x2 - 6, y2, '', '', '');
      prev.setAttribute('class', 'edge-preview');
      g.appendChild(prev);
      const line = createSvgLine(x1, y1, x2, y2, '', '', '');
      line.setAttribute('class', 'edge-line');
      line.setAttribute('id', `h-line-${r}-${c}`);
      line.style.display = hLines[r][c] === 1 ? 'block' : 'none';
      g.appendChild(line);
      const cross = createSvgCross((x1 + x2) / 2, y1, `h-cross-${r}-${c}`);
      cross.style.display = hLines[r][c] === 2 ? 'block' : 'none';
      g.appendChild(cross);
      const hit = createSvgLine(x1 + 4, y1, x2 - 4, y2, '', '', '');
      hit.setAttribute('class', 'edge-hitbox');
      hit.addEventListener('mousedown', (e) => handleEdgeMouseDown('h', r, c, e));
      hit.addEventListener('mouseenter', () => handleEdgeMouseEnter('h', r, c));
      g.appendChild(hit);
      svg.appendChild(g);
    }
  }

  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c <= puzzle.cols; c++) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'edge-group');
      const x1 = PADDING + c * CELL_SIZE, y1 = PADDING + r * CELL_SIZE;
      const x2 = x1, y2 = PADDING + (r + 1) * CELL_SIZE;
      const prev = createSvgLine(x1, y1 + 6, x2, y2 - 6, '', '', '');
      prev.setAttribute('class', 'edge-preview');
      g.appendChild(prev);
      const line = createSvgLine(x1, y1, x2, y2, '', '', '');
      line.setAttribute('class', 'edge-line');
      line.setAttribute('id', `v-line-${r}-${c}`);
      line.style.display = vLines[r][c] === 1 ? 'block' : 'none';
      g.appendChild(line);
      const cross = createSvgCross(x1, (y1 + y2) / 2, `v-cross-${r}-${c}`);
      cross.style.display = vLines[r][c] === 2 ? 'block' : 'none';
      g.appendChild(cross);
      const hit = createSvgLine(x1, y1 + 4, x2, y2 - 4, '', '', '');
      hit.setAttribute('class', 'edge-hitbox');
      hit.addEventListener('mousedown', (e) => handleEdgeMouseDown('v', r, c, e));
      hit.addEventListener('mouseenter', () => handleEdgeMouseEnter('v', r, c));
      g.appendChild(hit);
      svg.appendChild(g);
    }
  }

  for (let r = 0; r <= puzzle.rows; r++) {
    for (let c = 0; c <= puzzle.cols; c++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', PADDING + c * CELL_SIZE);
      circle.setAttribute('cy', PADDING + r * CELL_SIZE);
      circle.setAttribute('r', '4');
      circle.setAttribute('class', 'grid-dot');
      circle.setAttribute('id', `dot-${r}-${c}`);
      svg.appendChild(circle);
    }
  }
}

function createSvgLine(x1, y1, x2, y2, stroke, width, dash) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  if (stroke) line.setAttribute('stroke', stroke);
  if (width) line.setAttribute('stroke-width', width);
  if (dash) line.setAttribute('stroke-dasharray', dash);
  return line;
}

function createSvgCross(x, y, id) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', id);
  const l1 = createSvgLine(x - 4, y - 4, x + 4, y + 4, '', '', '');
  l1.setAttribute('class', 'edge-cross');
  const l2 = createSvgLine(x - 4, y + 4, x + 4, y - 4, '', '', '');
  l2.setAttribute('class', 'edge-cross');
  g.appendChild(l1); g.appendChild(l2);
  return g;
}

// ── 互動控制 ──────────────────────────────────────────────────────────────
function setEdge(type, r, c, nextVal) {
  const cur = type === 'h' ? hLines[r][c] : vLines[r][c];
  if (cur === nextVal) return;

  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(() => {
      if (!isSolved) { timer++; updateTimerDisplay(); }
    }, 1000);
  }

  undoStack.push({ type, r, c, prev: cur, next: nextVal });
  if (type === 'h') hLines[r][c] = nextVal;
  else vLines[r][c] = nextVal;

  const lineEl = document.getElementById(`${type}-line-${r}-${c}`);
  const crossEl = document.getElementById(`${type}-cross-${r}-${c}`);
  if (lineEl) lineEl.style.display = nextVal === 1 ? 'block' : 'none';
  if (crossEl) crossEl.style.display = nextVal === 2 ? 'block' : 'none';

  validate();
}

function handleEdgeMouseDown(type, r, c, e) {
  if (isSolved) return;
  isMouseDown = true;
  const isRight = e.button === 2;
  const cur = type === 'h' ? hLines[r][c] : vLines[r][c];
  dragTargetState = isRight ? (cur === 2 ? 0 : 2) : (cur === 1 ? 0 : 1);
  setEdge(type, r, c, dragTargetState);
}

function handleEdgeMouseEnter(type, r, c) {
  if (!isMouseDown || isSolved) return;
  setEdge(type, r, c, dragTargetState);
}

window.addEventListener('mouseup', () => { isMouseDown = false; });

// ── 驗證 ──────────────────────────────────────────────────────────────────
function countCellLines(r, c) {
  let cnt = 0;
  if (hLines[r][c] === 1) cnt++;
  if (hLines[r + 1][c] === 1) cnt++;
  if (vLines[r][c] === 1) cnt++;
  if (vLines[r][c + 1] === 1) cnt++;
  return cnt;
}

function countDotDegree(r, c) {
  let deg = 0;
  if (r > 0 && vLines[r - 1][c] === 1) deg++;
  if (r < puzzle.rows && vLines[r][c] === 1) deg++;
  if (c > 0 && hLines[r][c - 1] === 1) deg++;
  if (c < puzzle.cols && hLines[r][c] === 1) deg++;
  return deg;
}

function validate() {
  let totalLines = 0, branchError = false;

  for (let r = 0; r <= puzzle.rows; r++)
    for (let c = 0; c < puzzle.cols; c++)
      if (hLines[r][c] === 1) totalLines++;
  for (let r = 0; r < puzzle.rows; r++)
    for (let c = 0; c <= puzzle.cols; c++)
      if (vLines[r][c] === 1) totalLines++;

  document.getElementById('lineCountDisplay').textContent = totalLines;

  for (let r = 0; r <= puzzle.rows; r++) {
    for (let c = 0; c <= puzzle.cols; c++) {
      const deg = countDotDegree(r, c);
      const dot = document.getElementById(`dot-${r}-${c}`);
      if (dot) dot.className.baseVal = 'grid-dot' + (deg > 2 ? ' error' : deg > 0 ? ' active' : '');
      if (deg > 2) branchError = true;
    }
  }

  let allCluesMatch = true;
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      const clue = puzzle.clues[r][c];
      if (clue !== null) {
        const count = countCellLines(r, c);
        const el = document.getElementById(`clue-${r}-${c}`);
        if (el) el.className.baseVal = count > clue ? 'cell-clue clue-error' : count === clue ? 'cell-clue clue-satisfied' : 'cell-clue';
        if (count !== clue) allCluesMatch = false;
      }
    }
  }

  const dotCount = (puzzle.rows + 1) * (puzzle.cols + 1);
  const adj = Array.from({ length: dotCount }, () => []);
  const degrees = Array(dotCount).fill(0);
  const getDotIdx = (r, c) => r * (puzzle.cols + 1) + c;

  for (let r = 0; r <= puzzle.rows; r++)
    for (let c = 0; c < puzzle.cols; c++)
      if (hLines[r][c] === 1) {
        const u = getDotIdx(r, c), v = getDotIdx(r, c + 1);
        adj[u].push(v); adj[v].push(u); degrees[u]++; degrees[v]++;
      }
  for (let r = 0; r < puzzle.rows; r++)
    for (let c = 0; c <= puzzle.cols; c++)
      if (vLines[r][c] === 1) {
        const u = getDotIdx(r, c), v = getDotIdx(r + 1, c);
        adj[u].push(v); adj[v].push(u); degrees[u]++; degrees[v]++;
      }

  const activeDots = [];
  let allDegTwo = true;
  for (let i = 0; i < dotCount; i++) {
    if (degrees[i] > 0) { activeDots.push(i); if (degrees[i] !== 2) allDegTwo = false; }
  }

  let components = 0;
  const visited = new Set();
  for (const start of activeDots) {
    if (!visited.has(start)) {
      components++;
      const queue = [start];
      visited.add(start);
      while (queue.length > 0) {
        const cur = queue.shift();
        for (const n of adj[cur]) { if (!visited.has(n)) { visited.add(n); queue.push(n); } }
      }
    }
  }

  document.getElementById('loopCountDisplay').textContent = components;
  if (allCluesMatch && !branchError && allDegTwo && components === 1 && totalLines >= 4) handleVictory();
}

function handleVictory() {
  if (isSolved) return;
  isSolved = true;

  document.querySelectorAll('.edge-line').forEach(el => el.classList.add('solved'));
  document.querySelectorAll('.grid-dot.active').forEach(el => el.classList.add('solved'));

  const bestKey = 'looppuzzle_best_' + puzzle.id;
  const prevBest = localStorage.getItem(bestKey);
  let bestVal = timer;
  if (prevBest) bestVal = Math.min(Number(prevBest), timer);
  localStorage.setItem(bestKey, bestVal);

  updatePuzzleSelectOptions();

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  document.getElementById('winPuzzleTitle').textContent = getPuzzleTitle(puzzle);
  document.getElementById('winTime').textContent = formatTime(timer);
  document.getElementById('winBestTime').textContent = formatTime(bestVal);

  const revealEl = document.getElementById('secretReveal');
  if (puzzle.isSecret && puzzle.secret) {
    revealEl.textContent = '🔓 Secret: ' + puzzle.secret;
    revealEl.classList.add('show');
    document.getElementById('btnNextLevel').style.display = 'none';
  } else {
    revealEl.classList.remove('show');
    document.getElementById('btnNextLevel').style.display = '';
  }

  document.getElementById('winModal').classList.add('open');
}

// ── 隨機關卡生成 ──────────────────────────────────────────────────────────
function generateRandomLevel(size = 5) {
  let grid = null;
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = Array.from({ length: size }, () => Array(size).fill(false));
    const mid = Math.floor(size / 2);
    candidate[mid][mid] = true;
    if (size > 3) candidate[mid][mid - 1] = true;
    const target = Math.floor(size * size * 0.4);
    let count = 2;
    for (let step = 0; step < 200 && count < target; step++) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!candidate[r][c]) {
        const adj = (r > 0 && candidate[r-1][c]) || (r < size-1 && candidate[r+1][c]) || (c > 0 && candidate[r][c-1]) || (c < size-1 && candidate[r][c+1]);
        if (adj) { candidate[r][c] = true; count++; }
      }
    }
    if (checkGridBoundaryLoop(candidate, size)) {
      grid = candidate;
      break;
    }
  }

  if (!grid) {
    grid = Array.from({ length: size }, () => Array(size).fill(false));
    grid[Math.floor(size/2)][Math.floor(size/2)] = true;
  }

  const clues = Array.from({ length: size }, () => Array(size).fill(null));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let edges = 0;
      if (r === 0 ? grid[0][c] : grid[r-1][c] !== grid[r][c]) edges++;
      if (r === size-1 ? grid[size-1][c] : grid[r+1][c] !== grid[r][c]) edges++;
      if (c === 0 ? grid[r][0] : grid[r][c-1] !== grid[r][c]) edges++;
      if (c === size-1 ? grid[r][size-1] : grid[r][c+1] !== grid[r][c]) edges++;
      if (grid[r][c] || Math.random() < 0.25) {
        clues[r][c] = Math.random() < 0.70 ? edges : null;
      }
    }
  }
  return { id: 'rand_' + Date.now(), isRandom: true, rows: size, cols: size, clues };
}

// ── 提示 ──────────────────────────────────────────────────────────────────
function giveHint() {
  for (let r = 0; r < puzzle.rows; r++) {
    for (let c = 0; c < puzzle.cols; c++) {
      if (puzzle.clues[r][c] === 0) {
        if (hLines[r][c] === 0) { setEdge('h', r, c, 2); return; }
        if (hLines[r + 1][c] === 0) { setEdge('h', r + 1, c, 2); return; }
        if (vLines[r][c] === 0) { setEdge('v', r, c, 2); return; }
        if (vLines[r][c + 1] === 0) { setEdge('v', r, c + 1, 2); return; }
      }
    }
  }
  alert(t('hintAlert'));
}

// ── 事件綁定 ──────────────────────────────────────────────────────────────
function setupEvents() {
  document.getElementById('btnThemeToggle').addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  document.getElementById('langSelect').addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('looppuzzle_lang', currentLang);
    applyTranslations();
  });

  document.getElementById('puzzleSelect').addEventListener('change', (e) => {
    loadDefaultPuzzle(Number(e.target.value));
  });

  document.getElementById('btnUndo').addEventListener('click', () => {
    if (undoStack.length === 0 || isSolved) return;
    const item = undoStack.pop();
    if (item.type === 'h') hLines[item.r][item.c] = item.prev;
    else vLines[item.r][item.c] = item.prev;
    const lineEl = document.getElementById(`${item.type}-line-${item.r}-${item.c}`);
    const crossEl = document.getElementById(`${item.type}-cross-${item.r}-${item.c}`);
    if (lineEl) lineEl.style.display = item.prev === 1 ? 'block' : 'none';
    if (crossEl) crossEl.style.display = item.prev === 2 ? 'block' : 'none';
    validate();
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    if (currentPuzzleIndex === -1) {
      loadCustomPuzzle(puzzle);
    } else {
      loadDefaultPuzzle(currentPuzzleIndex);
    }
  });

  document.getElementById('btnHint').addEventListener('click', giveHint);

  document.getElementById('btnRandom').addEventListener('click', () => {
    const currentSize = (puzzle && puzzle.rows) ? puzzle.rows : 5;
    const newP = generateRandomLevel(currentSize);
    loadCustomPuzzle(newP);
  });

  document.getElementById('btnNextLevel').addEventListener('click', () => {
    document.getElementById('winModal').classList.remove('open');
    if (currentPuzzleIndex === -1) {
      const currentSize = (puzzle && puzzle.rows) ? puzzle.rows : 5;
      const newP = generateRandomLevel(currentSize);
      loadCustomPuzzle(newP);
    } else {
      const next = (currentPuzzleIndex + 1) % PUZZLES.length;
      loadDefaultPuzzle(next);
    }
  });

  document.getElementById('btnReplay').addEventListener('click', () => {
    document.getElementById('winModal').classList.remove('open');
    if (currentPuzzleIndex === -1) {
      loadCustomPuzzle(puzzle);
    } else {
      loadDefaultPuzzle(currentPuzzleIndex);
    }
  });

  document.getElementById('btnStartSecret').addEventListener('click', () => {
    const secret = document.getElementById('secretInput').value.trim();
    if (!secret) return;
    currentSecret = secret;
    const size = Number(document.getElementById('secretSizeSelect').value);
    const diff = document.getElementById('secretDiffSelect').value;
    document.getElementById('secretModal').classList.remove('open');
    loadSecretPuzzle(secret, size, diff);
    history.replaceState(null, '', buildSecretURL(secret, size, diff));
  });

  document.getElementById('secretInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btnStartSecret').click();
  });

  document.getElementById('btnSkipSecret').addEventListener('click', () => {
    document.getElementById('secretModal').classList.remove('open');
    document.getElementById('puzzleSelect').style.display = '';
    document.getElementById('btnRandom').style.display = '';
  });

  document.getElementById('btnRules').addEventListener('click', () => {
    document.getElementById('rulesModal').classList.add('open');
  });

  document.getElementById('btnCloseRules').addEventListener('click', () => {
    document.getElementById('rulesModal').classList.remove('open');
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      document.getElementById('btnUndo').click();
    }
  });
}

// 啟動
init();
