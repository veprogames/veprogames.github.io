class Automator{
    constructor(name, desc, baseSpeed, basePrice, action)
    {
        this.name = name;
        this.desc = desc;
        this.level = 0;
        this.cooldown = 0;
        this.baseSpeed = baseSpeed;
        this.basePrice = basePrice;
        this.price = this.basePrice;
        this.action = action;
        this.active = true;
    }

    tick(delta)
    {
        if(this.level > 0)
        {
            this.cooldown += delta;
            if(this.cooldown > this.getSpeed())
            {
                this.cooldown -= this.getSpeed();
                if(this.active)
                {
                    this.action();
                }
            }
        }
    }

    buy()
    {
        if(game.automatons >= this.price)
        {
            game.automatons -= this.price;
            this.level++;
            this.price = this.getPrice();
        }
    }

    getPrice()
    {
        return this.basePrice * (1 + this.level);
    }

    getSpeedForLevel(level)
    {
        return level > 0 ? this.baseSpeed / level : this.baseSpeed;
    }

    getSpeed()
    {
        return this.getSpeedForLevel(this.level);
    }

    respec()
    {
        while(this.level > 0)
        {
            this.level--;
            this.price = this.getPrice();
            game.automatons += this.price;
        }
    }
}