class Upgrade
{
    constructor(name, desc, parent, basePrice, getPrice, getEffect, getDisplay)
    {
        this.name = name;
        this.desc = desc;
        this.basePrice = basePrice;
        this.getPrice = getPrice;
        this.getEffect = getEffect;
        if(getDisplay !== undefined)
        {
            this.getEffectDisplay = getDisplay;
        }
        this.level = 0;

        this.elDiv = document.createElement("div");
        this.elDiv.innerHTML = "<span class='title'>" + this.name + "</span><br/>" + this.desc + "<br/>";

        this.elBuy = document.createElement("button");
        this.elBuy.onclick = e => 
        {
            this.buy();
            this.updateUI();
        }
        this.elDiv.appendChild(this.elBuy);

        this.elDiv.appendChild(document.createElement("br"));

        this.elEffect = document.createElement("span");
        this.elEffect.classList.add("effect")
        this.elDiv.appendChild(this.elEffect);

        parent.appendChild(this.elDiv);

        this.elDiv.classList.add("upgrade");

        this.updateUI();
    }

    getEffectDisplay()
    {
        return "x" + formatNumber(this.getEffect(this.level), settings.numberFormatType, 2) + 
            " => " + "x" + formatNumber(this.getEffect(this.level + 1), settings.numberFormatType, 2);
    }

    updateUI()
    {
        this.elBuy.innerHTML = "XP " + formatNumber(this.getPrice(this.level), settings.numberFormatType);
        this.elEffect.innerHTML = this.getEffectDisplay();
    }

    buy()
    {
        if(this.getPrice(this.level).lte(progression.xp))
        {
            progression.xp = progression.xp.sub(this.getPrice(this.level));
            this.level++;
        }
    }

    static apply(upgrade)
    {
        return upgrade.getEffect(upgrade.level);
    }
}