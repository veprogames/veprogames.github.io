class ContentPrestige {
    constructor() {
        this.quantumFoam = new Decimal(0);
        this.highestQuantumFoam = new Decimal(0);
        this.bankedQuantumFoam = new Decimal(0);
        this.count = 0;
        this.upgrades = {
            fasterMergers: new PrestigeUpgrade("Faster Mergers", "Mergers spawn and move Faster",
                level => {
                    return new Decimal(10).mul(level + 1).mul(level > 10 ? Decimal.pow(1.1, level - 10) : 1);
                },
                level => {
                    return new Decimal(1 + 0.025 * level);
                }, {
                getEffectDisplay: effectDisplayTemplates.percentStandard("", 1),
                maxLevel: 25
            }),
            matterBoost: new PrestigeUpgrade("Matter Boost", "Boost Matter Production even further.",
                level => {
                    return new Decimal(100).add(new Decimal(50).mul(Math.pow(level, 1.25)).mul(level > 10 ? Decimal.pow(1.25, level - 10) : 1));
                },
                level => {
                    return new Decimal(1 + 0.3 * level).mul(level >= 4 ? Math.pow(level - 3, 0.25) : 1);
                },
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard()
                }),
            foamBoost: new PrestigeUpgrade("Quantum Foam Boost", "Get more Quantum Foam.",
                level => {
                    return new Decimal(200).mul(Decimal.pow(1.5, level));
                },
                level => {
                    return new Decimal(1 + 0.2 * level).add(level > 4 ? (level - 4) * 0.05 : 0);
                },
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard()
                }),
            headStart: new PrestigeUpgrade("Head Start", "Get free Matter on Prestige",
                level => {
                    return new Decimal(500).mul(Decimal.pow(1.5, level)).mul(Decimal.pow(1.5, Math.max(level - 10, 0)));
                },
                level => {
                    return level > 0 ? (new Decimal(10e6).mul(Decimal.pow(50, level - 1))) : new Decimal(0);
                }, {
                getEffectDisplay: effectDisplayTemplates.numberStandard("", ""),
                maxLevel: 100,
                onBuy(){
                    game.matter.amount = Decimal.max(game.matter.amount, this.apply());
                }
            }),
            socialBoost: new PrestigeUpgrade("Support Boost", "\"Support Me\" boost is better",
                level => Decimal.pow(10000, (level + 1) ** 3).mul(100000),
                level => new Decimal(3).mul(Decimal.pow(3, level)).pow(game.isotopes.upgrades.socialBoost.apply()), {
                    maxLevel: 2,
                    updateOn: () => [game.isotopes.upgrades.socialBoost]
                })
        };

        this.milestones = [ //get times x quantum foam for reaching merger y
            [29, 1.5],
            [36, 1.6],
            [49, 1.7],
            [69, 2.4],
            [189, 2.5],
            [249, 2.5]
        ];
    }

    isUnlocked() {
        return game.matter.amountThisPrestige.gt(1e12) || game.prestige.highestQuantumFoam.gt(0);
    }

    hasPrestiged() {
        return this.count > 0;
    }

    prestige() {
        let foamToGet = this.getQuantumFoam();

        if (foamToGet.gt(0)) {
            game.prestige.addQuantumFoam(foamToGet);

            game.mergeObjects = [];
            game.matter.amount = Upgrade.apply(game.prestige.upgrades.headStart);
            game.matter.amountThisPrestige = new Decimal(0);
            game.highestMergeObjectThisPrestige = 0;
            for (let k of Object.keys(game.matter.upgrades)) {
                game.matter.upgrades[k].setLevel(0);
            }

            this.count++;
            game.mergesThisPrestige = 0;
        }
    }

    addQuantumFoam(amount) {
        this.quantumFoam = this.quantumFoam.add(amount);
        this.bankedQuantumFoam = this.bankedQuantumFoam.add(amount);
        this.highestQuantumFoam = Decimal.max(this.quantumFoam, this.highestQuantumFoam);
    }

    getQuantumFoam(matter) {
        matter = matter ? matter : game.matter.amountThisPrestige;
        if (matter.lt(1e12)) {
            return new Decimal(0);
        }
        return new Decimal(25).add(Decimal.floor(Decimal.max(0, 25 * Decimal.log10(matter.div(1e12)))
            .mul(Decimal.pow(1.15, Math.max(0, Decimal.log10(matter.div(1e27)))))
            .mul(Decimal.pow(1.015, Math.max(0, Decimal.log10(matter.div(1e48)))))
            .mul(Decimal.pow(1.02, Math.max(0, Decimal.log10(matter.div(1e63)))))
            .mul(Upgrade.apply(game.prestige.upgrades.foamBoost)))
            .mul(this.getMilestoneBoost()));
    }

    getQuantumFoamBoost() {
        return new Decimal(1).add(game.prestige.bankedQuantumFoam.mul(0.01));
    }

    getQFMilestoneInfo() {
        let boost = new Decimal(1);
        let idx = 0;

        while (idx < this.milestones.length && Math.round(game.highestMergeObjectThisPrestige) >= Math.round(this.milestones[idx][0])) {
            boost = boost.mul(this.milestones[idx][1]);
            idx++;
        }

        return {
            boost,
            nextMilestone: this.milestones[idx]
        };
    }

    getNextMilestone() {
        return this.getQFMilestoneInfo().nextMilestone;
    }

    getMilestoneBoost() {
        return this.getQFMilestoneInfo().boost;
    }
}