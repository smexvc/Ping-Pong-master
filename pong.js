const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Constants
const PADDLE_WIDTH = 15, PADDLE_HEIGHT = 100, BALL_SIZE = 15;
const WINNING_SCORE = 5;

// Game objects
let paddleA = { x: 0, y: canvas.height / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
let paddleB = { x: canvas.width - PADDLE_WIDTH, y: canvas.height / 2 - PADDLE_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
let ball = { x: canvas.width / 2, y: canvas.height / 2, width: BALL_SIZE, height: BALL_SIZE, speedX: 0, speedY: 0 };

// Scores
let scoreA = 0;
let scoreB = 0;

// Control variables
let paddleSpeed = 5;
let ballSpeed = 5; // Adjusted for better playability
let regularSpeed = 5;

// Player movement flags
let isPlayerAPressingUp = false;
let isPlayerAPressingDown = false;
let isPlayerBPressingUp = false;
let isPlayerBPressingDown = false;

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;

    // Set a fixed initial speed (adjust as needed)
    const fixedSpeed = 2;

    // Generate random angle between -45 and 45 degrees
    let angle = Math.random() * Math.PI / 4 - Math.PI / 8;

    // Set initial speeds based on the angle
    ball.speedX = Math.cos(angle) * fixedSpeed;
    ball.speedY = Math.sin(angle) * fixedSpeed;
}

// Initialize game
resetBall();

// Handle keyboard events
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") isPlayerBPressingUp = true;
    if (event.key === "ArrowDown") isPlayerBPressingDown = true;
    if (event.key === "w") isPlayerAPressingUp = true;
    if (event.key === "s") isPlayerAPressingDown = true;
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp") isPlayerBPressingUp = false;
    if (event.key === "ArrowDown") isPlayerBPressingDown = false;
    if (event.key === "w") isPlayerAPressingUp = false;
    if (event.key === "s") isPlayerAPressingDown = false;
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(paddleA.x, Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleA.y)), paddleA.width, paddleA.height);
    ctx.fillRect(paddleB.x, Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleB.y)), paddleB.width, paddleB.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Draw net
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw scores
    ctx.font = "74px Arial";
    ctx.fillText(scoreA, canvas.width / 4, 75);
    ctx.fillText(scoreB, 3 * canvas.width / 4, 75);
}

// Update game state
function update() {
    // Paddle movement
    if (isPlayerBPressingUp) paddleB.y -= paddleSpeed;
    if (isPlayerBPressingDown) paddleB.y += paddleSpeed;
    if (isPlayerAPressingUp) paddleA.y -= paddleSpeed;
    if (isPlayerAPressingDown) paddleA.y += paddleSpeed;

    // Boundary check for paddles
    paddleA.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleA.y));
    paddleB.y = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleB.y));

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Boundary check for the ball
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if (ball.speedX < 0 && ball.x <= paddleA.x + PADDLE_WIDTH && ball.y > paddleA.y && ball.y < paddleA.y + PADDLE_HEIGHT) {
        ball.speedX = regularSpeed; // Set regular speed
        ball.speedY = (ball.y - (paddleA.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2) * regularSpeed; // Adjust vertical speed based on where the ball hit the paddle
    } else if (ball.speedX > 0 && ball.x + BALL_SIZE >= paddleB.x && ball.y > paddleB.y && ball.y < paddleB.y + PADDLE_HEIGHT) {
        ball.speedX = -regularSpeed; // Set regular speed
        ball.speedY = (ball.y - (paddleB.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2) * regularSpeed; // Adjust vertical speed based on where the ball hit the paddle
    }

    // Scoring
    if (ball.x <= 0) {
        scoreB++;
        resetBall();
    } else if (ball.x + BALL_SIZE >= canvas.width) {
        scoreA++;
        resetBall();
    }

    // Game over condition
    if (scoreA === WINNING_SCORE || scoreB === WINNING_SCORE) {
        alert(`Player ${scoreA === WINNING_SCORE ? "A" : "B"} wins!`);
        scoreA = 0;
        scoreB = 0;
        resetBall();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
