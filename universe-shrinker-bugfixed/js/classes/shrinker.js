//shrinkers shink a Universe and generate rho-particles

class Shrinker
{
    constructor(name, initPrice, priceIncrease, prod, strength)
    {
        this.name = name;
        this.initPrice = initPrice;
        this.priceIncrease = priceIncrease;
        this.prod = prod;
        this.strength = strength; //div size per second
        this.level = 0;
    }

    getShrinkPower()
    {
        let base = this.strength.pow(this.level)
            .pow(game.rhoUpgrades.shrinkBoost.apply())
            .pow(game.rhoUpgrades.synergyShrink.apply());
        let power = base;
        for(let k in game.universeLayers)
        {
            if(game.universeLayers.hasOwnProperty(k))
            {
                for(let upg of game.universeLayers[k].upgrades.filter(upg => upg.type === UPGRADE_SHRINKPOWER || upg.type === SHRINK_BOOST_RESOURCE))
                {
                    power = power.pow(upg.apply());
                }
            }
        }
        return power.pow(new Decimal(1).div(game.universe.resistance));
    }

    getProductionPS()
    {
        let multi = new Decimal(1);
        for(let k in game.universeLayers)
        {
            if(game.universeLayers.hasOwnProperty(k))
            {
                for(let upg of game.universeLayers[k].upgrades.filter(upg => upg.type === UPGRADE_RHO || upg.type === RHO_BOOST_RESOURCE))
                {
                    multi = multi.mul(upg.apply());
                }
            }
        }
        return this.prod.mul(Decimal.pow(this.priceIncrease.sqrt(), this.level)).mul(this.level)
            .mul(game.rhoUpgrades.rhoBoost.apply())
            .mul(game.rhoUpgrades.synergyRho.apply())
            .mul(game.rhoUpgrades.shrinkingExpertise.apply())
            .mul(multi);
    }

    getPrice()
    {
        let price = this.initPrice.mul(Decimal.pow(this.priceIncrease, this.level));
        let dilation = price.gte(Decimal.pow(2, 1024)) ? Decimal.log(price.div(Decimal.pow(2, 1024)), 1e100) : 1;
        return price.pow(dilation);
    }

    buy()
    {
        if(this.getPrice().lt(game.rhoParticles))
        {
            game.rhoParticles = game.rhoParticles.sub(this.getPrice());
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