var player;
var pipePairs;
var pipeTypes = 10;
var pipesSpawned = 0;
var spawnSpeed = 2;
var spawnCooldown = spawnSpeed;
var timeElapsed = 0;
var deltaTimeOld = Date.now();
var deltaTimeNew = Date.now();
var timeSinceDeath = 0;

var score = 0;
var highscore = 0;

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

function loadImage(path)
{
    let img = new Image();
    img.src = path;
    return img;
}

var images =
    {
        player: loadImage("Images/player.png"),
        pipes: loadImage("Images/pipes.png"),
        titles: loadImage("Images/titles.png"),
        backgrounds:
            {
                base: loadImage("Images/bgbase.png"),
                ground: loadImage("Images/bgground.png"),
                clouds1: loadImage("Images/bgclouds1.png"),
                clouds2: loadImage("Images/bgclouds2.png")
            }
    };

images.backgrounds.clouds2.onload = startGame;

var bgImages;

function resizeCanvas(width, height)
{
    canvas.width = width;
    canvas.height = height;
    w = width;
    h = height;
}

function startGame()
{
    player = new Player();
    pipePairs = [];

    bgImages = [
        {
            img: images.backgrounds.base,
            speed: 0,
            pos: 0
        },
        {
            img: images.backgrounds.clouds1,
            speed: 0.1,
            pos: 0
        },
        {
            img: images.backgrounds.clouds2,
            speed: 0.15,
            pos: 0
        },
        {
            img: images.backgrounds.ground,
            speed: 0.2,
            pos: 0
        }
    ];

    loadGame();

    resizeCanvas(Math.min(innerHeight * (500 / 800), innerWidth), innerHeight);
    score = 0;
    canvas.style.backgroundColor = 'turquoise';
    requestAnimationFrame(updateGameArea);
}

function updateGameArea()
{
    deltaTimeNew = Date.now();

    let delta = (deltaTimeNew - deltaTimeOld) / 1000;

    deltaTimeOld = Date.now();

    resizeCanvas(Math.min(innerHeight * (500 / 800), innerWidth), innerHeight);

    timeElapsed += delta;

    player.tick(delta);
    if(player.dead)
    {
        timeSinceDeath += delta;
    }

    spawnCooldown -= delta;
    if (spawnCooldown <= 0)
    {
        let t = Math.floor(pipesSpawned / 10);
        if (t >= pipeTypes)
        {
            t = Math.floor(Math.random() * pipeTypes);
        }
        let gap = Math.max(0.25, 0.6 / (1 + 0.1 * pipesSpawned));
        let baseMSpeed = Math.min(0.15, 0.03 + Math.max(0, (pipesSpawned - 30) * 0.003)) * Math.random();
        let moveChance = 0.1 + Math.max(0, (pipesSpawned - 30) * 0.005);
        let moveSpeed = (pipesSpawned > 30 && Math.random() < moveChance ? baseMSpeed : 0) * (Math.random() < 0.5 ? -1 : 1);
        let pair = new PipePair(gap, t, moveSpeed);
        pipePairs.push(pair);
        pipesSpawned += player.dead ? 0 : 1;
        spawnCooldown = spawnSpeed;
    }

    pipePairs.forEach(pair =>
    {
        if (player.crashWith(pair.pipeTop) || player.crashWith(pair.pipeBottom))
        {
            player.die();
        }
    });


    ctx.clearRect(0, 0, w, h);

    bgImages.forEach(b =>
    {
        b.pos -= b.speed * delta * Math.min(1, timeElapsed / 3);
        let x = b.pos % (12 / 8); //1200 x 800 image size
        [0, 12 / 8 * h, 24 / 8 * h].forEach(offset =>
        {
            ctx.drawImage(b.img, x * h + offset, 0, 12 / 8 * h, h);
        });
    });

    pipePairs.forEach(pair =>
    {
        if (pair.isPassed(player) && !player.dead)
        {
            pair.passed = true;
            score += 1;
        }
        pair.tick(delta);
        pair.render();
    });

    pipePairs.forEach(pair => //2nd loop prevents flickering
    {
        if (pair.pipeTop.x + pair.width <= 0)
        {
            pipePairs.shift();
        }
    });

    player.render();

    ctx.fillStyle = 'white';
    ctx.font = (h * 0.08) + "px Helvetica";
    ctx.textAlign = "center";
    ctx.lineWidth = h * 0.01;
    ctx.strokeText(score.toLocaleString("en-us"), w / 2, h * 0.1);
    ctx.fillText(score.toLocaleString("en-us"), w / 2, h * 0.1);

    let sX = Math.min(1, timeSinceDeath * 2) * w / 1.25;
    let sY = sX / 4;
    let yOff = highscore >= score ? h * 0.05 : 0;
    ctx.drawImage(images.titles, 0, highscore >= score ? 0 : 128, 512, 128, w / 2 - sX / 2, h / 2 - yOff - sY / 2, sX, sY);

    if(highscore >= score)
    {
        ctx.font = "bold " + (sY / 2.75) + "px Helvetica";
        ctx.lineWidth = sY / 60;
        ctx.fillText("Highscore: " + highscore, w / 2, h / 2 + h * 0.05, w);
        ctx.strokeText("Highscore: " + highscore, w / 2, h / 2 + h * 0.05, w);
    }

    if(timeSinceDeath > 2 && timeSinceDeath % 1 > 0.5)
    {
        ctx.font = "bold " + (sY / 3.5) + "px Helvetica";
        ctx.lineWidth = sY / 70;

        ctx.fillText("Click to Restart", w / 2, h * 0.95, w);
        ctx.strokeText("Click to Restart", w / 2, h * 0.95, w);
    }

    requestAnimationFrame(updateGameArea);
}

function restartGame()
{
    highscore = Math.max(score, highscore);
    saveGame();
    score = 0;
    player.reset();
    pipePairs = [];
    timeElapsed = 0;
    timeSinceDeath = 0;
    pipesSpawned = 0;

    for(let bg of bgImages)
    {
        bg.pos = 0;
    }
}

function onClick()
{
    if(!player.dead)
    {
        player.click();
    }
    if(player.dead && timeSinceDeath > 2)
    {
        restartGame();
    }
}

function saveGame()
{
    localStorage.setItem("Flappy", btoa(JSON.stringify({"highscore": highscore})));
}

function loadGame()
{
    let loadVal = function(v, alt)
    {
        return v !== undefined ? v : alt;
    };

    if (localStorage.getItem("Flappy") !== null)
    {
        try
        {
            let decoded = atob(localStorage.getItem("Flappy"));
            let loadObj = JSON.parse(decoded);
            highscore = loadVal(loadObj.highscore, 0);
        }
        catch (e)
        {

        }
    }
}



onmousedown = onClick;
ontouchstart = onClick;
onkeydown = onClick;
