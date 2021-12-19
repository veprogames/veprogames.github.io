class LabUpgrade
{
  constructor(name, description, prices, effectCallback)
  {
    this.name = name;
    this.description = description;
    this.prices = prices;
    this.level = 0;
    this.getEffect = effectCallback;
  }

  apply()
  {
      return this.getEffect(this.level);
  }

  getPrice()
  {
    return this.prices[this.level];
  }

  buy()
  {
    if(this.level < this.prices.length && this.prices[this.level] < game.cookies)
    {
      game.cookies -= this.prices[this.level];
      this.level++;
    }
  }
}
