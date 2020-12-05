Vue.component("theta-layer", {
    data: function()
    {
        return {
            upgrades: game.thetaUpgrades
        }
    },
    methods:
        {
            formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
            getPrestigeAmount: function()
            {
                if(!game.resources.Omniverse || game.resources.Omniverse.totalAmount.lt(1024))
                {
                    return new Decimal(0);
                }
                return (game.resources.Omniverse.totalAmount.div(1024)).pow(0.3).mul(game.thetaUpgrades.thetaBoost.apply()).floor();
            },
            reset: function()
            {
                game.rhoParticles = new Decimal(0);
                for(let sh of game.shrinkers)
                {
                    sh.level = 0;
                }
                for(let k in game.rhoUpgrades)
                {
                    if(game.rhoUpgrades.hasOwnProperty(k))
                    {
                        game.rhoUpgrades[k].level = 0;
                    }
                }
                for(let k in game.resources)
                {
                    if(game.resources.hasOwnProperty(k))
                    {
                        game.resources[k].amount = new Decimal(0);
                        game.resources[k].totalAmount = new Decimal(0);
                        game.resources[k].maxAmount = new Decimal(0);
                    }
                }
                for(let k in game.universeLayers)
                {
                    if(game.universeLayers.hasOwnProperty(k))
                    {
                        for(let upg of game.universeLayers[k].upgrades)
                        {
                            upg.level = 0;
                        }
                    }
                }
                for(let u of game.universes)
                {
                    u.size = u.maxSize;
                }
                if(!game.thetaUpgrades.retainUniverseLevel.apply())
                {
                    functions.changeUniverseLevel(0);
                    game.highestUniverseLevel = 0;
                }
            },
            prestige: function()
            {
                if(this.getPrestigeAmount().gte(1))
                {
                    game.thetaEnergy = game.thetaEnergy.add(this.getPrestigeAmount());
                    game.totalThetaEnergy = game.totalThetaEnergy.add(this.getPrestigeAmount());
                    game.timesHeatDeath++;
                    this.reset();
                }
            },
            respec: function()
            {
                game.thetaEnergy = game.thetaEnergy.add(game.thetaSpentOnUpgrades);
                game.thetaSpentOnUpgrades = new Decimal(0);
                for(let k in this.upgrades)
                {
                    if(this.upgrades.hasOwnProperty(k))
                    {
                        this.upgrades[k].level = 0;
                    }
                }
                this.reset();
            },
            totalOmniverse: () => game.resources["Omniverse"] ? game.resources.Omniverse.totalAmount : new Decimal(0)
        },
    computed:
        {
            thetaEnergy: () => game.thetaEnergy,
            thetaEnergyTotal: () => game.totalThetaEnergy,
            showGoal: () => game.totalThetaEnergy.mul(1e15).gte(game.thetaGoal),
            thetaGoal: () => game.thetaGoal,
            hasUpgradesBought: function()
            {
                return functions.getTotalUpgradeLevels(this.upgrades) > 0;
            }
        },
    template: `<div class="theta-layer">
<p>You have <span class="big">{{formatNumber(thetaEnergy, 2, 2, 1e9)}}</span> Theta Energy (&theta;<sub>E</sub>)</p>
<p v-if="showGoal">You are close! Heat Death every Atom to Shrink and Dematerialize everything and win the Game!<br/>
<span class="big">{{formatNumber(thetaEnergyTotal, 2, 2, 1e9)}} &theta;<sub>E</sub> / {{formatNumber(thetaGoal, 2, 2, 1e9)}} &theta;<sub>E</sub></span></p>
<div class="reset">
    <button @click="prestige()" :disabled="getPrestigeAmount().lt(1)">
        <span v-if="totalOmniverse().gt(1024)">Heat Death everything and gain<br/>
        {{formatNumber(getPrestigeAmount(), 2, 2, 1e9)}} &theta;<sub>E</sub></span>
        <span v-else>You need to shrink a total of 1.024 Omniverses to Heat Death<br/>({{formatNumber(totalOmniverse(), 2, 0)}} / 1.024)</span></button>
    <p>Heat Death resets all progress you made so far, but you will get &theta;<sub>E</sub> in return.</p>
</div>
<p>Buying Theta Upgrades will increase the Price of several other Theta Upgrades. Choose wisely!</p>
<upgrade-container :upgrades="upgrades"></upgrade-container>
<div class="reset">
    <button @click="respec()" :disabled="!hasUpgradesBought">Respec</button>
    <p>Messed up? No worries, Respec to get all spent &theta;<sub>E</sub> back, but you do a Heat Death without gaining &theta;<sub>E</sub> from it</p>
</div>
</div>`
})