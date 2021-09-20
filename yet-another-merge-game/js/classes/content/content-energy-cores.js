class ContentEnergyCores {
    constructor() {
        this.cores = [
            new EnergyCore("Photon", new Decimal(50000),
                level => {
                    return 100 + 10 * level;
                },
                level => {
                    return new Decimal(2 + 0.4 * level).mul(Decimal.pow(1.07, level));
                }, "energycores/photon.png"),
            new EnergyCore("Neutrino", new Decimal(1e6),
                level => {
                    return 150 + 20 * level;
                },
                level => {
                    return new Decimal(2.25 + 0.75 * level).mul(Decimal.pow(1.15, level));
                }, "energycores/neutrino.png"),
            new EnergyCore("Gluon", new Decimal(500e6),
                level => {
                    return 200 + 50 * level;
                },
                level => {
                    return new Decimal(3 + 2 * level).mul(Decimal.pow(1.3, level));
                }, "energycores/gluon.png"),
            new EnergyCore("Electron", new Decimal(100e9),
                level => {
                    return 50 + Math.floor(Math.max(0, level - 150));
                },
                level => {
                    return new Decimal(2 + 0.1 * level).mul(Decimal.pow(1.015, level));
                }, "energycores/electron.png"),
            new EnergyCore("Muon", new Decimal(500e12),
                level => {
                    return 100 + 25 * level;
                },
                level => {
                    return new Decimal(3 + level).mul(Decimal.pow(1.175, level));
                }, "energycores/muon.png")
        ];
    }

    isUnlocked() {
        return game.prestige.highestQuantumFoam.gte(50000);
    }

    getCoreBoost() {
        let boost = new Decimal(1);
        for (let c of this.cores) {
            if (!c.locked) {
                boost = boost.mul(c.getBoost(c.level));
            }
        }
        return boost;
    }

    checkCores() {
        for (let core of this.cores) {
            core.tryAddMerge();
        }
    }

    activateEnergyCore(core) {
        for (let c of this.cores) {
            c.isActive = false;
        }

        core.isActive = true;
    }

    selectMostEfficientEnergyCore() {
        let lowest;
        let v = new Decimal(1);
        for (let core of this.cores) {
            if (!core.locked) {
                let multPerMerge = Decimal.pow(core.getBoost(core.level + 1).div(core.getBoost(core.level)), 1 / core.getNeededMerges(core.level));
                if (v.lt(multPerMerge)) {
                    v = multPerMerge;
                    lowest = core;
                }
            }
        }
        this.activateEnergyCore(lowest);
    }
}