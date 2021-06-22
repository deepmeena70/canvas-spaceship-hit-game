const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let raf;


let numberOfParticles = 20;
let obstaclesArray = [];
let laserArray = [];

class spaceShip {
    constructor() {
        this.x = 180;
        this.y = 75;
        this.radius = 2;
        this.strokeSize1 = 2;
        this.strokeSize2 = 2;
        this.gas = 0;
        this.spaceShipShadowBlur = 7;
        this.color = ['#00FF66', '#00FF00', '#8A2BE2', '#FF6600', '#8A2BE2', '#FFFF00'];
        this.flameShadowAlpha = 5;
        this.flameShadowBlur = 25;
        this.px = 0;
        this.py = 0;
    }
    update() {
        this.flameShadowBlur = 40 * Math.random() + 25;
    }
    left() {
        if (this.x < innerWidth - 200) {
            this.x += 10;
            this.gas--;
            if (this.x < innerWidth - 1200)
                this.strokeSize2++;

        }
    }
    right() {
        if (this.x > 180) {

            this.x -= 10;
            this.gas++;
            if (this.x < 200)
                this.strokeSize2 = 2;
            this.strokeSize2--;
        }
    }
    up() {
        if (this.y > 100)
            this.y -= 10;
    }
    down() {
        if (this.y < innerHeight - 200)
            this.y += 10;
    }


    updateLaser() {
        this.x += Math.random() * 40;
        if (this.x > innerWidth) {
            this.x = this.px;
            this.y = this.py;
            this.radius = 2;
        }
        if (this.x <= innerWidth)
            this.radius += 0.2;
    }

    drawLaser() {
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color[Math.floor(Math.random() * 5)];
        ctx.fill();
    }

    drawSpaceship() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 13, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
        ctx.lineTo(this.x - 120, this.y + 5);
        ctx.arc(this.x, this.y, this.radius + 13, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
        ctx.arc(this.x, this.y, this.radius + 8, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
        ctx.shadowBlur = this.spaceShipShadowBlur;
        ctx.shadowColor = this.color[0];
        ctx.lineWidth = this.strokeSize1;
        ctx.fillStyle = this.color[1];
        ctx.strokeStyle = this.color[2];
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x - 100, this.y, this.radius + 28, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
        ctx.lineTo(this.x - 70 * 2 + this.gas, this.y + 5);
        ctx.arc(this.x - 100, this.y, this.radius + 28, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
        ctx.lineWidth = this.strokeSize2;
        ctx.shadowAlpha = this.flameShadowAlpha;
        ctx.shadowBlur = this.flameShadowBlur;
        ctx.shadowColor = this.color[3];
        ctx.strokeStyle = this.color[3];
        ctx.fillStyle = this.color[4];
        ctx.fill();
        ctx.stroke();
    }
}

class Obstacle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 2;
        this.radius = 40 * Math.random();
        this.color = ['#FF00FF', '#FFFF00', '#FF3300', '#A5D8F3'];

    }
    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = innerWidth;
            this.radius = 40 * Math.random();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color[2];
        if (this.radius < 20) {
            ctx.fillStyle = this.color[1];
        }
        if (this.radius < 8) {
            ctx.fillStyle = this.color[3];
        }

        if (this.radius < 5) {
            ctx.fillStyle = this.color[0];
        }
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FF6600";
        ctx.closePath();
    }

}


function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        obstaclesArray.push(new Obstacle());
    }
    for (let i = 0; i < numberOfParticles; i++) {
        laserArray.push(new spaceShip());
    }
}

init();
let spaceShip1 = new spaceShip();





function animate() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    spaceShip1.drawSpaceship();
    spaceShip1.update();
    let px = spaceShip1.x;
    let py = spaceShip1.y;
    for (let i = 0; i < obstaclesArray.length; i++) {

        obstaclesArray[i].update();
        obstaclesArray[i].draw();


    }

    collision();


    activateLaser(px, py);


    raf = requestAnimationFrame(animate);
}

function activateLaser(px, py) {
    for (let i = 0; i < laserArray.length; i++) {
        laserArray[i].px = px;
        laserArray[i].py = py;
        laserArray[i].drawLaser();
        laserArray[i].updateLaser();
    }

}

let count = 0;
let power = 0;

function collision() {
    for (let i = 0; i < laserArray.length; i++) {
        let dx = laserArray[i].x - obstaclesArray[i].x;
        let dy = laserArray[i].y - obstaclesArray[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= laserArray[i].radius + obstaclesArray[i].radius) {
            if (obstaclesArray[i].radius > 15)
                document.getElementById("points").innerHTML = Math.floor(count += obstaclesArray[i].radius);

            if (obstaclesArray[i].radius > 5) {
                if (power <= 100) {
                    power += Math.floor(obstaclesArray[i].radius * 0.2);
                    if (power > 100) {
                        power = 100;
                    }
                    document.getElementById("power").innerHTML = Math.round(power) + " %";
                }
                document.getElementById("power").style.boxShadow = "inset 0 0 " + power + "px #FFFF00";
            }

            obstaclesArray[i].radius = 0;
        }
    }

}



action();

function action() {
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "d":
                {
                    spaceShip1.left();
                    break;
                }
            case "a":
                {
                    spaceShip1.right();
                    break;
                }
            case "w":
                {
                    spaceShip1.up();
                    break;
                }
            case "s":
                {
                    spaceShip1.down();
                    break;
                }
            case "q":
                {
                    if (power == 100) {
                        for (let i = 0; i < laserArray.length; i++) {
                            laserArray[i].x = spaceShip1.x + 90;
                            laserArray[i].radius = power * 2;
                            power = 0;
                        }


                    }
                }
        }

    });
}



const playBtn = document.getElementById("play");
let playStatus = 0;
playBtn.addEventListener("click", (e) => {
    if (playStatus == 0) {
        animate();
        playStatus = 1;
        playBtn.innerHTML = "Play";
    } else {
        playStatus = 0;
        cancelAnimationFrame(raf);
        playBtn.innerHTML = "Stop";
    }

});