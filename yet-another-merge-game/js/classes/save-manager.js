class SaveManager {
    static F(v, keys) {
        let r = {};
        for (let k in v) {
            if (v.hasOwnProperty(k) && keys.includes(k)) {
                r[k] = v[k];
            }
        }
        return r;
    }

    static L(v, alt) {
        return v !== undefined ? v : alt;
    }

    static replacer(key, v) {
        let F = SaveManager.F;

        if (["floatingTexts", "saveTime", "spawnTime", "exportedGame", "time", "loading"].includes(key)) {
            return undefined;
        }
        if (v instanceof MergeObject) {
            let m = F(v, ["x", "y", "vx", "vy", "level"]);
            m.x = Math.round(m.x);
            m.y = Math.round(m.y);
            m.vx = Math.round(m.vx * 100) / 100;
            m.vy = Math.round(m.vy * 100) / 100;
            return m;
        }
        if (v instanceof Upgrade) {
            return F(v, ["level"]);
        }
        if (v instanceof EnergyCore) {
            return F(v, ["level", "merges", "locked", "isActive"]);
        }
        if (v instanceof ProcessorCore) {
            return F(v, ["level"]);
        }
        if (v instanceof Molecule) {
            return F(v, ["level", "merges"]);
        }

        if (v instanceof ContentPrestige) {
            if (!game.prestige.isUnlocked()) return undefined;
            return F(v, ["count", "quantumFoam", "highestQuantumFoam",
                "bankedQuantumFoam", "upgrades"]);
        }
        if (v instanceof ContentEnergyCores) {
            if (!game.energyCores.isUnlocked()) return undefined;
            return v;
        }
        if (v instanceof ContentIsotopes) {
            if (!game.isotopes.isUnlocked()) return undefined;
            return F(v, ["amount", "upgrades"]);
        }
        if (v instanceof ContentMolecules) {
            if (!game.molecules.isUnlocked()) return undefined;
            return F(v, ["amount", "moleculeIdx", "upgrades", "molecules"]);
        }
        return v;
    }

    static migrate(game, version) {
        if ((game.version < 2 || game.version === undefined) && version <= 2) {
            game.matter = {
                amount: game.matter, amountThisPrestige: game.amountThisPrestige,
                upgrades: game.upgrades
            };
            game.energyCores = { cores: game.energyCores };
            game.molecules = undefined;
            game.version = 2;
        }
    }

    static getSaveCode(obj) {
        obj = obj ? obj : game;
        return btoa(unescape(encodeURIComponent(JSON.stringify(obj, SaveManager.replacer))));
    }

    static saveGame() {
        localStorage.setItem("YetAnotherMergeGame", SaveManager.getSaveCode());
    }

    static loadGame(str) {
        let L = SaveManager.L;
        let obj;

        str = str ? str : localStorage.getItem("YetAnotherMergeGame");

        if (str || localStorage.getItem("MergeGame") !== null) {
            try {
                if (localStorage.getItem("MergeGame")) {
                    obj = JSON.parse(localStorage.getItem("MergeGame"));
                    localStorage.removeItem("MergeGame");
                    localStorage.removeItem("MergeGame_Version");
                }
                else {
                    obj = JSON.parse(atob(decodeURIComponent(escape((str)))));
                }
            }
            catch (e) {
                console.warn(e);
                return;
            }

            SaveManager.migrate(obj, 2);

            game.version = L(obj.version, 2);

            game.currentStyle = L(obj.currentStyle, "standard");
            //fallback to default style
            if (!["standard", "dark", "amoled"].includes(game.currentStyle)) {
                game.currentStyle = "standard";
            }
            functions.setStyle(game.currentStyle);

            game.clickAbility = L(obj.clickAbility, ABILITY_SPAWN_SPEED);

            game.settings.customNotationSequence = L(obj.settings.customNotationSequence, "");
            game.settings.currentNotationIdx = L(obj.settings.currentNotationIdx, 0);
            if (game.settings.customNotationSequence.length < 2 && game.settings.currentNotationIdx === -1) { //prevent broken notation
                game.settings.currentNotationIdx = 0;
            }
            if (game.settings.currentNotationIdx !== -1) {
                game.settings.currentNotation = notations[game.settings.currentNotationIdx];
            } else {
                game.settings.currentNotation = new ADNotations.CustomNotation(game.settings.customNotationSequence);
            }
            game.settings.clickParticles = L(obj.settings.clickParticles, true);
            game.settings.topBarShown = L(obj.settings.topBarShown, true);
            game.settings.tabsShown = L(obj.settings.tabsShown, true);
            game.settings.mergepediaAnimations = L(obj.settings.mergepediaAnimations, true);
            game.settings.prestigeConfirmation = L(obj.settings.prestigeConfirmation, true);
            game.settings.maxFps = L(obj.settings.maxFps, 60);
            game.settings.lowPerformanceMode = L(obj.settings.lowPerformanceMode, false);
            game.highestMergeObject = L(obj.highestMergeObject, 0);
            game.highestMergeObjectThisPrestige = L(obj.highestMergeObjectThisPrestige, 0);
            game.mergesThisPrestige = L(obj.mergesThisPrestige, 0);

            if (obj.matter) {
                game.matter.amount = L(new Decimal(obj.matter.amount), new Decimal(0));
                game.matter.amountThisPrestige = L(new Decimal(obj.matter.amountThisPrestige), new Decimal(0));

                if (obj.matter.upgrades) {
                    for (let k of Object.keys(obj.matter.upgrades)) {
                        game.matter.upgrades[k].setLevel(obj.matter.upgrades[k].level);
                    }
                }
            }
            else {
                game.matter = new ContentMatter();
            }

            if (obj.energyCores && obj.energyCores.cores) {
                for (let i = 0; i < Math.min(game.energyCores.cores.length, obj.energyCores.cores.length); i++) {
                    game.energyCores.cores[i].level = obj.energyCores.cores[i].level;
                    game.energyCores.cores[i].merges = obj.energyCores.cores[i].merges;
                    game.energyCores.cores[i].locked = obj.energyCores.cores[i].locked;
                    game.energyCores.cores[i].isActive = obj.energyCores.cores[i].isActive;
                }
            }
            else {
                game.energyCores = new ContentEnergyCores();
            }

            if (obj.prestige) {
                game.prestige.count = L(obj.prestige.count, 0);
                game.prestige.quantumFoam = L(new Decimal(obj.prestige.quantumFoam), new Decimal(0));
                game.prestige.bankedQuantumFoam = L(new Decimal(obj.prestige.bankedQuantumFoam), new Decimal(0));

                if (obj.prestige.highestQuantumFoam) {
                    game.prestige.highestQuantumFoam = new Decimal(obj.prestige.highestQuantumFoam);
                }

                if (obj.prestige.upgrades) {
                    for (let k of Object.keys(obj.prestige.upgrades)) {
                        game.prestige.upgrades[k].setLevel(obj.prestige.upgrades[k].level);
                    }
                }
            }
            else {
                game.prestige = new ContentPrestige();
            }

            if (obj.quantumProcessor) {
                game.quantumProcessor.cores = [];
                for (let core of obj.quantumProcessor.cores) {
                    let c = new ProcessorCore();
                    c.level = core.level;
                    game.quantumProcessor.cores.push(c);
                }
            }
            else {
                game.quantumProcessor = new ContentQuantumProcessors();
            }

            if (obj.isotopes) {
                game.isotopes.amount = L(new Decimal(obj.isotopes.amount), new Decimal(0));
                for (let k of Object.keys(obj.isotopes.upgrades)) {
                    game.isotopes.upgrades[k].setLevel(obj.isotopes.upgrades[k].level);
                }
            }
            else {
                game.isotopes = new ContentIsotopes();
            }

            if (obj.molecules) {
                game.molecules.load(obj.molecules);
            }
            else {
                game.molecules = new ContentMolecules();
            }

            game.mergeObjects = [];
            for (let m of obj.mergeObjects) {
                let mergeObject = new MergeObject(m.x, m.y, m.level);
                mergeObject.setVelocity(m.vx, m.vy);
                game.mergeObjects.push(mergeObject);
                globalEvents.addEventListener("gameinit", () => mergeObject.recalculateOutput(), {once: true});
            }

            globalEvents.dispatchGameLoad();
        }
    }
}