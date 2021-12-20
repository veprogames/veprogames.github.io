class Building
{
  constructor(name, basePrice, cps, index, config)
  {
    this.name = name;
    this.basePrice = basePrice;
    this.price = this.basePrice;
    this.level = 0;
    this.baseCps = cps;
    this.cps = this.calculateCps();
    this.highestCps = this.cps;
    this.index = index;

    if(config)
    {
      this.priceIncrease = config.priceIncrease ? config.priceIncrease : 1.1;
      this.upgradeBehavior = config.upgradeBehavior ? config.upgradeBehavior : function () { };
      this.getAdditionalCps = config.getAdditionalCps ? config.getAdditionalCps : function () { return 0; };
    }
    else
    {
      this.priceIncrease = 1.1;
      this.upgradeBehavior = function () { };
      this.getAdditionalCps = function () { return 0; };
    }
  }

  buy()
  {
    if(this.price <= game.cookies)
    {
      game.cookies -= this.price;
      this.level++;
      this.price = this.calculatePrice();
      this.cps = this.calculateCps();
      this.checkUpgrade();
    }
  }

  buyMax()
  {
    while(this.price <= game.cookies)
    {
      game.cookies -= this.price;
      this.level++;
      this.price = this.calculatePrice();
      this.checkUpgrade();
    }

    this.cps = this.calculateCps();
  }

  calculatePrice()
  {
    let prestigeDiscount = 1;

    if(game !== undefined)
    {
        prestigeDiscount = game.prestigeUpgrades.priceDecrease.apply();
    }

    let levelDilation = Math.pow(Math.max(0, this.level - 1500) * 0.1, 1.5);
    return this.basePrice * Math.pow(this.priceIncrease, this.level + levelDilation) * prestigeDiscount;
  }

  calculateUpgradeMultiplier()
  {
    let multi = 1;
    for(let u of game.upgrades)
    {
      if(u.buildingIndex === this.index && u.bought)
      {
        multi *= u.effect;
      }
    }
    return multi;
  }

  calculateCps(level)
  {
    let lvl = level === undefined ? this.level : level;

    let labMulti = 1, upgMulti = 1, prestigeMulti = 1, additionalCps = 1, mathMachineBoost = 1;
    let expBoost = 1.01;
    if(game !== undefined)
    {
      labMulti = game.labUpgrades.generatorSynergy.apply() * game.labUpgrades.timeBonus.apply() *
                  game.labUpgrades.clickBonus.apply() * game.labUpgrades.upgradeSynergy.apply() * game.labUpgrades.prestigeBoost.apply();
      upgMulti = this.calculateUpgradeMultiplier();
      prestigeMulti = game.prestigeUpgrades.generatorBoost.apply() * game.prestigeUpgrades.labSynergy.apply() *
                      game.prestigeUpgrades.idleGeneratorBoost.apply() * game.prestigeUpgrades.activeGeneratorBoost.apply();
      additionalCps = this.getAdditionalCps();
      expBoost = game.prestigeUpgrades.exponentialBoost.apply();
      mathMachineBoost = gameComputed.mathMachine.equationBonus();
    }

    if(this.highestCps < this.cps)
    {
      this.highestCps = this.cps;
    }

    return this.baseCps * lvl * Math.pow(expBoost, Math.max(0, lvl - 10)) * upgMulti * labMulti * prestigeMulti * mathMachineBoost + additionalCps;
  }

  checkUpgrade()
  {
    let levelFreq = 25;
    let effect = 3;

    for(let l = 0; l < 3; l++)
    {
      if(this.level >= [200, 500, 2500][l])
      {
        levelFreq = [50, 100, 500][l];
        effect *= 1.5;
      }
    }

    if(this.level % levelFreq === 0)
    {
      game.upgrades.push(new Upgrade(this.name + " Amplifier v" + Math.pow(this.level, 0.4).toFixed(1), 
                this.index, 
                this.price * Math.min(100, Math.sqrt(this.level * 0.5)) * game.prestigeUpgrades.upgradePriceDecrease.apply(), 
                effect));
    }

    this.upgradeBehavior();

    sortUpgrades();
  }
}
