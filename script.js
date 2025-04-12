let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let count = 0;
let duck = {
    x: 160,
    y: 160,
    dx: 0,
    dy: 0,
    width: 200,
    height: 175,
    health: true,
    flipX: false,
    speed: 7,
};
let balls = [];
let nextBallDelay = 5_000;
let minNextBallDelay = 2_000;
let maxNextBallDelay = 4_000;
let gameTime = 0;
const imgDuck = new Image();
imgDuck.src = "./img/duck.png";
let scoreValue = document.getElementById("count-value");
let timeValue = document.getElementById("time-value");
let gamescreen = document.getElementById("games-screen");
let playMenu = document.getElementById("play-menu");
let paused_btn = document.getElementById("paused_btn");
let defeat_btn = document.getElementById("defeat_btn");
let loginDisplay = document.getElementById("login");
let gamePaused = false;
let playBtn = document.getElementById("btn-play");

defeat_btn.addEventListener("click", () => {
    gameOver();
})

function gameOver() {
    gamePaused = true;
    setScreen("playMenu");
    updateScores();
}

function createBall() {
    let size = getRandomInt(1, 4) * 100;
    let x = Math.random() < 0.5 ? 0 - size : canvas.width;
    let y = getRandomInt(0 - size, canvas.height);
    let images = ["img/хлеб.png", "img/fish.png", "img/big_shark.png"];
    let imgSize;
    if (size === 100) {
        imgSize = images[0]
    } else if (size === 200) {
        imgSize = images[1];
    } else if (size === 300) {
        imgSize = images[2];
    }

    let ball = {
        img: imgSize,
        x: x,
        y: y,
        size: size,
        dx: (x < canvas.width / 2 - size / 2) ? getRandomFloat(0.5, 1) : getRandomFloat(-1, 0.5),
        dy: getRandomFloat(-1, 1),
        flipX: false,
        speed: getRandomFloat(1, 5),
    }
    balls.push(ball);
    console.log(balls);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

paused_btn.addEventListener("click", () => {
    if (gamePaused) {
        gamePaused = false;
        requestAnimationFrame(() => loop(Date.now()));
    } else if (!gamePaused) {
        gamePaused = true;
    }
})


function loop(prevTime) {

    const currentTime = Date.now();
    const deltaMs = currentTime - prevTime;

    gameTime += deltaMs;
    if (gamePaused === false) requestAnimationFrame(() => loop(currentTime));
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (nextBallDelay < 0) {
        createBall();
        const mod = 1 + gameTime / (100_000);
        nextBallDelay = getRandomFloat(minNextBallDelay, maxNextBallDelay) * (1 / mod);
    } else {
        nextBallDelay -= deltaMs;
    }

    duck.x += duck.dx * duck.speed;
    duck.y += duck.dy * duck.speed;
    if (count === 100) {
        duck.width = 250;
    }

    if (!duck.flipX) {
        context.translate(duck.x, duck.y);
        context.scale(-1, 1);
        context.drawImage(imgDuck, 0, 0, -duck.width, duck.height);
        context.setTransform(1, 0, 0, 1, 0, 0);
    } else {
        context.drawImage(imgDuck, duck.x, duck.y, duck.width, duck.height);
    }

    if (duck.x + duck.width > canvas.width) {
        duck.x = canvas.width - duck.width;
    } else if (duck.x < 0) {
        duck.x = 0;
    } else if (duck.y + duck.height > canvas.height) {
        duck.y = canvas.height - duck.height;
    } else if (duck.y < 0) {
        duck.y = 0;
    }

    for (let ball of balls) {
        const imgBall = new Image();
        imgBall.src = ball.img;
        if (ball.dx < 0) ball.flipX = true;
        else if (ball.dx > 0) ball.flipX = false;
        if (!ball.flipX) {
            context.translate(ball.x, ball.y);
            context.scale(-1, 1);
            context.drawImage(imgBall, 0, 0, -ball.size, ball.size);
            context.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            context.drawImage(imgBall, ball.x, ball.y, ball.size, ball.size);
        }
        ball.x += ball.dx * ball.speed;
        ball.y += ball.dy * ball.speed;
        if (ball.y + ball.size >= canvas.height) {
            ball.dy = getRandomFloat(-1, 0);
        } else if (ball.y <= 0) {
            ball.dy = getRandomFloat(0, 1);
        }

        if (
            Math.hypot(ball.x - duck.x, ball.y - duck.y) <= (ball.size + (duck.height + duck.width) / 2) / 2
        ) {
            if (duck.width < ball.size) {
                gameOver();

            } else if (duck.width > ball.size) {
                for (let i = 0; i < balls.length; i++) {
                    if ((balls[i].x === ball.x) && (balls[i].y === ball.y)) {
                        balls.splice(i, 1);
                        if (ball.size === 100) {
                            count += 10;
                        } else if (balls[i].size === 200) {
                            count += 40;
                        }
                        i--;
                        break;
                    }
                }
            }
        }
    }
    for (let i = 0; i < balls.length; i++) {
        if (
            (balls[i].x > canvas.width && balls[i].dx > 0) ||
            (balls[i].x < 0 - balls[i].size && balls[i].dx < 0)
        ) {
            balls.splice(i, 1);
            i--;
        }
    }

    updateScore();
}

function updateScore() {
    scoreValue.innerText = `${count}`;
    timeValue.innerText = Math.round(gameTime / 1000);
}

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resize);

document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowLeft") {
        duck.dx = -1;
        duck.flipX = true;
    } else if (event.code === "ArrowRight") {
        duck.dx = 1;
        duck.flipX = false;
    } else if (event.code === "ArrowUp") {
        duck.dy = -1;
    } else if (event.code === "ArrowDown") {
        duck.dy = 1;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        duck.dx = 0;
    } else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        duck.dy = 0;
    }
});

playBtn.addEventListener("click", () => {

    requestAnimationFrame(() => loop(Date.now()));
    setScreen("game");
    resetGame();
});

function resetGame() {
    gamePaused = false;
    count = 0;
    gameTime = 0;
    updateScore();
    duck.x = 160;
    duck.y = 160;
    balls = [];
}

function setScreen(screenName) {
    playMenu.style.display = screenName === "playMenu" ? "flex" : "none";
    gamescreen.style.display = screenName === "game" ? "block" : "none";
    loginDisplay.style.display = gameTime > 0 ? "block" : "none";
    resize();
}

// Запускаем игру

setScreen("playMenu");
updateScores();

let logForm = document.login_game;
logForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    let name = logForm.elements.namedItem("user").value.trim();
    let password = logForm.elements.namedItem("password").value.trim();
    await updateScores({
        name: name,
        password: password,
        score: count,
        time: gameTime,
    });
    return false;
});

async function updateScores(requireBody = null) {
    const res = await fetch("file.php", {
        method: "post",
        body: requireBody ? JSON.stringify(requireBody) : undefined
    });
    const result = await res.json();
    let resElem = document.getElementById("result");
    if (result['error'] === null) {
        resElem.innerText = "";
        if (requireBody !== null) {
            loginDisplay.style.display = "none";
        }
    } else {
        resElem.innerText = result['error'];
    }

    const tableScoreElem = document.getElementById("table-score");
    tableScoreElem.innerHTML = "<tr><th>#</th><th>Имя</th><th>Очки</th><th>Время игры</th></tr>" + result["users"].map((user, ui) => `<tr><td>${ui + 1}</td><td>${user.name}</td><td>${user.score}</td><td>${user.time}</td></tr>`).join("")
}
