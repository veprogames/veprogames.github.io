var appWidth = 1024;
var appHeight = 768;
var deltaTimeOld = Date.now();
var deltaTimeNew = Date.now();
var app;
var settings = 
{
    paused: false,
    numberFormatType: 0
};
var player;
var statistics = 
{
    highestSize: new Decimal(0),
    objectsEaten: 0
};
var nearestObjArrow;
var startScale = new Decimal(1e-15);
var controls =
{
    mouseDown: false,
    mousePos: {x: 0, y: 0}
};
var camera =
{
    centerX: new Decimal(0),
    centerY: new Decimal(0),
    targetRange: startScale.mul(10),
    range: startScale.mul(10)
};
var containers =
{
    edibleObjects: new PIXI.Container(),
    ui: new PIXI.Container(),
    paused: new PIXI.Container()
};
var ui = 
{
    image_playerSize: PIXI.Sprite.from("Sprites/UI/size.png"),
    text_playerSize: new PIXI.Text("", {fontSize: 48, fill: 0xffffff}),
    text_eatMulti: new PIXI.Text("", {fontSize: 36, fill: 0xddddff}),
    image_xp: PIXI.Sprite.from("Sprites/UI/xp.png"),
    text_xp: new PIXI.Text("", {fontSize: 48, fill: 0xffffff}),
    text_xpGet: new PIXI.Text("", {fontSize: 30, fill: 0xddddff}),
    image_lastObject: new PIXI.Sprite(),
    text_lastObject: new PIXI.Text("", {fontSize: 40, fill: 0xffffff}),
    paused:
    {
        text_paused: new PIXI.Text("Paused", {fontSize: 72, fill: 0xffffff}),
        text_stats: new PIXI.Text("", {fontSize: 32, fill: 0xffffff})
    }
};
var graphics = new PIXI.Graphics();
var edibleTypes;
var edibleRanges;
var edibleBehaviors =
{
    circle: function(e)
    {
        let tx = Math.cos(e.lifeTime * 0.3);
        let ty = Math.sin(e.lifeTime * 0.3);
        e.move(e.size.mul(tx * 0.03), e.size.mul(ty * 0.03));
    },
    chase: function(e, delta)
    {
        let px = player.worldPosition.x;
        let py = player.worldPosition.y;
        let dx = px.sub(e.worldPosition.x);
        let dy = py.sub(e.worldPosition.y);

        let normDist = Utils.pythagoras(px, py, e.worldPosition.x, e.worldPosition.y).div(player.size).toNumber();

        if(normDist < 25 && e.size.gt(player.size))
            e.move(dx.mul(0.5 * delta), 
                    dy.mul(0.5 * delta));
    }
};
var progression = 
{
    getEatMultiplier: function(size)
    {
        return Decimal.max(0, Decimal.pow(1 / 0.91, Decimal.log10(size)).sub(1)).div(10)
            .mul(Upgrade.apply(this.upgrades.betterEatMultiplier));
    },
    getXp: function(size)
    {
        return Decimal.floor(new Decimal(Math.max(0, Decimal.log10(size.div(1e50)) / 10)).add(Decimal.max(0, Decimal.pow(1.01, Decimal.log10(size)).sub(1))));
    },
    eatMultiplier: new Decimal(1),
    xp: new Decimal(0), //currency for buying upgrades
    totalXp: new Decimal(0),
    upgrades: 
    {
        betterEatMultiplier: new Upgrade("Better Eat Multiplier", "Eat multiplier on reset increases faster",
        document.querySelector("#upgrades"), 1,
        function(level)
        {
            return new Decimal(level + 1).mul(Decimal.pow(1.3, Decimal.max(0, level - 5)));
        },
        function(level)
        {
            return new Decimal(1).add(level / 10)
                        .mul(Decimal.pow(2, Math.floor((level + 1) / 10)));
        }),
        startingSize: new Upgrade("Starting Size", "Increase your starting Size",
        document.querySelector("#upgrades"), 1,
        function(level)
        {
            return (new Decimal(level).add(Decimal.pow(1.1, Decimal.max(0, level - 5)))).mul(3);
        },
        function(level)
        {
            return new Decimal(startScale).mul(Decimal.pow(32768, level * Math.min(3, 1 + 0.1 * level)));
        },
        function()
        {
            return formatSize(this.getEffect(this.level)) + " => " + 
                    formatSize(this.getEffect(this.level + 1));
        })
    }
};

function worldToScreenPoint(x, y)
{
    let aspect = appWidth / appHeight;
    return {
        x: (x.sub(camera.centerX)).div(camera.range.mul(aspect)).toNumber() * appWidth + appWidth / 2,
        y: (y.sub(camera.centerY)).div(camera.range).toNumber() * -1 * appHeight + appHeight / 2
    };
}

function spawnEdible(x, y, size, type, range)
{
    if(type === undefined)
        type = edibleTypes.blob;
    let e = new EdibleObject(size, x, y, type);
    containers.edibleObjects.addChild(e);
    
    if(range === undefined || range)
        e.applyRange(edibleRanges);
    return e;
}

function formatSize(n)
{
    let suffixesSmall = ["Milli", "Micro", "Nano", "Pico", "Femto", "Atto", "Zepto", "Yocto"];
    let suffixes = ["", "Kilo", "Mega", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta"];

    if(n.gte(9.461e15 * 50e9))
    {
        let universes = n.div(9.461e15 * 50e9);
        return formatNumber(universes, settings.numberFormatType) + " Universes";
    }
    if(n.gte(9.461e15))
    {
        let ly = n.div(9.461e15);
        return Math.pow(10, Decimal.log10(ly) % 3).toFixed(2) + (ly.gte(1000) ? " " : "") +
        suffixes[Math.floor(Decimal.log10(ly) / 3)] + " Light Years";
    }
    if(n.gte(1))
    {
        return Math.pow(10, Decimal.log10(n) % 3).toFixed(2) + " " + 
                suffixes[Math.floor(Decimal.log10(n) / 3)] + "meters";
    }
    if(n.lt(1) && !n.equals(new Decimal(0)))
    {
        return Math.pow(10, 3 + Decimal.log10(n) % 3).toFixed(2) + " " + 
                suffixesSmall[-1 - Math.floor(Decimal.log10(n) / 3)] + "meters";
    }
}

var numberPrefixes = 
{
    start: ["", "K", "M", "B"],
    ones: ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"],
    tens: ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Og", "Ng"],
    hundreds: ["", "Ct", "DCt", "TCt", "QaCt", "QiCt", "SxCt", "SpCt", "OcCt", "NCt"]
}
function formatNumber(n, type, prec)
{

    if(type === undefined)
    {
        console.warn("no format type given!");
    }

    prec = prec === undefined ? 0 : prec;
    if(type === 0)
    {
        if(n.lt(1000)) return n.toFixed(prec);

        let m = (n.m * Math.pow(10, n.e % 3)).toFixed(prec + 2);
        let s;
        if(n.e < 12)
        {
            s = numberPrefixes.start[Math.floor(n.e / 3)];
        }
        else
        {
            let exp = n.e - 3;
            s = numberPrefixes.hundreds[Math.floor(exp / 300)] + 
            numberPrefixes.ones[Math.floor(exp / 3) % numberPrefixes.ones.length] +
            numberPrefixes.tens[Math.floor(exp / 30) % numberPrefixes.tens.length];
        }

        return m + s;
    }
}

app = new PIXI.Application(
    {
        width: appWidth,
        height: appHeight
    });
    
PIXI.loader.load(initGame);

function initGame()
{
    edibleTypes = 
    {
        blob:
        {
            name: "Blob",
            texture: Utils.textureFromSheet("edibles", 0, 0, 256, 256),
            randomColor: true,
            nutrition: new Decimal(1),
            damage: 0.25
        },
        star:
        {
            name: "Super Food",
            texture: Utils.textureFromSheet("edibles", 256, 0, 256, 256),
            randomColor: true,
            nutrition: new Decimal(3),
            damage: 0.25
        },
        monster:
        {
            name: "Monster",
            texture: Utils.textureFromSheet("edibles", 512, 0, 256, 256),
            randomColor: true,
            nutrition: new Decimal(1.05),
            damage: 0.5
        },
        atom:
        {
            name: "Atom",
            texture: Utils.textureFromSheet("edibles", 0, 256, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1),
            damage: 0.2
        },
        virus:
        {
            name: "Virus",
            texture: Utils.textureFromSheet("edibles", 256, 256, 256, 256),
            randomColor: true,
            nutrition: new Decimal(0.95),
            damage: 0.4
        },
        bacteria:
        {
            name: "Bacteria",
            texture: Utils.textureFromSheet("edibles", 512, 256, 256, 256),
            randomColor: true,
            nutrition: new Decimal(1.1),
            damage: 0.4
        },
        rock:
        {
            name: "Rock",
            texture: Utils.textureFromSheet("edibles", 0, 512, 256, 256),
            randomColor: false,
            nutrition: new Decimal(0.95),
            damage: 0.3,
            stationary: true
        },
        building:
        {
            name: "Building",
            texture: Utils.textureFromSheet("edibles", 256, 512, 256, 256),
            randomColor: true,
            nutrition: new Decimal(1),
            damage: 0.25,
            stationary: true
        },
        hill:
        {
            name: "Hill",
            texture: Utils.textureFromSheet("edibles", 512, 512, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1),
            damage: 0.25,
            stationary: true
        },
        city:
        {
            name: "City",
            texture: Utils.textureFromSheet("edibles", 768, 512, 256, 256),
            randomColor: true,
            nutrition: new Decimal(1),
            damage: 0.25,
            stationary: true
        },
        mountain:
        {
            name: "Mountain",
            texture: Utils.textureFromSheet("edibles", 0, 768, 256, 256),
            randomColor: false,
            nutrition: new Decimal(0.9),
            damage: 0.25,
            stationary: true
        },
        continent:
        {
            name: "Continent",
            texture: Utils.textureFromSheet("edibles", 256, 768, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.1),
            damage: 0.25,
            stationary: true
        },
        earthlike:
        {
            name: "Earth-like Planet",
            texture: Utils.textureFromSheet("edibles", 512, 768, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.5),
            damage: 0.35
        },
        planet:
        {
            name: "Planet",
            texture: Utils.textureFromSheet("edibles", 768, 768, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1),
            damage: 0.3
        },
        starSmall:
        {
            name: "Star",
            texture: Utils.textureFromSheet("edibles", 0, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.3),
            damage: 0.5
        },
        starBig:
        {
            name: "Big Star",
            texture: Utils.textureFromSheet("edibles", 256, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.15),
            damage: 0.5
        },
        starCluster:
        {
            name: "Star Cluster",
            texture: Utils.textureFromSheet("edibles", 512, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.0),
            damage: 0.3
        },
        galaxySmall:
        {
            name: "Small Galaxy",
            texture: Utils.textureFromSheet("edibles", 768, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.05),
            damage: 0.3
        },
        galaxyBig:
        {
            name: "Big Galaxy",
            texture: Utils.textureFromSheet("edibles", 1024, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.1),
            damage: 0.3
        },
        galaxyCluster:
        {
            name: "Galaxy Cluster",
            texture: Utils.textureFromSheet("edibles", 1024 + 256, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.0),
            damage: 0.2
        },
        universe:
        {
            name: "Universe",
            texture: Utils.textureFromSheet("edibles", 1024 + 512, 1024, 256, 256),
            randomColor: false,
            nutrition: new Decimal(1.75),
            damage: 0.35
        }
    };

    edibleRanges = 
    [
        {
            type: edibleTypes.atom,
            min: new Decimal(15e-12),
            max: new Decimal(500e-12)
        },
        {
            type: edibleTypes.virus,
            min: new Decimal(50e-9),
            max: new Decimal(750e-9)
        },
        {
            type: edibleTypes.bacteria,
            min: new Decimal(5e-6),
            max: new Decimal(500e-6)
        },
        {
            type: edibleTypes.rock,
            min: new Decimal(5e-3),
            max: new Decimal(10)
        },
        {
            type: edibleTypes.building,
            min: new Decimal(10),
            max: new Decimal(1e3)
        },
        {
            type: edibleTypes.hill,
            min: new Decimal(1e3),
            max: new Decimal(5e3)
        },
        {
            type: edibleTypes.city,
            min: new Decimal(5e3),
            max: new Decimal(50e3)
        },
        {
            type: edibleTypes.mountain,
            min: new Decimal(50e3),
            max: new Decimal(500e3)
        },
        {
            type: edibleTypes.continent,
            min: new Decimal(500e3),
            max: new Decimal(3e6)
        },
        {
            type: edibleTypes.earthlike,
            min: new Decimal(10e6),
            max: new Decimal(25e6)
        },
        {
            type: edibleTypes.planet,
            min: new Decimal(25e6),
            max: new Decimal(150e6)
        },
        {
            type: edibleTypes.starSmall,
            min: new Decimal(1e9),
            max: new Decimal(25e9)
        },
        {
            type: edibleTypes.starBig,
            min: new Decimal(25e9),
            max: new Decimal(1e12)
        },
        {
            type: edibleTypes.starCluster,
            min: new Decimal(10e12),
            max: new Decimal(100e15)
        },
        {
            type: edibleTypes.galaxySmall,
            min: new Decimal(5e18),
            max: new Decimal(500e18)
        },
        {
            type: edibleTypes.galaxyBig,
            min: new Decimal(500e18),
            max: new Decimal(20e21)
        },
        {
            type: edibleTypes.galaxyCluster,
            min: new Decimal(100e21),
            max: new Decimal(50e24)
        },
        {
            type: edibleTypes.universe,
            min: new Decimal(500e24),
            max: new Decimal(500e27)
        }
    ]

    player = new Player(startScale);
    nearestObjArrow = PIXI.Sprite.from("Sprites/arrow.png");
    nearestObjArrow.width = 32;
    nearestObjArrow.height = 32;
    nearestObjArrow.anchor.set(0.5, 0.5);

    app.renderer.backgroundColor = 0x000000;
    app.stage.addChild(player);
    app.stage.addChild(containers.edibleObjects);
    app.stage.addChild(containers.ui);
    app.stage.addChild(containers.paused);
    app.stage.addChild(nearestObjArrow);
    app.stage.addChild(graphics);

    initUI();

    loadGame(localStorage.getItem("InfEaterGame"));

    document.querySelector("#canvas").appendChild(app.view);

    for(let i = 0; i < 200; i++)
            generateEdible();

    setInterval(saveGame, 10e3);

    requestAnimationFrame(update);
}

function initUI()
{
    ui.image_playerSize.anchor.set(0.5, 0);
    ui.image_playerSize.position.set(32, 16);
    ui.image_playerSize.width = 48;
    ui.image_playerSize.height = 48;
    containers.ui.addChild(ui.image_playerSize);

    ui.text_playerSize.position.set(64, 16);
    containers.ui.addChild(ui.text_playerSize);

    ui.image_xp.anchor.set(0.5, 0);
    ui.image_xp.position.set(appWidth - 32, 20);
    ui.image_xp.width = 48;
    ui.image_xp.height = 48;
    containers.ui.addChild(ui.image_xp);

    ui.text_xp.anchor.set(1, 0);
    ui.text_xp.position.set(appWidth - 64, 16);
    containers.ui.addChild(ui.text_xp);

    ui.text_xpGet.anchor.set(1, 0);
    ui.text_xpGet.position.set(appWidth - 16, 64);
    containers.ui.addChild(ui.text_xpGet);

    ui.text_eatMulti.position.set(64, 64);
    containers.ui.addChild(ui.text_eatMulti);

    ui.image_lastObject.anchor.set(0.5, 0.5);
    ui.image_lastObject.position.set(32, appHeight - 36);
    ui.image_lastObject.width = 40;
    ui.image_lastObject.height = 40;
    containers.ui.addChild(ui.image_lastObject);

    ui.text_lastObject.anchor.set(0, 1);
    ui.text_lastObject.position.set(60, appHeight - 16);
    containers.ui.addChild(ui.text_lastObject);

    ui.paused.text_paused.anchor.set(0.5, 0.5);
    ui.paused.text_paused.position.set(appWidth / 2, appHeight / 2);
    containers.paused.addChild(ui.paused.text_paused);

    ui.paused.text_stats.anchor.set(0.5, 0);
    ui.paused.text_stats.position.set(appWidth / 2, appHeight / 2 + 50);
    containers.paused.addChild(ui.paused.text_stats);
}

function update()
{
    deltaTimeOld = Date.now();

    let delta = (deltaTimeOld - deltaTimeNew) / 1000;

    if(settings.paused)
    {
        delta = 0;
        graphics.clear();
        graphics.beginFill(0x000000, 0.3)
        graphics.lineStyle(0, 0);
        graphics.drawRect(0, 0, appWidth, appHeight);

        containers.paused.alpha = 1;

        deltaTimeNew = Date.now();
        
        requestAnimationFrame(update);
        return;
    }

    if(containers.edibleObjects.children.length < 500)
    {
        for(let i = 0; i < 10; i++)
            generateEdible();
    }

    player.width = player.size.div(camera.range).toNumber() * appHeight;
    player.height = player.size.div(camera.range) * appHeight;
    player.position = worldToScreenPoint(player.worldPosition.x, player.worldPosition.y);
    if(player.size.gte(statistics.highestSize))
    {
        statistics.highestSize = player.size;
    }
    
    containers.edibleObjects.children.forEach(e => 
        {
            e.tick(delta);

            if(player.collidesWith(e))
            {
                if(player.size.gt(e.size))
                {
                    let divisor = player.size.div(e.size).pow(0.9).mul(0.5);
                    let sizeFactor = Decimal.min(1, Decimal.pow(0.9, Decimal.log10(player.size)));
                    player.size = player.size.add(e.size.div(10).div(divisor).mul(e.nutrition).mul(sizeFactor).mul(progression.eatMultiplier));
                    if(player.size.gt(player.maxSize))
                    {
                        player.maxSize = player.size;
                    }
                    ui.image_lastObject.texture = e.texture;
                    ui.image_lastObject.tint = e.tint;
                    ui.text_lastObject.text = e.name;
                    ui.text_lastObject.alpha = 1;
                    ui.image_lastObject.alpha = 1;
                    statistics.objectsEaten++;
                    containers.edibleObjects.removeChild(e);
                }
                else
                {
                    player.size = player.size.sub(e.size.mul(e.damage).mul(delta));
                    if(player.size.lte(0))
                    {
                        onPlayerDeath();
                    }
                }
            }

            e.renderable = e.x > 0 - e.width / 2 &&
                         e.x < appWidth + e.width / 2 && 
                         e.y > 0  - e.height / 2 && 
                         e.y < appHeight + e.height / 2;

            if(Utils.pythagoras(e.worldPosition.x, e.worldPosition.y, player.worldPosition.x, player.worldPosition.y).gte(player.size.mul(1e5)) ||
                e.size.mul(1e10).lt(player.size))
            {
                containers.edibleObjects.removeChild(e);
            }
        });

    if(player.size.gte(camera.targetRange.mul(1e10)) ||
        player.size.lte(camera.targetRange.div(1e10)))
    {
        camera.targetRange = player.size.mul(10);
        camera.range = camera.targetRange;
    }

    if(player.size.gte(camera.targetRange.div(4)))
    {
        camera.targetRange = camera.targetRange.mul(5);
        for(let i = 0; i < 100; i++)
            generateEdible();
    }

    if(player.size.lte(camera.targetRange.div(20)))
    {
        camera.targetRange = camera.targetRange.div(5);
        for(let i = 0; i < 100; i++)
            generateEdible();
    }

    updateNearestObjArrow();

    camera.centerX = Utils.lerp(camera.centerX, player.worldPosition.x, 5 * delta);
    camera.centerY = Utils.lerp(camera.centerY, player.worldPosition.y, 5 * delta);

    camera.range = camera.range.mul(Decimal.pow(camera.targetRange.div(camera.range), Math.pow(0.05, 60 * delta)));

    if(controls.mouseDown)
    {
        let pos = 
        {
            x: (controls.mousePos.x - appWidth / 2) / appHeight * 2,
            y: (controls.mousePos.y - appHeight / 2) / -appHeight * 2
        };
        pos.x = Utils.clamp(pos.x, -1, 1);
        pos.y = Utils.clamp(pos.y, -1, 1);
        let playerSpeed = camera.range.mul(0.1).add(player.size.mul(0.05));
        player.move(playerSpeed.mul(0.25 * pos.x), playerSpeed.mul(0.25 * pos.y));
    }

    let r = Math.round(128 + 128 * Math.sin(Math.PI + Decimal.log10(camera.range)) * 0.05);
    let g = Math.round(128 + 128 * Math.sin(Math.PI + Decimal.log10(camera.range)));
    let b = Math.round(128 + 128 * Math.sin(Math.PI + Decimal.log10(camera.range)) * 0.2);
    app.renderer.backgroundColor = Utils.colorToInt(r, g, b);

    updateUI(delta);

    document.querySelector("#upgrades").style.display = progression.totalXp.gt(0) ? "block" : "none";

    graphics.clear();

    deltaTimeNew = Date.now();

    requestAnimationFrame(update);
}

function generateEdible()
{
    let x = player.worldPosition.x.add(player.size.mul(50).mul(-1 + 2 * Math.random()));
    let y = player.worldPosition.y.add(player.size.mul(50).mul(-1 + 2 * Math.random()));
    let s = player.size.mul(Math.random() * 2.5).mul(Math.random < 0.5 ? 10 : 1);

    let rand = Math.random();

    if(rand < 0.5)
    {
        x = x.add(camera.range.add(s).div(2).mul(appWidth / appHeight * (x.lt(player.worldPosition.x) ? -1 : 1)));
    }
    else
    {
        y = y.add(camera.range.add(s).div(2).mul((y.lt(player.worldPosition.y) ? -1 : 1)))
    }

    let type = edibleTypes.blob;
    rand = Math.random();

    if(rand < 0.15)
    {
        type = edibleTypes.monster;
    }
    if(rand < 0.025)
    {
        type = edibleTypes.star;
    }

    let highestRangeMax = edibleRanges[edibleRanges.length - 1].max;

    if(s.gt(highestRangeMax))
    {
        let keys = Object.keys(edibleTypes);
        type = edibleTypes[keys[Math.floor(Math.random() * keys.length)]];
    }

    let e = spawnEdible(x, y, s, type, Math.random() > 0.1);

    rand = Math.random();

    let sizeDiff = e.size.div(player.size);

    if(e.stationary === undefined || !e.stationary)
    {
        if(sizeDiff.lt(10))
        {
            if(rand < 0.25)
                e.behavior = edibleBehaviors.circle;
            if(rand < 0.02 || (rand > 0.5 && type == edibleTypes.monster))
                e.behavior = edibleBehaviors.chase;
        }
    }

    return e;
}

function updateUI(delta)
{
    ui.text_playerSize.text = formatSize(player.size);
    ui.text_eatMulti.text = "Size gain x" + formatNumber(progression.eatMultiplier, 0, 2) + " (+ x" + formatNumber(progression.getEatMultiplier(player.maxSize), 0, 2) + ")";

    ui.text_xp.text = formatNumber(progression.xp, settings.numberFormatType);
    ui.text_xpGet.text = "(+" + formatNumber(progression.getXp(player.maxSize), settings.numberFormatType) + ")";

    ui.text_lastObject.alpha *= Math.pow(0.5, delta);
    ui.image_lastObject.alpha *= Math.pow(0.5, delta);

    ui.image_lastObject.rotation += Math.PI * delta;

    ui.paused.text_stats.text = `
        Biggest size reached: ${formatSize(statistics.highestSize)}
        Total Objects eaten: ${statistics.objectsEaten.toFixed(0)}
    `

    containers.paused.alpha = settings.paused ? 1 : 0;
}

function updateNearestObjArrow()
{
    let nearestEdible = player.getNearestConsumableEdible(containers.edibleObjects.children);

    if(nearestEdible !== null)
    {
        let dx = player.worldPosition.x.sub(nearestEdible.worldPosition.x);
        let dy = player.worldPosition.y.sub(nearestEdible.worldPosition.y);

        let normalized = Utils.normalize(dx, dy);

        let angle = Utils.rotationFromVector(normalized.x, normalized.y);
        let arrowOffset = Utils.VectorFromRotation(angle);

        let normDist = Utils.pythagoras(player.worldPosition.x, player.worldPosition.y,
                                    nearestEdible.worldPosition.x, nearestEdible.worldPosition.y).div(player.size).toNumber();

        let arrowDist = Math.min(100, 10 + player.width / 2 + normDist * 15);
        let arrowAlpha = Math.max(0, normDist / 10 - 0.35);

        nearestObjArrow.x = player.x + arrowOffset.x * arrowDist;
        nearestObjArrow.y = player.y + arrowOffset.y * arrowDist;
        nearestObjArrow.alpha = arrowAlpha;
        nearestObjArrow.rotation = Utils.rotationFromVector(normalized.x.toNumber(), normalized.y.toNumber());
    }
}

function onPlayerDeath()
{
    for(let i = containers.edibleObjects.children.length - 1; i >= 0; i--)
    {
        containers.edibleObjects.removeChild(containers.edibleObjects.children[i]);
    }

    progression.xp = progression.xp.add(progression.getXp(player.maxSize));
    progression.totalXp = progression.totalXp.add(progression.getXp(player.maxSize));
    progression.eatMultiplier = progression.eatMultiplier.add(progression.getEatMultiplier(player.maxSize));

    let startSize = Upgrade.apply(progression.upgrades.startingSize);

    player.size = startSize;
    player.maxSize = startSize;
    player.worldPosition.x = new Decimal(0);
    player.worldPosition.y = new Decimal(0);
    camera.centerX = new Decimal(0);
    camera.centerY = new Decimal(0);
    camera.targetRange = startSize.mul(10);
    camera.range = camera.targetRange.mul(5);
}

function getSaveString()
{
    let saveObj = {};

    saveObj.player = 
    {
        x: player.worldPosition.x.toString(),
        y: player.worldPosition.y.toString(),
        maxSize: player.maxSize.toString(),
        size: player.size.toString()
    };

    saveObj.upgrades = {};

    Object.keys(progression.upgrades).forEach(key => 
        {
            saveObj.upgrades[key] = {level: progression.upgrades[key].level}
        });

    saveObj.eatMultiplier = progression.eatMultiplier.toString();
    saveObj.xp = progression.xp.toString();

    saveObj.statistics = statistics;

    return JSON.stringify(saveObj);
}

function saveGame()
{
    localStorage.setItem("InfEaterGame", getSaveString());
}

function exportGame()
{
    download("InfiniteEaterExport.txt", btoa(getSaveString()));
}

function loadVal(val, a)
{
    return val ? val : a;
}

function loadGame(str)
{
    if(str)
    {
        let loadObj = JSON.parse(str);

        if(loadObj.player !== undefined)
        {
            Object.keys(loadObj.player).forEach(key => 
                {
                    player[key] = new Decimal(loadObj.player[key]);
                });
        }

        if(loadObj.upgrades !== undefined)
        {
            Object.keys(progression.upgrades).forEach(key => 
                {
                    progression.upgrades[key].level = loadObj.upgrades[key].level;
                    progression.upgrades[key].updateUI();
                });
        }

        progression.eatMultiplier = new Decimal(loadObj.eatMultiplier);
        progression.xp = new Decimal(loadObj.xp);
        if(loadObj.statistics)
        {
            statistics.highestSize = loadVal(new Decimal(loadObj.statistics.highestSize), new Decimal(0));
            statistics.objectsEaten = loadVal(loadObj.statistics.objectsEaten, 0);
        }
    }
}

function importGame()
{
    let str = prompt("Input your Save Code", "...");
    try
    {
        let decoded = atob(str);
        loadGame(decoded);
    }
    catch(e)
    {
        alert("Error: String could not be decoded\n" + e.message);
    }
}

function clearGameData()
{
    if(confirm("Do you really want to start over completely? There's no going back!"))
    {
        localStorage.clear();
        location.reload();
    }
}

function download(filename, data)
{
    let el = document.createElement("a");
    el.href = "data:text/plain;charset:urf-8," + encodeURIComponent(data);
    el.download = filename;

    el.style.display = "none";

    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
}

document.onkeypress = function(e)
{
    if(e.key.toLowerCase() === "p")
    {
        settings.paused = !settings.paused;
    }
}

app.view.onmousedown = function(e)
{
    controls.mouseDown = true;
}

app.view.onmousemove = function(e)
{
    let rect = app.view.getBoundingClientRect();
    controls.mousePos = {x: e.clientX - rect.x, y: e.clientY - rect.y};
}

app.view.onmouseup = function(e)
{
    controls.mouseDown = false;
}

app.view.onmouseout = function(e)
{
    controls.mouseDown = false;
}

document.oncontextmenu = function(e)
{
    return false;
}

window.onblur = function(e)
{
    camera.range = camera.targetRange;
    camera.centerX = player.worldPosition.x;
    camera.centerY = player.worldPosition.y;
}