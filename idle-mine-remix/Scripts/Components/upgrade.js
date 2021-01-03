
Vue.component("upgrade",
    {
        props: ["upg"],
        methods:
            {
                canAfford()
                {
                    switch(this.upg.resource)
                    {
                        case RESOURCE_MONEY:
                            return game.money.gte(this.upg.currentPrice());
                        case RESOURCE_GEM:
                            return game.gems.gte(this.upg.currentPrice());
                        case RESOURCE_PC:
                            return game.planetCoins.gte(this.upg.currentPrice());
                        default:
                            return false;
                    }
                },
                highlight: function ()
                {
                    game.highlightedUpgrade = this.upg;
                },
                unHighlight: function ()
                {
                    game.highlightedUpgrade = null;
                },
                getLevelDisplay: function()
                {
                    return this.upg.maxLevel !== Infinity ? this.upg.level + "/" + this.upg.maxLevel : this.upg.level;
                },
                buyUpgrade()
                {

                    if(Utils.keyPressed("Control"))
                    {
                        this.upg.buy100();
                    }
                    else if(Utils.keyPressed("Shift"))
                    {
                        this.upg.buy10();
                    }
                    else
                    {
                        this.upg.buy();
                    }
                }
            },
        template: `<div :class="{cantafford: !canAfford() || upg.level === upg.maxLevel}" @mouseover="highlight();" @mouseleave="unHighlight();" @click="buyUpgrade();" class="upgrade">
            <img :src="'Images/' + upg.img"/> <br/> <span class="lvl" style="text-align: right; font-size: 110%;">{{getLevelDisplay()}}</span>
            </div>`
    });