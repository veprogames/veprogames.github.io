class ContentIsotopes {
    constructor() {
        this.amount = new Decimal(0);
        this.upgrades =
        {
            isotopeChance: new IsotopeUpgrade("Isotope Chance", "Increase the Chance to get Isotopes when two Mergers collide.",
                level => {
                    let price = new Decimal(1 + level);
                    if (level > 10) {
                        price = price.add(level - 10)
                    }
                    if (level > 25) {
                        price = price.add((level - 25) * 2)
                    }
                    if (level > 50) {
                        price = price.add((level - 25) * 4)
                    }
                    let priceMult = Decimal.pow(1.5, Math.max(0, 1 + Math.floor((level - 70) / 10)));
                    return price.mul(priceMult);
                },
                level => new Decimal(0.01 + 0.01 * level),
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 99
                }),
            doubleSpawn: new IsotopeUpgrade("Double Spawn", "Increase the Chance to spawn 2 Mergers at once instead of one.",
                level => new Decimal(level + 5 + 10 * Math.floor(level / 10) + 15 * Math.floor(level / 20)),
                level => new Decimal((level > 0 ? 0.1 : 0) + 0.02 * Math.max(0, level - 1)),
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 25
                }),
            matterBoost: new IsotopeUpgrade("Matter Boost", "Produce even more matter",
                level => new Decimal(100 + 125 * level).mul(Decimal.pow(1.3, Math.floor(Math.max(0, level - 100) / 25))).round(),
                level => Decimal.pow(2, level),
                {
                    getEffectDisplay: effectDisplayTemplates.numberStandard()
                }),
            spawnSpeed: new IsotopeUpgrade("Spawn Speed", "Merger Spawn Time is reduced even further",
                level => new Decimal(1000 + 20 * level ** 2).round(),
                level => Decimal.pow(0.97, level),
                {
                    maxLevel: 50,
                    getEffectDisplay: effectDisplayTemplates.numberStandard("x", "", 3, 3)
                }),
            autoQuantumFoam: new IsotopeUpgrade("Automatic Foam", "Get a percentage of potential Quantum Foam each Second",
                level => new Decimal(10101010 + 11111111 * level),
                level => new Decimal(0.001 * level),
                {
                    maxLevel: 10,
                    getEffectDisplay: effectDisplayTemplates.percentStandard("", 1)
                }),
            socialBoost: new IsotopeUpgrade("Social Power", "Social Boost is raised to a power", 
                level => new Decimal(2022),
                level => new Decimal(1 + level), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard("^", "", 0)
                })
        };
    }

    isUnlocked() {
        return game.quantumProcessor.cores.length >= 1;
    }
}