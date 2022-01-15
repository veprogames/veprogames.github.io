class ContentMolecules {
    constructor() {
        this.amount = new Decimal(0);
        this.molecules = [
            new Molecule("H₂O - Water", "images/molecules/water.png", new Decimal(0), 150, level => Decimal.pow(4, level)),
            new Molecule("NaCl - Salt", "images/molecules/salt.png", new Decimal(1e15), 250, level => Decimal.pow(10, level).mul(2)),
            new Molecule("CH₄ - Methane", "images/molecules/methane.png", new Decimal(1e24), 400, level => Decimal.pow(64, level ** 1.1).mul(3)),
            new Molecule("C₆ - Carbon Ring", "images/currencies/molecules.png", new Decimal(1e93), 650, level => Decimal.pow(16384, level ** 1.25).mul(4)),
            new Molecule("CH₂O₂ - Methanoid Acid", "images/molecules/methanoidacid.png", Decimal.pow(2, 2048), 1000, level => Decimal.pow(2 ** 22, level ** 1.5).mul(5)),
            new Molecule("C₈H₁₈ - Octane", "images/molecules/octane.png", new Decimal("1e10000"), 2500, level => Decimal.pow(2 ** 31 - 1, level ** 1.8).mul(6))
        ];
        this.currentMolecule = this.molecules[0];
        this.moleculeIdx = 0;
        this.upgrades = {
            matterBoost: new MoleculeUpgrade("More Matter", "It's so simple. Just a plain Matter Boost.",
                level => Decimal.pow(10, level ** 2 + 3 + Math.max(0, level - 200) ** 3 + Math.max(0, level - 5000) ** 4),
                level => Decimal.pow(2, level)),
            fasterEnergyCores: new MoleculeUpgrade("Faster Energy Cores", "Energy Cores will take less Merges to Level up. The effect will take place immediately.",
                level => Decimal.pow(1e3, level ** 3 + 3),
                level => Decimal.pow(0.99, level), {
                maxLevel: 100,
                getEffectDisplay: effectDisplayTemplates.numberStandard("x", "", 2, 3)
            }),
            moreIsotopes: new MoleculeUpgrade("Isotope Multiplier", "Finally, it's time to really get them going! Get more Isotopes at once when two Mergers collide.",
                level => Decimal.pow(1e6, level ** 4 + 4),
                level => new Decimal(1 + level)),
            mergerLevelExponent: new MoleculeUpgrade("Merger Exponentiality", "The production difference between Mergers used to be 5x... NO MORE!",
                level => Decimal.pow(1e30, level ** 5 + 5),
                level => new Decimal(5 + level * 0.01315468246), {
                getEffectDisplay: effectDisplayTemplates.numberStandard("x", "", 7)
            }),
            fasterMolecules: new MoleculeUpgrade("Faster Molecules", "Molecules will take less merges to level up. The effect will take place immediately.",
                level => Decimal.pow(10, level ** 6 + 12),
                level => Decimal.pow(0.95, level), {
                maxLevel: 10,
                getEffectDisplay: effectDisplayTemplates.numberStandard("x", "", 2)
            })
        }
    }

    addMolecules(amount) {
        this.amount = this.amount.add(amount);
        this.maxAmount = Decimal.max(this.amount, this.maxAmount);
    }

    setMolecule(index) {
        this.moleculeIdx = index;
        this.currentMolecule = this.molecules[index];
    }

    getMoleculePower() {
        return this.molecules.map(m => m.getPower()).reduce((a, b) => a * b);
    }

    isUnlocked() {
        return game.highestMergeObject >= 419;
    }

    getTotalUpgradeLevels() {
        return Object.values(this.upgrades).map(u => u.level).reduce((a, b) => a + b);
    }

    getMergeReduction() {
        let totalLvls = this.getTotalUpgradeLevels();
        return 0.99 ** Math.min(100, totalLvls) / (1 + 0.0001 * Math.max(0, totalLvls - 100)) 
            * Upgrade.apply(game.molecules.upgrades.fasterMolecules).toNumber();
    }

    load(obj) {
        let L = SaveManager.L;
        this.amount = L(new Decimal(obj.amount), new Decimal(0));
        this.moleculeIdx = L(obj.moleculeIdx, 0);
        this.setMolecule(this.moleculeIdx);
        if (obj.molecules) {
            for (let i = 0; i < obj.molecules.length; i++) {
                this.molecules[i].merges = L(obj.molecules[i].merges, 0);
                this.molecules[i].level = L(obj.molecules[i].level, 0);
            }
        }
        for (let k of Object.keys(obj.upgrades)) {
            if (this.upgrades[k]) {
                this.upgrades[k].setLevel(L(obj.upgrades[k].level, 0));
            }
        }
    }
}