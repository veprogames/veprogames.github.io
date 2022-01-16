class MergeObject {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        let a = Math.random() * 2 * Math.PI;
        let v = 0.2 * h;
        this.clickSpeedMulti = 1;
        this.vx = Math.cos(a) * v;
        this.vy = Math.sin(a) * v;
        this.radius = 0.065 * h;
        this.level = level;
        this.lifeTime = 0;
        this.spawnText =
        {
            cd: 0,
            time: 1
        };
        this.output = this.calculateOutput();
        this.calculateHandler = this.calculateOutput.bind(this); //needed for removeEventListener to work
        this.setupEvents();
        this.interval = setInterval(() => {
            if(game.isotopes.upgrades.autoQuantumFoam.level >= 1){
                this.calculateOutput();
            }
        }, 1000);
    }

    assignEvents(destruct = false){
        const method1 = destruct ? "removeLevelChangedListener" : "addLevelChangedListener";
        const method2 = destruct ? "removeEventListener" : "addEventListener";

        for(const upg of [game.molecules.upgrades.mergerLevelExponent, game.prestige.upgrades.matterBoost, game.isotopes.upgrades.matterBoost,
            game.molecules.upgrades.matterBoost, game.prestige.upgrades.socialBoost]){
                upg[method1](this.calculateHandler);
            }
        for(const core of game.energyCores.cores){
            core[method1](this.calculateHandler);
        }
        for(const core of game.quantumProcessor.cores){
            core[method1](this.calculateHandler);
        }
        globalEvents[method2]("subscribeyt", this.calculateHandler);
    }

    setupEvents(){
        this.assignEvents();
    }

    destructEvents(){
        this.assignEvents(true);
    }

    setVelocity(x, y) {
        this.vx = x;
        this.vy = y;
    }

    setLevel(level){
        this.level = level;
        this.recalculateOutput();
    }

    nextLevel(){
        this.setLevel(this.level + 1);
    }

    addClickSpeedMulti(amount) {
        this.clickSpeedMulti = Math.min(1.6, this.clickSpeedMulti + amount);
    }

    calculateOutput() {
        return MergeObject.calculateOutputForLevel(this.level);
    }

    recalculateOutput(){
        this.output = this.calculateOutput();
    }

    static getBaseProduction(level){
        return Decimal.pow(5, level);
    }

    static calculateOutputForLevel(level) {
        const social = localStorage.getItem("YetAnotherMergeGame_Support_YT") !== null ? 
            game.prestige.upgrades.socialBoost.apply() : 1;
        return Decimal.pow(Upgrade.apply(game.molecules.upgrades.mergerLevelExponent), level).mul(game.prestige.getQuantumFoamBoost())
            .mul(Upgrade.apply(game.prestige.upgrades.matterBoost))
            .mul(game.energyCores.getCoreBoost())
            .mul(game.quantumProcessor.getProcessorBoost())
            .mul(Upgrade.apply(game.isotopes.upgrades.matterBoost))
            .mul(Upgrade.apply(game.molecules.upgrades.matterBoost))
            .mul(social);
    }

    hitBorder() {
        return {
            x: this.x < this.radius || this.x > w - this.radius,
            y: this.y < this.radius || this.y > h - this.radius
        };
    }

    collidesWith(mergeObj) {
        return Utils.distSquared(this.x, this.y, mergeObj.x, mergeObj.y) < (this.radius + mergeObj.radius) ** 2;
    }

    static getColor(level) {
        let baseH = (level / 20) % 1 * 360;
        let topH = (level / 20 + Math.max(0, level - 100) / 50) % 1 * 360;
        let s = Math.min(level / 15, 1) * 100;

        let inner = "hsl(" + baseH + "deg, " + s + "%, 60%)";
        let outer = "hsl(" + topH + "deg, " + s + "%, 38%)";

        if (level >= 149) {
            inner = "black";
            let l = (1 - Math.min(0.5, Math.max(0, (level - 152)) * 0.04)) * 100;
            outer = "hsl(" + topH + "deg, 100%, " + l + "%";
        }
        if (level >= 999) {
            let l = (1 - Math.min(0.5, Math.max(0, (level - 152)) * 0.04)) * 100;
            inner = "hsl(" + topH + "deg, 100%, " + l + "%";
            outer = "rgba(0, 0, 0, 0)";
        }

        return { inner, outer };
    }

    static createGradient(ctx, cx, cy, r, colors) {
        let gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);

        for (let i = 0; i < colors.length; i++) {
            gradient.addColorStop(i / (colors.length - 1), colors[i]);
        }

        return gradient;
    }

    static drawBubble(ctx, x, y, r, innerFill = "white", outerFill = "black", lineWidth = 0.1) {
        ctx.fillStyle = outerFill;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = innerFill;
        ctx.beginPath();
        ctx.arc(x, y, r * (1 - lineWidth), 0, Math.PI * 2, false);
        ctx.fill();
    }

    static renderMergerNumber(ctx, x, y, r, sizeMod, level){
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        if (level >= 149) {
            ctx.fillStyle = "white";
        }
        if (level <= 1000) {
            ctx.font = "700 " + (r * 0.6 * sizeMod * (level >= 99 ? 0.75 : 1)) + "px Montserrat, Arial, sans-serif";
            ctx.fillText("#" + Math.round(level + 1), x, y);
        } else {
            ctx.font = "700 " + (r * 0.65 * sizeMod) + "px Montserrat, Arial, sans-serif";
            ctx.fillText("#", x, y - r * 0.2);
            ctx.font = "700 " + (r * 0.43 * sizeMod) + "px Montserrat, Arial, sans-serif";
            ctx.fillText(functions.formatNumber(Math.round(level + 1), 0, 0, 100000), x, y + r * 0.35, r * 0.9);
        }
    }

    static renderMergerSimple(ctx, x, y, r, level, lifeTime, showNumber = true){
        let sizeMod = Math.min(1, lifeTime * 4);
        r *= sizeMod * 1.25;
        ctx.drawImage(images.merger, x - r, y - r, r * 2, r * 2);

        if (showNumber) {
            MergeObject.renderMergerNumber(ctx, x, y, r / 1.25, 1, level);
        }
    }

    static renderMerger(ctx, x, y, r, level, lifeTime, showNumber = true) {
        level = Math.round(level);
        let random = new Random(level);

        let c = this.getColor(level);
        let innerCol = c.inner;
        let outerCol = c.outer;

        let sizeMod = Math.min(1, lifeTime * 4);

        let gradient = this.createGradient(ctx, x, y, r * sizeMod, [innerCol, outerCol]);

        this.drawBubble(ctx, x, y, r * sizeMod, gradient, level < 999 ? "black" : "transparent");

        if (level >= 49) {
            let amnt = level > 250 ? 2 + random.nextInt(2) : Math.min(4, Math.floor((level + 1) / 50) + 1);
            for (let i = 0; i < amnt; i++) {
                let step = 2 * Math.PI / amnt;
                let angleMod = level > 250 ? 1 + random.nextDouble() : 1;
                let cx = Math.cos(step * i + lifeTime * 2 * angleMod) * r * sizeMod + x;
                let cy = Math.sin(step * i + lifeTime * 2 * angleMod) * r * sizeMod + y;

                if (level >= 250) {
                    let rMult = 0.7 + 0.7 * random.nextDouble() + 0.1 * Math.min(2500, level) / 1000;
                    let lvl = Math.min(1000, Math.floor(level / 3 * random.nextDouble()));
                    this.renderMerger(ctx, cx, cy, r * sizeMod / 2.5 * rMult, lvl, lifeTime * 3 * random.nextDouble(), false);
                }
                else {
                    this.drawBubble(ctx, cx, cy, r / 3.5, outerCol, "black", 0.4);
                }
            }
        }

        ctx.fillStyle = level < 149 ? "black" : outerCol;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (showNumber) {
            MergeObject.renderMergerNumber(ctx, x, y, r, sizeMod, level);
        }
    }

    draw(ctx) {
        if(game.settings.lowPerformanceMode){
            MergeObject.renderMergerSimple(ctx, this.x, this.y, this.radius, this.level, this.lifeTime);
        }
        else{
            MergeObject.renderMerger(ctx, this.x, this.y, this.radius, this.level, this.lifeTime);
        }
    }

    destroy(){
        clearInterval(this.interval);
        this.destructEvents();
        game.mergeObjects = game.mergeObjects.filter(val => val !== this);
    }

    tick(delta) {
        this.lifeTime += delta;

        if (delta > 0) //prevent negative matter(NaN)
        {
            game.matter.amount = game.matter.amount.add(this.output.mul(delta));
            game.matter.amountThisPrestige = game.matter.amountThisPrestige.add(this.output.mul(delta));
        }

        if (delta < 1) {
            let moveSpeedMulti = Upgrade.apply(game.prestige.upgrades.fasterMergers);
            this.x += this.vx * moveSpeedMulti * delta * this.clickSpeedMulti;
            this.y += this.vy * moveSpeedMulti * delta * this.clickSpeedMulti;
        }

        if(!game.settings.lowPerformanceMode){
            this.spawnText.cd += delta;
            if (this.spawnText.cd >= this.spawnText.time) {
                this.spawnText.cd = 0;
                functions.createFloatingText(functions.formatNumber(this.output), this.x, this.y - this.radius, h * 0.2);
            }
        }

        const hitBorder = this.hitBorder();

        if (hitBorder.x) {
            this.vx *= -1;
            this.x = Utils.clamp(this.x, this.radius, w - this.radius);
        }

        if (hitBorder.y) {
            this.vy *= -1;
            this.y = Utils.clamp(this.y, this.radius, h - this.radius);
        }

        this.clickSpeedMulti = Math.max(1, this.clickSpeedMulti / 3 ** delta);

        for (let obj of game.mergeObjects) {
            if (this.collidesWith(obj) && this !== obj) {
                if (Math.round(this.level) === Math.round(obj.level)) {
                    this.lifeTime = 0;
                    this.nextLevel();
                    game.highestMergeObject = Math.round(Math.max(this.level, game.highestMergeObject));
                    game.highestMergeObjectThisPrestige = Math.round(Math.max(this.level, game.highestMergeObjectThisPrestige));
                    game.mergesThisPrestige++;
                    this.output = this.calculateOutput();

                    let a = (Math.atan2(this.vy, this.vx) + Math.atan2(obj.vy, obj.vx)) / 2; //average angle
                    let v = 0.2 * h;
                    this.vx = Math.cos(a) * v;
                    this.vy = Math.sin(a) * v;

                    obj.destroy();
                    if (game.quantumProcessor.cores.length >= 1 && Math.random() < Upgrade.apply(game.isotopes.upgrades.isotopeChance).toNumber()) {
                        let amount = Upgrade.apply(game.molecules.upgrades.moreIsotopes).toNumber();
                        game.isotopes.amount = game.isotopes.amount.add(amount);
                    }

                    if (Math.random() < Upgrade.apply(game.matter.upgrades.matterOnMerge).toNumber()) {
                        let income = game.matter.totalMatterPerSecond().mul(2);
                        if(!game.settings.lowPerformanceMode){
                            functions.createFloatingText(functions.formatNumber(income), this.x, this.y, h * 0.35, {
                                color: "blue",
                                size: h * 0.06
                            });
                        }
                        game.matter.amount = game.matter.amount.add(income);
                        game.matter.amountThisPrestige = game.matter.amountThisPrestige.add(income);
                    }

                    if (game.molecules.isUnlocked()) {
                        game.molecules.currentMolecule.addMerges(1);
                        game.molecules.addMolecules(game.molecules.currentMolecule.getValue());
                    }

                    game.energyCores.checkCores();
                }
            }
        }
    }
}