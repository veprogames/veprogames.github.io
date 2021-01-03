const RESOURCE_MONEY = 0, RESOURCE_GEM = 1, RESOURCE_PC = 2, RESOURCE_WISDOM = 3;

function applyUpgrade(upg)
{
    return upg.getEffect(upg.level);
}

class Upgrade
{
    constructor(name, desc, getPrice, getEffect, cfg)
    {
        this.name = name;
        this.desc = desc;
        this.level = 0;
        this.icon = "";

        this.getPrice = getPrice;
        this.getEffect = getEffect;
        if(cfg)
        {
            if(cfg.getEffectDisplay)
            {
                this.getEffectDisplay = cfg.getEffectDisplay;
            }
            if(cfg.onBuy)
            {
                this.onBuy = cfg.onBuy;
            }
        }
        this.maxLevel = cfg && cfg.maxLevel ? cfg.maxLevel : Infinity;
        this.img = cfg && cfg.img ? cfg.img : "upg_placeholder.png";

        this.resource = RESOURCE_MONEY;
    }

    onBuy()
    {

    }

    //return true if upgrade could be bought, used for multibuy
    buy(round)
    {
        let resource;
        switch(this.resource)
        {
            case RESOURCE_MONEY:
                resource = game.money;
                break;
            case RESOURCE_GEM:
                resource = game.gems;
                break;
            case RESOURCE_PC:
                resource = game.planetCoins;
                break;
            case RESOURCE_WISDOM:
                resource = game.wisdom;
                break;
            default:
                break;
        }

        let canAfford = round ? (this.currentPrice().round().lte(resource.round())) : this.currentPrice().lte(resource);
        if(this.level < this.getMaxLevel() && canAfford)
        {
            this.onBuy();
            let p = round ? this.currentPrice().round() : this.currentPrice();
            resource = resource.sub(p);
            if(isNaN(resource)) //is resource is negative
            {
                resource = new Decimal(0);
            }
            switch(this.resource)
            {
                case RESOURCE_MONEY:
                    game.money = resource;
                    break;
                case RESOURCE_GEM:
                    game.gems = resource;
                    break;
                case RESOURCE_PC:
                    game.planetCoins = resource;
                    break;
                case RESOURCE_WISDOM:
                    game.wisdom = resource;
                    break;
                default:
                    break;
            }
            this.level++;
            return true;
        }
        else
        {
            return false;
        }
    }

    buyN(n, ocd, round)
    {
        let step = n;
        while(n > 0 && this.buy(round) && (ocd === false ? true : this.level % step !== 0))
        {
            n--;
        }
    }

    buy10(round)
    {
        this.buyN(10, true, round);
    }

    buy100(round)
    {
        this.buyN(100, true, round);
    }

    currentPrice()
    {
        return this.getPrice(this.level);
    }

    getMaxLevel()
    {
        if(typeof this.maxLevel == "function")
        {
            return this.maxLevel();
        }
        return this.maxLevel;
    }

    getPriceDisplay(suffix, prefix)
    {
        let s = suffix !== undefined ? suffix : "";
        let p = prefix !== undefined ? prefix : "$";
        if(this.level < this.getMaxLevel())
        {
            return p + (p.length || p.length > 0 ? " " : "") + functions.formatNumber(this.currentPrice(), 2, 1e12, 0) + " " + s;
        }
        else
        {
            return "Max";
        }
    }

    getEffectDisplay()
    {
        if(this.level === this.getMaxLevel())
        {
            return "x" + this.getEffect(this.level);
        }
        return "x" + this.getEffect(this.level) + " → " + "x" + this.getEffect(this.level + 1);
    }

    getLevelDisplay()
    {
        return this.level + (this.getMaxLevel() < Infinity ? "/" + this.getMaxLevel() : "");
    }
}

class GemUpgrade extends Upgrade
{
    constructor(name, desc, getPrice, getEffect, cfg)
    {
        super(name, desc, getPrice, getEffect, cfg);
        this.resource = RESOURCE_GEM;
    }

    getPriceDisplay(suffix, prefix)
    {
        return super.getPriceDisplay("Gems", "")
    }
}

class PCUpgrade extends Upgrade
{
    constructor(name, desc, getPrice, getEffect, cfg)
    {
        super(name, desc, getPrice, getEffect, cfg);
        this.resource = RESOURCE_PC;
    }

    getPriceDisplay(suffix, prefix)
    {
        return super.getPriceDisplay("Planet Coins", "")
    }
}

class WisdomUpgrade extends Upgrade
{
    constructor(name, desc, getPrice, getEffect, cfg)
    {
        super(name, desc, getPrice, getEffect, cfg);
        this.resource = RESOURCE_WISDOM;
        this.icon = "Images/wisdom.png";
    }

    getPriceDisplay(suffix, prefix)
    {
        return super.getPriceDisplay("", "")
    }
}


var effectDisplayTemplates = 
{
    numberStandard: function(digits, prefix, suffix, below1000, limit)
    {
        let p = prefix !== undefined ? prefix : "x";
        let s = suffix !== undefined ? suffix : "";
        limit = limit !== undefined ? limit : 1e9;
        return function()
        {
            if(this.level === this.getMaxLevel())
            {
                return p + functions.formatNumber(this.getEffect(this.level), digits, limit, below1000) + s;
            }

            return p + functions.formatNumber(this.getEffect(this.level), digits, limit, below1000) + s + " → " +
            p + functions.formatNumber(this.getEffect(this.level + 1), digits, limit, below1000) + s;
        }
    },
    thousandsStandard: function(prefix, suffix)
    {
        let p = prefix !== undefined ? prefix : "x";
        let s = suffix !== undefined ? suffix : "";
        return function()
        {
            if(this.level === this.getMaxLevel())
            {
                return p + functions.formatThousands(this.getEffect(this.level)) + s;
            }

            return p + functions.formatThousands(this.getEffect(this.level)) + s + " → " +
                p + functions.formatThousands(this.getEffect(this.level + 1)) + s;
        }
    },
    percentStandard: function(digits, prefix, limit, below1000)
    {
        let p = prefix !== undefined ? prefix : "";
        limit = limit !== undefined ? limit : 1e9;
        below1000 = below1000 !== undefined ? below1000 : digits;
        return function()
        {
            let eVal = functions.formatNumber(this.getEffect(this.level).mul(100), digits, limit, below1000) + "%";
            let eValNxt = functions.formatNumber(this.getEffect(this.level + 1).mul(100), digits, limit, below1000) + "%";
            if(this.level === this.getMaxLevel())
            {
                return p + eVal;
            }

            return p + eVal + " → " + p + eValNxt;
        }
    }
};