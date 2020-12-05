var functions = {
    getRhoProduction: function()
    {
        let sum = new Decimal(game.thetaUpgrades.rhoBoost.apply()); //to give a start
        for(let sh of game.shrinkers)
        {
            sum = sum.add(sh.getProductionPS());
        }
        return sum;
    },
    getTotalShrinkPower: function(universe = game.universe)
    {
        let shrinkPow = new Decimal(1);
        for(let sh of game.shrinkers)
        {
            shrinkPow = shrinkPow.mul(sh.getShrinkPower(universe));
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
        if(ADNotations.Settings.isInfinite(n))
        {
            return "ee" + Math.log10(Decimal.log10(n)).toFixed(prec);
        }
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
    formatTime: function(s)
    {
        return [Math.floor(s / 3600).toString().padStart(2, "0"),
            (Math.floor(s / 60) % 60).toString().padStart(2, "0"),
            (Math.floor(s) % 60).toString().padStart(2, "0")].join(":");
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
    maxShrinkers: function()
    {
        for(let i = game.shrinkers.length - 1; i >= 0; i--)
        {
            game.shrinkers[i].buyMax();
        }
    },
    maxRhoUpgrades: function()
    {
        for(let k in game.rhoUpgrades)
        {
            if(game.rhoUpgrades.hasOwnProperty(k))
            {
                game.rhoUpgrades[k].buyMax();
            }
        }
    },
    maxUniverseLayers: function()
    {
        let keys = game.settings.maxAllLayers ? Object.keys(game.universeLayers) : [game.settings.universeTab];
        for(let k of keys)
        {
            if(game.universeLayers.hasOwnProperty(k))
            {
                for(let upg of game.universeLayers[k].upgrades)
                {
                    upg.buyMax();
                }
            }
        }
    },
    maxAll: function()
    {
        if(game.thetaUpgrades.maxAllUnify.apply() && game.settings.maxAllTabs)
        {
            this.maxShrinkers();
            this.maxRhoUpgrades();
            this.maxUniverseLayers();
        }
        else
        {
            if(game.settings.tab === "shrinkers")
            {
                this.maxShrinkers();
            }
            if(game.settings.tab === "rhoupgrades")
            {
                this.maxRhoUpgrades()
            }
            if(game.settings.tab === "universelayers")
            {
                this.maxUniverseLayers();
            }
        }
    },
    setTheme(theme)
    {
        document.getElementById("theme").href = "css/themes/" + theme;
        game.settings.theme = theme;
    },
    getTotalUpgradeLevels: function(upgs)
    {
        let sum = 0;
        for(let k in upgs)
        {
            if(upgs.hasOwnProperty(k))
            {
                sum += upgs[k].level;
            }
        }
        return sum;
    },
    getSaveCode: function()
    {
        return btoa(unescape(encodeURIComponent(JSON.stringify(game))));
    },
    saveGame: function()
    {
        let str = this.getSaveCode();
        localStorage.setItem("UniverseShrinkerGameSave", str);
    },
    exportGame: function()
    {
        game.settings.exportString = this.getSaveCode();
    },
    loadGame: function(importString)
    {
        let loadVal = function(v, alt)
        {
            return v !== undefined ? v : alt;
        }

        let item = importString !== undefined ? importString : localStorage.getItem("UniverseShrinkerGameSave");
        if(item !== null)
        {
            let obj;
            try
            {
                obj = JSON.parse(decodeURIComponent(escape(atob(item))));
            }
            catch(e)
            {
                alert("Error loading Game: " + e);
                return;
            }
            game.rhoParticles = loadVal(new Decimal(obj.rhoParticles), new Decimal(0));
            game.thetaEnergy = loadVal(new Decimal(obj.thetaEnergy), new Decimal(0));
            game.totalThetaEnergy = loadVal(new Decimal(obj.totalThetaEnergy), new Decimal(0));
            game.thetaSpentOnUpgrades = loadVal(new Decimal(obj.thetaSpentOnUpgrades), new Decimal(0));
            game.timesHeatDeath = loadVal(obj.timesHeatDeath, 0);
            game.ngMinus = loadVal(obj.ngMinus, 0);
            game.timeSpent = loadVal(obj.timeSpent, 0);
            game.currentUniverseLevel = loadVal(obj.currentUniverseLevel, 0);
            game.highestUniverseLevel = loadVal(obj.highestUniverseLevel, 0);
            functions.changeUniverseLevel(game.currentUniverseLevel);
            for(let i = 0; i < obj.universes.length; i++)
            {
                game.universes[i].size = new Decimal(obj.universes[i].size);
            }
            game.universe.size = loadVal(new Decimal(obj.universe.size), new Decimal(0));
            game.settings.formatterIndex = loadVal(obj.settings.formatterIndex, 0);
            game.settings.maxAllTabs = loadVal(obj.settings.maxAllTabs, true);
            game.settings.maxAllLayers = loadVal(obj.settings.maxAllLayers, true);
            game.settings.numberFormatter = numberFormatters[game.settings.formatterIndex];
            game.settings.universeTab = loadVal(obj.settings.universeTab, "Universe");
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
            game.resources = {};
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
            if(importString !== undefined)
            {
                game.universeLayers = {};
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
            if(obj.thetaUpgrades !== undefined)
            {
                for(let k in obj.thetaUpgrades)
                {
                    if(obj.thetaUpgrades.hasOwnProperty(k))
                    {
                        game.thetaUpgrades[k].level = obj.thetaUpgrades[k].level;
                    }
                }
            }
            if(obj.automators !== undefined)
            {
                for(let i = 0; i < obj.automators.length; i++)
                {
                    game.automators[i].level = obj.automators[i].level;
                    game.automators[i].active = obj.automators[i].active;
                }
            }
        }
    },
    hardReset: function()
    {
        let times = 3;
        do
        {
            if(!confirm("Are you really sure? You will lose everything. There is no reward!\nClick " + times + " more Times to hard reset."))
            {
                break;
            }
            times--;
        } while(times > 0)
        if(times === 0)
        {
            localStorage.clear();
            this.loadGame(initialGame);
            this.saveGame();
            game.settings.tab = "shrinkers";
            game.settings.universeTab = "Universe";
        }
    }
};