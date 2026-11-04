        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreText = document.getElementById('scoreText');
        const hiScoreText = document.getElementById('hiScoreText');

        let hiScore = parseInt(localStorage.getItem('wineshop_arcade_hiscore'), 10) || 0;
        hiScoreText.textContent = hiScore;

        const imgPlayerStanding = new Image();
        imgPlayerStanding.src = "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 64">
                <ellipse cx="22" cy="18" rx="8" ry="9" fill="#F3D0B5" />
                <path d="M12 12 Q22 4 32 10 Q34 16 22 15 Z" fill="#722F37" />
                <circle cx="28" cy="8" r="3" fill="#CFB53B" />
                <circle cx="28" cy="19" r="3" fill="#D32F2F" />
                <circle cx="25" cy="15" r="1.5" fill="#1A1A1A" />
                <path d="M14 26 L30 24 L28 46 L12 44 Z" fill="#4A1E24" />
                <path d="M22 25 L18 45" stroke="#FFFFFF" stroke-width="2" />
                <path d="M14 44 L11 58 L7 62" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M26 45 L29 57 L34 61" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M14 30 L4 36 L6 42" stroke="#4A1E24" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M4 42 L8 42 L7 48 L5 48 Z" fill="#CFB53B" />
            </svg>
        `);

        const imgPlayerDucking = new Image();
        imgPlayerDucking.src = "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 34">
                <ellipse cx="42" cy="16" rx="8" ry="9" fill="#F3D0B5" />
                <path d="M32 10 Q42 2 52 8 Q54 14 42 13 Z" fill="#722F37" />
                <circle cx="48" cy="6" r="3" fill="#CFB53B" />
                <circle cx="48" cy="17" r="3" fill="#D32F2F" />
                <circle cx="45" cy="13" r="1.5" fill="#1A1A1A" />
                <path d="M16 14 L36 12 L34 26 L14 28 Z" fill="#4A1E24" />
                <path d="M14 26 L6 30 L2 30" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M24 26 L16 32 L8 32" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round" fill="none" />
                <path d="M36 18 L48 24 L52 24" stroke="#4A1E24" stroke-width="3" stroke-linecap="round" fill="none" />
                <rect x="50" y="21" width="5" height="6" fill="#CFB53B" />
            </svg>
        `);

        const imgWineBottle = new Image();
        imgWineBottle.src = "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 50">
                <rect x="10" y="2" width="4" height="10" fill="#722F37" rx="1" />
                <rect x="9" y="0" width="6" height="3" fill="#CFB53B" rx="1" />
                <path d="M10 12 C10 18, 4 20, 4 26 L4 46 C4 48, 20 48, 20 46 L20 26 C20 20, 14 18, 14 12 Z" fill="#722F37" />
                <rect x="5" y="27" width="14" height="14" fill="#F1EFEA" rx="2" />
                <line x1="8" y1="34" x2="16" y2="34" stroke="#722F37" stroke-width="2" />
            </svg>
        `);

        const imgBeerCan = new Image();
        imgBeerCan.src = "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 26">
                <path d="M2 14 Q10 2 16 10 Q10 18 2 14 Z" fill="#FFFFFF" opacity="0.8" stroke="#B3B3B3" />
                <path d="M32 14 Q24 2 18 10 Q24 18 32 14 Z" fill="#FFFFFF" opacity="0.8" stroke="#B3B3B3" />
                <rect x="11" y="5" width="12" height="18" rx="2" fill="#CFB53B" stroke="#9E8825" stroke-width="1" />
                <line x1="11" y1="11" x2="23" y2="11" stroke="#D32F2F" stroke-width="2" />
                <ellipse cx="17" cy="5" rx="5" ry="2" fill="#EAE6DF" />
            </svg>
        `);

        const FLOOR_Y = 220;
        const STANDING_HEIGHT = 58;
        const STANDING_WIDTH = 40;
        const DUCKING_HEIGHT = 32;
        const DUCKING_WIDTH = 54;

        let gameRunning = false;
        let gameOver = false;
        let scoreTicks = 0;
        let speed = 6;
        let obstacles = [];
        let obstacleTimer = 0;

        const player = {
            x: 50,
            y: FLOOR_Y - STANDING_HEIGHT,
            width: STANDING_WIDTH,
            height: STANDING_HEIGHT,
            vy: 0,
            gravity: 0.85,
            jumpPower: -14,
            grounded: true,
            ducking: false,
            wobble: 0
        };

        function getCurrentScore() {
            return Math.floor(scoreTicks / 3);
        }

        function resetGame() {
            obstacles = [];
            scoreTicks = 0;
            speed = 6;
            obstacleTimer = 70;
            gameOver = false;
            gameRunning = true;
            player.ducking = false;
            player.width = STANDING_WIDTH;
            player.height = STANDING_HEIGHT;
            player.y = FLOOR_Y - STANDING_HEIGHT;
            player.vy = 0;
            player.grounded = true;
            scoreText.textContent = "0";
            hiScoreText.textContent = hiScore;
        }

        function jump() {
            if (!gameRunning || gameOver) {
                resetGame();
                return;
            }
            if (player.grounded && !player.ducking) {
                player.vy = player.jumpPower;
                player.grounded = false;
            }
        }

        function setDucking(isDucking) {
            if (!gameRunning || gameOver) return;
            if (isDucking && player.grounded) {
                player.ducking = true;
                player.height = DUCKING_HEIGHT;
                player.width = DUCKING_WIDTH;
                player.y = FLOOR_Y - DUCKING_HEIGHT;
            } else if (!isDucking && player.ducking) {
                player.ducking = false;
                player.height = STANDING_HEIGHT;
                player.width = STANDING_WIDTH;
                player.y = FLOOR_Y - STANDING_HEIGHT;
            }
        }

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                setDucking(true);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();
                setDucking(false);
            }
        });

        canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            jump();
        });

        function spawnObstacle() {
            const currentPoints = getCurrentScore();
            const isFlying = Math.random() < 0.35 && currentPoints > 40;

            if (isFlying) {
                const flyingHeight = (Math.random() < 0.5) ? (FLOOR_Y - 50) : (FLOOR_Y - 72);
                obstacles.push({
                    type: 'can',
                    x: canvas.width + 20,
                    y: flyingHeight,
                    width: 34,
                    height: 24
                });
            } else {
                const count = Math.floor(Math.random() * 3) + 1;
                const bottleWidth = 22;
                const bottleHeight = 46;
                const spacing = 18;

                for (let i = 0; i < count; i++) {
                    obstacles.push({
                        type: 'bottle',
                        x: canvas.width + 20 + (i * spacing),
                        y: FLOOR_Y - bottleHeight,
                        width: bottleWidth,
                        height: bottleHeight
                    });
                }
            }
        }

        function update() {
            if (!gameRunning || gameOver) return;

            if (!player.ducking) {
                player.vy += player.gravity;
                player.y += player.vy;

                if (player.y >= FLOOR_Y - player.height) {
                    player.y = FLOOR_Y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                }
            } else {
                player.y = FLOOR_Y - player.height;
                player.vy = 0;
                player.grounded = true;
            }

            player.wobble += 0.15;

            obstacleTimer--;
            if (obstacleTimer <= 0) {
                spawnObstacle();
                obstacleTimer = Math.floor(Math.random() * 45) + 60;
            }

            const currentPoints = getCurrentScore();

            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obs = obstacles[i];
                obs.x -= speed;

                let px, py, pw, ph;
                if (player.ducking) {
                    px = player.x + 4;
                    py = player.y + 4;
                    pw = player.width - 8;
                    ph = player.height - 4;
                } else {
                    px = player.x + 8;
                    py = player.y + 6;
                    pw = player.width - 16;
                    ph = player.height - 8;
                }

                if (px < obs.x + obs.width &&
                    px + pw > obs.x &&
                    py < obs.y + obs.height &&
                    py + ph > obs.y) {
                    
                    gameOver = true;

                    if (currentPoints > hiScore) {
                        hiScore = currentPoints;
                        localStorage.setItem('wineshop_arcade_hiscore', hiScore.toString());
                        hiScoreText.textContent = hiScore;
                    }
                }

                if (obs.x + obs.width < -50) {
                    obstacles.splice(i, 1);
                }
            }

            scoreTicks += 1;
            scoreText.textContent = getCurrentScore();

            if (currentPoints > hiScore) {
                hiScoreText.textContent = currentPoints;
            }

            if (scoreTicks % 350 === 0 && speed < 13) {
                speed += 0.7;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, FLOOR_Y);
            ctx.lineTo(canvas.width, FLOOR_Y);
            ctx.strokeStyle = "#4D4D4D";
            ctx.lineWidth = 3;
            ctx.stroke();

            const shift = (scoreTicks * (speed / 2)) % 30;
            ctx.strokeStyle = "#B3B3B3";
            ctx.lineWidth = 1;
            for (let x = -shift; x < canvas.width; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x, FLOOR_Y + 4);
                ctx.lineTo(x + 15, FLOOR_Y + 12);
                ctx.stroke();
            }

            obstacles.forEach(obs => {
                if (obs.type === 'bottle') {
                    ctx.drawImage(imgWineBottle, obs.x, obs.y, obs.width, obs.height);
                } else {
                    ctx.drawImage(imgBeerCan, obs.x, obs.y, obs.width, obs.height);
                }
            });

            ctx.save();
            ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
            
            if (player.ducking) {
                ctx.drawImage(imgPlayerDucking, -player.width / 2, -player.height / 2, player.width, player.height);
            } else {
                if (player.grounded) {
                    ctx.rotate(Math.sin(player.wobble) * 0.12);
                } else {
                    ctx.rotate(-0.1);
                }
                ctx.drawImage(imgPlayerStanding, -player.width / 2, -player.height / 2, player.width, player.height);
            }
            ctx.restore();

            if (!gameRunning) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 20px Inter";
                ctx.textAlign = "center";
                ctx.fillText("PULSA ESPACIO O TOCA LA PANTALLA PARA EMPEZAR", canvas.width / 2, canvas.height / 2);
            } else if (gameOver) {
                ctx.fillStyle = "rgba(61, 16, 23, 0.9)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 26px 'Playfair Display'";
                ctx.textAlign = "center";
                ctx.fillText("¡TE HAS TROPEZADO!", canvas.width / 2, canvas.height / 2 - 15);
                ctx.font = "16px Inter";
                ctx.fillText("Presiona ESPACIO o toca para volver a intentarlo", canvas.width / 2, canvas.height / 2 + 25);
            }
        }

        function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
        }

        loop();