const UPGRADE_RHO = 0, UPGRADE_SHRINKPOWER = 1, RHO_BOOST_RESOURCE = 2, SHRINK_BOOST_RESOURCE = 3;

class RhoUpgrade
{
    constructor(name, desc, getPrice, getEffect, cfg)
    {
        this.name = name;
        this.desc = desc;
        this.getPrice = getPrice;
        this.getEffect = getEffect;
        this.level = 0;
        this.maxLevel = cfg && cfg.maxLevel !== undefined ? cfg.maxLevel : Infinity;
        this.getEffectDisplay = cfg && cfg.getEffectDisplay ? cfg.getEffectDisplay : this.getEffectDisplay;
    }

    currentPrice()
    {
        return this.getPrice(this.level);
    }

    apply()
    {
        return this.getEffect(this.level);
    }

    getPriceDisplay()
    {
        if(this.level === this.maxLevel)
        {
            return "Max";
        }
        return functions.formatNumber(this.currentPrice(), 2, 0, 1e6) + " &rho;<sub>p</sub>";
    }

    getEffectDisplay()
    {
        if(this.level === this.maxLevel)
        {
            return "x" + functions.formatNumber(this.apply(), 2, 2);
        }
        return "x" + functions.formatNumber(this.apply(), 2, 2) + " → "
            + "x" + functions.formatNumber(this.getEffect(this.level + 1), 2, 2);
    }

    buy()
    {
        if(game.rhoParticles.gte(this.currentPrice()) && this.level < this.maxLevel)
        {
            game.rhoParticles = game.rhoParticles.sub(this.currentPrice());
            this.level++;
            return true;
        }
        return false;
    }

    buyMax()
    {
        while(this.buy());
    }
}

class UniverseUpgrade extends RhoUpgrade
{
    constructor(name, desc, getPrice, getEffect, resource, type, cfg)
    {
        super(name, desc, getPrice, getEffect, cfg);
        this.type = type;
        this.resource = resource;
    }

    getPriceDisplay()
    {
        if(this.level === this.maxLevel)
        {
            return "Max";
        }
        let quantifier = this.currentPrice().eq(1) ? "" : "s";
        return functions.formatNumber(this.currentPrice(), 2, 0, 1e6) + " " + this.resource.name + quantifier;
    }

    buy()
    {
        if(this.resource.amount.gte(this.currentPrice()) && this.level < this.maxLevel)
        {
            this.resource.amount = this.resource.amount.sub(this.currentPrice());
            this.level++;
            return true;
        }
        return false;
    }
}

var effectDisplayTemplates = {
    numberStandard: function(digits, prefix = "x", suffix = "")
    {
        return function()
        {
            if(this.level === this.maxLevel)
            {
                return prefix + functions.formatNumber(this.apply(), digits, digits) + suffix;
            }
            return prefix + functions.formatNumber(this.apply(), digits, digits) + suffix + " → "
                + prefix + functions.formatNumber(this.getEffect(this.level + 1), digits, digits) + suffix;
        };
    }
};