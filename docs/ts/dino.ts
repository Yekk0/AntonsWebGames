const dinoCanvas = document.getElementById('dino-canvas') as HTMLCanvasElement;
const dinoCtx = dinoCanvas.getContext('2d')!;
const dinoScoreDisplay = document.getElementById('dino-score') as HTMLSpanElement;
const dinoHighScoreDisplay = document.getElementById('dino-high-score') as HTMLSpanElement;
const dinoGameOverScreen = document.getElementById('dino-game-over') as HTMLDivElement;
const dinoResultTitle = document.getElementById('dino-result-title') as HTMLHeadingElement;
const dinoResultMsg = document.getElementById('dino-result-msg') as HTMLParagraphElement;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_HEIGHT = 20;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 40;
const INITIAL_SPEED = 5;
const SPEED_INCREMENT = 0.002;

let dinoY = 0;
let dinoVelocityY = 0;
let isJumping = false;
let obstacles: { x: number, height: number }[] = [];
let gameSpeed = INITIAL_SPEED;
let dinoScore = 0;
let dinoHighScore = 0;
let dinoGameActive = false;
let dinoAnimationId: number;

function startDino() {
    resizeDinoCanvas();
    dinoY = dinoCanvas.height - GROUND_HEIGHT - DINO_HEIGHT;
    dinoVelocityY = 0;
    isJumping = false;
    obstacles = [];
    gameSpeed = INITIAL_SPEED;
    dinoScore = 0;
    updateDinoScore();
    dinoGameOverScreen.style.display = 'none';
    dinoGameActive = true;
    
    if (dinoAnimationId) cancelAnimationFrame(dinoAnimationId);
    requestAnimationFrame(dinoLoop);
}

function updateDinoScore() {
    dinoScoreDisplay.textContent = Math.floor(dinoScore).toString();
    if (dinoScore > dinoHighScore) {
        dinoHighScore = dinoScore;
        dinoHighScoreDisplay.textContent = Math.floor(dinoHighScore).toString();
    }
}

function dinoLoop() {
    if (!dinoGameActive) return;

    updateDino();
    drawDino();

    dinoAnimationId = requestAnimationFrame(dinoLoop);
}

function updateDino() {
    // Score
    dinoScore += 0.1;
    updateDinoScore();
    
    // Speed up
    gameSpeed += SPEED_INCREMENT;

    // Jump logic
    dinoVelocityY += GRAVITY;
    dinoY += dinoVelocityY;

    const groundY = dinoCanvas.height - GROUND_HEIGHT - DINO_HEIGHT;
    if (dinoY > groundY) {
        dinoY = groundY;
        dinoVelocityY = 0;
        isJumping = false;
    }

    // Obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < dinoCanvas.width - 300 - Math.random() * 300) {
        obstacles.push({
            x: dinoCanvas.width,
            height: OBSTACLE_HEIGHT + (Math.random() * 20 - 10)
        });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;

        // Collision detection
        if (
            obstacles[i].x < 50 + DINO_WIDTH &&
            obstacles[i].x + OBSTACLE_WIDTH > 50 &&
            dinoY + DINO_HEIGHT > dinoCanvas.height - GROUND_HEIGHT - obstacles[i].height
        ) {
            endDino();
        }

        if (obstacles[i].x + OBSTACLE_WIDTH < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function drawDino() {
    // Clear
    dinoCtx.fillStyle = '#fff';
    dinoCtx.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);

    // Ground
    dinoCtx.strokeStyle = '#555';
    dinoCtx.beginPath();
    dinoCtx.moveTo(0, dinoCanvas.height - GROUND_HEIGHT);
    dinoCtx.lineTo(dinoCanvas.width, dinoCanvas.height - GROUND_HEIGHT);
    dinoCtx.stroke();

    // Dino (simple rectangle for now, can be improved later)
    dinoCtx.fillStyle = '#2f3542';
    dinoCtx.fillRect(50, dinoY, DINO_WIDTH, DINO_HEIGHT);
    
    // Eye
    dinoCtx.fillStyle = '#fff';
    dinoCtx.fillRect(50 + DINO_WIDTH - 10, dinoY + 5, 4, 4);

    // Obstacles
    dinoCtx.fillStyle = '#ff4757';
    for (const obs of obstacles) {
        // Draw multiple small spikes for each obstacle
        const spikeWidth = 10;
        const numSpikes = OBSTACLE_WIDTH / spikeWidth;
        
        for (let i = 0; i < numSpikes; i++) {
            const x = obs.x + (i * spikeWidth);
            const y = dinoCanvas.height - GROUND_HEIGHT;
            
            dinoCtx.beginPath();
            dinoCtx.moveTo(x, y);
            dinoCtx.lineTo(x + spikeWidth / 2, y - obs.height);
            dinoCtx.lineTo(x + spikeWidth, y);
            dinoCtx.closePath();
            dinoCtx.fill();
        }
    }
}

function endDino() {
    dinoGameActive = false;
    dinoGameOverScreen.style.display = 'block';
    dinoResultTitle.textContent = "Game Over!";
    dinoResultMsg.textContent = `Final Score: ${Math.floor(dinoScore)}`;
}

function resizeDinoCanvas() {
    const container = document.getElementById('dino-container');
    if (container) {
        dinoCanvas.width = container.clientWidth;
        dinoCanvas.height = container.clientHeight;
    }
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'ArrowUp') && !isJumping && dinoGameActive) {
        dinoVelocityY = JUMP_FORCE;
        isJumping = true;
        e.preventDefault();
    }
});

// Touch support
dinoCanvas.addEventListener('touchstart', (e: TouchEvent) => {
    if (!isJumping && dinoGameActive) {
        dinoVelocityY = JUMP_FORCE;
        isJumping = true;
        e.preventDefault();
    }
}, { passive: false });

window.addEventListener('resize', resizeDinoCanvas);
(window as any).startDino = startDino;

document.addEventListener('DOMContentLoaded', () => {
    resizeDinoCanvas();
    // Initialize dino position for the start screen
    dinoY = dinoCanvas.height - GROUND_HEIGHT - DINO_HEIGHT;
    drawDino();
});
