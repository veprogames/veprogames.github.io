class EnergyCore //merge things to level it up, get an increasing multiplier
{
    constructor(name, price, getNeededMerges, getBoost, img)
    {
        this.name = name;
        this.price = price;
        this.getNeededMerges = getNeededMerges;
        this.level = 0;
        this.merges = 0;
        this.locked = true;
        this.isActive = false;
        this.getBoost = getBoost;
        this.img = img;
    }

    setActive(b)
    {
        this.isActive = b;
    }

    tryAddMerge()
    {
        if(this.isActive)
        {
            this.merges++;
            this.checkLevelUp();
        }
    }

    checkLevelUp()
    {
        if(this.merges >= this.getNeededMerges(this.level))
        {
            this.merges = 0;
            this.level++;
        }
    }

    buy()
    {
        if(this.locked && game.prestige.quantumFoam.gte(this.price))
        {
            game.prestige.quantumFoam = game.prestige.quantumFoam.sub(this.price);
            this.locked = false;
        }
    }
}