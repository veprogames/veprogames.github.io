class Universe
{
    constructor(name, size, resistance)
    {
        this.name = name;
        this.size = size; //diameter
        this.maxSize = this.size;
        this.resistance = resistance;
    }

    getShrinkProgress()
    {
        let logpl = Decimal.log10(PLANCK_LENGTH);
        let log1 = Decimal.log10(this.size);
        let log2 = Decimal.log10(this.maxSize);

        return 1 - (log1 - logpl) / (log2 - logpl);
    }

    shrink(f)
    {
        this.size = this.size.div(f);
    }

    isShrunk()
    {
        return this.getShrinkProgress() >= 1;
    }

    getShrinksPS()
    {
        let quotient = Decimal.log10(this.maxSize.div(PLANCK_LENGTH));
        return Decimal.log10(functions.getTotalShrinkPower(this)) / quotient;
    }

    reward(amount)
    {
       if(game.resources[this.name])
       {
           game.resources[this.name].addResource(new Decimal(amount));
       }
       else
       {
           game.resources[this.name] = new UniverseResource(this.name);
           game.resources[this.name].addResource(new Decimal(amount));
       }
       if(!game.universeLayers[this.name])
       {
           functions.generateUniverseLayer(this.name);
       }
    }

    tick(dt, active = true)
    {
        let shrinkPS = this.getShrinksPS();
        let mult = active ? 1 : game.thetaUpgrades.passiveUniverse.apply().toNumber();
        if(shrinkPS < 10)
        {
            this.shrink(functions.getTotalShrinkPower(this).pow(dt * mult));
            if(this.isShrunk())
            {
                this.size = this.maxSize;
                this.reward(game.thetaUpgrades.multVerse.apply());
                if(active && game.currentUniverseLevel === game.highestUniverseLevel && game.currentUniverseLevel < game.universes.length - 1)
                {
                    game.highestUniverseLevel++;
                }
            }
        }
        else
        {
            this.size = this.maxSize;
            if(active && game.currentUniverseLevel === game.highestUniverseLevel && game.currentUniverseLevel < game.universes.length - 1)
            {
                game.highestUniverseLevel++;
            }
            this.reward(new Decimal(shrinkPS).mul(game.thetaUpgrades.multVerse.apply()).mul(dt * mult));
        }
    }
}