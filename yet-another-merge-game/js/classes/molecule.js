class Molecule {
    constructor(name, image, moleculesNeeded, mergesNeeded, getBoostPerLevel) {
        this.name = name;
        this.image = image;
        this.merges = 0;
        this.baseMergesNeeded = mergesNeeded;
        this.getBoostPerLevel = getBoostPerLevel;
        this.moleculesNeeded = moleculesNeeded;
        this.level = 0;
    }

    isUnlocked() {
        return game.molecules.amount.gte(this.moleculesNeeded);
    }

    addMerges(merges) {
        this.merges += merges;
        let lvlups = Math.floor(this.merges / this.getMergesNeeded());
        this.level += lvlups;
        this.merges -= this.getMergesNeeded() * lvlups;
    }

    //includes any upgrade effects
    getMergesNeeded() {
        let totalLvls = game.molecules.getTotalUpgradeLevels();
        let reduction = 0.99 ** Math.min(100, totalLvls) / (1 + 0.0001 * Math.max(0, totalLvls - 100));
        return Math.round(this.baseMergesNeeded * reduction);
    }

    getPower() {
        return Math.min(10, 1 + this.level * 0.0001);
    }

    getValue() {
        return this.getBoostPerLevel(this.level).pow(game.molecules.getMoleculePower());
    }
}