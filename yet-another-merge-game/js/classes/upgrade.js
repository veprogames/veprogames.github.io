class Upgrade {
    constructor(name, desc, getPrice, getEffect, config = {}) {
        this.name = name;
        this.desc = desc;
        this.level = 0;
        this.getPrice = getPrice;
        this.getEffect = getEffect;
        this.type = "normal";
        this.getEffectDisplay = config && config.getEffectDisplay ? config.getEffectDisplay : effectDisplayTemplates.numberStandard();
        if (config.onBuy !== undefined) {
            this.onBuy = config.onBuy;
        }
        this.maxLevel = (config.maxLevel !== undefined) ? config.maxLevel : Infinity;

        this.effect = new Decimal(0);
        this.effectNext = new Decimal(0);
        this.price = new Decimal(0);
        this.evt = new EventTarget();

        this.updateOn = config.updateOn;

        globalEvents.addEventListener("gamepreinit", () => {
            const updateOn = config && config.updateOn ? config.updateOn() : null;
            if(updateOn){
                for(let upg of updateOn) {
                    upg.addLevelChangedListener(() => {
                        this.updateStats();
                    });
                }
            }
        }, {once: true});

        globalEvents.addEventListener("gameinit", () => {
            this.updateStatsRecursive();
        }, {once: true});

        globalEvents.addEventListener("gameload", () => {
            this.updateStatsRecursive();
        });
    }

    setLevel(level) {
        this.level = level;
        this.updateStats();
        this.evt.dispatchEvent(new Event("levelchanged"));
    }

    nextLevel(){
        this.setLevel(this.level + 1);
    }

    updateEffect(){
        this.effect = this.getEffect(this.level);
        this.effectNext = this.getEffect(this.level + 1);
    }

    updatePrice(){
        this.price = this.getPrice(this.level);
    }

    updateStats(){
        this.updateEffect();
        this.updatePrice();
    }

    updateStatsRecursive(){
        const upgs = this.updateOn ? this.updateOn() : null;
        if(upgs){
            for(const upg of upgs) upg.updateStatsRecursive();
        }
        this.updateStats();
    }

    addLevelChangedListener(l){
        this.evt.addEventListener("levelchanged", l);
    }

    removeLevelChangedListener(l){
        this.evt.removeEventListener("levelchanged", l);
    }

    getCurrentPrice() {
        return this.price;
    }

    getPriceDisplay() {
        return this.level < this.maxLevel ? functions.formatNumber(this.getCurrentPrice()) : "MAX";
    }

    buttonDisabled() //is buy button disabled?
    {
        let currency = game.matter.amount;

        switch (this.type) {
            case "prestige":
                currency = game.prestige.quantumFoam;
                break;
            case "isotopes":
                currency = game.isotopes.amount;
                break;
            case "molecules":
                currency = game.molecules.amount;
                break;
            default:
                break;
        }

        if (this.level === this.maxLevel) return true;
        return currency.lt(this.getCurrentPrice());
    }

    buy() {
        let currency = game.matter.amount;

        switch (this.type) {
            case "prestige":
                currency = game.prestige.quantumFoam;
                break;
            case "isotopes":
                currency = game.isotopes.amount;
                break;
            case "molecules":
                currency = game.molecules.amount;
                break;
            default:
                break;
        }

        if (this.getPrice(this.level).lte(currency) && this.level < this.maxLevel) {
            let price = this.getPrice(this.level);
            switch (this.type) {
                case "normal":
                    game.matter.amount = game.matter.amount.sub(price);
                    break;
                case "prestige":
                    game.prestige.quantumFoam = game.prestige.quantumFoam.sub(price);
                    break;
                case "isotopes":
                    game.isotopes.amount = game.isotopes.amount.sub(price);
                    break;
                case "molecules":
                    game.molecules.amount = game.molecules.amount.sub(price);
                    break;
                default:
                    break;
            }
            this.nextLevel();
            this.onBuy(this.level);
        }
    }

    onBuy(level) {

    }

    apply() {
        return this.effect;
    }

    static apply(upg) {
        return upg.effect;
    }
}

class PrestigeUpgrade extends Upgrade {
    constructor(name, desc, getPrice, getEffect, config) {
        super(name, desc, getPrice, getEffect, config);
        this.type = "prestige";
    }
}

class IsotopeUpgrade extends Upgrade {
    constructor(name, desc, getPrice, getEffect, config) {
        super(name, desc, getPrice, getEffect, config);
        this.type = "isotopes";
    }

    getPriceDisplay() {
        return this.level < this.maxLevel ? functions.formatThousands(this.getCurrentPrice()) : "MAX";
    }
}

class MoleculeUpgrade extends Upgrade {
    constructor(name, desc, getPrice, getEffect, config) {
        super(name, desc, getPrice, getEffect, config);
        this.type = "molecules";
    }
}

let effectDisplayTemplates =
{
    numberStandard: function (prefix, suffix, digits, digitsLim) {
        let s = suffix !== undefined ? suffix : "x";
        let p = prefix !== undefined ? prefix : "";

        if (digitsLim === undefined) {
            digitsLim = digits;
        }

        return function () {
            let e = this.effect;
            if (this.level === this.maxLevel) {
                return p + functions.formatNumber(e, digits, digitsLim) + s;
            } else {
                let eN = this.effectNext;
                return p + functions.formatNumber(e, digits, digitsLim) + s + " → " + p + functions.formatNumber(eN, digits, digitsLim) + s;
            }
        }
    },
    percentStandard: function (prefix, digits) {
        let p = prefix !== undefined ? prefix : "";

        return function () {
            let e = this.effect.mul(100);
            if (this.level === this.maxLevel) {
                return p + functions.formatNumber(e, digits, digits) + " %";
            } else {
                let eN = this.effectNext.mul(100);
                return p + functions.formatNumber(e, digits, digits) + " % → " + p + functions.formatNumber(eN, digits, digits) + " %";
            }
        }
    },
    time: function () {
        return function () {
            let e = this.effect.toNumber();
            if (this.level === this.maxLevel) {
                return Utils.formatTime(e);
            } else {
                let eN = this.effectNext.toNumber();
                return Utils.formatTime(e) + " → " + Utils.formatTime(eN);
            }
        }
    }
};