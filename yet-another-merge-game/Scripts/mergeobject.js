class MergeObject
{
    constructor(x, y, level)
    {
        this.x = x;
        this.y = y;
        let a = Math.random() * 2 * Math.PI;
        let v = 0.2 * h;
        this.vx = Math.cos(a) * v;
        this.vy = Math.sin(a) * v;
        this.radius = 0.065 * game.canvas.h;
        this.level = level;
        this.lifeTime = 0;
        this.spawnText = 
        {
            cd: 0,
            time: 1
        };
        this.output = this.calculateOutput();
    }

    setVelocity(x, y)
    {
        this.vx = x;
        this.vy = y;
    }

    calculateOutput()
    {
        //return Decimal.pow(5, this.level).mul(new Decimal(1).add(game.prestige.quantumFoam.div(100)));
        return MergeObject.calculateOutputForLevel(this.level);
    }

    static calculateOutputForLevel(level)
    {
        return Decimal.pow(5, level).mul(gameFunctions.getQuantumFoamBoost())
                    .mul(Upgrade.apply(game.prestige.upgrades.matterBoost))
                    .mul(gameFunctions.getCoreBoost())
                    .mul(gameFunctions.getProcessorBoost())
                    .mul(Upgrade.apply(game.molecules.upgrades.matterBoost))
                    .mul(Upgrade.apply(game.isotopes.upgrades.matterBoost));
    }

    hitBorder()
    {
        return {
            x: this.x < this.radius || this.x > game.canvas.w - this.radius,
            y: this.y < this.radius || this.y > game.canvas.h - this.radius
        };    
    }

    collidesWith(mergeObj)
    {
        return Utils.dist(this.x, this.y, mergeObj.x, mergeObj.y) < this.radius + mergeObj.radius;
    }

    static getColor(level)
    {
        let h = (level / 20) % 1 * 360;
        let s = Math.min(level / 15, 1) * 100;

        return{
            inner: "hsl(" + h + "deg, " + s + "%, 60%)",
            outer: "hsl(" + h + "deg, " + s + "%, 38%)"
        };
    }

    static renderMerger(ctx, x, y, r, level, lifeTime)
    {
        level = Math.round(level);

        let baseH = (level / 20) % 1 * 360;
        let topH = (level / 20 + Math.max(0, level - 100) / 50) % 1 * 360;
        let s = Math.min(level / 15, 1) * 100;

        let innerCol = "hsl(" + baseH + "deg, " + s + "%, 60%)";
        let outerCol = "hsl(" + topH + "deg, " + s + "%, 38%)";

        if(level >= 199)
        {
            innerCol = "black";
            let l = (1 - Math.min(0.5, Math.max(0, (level - 202)) * 0.04)) * 100;
            outerCol = "hsl(" + topH + "deg, 100%, " + l + "%";
        }

        let gradient = ctx.createRadialGradient(x, y, 0, x, y, level >= 199 ? r * 1.5 : r);
        let sizeMod = Math.min(1, lifeTime * 4);

        if(level < 199)
        {
            gradient.addColorStop(0, innerCol);
            gradient.addColorStop(1, outerCol);
        }
        else
        {
            gradient.addColorStop(0.2, innerCol);
            gradient.addColorStop(0.9, outerCol);
        }

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, r * sizeMod, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.9 * sizeMod, 0, Math.PI * 2, false);
        ctx.fill();

        if(level >= 50)
        {
            let amnt = Math.min(10, Math.floor((level + 1) / 50) + 1);
            for(let i = 0; i < amnt; i++)
            {
                let step = 2 * Math.PI / amnt;
                let cx = Math.cos(step * i + lifeTime * 2) * r * sizeMod + x;
                let cy = Math.sin(step * i + lifeTime * 2) * r * sizeMod + y;

                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.arc(cx, cy, r / 3.5 * sizeMod, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle = outerCol;
                ctx.arc(cx, cy, r / 5 * sizeMod, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }

        ctx.fillStyle = level < 199 ? "black" : outerCol;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if(level <= 1000)
        {
            ctx.font = "700 " + (r * 0.6 * sizeMod * (level >= 99 ? 0.75 : 1)) + "px Montserrat, Arial, sans-serif";
            ctx.fillText("#" + Math.round(level + 1), x, y);
        }
        else
        {
            ctx.font = "700 " + (r * 0.65 * sizeMod) + "px Montserrat, Arial, sans-serif";
            ctx.fillText("#", x, y - r * 0.2);
            ctx.font = "700 " + (r * 0.43 * sizeMod) + "px Montserrat, Arial, sans-serif";
            ctx.fillText(Math.round(level + 1), x, y + r * 0.35);
        }
    }

    draw(ctx)
    {
        MergeObject.renderMerger(ctx, this.x, this.y, this.radius, this.level, this.lifeTime);
    }

    tick(delta)
    {
        this.output = this.calculateOutput();
        this.lifeTime += delta;

        if(delta > 0) //prevent negative matter(NaN)
        {
            game.matter = game.matter.add(this.output.mul(delta));
            game.matterThisPrestige = game.matterThisPrestige.add(this.output.mul(delta));
        }
        

        if(delta < 1)
        {
            let moveSpeedMulti = Upgrade.apply(game.prestige.upgrades.fasterMergers);
            this.x += this.vx * moveSpeedMulti * delta;
            this.y += this.vy * moveSpeedMulti * delta;
        }

        this.spawnText.cd += delta;
        if(this.spawnText.cd >= this.spawnText.time)
        {
            this.spawnText.cd = 0;
            gameFunctions.createFloatingText(gameFunctions.formatNumber(this.output), this.x, this.y - this.radius, h * 0.2);
        }

        if(this.hitBorder().x)
        {
            this.vx *= -1;
            this.x = Utils.clamp(this.x, this.radius, game.canvas.w - this.radius);
        }

        if(this.hitBorder().y)
        {
            this.vy *= -1;
            this.y = Utils.clamp(this.y, this.radius, game.canvas.h - this.radius);
        }

        for(let obj of game.mergeObjects)
        {
            if(this.collidesWith(obj) && this !== obj)
            {
                if(Math.round(this.level) === Math.round(obj.level))
                {
                    this.lifeTime = 0;
                    this.level++;
                    game.highestMergeObject = Math.round(Math.max(this.level, game.highestMergeObject));
                    game.highestMergeObjectThisPrestige = Math.round(Math.max(this.level, game.highestMergeObjectThisPrestige));
                    game.mergesThisPrestige++;
                    this.output = this.calculateOutput();

                    let a = (Math.atan2(this.vy, this.vx) + Math.atan2(obj.vy, obj.vx)) / 2; //average angle
                    let v = 0.2 * h;
                    this.vx = Math.cos(a) * v;
                    this.vy = Math.sin(a) * v;

                    game.mergeObjects = game.mergeObjects.filter(val => val !== obj);
                    if(game.quantumProcessor.cores.length >= 1 && Math.random() < Upgrade.apply(game.isotopes.upgrades.isotopeChance).toNumber())
                    {
                        let amount = Upgrade.apply(game.molecules.upgrades.isotopeBoost)
                                        .mul(Upgrade.apply(game.molecules.upgrades.doubleIsotopes).toNumber() > Math.random() ? 2 : 1);
                        game.isotopes.amount = game.isotopes.amount.add(amount);
                    }

                    if(Math.random() < Upgrade.apply(game.upgrades.matterOnMerge).toNumber())
                    {
                        let income = gameFunctions.totalMatterPerSecond().mul(2);
                        gameFunctions.createFloatingText(gameFunctions.formatNumber(income), this.x, this.y, h * 0.35,  {color: "blue", size: h * 0.06});
                        game.matter = game.matter.add(income);
                        game.matterThisPrestige = game.matterThisPrestige.add(income);
                    }

                    gameFunctions.checkCores();
                }
            }
        }
    }
}