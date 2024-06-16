// initialize canvas
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let startButton = document.getElementById('startButton');

class Snake {
    constructor(startLength, x, y, direction) {
        this.playerBody = [];
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.height = 20;
        this.width = 20;

        // create initial snake body
        for (let i = 0; i < startLength; i++) {
            this.playerBody.push({ x: x - this.width * i, y: y });
        }
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.strokeStyle = 'black';
        for (var i = 0; i < this.playerBody.length; i++) {
            ctx.fillRect(
                this.playerBody[i].x,
                this.playerBody[i].y,
                this.height,
                this.width,
            );
            ctx.strokeRect(
                this.playerBody[i].x,
                this.playerBody[i].y,
                this.height,
                this.width,
            );
        }
    }

    move() {
        var head = { x: this.playerBody[0].x, y: this.playerBody[0].y }; // front of snake

        // move head forward
        if (this.direction === 'right') {
            head.x += this.width;
        } else if (this.direction === 'left') {
            head.x -= this.width;
        } else if (this.direction === 'up') {
            head.y -= this.height;
        } else if (this.direction === 'down') {
            head.y += this.height;
        }

        this.playerBody.unshift(head); // insert new head after movement
        this.playerBody.pop(); // remove last segment of snake
    }

    getHeadPosition() {
        return { x: this.playerBody[0].x, y: this.playerBody[0].y };
    }

    getBodyPosition() {
        return this.playerBody;
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }
}

class Food {
    constructor() {
        this.x;
        this.y;
        this.width = 20;
        this.height = 20;
        this.foodSpawned = false;

        if (!this.foodSpawned) {
            this.generateNewPosition();

            this.foodSpawned = true;
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    generateNewPosition() {
        this.x = Math.floor((Math.random() * canvas.width) / 20) * 20;
        this.y = Math.floor((Math.random() * canvas.height) / 20) * 20;
        for (let i = 0; i < snake.playerBody.length; i++) {
            if (
                this.x === snake.playerBody[i].x &&
                this.y === snake.playerBody[i].y
            ) {
                this.generateNewPosition();
            }
        }
        console.log('food spawned at:', this.x, this.y);
    }
}

class CollisionDetection {
    constructor(snake, food) {
        this.snake = snake;
        this.food = food;
    }

    borderCollision() {
        if (
            this.snake.getHeadPosition().x < 0 ||
            this.snake.getHeadPosition().x > canvas.width - this.snake.width ||
            this.snake.getHeadPosition().y < 0 ||
            this.snake.getHeadPosition().y > canvas.height - this.snake.height
        ) {
            gameState = 'gameOver';
        }
    }

    foodCollision() {
        if (
            this.snake.getHeadPosition().x === this.food.getPosition().x &&
            this.snake.getHeadPosition().y === this.food.getPosition().y
        ) {
            // add new segment to snake with same position as last segment
            this.snake.playerBody.push({
                x: this.snake.playerBody[this.snake.playerBody.length - 1].x, // -1 because of 0 index
                y: this.snake.playerBody[this.snake.playerBody.length - 1].y,
            });
            this.food.generateNewPosition();
            score++;
            document.getElementById('score').innerText = 'Score: ' + score;
        }
    }

    bodyCollision() {
        for (let i = 1; i < this.snake.playerBody.length; i++) {
            if (
                this.snake.getHeadPosition().x === this.snake.playerBody[i].x &&
                this.snake.getHeadPosition().y === this.snake.playerBody[i].y
            ) {
                gameState = 'gameOver';
            }
        }
    }
}

// game variables
let gameState = 'paused';
const fps = 1000 / 10; // used to control game speed
var actionLock = false; // prevent multiple actions in one frame
let score = 0;
const snake = new Snake(5, canvas.width / 2, canvas.height / 2, 'right');
const food = new Food();
const collision = new CollisionDetection(snake, food);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    actionLock = false;
    snake.draw();
    food.draw();

    if (gameState === 'paused') {
        // implement wait for key press to start game
        startButton.addEventListener('click', function () {
            document.getElementById('pauseMenu').style.display = 'none';
            gameState = 'running';
            requestAnimationFrame(gameLoop);
        });
    }

    if (gameState === 'running') {
        setTimeout(function () {
            snake.move();
            collision.borderCollision();
            collision.foodCollision();
            collision.bodyCollision();

            console.log(snake.getHeadPosition());

            //console.log(snake.getBodyPosition());
            requestAnimationFrame(gameLoop); // loop game
        }, fps);
    }

    if (gameState === 'gameOver') {
        // implement game over screen
        console.log('Game Over');
    }
}

// listen for key presses and define rules for snake movement
document.addEventListener('keydown', function (event) {
    if (!actionLock) {
        if (event.key === 'ArrowRight' && snake.direction !== 'left') {
            snake.changeDirection('right');
            actionLock = true;
        } else if (event.key === 'ArrowLeft' && snake.direction !== 'right') {
            snake.changeDirection('left');
            actionLock = true;
        } else if (event.key === 'ArrowUp' && snake.direction !== 'down') {
            snake.changeDirection('up');
            actionLock = true;
        } else if (event.key === 'ArrowDown' && snake.direction !== 'up') {
            snake.changeDirection('down');
            actionLock = true;
        }
    }
});

// run game
gameLoop();
