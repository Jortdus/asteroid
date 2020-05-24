const ship = document.getElementById("space-ship");
const gameCanvas = document.querySelector(".game-canvas");
const laserAudio = new Audio("sound/laser.wav")
const startButton = document.getElementById("startbutton");
const score = document.querySelector(".score span")
let asteroidInterval;

// Ship movement code

function shipControl(event) {
    if (event.key === "ArrowUp") {
        up();
    } else if (event.key === "ArrowDown") {
        down();
    } else if (event.key === " ") {
        fire();
    }
}

function up() {
    let verticalPosition = window.getComputedStyle(ship).getPropertyValue('top');
    if (verticalPosition < "0px") {
        console.log(verticalPosition)
        return;
    } else {
        let position = parseInt(verticalPosition);
        position -= 10;
        ship.style.top = position + "px";
    }

}

function down() {
    let verticalPosition = window.getComputedStyle(ship).getPropertyValue('top');

    if (ship.style.top === "540px") {
        return;
    } else {
        let position = parseInt(verticalPosition);
        position += 10;
        ship.style.top = position + "px";
    }
}


// Laser code

function fire() {
    let laser = laserCreation()
    gameCanvas.appendChild(laser)
    laserMovement(laser)
    laserAudio.play()
}


function laserCreation() {
    let horizontal = parseInt(window.getComputedStyle(ship).getPropertyValue('left'));
    let vertical = parseInt(window.getComputedStyle(ship).getPropertyValue('top'));
    let newLaser = document.createElement("img");
    newLaser.classList.add('laser');
    newLaser.src = 'img/laser-beam.png';
    newLaser.style.left = horizontal + "px";
    newLaser.style.top = vertical - 20 + "px";
    return newLaser
}

function laserMovement(laser) {
    let interval = setInterval(() => {
        let horizontal = parseInt(laser.style.left);
        let allAsteroids = document.querySelectorAll(".asteroid");
        allAsteroids.forEach(asteroid => {
            if (hitRegistration(laser, asteroid)) {
                asteroid.src = "img/explosion.png";
                asteroid.classList.remove("asteroid");
                asteroid.classList.add("destroyed");
                laser.remove();
                score.innerText = parseInt(score.innerText) + 1;
            }
        });
        if (horizontal === 500) {
            laser.style.display = "none";
            laser.remove();
        } else {
            laser.style.left = horizontal + 5 + "px";
        }
    }, 15)
}

// Asteroid code

function asteroidCreation() {
    let newAsteroid = document.createElement("img");
    newAsteroid.src = "img/asteroid.png";
    newAsteroid.classList.add('asteroid');
    newAsteroid.style.top = Math.floor(Math.random() * 330) + 30 + "px";
    newAsteroid.style.left = "480px";
    gameCanvas.appendChild(newAsteroid);
    asteroidMovement(newAsteroid);
}

function asteroidMovement(asteroid) {
    let asteroidInterval = setInterval(() => {
        let horizontal = parseInt(asteroid.style.left);
        if (horizontal <= 10) {
            if (asteroid.classList.contains("destroyed")) {
                asteroid.remove();
            } else {
                gameOver();
            }
        } else {
            asteroid.style.left = horizontal - 5 + "px";
        }
    }, 20)
}

// Hit registration 

function hitRegistration(laser, asteroid) {
    let laserHorizontal = parseInt(laser.style.left);
    let laserVertical = parseInt(laser.style.top);
    let asteroidHorizontal = parseInt(asteroid.style.left);
    let asteroidVertical = parseInt(asteroid.style.top);
    let asteroidBottom = asteroidVertical - 50;

    if (laserHorizontal != 450 && laserHorizontal + 40 >= asteroidHorizontal) {
        if (laserVertical <= asteroidVertical && laserVertical >= asteroidBottom) {
            return true
        } else {
            return false
        }

    } else {
        return false
    }

}

// Game events and triggers

startButton.addEventListener("click", (event) => {
    startGame();
    startButton.style.display = "none";
})

function startGame() {
    window.addEventListener("keydown", shipControl);
    setInterval(() => {
        asteroidCreation();
    }, 5000);
}

function gameOver() {
    window.removeEventListener("keydown", shipControl);
    setTimeout(() => {
        clearInterval(asteroidCreation);
        startButton.style.display = "block";
        startButton.innerText = "Game over!";
    }, 1000);
}

