class Pickaxe
{
    constructor(name, pow, quality)
    {
        this.name = name;
        this.pow = new Decimal(pow);
        this.quality = new Decimal(quality);
    }

    static generateName(q, bonus)
    {
        let qualityTier = Math.floor(Math.log(q) / Math.log(1.4) + Math.random() * 2);
        let baseQuality =  ["Bad", "Sturdy", "Normal", "Rare", "Epic", "Legendary", "Superb",
            "Cosmic", "Divine", "Ultimate", "Godly", "Demigodly", "Supergodly", "OMEGA"][Math.max(0, Math.min(qualityTier, 13))];
        let times = Math.floor(Decimal.log10(q.div(200)) / Math.log(1.15) + Math.random() * 3 - 5);
        let nameType = 1;
        let name;
        if(Math.random() < 0.3)
        {
            nameType = 0;
        }
        if(nameType === 0)
        {
            name = Utils.choose("Pickaxe", "Pick") + " \"" + Utils.generateWord(Math.random() * 1e6, Math.floor(Math.random() * 4 + 4)) + "\"";
        }
        if(nameType === 1)
        {
            let id = Math.max(0, game.highestMineObjectLevel - 12 + Math.round(Math.random() * 9));
            let mineObj = game.mineObjects[id];
            if(mineObj === undefined)
            {
                mineObj = functions.generateMineObject(id);
            }
            name = mineObj.name + " " + Utils.choose("Pickaxe", "Pick");
        }
        return baseQuality + " " + (times > 1 ? times + " TIMES " : "") + name +
            (bonus > 0 ? " +" + bonus : "");
    }

    static craft(gems, avg, avgValue)
    {
        avgValue = avgValue !== undefined ? avgValue : 0.5;
        gems = new Decimal(gems);
        let powMultiplier = (gems.sub(1)).div(5).add(1);
        let qualityBonus = new Decimal(gems / 20 * (avg ? avgValue : Math.random()));
        let bonus = avg ? 0 : applyUpgrade(game.upgrades.blacksmithBonus).toNumber();
        let powBonus = new Decimal(1 + 0.15 * bonus);

        let pow = applyUpgrade(game.upgrades.blacksmith).mul(1 + (avg ? avgValue : Math.random()) * 1.15).mul(powMultiplier)
                                                        .mul(powBonus);
        let q = new Decimal(1 + (avg ? avgValue : Math.random()) * 0.3).add(qualityBonus).mul(applyUpgrade(game.upgrades.blacksmithSkill));
        if(avg)
        {
            return new Pickaxe("Average Result", pow, q);
        }

        for(let i = 0; i < 15; i++)
        {
            if(Math.random() < 0.5)
            {
                q = q.mul(1.15);
            }
            else
            {
                break;
            }
        }
        let name = Pickaxe.generateName(q, bonus);
        return new Pickaxe(name, pow, q);
    }

    getDamage()
    {
        return this.pow.mul(this.quality);
    }
}