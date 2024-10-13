const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let currentPiece;

const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function createPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    currentPiece = {
        shape: shape,
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0
    };
}

function drawPiece() {
    currentPiece.shape.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value) {
                ctx.fillStyle = 'red';
                ctx.fillRect((currentPiece.x + j) * BLOCK_SIZE, (currentPiece.y + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = 'white';
                ctx.strokeRect((currentPiece.x + j) * BLOCK_SIZE, (currentPiece.y + i) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (hasCollision()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        if (dy > 0) {
            mergePiece();
            createPiece();
        }
    }
}

function hasCollision() {
    return currentPiece.shape.some((row, i) => {
        return row.some((value, j) => {
            if (value) {
                const x = currentPiece.x + j;
                const y = currentPiece.y + i;
                return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
            }
            return false;
        });
    });
}

function mergePiece() {
    currentPiece.shape.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value) {
                board[currentPiece.y + i][currentPiece.x + j] = value;
            }
        });
    });
    clearLines();
}

function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
    );
    const previousShape = currentPiece.shape;
    currentPiece.shape = rotated;
    if (hasCollision()) {
        currentPiece.shape = previousShape;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece();
    movePiece(0, 1);
}

createPiece();
setInterval(gameLoop, 500);

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            movePiece(0, 1);
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
    }
});
