const pongCanvas = document.getElementById('pong-canvas') as HTMLCanvasElement;
const pongCtx = pongCanvas.getContext('2d')!;
const playerDisplay = document.getElementById('player-score') as HTMLSpanElement;
const aiDisplay = document.getElementById('ai-score') as HTMLSpanElement;
const pongGameOverScreen = document.getElementById('pong-game-over') as HTMLDivElement;
const pongResultTitle = document.getElementById('pong-result-title') as HTMLHeadingElement;
const pongResultMsg = document.getElementById('pong-result-msg') as HTMLParagraphElement;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 8;
const BALL_SIZE = 10;
const WINNING_SCORE = 5;

let keys: { [key: string]: boolean } = {};
let playerY = 150;
let aiY = 150;
let playerScore = 0;
let aiScore = 0;
let ballX = 300;
let ballY = 200;
let ballSpeedX = 4;
let ballSpeedY = 4;
let pongActive = false;
let animationId: number;

function startPong() {
    playerScore = 0;
    aiScore = 0;
    updatePongScore();
    pongGameOverScreen.style.display = 'none';
    resetBall();
    pongActive = true;
    if (animationId) cancelAnimationFrame(animationId);
    requestAnimationFrame(gameLoop);
}

function resetBall() {
    ballX = pongCanvas.width / 2;
    ballY = pongCanvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() - 0.5) * 8;
}

function updatePongScore() {
    playerDisplay.textContent = playerScore.toString();
    aiDisplay.textContent = aiScore.toString();
}

function gameLoop() {
    if (!pongActive) return;

    update();
    draw();

    animationId = requestAnimationFrame(gameLoop);
}

function update() {
    // Keyboard movement
    if (keys['ArrowUp']) {
        playerY -= PADDLE_SPEED;
    }
    if (keys['ArrowDown']) {
        playerY += PADDLE_SPEED;
    }

    // Keep player paddle in bounds
    if (playerY < 0) playerY = 0;
    if (playerY > pongCanvas.height - PADDLE_HEIGHT) playerY = pongCanvas.height - PADDLE_HEIGHT;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top/bottom)
    if (ballY < 0 || ballY > pongCanvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // AI movement
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 35) {
        aiY += 4;
    } else if (aiCenter > ballY + 35) {
        aiY -= 4;
    }

    // Paddle collision (Player)
    if (ballX < PADDLE_WIDTH) {
        if (ballY > playerY && ballY < playerY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            const deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.3;
        } else {
            aiScore++;
            updatePongScore();
            if (aiScore >= WINNING_SCORE) {
                endPong(false);
            } else {
                resetBall();
            }
        }
    }

    // Paddle collision (AI)
    if (ballX > pongCanvas.width - PADDLE_WIDTH) {
        if (ballY > aiY && ballY < aiY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            const deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.3;
        } else {
            playerScore++;
            updatePongScore();
            if (playerScore >= WINNING_SCORE) {
                endPong(true);
            } else {
                resetBall();
            }
        }
    }
}

function draw() {
    // Clear canvas
    pongCtx.fillStyle = '#000';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

    // Draw paddles
    pongCtx.fillStyle = '#fff';
    pongCtx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    pongCtx.fillRect(pongCanvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    pongCtx.beginPath();
    pongCtx.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2);
    pongCtx.fill();

    // Draw center line
    pongCtx.setLineDash([5, 15]);
    pongCtx.beginPath();
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.strokeStyle = '#fff';
    pongCtx.stroke();
}

function endPong(playerWin: boolean) {
    pongActive = false;
    pongGameOverScreen.style.display = 'block';
    pongResultTitle.textContent = playerWin ? "You Win!" : "AI Wins!";
    pongResultTitle.style.color = playerWin ? "#2ed573" : "#ff4757";
    pongResultMsg.textContent = `Final Score: ${playerScore} - ${aiScore}`;
}

function resizeCanvas() {
    const container = document.getElementById('pong-container');
    if (container) {
        pongCanvas.width = container.clientWidth;
        pongCanvas.height = container.clientHeight;
    }
}

pongCanvas.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = pongCanvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = e.clientY - rect.top - root.scrollTop;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Keep paddle in bounds
    if (playerY < 0) playerY = 0;
    if (playerY > pongCanvas.height - PADDLE_HEIGHT) playerY = pongCanvas.height - PADDLE_HEIGHT;
});

// Support touch for mobile
pongCanvas.addEventListener('touchmove', (e: TouchEvent) => {
    e.preventDefault();
    const rect = pongCanvas.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    playerY = touchY - PADDLE_HEIGHT / 2;

    if (playerY < 0) playerY = 0;
    if (playerY > pongCanvas.height - PADDLE_HEIGHT) playerY = pongCanvas.height - PADDLE_HEIGHT;
}, { passive: false });

window.addEventListener('keydown', (e: KeyboardEvent) => {
    keys[e.key] = true;
    // Prevent scrolling with arrow keys
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.key] = false;
});

window.addEventListener('resize', resizeCanvas);
(window as any).startPong = startPong;

resizeCanvas();
// Remove the auto-start call to avoid issues if the element isn't ready or if we want user to start it.
// Actually, about.ts starts automatically too.
// I will keep it but wrap it in anDOMContentLoaded listener for safety if it's not already.
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    // Initial draw
    pongCtx.fillStyle = '#000';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);
    pongCtx.fillStyle = '#fff';
    pongCtx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    pongCtx.fillRect(pongCanvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
});
