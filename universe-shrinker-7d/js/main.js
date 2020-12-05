const PLANCK_LENGTH = new Decimal(1.616229e-35);
var dt1 = Date.now(), dt2 = Date.now(); //old, new delta
var keyMap = [];
var saveTimer = 0;
var stubbornComponents = ["universeLayers", "universe", "thetaLayer", "tabNavigation"];
var initialGame;

var numberFormatters = [
    new ADNotations.StandardNotation(),
    new ADNotations.EngineeringNotation(),
    new ADNotations.ScientificNotation(),
    new ADNotations.LogarithmNotation(),
    new ADNotations.InfinityNotation(),
    new ADNotations.CancerNotation()
];

var app = new Vue({
    el: "#app",
    data: game,
    computed: computed,
    methods: functions,
    created: onCreate
});

function onCreate()
{
    for(let i = 0; i < 11; i++)
    {
        let bp = Decimal.pow(10, i).mul(Decimal.pow(10, Math.pow(1.5, Math.max(0, i - 5))));
        game.shrinkers.push(new Shrinker("Matter Condenser " + "αβγδεζηθικλ"[i], bp,
            new Decimal(1.5 + i), bp.div(new Decimal(10).mul(Decimal.pow(2, i))), new Decimal(1 + 0.0005 * (i * 0.5 + 1))));
    }
    initialGame = functions.getSaveCode();

    functions.loadGame();

    requestAnimationFrame(update);
}

function update()
{
    dt2 = Date.now();
    let dt = (dt2 - dt1) / 1000;
    dt1 = Date.now();
    if(!computed.gameWon())
    {
        game.timeSpent += dt;
    }

    for(let id of stubbornComponents)
    {
        if(app.$refs[id] !== undefined)
        {
            app.$refs[id].$forceUpdate();
        }
    }

    if(keyPressed("m"))
    {
        functions.maxAll();
    }

    game.rhoParticles = game.rhoParticles.add(functions.getRhoProduction().mul(dt));

    for(let i = 0; i < game.currentUniverseLevel; i++)
    {
        let uni = game.universes[i];
        uni.tick(dt, false);
    }
    game.universe.tick(dt);
    for(let auto of game.automators)
    {
        auto.tick(dt);
    }

    saveTimer += dt;
    if(saveTimer > 30)
    {
        saveTimer = 0;
        functions.saveGame();
    }

    requestAnimationFrame(update);
}

function keyPressed(k)
{
    return keyMap.includes(k);
}

onkeydown = e => {
    if(!keyMap.includes(e.key))
    {
        keyMap.push(e.key);
    }
    if(e.key === "ArrowLeft" && game.currentUniverseLevel > 0)
    {
        functions.decreaseUniverseLevel();
    }
    if(e.key === "ArrowRight" && game.currentUniverseLevel < game.highestUniverseLevel)
    {
        functions.increaseUniverseLevel();
    }
};

onkeyup = e => {
    keyMap = keyMap.filter(k => k !== e.key);
};