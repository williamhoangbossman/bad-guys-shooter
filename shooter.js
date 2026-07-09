document.addEventListener("DOMContentLoaded", () => {
    const spaceship = document.getElementById('spaceship');
    const grid = document.getElementById('grid');
    const enemy = document.getElementById('bossenemy1');
    const money = document.getElementById('minecraftDiamond')  

    
    const gridWidth = 900;
    const shipWidth = 70;

    const bossHitboxLeftOffset = 20;
    const bossHitboxTopOffset = 50;
    const bossHitboxWidth = 195;
    const bossHitboxHeight = 190;

    const visualEnemyWidth = bossHitboxLeftOffset + bossHitboxWidth;
    const visualEnemyCenter = bossHitboxLeftOffset + (bossHitboxWidth / 2);

    let enemySpeed = 6;
    let enemyX = (gridWidth / 2) - visualEnemyCenter; 
    let enemyY = 20;

    if (enemy) {
        enemy.style.left = enemyX + 'px';
        enemy.style.top = enemyY + 'px';
        
        enemy.style.transformOrigin = `${visualEnemyCenter}px center`;
    }
    
    let shipX = (gridWidth / 2) - (shipWidth / 2); 
    let shipY = 475; 

    spaceship.style.left = shipX + 'px';
    spaceship.style.top = shipY + 'px';

    const keysPressed = {
        ArrowLeft: false,
        ArrowRight: false,
        a: false,
        d: false,
        ' ': false
    };

    const bullets = [];
    let lastShotTime = 0;
    const fireCooldown = 500;
    const bulletSpeed = 5;

    window.addEventListener('keydown', (e) => {
        const key = e.key === ' ' ? ' ' : e.key;
        if (key in keysPressed) {
            keysPressed[key] = true;
            if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key === ' ' ? ' ' : e.key;
        if (key in keysPressed) {
            keysPressed[key] = false;
        }
    });

    function fireBullet() {
        const now = Date.now();
        if (now - lastShotTime < fireCooldown) return;

        lastShotTime = now;

        const bulletElement = document.createElement('div');
        bulletElement.className = 'bullet';

        const bulletX = shipX + (shipWidth / 2) - 5; 
        const bulletY = shipY - 60; 

        bulletElement.style.left = bulletX + 'px';
        bulletElement.style.top = bulletY + 'px';

        grid.appendChild(bulletElement);

        bullets.push({
            element: bulletElement,
            x: bulletX,
            y: bulletY
        });
    }

    function gameLoop() {
        if (keysPressed.ArrowLeft || keysPressed.a) {
            shipX -= 3.5;
        }
        if (keysPressed.ArrowRight || keysPressed.d) {
            shipX += 3.5;
        }

        if (shipX < 0) {
            shipX = 0;
        }
        if (shipX > gridWidth - shipWidth) {
            shipX = gridWidth - shipWidth;
        }
        spaceship.style.left = shipX + 'px';

        if (enemy) {
            enemyX += enemySpeed;

            if (enemyX + visualEnemyWidth > gridWidth) {
                enemyX = gridWidth - visualEnemyWidth;
                enemySpeed = -enemySpeed;
            } else if (enemyX + bossHitboxLeftOffset < 0) {
                enemyX = -bossHitboxLeftOffset;
                enemySpeed = -enemySpeed; 
            }

            if (enemySpeed > 0) {
                enemy.style.transform = 'scaleX(1)'; 
            } else if (enemySpeed < 0) {
                enemy.style.transform = 'scaleX(-1)';
            }

            enemy.style.left = enemyX + 'px';
        }

        if (keysPressed[' ']) {
            fireBullet();
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            
            bullet.y -= bulletSpeed;
            bullet.element.style.top = bullet.y + 'px';

            if (enemy) {
                const bulletWidth = 10;
                const bulletHeight = 60;
                
                const bossLeft = enemyX + bossHitboxLeftOffset;
                const bossRight = bossLeft + bossHitboxWidth;
                const bossTop = enemyY + bossHitboxTopOffset;
                const bossBottom = bossTop + bossHitboxHeight;

                if (
                    bullet.x + bulletWidth >= bossLeft &&
                    bullet.x <= bossRight &&
                    bullet.y <= bossBottom &&
                    bullet.y + bulletHeight >= bossTop
                ) { 
                    bullet.element.remove();
                    bullets.splice(i, 1);
                    continue;
                }
            }

            if (bullet.y < 0) {
                bullet.element.remove();
                bullets.splice(i, 1);
            }
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
});