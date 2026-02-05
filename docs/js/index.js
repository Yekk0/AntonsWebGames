"use strict";
const btn = document.getElementById('random-btn');
if (btn) {
    btn.addEventListener('mouseenter', () => {
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;
        // Get current position (default to 0 if not set)
        const currentX = btn.offsetLeft;
        const currentY = btn.offsetTop;
        let randomX, randomY;
        let distance;
        // Keep generating new positions until the movement is at least 240px
        do {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
            // Calculate Euclidean distance: sqrt((x2-x1)^2 + (y2-y1)^2)
            distance = Math.sqrt(Math.pow(randomX - currentX, 2) + Math.pow(randomY - currentY, 2));
        } while (distance < 240);
        btn.style.left = randomX + 'px';
        btn.style.top = randomY + 'px';
    });
}
