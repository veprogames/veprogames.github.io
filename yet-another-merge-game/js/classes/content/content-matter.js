class ContentMatter {
    constructor() {
        this.amount = new Decimal(0);
        this.amountThisPrestige = new Decimal(0);
        this.upgrades = {
            fasterSpawn: new Upgrade("Faster Spawn", "Mergers spawn faster",
                level => {
                    let priceMult = level > 35 ? Decimal.pow(3, Math.pow(level - 35, 1.5)) : new Decimal(1);
                    return new Decimal(1e3).mul(Decimal.pow(3, Math.pow(level, 1.1))).mul(priceMult);
                },
                level => {
                    return new Decimal(5 * Math.pow(0.975, Math.min(50, level)) / (1 + Math.max(0, level - 50) * 0.01))
                        .div(Upgrade.apply(game.prestige.upgrades.fasterMergers))
                        .mul(Upgrade.apply(game.isotopes.upgrades.spawnSpeed));
                },
                {
                    getEffectDisplay: effectDisplayTemplates.numberStandard("", "s", 2)
                }
            ),
            betterObjects: new Upgrade("Better Mergers", "Mergers spawn one Tier higher",
                level => {
                    let prices = [10e3, 50e3, 250e3, 1.5e6, 7.5e6, 35e6, 200e6, 1e9, 6e9, 33e9, 150e9, 750e9, 4e12, 20e12, 125e12, 500e12, 1e15];
                    if (level < prices.length) {
                        return new Decimal(prices[level]);
                    }
                    let priceMult = [level > 151 ? Decimal.pow(1.5, Math.floor((level - 151) / 10)) : new Decimal(1),
                    level > 500 ? Decimal.pow(1.75, Math.floor((level - 500) / 5)) : new Decimal(1),
                    level > 2500 ? Decimal.pow(1024, Math.floor((level - 2500) / 25)) : new Decimal(1),
                    level > 5000 ? Decimal.pow(2 ** 31 - 1, Math.floor((level - 5000) / 50)) : new Decimal(1)];
                    let power = 1 + 0.0002 * Math.max(0, level - 10000);
                    return new Decimal(prices[prices.length - 1]).mul(Decimal.pow(7, level - prices.length + 1)).mul(priceMult[0]).mul(priceMult[1])
                        .mul(priceMult[2]).mul(priceMult[3]).pow(power);
                },
                level => {
                    return new Decimal(level);
                },
                {
                    getEffectDisplay: function () {
                        return "#" + functions.formatNumber(this.level + 1, 0, 0, 1e6) + " → " +
                            "#" + functions.formatNumber(this.level + 2, 0, 0, 1e6);
                    },
                    onBuy: level => {
                        for (let obj of game.mergeObjects) {
                            if (obj.level < level) {
                                obj.level = level;
                                obj.lifeTime = 0;
                            }
                        }
                        game.highestMergeObjectThisPrestige = Math.max(game.highestMergeObjectThisPrestige, level);
                        game.highestMergeObject = Math.max(game.highestMergeObject, level);
                    }
                }),
            maxObjects: new Upgrade("Max Objects", "Increase the Max Amount of Objects",
                level => {
                    return (new Decimal(1e7).mul(Decimal.pow(10, level * level + level * 3))).pow(Decimal.pow(1.1, Math.max(level - 16, 0)));
                },
                level => {
                    return Decimal.round(new Decimal(6 + level));
                },
                {
                    getEffectDisplay: effectDisplayTemplates.numberStandard("", "", 0),
                    maxLevel: 43
                }),
            matterOnMerge: new Upgrade("Matter on Merge", "Increase the Chance of getting bonus matter on Merge. (2 seconds of income)",
                level => new Decimal(1e18).mul(Decimal.pow(3e3, level)),
                level => new Decimal(0.02 * level),
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 10
                })
        };
    }

    totalMatterPerSecond() {
        let total = new Decimal(0);

        for (let obj of game.mergeObjects) {
            total = total.add(obj.output);
        }

        return total;
    }
}