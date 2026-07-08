       document.addEventListener("DOMContentLoaded", () => {
            // Get DOM Elements
            const spaceship = document.getElementById('spaceship');
            const grid = document.getElementById('grid');
            const gridWidth = 900;
            const shipWidth = 73; // Updated to match the CSS width

            // Starting Position (Centered horizontally, sitting near the bottom)
            let shipX = (gridWidth / 2) - (shipWidth / 2); // 413.5px
            let shipY = 475; // Updated to 150px up from the bottom of the 600px grid (475px)

            // Apply initial starting positions
            spaceship.style.left = shipX + 'px';
            spaceship.style.top = shipY + 'px';

            // Track which keys are currently being held down
            const keysPressed = {
                ArrowLeft: false,
                ArrowRight: false,
                a: false,
                d: false,
                ' ': false // Track Spacebar
            };

            // Bullet configuration & limits
            const bullets = [];
            let lastShotTime = 0;
            const fireCooldown = 500; // Milliseconds between shots
            const bulletSpeed = 7;     // Pixels per frame

            // Listen for keydown
            window.addEventListener('keydown', (e) => {
                const key = e.key === ' ' ? ' ' : e.key;
                if (key in keysPressed) {
                    keysPressed[key] = true;
                    // Prevent page scrolling with Spacebar or Arrow Keys
                    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                    }
                }
            });

            // Listen for keyup
            window.addEventListener('keyup', (e) => {
                const key = e.key === ' ' ? ' ' : e.key;
                if (key in keysPressed) {
                    keysPressed[key] = false;
                }
            });

            // Bullet firing logic
            function fireBullet() {
                const now = Date.now();
                // Check cooldown limits
                if (now - lastShotTime < fireCooldown) return;

                lastShotTime = now;

                // Create a new bullet element
                const bulletElement = document.createElement('div');
                bulletElement.className = 'bullet';

                // Calculate middle point of 73px ship
                // Centers the 10px wide bullet: (73 / 2) - (10 / 2) = 36.5 - 5 = 31.5px offset
                const bulletX = shipX + (shipWidth / 2) - 5; 
                const bulletY = shipY - 60; // Placed right above the nose of the ship (height is 60px)

                // Position the bullet
                bulletElement.style.left = bulletX + 'px';
                bulletElement.style.top = bulletY + 'px';

                // Append the bullet to the container
                grid.appendChild(bulletElement);

                // Add to active bullets array
                bullets.push({
                    element: bulletElement,
                    x: bulletX,
                    y: bulletY
                });
            }

            // The Game Loop
            function gameLoop() {
                // Move Left (3.5 pixels at a time)
                if (keysPressed.ArrowLeft || keysPressed.a) {
                    shipX -= 3.5;
                }
                
                // Move Right (3.5 pixels at a time)
                if (keysPressed.ArrowRight || keysPressed.d) {
                    shipX += 3.5;
                }

                // ---- BOUNDARY CHECKS ----
                // Stop at Left Wall (0)
                if (shipX < 0) {
                    shipX = 0;
                }
                // Stop at Right Wall (Grid Width minus the Ship Width)
                if (shipX > gridWidth - shipWidth) {
                    shipX = gridWidth - shipWidth;
                }

                // Update the spaceship's visual position on the screen
                spaceship.style.left = shipX + 'px';

                // Check and trigger firing mechanism
                if (keysPressed[' ']) {
                    fireBullet();
                }

                // Update and clean up bullets
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const bullet = bullets[i];
                    
                    // Move bullet upward
                    bullet.y -= bulletSpeed;
                    bullet.element.style.top = bullet.y + 'px';

                    // If bullet flies past top boundary (height is 60px)
                    if (bullet.y < -80) {
                        bullet.element.remove();
                        bullets.splice(i, 1);
                    }
                }

                // Keep the loop cycling smoothly
                requestAnimationFrame(gameLoop);
            }

            // Fire up the engine!
            requestAnimationFrame(gameLoop);
       });
        
       document.addEventListener('contextmenu', function (event) {
  event.preventDefault()
  return false
})