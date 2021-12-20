function getPrestigePointsOnReset(cookies)
{
  let multi = game.prestigeUpgrades.activePrestigeBoost.apply() * game.prestigeUpgrades.idlePrestigeBoost.apply();
  return cookies >= 1e33 ? Math.floor(Math.pow(1.1 + game.prestigeUpgrades.betterPrestigeFormula.apply().exp, Math.log10(cookies) - 33) * game.prestigeUpgrades.betterPrestigeFormula.apply().multi) * multi : 0;
}

function prestige()
{
  game.prestigePoints += getPrestigePointsOnReset(game.cookies);

  game.cookies = 0;
  game.clicksThisPrestige = 0;
  for(let b of game.buildings)
  {
    b.level = 0;
    b.price = b.calculatePrice();
    refreshBuildingStats();
    b.highestCps = 0;
  }

  game.upgrades = [];

  for(key of Object.keys(game.labUpgrades))
  {
    game.labUpgrades[key].level = 0;
    game.labUpgrades[key].price = game.labUpgrades[key].prices[game.labUpgrades[key].level];
  }

  game.getAutomatorPrices = 
  {
    cookies: 1e76,
    prestigePoints: 1e9
  }

  game.prestigeCount++;
}

class PrestigeUpgrade
{
  constructor(name, description, requirements, blacklist, prices, effectCallback, displayCallback, requirementAny)
  {
    this.name = name;
    this.description = description;
    this.requirements = requirements;
    this.blacklist = blacklist; //what must not be bought (always level 0)
    this.level = 0;
    this.prices = prices;
    this.getEffect = effectCallback;
    if (displayCallback !== undefined)
    {
      this.getDisplay = displayCallback;
    }
    this.requirementAny = requirementAny ? requirementAny : false;
  }

  requirementsFullfilled()
  {
    for (let b of this.blacklist)
    {
      if (game.prestigeUpgrades[b].level > 0)
      {
        return false;
      }
    }

    if (!this.requirementAny)
    {
      for (let re of this.requirements)
      {
        if (!game.prestigeUpgrades[re[0]].level >= re[1])
        {
          return false;
        }
      }
    }
    else
    {
      for (let re of this.requirements)
      {
        if (game.prestigeUpgrades[re[0]].level >= re[1])
        {
          return true;
        }
      }
      return false;
    }
    

    return true;
  }

  apply()
  {
    return this.getEffect(this.level);
  }

  getPrice()
  {
    return this.level <= this.prices.length ? this.prices[this.level] : 0;
  }

  getDisplay(level)
  {
    return "x" + NumberFormatter.format(this.getEffect(level), game.settings.numberFormatType, true);
  }

  buy()
  {
    if (this.level < this.prices.length && this.getPrice() <= game.prestigePoints && this.requirementsFullfilled())
    {
      game.prestigePoints -= this.getPrice();
      this.level++;
    }
  }

  levelDown()
  {
    if (this.level > 0)
    {
      this.level--;
      game.prestigePoints += this.getPrice();
    }
  }

  respec()
  {
    while (this.level > 0)
    {
      this.levelDown();
    }
  }
}
