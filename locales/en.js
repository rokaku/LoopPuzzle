window.I18N_EN = {
  pageTitle: "LoopPuzzle - Logic Loop Game",
  brandTitle: "LoopPuzzle",
  randomLevel: "🎲 Random",
  undo: "↩️ Undo",
  reset: "🔄 Reset",
  hint: "💡 Hint",
  rules: "❓ Rules",
  connectedLines: "Connected Lines",
  loopCount: "Loop Count",
  instructions: "🖱️ <b>Left Click / Drag</b>: Draw line &nbsp;|&nbsp; 🖱️ <b>Right Click</b>: Mark cross (✕) &nbsp;|&nbsp; ⌨️ <b>Ctrl + Z</b>: Undo",
  
  // Secret Modal
  secretModalTitle: "Enter a Secret",
  secretModalDesc: "Type any text or URL. A unique puzzle will be generated from it — the secret is revealed only after solving.",
  secretInputPlaceholder: "Your secret…",
  secretCluesMore: "Clues: More",
  secretCluesNormal: "Clues: Normal",
  secretClusesFewer: "Clues: Fewer",
  secretGenerate: "🎮 Generate Puzzle",
  secretSkip: "Play Normal Mode",

  // Win Modal
  winTitle: "Puzzle Completed! 🎉",
  timeElapsed: "Time Elapsed",
  bestRecord: "Best Record",
  nextLevel: "Next Level ➔",
  replay: "Play Again",

  // Rules Modal
  rulesTitle: "🎮 Rules & Tips",
  rulesP1: "1. <b>Objective</b>: Connect adjacent dots to form <b>a single non-intersecting closed loop</b>.",
  rulesP2: "2. <b>Clues</b>: The number in a cell represents <b>how many lines surround it</b> (0–3).",
  rulesP3: "3. <b>Empty Cells</b>: Cells without numbers can have any number of lines surrounding them.",
  rulesP4: "4. <b>Vertices</b>: Each dot can connect to at most 2 lines (no branches, intersections, or dead ends).",
  rulesTip: "💡 <b>Tips</b>: For 0s, mark all 4 sides with crosses immediately. Two adjacent 3s always have lines between and beside them!",
  rulesClose: "Got it, let's play!",

  // Hint alert
  hintAlert: "Try checking cells with 0s and 3s, or right-click to mark crosses on impossible edges!",

  // Puzzles
  puzzle_easy_5x5_1: "Tutorial 1 (5×5)",
  puzzle_easy_5x5_2: "Tutorial 2 (5×5)",
  puzzle_easy_5x5_3: "Double Zeros (5×5)",
  puzzle_medium_7x7_1: "Winding Corridor (7×7)",
  puzzle_medium_8x8_1: "Castle Moat (8×8)",
  puzzle_hard_10x10_1: "Master Loop (10×10)",
  randomPuzzleTitle: (size) => `Random Challenge (${size}×${size})`
};
