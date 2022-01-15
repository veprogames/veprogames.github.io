class EnergyCore //merge things to level it up, get an increasing multiplier
{
    constructor(name, price, getBaseNeededMerges, getBoost, img) {
        this.name = name;
        this.price = price;
        this.getBaseNeededMerges = getBaseNeededMerges;
        this.level = 0;
        this.merges = 0;
        this.locked = true;
        this.isActive = false;
        this.getBoost = getBoost;
        this.img = img;
        this.evt = new EventTarget();
    }

    setActive(b) {
        this.isActive = b;
    }

    tryAddMerge() {
        if (this.isActive) {
            this.merges++;
            this.checkLevelUp();
        }
    }

    getNeededMerges(){
        return Math.round(this.getBaseNeededMerges(this.level) * Upgrade.apply(game.molecules.upgrades.fasterEnergyCores).toNumber());
    }

    checkLevelUp() {
        if (this.merges >= this.getNeededMerges()) {
            this.merges = 0;
            this.level++;
            this.evt.dispatchEvent(new Event("levelchanged"));
        }
    }

    addLevelChangedListener(l){
        this.evt.addEventListener("levelchanged", l);
    }

    removeLevelChangedListener(l){
        this.evt.removeEventListener("levelchanged", l);
    }

    buy() {
        if (this.locked && game.prestige.quantumFoam.gte(this.price)) {
            game.prestige.quantumFoam = game.prestige.quantumFoam.sub(this.price);
            this.locked = false;
        }
    }
}