const btn = document.getElementById('random-btn') as HTMLAnchorElement | null;

if (btn) {
    btn.addEventListener('mouseenter', () => {
        const maxX: number = window.innerWidth - btn.offsetWidth;
        const maxY: number = window.innerHeight - btn.offsetHeight;

        // Get current position (default to 0 if not set)
        const currentX: number = btn.offsetLeft;
        const currentY: number = btn.offsetTop;

        let randomX: number, randomY: number;
        let distance: number;

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
