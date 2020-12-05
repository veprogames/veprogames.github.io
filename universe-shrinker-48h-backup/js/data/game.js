var game = {
    universes: [new Universe("Universe", new Decimal(8.37e26), new Decimal(1)),
        new Universe("Multiverse", new Decimal(4.73e294), new Decimal(2)),
        new Universe("Megaverse", new Decimal("7.64e1976"), new Decimal(25)),
        new Universe("Gigaverse", new Decimal("8.02e7435"), new Decimal(1e3)),
        new Universe("Teraverse", new Decimal("1.46e34865"), new Decimal(5e6)),
        new Universe("Petaverse", new Decimal("2.95e102345"), new Decimal(1e10)),
        new Universe("Exaverse", new Decimal("9.51e184235"), new Decimal(1e16)),
        new Universe("Zettaverse", new Decimal("6.57e264862"), new Decimal(1e23)),
        new Universe("Yottaverse", new Decimal("4.52e410420"), new Decimal(1e32)),
        new Universe("Omniverse", new Decimal("1e1000000"), new Decimal(1e42))],
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
    settings:
    {
        tab: "shrinkers",
        theme: "light.css",
        formatterIndex: 0,
        numberFormatter: new ADNotations.StandardNotation()
    }
};