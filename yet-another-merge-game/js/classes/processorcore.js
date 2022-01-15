class ProcessorCore {
    constructor() {
        this.level = 0;
        this.evt = new EventTarget();
    }

    getBoost(level) {
        return new Decimal(25 * Math.min(10, 1 + level)).mul(Decimal.pow(275 / 250, Math.max(level - 9, 0)));
    }

    getPrice(level) {
        let priceMult = level > 10 ? 1.25 * Math.floor(level / 10) : 1;
        return new Decimal(250 + 150 * Math.pow(level, 1.3) * priceMult).mul(Decimal.pow(1.02, Math.max(0, level - 1000)));
    }

    getCurrentPrice() {
        return this.getPrice(this.level);
    }

    getCurrentBoost() {
        return this.getBoost(this.level);
    }

    addLevelChangedListener(l){
        this.evt.addEventListener("levelchanged", l);
    }

    removeLevelChangedListener(l){
        this.evt.removeEventListener("levelchanged", l);
    }

    upgrade() {
        if (game.isotopes.amount.gte(this.getCurrentPrice())) {
            game.isotopes.amount = game.isotopes.amount.sub(this.getCurrentPrice());
            this.level++;
            this.evt.dispatchEvent(new Event("levelchanged"));
        }
    }
}