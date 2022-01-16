let functions =
{
    log(m) {
        console.log(m);
    },
    isTabUnlocked(tab) {
        return eval(tab[2]);
    },
    isHelpTabUnlocked(tab) {
        return eval(tab[1]);
    },
    formatPercent(n, prec) {
        return n.mul(100).toFixed(prec ? prec : 0) + " %";
    },
    setStyle(name) {
        for (const el of Array.from(document.querySelectorAll("style[id*=less]"))) {
            document.head.removeChild(el);
        }
        document.getElementById("gamestyle").href = `css/style.${name}.less`;
        game.currentStyle = name;
        less.refresh();
    },
    formatNumber(x, forcePrec = false, forcePrecLim = 0, lim = 1000000) {
        x = new Decimal(x);
        let prec, precLim;
        let name = game.settings.currentNotation.name;
        if (forcePrec !== false) {
            prec = forcePrec;
        } else if (["Standard", "Cancer", "Engineering", "Letters"].includes(name)) {
            prec = x.lt(1000) ? 0 : 2 - (x.e % 3);
        } else {
            prec = x.lt(1000) ? 0 : 2;
        }
        precLim = forcePrecLim !== false ? forcePrecLim : prec;
        if (x.lt(lim)) {
            if(numberLocale.resolvedOptions().maximumFractionDigits !== precLim) {
                numberLocale = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: precLim });
            }
            return numberLocale.format(x.toNumber());
        }
        return game.settings.currentNotation.formatDecimal(x, prec);
    },
    formatThousands(n) {
        if (n instanceof Decimal) {
            n = n.toNumber();
        }
        if (["Standard", "Cancer", "Letters", "Greek Letters", "Engineering", "Scientific"].includes(game.settings.currentNotation.name) && n < Math.pow(10, 9)) {
            return n.toLocaleString("en-us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
        return functions.formatNumber(n);
    },
    createFloatingText(text, x, y, vy, cfg) {
        game.floatingTexts.push(new FloatingText(text, x, y, vy, cfg));
    },
    colorForMergeObject(l) {
        return MergeObject.getColor(l);
    },
    spawnRandomMergeObject(level) {
        let bound = 0.05;
        let x = w * bound + Math.random() * (w * (1 - 2 * bound));
        let y = h * bound + Math.random() * (h * (1 - 2 * bound));
        game.mergeObjects.push(new MergeObject(x, y, level));
    },
    decreaseSpawnCooldown(s) {
        if (game.mergeObjects.length < Upgrade.apply(game.matter.upgrades.maxObjects).toNumber())
            game.spawnTime.cd += s;
    },
    maxUpgrades(resource, upgrades, percent) {
        percent = percent === undefined ? 100 : percent;

        let cheapestUpgrade;
        let checkNext = true;
        let resToUse = resource.mul(percent * 0.01);

        while (checkNext) {
            cheapestUpgrade = null;
            for (let k of Object.keys(upgrades)) {
                if (upgrades[k].level >= upgrades[k].maxLevel) {
                    continue;
                }
                if (!cheapestUpgrade || upgrades[k].getCurrentPrice().lt(cheapestUpgrade.getCurrentPrice())) {
                    cheapestUpgrade = upgrades[k];
                }
            }

            if (cheapestUpgrade === null) {
                break;
            }

            checkNext = resToUse.gte(cheapestUpgrade.getCurrentPrice());

            if (resToUse.gte(cheapestUpgrade.getCurrentPrice())) {
                resToUse = resToUse.sub(cheapestUpgrade.getCurrentPrice());
                cheapestUpgrade.buy();
            }
        }
    }
};