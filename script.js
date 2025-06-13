const cells = document.querySelectorAll('.cell');
let board = Array(9).fill(null);
let gameOver = false;

// 👇 Player always 'x', Computer is 'o'
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const i = parseInt(cell.dataset.index);
    if (!board[i] && !gameOver) {
      makeMove(i, 'x');
      if (!gameOver) {
        setTimeout(() => {
          const bestMove = getBestMove(board);
          makeMove(bestMove, 'o');
        }, 300);
      }
    }
  });
});

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.classList.add(`mark-${player}`);

  if (checkWinner(player)) {
    document.getElementById('winnerMsg').textContent = `🎉 Addy won!`;
    gameOver = true;
  } else if (!board.includes(null)) {
    document.getElementById('winnerMsg').textContent = `Pulled out a draw!`;
    gameOver = true;
  }
}

function checkWinner(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  cells.forEach(cell => {
    cell.classList.remove('mark-x', 'mark-o');
    cell.style.pointerEvents = 'auto';
  });
  document.getElementById('winnerMsg').textContent = '';
}

// 🔥 MINIMAX AI STARTS HERE
function getBestMove(newBoard) {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < newBoard.length; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'o';
      let score = minimax(newBoard, 0, false);
      newBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin(newBoard, 'o')) return 10 - depth;
  if (checkWin(newBoard, 'x')) return depth - 10;
  if (!newBoard.includes(null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'o';
        bestScore = Math.max(bestScore, minimax(newBoard, depth + 1, false));
        newBoard[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'x';
        bestScore = Math.min(bestScore, minimax(newBoard, depth + 1, true));
        newBoard[i] = null;
      }
    }
    return bestScore;
  }
}

function checkWin(boardState, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a, b, c]) =>
    boardState[a] === player &&
    boardState[b] === player &&
    boardState[c] === player
  );
}

// ✅ DRAW GRID LINES ON LOAD
drawGrid();

function drawGrid() {
  const canvas = document.getElementById('grid-lines');
  const ctx = canvas.getContext('2d');
  const size = 400;
  const spacing = size / 3;

  canvas.width = size;
  canvas.height = size;

  ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)'; // Yellow with 80% opacity
  ctx.lineWidth = 3;
  ctx.beginPath();

  // Vertical lines
  ctx.moveTo(spacing, 0);
  ctx.lineTo(spacing, size);
  ctx.moveTo(spacing * 2, 0);
  ctx.lineTo(spacing * 2, size);

  // Horizontal lines
  ctx.moveTo(0, spacing);
  ctx.lineTo(size, spacing);
  ctx.moveTo(0, spacing * 2);
  ctx.lineTo(size, spacing * 2);

  ctx.stroke();
}
document.getElementById('resetBtn').addEventListener('click', resetGame);