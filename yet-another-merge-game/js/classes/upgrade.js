class Upgrade {
    constructor(name, desc, getPrice, getEffect, config) {
        this.name = name;
        this.desc = desc;
        this.level = 0;
        this.getPrice = getPrice;
        this.getEffect = getEffect;
        this.type = "normal";
        this.getEffectDisplay = config && config.getEffectDisplay ? config.getEffectDisplay : effectDisplayTemplates.numberStandard();
        if (config && config.onBuy !== undefined) {
            this.onBuy = config.onBuy;
        }
        this.maxLevel = (config !== undefined && config.maxLevel !== undefined) ? config.maxLevel : Infinity;
    }

    getCurrentPrice() {
        return this.getPrice(this.level);
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
            this.level++;
            this.onBuy(this.level);
        }
    }

    onBuy(level) {

    }

    static apply(upg) {
        return upg.getEffect(upg.level);
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
            let e = this.getEffect(this.level);
            if (this.level === this.maxLevel) {
                return p + functions.formatNumber(e, digits, digitsLim) + s;
            } else {
                let eN = this.getEffect(this.level + 1);
                return p + functions.formatNumber(e, digits, digitsLim) + s + " → " + p + functions.formatNumber(eN, digits, digitsLim) + s;
            }
        }
    },
    percentStandard: function (prefix, digits) {
        let p = prefix !== undefined ? prefix : "";

        return function () {
            let e = this.getEffect(this.level).mul(100);
            if (this.level === this.maxLevel) {
                return p + functions.formatNumber(e, digits, digits) + " %";
            } else {
                let eN = this.getEffect(this.level + 1).mul(100);
                return p + functions.formatNumber(e, digits, digits) + " % → " + p + functions.formatNumber(eN, digits, digits) + " %";
            }
        }
    }
};