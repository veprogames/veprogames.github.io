function loadImage(path)
{
    let img = new Image();
    img.src = path;
    return img;
}

var images =
    {
        bg: loadImage("Images/bg.png"),
        progress: loadImage("Images/progress.png"),
        currencies:
            {
                quantumFoam: loadImage("Images/currencies/quantumfoam.png"),
                energyCores: loadImage("Images/tabs/energycores.png"),
                quantumProcessor: loadImage("Images/tabs/quantumprocessor.png"),
                isotopes: loadImage("Images/currencies/isotopes.png")
            }
    };

var bgMilestones =
    [
        {
            level: 0,
            fontColor: "#000000",
            topBarColor: "#009dff"
        },
        {
            level: 99,
            fontColor: "#000000",
            topBarColor: "#a0a0a0"
        },
        {
            level: 199,
            fontColor: "#ffffff",
            topBarColor: "#76ea8b"
        }
    ];

var game = 
{
    deltaTimeOld: Date.now(),
    deltaTimeNew: Date.now(),
    styles: 
    [
        ["standard", "Standard"],
        ["gradient", "Gradient"],
        ["dark", "Dark"],
        ["plastic", "Plastic"]
    ],
    currentStyle: "standard",
    notations:
        [
            new ADNotations.StandardNotation(),
            new ADNotations.ScientificNotation(),
            new ADNotations.EngineeringNotation(),
            new ADNotations.LettersNotation(),
            new ADNotations.CancerNotation()
        ],
    timeScale: 1,
    canvas:
    {
        ctx: null,
        w: null,
        h: null
    },
    floatingTexts: [],
    matter: new Decimal(0),
    matterThisPrestige: new Decimal(0),
    mergeObjects: [],
    highestMergeObject: 0,
    highestMergeObjectThisPrestige: 0,
    mergesThisPrestige: 0,
    mergePedia:
    {
        page: 0
    },
    saveTime: 
    {
        time: 5,
        cd: 0
    },
    spawnTime: 
    {
        time: 5,
        cd: 0
    },
    upgrades:
    {
        fasterSpawn: new Upgrade("Faster Spawn", "Mergers spawn faster",
                level => 
                {
                    let priceMult = level > 35 ? Decimal.pow(3, Math.pow(level - 35, 1.5)) : new Decimal(1);
                    return new Decimal(1e3).mul(Decimal.pow(3, Math.pow(level, 1.1))).mul(priceMult);
                },
                level =>
                {
                    return new Decimal(5 * Math.pow(0.975, Math.min(50, level)) / (1 + Math.max(0, level - 50) * 0.01));
                },
            {
                    getEffectDisplay: effectDisplayTemplates.numberStandard("", "s", 2)
                }
                ),
        betterObjects: new Upgrade("Better Mergers", "Mergers spawn one Tier higher",
                level => 
                {
                    let prices = [10e3, 50e3, 250e3, 1.5e6, 7.5e6, 35e6, 200e6, 1e9, 6e9, 33e9, 150e9, 750e9, 4e12, 20e12, 125e12, 500e12, 1e15];
                    if(level < prices.length)
                    {
                        return new Decimal(prices[level]);
                    }
                    let priceMult = [level > 151 ? Decimal.pow(1.5, Math.floor((level - 151) / 10)) : new Decimal(1),
                                    level > 500 ? Decimal.pow(1.75, Math.floor((level - 500) / 5)) : new Decimal(1)];
                    return new Decimal(prices[prices.length - 1]).mul(Decimal.pow(7, level - prices.length + 1)).mul(priceMult[0]).mul(priceMult[1]);
                },
                level =>
                {
                    return new Decimal(level);
                },
                {
                    getEffectDisplay: function()
                    {
                        return "#" + (this.level + 1).toFixed(0) + " → " +
                            "#" + (this.level + 2).toFixed(0);
                    },
                    onBuy: level => 
                    {
                        for(obj of game.mergeObjects)
                        {
                            if(obj.level < level)
                            {
                                obj.level = level;
                                obj.lifeTime = 0;
                            }
                        }
                        game.highestMergeObjectThisPrestige = Math.max(game.highestMergeObjectThisPrestige, level);
                        game.highestMergeObject = Math.max(game.highestMergeObject, level);
                    }
                }),
        maxObjects: new Upgrade("Max Objects", "Increase the Max Amount of Objects",
                level => 
                {
                    return (new Decimal(1e7).mul(Decimal.pow(10, level * level + level * 3))).pow(Decimal.pow(1.1, Math.max(level - 16, 0)));
                },
                level => 
                {
                    return Decimal.round(new Decimal(6 + level));
                },
                {
                    getEffectDisplay: effectDisplayTemplates.numberStandard("", "", 0),
                    maxLevel: 43
                }),
        matterOnMerge: new Upgrade("Matter on Merge", "Increase the Chance of getting bonus matter on Merge. (2 seconds of income)",
            level => new Decimal(1e18).mul(Decimal.pow(3e3, level)),
            level => new Decimal(0.02 * level),
            {
                getEffectDisplay: effectDisplayTemplates.percentStandard(),
                maxLevel: 10
            })
    },
    prestige: 
    {
        isUnlocked: () => game.matterThisPrestige.gt(1e15) || game.prestige.highestQuantumFoam.gt(0),
        count: 0,
        quantumFoam: new Decimal(0),
        bankedQuantumFoam: new Decimal(0), //determines the boost
        highestQuantumFoam: new Decimal(0),
        upgrades:
        {
            fasterMergers: new PrestigeUpgrade("Faster Mergers", "Mergers move Faster",
                level =>
                {
                    return new Decimal(20).mul(level + 1).mul(level > 10 ? Decimal.pow(1.1, level - 10) : 1);
                },
                level =>
                {
                    return new Decimal(1 + 0.05 * level);
                }, {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 25
                }),
            matterBoost: new PrestigeUpgrade("Matter Boost", "Boost Matter Production even further.",
                level =>
                {
                    return new Decimal(100).add(new Decimal(50).mul(Math.pow(level, 1.25)).mul(level > 10 ? Decimal.pow(1.25, level - 10) : 1));
                },
                level =>
                {
                    return new Decimal(1 + 0.3 * level).mul(level >= 4 ? Math.pow(level - 3, 0.25) : 1);
                },
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard()
                }),
            foamBoost: new PrestigeUpgrade("Quantum Foam Boost", "Get more Quantum Foam.",
                level =>
                {
                    return new Decimal(200).mul(Decimal.pow(1.5, level));
                },
                level =>
                {
                    return new Decimal(1 + 0.2 * level).add(level > 4 ? (level - 4) * 0.05 : 0);
                },
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard()
                }),
            headStart: new PrestigeUpgrade("Head Start", "Get free Matter on Prestige",
                level =>
                {
                    return new Decimal(500).mul(Decimal.pow(1.5, level)).mul(Decimal.pow(1.5, Math.max(level - 10, 0)));
                },
                level =>
                {
                    return level > 0 ? (new Decimal(10000).mul(Decimal.pow(50, level - 1))) : new Decimal(0);
                },{
                    getEffectDisplay: effectDisplayTemplates.numberStandard("", ""),
                    maxLevel: 100
                })
        },
        qfMilestones: //get times x quantum foam for reaching merger y
        [
            [29, 1.5],
            [36, 1.6],
            [49, 1.7],
            [69, 2.4],
            [189, 2.5],
            [249, 2.5]
        ]
    },
    energyCores:
    [
        new EnergyCore("Photon", new Decimal(50000),
            level =>
            {
                return 100 + 10 * level;
            },
            level => 
            {
                return new Decimal(2 + 0.4 * level).mul(Decimal.pow(1.07, level));
            }, "energycores/photon.png"),
        new EnergyCore("Neutrino", new Decimal(1e6),
            level =>
            {
                return 150 + 20 * level;
            },
            level => 
            {
                return new Decimal(2.25 + 0.75 * level).mul(Decimal.pow(1.15, level));
            }, "energycores/neutrino.png"),
        new EnergyCore("Gluon", new Decimal(500e6),
            level =>
            {
                return 200 + 50 * level;
            },
            level => 
            {
                return new Decimal(3 + 2 * level).mul(Decimal.pow(1.3, level));
            }, "energycores/gluon.png"),
        new EnergyCore("Electron", new Decimal(100e9),
            level =>
            {
                return 50 + Math.floor(Math.max(0, level - 150));
            },
            level =>
            {
                return new Decimal(2 + 0.1 * level).mul(Decimal.pow(1.015, level));
            }, "energycores/electron.png"),
        new EnergyCore("Muon", new Decimal(500e12),
            level =>
            {
                return 100 + 25 * level;
            },
            level =>
            {
                return new Decimal(3 + level).mul(Decimal.pow(1.175, level));
            }, "energycores/muon.png")
    ],
    quantumProcessor:
    {
        isUnlocked: () => game.prestige.highestQuantumFoam.gte(100e9),
        cores: [],
    },
    isotopes:
    {
        isUnlocked: () => game.quantumProcessor.cores.length >= 1,
        amount: new Decimal(0),
        upgrades:
        {
            isotopeChance: new IsotopeUpgrade("Isotope Chance", "Increase the Chance to get 1 Isotope",
                level => 
                {
                    let price = new Decimal(1 + level);
                    if(level > 10)
                    {
                        price = price.add(level - 10)
                    }
                    if(level > 25)
                    {
                        price = price.add((level - 25) * 2)
                    }
                    if(level > 50)
                    {
                        price = price.add((level - 25) * 4)
                    }
                    let priceMult = Decimal.pow(1.5, Math.max(0, 1 + Math.floor((level - 70) / 10)));
                    return price.mul(priceMult);
                },
                level => new Decimal(0.01 + 0.01 * level),
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 99
                }),
            doubleSpawn: new IsotopeUpgrade("Double Spawn", "Increase the Chance to spawn 2 Mergers",
                level => new Decimal(level + 5 + 10 * Math.floor(level / 10) + 15 * Math.floor(level / 20)),
                level => new Decimal((level > 0 ? 0.1 : 0) + 0.02 * Math.max(0, level - 1)),
                {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(),
                    maxLevel: 25
                }),
            matterBoost: new IsotopeUpgrade("Matter Boost", "Produce even more matter",
                level => new Decimal(100 + 125 * level),
                level => Decimal.pow(2, level),
                {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(),
                    maxLevel: 100
                })
        }
    },
    molecules:
    {
        unlocked: false,
        unlockPrice: new Decimal(2000),
        amount: new Decimal(0),
        productionUpgrades:
        {
            matter: new Upgrade("Matter", "Spend Matter to increase your Molecule Production",
                        level => Decimal.pow(10, 40 + 2 * level + Math.max(0, level - 50)),
                        level => Decimal.pow(4, level)),
            isotopes: new IsotopeUpgrade("Isotopes", "Spend Isotopes to increase your Molecule Production",
                        level => new Decimal(500 + 100 * level),
                        level => Decimal.pow(4, level)),
            molecules: new MoleculeUpgrade("Molecules", "Spend Molecules to increase your Molecule Production",
                        level => Decimal.pow(32, 4 + level + Math.max(0, level - 50)),
                        level => Decimal.pow(4, level))
        },
        upgrades:
        {
            isotopeBoost: new MoleculeUpgrade("Isotope Boost", "Get more Isotopes when Merging",
                        level => new Decimal(1e9).mul(Decimal.pow(16, level)),
                        level => new Decimal(1 + 0.02 * level),
                        {
                            getEffectDisplay: effectDisplayTemplates.percentStandard()
                        }),
            matterBoost: new MoleculeUpgrade("Matter Boost", "Boost Matter Production",
                        level => new Decimal(1e15).mul(Decimal.pow(16, level)),
                        level => new Decimal(1 + 0.05 * level),
                        {
                            getEffectDisplay: effectDisplayTemplates.percentStandard()
                        }),
            doubleIsotopes: new MoleculeUpgrade("x2 Isotopes", "Chance to reward 2 times as much Isotopes",
                        level => new Decimal(1e21).mul(Decimal.pow(64, level)),
                        level => new Decimal(0.01 * level),
                        {
                            getEffectDisplay: effectDisplayTemplates.percentStandard(),
                            maxLevel: 100
                        })
        }
    },
    tabs:
    [
        ["upgrades", "Upgrades", "true", "currencies/matter.png"],
        ["prestige", "Prestige", "game.prestige.isUnlocked()", "currencies/quantumfoam.png"],
        ["mergepedia", "Mergepedia", "true", "tabs/mergepedia.png"],
        ["energycores", "Energy Cores", "game.prestige.highestQuantumFoam.gte(20000)", "tabs/energycores.png"],
        ["quantumprocessor", "Quantum Processor", "game.quantumProcessor.isUnlocked()", "tabs/quantumprocessor.png"],
        ["isotopes", "Isotopes", "game.isotopes.isUnlocked()", "currencies/isotopes.png"],
        ["settings", "Settings", "true", "tabs/settings.png"],
        ["help", "Help", "true", "tabs/help.png"]
    ],
    helpTabs:
        [
            ["Introduction", "true"],
            ["Mergepedia", "true"],
            ["Prestige", "game.prestige.isUnlocked()"],
            ["Prestige Upgrades", "game.matterThisPrestige.gt(1e15) || game.prestige.highestQuantumFoam.gt(0)"],
            ["Energy Cores", "game.prestige.highestQuantumFoam.gte(20000)"],
            ["Quantum Processor", "game.quantumProcessor.isUnlocked()"],
            ["Isotopes", "game.isotopes.isUnlocked()"]
        ],
    settings: 
    {
        currentNotation: new ADNotations.StandardNotation(),
        currentNotationIdx: 0,
        customNotationSequence: "",
        currentTab: "upgrades",
        selectedTab: "",
        helpTab: 0,
        tabsShown: true,
        topBarShown: true
    },
    exportedGame: ""
};

var initialGame = JSON.stringify(game); //used for hard reset

var w, h;

var gameFunctions = 
{
    log(m)
    {
        console.log(m);
    },
    getBGData()
    {
        let mergerLvl = game.highestMergeObjectThisPrestige;
        let milestone;
        for(let m = 0; m < bgMilestones.length; m++)
        {
            if(mergerLvl >= bgMilestones[m].level)
            {
                milestone = bgMilestones[m];
                milestone.bgY = m * 768;
            }
        }
        return milestone;
    },
    isTabUnlocked(tab)
    {
        return eval(tab[2])
    },
    isHelpTabUnlocked(tab)
    {
        return eval(tab[1])
    },
    formatPercent(n, prec)
    {
        return n.mul(100).toFixed(prec ? prec : 0) + " %";
    },
    setStyle(name)
    {
        document.querySelector("#gamestyle").href = "Styles/style." + name + ".css";
        game.currentStyle = name;
    },
    formatNumber(x, forcePrec)
    {
        x = new Decimal(x);
        let prec;
        let name = game.settings.currentNotation.name;
        if(["Standard", "Cancer", "Engineering", "Letters"].includes(name))
        {
            prec = x.lt(1000) ? 0 : 2 - (x.e % 3);
        }
        else
        {
            prec = x.lt(1000) ? 0 : 2;
        }
        if(x.lt(1000))
        {
            return game.settings.currentNotation.formatUnder1000(x, forcePrec !== undefined ? forcePrec : 0);
        }
        return game.settings.currentNotation.formatDecimal(x, forcePrec !== undefined ? forcePrec : prec);
    },
    formatThousands(n)
    {
        if(["Standard", "Cancer", "Letters", "Greek Letters", "Engineering", "Scientific"].includes(game.settings.currentNotation.name) && n.lte(Math.pow(10, 9)))
        {
            return n.toNumber().toLocaleString("en-us", {minimumFractionDigits: 0, maximumFractionDigits: 0});
        }
        return gameFunctions.formatNumber(n);
    },
    setCustomNotation()
    {
        if(game.settings.customNotationSequence.length >= 2)
        {
            game.settings.currentNotation = new ADNotations.CustomNotation(game.settings.customNotationSequence);
            game.settings.currentNotationIdx = -1;
        }
        else
        {
            alert("The Sequence must be at least 2 characters long!");
        }
    },
    createFloatingText(text, x, y, vy, cfg)
    {
        game.floatingTexts.push(new FloatingText(text, x, y, vy, cfg));
    },
    outputForMergeObject(l)
    {
        return MergeObject.calculateOutputForLevel(l);
    },
    totalMatterPerSecond()
    {
        let total = new Decimal(0);

        for(let obj of game.mergeObjects)
        {
            total = total.add(obj.output);
        }

        return total;
    },
    colorForMergeObject(l)
    {
        return MergeObject.getColor(l);
    },
    mergePediaMinEntry(page)
    {
        return 26 * page;
    },
    mergePediaMaxEntry(page)
    {
        return Math.min(game.highestMergeObject + 1, 26 + 26 * page);
    },
    mergePediaMaxPage()
    {
        return Math.floor(game.highestMergeObject / 26);
    },
    mergePediaOnMaxPage()
    {
        return (game.mergePedia.page) === Math.floor(game.highestMergeObject / 26);
    },
    spawnRandomMergeObject(level)
    {
        let bound = 0.05;
        let x = game.canvas.w * bound + Math.random() * (game.canvas.w * (1 - 2 * bound));
        let y = game.canvas.h * bound + Math.random() * (game.canvas.h * (1 - 2 * bound));
        game.mergeObjects.push(new MergeObject(x, y, level));
    },
    decreaseSpawnCooldown(s)
    {
        if(game.mergeObjects.length < Upgrade.apply(game.upgrades.maxObjects).toNumber())
            game.spawnTime.cd += s;
    },
    maxUpgrades(resource, upgrades, percent)
    {
        percent = percent === undefined ? 100 : percent;

        let cheapestUpgrade;
        let checkNext = true;
        let resToUse = resource.mul(percent * 0.01);

        while(checkNext)
        {
            cheapestUpgrade = null;
            for(let k of Object.keys(upgrades))
            {
                if(upgrades[k].level >= upgrades[k].maxLevel)
                {
                    continue;
                }
                if(!cheapestUpgrade || upgrades[k].getCurrentPrice().lt(cheapestUpgrade.getCurrentPrice()))
                {
                    cheapestUpgrade = upgrades[k];
                }
            }

            if(cheapestUpgrade === null)
            {
                break;
            }

            checkNext = resToUse.gte(cheapestUpgrade.getCurrentPrice());

            if(resToUse.gte(cheapestUpgrade.getCurrentPrice()))
            {
                resToUse = resToUse.sub(cheapestUpgrade.getCurrentPrice());
                cheapestUpgrade.buy();
            }
        }
    },
    getQuantumFoam(matter)
    {
        if(matter.lt(1e16))
        {
            return new Decimal(0);
        }
        return new Decimal(25).add(Decimal.floor(Decimal.max(0, 25 * Decimal.log10(matter.div(1e16)))
                .mul(Decimal.pow(1.15, Math.max(0, Decimal.log10(matter.div(1e27)))))
                .mul(Decimal.pow(1.015, Math.max(0, Decimal.log10(matter.div(1e48)))))
                .mul(Decimal.pow(1.02, Math.max(0, Decimal.log10(matter.div(1e63)))))
                .mul(Upgrade.apply(game.prestige.upgrades.foamBoost)))
                .mul(gameFunctions.getQFMilestoneInfo().boost));
    },
    getQuantumFoamBoost()
    {
        return new Decimal(1).add(game.prestige.bankedQuantumFoam.mul(0.01));
    },
    prestigeGame()
    {
        let foamToGet = gameFunctions.getQuantumFoam(game.matterThisPrestige);

        if(foamToGet.gt(0) && confirm("Prestiging will remove bought Matter Upgrades and the current Matter you have. Are you sure?"))
        {
            game.prestige.quantumFoam = game.prestige.quantumFoam.add(foamToGet);
            game.prestige.bankedQuantumFoam = game.prestige.bankedQuantumFoam.add(foamToGet);
            
            game.mergeObjects = [];
            game.matter = Upgrade.apply(game.prestige.upgrades.headStart);
            game.matterThisPrestige = new Decimal(0);
            game.highestMergeObjectThisPrestige = 0;
            for(let k of Object.keys(game.upgrades))
            {
                game.upgrades[k].level = 0;
            }

            if(game.prestige.bankedQuantumFoam.gt(game.prestige.highestQuantumFoam))
            {
                game.prestige.highestQuantumFoam = game.prestige.quantumFoam;
            }

            game.prestige.count++;
            game.mergesThisPrestige = 0;

            gameFunctions.saveGame();
        }
    },
    getQFMilestoneInfo()
    {
        let b = new Decimal(1);
        let idx = 0;

        while(idx < game.prestige.qfMilestones.length && Math.round(game.highestMergeObjectThisPrestige) >= Math.round(game.prestige.qfMilestones[idx][0]))
        {
            b = b.mul(game.prestige.qfMilestones[idx][1]);
            idx++;
        }

        return{
            boost: b,
            nextMilestone: game.prestige.qfMilestones[idx],
        };
    },
    activateEnergyCore(core)
    {
        for(let c of game.energyCores)
        {
            c.isActive = false;
        }

        core.isActive = true;
    },
    getCoreBoost()
    {
        let boost = new Decimal(1);
        for(let c of game.energyCores)
        {
            if(!c.locked)
            {
                boost = boost.mul(c.getBoost(c.level));
            }
        }
        return boost;
    },
    checkCores()
    {
        for(let core of game.energyCores)
        {
            core.tryAddMerge();
        }
    },
    getProcessorCorePrice()
    {
        let len = game.quantumProcessor.cores.length;
        
        if(len < 5)
        {
            return [1e12, 1e16, 1e22, 1e29, 1e40][len];
        }
    },
    buyProcessorCore()
    {
        if(game.quantumProcessor.cores.length < 5 && game.prestige.quantumFoam.gte(gameFunctions.getProcessorCorePrice()))
        {
            if(confirm("Buying a Quantum Processor Core will boost all Matter production by x25," +
                "but current Matter, Matter Upgrades, Prestige Upgrades and Quantum Foam will be lost. Are you sure?"))
            {
                game.mergeObjects = [];
                game.matter = new Decimal(0);
                game.matterThisPrestige = new Decimal(0);
                game.highestMergeObjectThisPrestige = 0;
                game.quantumProcessor.cores.push(new ProcessorCore());
                game.prestige.quantumFoam = new Decimal(0);
                game.prestige.bankedQuantumFoam = new Decimal(0);
                for (let k of Object.keys(game.upgrades))
                {
                    game.upgrades[k].level = 0;
                }
                for (let k of Object.keys(game.prestige.upgrades))
                {
                    game.prestige.upgrades[k].level = 0;
                }
            }
        }
    },
    getProcessorBoost()
    {
        let boost = new Decimal(1);

        for(let core of game.quantumProcessor.cores)
        {
            boost = boost.mul(core.getCurrentBoost());
        }

        return boost;
    },
    unlockMolecules()
    {
        if(game.isotopes.amount.gte(game.molecules.unlockPrice))
        {
            game.isotopes.amount = game.isotopes.amount.sub(game.molecules.unlockPrice);
            game.molecules.unlocked = true;
        }
    },
    getMoleculeProduction()
    {
        if(!game.molecules.unlocked) return new Decimal(0);

        let multi = new Decimal(1);
        Object.keys(game.molecules.productionUpgrades).forEach(k => 
            {
                multi = multi.mul(game.molecules.productionUpgrades[k].getEffect(game.molecules.productionUpgrades[k].level));
            });
        return new Decimal(game.mergesThisPrestige).mul(multi);
    },
    initSettings()
    {
        setTimeout(() =>
            {
                if(app.$refs.select_format !== undefined && app.$refs.select_style !== undefined)
                {
                    app.$refs.select_format.selectedIndex = game.settings.currentNotationIdx !== -1 ? game.settings.currentNotationIdx : 0;
                    app.$refs.select_style.selectedIndex = game.styles.findIndex(s => s[0] === game.currentStyle);
                }
            }, 50);
    },
    saveGame()
    {
        localStorage.setItem("MergeGame_Version", "0.9-beta");
        localStorage.setItem("MergeGame", JSON.stringify(game));
    },
    loadVal(val, alternate)
    {
        return val !== undefined ? val : alternate;
    },
    loadGame(str)
    {
        if(str)
        {
            if(localStorage.getItem("MergeGame_Version") === null)
            {
                alert("Hi! The Game balance has been changed completely with this Update, so a hard reset is recommended. Of course you don't have to," +
                    "but the game experience should be better now :)");
            }

            let loadedGame = JSON.parse(str);

            game.currentStyle = this.loadVal(loadedGame.currentStyle, "standard");
            gameFunctions.setStyle(game.currentStyle);

            game.settings.customNotationSequence = this.loadVal(loadedGame.settings.customNotationSequence, "");
            game.settings.currentNotationIdx = this.loadVal(loadedGame.settings.currentNotationIdx, 0);
            if(game.settings.currentNotationIdx !== -1)
            {
                game.settings.currentNotation = game.notations[game.settings.currentNotationIdx];
            }
            else
            {
                game.settings.currentNotation = new ADNotations.CustomNotation(game.settings.customNotationSequence);
            }
            game.settings.tabsShown = this.loadVal(loadedGame.settings.tabsShown, true);
            game.highestMergeObject = this.loadVal(loadedGame.highestMergeObject, 0);
            game.highestMergeObjectThisPrestige = this.loadVal(loadedGame.highestMergeObjectThisPrestige, 0);
            game.mergesThisPrestige = this.loadVal(loadedGame.mergesThisPrestige, 0);

            game.matter = this.loadVal(new Decimal(loadedGame.matter), new Decimal(0));
            game.matterThisPrestige = this.loadVal(new Decimal(loadedGame.matterThisPrestige), new Decimal(0));

            game.mergeObjects = [];
            for(let obj of loadedGame.mergeObjects)
            {
                let mergeObject = new MergeObject(obj.x, obj.y, obj.level);
                mergeObject.setVelocity(obj.vx, obj.vy);
                game.mergeObjects.push(mergeObject);
            }

            if(loadedGame.upgrades)
            {
                for(let k of Object.keys(loadedGame.upgrades))
                {
                    game.upgrades[k].level = loadedGame.upgrades[k].level;
                }
            }

            if(loadedGame.prestige.upgrades)
            {
                for(let k of Object.keys(loadedGame.prestige.upgrades))
                {
                    game.prestige.upgrades[k].level = loadedGame.prestige.upgrades[k].level;
                }
            }

            if(loadedGame.energyCores)
            {
                for(let i = 0; i < Math.min(game.energyCores.length, loadedGame.energyCores.length); i++)
                {
                    game.energyCores[i].level = loadedGame.energyCores[i].level;
                    game.energyCores[i].merges = loadedGame.energyCores[i].merges;
                    game.energyCores[i].locked = loadedGame.energyCores[i].locked;
                    game.energyCores[i].isActive = loadedGame.energyCores[i].isActive;
                }
            }

            if(loadedGame.prestige)
            {
                game.prestige.count = this.loadVal(loadedGame.prestige.count, 0);
                game.prestige.quantumFoam = this.loadVal(new Decimal(loadedGame.prestige.quantumFoam), new Decimal(0));
                game.prestige.bankedQuantumFoam = this.loadVal(new Decimal(loadedGame.prestige.bankedQuantumFoam), new Decimal(0));

                if(loadedGame.prestige.highestQuantumFoam)
                {
                    game.prestige.highestQuantumFoam = new Decimal(loadedGame.prestige.highestQuantumFoam);
                }
            }

            if(loadedGame.quantumProcessor)
            {
                game.quantumProcessor.cores = [];
                for(let core of loadedGame.quantumProcessor.cores)
                {
                    let c = new ProcessorCore();
                    c.level = core.level;
                    game.quantumProcessor.cores.push(c);
                }
            }

            if(loadedGame.isotopes)
            {
                game.isotopes.amount = this.loadVal(new Decimal(loadedGame.isotopes.amount), new Decimal(0));
                for(let k of Object.keys(loadedGame.isotopes.upgrades))
                {
                    game.isotopes.upgrades[k].level = loadedGame.isotopes.upgrades[k].level;
                }
            }

            if(loadedGame.molecules)
            {
                game.molecules.amount = this.loadVal(new Decimal(loadedGame.molecules.amount), new Decimal(0));
                game.molecules.unlocked = this.loadVal(loadedGame.molecules.unlocked, false);
                if(loadedGame.molecules.productionUpgrades)
                {
                    for(let k of Object.keys(loadedGame.molecules.productionUpgrades))
                    {
                        game.molecules.productionUpgrades[k].level = loadedGame.molecules.productionUpgrades[k].level;
                    }
                }
                if(loadedGame.molecules.upgrades)
                {
                    for(let k of Object.keys(loadedGame.molecules.upgrades))
                    {
                        game.molecules.upgrades[k].level = loadedGame.molecules.upgrades[k].level;
                    }
                }
            }

            gameFunctions.initSettings();
        }
    },
    exportGame()
    {
        game.exportedGame = btoa(unescape(encodeURIComponent(JSON.stringify(game))));
    },
    importGame()
    {
        let code = prompt("Input save code", "...");
        if(code !== null)
        {
            let decode = atob(decodeURIComponent(escape(code)));
            gameFunctions.loadGame(decode);
        }
    },
    hardResetGame()
    {
        if(confirm("Do you REALLY want to reset absolutely everything you have reached so far"))
        {
            for(let i = 3; i > 0; i--)
            {
                if(!confirm("Click " + i.toFixed(0) + " more times to confirm"))
                {
                    return;
                }
            }

            gameFunctions.loadGame(initialGame);
            gameFunctions.saveGame();
            gameFunctions.initSettings();
        }
    }
};

Vue.component("merger",
    {
        data: function ()
        {
            return{
                innercolor: gameFunctions.colorForMergeObject(this.level).inner,
                outercolor: gameFunctions.colorForMergeObject(this.level).outer
            }
        },
        mounted: function()
        {
            let ctx = this.$refs.cnv.getContext("2d");
            MergeObject.renderMerger(ctx, 38, 38, 25, this.level, Math.pow(this.level, 1.05) * 10 + 10);
        },
        props: ["level"],
        template: `<canvas width="76" height="76" ref="cnv"></canvas>`
    }
    );

//38, 38, r 30
//76 x 76

var app = new Vue(
    {
        el: "#app",
        data: game,
        methods: gameFunctions,
        mounted: gameInit
    });

function gameInit()
{
    game.canvas.cnv = this.$refs.mergedisplay;
    game.canvas.cnv.height = innerHeight;
    game.canvas.cnv.width = innerHeight * 4 / 3;
    game.canvas.ctx = game.canvas.cnv.getContext("2d");
    game.canvas.w = game.canvas.cnv.width;
    game.canvas.h = game.canvas.cnv.height;
    w = game.canvas.w;
    h = game.canvas.h;

    for(let k of Object.keys(ADNotations))
    {
        if(!["BlindNotation", "BarNotation", "CustomNotation", "Notation", "Settings"].includes(k))
        {
            let notation = new ADNotations[k]();
            if(game.notations.findIndex(n => n.name === notation.name) === -1)
            {
                game.notations.push(new ADNotations[k]());
            }
        }
    }
    for(let k of Object.keys(ADCommunityNotations))
    {
        if(!["Notation", "Settings"].includes(k))
        {
            game.notations.push(new ADCommunityNotations[k]());
        }
    }

    gameFunctions.loadGame(localStorage.getItem("MergeGame"));

    if(isNaN(game.molecules.amount))
    {
        game.molecules.amount = new Decimal(0);
    }

    document.querySelector("#mergedisplay").onmousedown = e => gameFunctions.decreaseSpawnCooldown(0.075);

    requestAnimationFrame(gameUpdate);
}

function gameUpdate()
{
    game.deltaTimeNew = Date.now();
    let delta = Math.max(0, (game.deltaTimeNew - game.deltaTimeOld) / 1000 * game.timeScale);
    game.deltaTimeOld = Date.now();

    if(game.mergeObjects.length < Upgrade.apply(game.upgrades.maxObjects).toNumber())
    {
        game.spawnTime.cd += delta;
    }
    if(game.spawnTime.cd >= game.spawnTime.time)
    {
        let amount = 1 + (Math.random() < Upgrade.apply(game.isotopes.upgrades.doubleSpawn).toNumber() ? 1 : 0);
        for(let i = 0; i < amount; i++)
        {
            if(game.mergeObjects.length < Upgrade.apply(game.upgrades.maxObjects).toNumber())
            {
                gameFunctions.spawnRandomMergeObject(Upgrade.apply(game.upgrades.betterObjects).toNumber());
            }
        }
        game.spawnTime.cd = 0;
    }
    game.spawnTime.time = Upgrade.apply(game.upgrades.fasterSpawn).toNumber();

    game.saveTime.cd += delta;
    if(game.saveTime.cd > game.saveTime.time)
    {
        gameFunctions.saveGame();
        game.saveTime.cd = 0;
    }

    game.molecules.amount = game.molecules.amount.add(gameFunctions.getMoleculeProduction().mul(delta));

    for(let i = 0; i < game.mergeObjects.length; i++)
    {
        game.mergeObjects[i].tick(delta);
    }

    let ctx = game.canvas.ctx;

    let bgData = gameFunctions.getBGData();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, game.canvas.w, game.canvas.h);
    ctx.drawImage(images.bg, 0, bgData.bgY, 1024, 768, 0, 0, game.canvas.w, game.canvas.h);

    for(let i = 0; i < game.mergeObjects.length; i++)
    {
        game.mergeObjects[i].draw(ctx);
    }

    for(let text of game.floatingTexts)
    {
        text.tick(delta);

        if(text.lifeTime >= text.maxTime)
        {
            game.floatingTexts = game.floatingTexts.filter(v => text !== v);
        }

        text.draw(ctx);
    }

    let h = game.canvas.h;

    let baseHeight = h * 0.07;
    if(game.settings.topBarShown)
    {
        if(game.prestige.isUnlocked())
        {
            baseHeight = game.quantumProcessor.isUnlocked() ? h * 0.07 + w * 0.1 : h * 0.07 + w * 0.05;
            ctx.fillStyle = bgData.topBarColor;
            ctx.textAlign = "left";
            ctx.globalAlpha = 0.7;
            ctx.fillRect(0, 0, w, baseHeight - w * 0.025);
            ctx.globalAlpha = 1;
        }
        ctx.textBaseline = "middle";
        ctx.font = (w * 0.035) + "px Work Sans, Arial, sans-serif";
        ctx.fillStyle = "black";
        if(game.prestige.isUnlocked())
        {
            ctx.fillText("[" + gameFunctions.formatNumber(game.prestige.bankedQuantumFoam) + "] (+" + gameFunctions.formatNumber(gameFunctions.getQuantumFoam(game.matterThisPrestige)) +  ")", w * 0.08, h * 0.01 + w * 0.025, w * 0.4);
            ctx.drawImage(images.currencies.quantumFoam, w * 0.025, h * 0.01, w * 0.05, w * 0.05);
        }
        if(game.prestige.highestQuantumFoam.gte(20000))
        {
            ctx.drawImage(images.currencies.energyCores, w * 0.525, h * 0.01, w * 0.05, w * 0.05);
            ctx.fillText("x" + gameFunctions.formatNumber(gameFunctions.getCoreBoost()), w * 0.58, h * 0.01 + w * 0.025, w * 0.4);
        }
        if(game.quantumProcessor.isUnlocked())
        {
            ctx.drawImage(images.currencies.quantumProcessor, w * 0.025, h * 0.01 + w * 0.06, w * 0.05, w * 0.05);
            ctx.fillText(game.quantumProcessor.cores.length.toFixed(0) + " [x" + gameFunctions.formatNumber(gameFunctions.getProcessorBoost()) + "]", w * 0.08, h * 0.01 + w * 0.085, w * 0.4);
        }
        if(game.isotopes.isUnlocked())
        {
            ctx.drawImage(images.currencies.isotopes, w * 0.525, h * 0.01 + w * 0.06, w * 0.05, w * 0.05);
            ctx.fillText(gameFunctions.formatThousands(game.isotopes.amount), w * 0.58, h * 0.01 + w * 0.085, w * 0.4);
        }
    }

    //matter text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = (h * 0.0625) + "px Work Sans, Arial, sans-serif";
    ctx.fillStyle = bgData.fontColor;
    ctx.fillText(gameFunctions.formatNumber(game.matter), game.canvas.w / 2, baseHeight, w / 2.1);

    //matter per second
    ctx.font = (h * 0.031) + "px Work Sans, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("+ " + gameFunctions.formatNumber(gameFunctions.totalMatterPerSecond()) + "/s", w * 0.75, baseHeight + h * 0.005, w / 4.15);

    //spawn pbar
    let pxProgress = Math.max(1, game.canvas.w * game.spawnTime.cd / game.spawnTime.time); //amount of pixels on x axis
    ctx.fillStyle = "#00000040";
    ctx.fillRect(0, baseHeight + h * 0.03, game.canvas.w, h * 0.036);
    let pxProgressSource = Math.max(1, Math.floor(game.spawnTime.cd / game.spawnTime.time * 1024));
    ctx.drawImage(images.progress, 0, 0, pxProgressSource, images.progress.height,
                        0, baseHeight + h * 0.03, pxProgress, h * 0.036);

    //spawn cd timer
    ctx.fillStyle = bgData.fontColor;
    ctx.font = (h * 0.034) + "px Work Sans, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText((game.spawnTime.time - game.spawnTime.cd).toFixed(1) + "s", game.canvas.w * 0.99, baseHeight + h * 0.1);

    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(game.mergeObjects.length.toFixed(0) + " / " + game.upgrades.maxObjects.getEffect(game.upgrades.maxObjects.level).toFixed(0), w * 0.5, baseHeight + h * 0.1);

    requestAnimationFrame(gameUpdate);
}