const gameCanvas = document.getElementById('gameCanvas');
const foodCount = 20;
const bombCount = 5;
const balls = [];
let bombs = [];
let foods = [];
const speed = 3;
const player = document.createElement('div');
player.className = 'player';
gameCanvas.appendChild(player);

// Timer elements
let timerElement = document.createElement('div');
timerElement.className = 'timer';
timerElement.style.position = 'absolute';
timerElement.style.top = '10px';
timerElement.style.right = '10px';
timerElement.style.color = 'white';
timerElement.style.fontSize = '24px';
gameCanvas.appendChild(timerElement);

// Mouse tracking variables
let mouseX = 0;
let mouseY = 0;
let startTime = 0;
let elapsedTime = 0;
let timerInterval;

// Initialize time on reset
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display every second
function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timerElement.innerText = `Time: ${elapsedTime}s`;
}

function createFood() {
    for (let i = 0; i < foodCount; i++) {
        const food = document.createElement('div');
        food.className = 'food';
        gameCanvas.appendChild(food);
        foods.push({
            el: food,
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * window.innerHeight,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2
        });
    }
}

function createBombs() {
    for (let i = 0; i < bombCount; i++) {
        const bomb = document.createElement('div');
        bomb.className = 'bomb';
        gameCanvas.appendChild(bomb);
        bombs.push({
            el: bomb,
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * window.innerHeight,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2
        });
    }
}

function moveEntities() {
    // Move bombs
    bombs.forEach(bomb => {
        bomb.posX += bomb.velocityX * speed;
        bomb.posY += bomb.velocityY * speed;

        if (bomb.posX + bomb.el.offsetWidth > window.innerWidth || bomb.posX < 0) {
            bomb.velocityX *= -1;
        }
        if (bomb.posY + bomb.el.offsetHeight > window.innerHeight || bomb.posY < 0) {
            bomb.velocityY *= -1;
        }

        bomb.el.style.transform = `translate(${bomb.posX}px, ${bomb.posY}px)`;
    });

    // Move food
    foods.forEach(food => {
        food.posX += food.velocityX * speed;
        food.posY += food.velocityY * speed;

        if (food.posX + food.el.offsetWidth > window.innerWidth || food.posX < 0) {
            food.velocityX *= -1;
        }
        if (food.posY + food.el.offsetHeight > window.innerHeight || food.posY < 0) {
            food.velocityY *= -1;
        }

        food.el.style.transform = `translate(${food.posX}px, ${food.posY}px)`;
    });

    // Move player (smoothly)
    player.style.transform = `translate(${mouseX - player.offsetWidth / 2}px, ${mouseY - player.offsetHeight / 2}px)`;

    detectCollision();
    requestAnimationFrame(moveEntities);
}

function resetGame() {
    foods.forEach(food => gameCanvas.removeChild(food.el));
    bombs.forEach(bomb => gameCanvas.removeChild(bomb.el));

    foods = [];
    bombs = [];

    createFood();
    createBombs();

    // Initialize player size on reset
    player.style.width = '30px';
    player.style.height = '30px';

    // Reset timer on game reset
    resetTimer();
}

function detectCollision() {
    const playerRect = player.getBoundingClientRect();

    // Collision with food
    for (let i = 0; i < foods.length; i++) {
        const foodRect = foods[i].el.getBoundingClientRect();
        if (
            playerRect.left < foodRect.right &&
            playerRect.right > foodRect.left &&
            playerRect.top < foodRect.bottom &&
            playerRect.bottom > foodRect.top
        ) {
            // Increase player size when eating food
            const newSize = parseInt(player.style.width) + 10 + 'px';
            player.style.width = newSize;
            player.style.height = newSize;
            gameCanvas.removeChild(foods[i].el);
            foods.splice(i, 1);

            if(foods.length==0){
                alert(`Victory! You finished in ${elapsedTime} seconds.`)
                resetGame();
            }
            break;
        }
    }

    // Collision with bombs
    for (let bomb of bombs) {
        const bombRect = bomb.el.getBoundingClientRect();
        if (
            playerRect.left < bombRect.right &&
            playerRect.right > bombRect.left &&
            playerRect.top < bombRect.bottom &&
            playerRect.bottom > bombRect.top
        ) {
            alert(`Game Over! You lasted ${elapsedTime} seconds.`);
            resetGame();
            break;
        }
    }
}

// Track mouse movement but move player inside requestAnimationFrame
gameCanvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Initialize player size on game start
function initializeGame() {
    player.style.width = '30px';
    player.style.height = '30px';
    createFood();
    createBombs();
    resetTimer();
    moveEntities();
}

// Start the game
initializeGame();
