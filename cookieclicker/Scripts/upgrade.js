class Upgrade
{
  constructor(name, buildingIndex, price, effect)
  {
    this.name = name;
    this.price = price;
    this.buildingIndex = buildingIndex;
    this.effect = effect;
    this.bought = false;
  }

  buy()
  {
    if(game.cookies >= this.price && !this.bought)
    {
      this.bought = true;
      game.buildings[this.buildingIndex].upgradeMultiplier *= this.effect;
      game.buildings[this.buildingIndex].cps = game.buildings[this.buildingIndex].calculateCps();
      game.cookies -= this.price;
    }
  }
}
