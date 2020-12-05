Vue.component("upgrade", {
    props: ["upgrade"],
    methods:
        {
            formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
        },
    computed:
        {
            canAfford: function()
            {
                if(this.upgrade.level === this.upgrade.maxLevel)
                {
                    return true;
                }
                let v = this.upgrade.resource ? this.upgrade.resource.amount : game.rhoParticles;
                if(this.upgrade.constructor.name === "ThetaUpgrade")
                {
                    v = game.thetaEnergy;
                }
                return this.upgrade.currentPrice().lte(v);
            },
            isMaxed: function()
            {
                return this.upgrade.level >= this.upgrade.maxLevel;
            }
        },
    template: `<button :class="{maxed: isMaxed}" :disabled="!canAfford" @click="upgrade.buy()" class="upgrade">
<h4>{{upgrade.name}} <span v-if="upgrade.maxLevel !== Infinity">{{upgrade.level}} / {{upgrade.maxLevel}}</span></h4>
<p v-html="upgrade.desc"></p>
<p>{{upgrade.getEffectDisplay()}}</p>
<p v-html="upgrade.getPriceDisplay()"></p>
</button>`
});