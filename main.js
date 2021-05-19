const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let x = 180;
let y = 75;
let gas = 0;
let strokeSize1 = 2;
let strokeSize2 = 2;
let raf;


function ship(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 15, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
    ctx.lineTo(x - 120, y + 5);
    ctx.arc(x, y, 15, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
    ctx.arc(x, y, 10, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
    ctx.shadowBlur = 2;
    ctx.shadowColor = "#00FF66";
    ctx.lineWidth = strokeSize1;
    ctx.fillStyle = "#00FF00";
    ctx.strokeStyle = '#8A2BE2';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 100, y, 30, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
    ctx.lineTo(x - 70 * 2 + gas, y + 5);
    ctx.arc(x - 100, y, 30, (Math.PI / 180) * 80, (Math.PI / 180) * 280, true);
    ctx.lineWidth = strokeSize2;
    ctx.shadowAlpha = 5;
    ctx.shadowBlur = 8 * Math.random() + 15;
    ctx.shadowColor = "#FF6600";
    ctx.strokeStyle = '#FF6600';
    ctx.fillStyle = '#8A2BE2';
    ctx.fill();
    ctx.stroke();

}

let numberOfObstacles = 20;
let obstaclesArray = [];

class Obstacle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 2;
        this.size = 20 * Math.random() + 3;
        this.color = ['#FF00FF', '#FFFF00', '#FF3300'];
        this.colorPick = 0;

    }
    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = innerWidth;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color[2];
        if (this.size < 15) {
            ctx.fillStyle = this.color[1];
        }
        if (this.size < 8) {
            ctx.fillStyle = this.color[0];
        }
        ctx.fill();
        ctx.shadowBlur = 16;
        ctx.shadowColor = "#FF6600";
        ctx.closePath();
    }
}

function init() {
    for (let i = 0; i < numberOfObstacles; i++) {
        obstaclesArray.push(new Obstacle());
    }
}

init();


function animate() {

    ship(x, y);

    for (let i = 0; i < obstaclesArray.length; i++) {

        obstaclesArray[i].update();
        obstaclesArray[i].draw();

    }


    raf = requestAnimationFrame(animate);
}

animate();


window.addEventListener('keydown', (e) => {
    ship(x, y);
    switch (e.key) {
        case "d":
            {
                if (x < innerWidth - 200) {
                    x += 10;
                    gas--;
                    if (x < innerWidth - 1200)
                        strokeSize2++;

                }
                break;
            }
        case "a":
            {
                if (x > 180) {

                    x -= 10;
                    gas++;
                    if (x < 200)
                        strokeSize2 = 2;
                    strokeSize2--;
                }
                break;
            }
        case "w":
            {
                if (y > 100)
                    y -= 10;
                break;
            }
        case "s":
            {
                if (y < innerHeight - 200)
                    y += 10;
                break;
            }
    }

});

const playBtn = document.getElementById("play");
let playStatus = 0;
playBtn.addEventListener("click", (e) => {
    if (playStatus == 0) {

        cancelAnimationFrame(raf);
        playStatus = 1;
        playBtn.innerHTML = "Play";
    } else {
        playStatus = 0;
        animate();
        playBtn.innerHTML = "Stop";
    }

});