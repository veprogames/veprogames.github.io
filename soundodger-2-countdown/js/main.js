const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");
let W = canvas.width;
let H = canvas.height;

const mouse = new MouseManager();

let date = Date.now();

const gameArena = new GameArena(0, 0, 0.7, { main: "#ff8000", circle: "#0080ff30" });

const objects = [gameArena];

function resizeCanvas() {
    canvas.width = innerWidth * 2;
    canvas.height = innerHeight * 2;
    W = innerWidth * 2;
    H = innerHeight * 2;
}

function setup() {
    resizeCanvas();

    requestAnimationFrame(update);
}

function update() {
    let dt = (Date.now() - date) / 1000;
    date = Date.now();

    ctx.clearRect(0, 0, W, H);

    for (let obj of objects) {
        obj.tick(dt);
        obj.render(ctx);
    }

    let remaining = gameArena.scoreCircle.getRemainingSec();
    let title = remaining >= 0 ? "Soundodger 2 in " + Utils.formatTime(remaining) : "Soundodger 2 is OUT!";
    document.title = title;

    requestAnimationFrame(update);
}

onresize = resizeCanvas;

setup();