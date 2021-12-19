class Milestone
{
  constructor(cookies, text)
  {
    this.cookiesNeeded = cookies;
    this.text = text;
    this.unlocked = false;
  }

  tryUnlock()
  {
    if (!this.unlocked && game.cookiesTotal >= this.cookiesNeeded)
    {
      this.unlocked = true;
    }
  }
}