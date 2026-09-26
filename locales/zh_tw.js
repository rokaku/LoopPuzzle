window.I18N_ZH_TW = {
  pageTitle: "LoopPuzzle - 線上益智迴圈遊戲",
  brandTitle: "LoopPuzzle",
  randomLevel: "🎲 隨機關卡",
  undo: "↩️ 復原",
  reset: "🔄 重設",
  hint: "💡 提示",
  rules: "❓ 規則",
  connectedLines: "已連線段",
  loopCount: "獨立迴圈數",
  instructions: "🖱️ <b>滑鼠左鍵</b>：點擊或拖曳畫線 &nbsp;|&nbsp; 🖱️ <b>滑鼠右鍵</b>：標記打叉 (✕) &nbsp;|&nbsp; ⌨️ <b>Ctrl + Z</b>：復原",
  
  // Secret Modal
  secretModalTitle: "輸入密語",
  secretModalDesc: "輸入任意文字或連結，系統將生成專屬關卡——過關後才會揭露密語。",
  secretInputPlaceholder: "你的密語…",
  secretCluesMore: "線索：較多",
  secretCluesNormal: "線索：一般",
  secretClusesFewer: "線索：較少",
  secretGenerate: "🎮 生成關卡",
  secretSkip: "一般模式",

  // Win Modal
  winTitle: "恭喜過關！🎉",
  timeElapsed: "本次耗時",
  bestRecord: "最佳紀錄",
  nextLevel: "進入下一關 ➔",
  replay: "再玩一次",

  // Rules Modal
  rulesTitle: "🎮 遊戲規則與技巧",
  rulesP1: "1. <b>目標</b>：將相鄰的點連成<b>一條單一封閉、不交叉、無分支的完整迴圈</b>。",
  rulesP2: "2. <b>數字提示</b>：格子內的數字代表其周圍四條邊中，<b>必須有幾條是迴圈的線段</b> (0~3)。",
  rulesP3: "3. <b>空格</b>：沒有數字的格子周邊可有任意數量的線段。",
  rulesP4: "4. <b>頂點規則</b>：每個圓點最多只能連接 2 條線（不能有三向分叉或端點中斷）。",
  rulesTip: "💡 <b>小技巧</b>：遇 0 全部打叉；相鄰兩個 3 中間必有線；善用右鍵標記打叉輔助推理！",
  rulesClose: "我知道了，開始遊戲！",

  // Hint alert
  hintAlert: "建議先觀察盤面上的 0 與 3，或善用右鍵將不可能的線路打叉！",

  // Puzzles
  puzzle_easy_5x5_1: "入門教學 1 (5×5)",
  puzzle_easy_5x5_2: "入門教學 2 (5×5)",
  puzzle_easy_5x5_3: "雙零開局 (5×5)",
  puzzle_medium_7x7_1: "曲折迴廊 (7×7)",
  puzzle_medium_8x8_1: "城堡護城河 (8×8)",
  puzzle_hard_10x10_1: "大師迴圈 (10×10)",
  randomPuzzleTitle: (size) => `隨機挑戰 (${size}×${size})`
};
