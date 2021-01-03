var cacheCanvas = document.querySelector("canvas#cache");
var ctxCache = cacheCanvas.getContext("2d");
var keymap = [];

var stoneImg = new Image();
stoneImg.onload = e => imgLoaded = true;
var imgLoaded = false;
stoneImg.src = "Images/stone_new.png";

const SKIN_LAYER_AMOUNTS = [2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 1, 3, 2, 4, 3, 3, 2, 2, 2, 2, 2, 2, 4, 4, 3]; //skin x has y amount of layers to be drawn (y colors)
const MessageColors = {
    error: "#ff0900",
    success: "#00b400",
    save: "#00a5ff",
    offline: "#948a00"
};

var deltaTimeNew = Date.now();
var deltaTimeOld = Date.now();
var initialGame = JSON.stringify(game);

const POWER_MINING = 0, POWER_CRAFTSMENSHIP = 1, POWER_EXPERTISE = 2, POWER_WISDOM = 3, POWER_EXQUISITY = 4;

function onCreate()
{
    let blacklist = ["Settings", "CustomNotation", "Notation", "BarNotation"];
    let notations = Object.assign(ADNotations, ADCommunityNotations);
    for(let n of Object.keys(notations))
    {
        if(!blacklist.includes(n))
        {
            let notation = new notations[n]();
            if(game.numberFormatters.filter(no => no.name === notation.name).length === 0)
            {
                game.numberFormatters.push(new notations[n]());
            }
        }
    }
    game.numberFormatters.push(new IdleMineNotation());
    game.numberFormatters.push(new SINotationCurrent());
    game.numberFormatters.push(new SINotationNew());

    game.currentMineObject = MineObject.create(game.mineObjects[0]);

    functions.loadGame();

    requestAnimationFrame(update);
}

function update()
{
    deltaTimeNew = Date.now();

    let delta = (deltaTimeNew - deltaTimeOld) / 1000;

    deltaTimeOld = Date.now();

    game.timer.autoPickaxe += delta;
    if (game.timer.autoPickaxe > 1 / applyUpgrade(game.upgrades.idleSpeed).toNumber())
    {
        game.timer.autoPickaxe = 0;
        game.currentMineObject.damage(functions.getIdleDamage());
        Vue.set(game.powers.data.values, POWER_MINING, game.powers.data.values[POWER_MINING].mul(applyUpgrade(game.powers.upgrades.powerPowerIdle)));
    }
    game.timer.save += delta;
    if(game.timer.save > 60)
    {
        game.timer.save = 0;
        functions.saveGame();
    }

    functions.refreshStoryNotifications();

    requestAnimationFrame(update);
}



function drawStone(ctx, color, layer, skin)
{
    ctx.globalCompositeOperation = "copy";
    ctx.fillStyle = "#00000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(stoneImg, 256 * layer, 256 * skin, 256, 224, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(stoneImg, 256 * layer, 256 * skin, 256, 224, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "source-over";
}

var app = new Vue(
    {
        el: "#app",
        data: game,
        methods: functions,
        created: onCreate
    });

onkeydown = e =>
{
    if(!keymap.includes(e.key))
    {
        keymap.push(e.key);
    }

    if(e.key === "ArrowRight")
    {
        e.preventDefault();
        functions.setMineObjectLevel(game.mineObjectLevel + 1);
    }
    if(e.key === "ArrowLeft")
    {
        e.preventDefault();
        functions.setMineObjectLevel(game.mineObjectLevel - 1);
    }
};

onkeyup = e =>
{
    keymap = keymap.filter(k => k !== e.key);
};