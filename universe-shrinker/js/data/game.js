var game = {
    universes: [new Universe("Universe", new Decimal(8.37e26), new Decimal(1)),
        new Universe("Multiverse", new Decimal(4.73e294), new Decimal(2)),
        new Universe("Megaverse", new Decimal("7.64e1976"), new Decimal(25)),
        new Universe("Gigaverse", new Decimal("8.02e7435"), new Decimal(5e4)),
        new Universe("Teraverse", new Decimal("1.46e34865"), new Decimal(2e9)),
        new Universe("Petaverse", new Decimal("2.95e102345"), new Decimal(3e13)),
        new Universe("Exaverse", new Decimal("9.51e184235"), new Decimal(5e16)),
        new Universe("Zettaverse", new Decimal("6.57e264862"), new Decimal(1e22)),
        new Universe("Yottaverse", new Decimal("4.52e410420"), new Decimal(4e26)),
        new Universe("Omniverse", new Decimal("1e1000000"), new Decimal(1e31))],
    universe: new Universe("Universe", new Decimal(8.37e26), new Decimal(1)),
    currentUniverseLevel: 0,
    highestUniverseLevel: 0,
    rhoParticles: new Decimal(0),
    shrinkers: [],
    resources: {},
    rhoUpgrades: {
        rhoBoost: new RhoUpgrade("Rho Boost", "All Generators produce more Rho-Particles",
            level => new Decimal(1000).mul(Decimal.pow(16, level)),
            level => Decimal.pow(1.5, level)),
        shrinkBoost: new RhoUpgrade("Shrink Boost", "All Generators Shrink faster",
            level => new Decimal(10000).mul(Decimal.pow(16, level)),
            level => new Decimal(1 + 0.05 * level), {
                getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
            }),
        shrinkingExpertise: new RhoUpgrade("Shrinking Expertise", "All Generators are stronger based on how far you shrunk the Universe",
            level => new Decimal(10e6).mul(Decimal.pow(1e3, level)),
            level => new Decimal(1 + (game.universe.getShrinksPS() < 10 ? game.universe.getShrinkProgress() : 1) * level)),
        synergyRho: new RhoUpgrade("Rho Synergy", "All Generators are stronger based on total Generator Levels",
            level => new Decimal(1e10).mul(Decimal.pow(1e4, level)),
            level => Decimal.pow(1 + 0.003 * Math.sqrt(level), functions.totalShrinkersBought()), {
                maxLevel: 5
            }),
        synergyShrink: new RhoUpgrade("Shrink Synergy", "All Generators Shrink stronger based on total Generator Levels",
            level => new Decimal(1e15).mul(Decimal.pow(1e4, level)),
            level => new Decimal(1 + 0.0002 * level * functions.totalShrinkersBought()),{
                maxLevel: 10,
                getEffectDisplay: effectDisplayTemplates.numberStandard(4, "^")
            })
    },
    universeLayers: {},
    thetaEnergy: new Decimal(0),
    totalThetaEnergy: new Decimal(0),
    thetaSpentOnUpgrades: new Decimal(0),
    thetaGoal: new Decimal(1.42e82),
    timesHeatDeath: 0,
    thetaUpgrades: {
        rhoBoost: new ThetaUpgrade("Rho Fortification Fortification", "All Generators produce more Rho Particles",
            level => Decimal.pow(1.7, level + functions.getTotalUpgradeLevels(game.thetaUpgrades) / 2).floor(),
            level => Decimal.pow(16, level)),
        shrinkBoost: new ThetaUpgrade("Shrinking the Shrinking", "All Generators Shrink stronger",
            level => Decimal.pow(1.58, level + functions.getTotalUpgradeLevels(game.thetaUpgrades) / 2).floor(),
            level => Decimal.pow(2, level).mul(1 + level * 1.5), {
                getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
            }),
        maxAllUnify: new ThetaUpgrade("Unified Maxing", "Max all affects all tabs (except Heat Death) instead of the current selected",
            level => new Decimal(1),
            level => level > 0, {
                maxLevel: 1,
                getEffectDisplay: function()
                {
                    return this.level > 0 ? "All Tabs" : "Current Tab → All Tabs";
                }
            }),
        thetaBoost: new ThetaUpgrade("More Heat, more Theta!", "Gain more Theta Energy on Heat Death",
            level => Decimal.pow(10, level).mul(10),
            level => Decimal.pow(2, level)),
        multVerse: new ThetaUpgrade("MultiMultiverse Upgrade", "Shrink multiple Verses at once",
            level => Decimal.pow(5, level + functions.getTotalUpgradeLevels(game.thetaUpgrades) / 6).mul(10).floor(),
            level => Decimal.pow(2, level),{
                getEffectDisplay: effectDisplayTemplates.numberStandard(0)
            }),
        passiveUniverse: new ThetaUpgrade("Passive Shrinking", "Shrink Universes lower than you have selected at a reduced rate",
            level => Decimal.pow(1.25, level + functions.getTotalUpgradeLevels(game.thetaUpgrades) / 8).mul(1000).floor(),
            level => new Decimal(0.01 * level),{
                maxLevel: 100
            }),
        universeUpgradePower: new ThetaUpgrade("Universe Upgrade Power", "All Shrinking Upgrades of Universe Layers are stronger",
            level => Decimal.pow(3e5, level + Math.max(0, level - 5) * 0.06).mul(1e7),
            level => new Decimal(1 + 0.1 * level),{
                getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
            }),
        retainUniverseLevel: new ThetaUpgrade("Retain Layering", "Keep your highest Universe reached (don't go back to Universe)",
            level => new Decimal(1e10),
            level => level > 0,{
                maxLevel: 1,
                getEffectDisplay: function()
                {
                    return this.level > 0 ? "Bought" : "Not Bought → Bought";
                }
            })
    },
    automators: [
        new Automator("Shrinker Autobuyer", "Autobuy Shrinkers",
            level => Decimal.pow(2, level), 10,
            () => functions.maxShrinkers()),
        new Automator("Rho Autobuyer", "Autobuy Rho Upgrades",
            level => Decimal.pow(3, level), 30,
            () => functions.maxRhoUpgrades()),
        new Automator("Verse Autobuyer", "Autobuy Upgrades from all Universe Layers",
            level => Decimal.pow(4, level), 120,
            () => functions.maxUniverseLayers())
    ],
    ngMinus: 0,
    timeSpent: 0,
    settings:
    {
        tab: "shrinkers",
        universeTab: "Universe",
        theme: "light.css",
        formatterIndex: 0,
        numberFormatter: new ADNotations.StandardNotation(),
        maxAllTabs: true,
        maxAllLayers: true,
        exportString: "Exported Save will appear here..."
    }
};