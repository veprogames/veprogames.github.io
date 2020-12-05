class Automator{
    constructor(name, desc, getPrice, baseSpeed, onTick)
    {
        this.name = name;
        this.desc = desc;
        this.getPrice = getPrice;
        this.baseSpeed = baseSpeed;
        this.onTick = onTick;
        this.timer = 0;
        this.level = 0;
        this.active = false;
    }

    getSpeed(level)
    {
        if(level === 0)
        {
            return Infinity;
        }
        return this.baseSpeed / Math.pow(1.4, level - 1);
    }

    buy()
    {
        if(game.thetaEnergy.gte(this.getPrice(this.level)))
        {
            game.thetaEnergy = game.thetaEnergy.sub(this.getPrice(this.level));
            this.level++;
        }
    }

    getPriceDisplay()
    {
        return functions.formatNumber(this.getPrice(this.level), 2, 0, 1e6) + " &theta;<sub>E</sub>";
    }

    getEffectDisplay()
    {
        return (this.level > 0 ? this.getSpeed(this.level).toFixed(3) + "s" : "Not Bought") + " → " + this.getSpeed(this.level + 1).toFixed(3) + "s";
    }

    tick(dt)
    {
        if(this.active && this.level > 0)
        {
            this.timer += dt;
            if(this.timer > this.getSpeed(this.level))
            {
                this.timer = 0;
                this.onTick();
            }
        }
    }
}