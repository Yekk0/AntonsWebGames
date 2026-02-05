"use strict";

const container = document.getElementById('game-container');
const target = document.getElementById('game-target');
const target2 = document.getElementById('game-target2');
const target3 = document.getElementById('game-target3');
const target4 = document.getElementById('game-target4');
const target5 = document.getElementById('game-target5');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const winStreakDisplay = document.getElementById('win-streak');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const gameResultTitle = document.getElementById('game-result-title');
const gameResultMsg = document.getElementById('game-result-msg');
let score = 0;
let winStreak = 0;
let timeLeft = 60;
let gameActive = false;
let timer1, timer2, timer3, timer4, timer5;
let countdownInterval;
let currentMimicType = 0; // 0: Red, 1: Green, 2: Black, 3: Purple
const palette = ['#ff4757', '#2ed573', '#2f3542', '#8e44ad']; // Red, Green, Black, Purple
const intervals = [500, 800, 1500, 1200]; // Matching Target 1, 2, 3, 4 speeds
function getWinMessage() {
    let msg = `Congratulations! You reached the winning score of 20 points or more.<br>Final Score: ${score}`;
    if (winStreak >= 2) {
        msg += `<br><strong>Winstreak: ${winStreak}!</strong>`;
    }
    return msg;
}
function getLoseMessage() {
    return `Time's up! You needed 20 points to win.<br>Final Score: ${score}`;
}
function updateTimer() {
    if (!gameActive || !timerDisplay)
        return;
    timeLeft--;
    timerDisplay.textContent = timeLeft.toString();
    if (timeLeft <= 0) {
        endGame();
    }
}
function endGame() {
    gameActive = false;
    window.clearTimeout(timer1);
    window.clearTimeout(timer2);
    window.clearTimeout(timer3);
    window.clearTimeout(timer4);
    window.clearTimeout(timer5);
    window.clearInterval(countdownInterval);
    if (target)
        target.style.display = 'none';
    if (target2)
        target2.style.display = 'none';
    if (target3)
        target3.style.display = 'none';
    if (target4)
        target4.style.display = 'none';
    if (target5)
        target5.style.display = 'none';
    if (finalScoreDisplay)
        finalScoreDisplay.textContent = score.toString();
    if (gameResultTitle && gameResultMsg) {
        if (score >= 20) {
            winStreak++;
            gameResultTitle.textContent = "You Win!";
            gameResultTitle.style.color = "#2ed573";
            gameResultMsg.innerHTML = getWinMessage();
        }
        else {
            winStreak = 0;
            gameResultTitle.textContent = "You Lost!";
            gameResultTitle.style.color = "#ff4757";
            gameResultMsg.innerHTML = getLoseMessage();
        }
        if (winStreakDisplay)
            winStreakDisplay.textContent = winStreak.toString();
    }
    if (gameOverScreen)
        gameOverScreen.style.display = 'block';
}
function startAboutGame() {
    console.log("startAboutGame called");
    score = 0;
    timeLeft = 60;
    gameActive = true;
    if (scoreDisplay)
        scoreDisplay.textContent = score.toString();
    if (timerDisplay)
        timerDisplay.textContent = timeLeft.toString();
    if (gameOverScreen)
        gameOverScreen.style.display = 'none';
    if (target)
        target.style.display = 'flex';
    if (target2)
        target2.style.display = 'flex';
    if (target3)
        target3.style.display = 'flex';
    if (target4)
        target4.style.display = 'flex';
    if (target5)
        target5.style.display = 'flex';
    moveTarget1();
    moveTarget2();
    moveTarget3();
    moveTarget4();
    moveTarget5();
    window.clearInterval(countdownInterval);
    countdownInterval = window.setInterval(updateTimer, 1000);
}
function moveTarget1() {
    if (!gameActive || !container || !target)
        return;
    const maxX = container.clientWidth - target.offsetWidth;
    const maxY = container.clientHeight - target.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';
    window.clearTimeout(timer1);
    timer1 = window.setTimeout(moveTarget1, 500);
}
function moveTarget2() {
    if (!gameActive || !container || !target2)
        return;
    const maxX = container.clientWidth - target2.offsetWidth;
    const maxY = container.clientHeight - target2.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    target2.style.left = randomX + 'px';
    target2.style.top = randomY + 'px';
    window.clearTimeout(timer2);
    timer2 = window.setTimeout(moveTarget2, 800);
}
function moveTarget3() {
    if (!gameActive || !container || !target3)
        return;
    const maxX = container.clientWidth - target3.offsetWidth;
    const maxY = container.clientHeight - target3.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    target3.style.left = randomX + 'px';
    target3.style.top = randomY + 'px';
    window.clearTimeout(timer3);
    timer3 = window.setTimeout(moveTarget3, 1500);
}
function moveTarget4() {
    if (!gameActive || !container || !target4)
        return;
    const maxX = container.clientWidth - target4.offsetWidth;
    const maxY = container.clientHeight - target4.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    target4.style.left = randomX + 'px';
    target4.style.top = randomY + 'px';
    window.clearTimeout(timer4);
    timer4 = window.setTimeout(moveTarget4, 1200);
}
function moveTarget5() {
    if (!gameActive || !container || !target5)
        return;
    const maxX = container.clientWidth - target5.offsetWidth;
    const maxY = container.clientHeight - target5.offsetHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    target5.style.left = randomX + 'px';
    target5.style.top = randomY + 'px';
    // Mimic a random target type (0: Red, 1: Green, 2: Black, 3: Purple)
    currentMimicType = Math.floor(Math.random() * palette.length);
    target5.style.backgroundColor = palette[currentMimicType];
    // Copy the icon (text content) from the corresponding target
    let templateTarget = null;
    if (currentMimicType === 0)
        templateTarget = target;
    else if (currentMimicType === 1)
        templateTarget = target2;
    else if (currentMimicType === 2)
        templateTarget = target3;
    else if (currentMimicType === 3)
        templateTarget = target4;
    if (templateTarget && templateTarget.textContent !== null) {
        target5.textContent = templateTarget.textContent;
    }
    window.clearTimeout(timer5);
    timer5 = window.setTimeout(moveTarget5, intervals[currentMimicType]);
}
// Removed duplicate expose line at the bottom
// window.startAboutGame = startAboutGame;
window.startPong = window.startPong;
window.startSnake = window.startSnake;
window.startDino = window.startDino;

if (target) {
    target.addEventListener('click', () => {
        if (!gameActive)
            return;
        score += 2;
        if (scoreDisplay)
            scoreDisplay.textContent = score.toString();
        moveTarget1();
    });
}
if (target2) {
    target2.addEventListener('click', () => {
        if (!gameActive)
            return;
        score++;
        if (scoreDisplay)
            scoreDisplay.textContent = score.toString();
        moveTarget2();
    });
}
if (target3) {
    target3.addEventListener('click', () => {
        if (!gameActive)
            return;
        score--;
        if (scoreDisplay)
            scoreDisplay.textContent = score.toString();
        moveTarget3();
    });
}
if (target4) {
    target4.addEventListener('click', () => {
        if (!gameActive)
            return;
        // 25% chance of +1, -1, +2, or -2
        const rand = Math.random();
        if (rand < 0.25) {
            score += 1;
        }
        else if (rand < 0.5) {
            score -= 1;
        }
        else if (rand < 0.75) {
            score += 2;
        }
        else {
            score -= 2;
        }
        if (scoreDisplay)
            scoreDisplay.textContent = score.toString();
        moveTarget4();
    });
}
if (target5) {
    target5.addEventListener('click', () => {
        if (!gameActive)
            return;
        // Apply scoring logic based on which ball we are currently mimicking
        if (currentMimicType === 0) { // Red
            score += 2;
        }
        else if (currentMimicType === 1) { // Green
            score += 1;
        }
        else if (currentMimicType === 2) { // Black
            score -= 1;
        }
        else if (currentMimicType === 3) { // Purple (Gamble)
            const rand = Math.random();
            if (rand < 0.25) {
                score += 1;
            }
            else if (rand < 0.5) {
                score -= 1;
            }
            else if (rand < 0.75) {
                score += 2;
            }
            else {
                score -= 2;
            }
        }
        if (scoreDisplay)
            scoreDisplay.textContent = score.toString();
        moveTarget5();
    });
}
// Global expose for button click at the end of file
window.startAboutGame = startAboutGame;
console.log("about.js loaded: startAboutGame exposed to window");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, hiding targets");
    if (target)
        target.style.display = 'none';
    if (target2)
        target2.style.display = 'none';
    if (target3)
        target3.style.display = 'none';
    if (target4)
        target4.style.display = 'none';
    if (target5)
        target5.style.display = 'none';
});
