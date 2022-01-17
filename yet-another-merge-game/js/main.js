let ctx, w, h;
let dateDt = Date.now();

let gameBackground = new GameBackground();
let resourceDisplays;

let app;

onload = e => {
    document.body.removeChild(document.getElementById("loading"));
    ADNotations.Settings.exponentCommas.min = 1000;
    app = new Vue(
        {
            el: "#app",
            data: game,
            methods: functions,
            mounted: gameInit
        });
}

function gameInit() {
    globalEvents.dispatchPreInit();

    let canvas = document.getElementById("mergedisplay");
    ctx = canvas.getContext("2d");
    canvas.height = innerHeight;
    canvas.width = innerHeight * 4 / 3;
    w = canvas.width;
    h = canvas.height;

    for (let k of Object.keys(ADNotations)) {
        if (!["BlindNotation", "BarNotation", "CustomNotation", "Notation", "Settings"].includes(k)) {
            let notation = new ADNotations[k]();
            if (notations.findIndex(n => n.name === notation.name) === -1) {
                notations.push(new ADNotations[k]());
            }
        }
    }
    for (let k of Object.keys(ADCommunityNotations)) {
        if (!["Notation", "Settings"].includes(k)) {
            notations.push(new ADCommunityNotations[k]());
        }
    }

    SaveManager.loadGame();

    inputManager.addAction("m", () => {
        if (game.prestige.hasPrestiged()) functions.maxUpgrades(game.matter.amount, game.matter.upgrades);
    });
    inputManager.addAction("p", () => {
        if (game.prestige.hasPrestiged()) game.prestige.prestige();
    }, true);
    inputManager.addAction("q", () => {
        if (game.prestige.hasPrestiged()) functions.maxUpgrades(game.prestige.quantumFoam, game.prestige.upgrades);
    });
    inputManager.addAction("e", () => {
        if (game.energyCores.isUnlocked()) game.energyCores.selectMostEfficientEnergyCore();
    });
    inputManager.addAction("i", () => {
        if (game.isotopes.isUnlocked()) functions.maxUpgrades(game.isotopes.amount, game.isotopes.upgrades);
    });
    inputManager.addAction("o", () => {
        if (game.molecules.isUnlocked()) functions.maxUpgrades(game.molecules.amount, game.molecules.upgrades);
    });

    document.querySelector("#mergedisplay").onmousedown = e => {
        if (game.clickAbility === ABILITY_SPAWN_SPEED) {
            functions.decreaseSpawnCooldown(0.075);
        }
        else if (game.clickAbility === ABILITY_MERGER_MOVE_SPEED) {
            for (let m of game.mergeObjects) {
                m.addClickSpeedMulti(0.5);
            }
        }

        if (game.settings.clickParticles) {
            let rect = e.target.getBoundingClientRect();
            //normalize document coordinates to canvas coordinates
            let mx = (e.clientX - rect.x) * (w / rect.width);
            let my = (e.clientY - rect.y) * (h / rect.height);
            ImageParticle.create(images.particles.speed, mx, my);
            if (game.molecules.isUnlocked()) {
                ImageParticle.create(images.currencies.molecules, mx, my);
                game.molecules.addMolecules(game.molecules.currentMolecule.getValue());
            }
        }
    }

    onbeforeunload = SaveManager.saveGame;

    if(Utils.isIPad()){
        const iPadFix = () => {
            const mergeDisplay = document.querySelector("#mergedisplay");
            const header = document.querySelector("header");
            const container = document.querySelector(".game-container");

            mergeDisplay.style.height = `${container.offsetTop - header.clientHeight + 1}px`;
        };

        window.addEventListener("resize", iPadFix);

        setInterval(iPadFix, 300);
    }

    CanvasUtils.loadImages().then(img => {
        game.loading = false;
        less.refresh(); //workaround
        images = img;
        resourceDisplays = [
            new ResourceDisplay(images.currencies.quantumFoam, w * 0.025, h * 0.01,
                () => functions.formatNumber(game.prestige.quantumFoam) + " (+" + functions.formatNumber(game.prestige.getQuantumFoam()) + ")",
                () => game.prestige.isUnlocked()),
            new ResourceDisplay(images.currencies.energyCores, w * 0.525, h * 0.01,
                () => "x" + functions.formatNumber(game.energyCores.getCoreBoost(), 2),
                () => game.prestige.highestQuantumFoam.gte(50000)),
            new ResourceDisplay(images.currencies.quantumProcessor, w * 0.025, h * 0.01 + w * 0.055,
                () => game.quantumProcessor.cores.length.toFixed(0) + " [x" + functions.formatNumber(game.quantumProcessor.getProcessorBoost()) + "]",
                () => game.quantumProcessor.isUnlocked()),
            new ResourceDisplay(images.currencies.isotopes, w * 0.525, h * 0.01 + w * 0.055,
                () => functions.formatNumber(game.isotopes.amount, false, 0, 1e10),
                () => game.isotopes.isUnlocked()),
            new ResourceDisplay(images.currencies.molecules, w * 0.025, h * 0.01 + w * 0.11,
                () => functions.formatNumber(game.molecules.amount, false, 0),
                () => game.molecules.isUnlocked())
        ];
        
        requestAnimationFrame(gameUpdate);
    });

    globalEvents.dispatchInit();
}

function gameUpdate() {
    globalEvents.dispatchUpdate();
    let delta = Math.max(0, (Date.now() - dateDt) / 1000);
    dateDt = Date.now();

    game.time += delta;

    inputManager.tick();

    if (game.mergeObjects.length < Upgrade.apply(game.matter.upgrades.maxObjects).toNumber()) {
        game.spawnTime.cd += delta;
    }
    if (game.spawnTime.cd >= game.spawnTime.time) {
        let amount = 1 + (Math.random() < Upgrade.apply(game.isotopes.upgrades.doubleSpawn).toNumber() ? 1 : 0);
        for (let i = 0; i < amount; i++) {
            if (game.mergeObjects.length < Upgrade.apply(game.matter.upgrades.maxObjects).toNumber()) {
                functions.spawnRandomMergeObject(Upgrade.apply(game.matter.upgrades.betterObjects).toNumber());
            }
        }
        game.spawnTime.cd = 0;
    }
    game.spawnTime.time = Upgrade.apply(game.matter.upgrades.fasterSpawn).toNumber();

    game.saveTime.cd += delta;
    if (game.saveTime.cd > game.saveTime.time) {
        SaveManager.saveGame();
        game.saveTime.cd = 0;
    }

    for (let i = 0; i < game.mergeObjects.length; i++) {
        game.mergeObjects[i].tick(delta);
    }

    if (game.prestige.isUnlocked()) {
        let foam = Upgrade.apply(game.isotopes.upgrades.autoQuantumFoam)
            .mul(game.prestige.getQuantumFoam()).mul(delta);
        game.prestige.addQuantumFoam(foam);
    }

    for (let text of game.floatingTexts) {
        text.tick(delta);

        if (text.lifeTime >= text.maxTime) {
            game.floatingTexts = game.floatingTexts.filter(v => text !== v);
        }
    }

    for (let p of particles) {
        p.tick(delta);
    }

    /************  DRAW GAME CANVAS ***************/

    let baseHeight = h * 0.07;
    let barColor = gameBackground.getTopBarColor();
    let fontColor = gameBackground.getFontColor();
    let fontFamily = CanvasUtils.getFontFamily();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    gameBackground.render(ctx);

    for (let text of game.floatingTexts) {
        text.draw(ctx);
    }

    for (let m of game.mergeObjects) {
        m.draw(ctx);
    }

    if (game.settings.topBarShown) {
        if (game.prestige.isUnlocked()) {
            baseHeight = game.quantumProcessor.isUnlocked() ? h * 0.07 + w * 0.1 : h * 0.07 + w * 0.05;
            if (game.molecules.isUnlocked()) {
                baseHeight = h * 0.07 + w * 0.15;
            }
            ctx.fillStyle = barColor;
            ctx.textAlign = "left";
            ctx.globalAlpha = 0.7;
            ctx.fillRect(0, 0, w, baseHeight - w * 0.025);
            ctx.globalAlpha = 1;
        }
        ctx.textBaseline = "middle";
        ctx.font = (w * 0.035) + "px " + fontFamily;
        ctx.fillStyle = "black";
        for (let r of resourceDisplays) {
            r.render(ctx);
        }
    }

    //matter text
    let text = functions.formatNumber(game.matter.amount, false, 0, 1e9);
    CanvasUtils.drawText(ctx, text, w / 2, baseHeight, h * 0.0625,
        fontColor, "center", "middle", w / 2.1);

    //matter per second
    text = "+ " + functions.formatNumber(game.matter.totalMatterPerSecond()) + "/s";
    CanvasUtils.drawText(ctx, text, w * 0.75, baseHeight + h * 0.005, h * 0.031,
        fontColor, "left", "middle", w / 4.15);

    //spawn cd timer
    text = game.spawnTime.time >= 0.2 ? (game.spawnTime.time - game.spawnTime.cd).toFixed(1) + "s" : (1 / game.spawnTime.time).toFixed(1) + "/s";
    CanvasUtils.drawText(ctx, text, w * 0.99, baseHeight + h * 0.1, h * 0.034,
        fontColor, "right", "bottom");

    text = game.mergeObjects.length.toFixed(0) + " / " + Upgrade.apply(game.matter.upgrades.maxObjects).toFixed(0);
    CanvasUtils.drawText(ctx, text, w * 0.5, baseHeight + h * 0.1, h * 0.034,
        fontColor, "center", "bottom");


    //spawn pbar
    let progress = game.spawnTime.time < 0.2 ? 1 : game.spawnTime.cd / game.spawnTime.time;
    CanvasUtils.drawProgressBar(ctx, 0, baseHeight + h * 0.03, w, h * 0.036, progress,
        "#00000040", images.progress);

    for (let p of particles) {
        p.render(ctx);
    }

    setTimeout(gameUpdate, 1000 / game.settings.maxFps);
}