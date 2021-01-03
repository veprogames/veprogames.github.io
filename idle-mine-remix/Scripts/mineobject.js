class MineObject
{
    constructor(name, hp, def, value, colors, skin, cfg)
    {
        this.name = name;
        this.hp = new Decimal(hp);
        this.totalHp = this.hp;
        this.def = new Decimal(def);
        this.value = new Decimal(value);
        this.colors = [];
        if(colors.length === 0)
        {
            this.colors = ["white", "black"];
        }
        else if(colors.length === 1)
        {
            this.colors = [colors[0], "black"];
        }
        else
        {
            this.colors = colors;
        }
        this.skin = skin ? skin : 0;
        this.cfg = cfg; //cached for create()
        this.drops = cfg && cfg.drops ? cfg.drops : {};
        /*if(this.drops !== {})
        {
            for(let k in this.drops)
            {
                if(this.drops.hasOwnProperty(k))
                {
                    //this.drops[k].amount = new Decimal(this.drops[k].amount); //causes infinite render update loop
                }
            }
        }*/
    }

    static create(from)
    {
        return new MineObject(from.name, from.hp, from.def, from.value, from.colors, from.skin, from.cfg);
    }

    getTotalWisdom()
    {
        if(this.drops === {} || this.drops.wisdom === undefined)
        {
            return null;
        }
        return new Decimal(this.drops.wisdom.amount).mul(game.powers.data.values[POWER_WISDOM]);
    }

    damage(d)
    {
        d = new Decimal(d);
        this.hp = this.hp.sub(d);
        if(this.hp.lte(0))
        {
            game.money = game.money.add(this.value);
            game.highestMoney = Decimal.max(game.money, game.highestMoney);
            game.highestMineObjectLevel = Math.max(game.highestMineObjectLevel, game.mineObjectLevel + 1);

            let newObj = functions.getMineObject(game.mineObjectLevel);
            game.currentMineObject = newObj;
            if(Math.random() < applyUpgrade(game.upgrades.gemChance).toNumber())
            {
                let bonus = game.mineObjectLevel === functions.getHighestDamageableMineObjectLevel() ? applyUpgrade(game.planetCoinUpgrades.lastObjGems) : 1;
                game.gems = Decimal.round(game.gems.add(applyUpgrade(game.gemUpgrades.gemMultiply).mul(bonus)));
            }
            if(this.drops.planetcoin !== undefined && Math.random() < this.drops.planetcoin.chance)
            {
                game.planetCoins = game.planetCoins.add(new Decimal(this.drops.planetcoin.amount));
                game.maxPlanetCoins = Decimal.max(game.planetCoins, game.maxPlanetCoins);
            }
            if(this.drops.wisdom !== undefined && Math.random() < this.drops.wisdom.chance)
            {
                game.wisdom = game.wisdom.add(this.getTotalWisdom());
                game.maxWisdom = Decimal.max(game.wisdom, game.maxWisdom);
            }
        }
    }
}