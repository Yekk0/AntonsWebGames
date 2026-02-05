const snakeCanvas = document.getElementById('snake-canvas') as HTMLCanvasElement;
const snakeCtx = snakeCanvas.getContext('2d')!;
const snakeScoreDisplay = document.getElementById('snake-score') as HTMLSpanElement;
const snakeHighScoreDisplay = document.getElementById('snake-high-score') as HTMLSpanElement;
const snakeGameOverScreen = document.getElementById('snake-game-over') as HTMLDivElement;
const snakeResultTitle = document.getElementById('snake-result-title') as HTMLHeadingElement;
const snakeResultMsg = document.getElementById('snake-result-msg') as HTMLParagraphElement;

const GRID_SIZE = 20;
let snake: { x: number, y: number }[] = [];
let food: { x: number, y: number } = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let snakeScore = 0;
let snakeHighScore = 0;
let snakeGameActive = false;
let lastTime = 0;
const MOVE_INTERVAL = 150; // Milliseconds between grid moves
let moveTimer = 0;

function startSnake() {
    resizeSnakeCanvas();
    snake = [
        { x: GRID_SIZE * 5, y: GRID_SIZE * 5 },
        { x: GRID_SIZE * 4, y: GRID_SIZE * 5 },
        { x: GRID_SIZE * 3, y: GRID_SIZE * 5 }
    ];
    dx = GRID_SIZE;
    dy = 0;
    nextDx = GRID_SIZE;
    nextDy = 0;
    snakeScore = 0;
    updateSnakeScore();
    createFood();
    snakeGameOverScreen.style.display = 'none';
    snakeGameActive = true;
    lastTime = performance.now();
    moveTimer = 0;
    
    requestAnimationFrame(snakeMain);
}

function createFood() {
    const maxX = (snakeCanvas.width / GRID_SIZE) - 1;
    const maxY = (snakeCanvas.height / GRID_SIZE) - 1;
    food.x = Math.floor(Math.random() * maxX) * GRID_SIZE;
    food.y = Math.floor(Math.random() * maxY) * GRID_SIZE;
    
    // Make sure food doesn't spawn on snake
    for (const part of snake) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
            break;
        }
    }
}

function updateSnakeScore() {
    snakeScoreDisplay.textContent = snakeScore.toString();
    if (snakeScore > snakeHighScore) {
        snakeHighScore = snakeScore;
        snakeHighScoreDisplay.textContent = snakeHighScore.toString();
    }
}

function snakeMain(currentTime: number) {
    if (!snakeGameActive) return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    moveTimer += deltaTime;

    if (moveTimer >= MOVE_INTERVAL) {
        advanceSnake();
        moveTimer = 0;
    }

    drawSnakeGame(moveTimer / MOVE_INTERVAL);
    requestAnimationFrame(snakeMain);
}

function advanceSnake() {
    dx = nextDx;
    dy = nextDy;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height) {
        endSnake();
        return;
    }

    // Self collision
    for (const part of snake) {
        if (part.x === head.x && part.y === head.y) {
            endSnake();
            return;
        }
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        updateSnakeScore();
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnakeGame(interpolation: number) {
    // Clear canvas
    snakeCtx.fillStyle = '#1a1a1a'; // Slightly lighter than pure black for contrast
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Draw background grid (small green squares)
    drawBackground();

    // Draw food
    drawFood();

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        const part = snake[i];
        let x = part.x;
        let y = part.y;

        if (i === 0) {
            // Head interpolation: move from previous position to head position
            x = (part.x - dx) + (dx * interpolation);
            y = (part.y - dy) + (dy * interpolation);
            drawHead(x, y);
        } else {
            // Body parts: move from next part's position to current part's position
            const prevPart = snake[i - 1];
            x = part.x + (prevPart.x - part.x) * interpolation;
            y = part.y + (prevPart.y - part.y) * interpolation;
            
            // Taper the tail
            const isTail = i === snake.length - 1;
            drawBodyPart(x, y, i, isTail);
        }
    }
}

function drawBackground() {
    for (let x = 0; x < snakeCanvas.width; x += GRID_SIZE) {
        for (let y = 0; y < snakeCanvas.height; y += GRID_SIZE) {
            // Checkerboard pattern with two dark green colors
            if ((x / GRID_SIZE + y / GRID_SIZE) % 2 === 0) {
                snakeCtx.fillStyle = '#1e2d1e'; // Very dark green
            } else {
                snakeCtx.fillStyle = '#162416'; // Even darker green
            }
            snakeCtx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
        }
    }
}

function drawHead(x: number, y: number) {
    snakeCtx.save();
    snakeCtx.translate(x + GRID_SIZE / 2, y + GRID_SIZE / 2);
    
    // Rotate head based on direction
    let angle = 0;
    if (dx > 0) angle = 0;
    else if (dx < 0) angle = Math.PI;
    else if (dy > 0) angle = Math.PI / 2;
    else if (dy < 0) angle = -Math.PI / 2;
    snakeCtx.rotate(angle);

    // Tongue (flickering animation)
    const tongueTime = (performance.now() % 500) / 500;
    if (tongueTime < 0.3) {
        snakeCtx.strokeStyle = '#ff4757';
        snakeCtx.lineWidth = 2;
        snakeCtx.beginPath();
        snakeCtx.moveTo(GRID_SIZE / 2, 0);
        snakeCtx.lineTo(GRID_SIZE / 2 + 8, 0);
        // Forked tongue
        snakeCtx.moveTo(GRID_SIZE / 2 + 8, 0);
        snakeCtx.lineTo(GRID_SIZE / 2 + 12, -3);
        snakeCtx.moveTo(GRID_SIZE / 2 + 8, 0);
        snakeCtx.lineTo(GRID_SIZE / 2 + 12, 3);
        snakeCtx.stroke();
    }

    // Head shape (more diamond-like/tapered towards nose)
    snakeCtx.fillStyle = '#2ed573';
    snakeCtx.beginPath();
    snakeCtx.moveTo(-GRID_SIZE / 2, -GRID_SIZE / 2);
    snakeCtx.quadraticCurveTo(GRID_SIZE / 2, -GRID_SIZE / 2, GRID_SIZE / 2 + 2, 0);
    snakeCtx.quadraticCurveTo(GRID_SIZE / 2, GRID_SIZE / 2, -GRID_SIZE / 2, GRID_SIZE / 2);
    snakeCtx.closePath();
    snakeCtx.fill();

    // Nostrils
    snakeCtx.fillStyle = '#1e914d';
    snakeCtx.beginPath();
    snakeCtx.arc(GRID_SIZE / 2 - 2, -2, 1, 0, Math.PI * 2);
    snakeCtx.arc(GRID_SIZE / 2 - 2, 2, 1, 0, Math.PI * 2);
    snakeCtx.fill();

    // Eyes (slanted/more reptilian)
    snakeCtx.fillStyle = '#fff';
    snakeCtx.beginPath();
    snakeCtx.ellipse(GRID_SIZE / 4, -GRID_SIZE / 4, 4.5, 2.5, -Math.PI / 6, 0, Math.PI * 2);
    snakeCtx.ellipse(GRID_SIZE / 4, GRID_SIZE / 4, 4.5, 2.5, Math.PI / 6, 0, Math.PI * 2);
    snakeCtx.fill();

    // Pupils (vertical slits)
    snakeCtx.fillStyle = '#000';
    snakeCtx.fillRect(GRID_SIZE / 4 + 1, -GRID_SIZE / 4 - 2.5, 1.2, 5);
    snakeCtx.fillRect(GRID_SIZE / 4 + 1, GRID_SIZE / 4 - 2.5, 1.2, 5);

    // Eye Highlights (for a more alive look)
    snakeCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    snakeCtx.beginPath();
    snakeCtx.arc(GRID_SIZE / 4 + 2, -GRID_SIZE / 4 - 1, 1, 0, Math.PI * 2);
    snakeCtx.arc(GRID_SIZE / 4 + 2, GRID_SIZE / 4 - 1, 1, 0, Math.PI * 2);
    snakeCtx.fill();

    snakeCtx.restore();
}

function drawBodyPart(x: number, y: number, index: number, isTail: boolean) {
    snakeCtx.fillStyle = '#2ed573';
    const size = isTail ? GRID_SIZE * 0.6 : GRID_SIZE * 0.9;
    const offset = (GRID_SIZE - size) / 2;
    
    snakeCtx.beginPath();
    snakeCtx.roundRect(x + offset, y + offset, size, size, isTail ? 10 : 5);
    snakeCtx.fill();
    
    // Add some pattern/shading to body
    if (index % 2 === 0) {
        snakeCtx.fillStyle = '#26af5f';
        snakeCtx.beginPath();
        snakeCtx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, size / 4, 0, Math.PI * 2);
        snakeCtx.fill();
    }
}

function drawFood() {
    snakeCtx.fillStyle = '#ff4757';
    snakeCtx.beginPath();
    snakeCtx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    snakeCtx.fill();
    
    // Leaf
    snakeCtx.fillStyle = '#2ed573';
    snakeCtx.beginPath();
    snakeCtx.ellipse(food.x + GRID_SIZE / 2 + 2, food.y + 2, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    snakeCtx.fill();
}

function endSnake() {
    snakeGameActive = false;
    snakeGameOverScreen.style.display = 'block';
    snakeResultTitle.textContent = "Game Over!";
    snakeResultMsg.textContent = `Final Score: ${snakeScore}`;
}

function resizeSnakeCanvas() {
    const container = document.getElementById('snake-container');
    if (container) {
        snakeCanvas.width = Math.floor(container.clientWidth / GRID_SIZE) * GRID_SIZE;
        snakeCanvas.height = Math.floor(container.clientHeight / GRID_SIZE) * GRID_SIZE;
    }
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!snakeGameActive) return;

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (e.key === 'ArrowUp' && !goingDown) {
        nextDx = 0;
        nextDy = -GRID_SIZE;
        e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !goingUp) {
        nextDx = 0;
        nextDy = GRID_SIZE;
        e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && !goingRight) {
        nextDx = -GRID_SIZE;
        nextDy = 0;
        e.preventDefault();
    }
    if (e.key === 'ArrowRight' && !goingLeft) {
        nextDx = GRID_SIZE;
        nextDy = 0;
        e.preventDefault();
    }
});

window.addEventListener('resize', resizeSnakeCanvas);
(window as any).startSnake = startSnake;

document.addEventListener('DOMContentLoaded', () => {
    resizeSnakeCanvas();
    // Initial draw for start screen
    snakeCtx.fillStyle = '#1e2d1e';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    drawBackground();
});