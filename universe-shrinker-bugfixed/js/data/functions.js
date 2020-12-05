var functions = {
    getRhoProduction: function()
    {
        let sum = new Decimal(1); //to give a start
        for(let sh of game.shrinkers)
        {
            sum = sum.add(sh.getProductionPS());
        }
        return sum;
    },
    getTotalShrinkPower: function()
    {
        let shrinkPow = new Decimal(1);
        for(let sh of game.shrinkers)
        {
            shrinkPow = shrinkPow.mul(sh.getShrinkPower());
        }
        return shrinkPow;
    },
    totalShrinkersBought()
    {
        let sum = 0;
        for(let sh of game.shrinkers)
        {
            sum += sh.level;
        }
        return sum;
    },
    universeLayersUnlocked: function()
    {
        return Object.keys(game.universeLayers).length;
    },
    generateUniverseLayer(name)
    {
        game.universeLayers[name] = new Universelayer(name, game.resources[name]);
    },
    formatNumber: function(n, prec, prec1000, lim = new Decimal(0))
    {
        n = new Decimal(n);
        if(n.lt(0)) return "-" + this.formatNumber(n.mul(-1), prec, prec1000, lim);
        if(n.eq(0)) return "0";
        if(n.abs().lt(lim))
        {
            return n.toNumber().toLocaleString("en-us", {maximumFractionDigits: prec1000, minimumFractionDigits: 0});
        }
        if(n.lt(0.01))
        {
            return "1/" + this.formatNumber(new Decimal(1).div(n), prec, prec1000, lim);
        }
        return game.settings.numberFormatter.format(n, prec, prec1000);
    },
    formatLength: function(n, prec)
    {
        let pl = PLANCK_LENGTH;
        let ly = new Decimal(9.46e15);
        if(n.lt(pl.mul(1e9)))
        {
            let unit = n.eq(pl) ? "Planck Length" : "Planck Lengths";
            return this.formatNumber(n.div(pl), prec, prec, 1e9) + " " + unit;
        }
        else if(n.gte(ly.div(10)))
        {
            return this.formatNumber(n.div(ly), prec, prec, 1e9) + " Ly";
        }
        return this.formatNumber(n, prec, prec) + " m";
    },
    changeUniverseLevel: function(lvl)
    {
        if(game.currentUniverseLevel <= game.highestUniverseLevel)
        {
            game.currentUniverseLevel = lvl;
            game.universe = game.universes[lvl];
        }
    },
    increaseUniverseLevel: function()
    {
        this.changeUniverseLevel(game.currentUniverseLevel + 1);
    },
    decreaseUniverseLevel: function()
    {
        this.changeUniverseLevel(game.currentUniverseLevel - 1);
    },
    maxAll: function()
    {
        if(game.settings.tab === "shrinkers")
        {
            for(let sh of game.shrinkers)
            {
                sh.buyMax();
            }
        }
        if(game.settings.tab === "rhoupgrades")
        {
            for(let k in game.rhoUpgrades)
            {
                if(game.rhoUpgrades.hasOwnProperty(k))
                {
                    game.rhoUpgrades[k].buyMax();
                }
            }
        }
        if(game.settings.tab === "universelayers")
        {
            for(let k in game.universeLayers)
            {
                if(game.universeLayers.hasOwnProperty(k))
                {
                    for(let upg of game.universeLayers[k].upgrades)
                    {
                        upg.buyMax();
                    }
                }
            }
        }
    },
    setTheme(theme)
    {
        document.getElementById("theme").href = "css/themes/" + theme;
        game.settings.theme = theme;
    },
    saveGame: function()
    {
        let str = btoa(unescape(encodeURIComponent(JSON.stringify(game))));
        localStorage.setItem("UniverseShrinkerGameSave", str);
    },
    loadGame: function()
    {
        let loadVal = function(v, alt)
        {
            return v !== undefined ? v : alt;
        }

        let item = localStorage.getItem("UniverseShrinkerGameSave");
        if(item !== null)
        {
            let obj = JSON.parse(decodeURIComponent(escape(atob(item))));
            game.rhoParticles = loadVal(new Decimal(obj.rhoParticles), new Decimal(0));
            game.currentUniverseLevel = loadVal(obj.currentUniverseLevel, 0);
            game.highestUniverseLevel = loadVal(obj.highestUniverseLevel, 0);
            functions.changeUniverseLevel(game.currentUniverseLevel);
            game.universe.size = loadVal(new Decimal(obj.universe.size), new Decimal(0))
            game.settings.formatterIndex = loadVal(obj.settings.formatterIndex, 0);
            game.settings.numberFormatter = numberFormatters[game.settings.formatterIndex];
            game.settings.theme = loadVal(obj.settings.theme, "light.css");
            functions.setTheme(game.settings.theme);
            for(let k in obj.rhoUpgrades)
            {
                if(obj.rhoUpgrades.hasOwnProperty(k))
                {
                    game.rhoUpgrades[k].level = obj.rhoUpgrades[k].level;
                }
            }
            for(let i = 0; i < obj.shrinkers.length; i++)
            {
                game.shrinkers[i].level = obj.shrinkers[i].level;
            }
            for(let k in obj.resources)
            {
                if(obj.resources.hasOwnProperty(k))
                {
                    game.resources[k] = new UniverseResource(obj.resources[k].name);
                    game.resources[k].amount = new Decimal(obj.resources[k].amount);
                    game.resources[k].totalAmount = new Decimal(obj.resources[k].totalAmount);
                    game.resources[k].maxAmount = new Decimal(obj.resources[k].maxAmount);
                }
            }
            for(let k in obj.universeLayers)
            {
                if(obj.universeLayers.hasOwnProperty(k))
                {
                    game.universeLayers[k] = new Universelayer(obj.universeLayers[k].name, game.resources[k]);
                    for(let i = 0; i < obj.universeLayers[k].upgrades.length; i++)
                    {
                        game.universeLayers[k].upgrades[i].level = obj.universeLayers[k].upgrades[i].level;
                    }
                }
            }
        }
    }
};