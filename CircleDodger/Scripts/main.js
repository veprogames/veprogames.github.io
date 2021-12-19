(function(){

class Utils
{
    static clamp(val, min, max)
    {
        return Math.min(max, Math.max(min ,val));
    }
}

class Stage
{
    constructor(seconds, config)
    {
        this.seconds = seconds;
        this.objectColor = config.objectColor ? config.objectColor : "#ffffff";
        this.speed = config.speed ? config.speed : 0.4;
        this.width = config.width ? config.width : [1, 2];
        this.bgColor = config.bgColor ? config.bgColor : "#000000";
        this.circleColor = config.circleColor ? config.circleColor : "#ffffff";
        this.bpm = config.bpm ? config.bpm : 120;
        this.zoomAmount = config.zoomAmount ? config.zoomAmount : 0.1;
        this.blur = config.blur !== undefined ? config.blur : 3;
        this.spawnTolerance = config.spawnTolerance ? config.spawnTolerance : 0.9;

        this.getNextObjectOffset = config.getNextObject ? config.getNextObject : this.getNextObjectOffset;
        this.getSpeedModifier = config.getSpeedModifier ? config.getSpeedModifier : this.getSpeedModifier;
    }

    getNextObjectOffset()
    {
        let offset = -0.5 + Math.random();
        if(time.elapsed % 10 > 7)
        {
            offset = 0.7;
        }
        else
        {
            if(Math.random() < 0.2)
            {
                offset *= 2.5;
            }
        }

        return offset;
    }

    getSpeedModifier()
    {
        return 1;
    }
}

var canvas = document.querySelector("canvas");
var ctx = document.querySelector("canvas").getContext("2d");
var w = canvas.width;
var h = canvas.height;

var p2d = new Path2D();

var time = 
{
    elapsed: 0,
    dTimeOld: 0,
    dTimeNew: 0,
    effect: 0, //used for bpm effects
    game: 0, //time used in game
    gameTimeScale: 1
};

var state = 0;
var states = 
{
    mainMenu: 0,
    game: 1,
    highscores: 2
};

var player = 
{
    position: 1,
    distance: 100,
    dead: false,
    invulnerability: 0,
    collidingWithObject: function()
    {
        let playerRot = player.position;
        let yOver0 = Math.sin(player.position) < 0;
        playerRot *= -1;
        if(!yOver0)
        {
            playerRot += 2 * Math.PI;
        }
        playerRot = 2 * Math.PI - playerRot;

        let px = Math.cos(playerRot) * player.distance;
        let py = Math.sin(playerRot) * player.distance;

        return ctx.isPointInPath(p2d, px, py);
    }
};

var objects = [];

var highestStageThisGame = 0; //used for calculating invulnerability
var stages = 
[
    new Stage(0, 
        {
            objectColor: "#E8C23F",
            bgColor: "#000000",
            circleColor: "#C49760",
            speed: 0.15,
            width: [1.25, 2],
            bpm: 60
        }),
    new Stage(50, 
        {
            objectColor: "ff0000aa",
            bgColor: "#d0d0d0",
            circleColor: "#aa0000",
            speed: 0.3,
            width: [1.4, 2],
            bpm: 120,
            blur: 4,
            getNextObject: () =>
            {
                let mod = time.elapsed % 15;
                if(mod > 12)
                {
                    return -1;
                }
                if(mod > 9)
                {
                    return 1;
                }
                return -0.5 + 0.5 * Math.random();
            }
        }),
    new Stage(110, 
        {
            objectColor: "#80ff0020",
            bgColor: "#005000",
            circleColor: "#50c050",
            speed: 0.4,
            width: [1.15, 1.6],
            bpm: 140,
            blur: 6,
            getNextObject: () =>
            {
                let mod = time.elapsed % 20;
                if(mod > 15)
                {
                    return Math.sin(time.elapsed * 4);
                }
                return -0.75 + 1.5 * Math.random();
            }
        }),
    new Stage(175, 
        {
            objectColor: "#ffffff",
            bgColor: "#000000",
            circleColor: "#ffffff",
            speed: 0.4,
            width: [0.95, 1.55],
            bpm: 20,
            zoomAmount: 0.5,
            blur: 0,
            spawnTolerance: 0.95,
            getNextObject: () =>
            {
                let mod = time.elapsed % 30;
                if(mod > 25)
                {
                    return 0.5;
                }
                if(mod > 20)
                {
                    return 0.7 * Math.sin(time.elapsed * 5);
                }
                return -0.7 + Math.random();
            }
        }),
    new Stage(250,
        {
            objectColor: "#00300050",
            bgColor: "#b8af4f",
            circleColor: "#002000",
            speed: 0.4,
            width: [0.85, 1.5],
            bpm: 60,
            zoomAmount: 0,
            blur: 0,
            getSpeedModifier: () => 
            {
                return (time.elapsed / 4) % 1;
            }
        }),
    new Stage(300,
        {
            objectColor: "#ff00aa20",
            bgColor: "#000000",
            circleColor: "#ff005050",
            speed: 0.85,
            width: [1, 1],
            bpm: 170,
            zoomAmount: 0.2,
            blur: 5,
            spawnTolerance: 0.75,
            getNextObject: () => 
            {
                let val = Math.round(-1 + 2 * Math.random());
                if(time.elapsed % 10 > 7)
                {
                    val = -1;
                }
                return val * 0.5;
            }
        }),
    new Stage(360,
        {
            objectColor: "#ffc000",
            bgColor: "#ffffff",
            circleColor: "#00a0ff",
            speed: 0.45,
            width: [1.2, 1.75],
            bpm: 60,
            blur: 0,
            spawnTolerance: 0.95,
            getNextObject: () => 
            {
                if(time.elapsed % 10 > 5)
                {
                    return 0.4 * Math.sin(time.elapsed / 4) + 0.1 * Math.sin(time.elapsed / 10);
                }
                return -0.5 + Math.random();
            },
            getSpeedModifier: () =>
            {
                return Utils.clamp(Math.sin(time.elapsed * 1.5), -0.5, 1);
            }
        }),
    new Stage(400,
        {
            objectColor: "#a0000060",
            bgColor: "#000000",
            circleColor: "#ff000080",
            speed: 0.25,
            width: [1.5, 1.5],
            bpm: 120,
            blur: 2,
            spawnTolerance: 0.975,
            getNextObject: () => 
            {
                if(Math.random() < 0.2) return 0;
                return 0.25 * (time.elapsed % 10 > 5 ? 1 : -1);
            },
            getSpeedModifier: () =>
            {
                return time.elapsed % 12 > 9 ? -0.75 : (time.elapsed % 12 > 8 ? 0 : 1);
            }
        })
];
var currentStage;

var highScores = [];

function start()
{
    resizeCanvas(innerWidth, innerHeight);

    loadHighScores();

    requestAnimationFrame(update);
}

function update()
{
    time.dTimeOld = Date.now();
    let delta = Math.min(1, (time.dTimeOld - time.dTimeNew) / 1000);
    time.elapsed += delta;

    if(state === states.mainMenu)
    {
        renderTemplates.menuBackground();        

        renderTemplates.menuTitle(0.1, "Circle Dodger");
        
        fontSize = w * 0.05;
        ctx.font = fontSize + "px Helvetica";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText("Press Space to Start", 0, h * 0.15);

        fontSize = w * 0.025;
        ctx.font = fontSize + "px Helvetica";
        ctx.textAlign = "left";
        ctx.fillText("H - Highscores", -w / 2 + 100, h * 0.3);
        ctx.textAlign = "right";
        ctx.fillText("Play", w / 2 - 100, h * 0.3);

        fontSize = w * 0.015;
        ctx.font = fontSize + "px Helvetica";
        ctx.textAlign = "center";
        ctx.fillText("On Phone, tap on the according side of the screen or the texts.", 0, h * 0.4);
    }
    if(state === states.highscores)
    {
        renderTemplates.menuBackground();

        renderTemplates.menuTitle(0.1, "Highscores", 0.45);

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        let fontSize = h / 20;
        for(let i = 0; i < highScores.length; i++)
        {
            let x = w / 2 + 0.01 * w * i;
            let y = h / 3 + fontSize * 1.25 * i;
            let hs = highScores[i];
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = (i == 0 ? "bold" : "") + " " + fontSize + "px Helvetica";
            ctx.fillStyle = "#a0a0a0";
            if(i < 3)
            {
                ctx.fillStyle = ["#ffffff", "#e5e5e5", "#d0d0d0"][i];
            }
            let tab = " ".repeat(5);

            ctx.fillText("#" + (i + 1) + tab + [formatTime(hs.score), "Stage " + (hs.stage + 1), hs.timestamp].join(tab), x, y);
        }

        ctx.textBaseline = "bottom";
        ctx.font = (0.025 * w) + "px Helvetica";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText("X - Return to Main Menu", 32, h - 32);
    }
    if(state === states.game)
    {
        currentStage = determineStage().stage;
        if(highestStageThisGame < determineStage().index)
        {
            highestStageThisGame = determineStage().index;
            player.invulnerability = 3;
        }

        time.effect += currentStage.bpm * time.gameTimeScale * delta / 60;
        time.game += player.dead ? 0 : delta;
        if(player.dead)
        {
            time.gameTimeScale *= Math.pow(0.2, delta);
        }
        player.invulnerability -= delta;

        for(let o of objects)
        {
            let speedMod = Math.max(1, time.game / 500);
            o[0] -= w * currentStage.speed * currentStage.getSpeedModifier() * speedMod * time.gameTimeScale * delta;
            o[3] = o[0] > 0;
        }
        if(objects.length > 0 && objects[0][0] <= -w)
        {
            objects.shift();
        }

        if(objects.length === 0 || objects[objects.length - 1][0] < w * currentStage.spawnTolerance)
        {
            let o = objects[objects.length - 1];
            let offset = currentStage.getNextObjectOffset();
            let baseRotation = (o ? (getObjectCenter(o) + offset) : player.position);
            let width = o ? (currentStage.width[0] + Math.random() * (currentStage.width[1] - currentStage.width[0])) : Math.PI;
            addObject(baseRotation, width);
        }

        p2d = getObjectsPath();

        if(player.invulnerability <= 0 && player.collidingWithObject() && !player.dead)
        {
            killPlayer();
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        let zoomScale = 1 + currentStage.zoomAmount - (time.effect % 1) * currentStage.zoomAmount;

        let baseBlur = 255 / (1 + currentStage.blur);
        //let blur = Math.round(Math.min(255, Math.pow(baseBlur, delta * 60))).toString(16);
		let blur = Math.round(Math.min(255, baseBlur * delta * 60)).toString(16);
        blur = ("0" + blur).slice(-2);
        ctx.fillStyle = currentStage.bgColor + blur;
        ctx.fillRect(0, 0, w, h);

        ctx.setTransform(zoomScale, 0, 0, zoomScale, w / 2, h / 2);

        //lines
        ctx.strokeStyle = currentStage.circleColor;
        ctx.lineWidth = 1;
        let pxPerCircle = w / 15;
        for(let r = pxPerCircle - (time.effect * pxPerCircle) % pxPerCircle; r < w + pxPerCircle; r += pxPerCircle)
        {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, 2 * Math.PI);
            ctx.stroke();
        }

        //circle
        ctx.fillStyle = currentStage.circleColor;
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, 2 * Math.PI);
        ctx.fill();

        //player
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, player.distance, player.position - 0.05, player.position + 0.05);
        ctx.stroke();

        //objects
        ctx.fillStyle = currentStage.objectColor;
        ctx.fill(p2d);
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        let fontSize = h * 0.05;
        ctx.font = fontSize + "px Helvetica";
        [[currentStage.objectColor, fontSize / 15], [currentStage.bgColor, 0]].forEach(obj =>
            {
                ctx.fillStyle = obj[0];
                ctx.fillText(formatTime(time.game), w / 2 + obj[1], 16 + obj[1]);
                ctx.fillText("Stage " + (determineStage().index + 1), w / 2 + obj[1], 16 + fontSize * 1.2 + obj[1]);
                if(player.invulnerability > 0)
                {
                    ctx.fillText("Invulnerable: " + player.invulnerability.toFixed(3) + "s", w / 2 + obj[1], 16 + fontSize * 2.4 + obj[1]);
                }
                if(player.dead)
                {
                    ctx.fillText("Game Over!", w / 2 + obj[1], h / 2 + obj[1]);
                    ctx.fillText("X - Exit to Main Menu    R - Restart", w / 2 + obj[1], h - 100 + obj[1]);
                }
            });
    }
    

    time.dTimeNew = Date.now();

    requestAnimationFrame(update);
}

function getObjectsPath()
{
    let p2d = new Path2D();
    if(objects.length > 0)
    {
        p2d.moveTo(0, 0);
        for(let i = 0; i < objects.length; i++)
        {
            let o = objects[i];
            if(o[3]) //if renderable
            {
                p2d.lineTo(Math.cos(o[1]) * o[0], Math.sin(o[1]) * o[0]);
            }
        }
        let lastObject = objects[objects.length - 1];
        p2d.arc(0, 0, lastObject[0], lastObject[1], lastObject[2], true);
        for(let i = objects.length - 1; i >= 0; i--)
        {
            let o = objects[i];
            if(o[3]) //if renderable
            {
                p2d.lineTo(Math.cos(o[2]) * o[0], Math.sin(o[2]) * o[0]);
            }
        }
        p2d.lineTo(0, 0);
    }

    return p2d;
}

var renderTemplates = //contains templates that get rendered on multiple screens
{
    menuBackground: function()
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        ctx.setTransform(1, 0, 0, 1, w / 2, h / 2);

        //lines
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        let pxPerCircle = w / 15;
        for(let r = pxPerCircle - (time.elapsed * pxPerCircle) % pxPerCircle; r < w; r += pxPerCircle)
        {
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, 2 * Math.PI);
            ctx.stroke();
        }

        //circle
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, w * (0.04 + 0.01 * Math.sin(time.elapsed * 1.5)), 0, 2 * Math.PI);
        ctx.fill();
    },
    menuTitle: function(relSize, text, height)
    {
        height = height ? height : 0.35;
        let fontSize = w * relSize;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "900 " + fontSize + "px Helvetica";
        [[fontSize / 15, "white"], [0, "#606060"]].forEach(o =>
            {
                ctx.fillStyle = o[1];
                ctx.fillText(text, 0 + o[0], -h * height + o[0]);
            });
    }
}

function addObject(pos, width)
{
    let p1 = pos - width / 2;
    let p2 = pos + width / 2;
    let obj = [w, p1, p2, true]; //distance, angle1, angle2, renderable

    objects.push(obj);
}

function getObjectCenter(o)
{
    return (o[2] + o[1]) / 2;
}

function determineStage(seconds)
{
    seconds = seconds ? seconds : time.game;
    let idx = 0;
    for(let i = 0; i < stages.length - 1; i++)
    {
        let nextStage = stages[i + 1];
        if(seconds >= nextStage.seconds)
        {
            idx++;
        }
    }
    return {
        stage: stages[idx],
        index: idx
    };
}

function killPlayer()
{
    player.dead = true;
    addHighScore(time.game);
}

function restartGame()
{
    objects = [];
    time.game = 0;
    time.gameTimeScale = 1;
    player.dead = false;
    player.invulnerability = 3;
    highestStageThisGame = 0;
}

function resizeCanvas(width, height)
{
    canvas.width = width;
    canvas.height = height;
    w = canvas.width;
    h = canvas.height;
}

function formatTime(s)
{
    return (s >= 60 ? Math.floor(s / 60) + "\"" : "") + (s % 60).toFixed(3) + "'";
}

function changeGameState(s)
{
    state = s;
    time.elapsed = 0;

    if(s == states.game)
    {
        restartGame();
    }
}

function addHighScore(sec)
{
    let date = new Date();
    let timeString = [date.getFullYear(), date.getMonth(), date.getDate()].join("-");

    highScores.push({timestamp: timeString, score: sec, stage: determineStage(sec).index});
    highScores = highScores.sort((a, b) => 
        {
            if(a.score === b.score) return 0;
            return a.score > b.score ? -1 : 1;
        });
    highScores = highScores.slice(0, 10);
    saveHighscores();
}

function saveHighscores()
{
    localStorage.setItem("CircleDodgerHighscores", JSON.stringify(highScores));
}

function loadHighScores()
{
    if(localStorage.getItem("CircleDodgerHighscores") !== null)
    {
        highScores = JSON.parse(localStorage.getItem("CircleDodgerHighscores"));
    }
}

function handleGameInput(e)
{
    let x = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    let y = e.clientY || (e.touches ? e.touches[0].clientY : 0);

    if(!player.dead && state === states.game)
    {
        player.position = Math.atan2(y - h / 2, x - w / 2);
    }
}

["ontouchmove", "onmousedown", "onmousemove"].forEach(ev => 
    {
        canvas[ev] = e => handleGameInput(e);
    });

canvas.ontouchstart = e => 
{
    e.preventDefault();

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    let relX = x / w;
    let relY = y / h;

    handleGameInput(e);

    if(state === states.game && player.dead)
    {
        if(relX < 0.5)
        {
            changeGameState(states.mainMenu);
        }
        else
        {
            restartGame();
        }
    }
    else if(state === states.mainMenu)
    {
        changeGameState(relX > 0.5 ? states.game : states.highscores);
    }
    else if(state === states.highscores)
    {
        changeGameState(states.mainMenu);
    }
}

onkeypress = e => 
{
    let key = e.key.toLowerCase();

    if(state === states.mainMenu)
    {
        if(key === " ")
        {
            changeGameState(states.game);
        }
        if(key === "h")
        {
            changeGameState(states.highscores);
        }
    }
    else if(key === "x" && (state === states.highscores || state === states.game))
    {
        changeGameState(states.mainMenu);
    }
    else if(key === "r" && state === states.game && player.dead)
    {
        restartGame();
    }
};

onresize = e => 
{
    resizeCanvas(innerWidth, innerHeight);
};

start();

})()