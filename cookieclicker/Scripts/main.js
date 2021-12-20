var dTime =
{
  old: Date.now(),
  new: Date.now()
};

var time =
{
  lastSave: Date.now()
};

function deltaTime()
{
  return Math.max(1, dTime.new - dTime.old) / 1000;
}

function formatTime(s)
{
  return [Math.floor(s / 3600) + " Hours", Math.floor(s / 60) % 60 + " Minutes", Math.floor(s) % 60 + " Seconds"].join(", ");
}

function formatTimePrecise(s)
{
  let times = [];
  if(s >= 60)
  {
    times.push(Math.floor(s / 60) + "m");
  }
  if(s >= 1)
  {
    times.push(Math.floor(s) % 60 + "s");
  }
  if(s > 0.001 && s < 10 && s % 1 !== 0)
  {
    times.push(Math.floor(s * 1000) % 1000 + "ms");
  }
  return times.join(" ");
}

var game =
{
  firstPlayed: Date.now(),
  timeStamp: Date.now(),
  settings:
  {
    currentStyle: "style.css",
    styles: [
      {
        name: "style.css",
        title: "Standard",
        desc: "The Normal Cookie Clicker Style"
      },
      {
        name: "style_min.css",
        title: "Minimal",
        desc: "Use This if the game runs slow"
      }
    ],
    currentTab: "Generators",
    tabs:
    [
        ["Generators", 0],
        ["Upgrades", 1000],
        ["Lab", 1e12],
        ["Prestige", 1e24],
        ["Math Machine", 1e63],
        ["Automation", 1e78],
        ["Statistics", 0],
        ["Milestones", 0],
        ["Options", 0]
    ],
    showBoughtUpgrades: true,
    currentExportCode: "",
    numberFormatType: 0,
    numberFormatTypes: ["Standard", "Scientific", "Engineering", "Letters", "Base-2"]
  },
  cookies: 0,
  cookiesTotal: 0,
  cps: 1,
  cpc: 1,
  clicks: 0,
  clicksThisPrestige: 0,
  lastClickTime: Date.now(),
  idleTime: 0,
  buildings:
  [
    new Building("Useless Generator", 10, 1, 0),
    new Building("Small Generator", 100, 9, 1),
    new Building("Ordinary Generator", 1000, 80, 2),
    new Building("Good Generator", 10000, 700, 3),
    new Building("Advanced Generator", 1e5, 6000, 4),
    new Building("Modern Generator", 1e6, 5e4, 5),
    new Building("Superb Generator", 1e7, 4e5, 6),
    new Building("Ultra Generator", 1e8, 3e6, 7),
    new Building("Unreal Generator", 1e10, 1e8, 8),
    new Building("Black Hole", 1e15, 1e10, 9,
                {
                  priceIncrease: 1.75,
                  upgradeBehavior: function()
                  {
                    if(this.level < 5)
                    {
                      let index = game.buildings.length - 1 - this.level;
                      let b = index;
                      game.upgrades.push(new Upgrade(game.buildings[b].name + " Improvement", b, this.price * 1.41 * game.prestigeUpgrades.upgradePriceDecrease.apply(), 5));
                    }

                    if(this.level % 5 === 0)
                    {
                      let index = Math.floor((this.level - 1) / 5) % game.buildings.length;
                      let b = index;
                      game.upgrades.push(new Upgrade(game.buildings[b].name + " Boost", b, this.price * 99 * game.prestigeUpgrades.upgradePriceDecrease.apply(), 100 / Math.pow(1.2, index)));
                    }

                    if(this.level >= 64 && this.level <= 65 + 8 * 15 && (this.level - 65) % 15 === 0)
                    {
                      let index = Math.floor((this.level - 65) / 15);
                      game.upgrades.push(new Upgrade("Actually Useful?" + "!?".repeat(index), index, this.price * Math.pow(1 + index, 2) * game.prestigeUpgrades.upgradePriceDecrease.apply(), 123456));
                    }
                  },
                  getAdditionalCps: function ()
                  {
                    return game.prestigeUpgrades.blackHolePower.apply();
                  }
                })
  ],
  upgrades: [],
  labUpgrades:
  {
    generatorSynergy: new LabUpgrade("Generator Synergy", "All Generators get a Boost based on total Generator levels", [5e12, 2e17, 50e18, 5e24, 1e60, 5e72],
                                    function(level)
                                    {
                                      let buildingLvls = 0;
                                      for(let b of game.buildings)
                                      {
                                        buildingLvls += b.level;
                                      }

                                      return level > 0 ? Math.pow(Math.pow(1 + 0.005 * buildingLvls, 0.75 + 0.25 * (level - 1)), game.prestigeUpgrades.labPower.apply()) : 1;
                                    }),
    timeBonus:        new LabUpgrade("Time Bonus", "All Generators get a Boost based on Time Played", [2e15, 1e17, 3e21, 50e27],
                                    function(level)
                                    {
                                      let time = Date.now() - game.firstPlayed;

                                      return level > 0 ? Math.pow(Math.pow(1 + time / 1e6, 0.5 + 0.1 * level), game.prestigeUpgrades.labPower.apply()) : 1;
                                    }),
    clickBonus:       new LabUpgrade("Click Bonus", "All Generators get a Boost based on Total Clicks", [1e18, 1e24, 1.777e54],
                                    function(level)
                                    {
                                      let time = Date.now() - game.firstPlayed;

                                      return level > 0 ? Math.pow(Math.pow(1 + game.clicks / 1000, 0.5 + 0.25 * level), game.prestigeUpgrades.labPower.apply()) : 1;
                                    }),
    upgradeSynergy:   new LabUpgrade("Upgrade Synergy", "All Generators get a Boost based on Unlocked Upgrades", [10e21, 1e30],
                                    function(level)
                                    {
                                      return level > 0 ? Math.pow(Math.pow(1 + game.upgrades.length * 0.1, 1 + 0.4 * (level - 1)), game.prestigeUpgrades.labPower.apply()) : 1;
                                    }),
    prestigeBoost: new LabUpgrade("Prestige Boost", "All Generators get a Boost based on Prestige Points", [100e39],
                                    function (level)
                                    {
                                      return level > 0 ? Math.pow(1 + Math.pow(Math.log10(game.prestigePoints + 1) * level, 3) + Math.min(10, 0.15 * Math.pow(game.prestigePoints, 1.25)), game.prestigeUpgrades.labPower.apply()) : 1;
                                    })
  },
  prestigePoints: 0,
  prestigeCount: 0,
  lastPrestigeTime: Date.now(),
  timeInPrestige: 0,
  prestigeUpgrades:
  {
    generatorBoost:   new PrestigeUpgrade("Generator Boost", "All Generators get a production boost", [], [], [1, 10, 4000, 75e3, 15e6, 1e9],
                      function(level)
                      {
                        return level > 0 ? Math.pow(game.prestigeUpgrades.generatorBoostBoost.apply(), level) : 1;
                      }),
    labSynergy:       new PrestigeUpgrade("Lab Synergy", "All Generators get a boost Based on Lab Upgrades bought", [["generatorBoost", 1]], [], [3, 12, 125e3],
                      function (level)
                      {
                        let labUpgs = 0;

                        for (let key of Object.keys(game.labUpgrades))
                        {
                          labUpgs += game.labUpgrades[key].level;
                        }

                        return level > 0 ? 1 + 0.5 * labUpgs * Math.max(1, Math.pow(labUpgs / 5 + 1, (level - 1) * 0.5)) : 1;
                      }),
    clickBonusFlat: new PrestigeUpgrade("Click Bonus", "Click gets a flat Boost based on times Prestiged", [["generatorBoost", 1]], [], [5, 5e3, 5e6, 5e9],
                      function (level)
                      {
                        return level > 0 ? Math.floor(Math.pow(game.prestigeCount * 0.3 * level + 1, 5)) + Math.pow(10, level) : 0;
                      },
                      function(level)
                      {
                        return "+" + NumberFormatter.format(this.getEffect(level), game.settings.numberFormatType, true);
                      }),
    betterPrestigeFormula: new PrestigeUpgrade("Reinforced Prestige", "The Prestige Point Formula is better", [["labSynergy", 1], ["clickBonusFlat", 1]], [], [8, 200e3],
                    function (level)
                    {
                      return { exp: [0, 0.2, 0.3][level], multi: [1, 1.5, 2][level]};
                    },
                    function (level)
                    {
                      return "";
                    }),
    blackHolePower: new PrestigeUpgrade("Black Hole Power", "The Black Hole also takes all previous buildings into account when it produces Cookies.", [["betterPrestigeFormula", 1]], [], [20],
                    function (level)
                    {
                      let cps = 0;
                      for (let b = 0; b < game.buildings.length - 1; b++)
                      {
                        cps += game.buildings[b].calculateCps();
                      }
                      cps *= Math.min(1, Math.pow(game.buildings[game.buildings.length - 1].level, 1.5) / 1000);

                      return level === 1 ? cps : 0;
                    },
                    function (level)
                    {
                      return "+" + NumberFormatter.format(this.getEffect(level), game.settings.numberFormatType, true);
                    }),
    idleGeneratorBoost: new PrestigeUpgrade("Idle Boost", "The longer you don't click the cookie button, the higher the Generator output is.", [["blackHolePower", 1]], ["activeGeneratorBoost"], [50, 2e9],
                    function (level)
                    {
                      return level > 0 ? Math.min(10 * Math.pow(5, level - 1), Math.pow(4, level - 1) * Math.pow(1 + game.idleTime / 50 * level, 1.25)) : 1;
                    }),
    activeGeneratorBoost: new PrestigeUpgrade("Active Boost", "Clicking gives an instant Generator boost that decays over time.", [["blackHolePower", 1]], ["idleGeneratorBoost"], [50, 2e9],
                    function (level)
                    {
                      return level > 0 ? Math.max(2 * level, 15 * Math.pow(4, level - 1) / (game.idleTime / 50 / level + 1)) : 1;
                    }),
    activePrestigeBoost: new PrestigeUpgrade("Prestige Boost", "You get more Prestige Points", [["activeGeneratorBoost", 1]], [], [150, 20e6],
                    function (level)
                    {
                      return level > 0 ? Math.pow(2, level) : 1;
                    }),
    idlePrestigeBoost: new PrestigeUpgrade("Prestige Boost", "You get more Prestige Points based on Time spent this run", [["idleGeneratorBoost", 1]], [], [150, 20e6],
                    function (level)
                    {
                      return level > 0 ? Math.pow(2, level) * Math.min(2, 0.5 + game.timeInPrestige / 5000) : 1;
                    }),
    exponentialBoost: new PrestigeUpgrade("Generator Madness", "The Generator's exponential boost per level up will be increased.", [["activePrestigeBoost", 1], ["idlePrestigeBoost", 1]], [], [1500, 10e6],
                    function (level)
                    {
                      return [1.01, 1.015, 1.018][level];
                    },
                    function (level)
                    {
                      return "x" + this.getEffect(level).toFixed(3) + " per level";
                    }, true),
    priceDecrease: new PrestigeUpgrade("Ultra Discount", "All Generators are cheaper based on clicks this Prestige", [["exponentialBoost", 1]], [], [60e3, 250e6],
                    function(level)
                    {
                      return level > 0 ? 1 / Math.pow(game.clicksThisPrestige + 1, 1 + 0.5 * (level - 1)) : 1;
                    }),
    generatorBoostBoost: new PrestigeUpgrade("Generator Boost Boost", "Generator Boost Prestige Upgrade is stronger!", [["priceDecrease", 1]], [], [1e6, 50e6, 7e9],
                    function(level)
                    {
                      return [5, 10, 20, 35][level];
                    },
                    function(level)
                    {
                      return "x" + this.getEffect(level).toFixed(0) + " per Level";
                    }),
    equationBoost: new PrestigeUpgrade("Equation Boost", "Equation Boost is stronger", [["priceDecrease", 1]], [], [2.5e6, 4e9],
                    function(level)
                    {
                      return [0.01, 0.05, 0.2][level];
                    },
                    function(level)
                    {
                      return "+ x" + this.getEffect(level).toFixed(2) + " per Problem solved";
                    }),
    upgradePriceDecrease: new PrestigeUpgrade("Upgrade Discount", "All Upgrades are cheaper.", [["priceDecrease", 1]], [], [2.5e6],
                    function(level)
                    {
                      return 1 / [1, 5][level];
                    }), 
    labPower: new PrestigeUpgrade("Lab Power", "All Lab effects are stronger", [["upgradePriceDecrease", 1]], [], [100e6],
                    function(level)
                    {
                      return 1 + 0.2 * level;
                    },   
                    function(level)
                    {
                      return "x^" + this.getEffect(level).toFixed(1);
                    }) 
  },
  milestones: 
  [
      new Milestone(1, "Your first cookie! And it's really tasty."),
      new Milestone(1000, "You already got the hang of this."),
      new Milestone(1e6, "1 Million. That sure is a lot."),
      new Milestone(7.7e9, "One for each person"),
      new Milestone(1e12, "1 Trillion! You're rich! Time to do some research..."),
      new Milestone(1e20, "Well... Time to buy the moon?"),
      new Milestone(1e28, "I feel something coming..."),
      new Milestone(1e33, "Now I feel the Power! Let's do this!"),
      new Milestone(1e45, "Aren't we running out of Space?"),
      new Milestone(1e65, "I feel some kind of overflow..."),
      new Milestone(1e78, "Im getting tired... let's automate this Game!")
  ],
  mathMachine:
  {
    currentEquation: "",
    currentInput: "",
    lastReward: 0,
    equationsSolved: 0
  },
  automatons: 0,
  pointsForAutoPrestige: 1,
  automators: 
  {
    autoClick: new Automator("Auto Clicker", "Click the Cookie Automatically", 2, 1, 
    function()
    {
      gameFunctions.clickCookie();
    }),
    autoBuyBuildings: new Automator("Auto Max Buy", "Buy as much Buildings as you can afford", 30, 2, 
    function()
    {
      gameFunctions.maxAllBuildings();
    }),
    autoBuyUpgrades: new Automator("Auto Buy Upgrades", "Buy all affordable Upgrades", 50, 3, 
    function()
    {
      gameFunctions.buyAllUpgrades();
    }),
    autoBuyLab: new Automator("Auto Buy Lab Upgrades", "Buy all affordable Lab Upgrades", 90, 5, 
    function()
    {
      gameFunctions.buyAllLabUpgrades();
    }),
    autoPrestige: new Automator("Auto Prestige", "Prestige automatically", 240, 7, 
    function()
    {
      if(getPrestigePointsOnReset(game.cookies) > game.pointsForAutoPrestige)
      {
        prestige();
      }
    })
  },
  getAutomatorPrices:
  {
    cookies: 1e76,
    prestigePoints: 1e9
  }
};

function addCookies(cookies)
{
  game.cookies += cookies;
  game.cookiesTotal += cookies;
}

function sortUpgrades()
{
  game.upgrades.sort(function(a, b)
  {
    if(a.price < b.price)
    {
      return -1;
    }
    if(a.price > b.price)
    {
      return 1;
    }
    return 0;
  });
}

function refreshBuildingStats()
{
  for(let b of game.buildings)
  {
    b.price = b.calculatePrice();
    b.cps = b.calculateCps();
  }
}

var gameFunctions =
{
  setGameStyle: function(name)
  {
    document.querySelector("#gameStyle").href = name;
    game.settings.currentStyle = name;
  },
  clickCookie: function()
  {
    addCookies(game.cpc);
    game.clicks++;
    game.clicksThisPrestige++;
    game.lastClickTime = Date.now();
  },
  getTotalCps: function()
  {
    let sum = 0;
    for(building of game.buildings)
    {
      sum += building.cps;
    }
    return sum;
  },
  getIdleTime: function()
  {
    return (Date.now() - game.lastClickTime) / 1000;
  },
  buyAllUpgrades: function()
  {
    for(let upgrade of game.upgrades)
    {
      upgrade.buy();
    }
  },
  maxAllBuildings: function()
  {
    let lowestPrice = Infinity;

    do
    {
      let lowestBuilding; //b with lowest price
      for (let b of game.buildings)
      {
        if (lowestBuilding === undefined || b.price < lowestBuilding.price)
        {
          lowestBuilding = b;
          lowestPrice = lowestBuilding.price;
        }
      }
      lowestBuilding.buy();
    }
    while (game.cookies > lowestPrice);
    
  },
  findCheapestLabUpgrade: function()
  {
    let upg;
    for(l of Object.keys(game.labUpgrades))
    {
      if(game.labUpgrades[l].level < game.labUpgrades[l].prices.length)
      {
        if(upg === undefined)
        {
          upg = game.labUpgrades[l];
        }
        if(upg !== undefined && game.labUpgrades[l].getPrice() < upg.getPrice())
        {
          upg = game.labUpgrades[l];
        }
      }
    }
    return upg;
  },
  buyAllLabUpgrades: function()
  {
    let upgrade = gameFunctions.findCheapestLabUpgrade();
    while(upgrade !== undefined && game.cookies > upgrade.getPrice())
    {
      upgrade.buy();
      upgrade = gameFunctions.findCheapestLabUpgrade();
    }
  },
  prestigeGame: function ()
  {
    prestige();
    game.lastPrestigeTime = Date.now();
  },
  respecPrestigeUpgrades: function ()
  {
    for (key of Object.keys(game.prestigeUpgrades))
    {
      game.prestigeUpgrades[key].respec();
    }
  },
  mathMachine:
  {
    generateEquation: function()
    {
      let num1 = Math.round(Math.random() * 10).toString();
      let num2 = Math.round(Math.random() * 10).toString();
      let operator = Utils.choose("+", "-", "*");

      return num1 + " " + operator + " " + num2;
    },
    solveEquation: function()
    {
      if(eval(game.mathMachine.currentEquation) === Number.parseInt(game.mathMachine.currentInput))
      {
        game.mathMachine.currentEquation = this.generateEquation();
        game.mathMachine.currentInput = "";
        let reward = game.cps * (1 + Math.random() * 1);
        addCookies(reward);
        game.mathMachine.lastReward = reward;
        game.mathMachine.equationsSolved++;
      }
    }
  },
  buyAutomaton(type)
  {
    switch(type)
    {
      case "cookies":
        if(game.cookies >= game.getAutomatorPrices.cookies)
        {
          game.automatons++;
          game.cookies -= game.getAutomatorPrices.cookies;
          game.getAutomatorPrices.cookies *= 1000;
        }
        break;
      case "prestigePoints":
        if(game.prestigePoints >= game.getAutomatorPrices.prestigePoints)
        {
          game.automatons++;
          game.prestigePoints -= game.getAutomatorPrices.prestigePoints;
          game.getAutomatorPrices.prestigePoints *= 5;
        }
      default:
        break;
    }
  },
  respecAutomators: function()
  {
    for(k of Object.keys(game.automators))
    {
      game.automators[k].respec();
    }
  },
  exportGame: function()
  {
    let code = getSaveCode();
    game.settings.currentExportCode = code;
  },
  importGame: function()
  {
    let code = prompt("Import your code", "<code>");
    loadGame(code);
  },
  hardResetGame: function ()
  {
    if (prompt("Are you sure that you want to lose all progress that you made? This does not give a Bonus! Type 'WIPE GAME' to confirm.") === "WIPE GAME")
    {
      localStorage.removeItem("Ccookieclicker_game");
      window.open(window.location.href, "_blank");
    }
    
  }
};

game.mathMachine.currentEquation = gameFunctions.mathMachine.generateEquation();

var gameComputed = 
{
  mathMachine:
  {
    equationBonus: function()
    {
      return 1 + game.prestigeUpgrades.equationBoost.apply() * game.mathMachine.equationsSolved;
    }
  }
}

Vue.component("cookie-display",
{
  template: "<div><span>You have <span class='bignumber'>{{formatNumber(cookies)}}</span> Cookies<br/>"+
            "You get {{formatNumber(cps)}} Cookies each Second<br/>"+
            "You get {{formatNumber(cpc)}} Cookies per Click</span></div>",
  props: ["cookies", "cps", "cpc"]
});

Vue.component("prestigeupgrade",
{
  template: "<button v-on:click='upgrade.buy()' class='prestigeupgrade' v-bind:disabled='!upgrade.requirementsFullfilled() || upgrade.getPrice() > game.prestigePoints'>" +
        "<span class='bigtext'>{{upgrade.name}}</span><br/>" +
        "<span>{{upgrade.description}}<br/></span>" +
        "<span v-if='upgrade.level < upgrade.prices.length'>{{displayEffect}} {{displayArrow}} {{displayEffectNext}}</span>" +
        "<span v-else>{{displayEffect}}</span><br/>" +
        "<span v-if='upgrade.level < upgrade.prices.length' class='bigtext'>{{NumberFormatter.format(upgrade.getPrice(), game.settings.numberFormatType)}}</span>" +
        "<span v-else class='bigtext'><img class='inlineimage' src='Images/tick.png'/></span>" +
        "</button>",
  props: ["upgrade"],
  computed:
  {
      displayArrow: function ()
      {
        return this.upgrade.getDisplay(this.upgrade.level) !== '' ? '=>' : '';
      },
      displayEffect: function ()
      {
        return this.upgrade.getDisplay(this.upgrade.level);
      },
      displayEffectNext: function ()
      {
        return this.upgrade.getDisplay(this.upgrade.level + 1);
      }
  }
});

Vue.component("automator",
{
  template: "<div><button class='automatorbutton' v-on:click='automator.buy()'>" +
            "<span style='font-size: 1.6em;'>{{automator.name}}</span><br/>" +
            "<span style='font-size: 1em;'>{{automator.desc}}</span><br/>" +
            "<span v-if='automator.level > 0' class='autumn' style='font-size: 1.5em; font-weight: lighter;'>{{thisLevelSpeed}} => {{nextLevelSpeed}}<br/></span>" +
            "<span v-else class='autumn' style='font-size: 1.5em; font-weight: lighter;'>Inactive => {{nextLevelSpeed}}<br/></span>" +
            "<span class='autumn' style='font-size: 1.5em;'>&#x1f551; {{automator.price}}</span>" +
            "</button><br/>" +
            "<button class='automatortoggle' v-bind:class='{on: automator.active, off: !automator.active}' v-on:click='automator.active = !automator.active'>{{automator.active ? 'ON' : 'OFF'}}</button>" +
            "</div>",
  props: ["automator"],
  computed:
  {
    thisLevelSpeed: function()
    {
      return formatTimePrecise(this.automator.getSpeed());
    },
    nextLevelSpeed: function()
    {
      return formatTimePrecise(this.automator.getSpeedForLevel(this.automator.level + 1));
    }
  }
});

var app = new Vue({
  el: "#game",
  data: game,
  methods: gameFunctions,
  created: loadGame,
  computed: gameComputed
});

function update()
{
  dTime.new = Date.now();
  requestAnimationFrame(update);

  refreshBuildingStats();

  game.cpc = 1 + Math.max(0, game.cps * 0.1 - 10) + game.prestigeUpgrades.clickBonusFlat.apply();

  game.cps = gameFunctions.getTotalCps();
  addCookies(game.cps * deltaTime());

  for (m of game.milestones)
  {
    m.tryUnlock();
  }

  for(k of Object.keys(game.automators))
  {
    game.automators[k].tick(deltaTime());
  }

  gameFunctions.mathMachine.solveEquation(); //try to solve every tick

  game.timeStamp = Date.now();
  if(game.firstPlayed === undefined)
  {
    game.firstPlayed = Date.now();
  }

  if(Date.now() - time.lastSave > 10000)
  {
    saveGame();
    time.lastSave = Date.now();
  }

  game.idleTime = gameFunctions.getIdleTime();
  game.timeInPrestige = (Date.now() - game.lastPrestigeTime) / 1000;

  dTime.old = dTime.new;
}

update();

function getOfflineProgress(cps, ms)
{
  return cps * Math.max(0, Math.min(86400 * 1000, ms)) / 1000; //0s to 1 day
}

function saveGame()
{
  localStorage.setItem("Ccookieclicker_game", JSON.stringify(game));
}

function loadVal(val, alt)
{
  return val !== undefined ? val : alt;
}

function loadGame(code)
{
  if(localStorage.getItem("Ccookieclicker_game") !== null || code !== undefined)
  {
    let g, saveString;

    if(code !== undefined)
    {
      saveString = atob(code);
    }
    else
    {
      saveString = localStorage.getItem("Ccookieclicker_game");
    }

    g = JSON.parse(saveString);

    game.cookies = loadVal(g.cookies, 0);
    game.cookiesTotal = loadVal(g.cookiesTotal, 0);
    game.cps = loadVal(g.cps, 0);

    game.settings.currentStyle = loadVal(g.settings.currentStyle, "style.css");
    gameFunctions.setGameStyle(game.settings.currentStyle);

    if(typeof game.settings.currentTab === "number" || typeof g.settings.currentTab === "number")
    {
      game.settings.currentTab = "Generators";
	  g.settings.currentTab = "Generators";
    }
    game.settings.currentTab = loadVal(g.settings.currentTab, "Generators");
    game.settings.numberFormatType = loadVal(g.settings.numberFormatType, 0);
    game.settings.showBoughtUpgrades = loadVal(g.settings.showBoughtUpgrades, true);

    game.clicks = loadVal(g.clicks, 0);
    game.clicksThisPrestige = loadVal(g.clicksThisPrestige, 0);
    game.lastClickTime = loadVal(g.lastClickTime, 0);
    game.firstPlayed = loadVal(g.firstPlayed, Date.now());

    game.prestigePoints = loadVal(g.prestigePoints, 0);
    game.prestigeCount = loadVal(g.prestigeCount, 0);
    game.lastPrestigeTime = loadVal(g.lastPrestigeTime, Date.now());

    game.mathMachine.equationsSolved = loadVal(g.mathMachine.equationsSolved, 0);

    game.automatons = loadVal(g.automatons, 0);
    game.pointsForAutoPrestige = loadVal(g.pointsForAutoPrestige, 0);
    game.getAutomatorPrices.cookies = loadVal(g.getAutomatorPrices.cookies, 1e76);
    game.getAutomatorPrices.prestigePoints = loadVal(g.getAutomatorPrices.prestigePoints, 1e9);

    for(let i = 0; i < g.buildings.length; i++)
    {
      let b = g.buildings[i];
      game.buildings[i].level = b.level;
      game.buildings[i].price = game.buildings[i].calculatePrice();
      game.buildings[i].cps = game.buildings[i].calculateCps();
      game.buildings[i].highestCps = game.buildings[i].highestCps;
    }

    for(let i = 0; i < g.upgrades.length; i++)
    {
      let u = g.upgrades[i];
      if(game.upgrades[i] === undefined)
      {
        game.upgrades.push(new Upgrade(u.name, u.buildingIndex, u.price, u.effect));
      }
      game.upgrades[i].bought = u.bought;
    }

    if (g.labUpgrades !== undefined)
    {
      for (let key of Object.keys(g.labUpgrades))
      {
        game.labUpgrades[key].level = g.labUpgrades[key].level;
      }
    }

    if (g.prestigeUpgrades !== undefined)
    {
      for (let key of Object.keys(g.prestigeUpgrades))
      {
        game.prestigeUpgrades[key].level = g.prestigeUpgrades[key].level;
      }
    }

    if (g.automators !== undefined)
    {
      for (let key of Object.keys(g.automators))
      {
        game.automators[key].level = g.automators[key].level;
        game.automators[key].price = game.automators[key].getPrice();
        game.automators[key].active = g.automators[key].active;
      }
    }

    addCookies(getOfflineProgress(game.cps, Date.now() - loadVal(g.timeStamp, Date.now())));

    refreshBuildingStats();
  }
}

function getSaveCode()
{
  return btoa(JSON.stringify(game));
}

window.onbeforeunload = function (e)
{
    saveGame();
};

window.onkeydown = function (e)
{
    if (e.which === 13) //enter
    {
        e.stopPropagation();
        e.preventDefault();
    }
};
