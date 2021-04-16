let game = {
    init: false,
    numberFormatter: new ADNotations.StandardNotation(),
    money: new Decimal(25000),
    team: null,
    currentMatch: null,
    nextMatch: null,
    league: null,
    restartedTutorial: false,
    countries: [
        new Country("Nowhereia", `This is your Starting Point. People here don't even really play Football, and are not interested in it. 
            Teams here aren't very good, a good way for you to get going!`, new CountryFlag(["white"])),
        new Country("Anti-Football Nation", `They do play Football, but they really dislike it. They still play it, for some reason.
            They are better than in Nowhereia, but it won't be a Problem for you.`, new CountryFlag(["white", "skyblue", "blue"])),
        new Country("Country #3", `It's just an ordinary Country, as ordinary as it can be. There's nothing special about it. They
        <span title="For lack of creativity.">don't even have a unique Name.</span>`, new CountryFlag(["#81ac5c", "#abcdef", "#7e86a7"]))
    ],
    country: 0,
    canEnterNextCountry: false,
    playerMarket: new PlayerMarket(),
    moneyUpgrades:{
        matchSpeed: new MoneyUpgrade(level => Decimal.pow(3, level).mul(10000),
            level => 180 * (200 / 180) ** level, {
                maxLevel: 12
            }),
        //-> 9x money per division, ~11x player price per division
        matchRewards: new MoneyUpgrade(level => Decimal.pow(9, level / 4).mul(100000),
            level => (9 / 6) ** (level / 4)),
        cheaperPlayers: new MoneyUpgrade(level => Decimal.pow(7, level / 3).mul(1000000),
            level => 1 / 1.02 ** level),
        playerRegeneration: new MoneyUpgrade(level => Decimal.pow(1.25, level).mul(5000000),
            level => new Decimal(1 + 0.05 * level), {
                getEffectDisplay: effectDisplayTemplates.percentStandard(0)
            })
    },
    stadium: new Stadium(),
    achievements: [
        new Achievement("Starting Out", "Buy your first Player", "images/icons/player-market.png", () => game.team.players.length > 0),
        new Achievement("I am the Winner!", "Win your first match", "images/icons/football.png", () => game.team.divisionStats.win >= 1),
        new Achievement("Full Team", "Have 11 Players active in your Team", "images/player.png", () => game.team.getActivePlayers().length >= 11),
        new Achievement("Color Palette", "Give your Team Logo as many Colors as possible", "images/icons/colorful.png", () => game.team.logo.gradient.length >= 9),
        new Achievement("Upgradealicious", "Buy your first Upgrade", "images/icons/upgrades.png", () => Utils.getTotalUpgradeLevels(game.moneyUpgrades) > 0),
        new Achievement("Ẅ̵̡̜̻̦̦̓̔͂̏̈̉̀̈́̕͘̚͜͠e̸̢̛͖̦͓̼̐̉͌̈́̃̄͐̎̃̌̉̕͘͘͜ͅḯ̵̧͚͚̯͚͕̘̻͋ͅr̸̨̛͉͇̼͎̭͍̺͗̍̆͒̉̅́͊͑̓̇̇̃̕d̶̞̮̭̲̭̲̏͑̇͗̆̽̅̕͝͝ ̴̨̢͚͉͓͓̺̘̩̖͎̳̥̯̓̋́̿͐̐͆͒̍̆̈͒N̸̨̻̻̈́́͐͒u̴̡̧̨̬̫̼̞̬̩̙̗̜͒̽̐̈́̉ḿ̸̞̝̭̟̼̜̫̳̻̹̖b̷̧̢̡̳̮̤̖̓͊͛͒̀͛̑̚ȅ̶͔̘͈̦͕̩̟͎̗̙̩̿̅̅̾̒̈́̀͘̚͝ͅͅr̸̩͔̖̥̬̮̯̣̭̅s̴̡̨͚͕̦̙̉̅̈́̋̔͆͛͛͌̆̎̚͝", "Change you Notation to Zalgo", "images/icons/zalgo.png", () => game.numberFormatter.name === "Zalgo"),
        new Achievement("Rich? Not really...", "Have at least 100,000 $", "images/icons/money.png", () => game.money.gte(100000)),
        new Achievement("I am the Champion!", "Promote into the next Division", "images/icons/league.png", () => game.team.divisionRank >= 1),
        new Achievement("Someone's watching", "Unlock the Stadium", "images/icons/stadium.png", () => Stadium.isUnlocked),
        new Achievement("That's a lot of MONEY", "Have at least 10,000,000 $", "images/icons/rich.png", () => game.money.gte(10000000)),
        new Achievement("Kinda Famous", "Have at least 10,000 Fans", "images/icons/stadium.png", () => game.stadium.fans.gte(10000)),
        new Achievement("Final Division", "Promote into the highest Division", "images/icons/league.png", () => game.team.divisionRank >= game.league.divisions.length - 1),
        new Achievement("Very Famous", "Have at least 10,000,000 Fans", "images/icons/stadium.png", () => game.stadium.fans.gte(10e6)),
        new Achievement("Super Speed", "Turn your Match Speed above x300", "images/icons/speed.png", () => game.settings.match.speed >= 300),
        new Achievement("I am the Master!", "Enter the next Country", "images/icons/country.png", () => game.country >= 1),
        new Achievement("The WORLD is watching", "Have a Stadium Capacity of at least 7.8e9", "images/icons/stadium.png", () => game.stadium.getCapacity().gte(7.8e9))
    ],
    tab: "tab-team",
    settings: {
        term: "Football",
        team: {
            refillPlayers: true
        },
        match: {
            speed: 1,
            autoPlay: false,
            minAutoPlayStamina: 0
        }
    }
};