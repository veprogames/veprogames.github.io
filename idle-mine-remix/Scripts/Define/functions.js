var functions =
    {
        log: function(m)
        {
            console.log(m);
        },
        setTheme: function(t)
        {
            document.getElementById("css_theme").href = "Themes/" + t + ".css";
            game.settings.theme = t;
        },
        formatPercent: function (d, dig, limit)
        {
            d = new Decimal(d);
            limit = limit !== undefined ? limit : new Decimal(1e12);
            return functions.formatNumber(d.mul(100), dig !== undefined ? dig : 2, limit, dig !== undefined ? dig : 2) + "%";
        },
        formatThousands(d, limit, prec)
        {
            limit = limit !== undefined ? limit : new Decimal(1e12);
            prec = prec !== undefined ? prec : 0;
            d = new Decimal(d);
            if(d.gte(limit))
            {
                return game.numberFormatter.format(d);
            }
            return d.toNumber().toLocaleString("en-us", {minimumFractionDigits: prec, maximumFractionDigits: prec});
        },
        formatNumber: function(n, prec, limit, below1000)
        {
            n = new Decimal(n);

            let lim = limit !== undefined ? new Decimal(limit) : new Decimal(1000);
            below1000 = below1000 !== undefined ? below1000 : 0;
            let whitelist = ["Standard", "Scientific", "Engineering"];

            if(whitelist.includes(game.numberFormatter.name))
            {
                if(n.gt(lim))
                {
                    return game.numberFormatter.format(n, prec, below1000);
                }
                else
                {
                    if(n.lt(1000))
                    {
                        return functions.formatThousands(n, Infinity, below1000);
                    }
                    return functions.formatThousands(n, Infinity, 0);
                }
            }
            else
            {
                return game.numberFormatter.format(n, prec, below1000);
            }
        },
        setMineObjectLevel: function (lvl)
        {
            if(lvl >= 0 && lvl <= game.highestMineObjectLevel)
            {
                game.mineObjectLevel = lvl;
                game.currentMineObject = functions.getMineObject(game.mineObjectLevel);
            }
        },
        nextMineObjectLevel: function ()
        {
            functions.setMineObjectLevel(game.mineObjectLevel + 1);
        },
        prevMineObjectLevel: function ()
        {
            functions.setMineObjectLevel(game.mineObjectLevel - 1);
        },
        getHighestDamageableMineObjectLevel: function()
        {
            let idleDmg = functions.getIdleDamage(game.mineObjects[0]); //level 0 - 0 def
            let activeDmg = functions.getActiveDamage(game.mineObjects[0]);
            for(let i = Math.max(0, game.mineObjectLevel - 1); i < game.mineObjectLevel + 10; i++)
            {
                let def = functions.getMineObject(i).def;
                if(idleDmg.sub(def).lte(0) || activeDmg.sub(def).lte(0))
                {
                    return i - 1;
                }
            }
            return Number.MAX_SAFE_INTEGER;
        },
        adjustHighestMineObject: function()
        {
            let canDamage = functions.getIdleDamage(game.currentMineObject).gt(0) || functions.getActiveDamage(game.currentMineObject).gt(0);
            if(!canDamage && game.highestMineObjectLevel > game.mineObjectLevel)
            {
                game.highestMineObjectLevel = game.mineObjectLevel;
            }
        },
        getActiveDamage(obj)
        {
            obj = obj !== undefined ? obj : game.currentMineObject;
            return Decimal.max(0, game.pickaxe.getDamage().mul(applyUpgrade(game.upgrades.activePower)
                .mul(game.powers.data.values[POWER_MINING])
                .mul(applyUpgrade(game.powers.upgrades.damageBoostUpgrades)))
                .sub(obj.def)).add(functions.getIdleDPS(obj).mul(applyUpgrade(game.planetCoinUpgrades.activePower)));
        },
        getIdleDamage(obj)
        {
            obj = obj !== undefined ? obj : game.currentMineObject;
            return Decimal.max(0, (game.pickaxe.getDamage()
                .mul(applyUpgrade(game.upgrades.idlePower))
                .mul(game.powers.data.values[POWER_MINING])
                .mul(applyUpgrade(game.powers.upgrades.damageBoost))
                .mul(applyUpgrade(game.powers.upgrades.damageBoostUpgrades)))
                .sub(obj.def));
        },
        getIdleDPS: function ()
        {
            return functions.getIdleDamage().mul(applyUpgrade(game.upgrades.idleSpeed));
        },
        getMPC: function()
        {
            if(functions.getActiveDamage().lte(0))
            {
                return new Decimal(0);
            }
            let hitsToBreak = Math.ceil(game.currentMineObject.totalHp.div(functions.getActiveDamage()));
            return game.currentMineObject.value.div(hitsToBreak);
        },
        getMPS: function()
        {
            if(functions.getIdleDamage().lte(0))
            {
                return new Decimal(0);
            }
            let hitsToBreak = Math.ceil(game.currentMineObject.totalHp.div(functions.getIdleDamage()));
            return new Decimal(1 / hitsToBreak).mul(applyUpgrade(game.upgrades.idleSpeed)).mul(game.currentMineObject.value);
        },
        getGPS: function()
        {
            let spd = applyUpgrade(game.upgrades.idleSpeed);
            let hitsToBreak = Math.ceil(game.currentMineObject.totalHp.div(functions.getIdleDamage()).toNumber());
            let secToBreak = hitsToBreak / spd;
            let lastObjMulti = game.mineObjectLevel === functions.getHighestDamageableMineObjectLevel() ? applyUpgrade(game.planetCoinUpgrades.lastObjGems) : new Decimal(1);
            return new Decimal(1).div(secToBreak).mul(applyUpgrade(game.gemUpgrades.gemMultiply))
                .mul(applyUpgrade(game.upgrades.gemChance)).mul(lastObjMulti);
        },
        getPCPS: function()
        {
            if(game.currentMineObject.drops === {} || game.currentMineObject.drops.planetcoin === undefined)
            {
                return new Decimal(0);
            }
            let spd = applyUpgrade(game.upgrades.idleSpeed);
            let hitsToBreak = Math.ceil(game.currentMineObject.totalHp.div(functions.getIdleDamage()).toNumber());
            let secToBreak = hitsToBreak / spd;
            return new Decimal(1).div(secToBreak).mul(game.currentMineObject.drops.planetcoin.amount).mul(game.currentMineObject.drops.planetcoin.chance);
        },
        clickMineObject: function ()
        {
            game.currentMineObject.damage(functions.getActiveDamage());
            Vue.set(game.powers.data.values, POWER_MINING, game.powers.data.values[POWER_MINING].mul(applyUpgrade(game.powers.upgrades.powerPowerActive)));
        },
        generateMineObject(id)
        {
            let lastObj = game.mineObjects[game.mineObjects.length - 1];
            let lastId = game.mineObjects.length;
            for(let entry of game.specialMineObjects)
            {
                if(entry.index < id)
                {
                    lastObj = entry.obj;
                    lastId = entry.index + 1;
                }
            }

            //deltas
            let d = id - lastId + 1;
            let d2 = Math.max(id - lastId - 30, 0);

            let skinId, name, colorAmount, names, cfg = undefined;
            if(lastId < 115)
            {
                let maxSkinId = 16; //exclusive
                skinId = Math.floor(maxSkinId / 2 + maxSkinId / 2 * Math.sin(id * 751641));
                name = Utils.generateMineObjectName(id, 8);
                colorAmount = SKIN_LAYER_AMOUNTS[skinId];
                names = ["", "Salt", "Bone", "Bone", "Essence", "Orb", "Crystal", "", "", "", "", "", "", "Paper", "Gem", "Fractal"];
                name += names[skinId].length > 0 ? " " + names[skinId] : "";
            }
            else if(lastId < 214)
            {
                if(lastObj.drops.planetcoin !== undefined)
                {
                    let lastDrop = new Decimal(lastObj.drops.planetcoin.amount).mul(lastObj.drops.planetcoin.chance); //normalized
                    let newDrop = lastDrop.mul(Decimal.pow(1.45, d + d2 / 3));
                    let chance = 0.2 + 0.199 * Math.sin(id * 236454);
                    let amount = Decimal.round(newDrop.div(chance));
                    cfg = {drops: {planetcoin: {chance: chance, amount: amount}}};
                }

                let skinIdMin = 20, skinIdMax = 25; //max id is exclusive
                let idDelta = skinIdMax - skinIdMin;
                skinId = skinIdMin + Math.floor(idDelta / 2 + idDelta / 2 * Math.sin(id * 458612));
                colorAmount = SKIN_LAYER_AMOUNTS[skinId];
                name = Utils.seededChoose(7514 * id, ["HD", "HR"]) + " " + Math.floor(5000 + 4000 * Math.sin(id * 489621)) + "-" + Utils.seededChoose(4851 * id,  ["a", "b", "c", "d", "e", "f"]);
            }
            else
            {
                skinId = 35;
                colorAmount = 4;
                let rand = new Random(id);
                if(rand.nextDouble() < 0.3)
                {
                    let names = ["Cookie", "cook1ee", "Fish", "Pizza", "Math", "Fractal", "Idle", "Mine", "Remix", "Inverse", "Debug", "Reverse", "α", "β", "λ"];
                    name = names[rand.nextInt(names.length)] + "-Verse #" + rand.nextInt(10000);
                }
                else
                {
                    name = DICTIONARY_ENGLISH[Math.floor(rand.nextDouble() * DICTIONARY_ENGLISH.length)] + "-Verse #" + rand.nextInt(10000);
                }
                let base_pc = new Decimal(1e20), base_wisdom = new Decimal(1e15);
                let dropChance = rand.nextDouble();
                let dropDelta = Math.pow(id - 214, 1.1);
                if(id % 5 === 0)
                {
                    let wisdom = base_wisdom.mul(Decimal.pow(1.7, dropDelta));
                    cfg = {drops: {wisdom: {chance: dropChance, amount: wisdom.div(dropChance)}}};
                }
                else
                {
                    let pc = base_pc.mul(Decimal.pow(1.5, dropDelta));
                    if(id % 4 === 0)
                    {
                        pc = pc.mul(2);
                    }
                    cfg = {drops: {planetcoin: {chance: dropChance, amount: pc.div(dropChance)}}};
                }
            }

            let colors = [];
            for(let i = 0; i < colorAmount; i++)
            {
                colors.push(i === 0 ? (Math.sin(id * 75124) > -0.5 ? "black" : Utils.generateColor(id * 2 + 100)) : Utils.generateColor(id * i * i + 100));
            }

            let defDivisor = lastId < 114 ? 3.5 : 1; //the portal has very high def, migitate
            let worthIncrease = lastId < 140 ? 20 : 19;
            if(lastId > 214)
            {
                defDivisor = 10; //the universe has very high def, migitate
                worthIncrease = 9;
                d = Math.pow(d, 1.15); //scale faster and faster
            }
            //relation hp to worth = x ^ 1.53950185
            let mult = 1.5 + 0.5 * Math.sin(id * 21324); //some randomness
            let worthMult = Math.pow(mult, Math.log(worthIncrease) / Math.log(7));
            return new MineObject(name,
                Utils.roundBase(lastObj.hp.mul(Decimal.pow(7, d + d2 / 2)).mul(mult), 1),
                Utils.roundBase(lastObj.def.mul(Decimal.pow(7, d + d2 / 2)).div(defDivisor).mul(mult), 1),
                Utils.roundBase(lastObj.value.mul(Decimal.pow(worthIncrease, d + d2 / 2)).mul(worthMult), 1),
                colors, skinId, cfg);
        },
        getMineObject: function(id)
        {
            let index = game.specialMineObjects.findIndex(entry => entry.index === id);
            if(index !== -1)
            {
                return MineObject.create(game.specialMineObjects[index].obj);
            }
            return id < game.mineObjects.length ? MineObject.create(game.mineObjects[id]) : functions.generateMineObject(id);
        },
        logMessage: function (m, color)
        {
            color = color !== undefined ? color : "#000000";
            if (game.messageLog.length > 5)
            {
                game.messageLog.pop();
            }
            game.messageLog.splice(0, 0, {message: m, color: color});
        },
        getUsedGems()
        {
            return game.upgrades.gemWaster.getEffect(game.usedGemsLevel);
        },
        getMinCraftDamage: function()
        {
            return Pickaxe.craft(functions.getUsedGems(), true, 0).getDamage();
        },
        getAvgCraftDamage: function()
        {
            return Pickaxe.craft(functions.getUsedGems(), true).getDamage();
        },
        craftPick: function (gems)
        {
            gems = new Decimal(gems);
            let times = functions.keyPressed("Shift") ? applyUpgrade(game.planetCoinUpgrades.bulkCraft).toNumber() : 1;
            for(let i = 0; i < times; i++)
            {
                if (game.gems.gte(gems))
                {
                    game.gems = Decimal.round(game.gems.sub(gems));
                    let pick = Pickaxe.craft(gems);
                    if (pick.getDamage().gt(game.pickaxe.getDamage()))
                    {
                        game.pickaxe = pick;
                        functions.logMessage("Got a new Pickaxe! \"" + pick.name + "\"", MessageColors.success);
                        functions.saveGame();
                    }
                    else
                    {
                        functions.logMessage("Sorry, I crafted a dud! (P: " + game.numberFormatter.format(pick.pow, 2) +
                            ", Q: " + functions.formatPercent(pick.quality, 0) + ", Dmg: " + game.numberFormatter.format(pick.getDamage(), 2) + ")", MessageColors.error);
                    }
                }
                else
                {
                    functions.logMessage("Not enough Gems!", MessageColors.error);
                }
            }
        },
        getBoughtUpgrades: function(upgs)
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
        getNextStoryText: function()
        {
            for(let k of Object.keys(game.story.milestones))
            {
                if(!functions.storyUnlocked(k))
                {
                    if(typeof game.story.milestones[k][1] === "function")
                    {
                        return game.story.milestones[k][1]();
                    }
                    return game.story.milestones[k][1];
                }
            }
            return null;
        },
        storyUnlocked: function(key)
        {
            return eval(game.story.milestones[key][0]);
        },
        storyDisplayed: function(key) //is unlocked and page is right
        {
            return functions.storyUnlocked(key) && game.story.page === game.story.milestones[key][2];
        },
        getMaxStoryPage: function()
        {
            let maxPage = 3;
            let keys = Object.keys(game.story.milestones);
            for(let i = keys.length - 1; i >= 0; i--)
            {
                let storyObj = game.story.milestones[keys[i]];
                if(eval(storyObj[0]))
                {
                    maxPage = storyObj[2];
                    break;
                }
            }
            return maxPage;
        },
        increaseStoryPage: function()
        {
            let maxPage = functions.getMaxStoryPage();
            game.story.page = Math.min(game.story.page + 1, maxPage);
        },
        decreaseStoryPage: function()
        {
            game.story.page = Math.max(game.story.page - 1, 0);
        },
        refreshStoryNotifications: function()
        {
            let keys = Object.keys(game.story.milestones);
            for(let i = game.story.highestUnlocked + 1; i < keys.length; i++)
            {
                if(functions.storyUnlocked(keys[i]))
                {
                    game.story.highestUnlocked = i;
                    game.story.notifications++;
                }
            }
        },
        changeTab: function(tab)
        {
            if(game.settings.tab === "story")
            {
                game.story.scrollY = app.$refs.storymilestones.scrollTop;
            }

            game.settings.tab = tab;

            if(tab === "story")
            {
                game.story.notifications = 0;
                setTimeout( () =>
                {
                    app.$refs.storymilestones.scrollTop = game.story.scrollY;
                }, 30);
            }
            if(tab === "settings")
            {
                functions.refreshNumberSelect();
            }
        },
        refreshNumberSelect: function()
        {
            setTimeout(() =>
                {
                    app.$refs.numberformatselect.selectedIndex = game.numberFormatters.findIndex(f => f === game.numberFormatter)
                },
                50);
        },
        payUSDebt: function()
        {
            if(game.money.lt(22e12))
            {
                alert("You can't afford to pay off the debt right now.")
            }
            else
            {
                alert("You really tried. But then you noticed that it's just a game.");
                functions.logMessage("ERROR: Exception occurred while paying off US National debt: " +
                    "game money couldn't be converted to USD", MessageColors.error);
            }
        },
        getSaveString()
        {
            return btoa(escape(encodeURIComponent(JSON.stringify(game))));
        },
        saveGame: function()
        {
            game.lastActive = Date.now();
            localStorage.setItem("IdleMine", functions.getSaveString());
            functions.logMessage("Game Saved!", MessageColors.save);
        },
        exportGame()
        {
            game.settings.exportFieldString = functions.getSaveString();
        },
        loadGame: function(saveString, decode, nooffline)
        {
            let loadVal = function(v, alt)
            {
                return v !== undefined ? v : alt;
            };

            let str = saveString !== undefined ? saveString : localStorage.getItem("IdleMine");

            if(str !== null)
            {
                let decoded;
                try
                {
                    if(decode === undefined || decode)
                    {
                        decoded = unescape(decodeURIComponent(atob(str)));
                    }
                    else
                    {
                        decoded = str;
                    }
                }
                catch(e)
                {
                    alert("Error loading Game: " + e);
                }

                let loadObj = JSON.parse(decoded);

                game.money = loadVal(new Decimal(loadObj.money), new Decimal(0));
                game.highestMoney = loadVal(new Decimal(loadObj.highestMoney), new Decimal(0));
                game.gems = loadVal(new Decimal(loadObj.gems), new Decimal(5));
                game.planetCoins = loadVal(new Decimal(loadObj.planetCoins), new Decimal(0));
                game.maxPlanetCoins = loadVal(new Decimal(loadObj.maxPlanetCoins), new Decimal(0));
                game.wisdom = loadVal(new Decimal(loadObj.wisdom), new Decimal(0));
                game.maxWisdom = loadVal(new Decimal(loadObj.maxWisdom), new Decimal(0));
                game.mineObjectLevel = loadVal(loadObj.mineObjectLevel, 0);
                game.highestMineObjectLevel = loadVal(loadObj.highestMineObjectLevel, 0);
                game.currentMineObject = functions.getMineObject(game.mineObjectLevel);
                game.story.page = loadVal(loadObj.story.page, 0);
                game.story.notifications = loadVal(loadObj.story.notifications, 0);
                game.story.highestUnlocked = loadVal(loadObj.story.highestUnlocked, -1);
                game.story.scrollY = loadVal(loadObj.story.scrollY, 0);
                game.lastActive = loadVal(loadObj.lastActive, Date.now());

                if(loadObj.settings !== undefined)
                {
                    game.settings.numberFormatterIndex = loadVal(loadObj.settings.numberFormatterIndex, 0);
                    game.numberFormatter = game.numberFormatters[game.settings.numberFormatterIndex];
                    game.settings.theme = loadVal(loadObj.settings.theme, "light");
                    functions.setTheme(game.settings.theme);
                    game.settings.showMineObjLevel = loadVal(loadObj.settings.showMineObjLevel, false);
                    game.settings.showMinCraftDamage = loadVal(loadObj.settings.showMinCraftDamage, false);
                }
                if(loadObj.upgrades !== undefined)
                {
                    for(let k of Object.keys(loadObj.upgrades))
                    {
                        game.upgrades[k].level = loadObj.upgrades[k].level;
                    }
                }

                if(loadObj.gemUpgrades !== undefined)
                {
                    for(let k of Object.keys(loadObj.gemUpgrades))
                    {
                        game.gemUpgrades[k].level = loadObj.gemUpgrades[k].level;
                    }
                }
                else
                {
                    for(let k of Object.keys(game.gemUpgrades))
                    {
                        game.gemUpgrades[k].level = 0;
                    }
                }

                if(loadObj.planetCoinUpgrades !== undefined)
                {
                    for(let k of Object.keys(loadObj.planetCoinUpgrades))
                    {
                        game.planetCoinUpgrades[k].level = loadObj.planetCoinUpgrades[k].level;
                    }
                }
                else
                {
                    for(let k of Object.keys(game.planetCoinUpgrades))
                    {
                        game.planetCoinUpgrades[k].level = 0;
                    }
                }

                if(loadObj.powers !== undefined)
                {
                    if(loadObj.powers.data !== undefined)
                    {
                        for(let i = 0; i < loadObj.powers.data.values.length; i++)
                        {
                            game.powers.data.values[i] = loadVal(new Decimal(loadObj.powers.data.values[i]), new Decimal(1));
                        }
                    }
                    if(loadObj.powers.upgrades !== undefined)
                    {
                        for(let k of Object.keys(loadObj.powers.upgrades))
                        {
                            game.powers.upgrades[k].level = loadObj.powers.upgrades[k].level;
                        }
                    }
                    else
                    {
                        for(let k of Object.keys(game.powers.upgrades))
                        {
                            game.powers.upgrades[k].level = 0;
                        }
                    }
                }

                if(loadObj.pickaxe !== undefined)
                {
                    game.pickaxe.name = loadVal(loadObj.pickaxe.name, "Toy Pickaxe");
                    game.pickaxe.pow = loadVal(new Decimal(loadObj.pickaxe.pow), new Decimal(20));
                    game.pickaxe.quality = loadVal(new Decimal(loadObj.pickaxe.quality), new Decimal(1));
                }

                let now = Date.now();
                let offlineSec = (now - game.lastActive) / 1000;
                if(offlineSec > 300 && !nooffline)
                {
                    const offFactor = 0.5, maxOff = 3600 * (6 + applyUpgrade(game.planetCoinUpgrades.offlineTime).toNumber()); //x0.5 money for 6h
                    let moneyOff = functions.getMPS().mul(offFactor * Math.min(maxOff, offlineSec));
                    let gemsOff = Decimal.floor(functions.getGPS().mul(applyUpgrade(game.gemUpgrades.offlineGems).toNumber() * Math.min(maxOff, offlineSec)));
                    let pcoff = Decimal.floor(functions.getPCPS().mul(applyUpgrade(game.planetCoinUpgrades.offlinePC).toNumber() * Math.min(maxOff, offlineSec)));

                    let message = "Welcome back! While you were away, your Auto-Mining-Device earned you " +
                        functions.formatNumber(moneyOff, 2, 1e12, 0) + " $" +
                        (gemsOff.gt(0) ? (" and " + functions.formatNumber(gemsOff, 2, 1e12, 0) + " gem(s)") : "") + ".";
                    if(pcoff.gt(0))
                    {
                        message += " You also got " + functions.formatNumber(pcoff, 2, 1e12, 0) + " Planet Coins.";
                    }

                    functions.logMessage(message, MessageColors.offline);
                    game.money = game.money.add(moneyOff);
                    game.highestMoney = Decimal.max(game.money, game.highestMoney);
                    game.gems = game.gems.add(gemsOff);
                    game.planetCoins = game.planetCoins.add(pcoff);
                    game.maxPlanetCoins = Decimal.max(game.planetCoins, game.maxPlanetCoins);
                    game.lastActive = Date.now();
                    functions.saveGame();
                }
            }
        },
        hardReset: function()
        {
            for(let c = 3; c > 0; c--)
            {
                if(!confirm("Are you sure you want to ENTIRELY reset your savegame? YOu get no reward." +
                    "Click " + c + " more times to confirm"))
                {
                    return;
                }
            }
            localStorage.clear();
            functions.loadGame(initialGame, false, true);
            game.messageLog = [];
            game.usedGemsLevel = 0;
        },
        keyPressed: function(k)
        {
            return Utils.keyPressed(k)
        },
        applyUpgrade(upg)
        {
            return applyUpgrade(upg);
        }
    };